import React from 'react';
import ReactDOM from 'react-dom';
import { measure } from 'use-measure-perf';
import { App } from './App.tsx';
import './index.css';

measure('start');

ReactDOM.render(<App />, document.getElementById('root'));
