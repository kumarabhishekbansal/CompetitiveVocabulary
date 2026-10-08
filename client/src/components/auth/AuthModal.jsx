import React, { useState, useEffect, useRef } from 'react';
import { X, LogIn, UserPlus, Lock, Mail, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const { login, register, clearError } = useAuth();
  const dialogRef = useRef(null);

  useEffect(() => {
    setMode(initialMode);
    setFormError(null);
  }, [initialMode, isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
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

    const handleBackdropClick = (e) => {
      if (e.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const inDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!inDialog) {
        onClose();
      }
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleBackdropClick);

    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!email.trim() || !password.trim()) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setFormError('Name is required to register');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    let res;
    if (mode === 'login') {
      res = await login(email, password);
    } else {
      res = await register(name, email, password);
    }
    setSubmitting(false);

    if (res.success) {
      setName('');
      setEmail('');
      setPassword('');
      onClose();
    } else {
      setFormError(res.error || 'Authentication failed');
    }
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="auth-modal-title"
      className="m-auto w-full max-w-md rounded-3xl border border-gray-800 bg-[#0d121f] text-gray-100 p-0 shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm overflow-hidden"
    >
      {/* Modal Header & Tabs */}
      <div className="relative border-b border-gray-800/80 bg-gray-950/80 px-6 pt-5 pb-3">
        <div className="flex items-center justify-between pb-3">
          <h2 id="auth-modal-title" className="text-xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'Sign In to VocabMastery' : 'Create Aspirant Account'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 hover:text-white hover:bg-gray-800/80 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-gray-900 p-1 border border-gray-800">
          <button
            type="button"
            onClick={() => { setMode('login'); setFormError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setFormError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {formError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{formError}</span>
          </div>
        )}

        {mode === 'register' && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Kumar"
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aspirant@example.com"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-300">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <p className="text-[11px] text-gray-500 pt-0.5">Minimum 6 characters</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{mode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
            </>
          ) : (
            <span>{mode === 'login' ? 'Sign In' : 'Create Free Account'}</span>
          )}
        </button>

        <div className="text-center pt-2">
          <span className="text-xs text-gray-500">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setFormError(null);
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline cursor-pointer"
          >
            {mode === 'login' ? 'Register now' : 'Sign in'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
