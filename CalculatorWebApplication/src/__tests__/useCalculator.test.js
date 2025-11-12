import { renderHook, act } from '@testing-library/react';
import useCalculator from '../hooks/useCalculator';

describe('useCalculator hook', () => {
  test('initial state', () => {
    const { result } = renderHook(() => useCalculator());
    expect(result.current.state.currentValue).toBe('0');
    expect(result.current.state.expression).toBe('');
  });

  test('input digits builds number', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.inputDigit('1'));
    act(() => result.current.inputDigit('2'));
    expect(result.current.state.currentValue).toBe('12');
  });

  test('decimal input', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.inputDecimal());
    act(() => result.current.inputDigit('5'));
    expect(result.current.state.currentValue).toBe('0.5');
  });

  test('choose operator and evaluate', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.inputDigit('7'));
    act(() => result.current.chooseOperator('+'));
    act(() => result.current.inputDigit('3'));
    act(() => result.current.evaluate());
    expect(result.current.state.currentValue).toBe('10');
    expect(result.current.state.expression).toBe('');
    expect(result.current.state.justEvaluated).toBe(true);
  });

  test('clear entry and clear all', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.inputDigit('9'));
    act(() => result.current.clearEntry());
    expect(result.current.state.currentValue).toBe('0');
    act(() => result.current.inputDigit('8'));
    act(() => result.current.chooseOperator('*'));
    act(() => result.current.clearAll());
    expect(result.current.state.currentValue).toBe('0');
    expect(result.current.state.expression).toBe('');
  });

  test('division by zero sets error and recover with clear', () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.inputDigit('5'));
    act(() => result.current.chooseOperator('/'));
    act(() => result.current.inputDigit('0'));
    act(() => result.current.evaluate());
    expect(result.current.state.isError).toBe(true);
    act(() => result.current.clearAll());
    expect(result.current.state.isError).toBe(false);
    expect(result.current.state.currentValue).toBe('0');
  });

  test('keyboard handling digits, operator, equals', () => {
    const { result } = renderHook(() => useCalculator());
    const key = (k) => act(() => result.current.handleKeyDown({ key: k, preventDefault: () => {} }));
    key('2');
    key('+');
    key('3');
    key('Enter');
    expect(result.current.state.currentValue).toBe('5');
  });

  test('backspace behavior', () => {
    const { result } = renderHook(() => useCalculator());
    const key = (k) => act(() => result.current.handleKeyDown({ key: k, preventDefault: () => {} }));
    key('1');
    key('2');
    key('3');
    key('Backspace');
    expect(result.current.state.currentValue).toBe('12');
    key('Backspace');
    key('Backspace');
    expect(result.current.state.currentValue).toBe('0');
  });
});
