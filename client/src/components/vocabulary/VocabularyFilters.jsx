import React from 'react';
import { Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'General',
  'Society',
  'Science',
  'Economy',
  'Governance',
  'Politics',
  'Finance'
];

const DIFFICULTIES = [
  { label: 'All Difficulties', value: 'All' },
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' }
];

export default function VocabularyFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  onReset,
  totalCount,
  filteredCount
}) {
  const isFiltered = searchQuery || selectedCategory !== 'All' || selectedDifficulty !== 'All';

  return (
    <div className="space-y-4">
      {/* Search Bar & Difficulty Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search word, Hindi meaning, definition, or synonym..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-900/90 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white rounded-md transition"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Difficulty Dropdown Selector */}
        <div className="flex items-center gap-2">
          <div className="relative shrink-0">
            <select
              value={selectedDifficulty}
              onChange={(e) => onSelectDifficulty(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-gray-900/90 border border-gray-800 text-xs font-medium text-gray-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              {DIFFICULTIES.map((diff) => (
                <option key={diff.value} value={diff.value}>
                  {diff.label}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition cursor-pointer shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Domain Category Filter Chips */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mr-1 shrink-0">
            Domain:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500'
                    : 'bg-gray-900/80 border border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Counter Badge */}
        <div className="text-xs text-gray-400 font-medium">
          Showing <strong className="text-white">{filteredCount}</strong> of {totalCount} words
        </div>
      </div>
    </div>
  );
}
