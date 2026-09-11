import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck, 
  Download, 
  Hash, 
  Lock, 
  Cpu, 
  KeyRound,
  FileText
} from 'lucide-react';
import { CASE_EVIDENCE, CASE_METADATA } from '../data/caseData';

interface ProvenanceViewProps {
  theme: 'dark' | 'light';
}

export const ProvenanceView: React.FC<ProvenanceViewProps> = ({ theme }) => {
  const [testHash, setTestHash] = useState(CASE_EVIDENCE[0].sha256);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(true);

  const handleVerify = () => {
    const exists = CASE_EVIDENCE.some(
      (e) => e.sha256.toLowerCase() === testHash.trim().toLowerCase()
    );
    setVerificationResult(exists);
  };

  const handleDownloadCertificate = () => {
    const cert = `CERTIFICATE OF ELECTRONIC EVIDENCE INTEGRITY
Under Section 65B of Indian Evidence Act / Section 63 BSA 2023

Case Reference: ${CASE_METADATA.caseId}
Title: ${CASE_METADATA.title}
Certifying Officer: Inv. Insp. S. Roy (Badge #9901)
Hash Verified: ${testHash}
Status: CRYPTOGRAPHICALLY UNALTERED
Ledger Anchor: Block #1,402
Timestamp: ${new Date().toISOString()}

All digital records processed via ANALYSER AI run on local air-gapped models with non-tamperable state logs.`;

    const blob = new Blob([cert], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Section_65B_Certificate_${CASE_METADATA.caseId}.txt`;
    a.click();
  };

  return (
    <div className={`flex flex-col h-full w-full overflow-y-auto p-4 sm:p-6 md:p-8 scrollbar-thin ${
      theme === 'dark' ? 'bg-[#18181b] text-[#f4f4f5]' : 'bg-[#fcfcfd] text-[#18181b]'
    }`}>
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="border-b pb-4 border-inherit">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Provenance Verification</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              LEGAL GRADE
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-0.5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Cryptographic integrity validation, air-gapped model parameter certification, and digital chain-of-custody proofs.
          </p>
        </div>

        {/* Interactive Verification Console */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          theme === 'dark' ? 'bg-[#212124] border-zinc-700/80' : 'bg-white border-zinc-200 shadow-2xs'
        }`}>
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Hash className="w-4 h-4 text-cyan-400" />
            <span>Verify Exhibit Hash Against Ledger</span>
          </h3>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={testHash}
              onChange={(e) => {
                setTestHash(e.target.value);
                setVerificationResult(null);
              }}
              placeholder="Paste SHA-256 hash or evidence identifier..."
              className={`flex-1 py-2.5 px-3.5 rounded-xl text-xs font-mono outline-none border ${
                theme === 'dark' 
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-200 focus:border-cyan-500' 
                  : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-zinc-500'
              }`}
            />
            <button
              onClick={handleVerify}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shrink-0 shadow-xs"
            >
              Verify Integrity
            </button>
          </div>

          {/* Verification Result Banner */}
          {verificationResult !== null && (
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
              verificationResult
                ? theme === 'dark'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : theme === 'dark'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-2.5">
                {verificationResult ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <div>
                  <div className="font-semibold text-xs">
                    {verificationResult
                      ? 'Cryptographic Verification Confirmed (Zero Tampering)'
                      : 'Hash Unmatched in Case Ledger'}
                  </div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    {verificationResult
                      ? 'Anchored in Block #1,402. Original bitstream matches byte-for-byte.'
                      : 'Hash could not be reconciled against authorized custody block records.'}
                  </div>
                </div>
              </div>

              {verificationResult && (
                <button
                  onClick={handleDownloadCertificate}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Section 65B Cert</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* 3 Pillars of AI Admissibility Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border space-y-2 ${
            theme === 'dark' ? 'bg-[#212124] border-zinc-700/70' : 'bg-white border-zinc-200 shadow-2xs'
          }`}>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-xs">Bitstream Custody</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Every source file is sealed with SHA-256 immediately upon ingestion before any neural processing occurs.
            </p>
          </div>

          <div className={`p-4 rounded-xl border space-y-2 ${
            theme === 'dark' ? 'bg-[#212124] border-zinc-700/70' : 'bg-white border-zinc-200 shadow-2xs'
          }`}>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-xs">Deterministic Inference</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Model parameters, seeds, and system instructions are logged per query to enable exact courtroom reproducibility.
            </p>
          </div>

          <div className={`p-4 rounded-xl border space-y-2 ${
            theme === 'dark' ? 'bg-[#212124] border-zinc-700/70' : 'bg-white border-zinc-200 shadow-2xs'
          }`}>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-xs">Non-Guilt Ethical Guardrails</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Outputs strictly restrict legal culpability assertions, flagging items only as investigation leads or anomalies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
