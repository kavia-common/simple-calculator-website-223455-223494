import React, { useState, useEffect } from 'react';
import './App.css';
import Calculator from './components/Calculator';

// PUBLIC_INTERFACE
function App() {
  /**
   * Root App component managing theme and rendering the Calculator.
   * Preserves the theme toggle behavior and applies the data-theme attribute on documentElement.
   */
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle light/dark theme */
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <div className="calculator-wrapper">
          <Calculator />
        </div>
      </header>
    </div>
  );
}

export default App;
