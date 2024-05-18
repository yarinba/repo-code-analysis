import { AIMessage } from './ai-message';
import { UserMessage } from './user-message';

const messages = [
  { id: 1, text: 'Hello, how can I help you?', type: 'ai' },
  {
    id: 2,
    text: 'What are three great applications of quantum computing?',
    type: 'user',
  },
];
export function Messages() {
  return (
    <div className="flex-1 overflow-y-auto rounded-xl border-2 border-slate-200 bg-slate-200 p-4 text-sm leading-6 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 sm:text-base sm:leading-7">
      {messages.map((message) => {
        if (message.type === 'ai') {
          return (
            <AIMessage key={message.id} id={message.id} text={message.text} />
          );
        } else {
          return (
            <UserMessage key={message.id} id={message.id} text={message.text} />
          );
        }
      })}
    </div>
  );
}

export default Messages;
