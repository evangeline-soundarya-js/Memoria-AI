
import React, { useState, useEffect } from 'react';

interface ContentInputProps {
  onAction: (input: string) => void;
  isLoading: boolean;
  mode: 'add' | 'search';
}

const ContentInput: React.FC<ContentInputProps> = ({ onAction, isLoading, mode }) => {
  const [input, setInput] = useState('');

  useEffect(() => {
    if (mode === 'add') setInput('');
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onAction(input);
      if (mode === 'add') {
        setInput('');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (mode === 'search') {
      onAction(val);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mb-12">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-colors group-focus-within:text-indigo-500">
          {mode === 'add' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder={mode === 'add' ? "Paste URL or title..." : "Search in your saved hub..."}
          className="w-full p-5 pl-14 pr-36 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[1.5rem] shadow-sm transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-950/30 outline-none text-slate-700 dark:text-slate-200 text-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2.5 top-2.5 bottom-2.5 px-8 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-2xl hover:bg-indigo-600 dark:hover:bg-white active:scale-95 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:scale-100 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            mode === 'add' ? 'Analyze' : 'Search'
          )}
        </button>
      </form>
      <div className="mt-4 text-xs font-medium text-slate-400 dark:text-slate-600 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span>{mode === 'add' ? 'AI Auto-categorization' : 'Local Search'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span>Private Local Storage</span>
        </div>
      </div>
    </div>
  );
};

export default ContentInput;
