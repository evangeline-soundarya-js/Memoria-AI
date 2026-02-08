import React, { useState } from 'react';

interface QuickAccessProps {
  onSave: (input: string) => void;
  onSearch: (query: string) => void;
  onShowFavorites: () => void;
  onToggleSidebar: () => void;
  isLoading: boolean;
  isApiConnected?: boolean | null;
  onConnectApi?: () => void;
}

const QuickAccess: React.FC<QuickAccessProps> = ({ 
  onSave, onSearch, onShowFavorites, onToggleSidebar, isLoading, isApiConnected, onConnectApi 
}) => {
  const [saveInput, setSaveInput] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveInput.trim() || isLoading) return;
    onSave(saveInput);
    setSaveInput('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    onSearch(val);
  };

  return (
    <div className="glass-morphism p-4 sm:px-10 sm:py-5 sticky top-0 z-40 transition-all">
      <div className="max-w-[1800px] mx-auto flex items-center gap-8">
        
        {/* Branding Cluster */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleSidebar}
            className="p-3 bg-slate-100 dark:bg-navy-800/50 hover:bg-slate-200 dark:hover:bg-navy-700 rounded-2xl transition-all text-slate-500 dark:text-slate-400 active:scale-90 border border-slate-200 dark:border-slate-700/50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
          </button>
          
          <div className="hidden xl:flex flex-col">
            <span className="text-slate-900 dark:text-white font-display font-black text-sm tracking-tight leading-none">MEMORIA AI</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[8px] font-black text-brand-light dark:text-brand-dark uppercase tracking-widest leading-none">Intelligence</span>
              <div className={`w-1 h-1 rounded-full ${isApiConnected ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-rose-500'}`}></div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col sm:flex-row items-center gap-6">
          {/* SEARCH COMPONENT */}
          <div className="relative w-full sm:max-w-[280px] group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-brand-light dark:group-focus-within:text-brand-dark transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="System Search..."
              className="w-full bg-slate-50 dark:bg-navy-950/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-brand-light dark:focus:border-brand-dark transition-all text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm"
            />
          </div>

          {/* INJECTION INPUT */}
          <div className="flex-1 w-full">
            <form onSubmit={handleSave} className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-brand-light dark:group-focus-within:text-brand-dark transition-colors">
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15"/></svg>
                )}
              </div>
              <input
                type="text"
                value={saveInput}
                onChange={(e) => setSaveInput(e.target.value)}
                placeholder={isApiConnected === false ? "Add URL to begin..." : "Paste asset URL for analysis..."}
                disabled={isLoading}
                className="w-full bg-white dark:bg-navy-950 border border-slate-200 dark:border-slate-700/60 rounded-2xl py-3.5 pl-14 pr-32 outline-none focus:border-brand-light dark:focus:border-brand-dark transition-all text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:shadow-[0_0_20px_rgba(6,182,212,0.05)] shadow-sm"
              />
              <button 
                type="submit" 
                disabled={isLoading || !saveInput.trim()}
                className="absolute right-2 top-2 bottom-2 px-8 bg-brand-light text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-hoverLight transition-all active:scale-95 disabled:opacity-0 disabled:translate-x-8 pointer-events-auto shadow-lg shadow-brand-light/20"
              >
                Inject
              </button>
            </form>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-3">
           {isApiConnected === false && (
             <button 
               onClick={onConnectApi}
               className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-600 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/20 transition-all animate-pulse"
             >
               Connect API
             </button>
           )}
           <button 
             onClick={onShowFavorites}
             className="p-3.5 bg-white dark:bg-navy-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl text-slate-400 hover:text-amber-500 transition-all hover:border-amber-400/30 shadow-sm"
             title="Priority Hub"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
           </button>
        </div>
      </div>
    </div>
  );
};

export default QuickAccess;