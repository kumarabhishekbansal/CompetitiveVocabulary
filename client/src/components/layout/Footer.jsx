import React, { useState } from 'react';
import { ShieldCheck, Activity, ChevronDown, ChevronUp } from 'lucide-react';

export default function Footer({ backendHealth }) {
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const isHealthy = backendHealth?.status === 'healthy';

  return (
    <footer className="border-t border-gray-800/80 bg-gray-950/70 text-gray-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-gray-300">VocabMastery Platform</span>
            <span className="text-gray-600">•</span>
            <span>Universal Competitive Vocabulary for SSC, Banking, UPSC & State PSCs</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-500">
              50 Initial Seeded Words • Zero Exam Silos
            </span>

            {/* Subtle System Status Toggle */}
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-[11px] text-gray-400 hover:text-gray-200 transition cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>System Status</span>
              {showDiagnostics ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Collapsible Subtle Diagnostics Drawer */}
        {showDiagnostics && (
          <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 text-xs space-y-2 pt-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800/80 font-semibold text-gray-300">
              <span>Backend & Database Connectivity Diagnostics</span>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${isHealthy ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {backendHealth?.status || 'Probing'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-gray-400 font-mono text-[11px]">
              <div>
                API Service: <strong className="text-gray-200">{backendHealth?.service || 'API Server'}</strong>
              </div>
              <div>
                Database: <strong className="text-gray-200">{backendHealth?.database?.status || 'Unknown'}</strong> ({backendHealth?.database?.databaseName || 'competitive_vocab'})
              </div>
              <div>
                Uptime: <strong className="text-gray-200">{backendHealth?.uptime || 'N/A'}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
