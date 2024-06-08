import {
  type FC,
  type PropsWithChildren,
  createContext,
  useCallback,
  useState,
} from 'react';
import { noop, uniqueId } from 'lodash';
import type { TMessage, TRepository } from '@types';
import { API_URL } from '../../main';
import { useCredentials } from '../hooks/useCredentials';

export interface IAppContext {
  loadingMessage: string | null;
  repository: TRepository | null;
  messages: TMessage[];
  setRepository: (repository: TRepository) => void;
  addMessage: (message: TMessage) => Promise<void>;
  clearChat: () => void;
}

export const AppContext = createContext<IAppContext>({
  loadingMessage: null,
  repository: null,
  messages: [],
  setRepository: noop,
  addMessage: () => Promise.resolve(),
  clearChat: noop,
});

const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  // the id of the message that is currently being loaded
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [repository, _setRepository] = useState<TRepository | null>(null);

  const [credentials] = useCredentials();

  const addMessage = useCallback(
    async (message: TMessage) => {
      if (!repository) {
        console.error('invariant violation: no repository set');
        return;
      }

      const initialAIMessage: TMessage = {
        id: uniqueId(),
        text: '',
        actor: 'ai',
      };

      setLoadingMessage(initialAIMessage.id);

      setMessages((prevMessages) => [...prevMessages, message]);

      try {
        // init empty ai message
        setMessages((prevMessages) => [...prevMessages, initialAIMessage]);

        const response = await fetch(`${API_URL}/chat`, {
          method: 'post',
          headers: {
            Accept: 'application/json, text/plain, */*', // indicates which files we are able to understand
            'Content-Type': 'application/json', // indicates what the server actually sent
            'openai-api-key': credentials || '',
          },
          body: JSON.stringify({
            repositoryId: repository.id,
            question: message.text,
          }),
        });
        if (!response.ok || !response.body) {
          throw response.statusText;
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        const loopRunner = true;

        while (loopRunner) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          const decodedChunk = decoder.decode(value, { stream: true });

          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];

            return [
              ...prevMessages.slice(0, -1),
              { ...lastMessage, text: lastMessage.text + decodedChunk },
            ];
          });
        }
      } catch (error) {
        // TODO: snackbar error message about invalid key (?)
        console.error('Error adding message:', error);
      } finally {
        setLoadingMessage(null);
      }
    },
    [credentials, repository],
  );

  const setRepository = useCallback((repository: TRepository) => {
    _setRepository(repository);
    setMessages([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        loadingMessage,
        repository,
        messages,
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
