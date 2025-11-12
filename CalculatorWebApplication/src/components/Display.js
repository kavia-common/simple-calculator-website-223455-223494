import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Display component shows the current expression and the evaluated/current value.
 * It uses aria-live="polite" to announce updates and applies error styling when needed.
 */
function Display({ expression, value, isError }) {
  return (
    <div className={`display ${isError ? 'error' : ''}`}>
      <div className="expression" aria-label="expression">
        {expression}
      </div>
      <div className="value" aria-live="polite" aria-atomic="true">
        {value}
      </div>
    </div>
  );
}

export default Display;
