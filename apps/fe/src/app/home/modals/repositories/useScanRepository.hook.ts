import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { GITHUB_URL_REGEX } from '@utils';

export const useScanRepository = () => {
  const [repositoryURL, setRepositoryURL] = useState('');

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate: scan, isPending } = useMutation({
    mutationKey: ['scan'],
    mutationFn: (repositoryURL: string) =>
      axios.post('/repositories', { repositoryURL }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ['repositories'] }),
  });

  return {
    scanInputProps: {
      value: repositoryURL,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setRepositoryURL(e.target.value),
    },
    scanButtonProps: {
      onClick: () => {
        if (!repositoryURL.match(GITHUB_URL_REGEX)) {
          enqueueSnackbar('Invalid repository URL', { variant: 'error' });

          return;
        }

        scan(repositoryURL);
        setRepositoryURL('');
      },
      disabled: !repositoryURL || isPending,
    },
  };
};
