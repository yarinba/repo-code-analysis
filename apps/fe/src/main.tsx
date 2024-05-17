import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppContextProvider from './app/context/app-context-provider';
import App from './app/app';

import './index.css';

axios.defaults.baseURL = 'http://localhost:3000/api';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </QueryClientProvider>
  </StrictMode>,
);
