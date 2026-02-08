import React, { useState } from 'react';
import { View, ContentItem, Platform } from '../types';

interface SidebarProps {
  items: ContentItem[];
  categoryTree: Record<string, Set<string>>;
  activeView: View;
  filterValue: string | null;
  subFilterValue: string | null;
  isOpen: boolean;
  isApiConnected?: boolean | null;
  onClose: () => void;
  onNavigate: (view: View, value?: string, subValue?: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  items, categoryTree, activeView, filterValue, subFilterValue, isOpen, isApiConnected, onClose, onNavigate 
}) => {
  const platforms: Platform[] = ['YouTube', 'Instagram', 'Reddit', 'Web/Blogs', 'Other'];
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  const toggleCat = (cat: string) => {
    setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const getCount = (type: 'category' | 'subcategory' | 'platform' | 'favorite' | 'archive' | 'unwatched', value?: string, subValue?: string) => {
    if (type === 'category') return items.filter(i => i.category === value && !i.isArchived).length;
    if (type === 'subcategory') return items.filter(i => i.subcategory === subValue && !i.isArchived).length;
    if (type === 'platform') return items.filter(i => i.platform === value && !i.isArchived).length;
    if (type === 'favorite') return items.filter(i => i.isFavorite && !i.isArchived).length;
    if (type === 'archive') return items.filter(i => i.isArchived).length;
    if (type === 'unwatched') return items.filter(i => !i.watched && !i.isArchived).length;
    return 0;
  };

  const NavItem = ({ label, view, value, subValue, icon, count, isSub = false, onClick }: any) => {
    const isActive = activeView === view && (value === filterValue) && (subValue === subFilterValue);
    return (
      <button
        onClick={onClick || (() => onNavigate(view, value, subValue))}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group mb-0.5 ${
          isActive 
            ? 'bg-brand-light dark:bg-brand-dark text-white shadow-lg translate-x-1' 
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
        } ${isSub ? 'pl-12 py-1.5 text-xs opacity-80' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className={`${isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'} transition-opacity`}>
            {icon}
          </div>
          <span className="truncate">{label}</span>
        </div>
        {count !== undefined && count > 0 && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[60] lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-[70] w-72 bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 transition-all duration-500 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Branding */}
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 bg-brand-light dark:bg-brand-dark rounded-2xl flex items-center justify-center text-white font-display font-black text-xl shadow-lg group-hover:scale-105 transition-transform">M</div>
            <div>
               <h1 className="font-display font-black text-base tracking-tight text-slate-900 dark:text-white leading-none">MEMORIA AI</h1>
               <div className="flex items-center gap-2 mt-1">
                 <span className="text-[9px] font-black text-brand-light dark:text-brand-dark uppercase tracking-widest block">Assistant Hub</span>
                 <div className={`w-1.5 h-1.5 rounded-full ${isApiConnected ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)] animate-pulse'}`}></div>
               </div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-hide space-y-8">
          <div>
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Workspace</h3>
            <div className="space-y-0.5">
              <NavItem label="Home Index" view="home" icon={<IconHome />} />
              <NavItem label="Priority Hub" view="favorites" icon={<IconStar />} count={getCount('favorite')} />
              <NavItem label="Unwatched Queue" view="unwatched" icon={<IconEye />} count={getCount('unwatched')} />
              <NavItem label="Archive" view="archived" icon={<IconArchive />} count={getCount('archive')} />
            </div>
          </div>

          <div>
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Categories</h3>
            <div className="space-y-0.5">
              {Object.keys(categoryTree).map(cat => (
                <div key={cat}>
                  <NavItem 
                    label={cat} 
                    view="category" 
                    value={cat} 
                    icon={<IconFolder />} 
                    count={getCount('category', cat)} 
                    onClick={() => toggleCat(cat)}
                  />
                  {expandedCats[cat] && Array.from(categoryTree[cat]).map(sub => (
                    <NavItem 
                      key={sub} 
                      label={sub} 
                      view="subcategory" 
                      value={cat} 
                      subValue={sub} 
                      isSub={true} 
                      count={getCount('subcategory', undefined, sub)} 
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Settings */}
        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/60">
          <NavItem label="Settings" view="settings" icon={<IconSettings />} />
        </div>
      </aside>
    </>
  );
};

/* Micro Icons */
const IconHome = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>;
const IconStar = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>;
const IconEye = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 5 12 5c4.79 0 8.601 3.049 9.964 6.678.118.313.118.657 0 .97C20.601 15.951 16.79 19 12 19c-4.79 0-8.601-3.049-9.964-6.678z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconArchive = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>;
const IconFolder = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>;
const IconSettings = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;

export default Sidebar;