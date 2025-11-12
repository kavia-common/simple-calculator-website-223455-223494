const OPS = {
  '+': { prec: 1, assoc: 'L', fn: (a, b) => a + b },
  '-': { prec: 1, assoc: 'L', fn: (a, b) => a - b },
  '*': { prec: 2, assoc: 'L', fn: (a, b) => a * b },
  '/': { prec: 2, assoc: 'L', fn: (a, b) => {
    if (b === 0) {
      const err = new Error('Division by zero');
      err.code = 'DIV_ZERO';
      throw err;
    }
    return a / b;
  } },
};

/**
 * Tokenizes an expression string "12 + 3 * 4" -> ["12","+","3","*","4"]
 */
function tokenize(expr) {
  const tokens = [];
  let num = '';
  for (let i = 0; i < expr.length; i += 1) {
    const ch = expr[i];
    if ('0123456789.'.includes(ch)) {
      num += ch;
    } else if ('+-*/'.includes(ch)) {
      if (num) {
        tokens.push(num);
        num = '';
      }
      tokens.push(ch);
    } else if (ch === ' ') {
      // skip
    } else {
      throw new Error(`Invalid character: ${ch}`);
    }
  }
  if (num) tokens.push(num);
  return tokens;
}

/**
 * Convert infix tokens to RPN using shunting-yard.
 */
function toRPN(tokens) {
  const output = [];
  const stack = [];
  tokens.forEach((t) => {
    if (!Number.isNaN(Number(t))) {
      output.push(t);
    } else if (OPS[t]) {
      const o1 = OPS[t];
      while (stack.length) {
        const top = stack[stack.length - 1];
        const o2 = OPS[top];
        if (!o2) break;
        const cond =
          (o1.assoc === 'L' && o1.prec <= o2.prec) ||
          (o1.assoc === 'R' && o1.prec < o2.prec);
        if (cond) {
          output.push(stack.pop());
        } else {
          break;
        }
      }
      stack.push(t);
    } else {
      throw new Error(`Invalid token: ${t}`);
    }
  });
  while (stack.length) {
    const s = stack.pop();
    if (!OPS[s]) throw new Error('Mismatched operators');
    output.push(s);
  }
  return output;
}

/**
 * Evaluate RPN tokens to a numeric result.
 */
function evalRPN(tokens) {
  const stack = [];
  tokens.forEach((t) => {
    if (OPS[t]) {
      if (stack.length < 2) throw new Error('Invalid expression');
      const b = stack.pop();
      const a = stack.pop();
      const res = OPS[t].fn(a, b);
      stack.push(res);
    } else {
      const n = Number(t);
      if (Number.isNaN(n)) throw new Error(`Invalid number: ${t}`);
      stack.push(n);
    }
  });
  if (stack.length !== 1) throw new Error('Invalid evaluation result');
  return stack[0];
}

/**
 * PUBLIC_INTERFACE
 * Evaluate an infix expression string with + - * / and decimals.
 * Throws an Error for invalid inputs or division by zero.
 */
export function evaluateExpression(expression) {
  const tokens = tokenize(expression);
  const rpn = toRPN(tokens);
  const result = evalRPN(rpn);
  return result;
}
