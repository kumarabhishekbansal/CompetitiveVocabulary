import React, { useState } from 'react';
import { BookOpen, Menu, X, Sparkles, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';

export default function Navbar({ backendHealth, totalWords = 50, onScrollToCatalog }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const { user, isAuthenticated, logout } = useAuth();

  const isHealthy = backendHealth?.status === 'healthy';
  const dbConnected = backendHealth?.database?.status === 'connected';

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass-panel border-b border-gray-800/80 bg-gray-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                    VocabMastery
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Universal Core
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium">Competitive Exam English</p>
              </div>
            </div>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center gap-5">
              <button
                onClick={onScrollToCatalog}
                className="text-sm font-medium text-gray-300 hover:text-white transition cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Word Catalog
              </button>

              {/* Live Words Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{totalWords} Seeded Words</span>
              </div>

              {/* Authentication Controls */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3 pl-3 border-l border-gray-800">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs">
                      {user?.name?.[0]?.toUpperCase() || <User className="w-3.5 h-3.5" />}
                    </div>
                    <span className="font-semibold text-gray-200">{user?.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-rose-400 transition cursor-pointer"
                    title="Log out"
                    aria-label="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pl-3 border-l border-gray-800">
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className="text-xs px-3.5 py-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition font-semibold cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleOpenAuth('register')}
                    className="text-xs px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Subtle Backend Connection Indicator */}
              <div className="flex items-center gap-2 pl-3 border-l border-gray-800" title={`API: ${isHealthy ? 'Online' : 'Offline'} | Database: ${dbConnected ? 'Connected' : 'Connecting'}`}>
                <div className={`w-2 h-2 rounded-full ${isHealthy && dbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-[11px] font-mono text-gray-400">
                  {isHealthy && dbConnected ? (
                    <span className="text-emerald-400 font-medium">Atlas Live</span>
                  ) : (
                    <span className="text-amber-400 font-medium">Connecting</span>
                  )}
                </span>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isHealthy && dbConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-950/95 px-4 pt-3 pb-4 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onScrollToCatalog) onScrollToCatalog();
              }}
              className="w-full text-left py-2 text-sm font-medium text-gray-200 hover:text-white flex items-center justify-between"
            >
              <span>Browse {totalWords} Seeded Words</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-mono">
                Catalog
              </span>
            </button>

            {/* Auth in Mobile */}
            <div className="pt-2 border-t border-gray-800/80">
              {isAuthenticated ? (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-200">{user?.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 text-rose-400 border border-gray-800"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 py-2">
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-gray-900 border border-gray-800 text-gray-300"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleOpenAuth('register')}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            <div className="py-2 flex items-center justify-between text-xs font-mono border-t border-gray-800/60 pt-2 text-gray-400">
              <span>Database Status:</span>
              <span className={dbConnected ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                {dbConnected ? 'MongoDB Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
}
