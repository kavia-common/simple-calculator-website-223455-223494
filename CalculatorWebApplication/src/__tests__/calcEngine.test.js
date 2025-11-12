import { evaluateExpression } from '../utils/calcEngine';

describe('calcEngine - evaluateExpression', () => {
  test('simple addition', () => {
    expect(evaluateExpression('1 + 2')).toBe(3);
  });

  test('precedence multiplication over addition', () => {
    expect(evaluateExpression('1 + 2 * 3')).toBe(7);
    expect(evaluateExpression('2 * 3 + 1')).toBe(7);
  });

  test('subtraction and division', () => {
    expect(evaluateExpression('10 - 4 / 2')).toBe(8);
  });

  test('decimals', () => {
    expect(evaluateExpression('0.1 + 0.2')).toBeCloseTo(0.3, 10);
    expect(evaluateExpression('1.5 * 2')).toBe(3);
  });

  test('chaining multi-ops', () => {
    expect(evaluateExpression('5 + 5 - 3 * 2')).toBe(4);
  });

  test('division by zero throws', () => {
    expect(() => evaluateExpression('5 / 0')).toThrow();
  });

  test('invalid sequences', () => {
    expect(() => evaluateExpression('1 +')).toThrow();
    expect(() => evaluateExpression('+ 1')).toThrow();
    expect(() => evaluateExpression('1..2 + 3')).toThrow();
  });
});
