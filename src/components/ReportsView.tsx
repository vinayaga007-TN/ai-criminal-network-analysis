import React, { useState } from 'react';
import { 
  FileBarChart2, 
  Download, 
  FileText, 
  Eye, 
  RefreshCw, 
  Check, 
  X, 
  Sparkles,
  Share2,
  Lock
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ReportItem } from '../types';
import { CASE_REPORTS } from '../data/caseData';

interface ReportsViewProps {
  theme: 'dark' | 'light';
}

export const ReportsView: React.FC<ReportsViewProps> = ({ theme }) => {
  const [reports, setReports] = useState<ReportItem[]>(CASE_REPORTS);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const handleGenerateNew = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const newReport: ReportItem = {
        id: `rep-${Date.now()}`,
        title: 'Real-Time Operational Lead Synthesis',
        category: 'Live Intelligence',
        dateGenerated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        status: 'Ready',
        summary: 'Automated synthesis across latest CDR pings and banking deposits confirming Deepak Mehta intermediary nexus.',
        content: `## REAL-TIME OPERATIONAL INTELLIGENCE BRIEFING
**Classification:** RESTRICTED // LAW ENFORCEMENT ONLY
**Ledger Hash:** Block #1,402

### 1. New Findings
- Banking structuring pattern reinforced under Rule #402.
- Suresh Yadav telephony cluster active within Sector 18 radius.

*AI-generated investigative analysis. Verify against source evidence.*`,
      };
      setReports([newReport, ...reports]);
      setSelectedReport(newReport);
    }, 1500);
  };

  const handleExport = (report: ReportItem) => {
    const blob = new Blob([report.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${report.title.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccessId(report.id);
    setTimeout(() => setDownloadSuccessId(null), 2000);
  };

  return (
    <div className={`flex flex-col h-full w-full overflow-y-auto p-4 sm:p-6 md:p-8 scrollbar-thin ${
      theme === 'dark' ? 'bg-[#18181b] text-[#f4f4f5]' : 'bg-[#fcfcfd] text-[#18181b]'
    }`}>
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-inherit">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Investigation Reports</h2>
            <p className={`text-xs sm:text-sm mt-0.5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Formal intelligence dossiers, financial structuring audits, and court-admissible briefing notes.
            </p>
          </div>

          <button
            onClick={handleGenerateNew}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-xs shrink-0"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Generate New Briefing'}</span>
          </button>
        </div>

        {/* Reports Document List (ChatGPT style simple rows) */}
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                theme === 'dark'
                  ? 'bg-[#212124] border-zinc-700/70 hover:border-zinc-600'
                  : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  theme === 'dark' ? 'bg-zinc-800 text-cyan-400' : 'bg-zinc-100 text-slate-800'
                }`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm leading-tight">{report.title}</h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      theme === 'dark' ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
                    }`}>
                      {report.category}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${
                    theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                  }`}>
                    {report.summary}
                  </p>
                  <span className="text-[10px] text-zinc-500 mt-1 block font-mono">
                    Generated: {report.dateGenerated}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => setSelectedReport(report)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open</span>
                </button>

                <button
                  onClick={() => handleExport(report)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
                  }`}
                >
                  {downloadSuccessId === report.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>Export</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Modal Viewer */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 max-h-[85vh] flex flex-col shadow-2xl ${
            theme === 'dark' ? 'bg-[#212124] border-zinc-700 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-inherit">
              <div>
                <h3 className="font-semibold text-base">{selectedReport.title}</h3>
                <span className="text-[11px] font-mono text-zinc-400">{selectedReport.dateGenerated}</span>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-700/50 text-zinc-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 text-xs leading-relaxed prose prose-sm max-w-none scrollbar-thin dark:prose-invert">
              <ReactMarkdown>{selectedReport.content}</ReactMarkdown>
            </div>

            <div className="border-t pt-3 border-inherit flex justify-between items-center">
              <span className="text-[11px] text-zinc-500 font-mono">
                Preserved with cryptographic verification
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport(selectedReport)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border ${
                    theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-100 border-zinc-300 text-zinc-700'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
