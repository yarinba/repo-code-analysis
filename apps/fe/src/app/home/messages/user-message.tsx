import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type TMessage } from '@types';
import axios from 'axios';
import { useAppContext } from '../../context/use-app-context.hook';
import { useScrollIntoView } from './useScrollIntoView';

interface IProps {
  message: TMessage;
}

export function UserMessage({ message }: IProps) {
  const queryClient = useQueryClient();

  const { repository } = useAppContext();

  const { ref } = useScrollIntoView({ text: message.text });

  const { mutate: upvote } = useMutation({
    mutationKey: ['upvote', message.id],
    mutationFn: () =>
      axios.patch(`/prompts/upvote/${message.predefinedPromptId}`),
    onSuccess: () =>
      queryClient.refetchQueries({
        queryKey: ['prompt-suggestions', repository?.id],
      }),
  });

  const { mutate: downvote } = useMutation({
    mutationKey: ['downvote', message.id],
    mutationFn: () =>
      axios.patch(`/prompts/downvote/${message.predefinedPromptId}`),
    onSuccess: () =>
      queryClient.refetchQueries({
        queryKey: ['prompt-suggestions', repository?.id],
      }),
  });

  const { mutate: savePrompt } = useMutation({
    mutationKey: ['savePrompt', message.id],
    mutationFn: () =>
      axios.post('/prompts', {
        repositoryId: repository?.id,
        text: message.text,
      }),
    onSuccess: () =>
      queryClient.refetchQueries({
        queryKey: ['prompt-suggestions', repository?.id],
      }),
  });

  return (
    <>
      <div ref={ref} className="flex flex-row gap-4 px-2 py-4 sm:px-4">
        <div
          aria-details="user-avatar"
          className="relative h-10 w-10 shrink-0 scale-90 overflow-hidden rounded-full bg-gray-200 outline outline-offset-2 outline-gray-600 dark:bg-gray-600"
        >
          <svg
            className="absolute -left-1 h-12 w-12 text-gray-600 dark:text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>

        <div className="flex max-w-3xl items-center">
          <p>{message.text}</p>
        </div>
      </div>
      {message.predefinedPromptId ? (
        <div className="mb-2 flex w-full flex-row justify-end gap-x-2 text-slate-500">
          <button
            id="up-vote-btn"
            onClick={() => upvote()}
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
            onClick={() => downvote()}
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
      ) : (
        <div className="mb-2 flex w-full flex-row justify-end gap-x-2 text-slate-500">
          <button
            onClick={() => savePrompt()}
            className="inline-flex items-center rounded-lg px-3 py-2 text-center text-xs font-semibold text-blue-600 ring-1 ring-inset ring-blue-600 hover:bg-blue-600 hover:text-blue-50"
          >
            Save Prompt
          </button>
        </div>
      )}
    </>
  );
}
