import { type TMessage } from '@types';

interface IProps {
  message: TMessage;
}

export function AIMessage({ message }: IProps) {
  return (
    <div className="mb-4 flex rounded-xl bg-slate-50 px-2 py-6 dark:bg-slate-900 sm:px-4">
      <img
        alt="AI avatar"
        className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
        src="https://dummyimage.com/256x256/354ea1/ffffff&text=AI"
      />

      <div className="flex max-w-3xl items-center rounded-xl">
        <p>{message.text}</p>
      </div>
    </div>
  );
}
