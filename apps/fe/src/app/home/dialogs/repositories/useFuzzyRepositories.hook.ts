import { useState } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import { useQuery } from '@tanstack/react-query';
import { type TRepository } from '@types';

export const useFuzzyRepositories = () => {
  const [search, setSearch] = useState('');

  const { data = [] } = useQuery<TRepository[]>({
    queryKey: ['repositories'],
    queryFn: () => axios.get('/repositories').then((res) => res.data),
  });

  const fusedRepositories = new Fuse(data ?? [], {
    keys: ['name', 'owner', 'url'],
    threshold: 0.2,
    minMatchCharLength: 1,
  })
    .search(search)
    .map((result) => result.item);

  return {
    searchInputProps: {
      value: search,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setSearch(e.target.value),
    },
    repositories: search.length === 0 ? data : fusedRepositories,
  };
};
