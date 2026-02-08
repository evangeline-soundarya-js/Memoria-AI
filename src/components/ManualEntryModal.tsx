import React, { useState } from 'react';
import { AIResponse, Platform, PrimaryCategory } from '../types';
import { PLATFORMS, CATEGORIES } from '../constants';

interface ManualEntryModalProps {
  input: string;
  onSave: (data: AIResponse) => void;
  onCancel: () => void;
}

const ManualEntryModal: React.FC<ManualEntryModalProps> = ({ input, onSave, onCancel }) => {
  const [formData, setFormData] = useState<AIResponse>({
    title: input.startsWith('http') ? '' : input,
    platform: (input.includes('youtube.com') || input.includes('youtu.be') ? 'YouTube' : 
               input.includes('instagram.com') ? 'Instagram' : 
               input.includes('reddit.com') ? 'Reddit' : 'Other') as Platform,
    category: 'Others' as PrimaryCategory,
    subcategory: 'Draft',
    aiInsight: '',
    keyPoints: ['', '', '']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      keyPoints: formData.keyPoints.filter(p => p.trim() !== '')
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-navy-900 w-full max-w-2xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 sm:p-12 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">Manual Categorization</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Intelligence engine offline • Manual entry required</p>
            </div>
            <button onClick={onCancel} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Resource Title</label>
              <input 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Enter title..."
                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold outline-none focus:border-brand-light transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Platform</label>
                <select 
                  value={formData.platform}
                  onChange={e => setFormData({...formData, platform: e.target.value as Platform})}
                  className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold outline-none focus:border-brand-light transition-all appearance-none"
                >
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Primary Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold outline-none focus:border-brand-light transition-all appearance-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Brief Description (What is this about?)</label>
              <textarea 
                required
                rows={3}
                value={formData.aiInsight}
                onChange={e => setFormData({...formData, aiInsight: e.target.value})}
                placeholder="A quick summary of the content..."
                className="w-full bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium outline-none focus:border-brand-light transition-all resize-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit"
                className="flex-1 bg-brand-light hover:bg-brand-hoverLight text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-brand-light/20 transition-all active:scale-95"
              >
                Synchronize Asset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManualEntryModal;