import { useContext } from 'react';
import { type IAppContext, AppContext } from './app-context-provider';

export const useAppContext = (): IAppContext => useContext(AppContext);
