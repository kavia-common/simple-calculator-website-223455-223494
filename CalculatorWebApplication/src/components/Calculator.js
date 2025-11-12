import React, { useEffect } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import useCalculator from '../hooks/useCalculator';

/**
 * PUBLIC_INTERFACE
 * Calculator component composes Display and Keypad, handles user interactions,
 * and listens for keyboard input at the document level.
 */
function Calculator() {
  const {
    state,
    inputDigit,
    inputDecimal,
    chooseOperator,
    evaluate,
    clearAll,
    clearEntry,
    handleKeyDown,
  } = useCalculator();

  useEffect(() => {
    const onKeyDown = (e) => handleKeyDown(e);
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="calculator" role="application" aria-label="Simple Calculator">
      <Display
        expression={state.expression}
        value={state.currentValue}
        isError={state.isError}
      />
      <Keypad
        onDigit={inputDigit}
        onDecimal={inputDecimal}
        onOperator={chooseOperator}
        onEquals={evaluate}
        onClearAll={clearAll}
        onClearEntry={clearEntry}
      />
    </div>
  );
}

export default Calculator;
