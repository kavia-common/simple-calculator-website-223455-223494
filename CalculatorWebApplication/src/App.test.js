import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

function clickByLabel(label) {
  fireEvent.click(screen.getByRole('button', { name: label }));
}

function expectDisplay(value) {
  expect(screen.getByText((_, node) => node?.classList.contains('value'))).toHaveTextContent(value);
}

test('performs 1 + 2 = 3', () => {
  render(<App />);
  clickByLabel('Digit 1');
  clickByLabel('Add');
  clickByLabel('Digit 2');
  clickByLabel('Equals');
  expectDisplay('3');
});

test('division by zero shows error', () => {
  render(<App />);
  clickByLabel('Digit 5');
  clickByLabel('Divide');
  clickByLabel('Digit 0');
  clickByLabel('Equals');
  const value = screen.getByText((_, node) => node?.classList.contains('value'));
  expect(value).toHaveTextContent(/Error/);
});

test('floating rounding: 0.1 + 0.2 ≈ 0.3', () => {
  render(<App />);
  clickByLabel('Digit 0');
  clickByLabel('Decimal point');
  clickByLabel('Digit 1');
  clickByLabel('Add');
  clickByLabel('Digit 0');
  clickByLabel('Decimal point');
  clickByLabel('Digit 2');
  clickByLabel('Equals');
  expectDisplay('0.3');
});

test('theme toggle still works', () => {
  render(<App />);
  const toggle = screen.getByRole('button', { name: /Switch to dark mode/i });
  fireEvent.click(toggle);
  // aria-label should switch after toggle
  expect(
    screen.getByRole('button', { name: /Switch to light mode/i })
  ).toBeInTheDocument();

  // Document should have data-theme="dark"
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});
