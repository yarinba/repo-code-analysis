import { FC, PropsWithChildren, createContext, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { noop } from 'lodash';

export interface IAppContext {
  credentials: string | null;
  repository: string | null;
  setCredentials: (credentials: string) => void;
  setRepository: (repository: string) => void;
}

export const AppContext = createContext<IAppContext>({
  credentials: null,
  repository: null,
  setCredentials: noop,
  setRepository: noop,
});

const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  // TODO: might need to use repository type - at the moment it will be the name of the repository
  const [repository, setRepository] = useState<string | null>(null);
  const [credentials, setCredentials] = useLocalStorage<string | null>(
    'openai-api-key',
    null,
  );

  return (
    <AppContext.Provider
      value={{ credentials, repository, setCredentials, setRepository }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
