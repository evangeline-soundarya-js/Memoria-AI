import React, { useState, useEffect, useMemo } from 'react';
import { ContentItem, View, Theme, Platform, AIModel, SummaryDetail, AIResponse } from './types';
import { analyzeContent, isIntelligenceEnabled } from './services/geminiService';
import ContentCard from './components/ContentCard';
import Sidebar from './components/Sidebar';
import QuickAccess from './components/QuickAccess';
import SettingsPanel from './components/SettingsPanel';
import Hero from './components/Hero';
import ManualEntryModal from './components/ManualEntryModal';

const STORAGE_KEY = 'memoria-v1-items';
const SETTINGS_KEY = 'memoria-v1-settings';

const App: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [autoCategorize, setAutoCategorize] = useState(true);
  const [selectedModel, setSelectedModel] = useState<AIModel>('gemini-3-flash-preview');
  const [summaryDetail, setSummaryDetail] = useState<SummaryDetail>('concise');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{message: string, isError?: boolean} | null>(null);
  const [theme, setTheme] = useState<Theme>('light'); 
  const [activeView, setActiveView] = useState<View>('home');
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [subFilterValue, setSubFilterValue] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unwatchedFirst, setUnwatchedFirst] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);
  
  // Manual Entry State
  const [manualEntryInput, setManualEntryInput] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setIsApiConnected(isIntelligenceEnabled());
    check();
    const interval = setInterval(check, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setItems(JSON.parse(saved));
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      const s = JSON.parse(savedSettings);
      setTheme(s.theme || 'light'); 
      setAutoCategorize(s.autoCategorize ?? true);
      setSelectedModel(s.selectedModel || 'gemini-3-flash-preview');
      setSummaryDetail(s.summaryDetail || 'concise');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme, autoCategorize, selectedModel, summaryDetail }));
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [items, theme, autoCategorize, selectedModel, summaryDetail]);

  const saveToLibrary = (input: string, data: AIResponse) => {
    const newItem: ContentItem = { 
      id: crypto.randomUUID(), 
      input, 
      isFavorite: false, 
      isArchived: false, 
      watched: false,
      timestamp: Date.now(), 
      ...data 
    };
    
    setItems(prev => [newItem, ...prev]);
    setNotification({ message: "Library Index Updated", isError: false });
    setLoading(false);
    setActiveView('home');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async (input: string) => {
    setLoading(true);
    setNotification(null);
    
    try {
      if (autoCategorize && isIntelligenceEnabled()) {
        const result = await analyzeContent(input, selectedModel, summaryDetail);
        saveToLibrary(input, result);
      } else {
        // Trigger manual entry if AI is disabled or fails
        setManualEntryInput(input);
        setLoading(false);
      }
    } catch (err: any) {
      console.warn("AI extraction failed, requesting manual input", err);
      setManualEntryInput(input);
      setLoading(false);
    }
  };

  const categoryTree = useMemo(() => {
    const tree: Record<string, Set<string>> = {};
    items.forEach(i => {
      if (!i.isArchived) {
        if (!tree[i.category]) tree[i.category] = new Set();
        tree[i.category].add(i.subcategory);
      }
    });
    return tree;
  }, [items]);

  const filteredItems = useMemo(() => {
    let base = items;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      base = base.filter(i => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    } else {
      if (activeView === 'favorites') base = base.filter(i => i.isFavorite && !i.isArchived);
      else if (activeView === 'archived') base = base.filter(i => i.isArchived);
      else if (activeView === 'unwatched') base = base.filter(i => !i.watched && !i.isArchived);
      else if (activeView === 'category' && filterValue) base = base.filter(i => i.category === filterValue && !i.isArchived);
      else if (activeView === 'subcategory' && subFilterValue) base = base.filter(i => i.subcategory === subFilterValue && !i.isArchived);
      else base = base.filter(i => !i.isArchived);
    }
    return unwatchedFirst ? [...base].sort((a,b) => a.watched === b.watched ? b.timestamp - a.timestamp : a.watched ? 1 : -1) : base;
  }, [items, activeView, filterValue, subFilterValue, searchQuery, unwatchedFirst]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans overflow-hidden">
      
      {manualEntryInput && (
        <ManualEntryModal 
          input={manualEntryInput} 
          onSave={(data) => {
            saveToLibrary(manualEntryInput, data);
            setManualEntryInput(null);
          }}
          onCancel={() => {
            setManualEntryInput(null);
            setLoading(false);
          }}
        />
      )}

      <Sidebar 
        items={items} 
        categoryTree={categoryTree} 
        activeView={activeView} 
        filterValue={filterValue}
        subFilterValue={subFilterValue}
        isOpen={isSidebarOpen}
        isApiConnected={isApiConnected}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={(v, val, subVal) => { 
          setActiveView(v); 
          setFilterValue(val || null); 
          setSubFilterValue(subVal || null);
          setIsSidebarOpen(false); 
        }} 
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <QuickAccess 
          onSave={handleSave} onSearch={setSearchQuery} isLoading={loading}
          onShowFavorites={() => setActiveView('favorites')} onToggleSidebar={() => setIsSidebarOpen(true)}
          isApiConnected={isApiConnected} onConnectApi={() => (window as any).aistudio?.openSelectKey()}
        />
        {notification && (
          <div className="fixed top-24 right-10 z-[100] glass-morphism border border-brand-light/20 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-right-10 flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${notification.isError ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-brand-light animate-glow'}`}></div>
            {notification.message}
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-6 lg:p-20 lg:pt-12 scroll-smooth scrollbar-hide">
          <div className="max-w-[1600px] mx-auto space-y-24">
            {activeView === 'settings' ? (
              <SettingsPanel 
                items={items} theme={theme} onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                autoCategorize={autoCategorize} onToggleAutoCategorize={() => setAutoCategorize(!autoCategorize)}
                selectedModel={selectedModel} onSetModel={setSelectedModel} summaryDetail={summaryDetail} onSetDetail={setSummaryDetail}
                onClear={() => { if(confirm("Purge Hub?")) { setItems([]); localStorage.clear(); } }} 
                onImport={setItems} 
                onConnectKey={() => (window as any).aistudio?.openSelectKey()} isApiConnected={isApiConnected}
              />
            ) : (
              <div className="space-y-16">
                {items.length === 0 && <Hero />}
                
                {items.length > 0 && (
                  <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-12">
                    <div className="space-y-3">
                       <h2 className="text-4xl font-display font-black tracking-tight uppercase">
                         {searchQuery ? 'Search Index' : 
                          activeView === 'home' ? 'Central Index' :
                          activeView === 'favorites' ? 'Priority Hub' :
                          activeView === 'unwatched' ? 'Queue' :
                          subFilterValue || filterValue || 'Library'}
                       </h2>
                       <p className="text-[10px] font-black text-brand-light uppercase tracking-[0.2em]">{filteredItems.length} Content Segments Found</p>
                    </div>
                    <button 
                      onClick={() => setUnwatchedFirst(!unwatchedFirst)}
                      className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl border transition-all ${unwatchedFirst ? 'bg-brand-dark text-black border-brand-dark' : 'bg-white dark:bg-navy-900/50 border-slate-200 dark:border-slate-800'}`}
                    >
                      {unwatchedFirst ? 'Priority View Active' : 'Sort by Newest'}
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                  {filteredItems.map(item => (
                    <ContentCard 
                      key={item.id} item={item} 
                      onFavorite={() => setItems(prev => prev.map(i => i.id === item.id ? {...i, isFavorite: !i.isFavorite} : i))}
                      onArchive={() => setItems(prev => prev.map(i => i.id === item.id ? {...i, isArchived: !i.isArchived} : i))}
                      onWatched={() => setItems(prev => prev.map(i => i.id === item.id ? {...i, watched: !i.watched} : i))}
                      onDelete={() => confirm("Wipe segment permanently?") && setItems(prev => prev.filter(i => i.id !== item.id))}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;