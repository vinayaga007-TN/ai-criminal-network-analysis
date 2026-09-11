import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Lock, 
  FileCheck, 
  Check, 
  Copy, 
  Filter, 
  Database,
  UserCheck
} from 'lucide-react';
import { AuditLogItem } from '../types';
import { CASE_AUDIT_TRAIL } from '../data/caseData';

interface AuditTrailViewProps {
  theme: 'dark' | 'light';
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ theme }) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = CASE_AUDIT_TRAIL.filter((log) => {
    const matchesSearch = !search || 
      log.action.toLowerCase().includes(search.toLowerCase()) || 
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      (log.hash && log.hash.toLowerCase().includes(search.toLowerCase())) ||
      (log.actor && log.actor.toLowerCase().includes(search.toLowerCase()));
    const matchesAction = actionFilter === 'all' || log.action.toLowerCase().includes(actionFilter.toLowerCase());
    return matchesSearch && matchesAction;
  });

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className={`flex flex-col h-full w-full overflow-y-auto p-4 sm:p-6 md:p-8 scrollbar-thin ${
      theme === 'dark' ? 'bg-[#18181b] text-[#f4f4f5]' : 'bg-[#fcfcfd] text-[#18181b]'
    }`}>
      <div className="max-w-5xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-inherit">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight">Audit Trail & Chain of Custody</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LEDGER ACTIVE
              </span>
            </div>
            <p className={`text-xs sm:text-sm mt-0.5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Cryptographic ledger recording all investigator actions, evidence additions, and model runs.
            </p>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs ${
            theme === 'dark' ? 'bg-[#212124] border-zinc-700' : 'bg-white border-zinc-200 shadow-2xs'
          }`}>
            <Lock className="w-4 h-4 text-emerald-500" />
            <div>
              <div className="font-semibold text-[11px]">SHA-256 Ledger Anchor</div>
              <div className="text-[10px] text-zinc-400 font-mono">Block #1,402 (Zero Drift)</div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search audit actions, investigator, or block hash..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full py-2 pl-9 pr-3 rounded-xl text-xs outline-none border transition-colors ${
                theme === 'dark'
                  ? 'bg-[#212124] border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-cyan-500'
                  : 'bg-white border-zinc-300 text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-400 shadow-2xs'
              }`}
            />
          </div>

          <div className="flex items-center gap-1">
            {['all', 'Evidence', 'Query', 'Anomaly', 'Graph'].map((act) => (
              <button
                key={act}
                onClick={() => setActionFilter(act)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors border ${
                  actionFilter === act
                    ? theme === 'dark'
                      ? 'bg-zinc-700 text-white border-zinc-600 font-semibold shadow-xs'
                      : 'bg-zinc-900 text-white border-zinc-900 font-semibold shadow-xs'
                    : theme === 'dark'
                      ? 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-zinc-200'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:text-zinc-900'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Trail List */}
        <div className={`rounded-xl border divide-y ${
          theme === 'dark' ? 'bg-[#212124] border-zinc-700/80 divide-zinc-800' : 'bg-white border-zinc-200 divide-zinc-100 shadow-2xs'
        }`}>
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {log.blockNumber || '#1,402'}
                  </span>
                  <h4 className="font-semibold text-xs leading-tight">{log.action}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    theme === 'dark' ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
                  }`}>
                    {log.user || log.actor}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-zinc-400">{log.timestamp}</span>
              </div>

              <p className={`text-xs ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {log.details}
              </p>

              {/* Block Hash */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 truncate max-w-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">Hash: {log.blockHash || log.hash}</span>
                </div>

                <button
                  onClick={() => handleCopy(log.blockHash || log.hash)}
                  title="Copy Block Hash"
                  className="p-1 hover:bg-zinc-700/50 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {copiedHash === (log.blockHash || log.hash) ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
