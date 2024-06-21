import { useLayoutEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useLocalStorage } from 'usehooks-ts';
import axios from 'axios';

type UseCredentialsProps = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const useCredentials = ({
  onSuccess,
  onError,
}: UseCredentialsProps = {}) => {
  const [credentials, setCredentials, removeCredentials] = useLocalStorage<
    string | null
  >('openai-api-key', null);

  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    if (credentials) {
      axios.defaults.headers.common['openai-api-key'] = credentials;
    }

    return () => {
      delete axios.defaults.headers.common['openai-api-key'];
    };
  }, [credentials]);

  const handleUpdateCredentials = async (newCredentials: string) => {
    setLoading(true);

    try {
      await axios.post('/validate-api-key', null, {
        headers: { 'openai-api-key': newCredentials },
      });

      axios.defaults.headers.common['openai-api-key'] = newCredentials;

      setCredentials(newCredentials);

      enqueueSnackbar('OpenAI API key saved', { variant: 'success' });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      delete axios.defaults.headers.common['openai-api-key'];

      removeCredentials();

      enqueueSnackbar('Invalid OpenAI API key', { variant: 'error' });

      if (onError) {
        onError();
      }
    } finally {
      setLoading(false);
    }
  };

  return [credentials, { handleUpdateCredentials, loading }] as const;
};
