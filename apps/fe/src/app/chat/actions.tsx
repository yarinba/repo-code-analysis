import { useState } from 'react';
import { useAppContext } from '../context/use-app-context.hook';
import RepositoriesModal from './modals/repositories';

export function Actions() {
  const { repository } = useAppContext();

  const [isRepositoriesModalOpen, setIsRepositoriesModalOpen] = useState(false);

  return (
    <div className="flex gap-2 py-2">
      <button
        className="flex grow items-center gap-x-2 rounded-lg px-3.5 py-2.5 text-center text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-600 hover:bg-blue-600 hover:text-blue-50"
        onClick={() => setIsRepositoriesModalOpen(true)}
      >
        <span
          className={`flex h-1 w-1 items-center justify-center rounded-full ${repository ? 'bg-green-500' : 'bg-red-500'}`}
        />
        {repository ? repository : 'Choose Repository'}
      </button>

      <RepositoriesModal
        open={isRepositoriesModalOpen}
        onClose={() => setIsRepositoriesModalOpen(false)}
      />

      <button className="flex items-center gap-x-2 rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-600 hover:bg-blue-600 hover:text-blue-50 md:w-40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z"></path>
          <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
        </svg>
        <span className="hidden md:block">Settings</span>
      </button>
      <button className="flex items-center gap-x-2 rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-600 hover:bg-blue-600 hover:text-blue-50 md:w-40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M12 5l0 14"></path>
          <path d="M5 12l14 0"></path>
        </svg>
        <span className="hidden md:block">New Chat</span>
      </button>
    </div>
  );
}

export default Actions;
