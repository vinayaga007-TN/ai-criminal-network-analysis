import React, { useState } from 'react';
import { 
  Clock, 
  FileText, 
  ArrowRight, 
  MessageSquare, 
  ShieldAlert, 
  ExternalLink, 
  Filter,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { TimelineItem } from '../types';
import { CASE_TIMELINE } from '../data/caseData';

interface TimelineViewProps {
  onAskAIAboutEvent: (eventTitle: string) => void;
  onNavigateToEvidence: (evidenceId: string) => void;
  theme: 'dark' | 'light';
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  onAskAIAboutEvent,
  onNavigateToEvidence,
  theme,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('time-1');

  const categories = ['all', 'FIR', 'Evidence', 'Transaction', 'Network', 'Anomaly', 'Hardware'];

  const filteredTimeline = CASE_TIMELINE.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className={`flex flex-col h-full w-full overflow-y-auto p-4 sm:p-6 md:p-8 scrollbar-thin ${
      theme === 'dark' ? 'bg-[#18181b] text-[#f4f4f5]' : 'bg-[#fcfcfd] text-[#18181b]'
    }`}>
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-inherit">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Investigation Timeline</h2>
            <p className={`text-xs sm:text-sm mt-0.5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Chronological sequence trace across FIRs, transactions, telemetry, and evidence.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors border ${
                  selectedCategory === cat
                    ? theme === 'dark'
                      ? 'bg-zinc-700 text-white border-zinc-600 font-semibold shadow-xs'
                      : 'bg-zinc-900 text-white border-zinc-900 font-semibold shadow-xs'
                    : theme === 'dark'
                      ? 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-zinc-200'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:text-zinc-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Sequence Feed */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-zinc-700/60 space-y-6 ml-3 sm:ml-4 py-2">
          {filteredTimeline.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div 
                key={item.id} 
                id={`timeline-event-${item.id}`}
                className="relative group transition-all"
              >
                {/* Timeline Dot Marker */}
                <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                  item.category === 'FIR' ? 'bg-amber-500 border-amber-300' :
                  item.category === 'Anomaly' ? 'bg-rose-500 border-rose-300' :
                  item.category === 'Transaction' ? 'bg-emerald-500 border-emerald-300' :
                  'bg-cyan-500 border-cyan-300'
                }`} />

                {/* Event Card (ChatGPT card style) */}
                <div className={`rounded-xl border p-4 transition-all ${
                  theme === 'dark'
                    ? 'bg-[#212124] border-zinc-700/70 hover:border-zinc-600'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-2xs'
                }`}>
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer gap-2 select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded tracking-wider ${
                        theme === 'dark' ? 'bg-zinc-800 text-cyan-400' : 'bg-zinc-100 text-zinc-900'
                      }`}>
                        {item.date}
                      </span>
                      <h3 className="font-semibold text-sm leading-tight group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        theme === 'dark' ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
                      }`}>
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span className="font-mono text-[11px]">{item.time}</span>
                      {item.requiresVerification && (
                        <span className="text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                          <ShieldAlert className="w-3 h-3" />
                          Requires verification
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-3.5 pt-3.5 border-t border-inherit text-xs space-y-3">
                      <p className="leading-relaxed opacity-90">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {item.evidenceId && (
                          <button
                            onClick={() => onNavigateToEvidence(item.evidenceId!)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono border transition-colors ${
                              theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200'
                            }`}
                          >
                            <FileText className="w-3 h-3 text-emerald-400" />
                            <span>Source: {item.evidenceId}</span>
                          </button>
                        )}

                        <button
                          onClick={() => onAskAIAboutEvent(item.title)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white transition-colors ml-auto shadow-xs"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Ask Copilot</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
