import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Keypad lays out calculator buttons and triggers appropriate callbacks.
 * Buttons use accessible labels and minimum touch sizes.
 */
function Keypad({
  onDigit,
  onDecimal,
  onOperator,
  onEquals,
  onClearAll,
  onClearEntry,
}) {
  const makeDigit = (d) => (
    <button
      type="button"
      className="btn"
      onClick={() => onDigit(d)}
      aria-label={`Digit ${d}`}
    >
      {d}
    </button>
  );

  const makeOperator = (symbol, op, label) => (
    <button
      type="button"
      className="btn btn-operator"
      onClick={() => onOperator(op)}
      aria-label={label || `Operator ${symbol}`}
    >
      {symbol}
    </button>
  );

  return (
    <div className="keypad" role="group" aria-label="Calculator keypad">
      {/* Row: C, ÷ */}
      <button
        type="button"
        className="btn btn-clear"
        onClick={onClearAll}
        aria-label="Clear all"
      >
        C
      </button>
      <button
        type="button"
        className="btn"
        onClick={onClearEntry}
        aria-label="Clear entry"
      >
        CE
      </button>
      {makeOperator('÷', '/', 'Divide')}
      {/* Row: 7 8 9 × */}
      {makeDigit('7')}
      {makeDigit('8')}
      {makeDigit('9')}
      {makeOperator('×', '*', 'Multiply')}
      {/* Row: 4 5 6 − */}
      {makeDigit('4')}
      {makeDigit('5')}
      {makeDigit('6')}
      {makeOperator('−', '-', 'Subtract')}
      {/* Row: 1 2 3 + */}
      {makeDigit('1')}
      {makeDigit('2')}
      {makeDigit('3')}
      {makeOperator('+', '+', 'Add')}
      {/* Row: 0 (wide) . = */}
      <button
        type="button"
        className="btn btn-wide"
        onClick={() => onDigit('0')}
        aria-label="Digit 0"
      >
        0
      </button>
      <button
        type="button"
        className="btn"
        onClick={onDecimal}
        aria-label="Decimal point"
      >
        .
      </button>
      <button
        type="button"
        className="btn btn-equals"
        onClick={onEquals}
        aria-label="Equals"
      >
        =
      </button>
    </div>
  );
}

export default Keypad;
