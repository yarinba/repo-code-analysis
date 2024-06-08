import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { useCredentials } from '../../../hooks/useCredentials';
import { Spinner } from '../../../components';

interface IProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: IProps) {
  const [inputValue, setInputValue] = useState('');

  const [, { handleUpdateCredentials, loading }] = useCredentials({
    onSuccess: onClose,
    onError: () => setInputValue(''),
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await handleUpdateCredentials(inputValue);
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-200 p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-600">
                <div className="flex items-center justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-slate-900 dark:text-slate-200"
                  >
                    Settings
                  </Dialog.Title>
                  {loading && <Spinner />}
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Enter your new OpenAI API key to enable AI-powered exploration
                  and analysis of repositories.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="OpenAI API Key"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-sm text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                    <p
                      id="openai-api-key-description"
                      className="mt-2 text-xs text-gray-500"
                    >
                      You can find your OpenAI API key in your{' '}
                      <a
                        href="https://platform.openai.com/account/api-keys"
                        className="text-blue-500 hover:underline"
                      >
                        OpenAI account settings
                      </a>
                      .
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={inputValue.length === 0 || loading}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default SettingsDialog;
