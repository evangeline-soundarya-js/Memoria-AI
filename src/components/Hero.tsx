import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="space-y-16 py-12 animate-in fade-in duration-1000">
      <section className="text-center max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-light/10 border border-brand-light/20 text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark">
          Intelligence Platform v2.5
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-none">
          Unified <span className="text-brand-light">Knowledge</span>
        </h1>
        
        <div className="space-y-8 max-w-2xl mx-auto">
          <p className="text-2xl font-display font-bold text-slate-700 dark:text-slate-200 tracking-tight">
            High-fidelity content organization.
          </p>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
            MEMORIA AI captures and structures your digital library. Paste a URL above to begin indexing your resources.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Capture", title: "Instant Injection" },
          { label: "Synthesize", title: "Deep Indexing" },
          { label: "Retrieve", title: "Semantic Search" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-navy-900/40 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-2">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-light dark:text-brand-dark">{item.label}</span>
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">{item.title}</h3>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Hero;