import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { SnackbarProvider } from 'notistack';

import AppContextProvider from './app/context/app-context-provider';
import App from './app/app';

import './index.css';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools /> */}
      <SnackbarProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  </StrictMode>,
);
