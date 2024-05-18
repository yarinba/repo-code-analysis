export function Suggestions() {
  return (
    <div className="mt-2 flex w-full gap-x-2 overflow-x-auto whitespace-nowrap text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
      <button className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
        Predefined prompt A<span className="p-1 opacity-60 sm:p-2">6</span>
      </button>
      <button className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
        Predefined prompt B<span className="p-1 opacity-60 sm:p-2">9</span>
      </button>
      <button className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
        Predefined prompt C<span className="p-1 opacity-60 sm:p-2">4</span>
      </button>
      <button className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
        Predefined prompt D<span className="p-1 opacity-60 sm:p-2">2</span>
      </button>
    </div>
  );
}

export default Suggestions;
