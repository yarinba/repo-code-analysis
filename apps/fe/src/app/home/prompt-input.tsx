import { useState } from 'react';
import { useAppContext } from '../context/use-app-context.hook';

export function PromptInput() {
  const [prompt, setPrompt] = useState('');

  const { repository, loading, addUserMessage } = useAppContext();

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (disabled) return;

    await addUserMessage(prompt);

    setPrompt('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const disabled = !prompt || !repository || loading;

  return (
    <form className="mt-2" onSubmit={handleSubmit}>
      <label htmlFor="chat-input" className="sr-only">
        Enter your prompt
      </label>
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          id="chat-input"
          className="block w-full resize-none rounded-xl border-none bg-slate-200 p-4 pr-24 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500 sm:text-base"
          placeholder="Enter your prompt"
          rows={1}
          required
        />
        <button
          type="submit"
          disabled={disabled}
          className="absolute bottom-2 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:text-base"
        >
          Send <span className="sr-only">Send message</span>
        </button>
      </div>
    </form>
  );
}

export default PromptInput;
