import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { StageContextProvider } from './store/stage-context';

ReactDOM.render(
  <StageContextProvider>
    <App />
  </StageContextProvider>,
  document.getElementById('root')
);
