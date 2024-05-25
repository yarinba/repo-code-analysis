import { type TMessage } from '@types';
import { useScrollIntoView } from './useScrollIntoView';
import { useAppContext } from '../../context/use-app-context.hook';
import Loader from '../../components/loader';

interface IProps {
  message: TMessage;
}

export function AIMessage({ message }: IProps) {
  const { loadingMessage } = useAppContext();
  const { ref } = useScrollIntoView({ text: message.text });

  return (
    <div
      ref={ref}
      className="mb-4 flex gap-4 rounded-xl bg-slate-50 px-2 py-6 dark:bg-slate-900 sm:px-4"
    >
      <div
        aria-details="ai-avatar"
        className="relative inline-flex h-10 w-10 shrink-0 scale-90 items-center justify-center overflow-hidden rounded-full bg-gray-200 outline outline-offset-2 outline-gray-600 dark:bg-gray-600"
      >
        {loadingMessage === message.id ? (
          <Loader />
        ) : (
          <span className="font-medium text-gray-600 dark:text-gray-300">
            AI
          </span>
        )}
      </div>

      <div className="flex max-w-3xl items-center justify-between rounded-xl">
        <p>{message.text}</p>
      </div>
    </div>
  );
}
