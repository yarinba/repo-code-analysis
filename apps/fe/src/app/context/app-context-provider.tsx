import {
  FC,
  PropsWithChildren,
  createContext,
  useLayoutEffect,
  useState,
} from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { noop } from 'lodash';
import axios from 'axios';
import { type TRepository } from '@types';

export interface IAppContext {
  credentials: string | null;
  repository: TRepository | null;
  setCredentials: (credentials: string) => void;
  setRepository: (repository: TRepository) => void;
}

export const AppContext = createContext<IAppContext>({
  credentials: null,
  repository: null,
  setCredentials: noop,
  setRepository: noop,
});

const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  // TODO: might need to use repository type - at the moment it will be the name of the repository
  const [repository, setRepository] = useState<TRepository | null>(null);
  const [credentials, setCredentials] = useLocalStorage<string | null>(
    'openai-api-key',
    null,
  );

  useLayoutEffect(() => {
    if (credentials) {
      console.log('setting credentials');
      axios.defaults.headers.common['openai-api-key'] = credentials;
    } else {
      delete axios.defaults.headers.common['openai-api-key'];
    }
  }, [credentials]);

  return (
    <AppContext.Provider
      value={{ credentials, repository, setCredentials, setRepository }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
