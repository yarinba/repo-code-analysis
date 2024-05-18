import { type TMessage } from '@types';

interface IProps {
  message: TMessage;
}

export function UserMessage({ message }: IProps) {
  const onUpVote = () => console.log('up vote message' + message.id);

  const onDownVote = () => console.log('down vote message' + message.id);

  return (
    <>
      <div className="flex flex-row px-2 py-4 sm:px-4">
        <img
          alt="user avatar"
          className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
          src="https://dummyimage.com/256x256/363536/ffffff&text=U"
        />

        <div className="flex max-w-3xl items-center">
          <p>{message.text}</p>
        </div>
      </div>
      <div className="mb-2 flex w-full flex-row justify-end gap-x-2 text-slate-500">
        <button
          id="up-vote-btn"
          onClick={onUpVote}
          className="hover:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"></path>
          </svg>
        </button>
        <button
          id="down-vote-btn"
          onClick={onDownVote}
          className="hover:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3"></path>
          </svg>
        </button>
      </div>
    </>
  );
}
