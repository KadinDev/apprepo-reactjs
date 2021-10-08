import React from 'react';

import { Routes } from './routes';
import GlobalStyle from './pages/styles/global';

export default function App() {
  return (
    <div className="App">
      <>
        <GlobalStyle/>
        <Routes />
      </>      
    </div>
  );
}

