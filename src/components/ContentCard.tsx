
import React, { useState } from 'react';
import { ContentItem } from '../types';
import { CATEGORY_COLORS, DEFAULT_CAT_COLOR, PLATFORM_BRAND_COLORS } from '../constants';

interface ContentCardProps {
  item: ContentItem;
  onFavorite: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onWatched: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onFavorite, onArchive, onDelete, onWatched }) => {
  const [isClicking, setIsClicking] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const categoryStyle = CATEGORY_COLORS[item.category] || DEFAULT_CAT_COLOR;
  const platformColor = PLATFORM_BRAND_COLORS[item.platform] || PLATFORM_BRAND_COLORS['Other'];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'YouTube': return (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
      );
      case 'Instagram': return (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      );
      case 'Reddit': return (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.969 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.047.282.071.571.071.863 0 2.196-2.523 3.976-5.636 3.976-3.113 0-5.636-1.78-5.636-3.976 0-.282.021-.564.062-.839a1.754 1.754 0 0 1-1.114-1.621c0-.968.786-1.754 1.754-1.754.463 0 .875.18 1.179.472 1.17-.792 2.747-1.327 4.476-1.432l.913-4.281a.125.125 0 0 1 .147-.094l2.72.574c.1-.215.318-.363.57-.363zM9.01 11.008c-.603 0-1.091.49-1.091 1.091s.488 1.09 1.091 1.09c.602 0 1.09-.489 1.09-1.09s-.488-1.091-1.09-1.091zm5.98 0c-.603 0-1.091.49-1.091 1.091s.488 1.09 1.091 1.09c.602 0 1.09-.489 1.09-1.09s-.488-1.091-1.09-1.091zm-3.008 2.225h-.012c-.114 0-.227.051-.314.143-.448.448-1.144.576-1.564.576-.044 0-.084-.001-.123-.005a.125.125 0 0 0-.06.242c.41.347 1.017.539 1.543.539.526 0 1.134-.192 1.543-.539a.125.125 0 0 0-.063-.242c-.039.004-.079.005-.123.005-.42 0-1.117-.128-1.564-.576a.312.312 0 0 0-.313-.143z"/></svg>
      );
      case 'Web/Blogs': return (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
      );
      default: return (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/></svg>
      );
    }
  };

  const handleOpen = () => {
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 400);
    const isUrl = item.input.startsWith('http');
    if (isUrl) window.open(item.input, '_blank');
    else window.open(`https://www.google.com/search?q=${encodeURIComponent(item.input)}`, '_blank');
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardOpacity = item.watched ? 'opacity-40 grayscale-[0.5]' : 'opacity-100';

  return (
    <div className={`group relative bg-white dark:bg-navy-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:border-brand-dark/40 hover:shadow-2xl hover:shadow-brand-dark/5 dark:hover:shadow-brand-dark/5 ${cardOpacity} ${isClicking ? 'animate-shake' : ''}`}>
      
      {/* Platform Branding Top Left */}
      <div className={`absolute top-4 left-4 z-10 p-2 rounded-xl shadow-lg ${platformColor}`}>
        {getPlatformIcon(item.platform)}
      </div>

      {/* Dynamic Thumbnail Visual */}
      <div className="relative h-32 w-full overflow-hidden bg-slate-100 dark:bg-navy-800">
        <div className={`absolute inset-0 bg-gradient-to-tr ${item.platform === 'YouTube' ? 'from-red-950/20 to-red-500/10' : item.platform === 'Reddit' ? 'from-orange-950/20 to-orange-500/10' : 'from-slate-200 dark:from-navy-950 to-brand-dark/5 dark:to-brand-dark/10'} opacity-60`}></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg className="w-16 h-16 text-slate-400 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <div className="absolute bottom-2 right-4 z-10">
          {item.watched && (
            <div className="bg-emerald-500/90 backdrop-blur px-2 py-0.5 rounded-lg text-[8px] font-black text-white uppercase tracking-widest">Complete</div>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${categoryStyle}`}>
              {item.category}
            </span>
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate max-w-[100px]">{item.subcategory}</span>
          </div>
          <h4 onClick={handleOpen} className="text-slate-900 dark:text-white font-display font-bold text-base leading-tight line-clamp-2 cursor-pointer hover:text-brand-light dark:hover:text-brand-dark transition-colors">
            {item.title}
          </h4>
        </div>

        {/* AI INSIGHTS AREA */}
        <div className="bg-slate-50 dark:bg-navy-950/40 rounded-xl p-3 space-y-2 border border-slate-100 dark:border-slate-800/50">
          <p className="text-[10px] font-medium text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed italic">
            "{item.aiInsight}"
          </p>
          <ul className="space-y-1">
            {item.keyPoints.slice(0, 3).map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[9px] text-slate-500 dark:text-slate-400 font-semibold leading-tight">
                <span className="text-brand-light dark:text-brand-dark mt-0.5">•</span>
                <span className="line-clamp-1">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            <button onClick={(e) => { e.stopPropagation(); onFavorite(); }} className={`p-2 rounded-lg transition-all ${item.isFavorite ? 'bg-amber-500/20 text-amber-500' : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <svg className="w-3.5 h-3.5" fill={item.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); onWatched(); }} className={`p-2 rounded-lg transition-all ${item.watched ? 'bg-emerald-500/20 text-emerald-600' : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </button>
          </div>
          
          <div className="flex items-center gap-1">
             <button onClick={handleCopy} className={`p-2 rounded-lg transition-all ${copied ? 'text-brand-light' : 'text-slate-400 hover:text-brand-light'}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
             </button>
             <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 text-slate-400 hover:text-rose-500 transition-all">
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79" /></svg>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
