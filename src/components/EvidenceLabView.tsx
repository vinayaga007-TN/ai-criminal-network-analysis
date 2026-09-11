import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Check, 
  Copy, 
  Eye, 
  Hash, 
  Sparkles, 
  Share2, 
  MessageSquare,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { EvidenceItem } from '../types';
import { CASE_EVIDENCE } from '../data/caseData';

interface EvidenceLabViewProps {
  selectedEvidenceId?: string;
  onAskAIAboutEvidence: (evidenceTitle: string) => void;
  onNavigateToNetwork: () => void;
  theme: 'dark' | 'light';
}

export const EvidenceLabView: React.FC<EvidenceLabViewProps> = ({
  selectedEvidenceId,
  onAskAIAboutEvidence,
  onNavigateToNetwork,
  theme,
}) => {
  const [activeEvidence, setActiveEvidence] = useState<EvidenceItem>(
    CASE_EVIDENCE.find((e) => e.id === selectedEvidenceId) || CASE_EVIDENCE[0]
  );
  const [ocrErrorState, setOcrErrorState] = useState<'normal' | 'decode_failed' | 'ocr_failed'>('normal');
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [reviewedText, setReviewedText] = useState(activeEvidence.rawSnippet);
  const [activeBox, setActiveBox] = useState<string | null>(null);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(activeEvidence.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleRunOcr = () => {
    setIsProcessingOcr(true);
    setTimeout(() => {
      setIsProcessingOcr(false);
      setOcrErrorState('normal');
    }, 1200);
  };

  return (
    <div className={`flex flex-col h-full w-full overflow-y-auto scrollbar-thin ${
      theme === 'dark' ? 'bg-[#18181b] text-[#f4f4f5]' : 'bg-[#fcfcfd] text-[#18181b]'
    }`}>
      {/* Evidence Selector Bar */}
      <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
        theme === 'dark' ? 'bg-[#1e1e22] border-[#2c2c30]' : 'bg-white border-zinc-200'
      }`}>
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1 shrink-0">
            Select Evidence:
          </span>
          {CASE_EVIDENCE.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveEvidence(item);
                setReviewedText(item.rawSnippet);
                setOcrErrorState('normal');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 border ${
                activeEvidence.id === item.id
                  ? theme === 'dark'
                    ? 'bg-zinc-700 text-white border-zinc-600 font-semibold shadow-xs'
                    : 'bg-zinc-900 text-white border-zinc-900 font-semibold shadow-xs'
                  : theme === 'dark'
                    ? 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-700/60'
                    : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{item.id}</span>
              <span className="text-[10px] opacity-70">({item.type})</span>
            </button>
          ))}
        </div>

        {/* Simulator error state toggles for evaluation */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-zinc-400 mr-1 hidden sm:inline">Simulate OCR State:</span>
          <button
            onClick={() => setOcrErrorState('normal')}
            className={`px-2 py-1 rounded text-[11px] font-medium ${
              ocrErrorState === 'normal' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Normal (Decoded)
          </button>
          <button
            onClick={() => setOcrErrorState('decode_failed')}
            className={`px-2 py-1 rounded text-[11px] font-medium ${
              ocrErrorState === 'decode_failed' 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Decode Failed
          </button>
          <button
            onClick={() => setOcrErrorState('ocr_failed')}
            className={`px-2 py-1 rounded text-[11px] font-medium ${
              ocrErrorState === 'ocr_failed' 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            OCR Failed
          </button>
        </div>
      </div>

      {/* Main Split Screen Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        
        {/* LEFT PANE: Document Preview with Bounding Boxes (5 cols on lg) */}
        <div className={`lg:col-span-6 p-6 border-b lg:border-b-0 lg:border-r flex flex-col justify-between ${
          theme === 'dark' ? 'bg-[#151518] border-[#2c2c30]' : 'bg-[#f4f4f7] border-zinc-200'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Source Document Visual ({activeEvidence.documentNumber})</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                Resolution: 300 DPI Raw
              </span>
            </div>

            {/* Document Canvas Mockup (Handwritten Police Seizure Memo / FIR format) */}
            <div className={`relative rounded-xl p-6 border shadow-sm select-none transition-all ${
              theme === 'dark' ? 'bg-[#232328] border-zinc-700 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-900'
            }`}>
              {/* Police Header Stamp */}
              <div className="border-b border-dashed border-zinc-500/40 pb-3 mb-4 text-center">
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                  Government of NCT of Delhi // Police Department
                </p>
                <p className="text-xs font-bold font-mono tracking-tight mt-0.5">
                  MALKHANA SEIZURE MEMO & CRIME EXHIBIT REGISTER
                </p>
                <p className="text-[10px] font-mono text-zinc-500">
                  REF: {activeEvidence.documentNumber} • PS: METRO CENTRAL
                </p>
              </div>

              {/* Simulated Document Body with Interactive Bounding Boxes */}
              <div className="text-xs leading-relaxed font-serif space-y-3 relative">
                <p>
                  On this date {activeEvidence.date}, pursuant to investigation under FIR-204, officers conducted physical inspection at Subhash Chowk commercial premises.
                </p>

                {/* Bounding Box 1: Deepak Mehta */}
                <div className="relative my-2 inline-block">
                  <span 
                    onMouseEnter={() => setActiveBox('Deepak Mehta')}
                    onMouseLeave={() => setActiveBox(null)}
                    className={`px-2 py-1 rounded border font-mono font-semibold transition-all cursor-pointer ${
                      activeBox === 'Deepak Mehta'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/50'
                        : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                    }`}
                  >
                    [BOX #01: Deepak Mehta (Suspected Receiver)]
                  </span>
                </div>

                <p>
                  Found in possession of unregistered financial ledgers and motor vehicle keys bearing registration tag:
                </p>

                {/* Bounding Box 2: Vehicle */}
                <div className="relative my-2 inline-block">
                  <span 
                    onMouseEnter={() => setActiveBox('DL-04-CK-8812')}
                    onMouseLeave={() => setActiveBox(null)}
                    className={`px-2 py-1 rounded border font-mono font-semibold transition-all cursor-pointer ${
                      activeBox === 'DL-04-CK-8812'
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300 ring-2 ring-sky-500/50'
                        : 'bg-sky-500/10 border-sky-500/50 text-sky-400'
                    }`}
                  >
                    [BOX #02: DL-04-CK-8812 (Bajaj Pulsar 220)]
                  </span>
                </div>

                <p>
                  Incident perimeter documented adjacent to intersection:
                </p>

                {/* Bounding Box 3: Location */}
                <div className="relative my-2 inline-block">
                  <span 
                    onMouseEnter={() => setActiveBox('Subhash Chowk, Sector 18')}
                    onMouseLeave={() => setActiveBox(null)}
                    className={`px-2 py-1 rounded border font-mono font-semibold transition-all cursor-pointer ${
                      activeBox === 'Subhash Chowk, Sector 18'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/50'
                        : 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                    }`}
                  >
                    [BOX #03: Subhash Chowk, Sector 18]
                  </span>
                </div>

                <p>
                  Sum of confiscated unaccounted currency recovered inside journal:
                </p>

                {/* Bounding Box 4: Currency */}
                <div className="relative my-2 inline-block">
                  <span 
                    onMouseEnter={() => setActiveBox('₹45,000 Cash')}
                    onMouseLeave={() => setActiveBox(null)}
                    className={`px-2 py-1 rounded border font-mono font-semibold transition-all cursor-pointer ${
                      activeBox === '₹45,000 Cash'
                        ? 'bg-teal-500/20 border-teal-500 text-teal-300 ring-2 ring-teal-500/50'
                        : 'bg-teal-500/10 border-teal-500/50 text-teal-400'
                    }`}
                  >
                    [BOX #04: ₹45,000 Cash (Currency)]
                  </span>
                </div>

                {/* Simulated Stamp / Thumb Impression */}
                <div className="pt-6 flex justify-between items-end text-[10px] text-zinc-500 font-mono">
                  <div>
                    <p>Verified by IO Sub-Inspector</p>
                    <p className="font-semibold text-zinc-400">SI K. Sharma // Reg #9901</p>
                  </div>
                  <div className="w-14 h-14 border border-zinc-600 rounded-full flex items-center justify-center text-[9px] text-zinc-500 rotate-[-12deg]">
                    SEALED
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Upload Dropzone (ChatGPT style) */}
          <div className="mt-6">
            <div className={`p-4 rounded-xl border border-dashed flex flex-col items-center justify-center text-center transition-colors ${
              theme === 'dark' ? 'border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/70' : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100'
            }`}>
              <UploadCloud className="w-6 h-6 text-zinc-400 mb-1.5" />
              <p className="text-xs font-medium">Upload investigation evidence</p>
              <p className="text-[11px] text-zinc-500">JPG · PNG · WebP · PDF (Max 50MB)</p>
              <button className={`mt-2.5 px-3 py-1 rounded-lg text-xs font-medium border ${
                theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'
              }`}>
                Choose file
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: AI Transcription & Provenance Card (7 cols on lg) */}
        <div className={`lg:col-span-6 p-6 flex flex-col justify-between ${
          theme === 'dark' ? 'bg-[#1e1e22]' : 'bg-white'
        }`}>
          <div className="space-y-5">
            
            {/* OCR Header & Status Indicator */}
            <div className="flex items-center justify-between border-b pb-3 border-inherit">
              <div>
                <h3 className="font-semibold text-sm leading-tight">Handwritten FIR & Proof Reader</h3>
                <div className="flex items-center gap-2 mt-1">
                  {ocrErrorState === 'normal' && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Image decoded successfully
                    </span>
                  )}
                  {ocrErrorState === 'decode_failed' && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Image decoding failed
                    </span>
                  )}
                  {ocrErrorState === 'ocr_failed' && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      OCR could not complete
                    </span>
                  )}
                </div>
              </div>

              {ocrErrorState === 'normal' && (
                <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                  theme === 'dark' ? 'bg-zinc-800 text-cyan-400' : 'bg-zinc-100 text-zinc-900'
                }`}>
                  Confidence: {activeEvidence.confidence}%
                </div>
              )}
            </div>

            {/* OCR Error State UI Handlers */}
            {ocrErrorState === 'decode_failed' && (
              <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
                theme === 'dark' ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex gap-2.5 items-start">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-semibold">Image decoding failed</p>
                    <p className="opacity-90">
                      The evidence fingerprint was preserved, but the uploaded image could not be decoded. Check file headers or format integrity.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleRunOcr}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => setOcrErrorState('normal')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'
                    }`}
                  >
                    Enter Reviewed Transcription
                  </button>
                </div>
              </div>
            )}

            {ocrErrorState === 'ocr_failed' && (
              <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
                theme === 'dark' ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="flex gap-2.5 items-start">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-semibold">Automatic OCR could not complete</p>
                    <p className="opacity-90">
                      The image was decoded successfully, but automatic OCR could not complete due to low contrast or script distortion.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleRunOcr}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-colors"
                  >
                    Retry OCR
                  </button>
                  <button
                    onClick={() => setOcrErrorState('normal')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'
                    }`}
                  >
                    Review Transcription
                  </button>
                </div>
              </div>
            )}

            {/* Editable AI Transcription Area */}
            {ocrErrorState === 'normal' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Transcribed Text & Review
                  </label>
                  <span className="text-[10px] text-zinc-500">Edit allowed for human review</span>
                </div>
                <textarea
                  rows={6}
                  value={reviewedText}
                  onChange={(e) => setReviewedText(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-xs font-mono leading-relaxed outline-none transition-colors ${
                    theme === 'dark'
                      ? 'bg-[#26262b] border-zinc-700 text-zinc-200 focus:border-cyan-500'
                      : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-500'
                  }`}
                />
              </div>
            )}

            {/* Extracted Entities Chips */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Extracted Entities & Grounding
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeEvidence.extractedEntities.map((ent, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                      activeBox === ent.name
                        ? 'border-cyan-500 bg-cyan-950/30'
                        : theme === 'dark' ? 'bg-[#26262b] border-zinc-700/60' : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <div>
                      <span className="font-semibold block">{ent.name}</span>
                      <span className="text-[10px] text-zinc-400">{ent.role}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      theme === 'dark' ? 'bg-zinc-800 text-emerald-400' : 'bg-zinc-200 text-emerald-700'
                    }`}>
                      {ent.confidence}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Fingerprint Card */}
            <div className={`p-4 rounded-xl border text-xs space-y-2.5 ${
              theme === 'dark' ? 'bg-[#232328] border-zinc-700/80' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <div className="flex items-center justify-between border-b pb-2 border-inherit">
                <span className="font-semibold flex items-center gap-1.5 text-zinc-300 dark:text-zinc-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Evidence Fingerprint</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">
                  Provenance Preserved
                </span>
              </div>

              {/* SHA-256 Hash Display with Copy Button */}
              <div>
                <span className="text-[10px] text-zinc-400 font-mono block mb-1">SHA-256 CRYPTOGRAPHIC FINGERPRINT</span>
                <div className={`flex items-center justify-between p-2 rounded-lg font-mono text-[11px] break-all ${
                  theme === 'dark' ? 'bg-zinc-900 border border-zinc-800 text-cyan-300' : 'bg-white border border-zinc-300 text-slate-900'
                }`}>
                  <span className="truncate mr-2">{activeEvidence.sha256}</span>
                  <button
                    onClick={handleCopyHash}
                    title="Copy full SHA-256 hash"
                    className="p-1 hover:bg-zinc-700/50 rounded shrink-0 transition-colors"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-zinc-400 block text-[10px]">SOURCE:</span>
                  <span className="font-medium truncate block">{activeEvidence.source}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px]">PROCESSING:</span>
                  <span className="font-medium truncate block">{activeEvidence.processing}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar at Bottom */}
          <div className="pt-5 border-t border-inherit flex flex-wrap items-center gap-2">
            <button
              id="run-ocr-btn"
              onClick={handleRunOcr}
              disabled={isProcessingOcr}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessingOcr ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isProcessingOcr ? 'Running OCR...' : 'Run OCR'}</span>
            </button>

            <button
              id="ask-ai-evidence-btn"
              onClick={() => onAskAIAboutEvidence(activeEvidence.title)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask AI About This FIR</span>
            </button>

            <button
              id="push-network-evidence-btn"
              onClick={onNavigateToNetwork}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors ml-auto shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Push to Network Graph</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
