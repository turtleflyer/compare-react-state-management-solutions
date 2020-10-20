import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App.tsx';
import './index.css';
import { measure } from './perf-measure/useMeasurePerformance.ts';

measure('start');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
