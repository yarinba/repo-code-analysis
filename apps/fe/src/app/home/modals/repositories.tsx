import { Fragment, useState } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import { Dialog, Transition } from '@headlessui/react';
import { useAppContext } from '../../context/use-app-context.hook';
import { useQuery } from '@tanstack/react-query';
import { type TRepository } from '@types';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const useFuzzyRepositories = () => {
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

export function RepositoriesModal({ open, onClose }: IProps) {
  const { searchInputProps, repositories } = useFuzzyRepositories();

  const { setRepository } = useAppContext();

  const onSelectRepository = (repo: TRepository) => {
    setRepository(repo);
    onClose();
  };

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10 " onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="h-[40rem] w-full max-w-5xl transform overflow-scroll rounded-2xl bg-slate-200 px-6 pt-6 pb-0 text-left align-middle shadow-xl transition-all dark:bg-slate-600 md:h-[30rem]">
                <div className="h-[calc(100%-4rem)] overflow-y-auto">
                  <Dialog.Description>
                    <div className="xs:grid-cols-1 grid  gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {repositories.map((repo) => (
                        <div
                          key={repo.id}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-6 shadow dark:border-slate-700 dark:bg-slate-800"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex">
                              <div className="ml-4 flex flex-col gap-y-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">
                                  {repo.name}
                                </h3>
                                <span className="text-xs text-slate-400">
                                  {repo.owner}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`rounded-full ${repo.status === 'DONE' ? 'bg-green-600/10 text-green-600' : 'bg-amber-600/20 text-amber-600'} px-2.5 py-1 text-xs font-semibold leading-5`}
                            >
                              {repo.status}
                            </span>
                          </div>
                          <button
                            className="mt-6 w-full rounded-lg border border-slate-300 p-4 text-center text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-blue-600 hover:text-slate-50 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
                            type="button"
                            onClick={() => onSelectRepository(repo)}
                            disabled={repo.status !== 'DONE'}
                          >
                            Select
                          </button>
                        </div>
                      ))}
                    </div>
                  </Dialog.Description>
                </div>
                <div className="sticky bottom-0 left-0 right-0 bg-slate-200 p-4 dark:bg-slate-600">
                  <input
                    {...searchInputProps}
                    type="text"
                    placeholder="Search repositories..."
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default RepositoriesModal;
