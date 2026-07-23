import React from 'react';
import ReactDOM from 'react-dom/client';
import { Desktop } from './components/Desktop';
import './styles/glass.css';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Desktop />
  </React.StrictMode>,
);
