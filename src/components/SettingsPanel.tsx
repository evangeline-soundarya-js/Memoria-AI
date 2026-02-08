import React, { useRef } from 'react';
import { ContentItem, Theme, AIModel, SummaryDetail } from '../types';

interface SettingsPanelProps {
  onClear: () => void;
  onToggleTheme: () => void;
  theme: Theme;
  items: ContentItem[];
  autoCategorize: boolean;
  onToggleAutoCategorize: () => void;
  selectedModel: AIModel;
  onSetModel: (m: AIModel) => void;
  summaryDetail: SummaryDetail;
  onSetDetail: (d: SummaryDetail) => void;
  onImport: (items: ContentItem[]) => void;
  onConnectKey: () => void;
  isApiConnected: boolean | null;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  onClear, onToggleTheme, theme, items, autoCategorize, onToggleAutoCategorize, selectedModel, onSetModel, summaryDetail, onSetDetail, onImport, onConnectKey, isApiConnected
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportJSON = () => {
    const content = JSON.stringify(items, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memoria-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) onImport(data);
        else alert("Invalid backup format.");
      } catch { alert("Failed to parse file."); }
    };
    reader.readAsText(file);
  };

  const OptionCard = ({ title, sub, children }: any) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="font-display font-black text-lg text-slate-900 dark:text-white leading-none">{title}</h4>
          <p className="text-xs text-slate-500 mt-2 font-medium">{sub}</p>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <header className="mb-12">
        <h2 className="text-4xl font-display font-black tracking-tight mb-3">System Control</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Personalize your intelligence hub experience.</p>
      </header>

      <section className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-4 text-brand-dark">Cloud Intelligence</h3>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h4 className="font-display font-black text-lg text-slate-900 dark:text-white">API Connection</h4>
                <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${isApiConnected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {isApiConnected ? 'Connected' : 'Action Required'}
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium">Connect your paid Google Cloud project to enable Gemini 3 features.</p>
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="inline-block text-[10px] font-black uppercase text-brand-dark hover:underline tracking-widest pt-2">
                Learn about Billing Docs →
              </a>
            </div>
            <button 
              onClick={onConnectKey}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${isApiConnected ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-brand-light text-white shadow-brand-light/20'}`}
            >
              {isApiConnected ? 'Change Key' : 'Connect Project'}
            </button>
          </div>

          <div>
            <h4 className="font-display font-black text-lg text-slate-900 dark:text-white">Gemini Engine</h4>
            <p className="text-xs text-slate-500 mt-2 font-medium mb-6">Choose between raw speed or deep analytical reasoning.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => onSetModel('gemini-3-flash-preview')} className={`p-5 rounded-2xl border-2 text-left transition-all ${selectedModel === 'gemini-3-flash-preview' ? 'border-brand-light bg-brand-light/5 dark:bg-brand-dark/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}>
                <p className={`text-xs font-black uppercase tracking-widest ${selectedModel === 'gemini-3-flash-preview' ? 'text-brand-light' : 'text-slate-400'}`}>Flash Engine</p>
                <p className="text-[10px] font-bold mt-1 text-slate-500">Optimized for rapid sorting and low latency.</p>
              </button>
              <button onClick={() => onSetModel('gemini-3-pro-preview')} className={`p-5 rounded-2xl border-2 text-left transition-all ${selectedModel === 'gemini-3-pro-preview' ? 'border-brand-light bg-brand-light/5 dark:bg-brand-dark/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <p className={`text-xs font-black uppercase tracking-widest ${selectedModel === 'gemini-3-pro-preview' ? 'text-brand-light' : 'text-slate-400'}`}>Pro Reasoning</p>
                  <svg className="w-3 h-3 text-brand-dark" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                </div>
                <p className="text-[10px] font-bold mt-1 text-slate-500">Exhaustive analysis with grounding tools.</p>
              </button>
            </div>
          </div>
        </div>

        <OptionCard title="AI Intelligence" sub="Automatically summarize your content upon injection.">
          <button 
            onClick={onToggleAutoCategorize}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${autoCategorize ? 'bg-brand-light' : 'bg-slate-200 dark:bg-slate-800'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${autoCategorize ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </OptionCard>

        <OptionCard title="Visual Theme" sub="Toggle between light and dark aesthetics for your workspace.">
           <button onClick={onToggleTheme} className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
             Switch to {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
           </button>
        </OptionCard>
      </section>

      <section className="space-y-6 pt-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-4">Portability</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h4 className="font-display font-black text-lg mb-2 text-slate-900 dark:text-white">Export Index</h4>
            <p className="text-xs text-slate-500 mb-6 font-medium">Download a complete JSON backup of your library.</p>
            <button onClick={exportJSON} className="w-full py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-light hover:text-white hover:border-brand-light transition-all">Download Backup</button>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h4 className="font-display font-black text-lg mb-2 text-slate-900 dark:text-white">Restore Index</h4>
            <p className="text-xs text-slate-500 mb-6 font-medium">Upload and merge an existing memory index.</p>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
            <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-light hover:text-white hover:border-brand-light transition-all">Import JSON</button>
          </div>
        </div>
      </section>

      <section className="pt-12 border-t border-slate-100 dark:border-slate-800">
         <div className="bg-rose-50/50 dark:bg-rose-950/10 p-10 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="text-center sm:text-left">
               <h4 className="font-display font-black text-xl text-rose-600 mb-2">Danger Sector</h4>
               <p className="text-sm text-rose-500/70 font-medium">Instantly wipe all memory segments and local logs.</p>
            </div>
            <button onClick={onClear} className="px-10 py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-200 dark:shadow-none transition-all active:scale-95">Hard Reset</button>
         </div>
      </section>
    </div>
  );
};

export default SettingsPanel;