import React from 'react';
import { BookOpen, Lightbulb, Compass, Award } from 'lucide-react';

export default function VocabularyMetrics({ totalWords = 50 }) {
  const metrics = [
    {
      label: 'Initial Seed Dataset',
      value: `${totalWords} Words`,
      desc: 'Curated high-frequency exam core',
      icon: BookOpen,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      label: 'Content Domains',
      value: '7 Categories',
      desc: 'Economy, Polity, Science & Society',
      icon: Compass,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      label: 'Retention Boosters',
      value: 'Mnemonics & Hindi',
      desc: 'Bilingual meanings & memory hooks',
      icon: Lightbulb,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      label: 'Universal Core',
      value: 'Zero Exam Silos',
      desc: 'SSC, Banking PO, UPSC & State PSCs',
      icon: Award,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div
            key={idx}
            className="glass-panel p-5 rounded-2xl border border-gray-800/80 space-y-2 hover:border-gray-700/80 transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {item.label}
              </span>
              <div className={`p-2 rounded-xl border ${item.bg} ${item.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">
                {item.value}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {item.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
