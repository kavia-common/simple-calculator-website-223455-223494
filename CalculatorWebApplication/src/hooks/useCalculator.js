import { useCallback, useMemo, useState } from 'react';
import { evaluateExpression } from '../utils/calcEngine';
import { formatNumber } from '../utils/format';

const initialState = {
  currentValue: '0',
  expression: '',
  isError: false,
  justEvaluated: false,
  lastOperator: null,
  lastOperand: null,
};

/**
 * PUBLIC_INTERFACE
 * Hook managing calculator state and behavior.
 * Provides actions to input digits/decimal, choose operators, evaluate, clear, and handle keyboard events.
 */
export default function useCalculator() {
  const [state, setState] = useState(initialState);

  const resetErrorIfNeeded = useCallback(() => {
    setState((s) => (s.isError ? { ...initialState } : s));
  }, []);

  const inputDigit = useCallback((digit) => {
    setState((s) => {
      if (s.isError) return { ...initialState, currentValue: digit };
      if (s.justEvaluated) {
        // Start a new number
        return {
          ...initialState,
          currentValue: digit,
        };
      }
      if (s.currentValue === '0') {
        return { ...s, currentValue: digit };
      }
      return { ...s, currentValue: s.currentValue + digit };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState((s) => {
      if (s.isError) return { ...initialState, currentValue: '0.' };
      if (s.justEvaluated) {
        return { ...initialState, currentValue: '0.' };
      }
      if (s.currentValue.includes('.')) return s;
      return { ...s, currentValue: `${s.currentValue || '0'}.` };
    });
  }, []);

  const chooseOperator = useCallback((op) => {
    setState((s) => {
      if (s.isError) return s;

      // If we just evaluated, continue with result
      if (s.justEvaluated) {
        return {
          ...s,
          expression: `${s.currentValue} ${op} `,
          lastOperator: op,
          lastOperand: null,
          justEvaluated: false,
        };
      }

      if (!s.expression) {
        // Start new expression
        return {
          ...s,
          expression: `${s.currentValue} ${op} `,
          lastOperator: op,
          lastOperand: s.currentValue,
          currentValue: '0',
        };
      }

      // If expression ends with operator, replace it
      const trimmed = s.expression.trimEnd();
      if (/[+\-*/]$/.test(trimmed)) {
        const replaced = trimmed.replace(/[+\-*/]$/, op) + ' ';
        return { ...s, expression: replaced, lastOperator: op };
      }

      // Append current value then operator
      return {
        ...s,
        expression: `${s.expression}${s.currentValue} ${op} `,
        lastOperator: op,
        lastOperand: s.currentValue,
        currentValue: '0',
      };
    });
  }, []);

  const evaluate = useCallback(() => {
    setState((s) => {
      if (s.isError) return s;

      try {
        let expr = s.expression;
        let lastOperand = s.lastOperand;

        if (s.justEvaluated && s.lastOperator && s.lastOperand != null) {
          // Repeat last operation: value op lastOperand
          expr = `${s.currentValue} ${s.lastOperator} ${s.lastOperand}`;
        } else {
          // Complete expression with current value if needed
          if (!expr) {
            // No expression: evaluate currentValue as is
            const val = formatNumber(Number(s.currentValue));
            return {
              ...s,
              currentValue: val,
              expression: '',
              justEvaluated: true,
              lastOperand: s.currentValue,
            };
          }
          const trimmed = expr.trimEnd();
          if (/[+\-*/]$/.test(trimmed)) {
            expr = `${trimmed} ${s.currentValue}`;
          } else {
            expr = `${expr}${s.currentValue}`;
          }
          lastOperand = s.currentValue;
        }

        const raw = evaluateExpression(expr);
        const formatted = formatNumber(raw);
        return {
          ...s,
          currentValue: formatted,
          expression: '',
          isError: false,
          justEvaluated: true,
          lastOperator: s.lastOperator || (expr.match(/[+\-*/]/g) || [null]).pop(),
          lastOperand,
        };
      } catch (e) {
        return {
          ...s,
          isError: true,
          currentValue: e?.code === 'DIV_ZERO' ? 'Error: ÷0' : 'Error',
          justEvaluated: false,
        };
      }
    });
  }, []);

  const clearAll = useCallback(() => setState({ ...initialState }), []);
  const clearEntry = useCallback(
    () =>
      setState((s) => {
        if (s.isError) return { ...initialState };
        if (s.justEvaluated) return { ...initialState };
        return { ...s, currentValue: '0' };
      }),
    []
  );

  const handleKeyDown = useCallback(
    (e) => {
      const { key } = e;
      if (key >= '0' && key <= '9') {
        e.preventDefault();
        inputDigit(key);
        return;
      }
      if (key === '.' || key === ',') {
        e.preventDefault();
        inputDecimal();
        return;
      }
      if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault();
        chooseOperator(key);
        return;
      }
      if (key === 'Enter' || key === '=') {
        e.preventDefault();
        evaluate();
        return;
      }
      if (key === 'Escape') {
        e.preventDefault();
        clearAll();
        return;
      }
      if (key === 'Backspace') {
        e.preventDefault();
        // CE behavior: remove last char or reset to 0
        setState((s) => {
          if (s.isError) return { ...initialState };
          if (s.justEvaluated) return { ...initialState };
          const next =
            s.currentValue.length > 1
              ? s.currentValue.slice(0, -1)
              : '0';
          return { ...s, currentValue: next };
        });
      }
    },
    [inputDigit, inputDecimal, chooseOperator, evaluate, clearAll]
  );

  const api = useMemo(
    () => ({
      state,
      inputDigit,
      inputDecimal,
      chooseOperator,
      evaluate,
      clearAll,
      clearEntry,
      handleKeyDown,
      resetErrorIfNeeded,
    }),
    [
      state,
      inputDigit,
      inputDecimal,
      chooseOperator,
      evaluate,
      clearAll,
      clearEntry,
      handleKeyDown,
      resetErrorIfNeeded,
    ]
  );

  return api;
}
