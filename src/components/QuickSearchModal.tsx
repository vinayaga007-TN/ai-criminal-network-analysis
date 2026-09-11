import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  User, 
  Building, 
  FileText, 
  AlertTriangle, 
  Clock, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { CASE_ENTITIES, CASE_EVIDENCE, CASE_ANOMALIES } from '../data/caseData';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntity: (entityId: string) => void;
  onSelectEvidence: (evidenceId: string) => void;
  onSelectAnomaly: () => void;
  theme: 'dark' | 'light';
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectEntity,
  onSelectEvidence,
  onSelectAnomaly,
  theme,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredEntities = query
    ? CASE_ENTITIES.filter(
        (e) =>
          e.name.toLowerCase().includes(query.toLowerCase()) ||
          e.role.toLowerCase().includes(query.toLowerCase()) ||
          (e.alias && e.alias.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 4)
    : [];

  const filteredEvidence = query
    ? CASE_EVIDENCE.filter(
        (e) =>
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.documentNumber.toLowerCase().includes(query.toLowerCase()) ||
          e.rawSnippet.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const filteredAnomalies = query
    ? CASE_ANOMALIES.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase()) ||
          a.entityName.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-fade-in">
      <div className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${
        theme === 'dark' ? 'bg-[#212124] border-zinc-700 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
      }`}>
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-inherit gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search entities, evidence documents, anomalies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-sm placeholder:text-zinc-500"
          />
          <kbd className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
            theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-zinc-100 border-zinc-200 text-zinc-500'
          }`}>
            ESC
          </kbd>
        </div>

        {/* Results Stream */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 scrollbar-thin">
          {!query && (
            <div className="py-8 text-center text-xs text-zinc-500">
              <p>Type to search across Case NX-2047 ledger.</p>
              <p className="text-[11px] mt-1 text-zinc-400">Try "Deepak", "Om Enterprises", "Seizure", "Burner"</p>
            </div>
          )}

          {/* Entities Group */}
          {filteredEntities.length > 0 && (
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 px-2 block mb-1">
                Entities ({filteredEntities.length})
              </span>
              <div className="space-y-1">
                {filteredEntities.map((ent) => (
                  <div
                    key={ent.id}
                    onClick={() => {
                      onSelectEntity(ent.id);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center text-xs text-cyan-400">
                        {ent.type === 'person' ? <User className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="text-xs font-semibold block">{ent.name}</span>
                        <span className="text-[10px] text-zinc-400">{ent.role}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Group */}
          {filteredEvidence.length > 0 && (
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 px-2 block mb-1">
                Evidence Documents ({filteredEvidence.length})
              </span>
              <div className="space-y-1">
                {filteredEvidence.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => {
                      onSelectEvidence(ev.id);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold block">{ev.title}</span>
                        <span className="text-[10px] font-mono text-zinc-400">{ev.documentNumber}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anomalies Group */}
          {filteredAnomalies.length > 0 && (
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 px-2 block mb-1">
                Anomalies ({filteredAnomalies.length})
              </span>
              <div className="space-y-1">
                {filteredAnomalies.map((an) => (
                  <div
                    key={an.id}
                    onClick={() => {
                      onSelectAnomaly();
                      onClose();
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold block">{an.title}</span>
                        <span className="text-[10px] text-zinc-400">{an.detectionMethod}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-2.5 border-t border-inherit text-[10px] flex items-center justify-between ${
          theme === 'dark' ? 'bg-zinc-900/60 text-zinc-500' : 'bg-zinc-50 text-zinc-400'
        }`}>
          <span>SHA-256 Ledger Search active</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
