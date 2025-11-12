const MAX_DECIMALS = 10;

/**
 * Round a number to avoid floating point artifacts, then strip trailing zeros.
 */
function roundNumber(n, decimals = MAX_DECIMALS) {
  const factor = Math.pow(10, decimals);
  return Math.round((n + Number.EPSILON) * factor) / factor;
}

/**
 * PUBLIC_INTERFACE
 * Formats a number safely, removing trailing zeros and unnecessary decimal point.
 */
export function formatNumber(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return String(n);
  const rounded = roundNumber(n);
  let s = rounded.toFixed(MAX_DECIMALS);
  // strip trailing zeros
  s = s.replace(/\.?0+$/, '');
  return s;
}
