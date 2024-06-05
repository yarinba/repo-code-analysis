import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useScanRepository = () => {
  const [newRepositoryURL, setNewRepositoryURL] = useState('');

  const queryClient = useQueryClient();

  const { mutate: scan, isPending } = useMutation({
    mutationKey: ['scan'],
    mutationFn: (repositoryURL: string) =>
      axios.post('/repositories', { repositoryURL }),
    onSuccess: () => queryClient.refetchQueries({ queryKey: ['repositories'] }),
  });

  return {
    scanInputProps: {
      value: newRepositoryURL,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setNewRepositoryURL(e.target.value),
    },
    scanButtonProps: {
      onClick: () => {
        scan(newRepositoryURL);
        setNewRepositoryURL('');
      },
      disabled: isPending,
    },
  };
};
