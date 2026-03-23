import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// src/index.js
// import { createRoot } from 'react-dom/client';
// import App from './App'; // Single import
// import './index.css';

// const rootElement = document.getElementById('root');
// if (!rootElement) throw new Error('Root element not found');
// const root = createRoot(rootElement);
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );