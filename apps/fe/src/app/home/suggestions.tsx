export function Suggestions() {
  return (
    <div className="mt-2 flex w-full gap-x-2 overflow-x-auto whitespace-nowrap text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
      <button className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
        Article Writing<span className="p-1 opacity-60 sm:p-2">21</span>
      </button>
      <button className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
        Code Debugging<span className="p-1 opacity-60 sm:p-2">14</span>
      </button>
      <button className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
        Grammar<span className="p-1 opacity-60 sm:p-2">4</span>
      </button>
      <button className="rounded-lg bg-slate-200 p-2 hover:bg-blue-600 hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-blue-600 dark:hover:text-slate-50">
        Twitter threads<span className="p-1 opacity-60 sm:p-2">12</span>
      </button>
    </div>
  );
}

export default Suggestions;
