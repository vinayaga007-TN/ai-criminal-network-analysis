import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  Download, 
  Sliders, 
  Check, 
  Moon, 
  Sun 
} from 'lucide-react';
import { CASE_METADATA, CASE_ENTITIES, CASE_EDGES, CASE_EVIDENCE, CASE_ANOMALIES } from '../data/caseData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
}) => {
  const [temperature, setTemperature] = useState(0.1);
  const [strictHedging, setStrictHedging] = useState(true);
  const [autoVerifyLedger, setAutoVerifyLedger] = useState(true);
  const [exported, setExported] = useState(false);

  if (!isOpen) return null;

  const handleExportFullCase = () => {
    const fullCase = {
      metadata: CASE_METADATA,
      entities: CASE_ENTITIES,
      edges: CASE_EDGES,
      evidence: CASE_EVIDENCE,
      anomalies: CASE_ANOMALIES,
      exportTimestamp: new Date().toISOString(),
      blockVerification: 'SHA256:Block-1402',
    };
    const blob = new Blob([JSON.stringify(fullCase, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CASE_${CASE_METADATA.caseId}_FULL_LEDGER.json`;
    a.click();
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 flex flex-col space-y-5 ${
        theme === 'dark' ? 'bg-[#212124] border-zinc-700 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
      }`}>
        <div className="flex items-center justify-between border-b pb-3 border-inherit">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-base">Investigation & Inference Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-700/50 text-zinc-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case Info */}
        <div className={`p-3 rounded-xl border text-xs space-y-1 ${
          theme === 'dark' ? 'bg-zinc-800/60 border-zinc-700/60' : 'bg-zinc-50 border-zinc-200'
        }`}>
          <div className="flex justify-between">
            <span className="text-zinc-400">Case Identifier:</span>
            <span className="font-mono font-semibold">{CASE_METADATA.caseId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Lead Analyst / Officer:</span>
            <span className="font-medium">{CASE_METADATA.leadAnalyst}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Jurisdiction Command:</span>
            <span className="font-medium">{CASE_METADATA.jurisdiction}</span>
          </div>
        </div>

        {/* Model Inference Controls */}
        <div className="space-y-3 text-xs">
          <h4 className="font-semibold uppercase tracking-wider text-zinc-400 text-[10px]">
            Intelligence Engine Configuration
          </h4>

          {/* Temperature slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span>Model Temperature (Deterministic vs Creative):</span>
              <span className="font-mono font-bold text-cyan-400">{temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.7"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-zinc-500">
              0.10 is recommended for strictly deterministic, court-admissible synthesis.
            </p>
          </div>

          {/* Ethical Guardrails Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="font-medium block">Mandatory "No Guilt Declaration" Guardrails</span>
              <span className="text-[10px] text-zinc-500">
                Forces terms like "Potential connection", "Requires verification".
              </span>
            </div>
            <input
              type="checkbox"
              checked={strictHedging}
              onChange={(e) => setStrictHedging(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Auto Ledger Anchor Toggle */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="font-medium block">Automatic SHA-256 Ledger Anchoring</span>
              <span className="text-[10px] text-zinc-500">
                Logs every query & OCR pass into immutable block history.
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoVerifyLedger}
              onChange={(e) => setAutoVerifyLedger(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Theme switcher */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="font-medium block">Appearance Theme</span>
              <span className="text-[10px] text-zinc-500">Currently in {theme} mode</span>
            </div>
            <button
              onClick={onToggleTheme}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-medium ${
                theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-zinc-100 border-zinc-300 text-zinc-800'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span className="capitalize">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>

        {/* Full Case Export */}
        <div className="pt-2 border-t border-inherit flex items-center justify-between">
          <button
            onClick={handleExportFullCase}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              theme === 'dark'
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
            }`}
          >
            {exported ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
            <span>{exported ? 'Case Exported' : 'Export Full Case JSON'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
