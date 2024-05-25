import { useQuery } from '@tanstack/react-query';
import { type TPrompt } from '@types';
import { useAppContext } from '../context/use-app-context.hook';
import axios from 'axios';
import { uniqueId } from 'lodash';

export function Suggestions() {
  const { repository, loadingMessage, addMessage } = useAppContext();

  const { data: prompts } = useQuery<TPrompt[]>({
    queryKey: ['prompt-suggestions', repository?.id],
    queryFn: () =>
      axios
        .get('/prompts', { params: { repositoryId: repository?.id } })
        .then((res) => res.data),
    enabled: !!repository,
  });

  if (!repository) return null;

  return (
    <div className="mt-2 flex w-full gap-x-2 overflow-x-auto whitespace-nowrap text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
      {prompts?.map((prompt) => (
        <button
          key={prompt.id}
          onClick={() =>
            addMessage({
              id: uniqueId(),
              text: prompt.text,
              actor: 'user',
              predefinedPromptId: prompt.id,
            })
          }
          disabled={Boolean(loadingMessage)}
          className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50"
        >
          {prompt.text}
          <span className="p-1 opacity-60 sm:p-2">{prompt.score}</span>
        </button>
      ))}
    </div>
  );
}

export default Suggestions;
