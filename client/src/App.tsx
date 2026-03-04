import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Calendar from './components/Calendar';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: #f9fafb;
    color: #111827;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }
`;

const App: React.FC = () => (
  <>
    <GlobalStyle />
    <Calendar />
  </>
);

export default App;
