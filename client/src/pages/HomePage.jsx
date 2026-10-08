import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  Compass, 
  GraduationCap
} from 'lucide-react';
import { fetchVocabularyWords } from '../api/vocabulary';
import VocabularyMetrics from '../components/vocabulary/VocabularyMetrics';
import VocabularyFilters from '../components/vocabulary/VocabularyFilters';
import VocabularyGrid from '../components/vocabulary/VocabularyGrid';
import WordDetailModal from '../components/vocabulary/WordDetailModal';

export default function HomePage({ onCatalogCountUpdate }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDatabaseWords, setTotalDatabaseWords] = useState(50);

  // Selected Word for Modal Study View
  const [activeWord, setActiveWord] = useState(null);

  const catalogRef = useRef(null);

  // Load words from backend API
  const loadWords = useCallback(async (page = 1, category = 'All', difficulty = 'All') => {
    setLoading(true);
    setError(null);

    const result = await fetchVocabularyWords({
      page,
      limit: 12,
      category: category === 'All' ? '' : category,
      difficulty: difficulty === 'All' ? '' : difficulty,
      contentType: 'word'
    });

    if (result.success) {
      setWords(result.data || []);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(result.page || 1);
      if (result.total !== undefined) {
        setTotalDatabaseWords(result.total);
        if (onCatalogCountUpdate) {
          onCatalogCountUpdate(result.total);
        }
      }
    } else {
      setError(result.error || 'Failed to load vocabulary from database.');
      setWords([]);
    }
    setLoading(false);
  }, [onCatalogCountUpdate]);

  // Trigger load when category, difficulty, or page changes
  useEffect(() => {
    loadWords(currentPage, selectedCategory, selectedDifficulty);
  }, [currentPage, selectedCategory, selectedDifficulty, loadWords]);

  // Handle client-side search query filtering over currently loaded words
  const displayedWords = useMemo(() => {
    if (!searchQuery.trim()) return words;
    const query = searchQuery.toLowerCase().trim();

    return words.filter((w) => {
      const termMatch = w.term?.toLowerCase().includes(query);
      const hindiMatch = w.hindiMeanings?.some(h => h.toLowerCase().includes(query));
      const defMatch = w.englishDefinitions?.some(d => d.toLowerCase().includes(query));
      const synMatch = w.synonyms?.some(s => s.toLowerCase().includes(query));
      return termMatch || hindiMatch || defMatch || synMatch;
    });
  }, [words, searchQuery]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setCurrentPage(1);
  };

  const handleScrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12">
      {/* Aspirant Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-b from-gray-900/90 via-gray-950/80 to-[#0b0f19] p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>UNIVERSAL COMPETITIVE VOCABULARY ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Master High-Yield English Vocabulary for Competitive Exams
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            Designed specifically for aspirants preparing for <span className="text-white font-semibold">SSC CGL, Banking (SBI/IBPS PO), UPSC, and State PSCs</span>. 
            Ground your preparation with our initial collection of <span className="text-indigo-400 font-bold">{totalDatabaseWords} Curated Seeded Words</span>, 
            complete with contextual Hindi translations, bilingual exam sentences, and memory-anchoring mnemonics.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleScrollToCatalog}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Word Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gray-900/80 border border-gray-800 text-xs font-medium text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Zero Exam Silos (Universal High-Yield Core)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Real Vocabulary Metrics Strip */}
      <section>
        <VocabularyMetrics totalWords={totalDatabaseWords} />
      </section>

      {/* Main Learning Hub & Vocabulary Catalog */}
      <section ref={catalogRef} className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Compass className="w-6 h-6 text-indigo-400" />
              <span>Vocabulary Explorer</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Browse words by domain category, filter by difficulty, or search across definitions and Hindi meanings.
            </p>
          </div>
        </div>

        {/* Filters & Search Component */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-800/80">
          <VocabularyFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={handleDifficultySelect}
            onReset={handleResetFilters}
            totalCount={totalDatabaseWords}
            filteredCount={displayedWords.length}
          />
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            <strong>Error connecting to database:</strong> {error}
          </div>
        )}

        {/* Word Cards Grid with Pagination */}
        <VocabularyGrid
          words={displayedWords}
          loading={loading}
          onSelectWord={(word) => setActiveWord(word)}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          totalWords={totalDatabaseWords}
          onResetFilters={handleResetFilters}
        />
      </section>

      {/* Word Detail Modal for Focused Study */}
      <WordDetailModal
        word={activeWord}
        onClose={() => setActiveWord(null)}
      />
    </div>
  );
}
