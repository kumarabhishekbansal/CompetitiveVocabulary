import React from 'react';
import { ArrowRight, Lightbulb } from 'lucide-react';

const DIFFICULTY_STYLES = {
  easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
};

const CATEGORY_COLORS = {
  Economy: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  Governance: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  Finance: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  Society: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  Science: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
  Politics: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  General: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
};

export default function WordCard({ word, onSelect }) {
  if (!word) return null;

  const difficultyStyle = DIFFICULTY_STYLES[word.difficulty] || DIFFICULTY_STYLES.medium;
  const categoryStyle = CATEGORY_COLORS[word.category] || CATEGORY_COLORS.General;
  const primaryHindi = word.hindiMeanings?.[0] || '';
  const primaryDefinition = word.englishDefinitions?.[0] || '';
  const pronunciationText = word.pronunciation?.phonetic || word.pronunciation?.ipa || '';

  return (
    <article
      onClick={() => onSelect(word)}
      className="glass-panel group relative flex flex-col justify-between rounded-2xl border border-gray-800/80 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer"
    >
      <div>
        {/* Top Badges Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-md border ${categoryStyle}`}>
              {word.category || 'General'}
            </span>
            <span className={`px-2 py-0.5 text-[11px] font-medium capitalize rounded-md border ${difficultyStyle}`}>
              {word.difficulty || 'medium'}
            </span>
          </div>

          {word.partsOfSpeech?.length > 0 && (
            <span className="text-[11px] font-mono text-gray-400 italic">
              {word.partsOfSpeech.join(', ')}
            </span>
          )}
        </div>

        {/* Word Term & Pronunciation */}
        <div className="space-y-1 mb-3">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
              {word.term}
            </h3>
            {pronunciationText && (
              <span className="text-xs font-mono text-indigo-300/80">
                /{pronunciationText}/
              </span>
            )}
          </div>

          {/* Primary Hindi Meaning */}
          {primaryHindi && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-200 font-medium text-sm">
              <span className="text-xs text-indigo-400">अर्थ:</span>
              <span className="font-semibold">{primaryHindi}</span>
            </div>
          )}
        </div>

        {/* Primary English Definition */}
        <p className="text-xs text-gray-300 leading-relaxed line-clamp-2 mb-4">
          {primaryDefinition}
        </p>

        {/* Synonyms Preview */}
        {word.synonyms?.length > 0 && (
          <div className="space-y-1 mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Synonyms:
            </span>
            <div className="flex flex-wrap gap-1">
              {word.synonyms.slice(0, 3).map((syn, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[11px] rounded bg-gray-900 border border-gray-800 text-gray-300"
                >
                  {syn}
                </span>
              ))}
              {word.synonyms.length > 3 && (
                <span className="text-[10px] text-gray-400 self-center">
                  +{word.synonyms.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Mnemonic Teaser if Available */}
        {word.mnemonic && (
          <div className="mb-4 flex items-center gap-1.5 text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
            <Lightbulb className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span className="truncate font-medium">Memory Hook available</span>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400 group-hover:text-indigo-400 transition-colors">
        <span className="font-medium">
          {word.meaningsWithExamples?.length > 0
            ? `${word.meaningsWithExamples.length} Examples & Meanings`
            : 'Study Full Context'}
        </span>
        <div className="flex items-center gap-1 font-semibold text-indigo-400">
          <span>Study</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  );
}
