import React, { useEffect, useRef } from 'react';
import { 
  X, 
  BookOpen, 
  Lightbulb, 
  Sparkles, 
  CheckCircle2
} from 'lucide-react';

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

export default function WordDetailModal({ word, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (word) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }

    const handleCancel = (e) => {
      e.preventDefault();
      onClose();
    };

    // Modern light-dismiss fallback for browsers not supporting closedby="any"
    const handleBackdropClick = (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        onClose();
      }
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleBackdropClick);

    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, [word, onClose]);

  if (!word) return null;

  const difficultyStyle = DIFFICULTY_STYLES[word.difficulty] || DIFFICULTY_STYLES.medium;
  const categoryStyle = CATEGORY_COLORS[word.category] || CATEGORY_COLORS.General;
  const pronunciation = word.pronunciation?.phonetic || word.pronunciation?.ipa;

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="modal-word-term"
      className="m-auto w-full max-w-3xl rounded-3xl border border-gray-800 bg-[#0d121f] text-gray-100 p-0 shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm max-h-[90vh] overflow-hidden flex flex-col"
    >
      {/* Modal Sticky Header */}
      <div className="relative border-b border-gray-800/80 bg-gray-950/80 px-6 py-5 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md border ${categoryStyle}`}>
              {word.category || 'General'}
            </span>
            <span className={`px-2.5 py-0.5 text-xs font-semibold capitalize rounded-md border ${difficultyStyle}`}>
              {word.difficulty || 'medium'}
            </span>
            {word.partsOfSpeech?.map((pos, idx) => (
              <span key={idx} className="px-2 py-0.5 text-xs font-mono text-gray-400 bg-gray-900 border border-gray-800 rounded-md">
                {pos}
              </span>
            ))}
          </div>
          <div className="flex items-baseline gap-3 pt-1">
            <h2 id="modal-word-term" className="text-3xl font-extrabold text-white tracking-tight">
              {word.term}
            </h2>
            {pronunciation && (
              <span className="text-sm font-mono text-indigo-400">
                /{pronunciation}/
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-xl p-2 text-gray-400 hover:text-white hover:bg-gray-800/80 transition cursor-pointer"
          aria-label="Close word details"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Scrollable Content */}
      <div className="overflow-y-auto p-6 space-y-6 flex-1">
        
        {/* Section 1: Hindi Meanings & English Definitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hindi Meanings */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <BookOpen className="w-4 h-4" />
              <span>हिन्दी अर्थ (Hindi Meanings)</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {word.hindiMeanings?.map((meaning, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-100 font-semibold text-sm"
                >
                  {meaning}
                </span>
              ))}
            </div>
          </div>

          {/* English Definitions */}
          <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>English Definitions</span>
            </div>
            <ul className="space-y-1.5 pt-1 text-xs text-gray-300">
              {word.englishDefinitions?.map((def, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{def}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 2: Contextual Bilingual Examples */}
        {word.meaningsWithExamples?.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Exam-Context Examples (हिन्दी अनुवाद सहित)
              </h4>
              <span className="text-xs text-indigo-400 font-medium">
                {word.meaningsWithExamples.length} Contextual Usages
              </span>
            </div>

            <div className="space-y-3">
              {word.meaningsWithExamples.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-gray-900/40 border border-gray-800 space-y-2 hover:border-gray-700 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      अर्थ: {item.hindiMeaning}
                    </span>
                  </div>

                  {/* English Sentence */}
                  <div className="text-sm font-medium text-gray-200 pl-3 border-l-2 border-indigo-500">
                    "{item.exampleSentence}"
                  </div>

                  {/* Hindi Translation */}
                  <div className="text-xs text-indigo-200/90 pl-3 font-normal">
                    अनुवाद: {item.exampleHindiTranslation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Mnemonic / Memory Hook (Retention Booster) */}
        {word.mnemonic && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Lightbulb className="w-4 h-4" />
              <span>Memory Hook / Mnemonic (याद रखने की ट्रिक)</span>
            </div>
            <p className="text-sm font-medium text-amber-200 leading-relaxed">
              {word.mnemonic}
            </p>
          </div>
        )}

        {/* Section 4: Synonyms, Antonyms & Related Words */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Synonyms */}
          {word.synonyms?.length > 0 && (
            <div className="p-4 rounded-2xl bg-gray-900/40 border border-gray-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Synonyms (समानार्थी शब्द)
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {word.synonyms.map((syn, idx) => (
                  <span 
                    key={idx} 
                    className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Antonyms */}
          {word.antonyms?.length > 0 && (
            <div className="p-4 rounded-2xl bg-gray-900/40 border border-gray-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Antonyms (विलोम शब्द)
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {word.antonyms.map((ant, idx) => (
                  <span 
                    key={idx} 
                    className="px-2.5 py-1 text-xs rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 font-medium"
                  >
                    {ant}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Words */}
        {word.relatedWords?.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Related Word Family:
            </span>
            <div className="flex flex-wrap gap-2">
              {word.relatedWords.map((rel, idx) => (
                <span key={idx} className="px-2.5 py-1 text-xs rounded-lg bg-gray-900 border border-gray-800 text-gray-300">
                  {rel}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Usage Notes & Etymology */}
        {(word.usageNotes || word.etymology) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-800/60">
            {word.usageNotes && (
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Usage Notes & Exam Collocations
                </span>
                <p className="text-xs text-gray-300 leading-relaxed bg-gray-900/30 p-3 rounded-xl border border-gray-800/80">
                  {word.usageNotes}
                </p>
              </div>
            )}

            {word.etymology && (
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Word Origin & Etymology
                </span>
                <p className="text-xs text-gray-400 leading-relaxed bg-gray-900/30 p-3 rounded-xl border border-gray-800/80">
                  {word.etymology}
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modal Footer */}
      <div className="border-t border-gray-800/80 bg-gray-950/80 px-6 py-4 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Curated System Vocabulary (No Exam Silos)</span>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-medium transition cursor-pointer"
        >
          Close [Esc]
        </button>
      </div>
    </dialog>
  );
}
