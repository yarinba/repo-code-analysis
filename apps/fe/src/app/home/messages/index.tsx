import { AIMessage } from './ai-message';
import { UserMessage } from './user-message';
import { useAppContext } from '../../context/use-app-context.hook';

export function Messages() {
  const { messages } = useAppContext();

  return (
    <div className="flex-1 overflow-y-auto rounded-xl border-2 border-slate-200 bg-slate-200 p-4 text-sm leading-6 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 sm:text-base sm:leading-7">
      {messages.map((message) => {
        if (message.actor === 'ai') {
          return <AIMessage key={message.id} message={message} />;
        } else {
          return <UserMessage key={message.id} message={message} />;
        }
      })}
    </div>
  );
}

export default Messages;
