import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import AppContextProvider from './app/context/app-context-provider';
import App from './app/app';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </StrictMode>,
);
