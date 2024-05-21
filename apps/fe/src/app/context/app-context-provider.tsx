import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { noop, uniqueId } from 'lodash';
import axios from 'axios';
import type { TMessage, TRepository } from '@types';

export interface IAppContext {
  loading: boolean;
  credentials: string | null;
  repository: TRepository | null;
  messages: TMessage[];
  setCredentials: (credentials: string) => void;
  setRepository: (repository: TRepository) => void;
  addMessage: (message: TMessage) => Promise<void>;
  clearChat: () => void;
}

export const AppContext = createContext<IAppContext>({
  loading: false,
  credentials: null,
  repository: null,
  messages: [],
  setCredentials: noop,
  setRepository: noop,
  addMessage: () => Promise.resolve(),
  clearChat: noop,
});

const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [repository, _setRepository] = useState<TRepository | null>(null);
  const [credentials, setCredentials] = useLocalStorage<string | null>(
    'openai-api-key',
    null,
  );

  useLayoutEffect(() => {
    if (credentials) {
      axios.defaults.headers.common['openai-api-key'] = credentials;
    } else {
      delete axios.defaults.headers.common['openai-api-key'];
    }
  }, [credentials]);

  useEffect(() => {
    setMessages([]);
  }, [repository]);

  const addMessage = useCallback(
    async (message: TMessage) => {
      if (!repository) {
        console.error('invariant violation: no repository set');
        return;
      }

      setLoading(true);

      setMessages((prevMessages) => [...prevMessages, message]);

      try {
        const { data } = await axios.post<TMessage>('/chat', {
          repositoryId: repository.id,
          question: message.text,
        });

        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        // TODO: snackbar error message about invalid key (?)
        console.error('Error adding message:', error);
      } finally {
        setLoading(false);
      }
    },
    [repository],
  );

  const setRepository = useCallback((repository: TRepository) => {
    _setRepository(repository);
    setMessages([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        loading,
        credentials,
        repository,
        messages,
        setCredentials,
        setRepository,
        addMessage,
        clearChat: () => setMessages([]),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
