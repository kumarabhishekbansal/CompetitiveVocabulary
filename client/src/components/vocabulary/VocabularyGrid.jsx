import React from 'react';
import WordCard from './WordCard';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export default function VocabularyGrid({
  words = [],
  loading = false,
  onSelectWord,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalWords = 0,
  onResetFilters
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="glass-panel rounded-2xl border border-gray-800/80 p-5 space-y-4 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 bg-gray-800 rounded-md" />
              <div className="h-4 w-12 bg-gray-800 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-32 bg-gray-800 rounded-md" />
              <div className="h-4 w-24 bg-gray-800/60 rounded-md" />
            </div>
            <div className="h-10 bg-gray-800/40 rounded-md" />
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-gray-800/50 rounded-md" />
              <div className="h-5 w-16 bg-gray-800/50 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="glass-panel rounded-3xl border border-gray-800/80 p-12 text-center space-y-4 max-w-xl mx-auto my-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">No Vocabulary Words Found</h3>
          <p className="text-xs text-gray-400">
            No words matched your current search and filter combination.
          </p>
        </div>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {words.map((word) => (
          <WordCard 
            key={word._id || word.term} 
            word={word} 
            onSelect={onSelectWord} 
          />
        ))}
      </div>

      {/* Server-Connected Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-800/80">
          <div className="text-xs text-gray-400">
            Showing Page <strong className="text-white">{currentPage}</strong> of{' '}
            <strong className="text-white">{totalPages}</strong> ({totalWords} total items)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500'
                    : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
