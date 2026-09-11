import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  MessageSquare, 
  ExternalLink, 
  Filter, 
  Activity, 
  Cpu, 
  Clock, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { AnomalyItem } from '../types';
import { CASE_ANOMALIES } from '../data/caseData';

interface AnomaliesViewProps {
  onAskAIAboutAnomaly: (anomalyTitle: string) => void;
  onNavigateToEvidence: (evidenceId: string) => void;
  theme: 'dark' | 'light';
}

export const AnomaliesView: React.FC<AnomaliesViewProps> = ({
  onAskAIAboutAnomaly,
  onNavigateToEvidence,
  theme,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [detectionFilter, setDetectionFilter] = useState<string>('all');

  const filteredAnomalies = CASE_ANOMALIES.filter((a) => {
    const matchesSeverity = severityFilter === 'all' || a.severity.toLowerCase() === severityFilter.toLowerCase();
    const matchesDetection = detectionFilter === 'all' || a.detectionMethod.toLowerCase() === detectionFilter.toLowerCase();
    return matchesSeverity && matchesDetection;
  });

  return (
    <div className={`flex flex-col h-full w-full overflow-y-auto p-4 sm:p-6 md:p-8 scrollbar-thin ${
      theme === 'dark' ? 'bg-[#18181b] text-[#f4f4f5]' : 'bg-[#fcfcfd] text-[#18181b]'
    }`}>
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        {/* Header Area */}
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Anomaly Intelligence</h2>
          <p className={`text-xs sm:text-sm mt-0.5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Algorithmic pattern scans flagging statistical irregularities across financial, telephony, and spatiotemporal matrices.
          </p>
        </div>

        {/* Mandatory Ethical Disclaimer Banner */}
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          theme === 'dark'
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
          <div className="text-xs">
            <span className="font-semibold block">Important Investigative Guideline</span>
            <p className="opacity-90 mt-0.5">
              Anomalies are unusual patterns, not proof of wrongdoing. All findings must be corroborated against original source logs.
            </p>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-inherit">
          {/* Severity Tabs */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1">Severity:</span>
            {['all', 'High', 'Medium', 'Low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors border ${
                  severityFilter === sev
                    ? theme === 'dark'
                      ? 'bg-zinc-700 text-white border-zinc-600 font-semibold shadow-xs'
                      : 'bg-zinc-900 text-white border-zinc-900 font-semibold shadow-xs'
                    : theme === 'dark'
                      ? 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-zinc-200'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:text-zinc-900'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Engine Selector */}
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={detectionFilter}
              onChange={(e) => setDetectionFilter(e.target.value)}
              className={`text-xs py-1 px-2.5 rounded-lg border outline-none ${
                theme === 'dark'
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                  : 'bg-white border-zinc-300 text-zinc-800'
              }`}
            >
              <option value="all">All Detection Engines</option>
              <option value="Rule-based">Rule-based Structuring</option>
              <option value="Isolation Forest">Isolation Forest</option>
              <option value="Telephony Heuristic">Telephony Heuristic</option>
              <option value="Benford Analysis">Benford Analysis</option>
              <option value="Spatiotemporal">Spatiotemporal</option>
            </select>
          </div>
        </div>

        {/* Anomalies List */}
        <div className="space-y-3">
          {filteredAnomalies.map((anom) => (
            <div
              key={anom.id}
              id={`anomaly-card-${anom.id}`}
              className={`p-4 rounded-xl border transition-all ${
                theme === 'dark'
                  ? 'bg-[#212124] border-zinc-700/70 hover:border-zinc-600'
                  : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-2xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2.5 border-inherit">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                    anom.severity === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    anom.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {anom.severity} Severity
                  </span>
                  <h3 className="font-semibold text-sm leading-tight">{anom.title}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="text-[11px] font-mono">{anom.detectedAt}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                    theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                  }`}>
                    {anom.detectionMethod}
                  </span>
                </div>
              </div>

              {/* Description & Target */}
              <div className="pt-3 text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Target Entity:</span>
                  <span className="font-semibold text-cyan-400">{anom.entityName}</span>
                </div>

                <p className="opacity-90">{anom.description}</p>

                {/* Footer buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <button
                    onClick={() => onNavigateToEvidence(anom.evidenceRef)}
                    className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded border transition-colors ${
                      theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <FileText className="w-3 h-3 text-emerald-400" />
                    <span>Evidence Ref: {anom.evidenceRef}</span>
                  </button>

                  <button
                    onClick={() => onAskAIAboutAnomaly(anom.title)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Investigate in Copilot</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
