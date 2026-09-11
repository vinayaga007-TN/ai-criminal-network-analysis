import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUp, 
  Plus, 
  Mic, 
  MicOff, 
  Share2, 
  FileText, 
  AlertTriangle, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Paperclip, 
  ChevronRight,
  UserCheck,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, ToolType } from '../types';
import { CASE_METADATA } from '../data/caseData';

interface CopilotViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onNavigateToNetwork: (entityId?: string) => void;
  onNavigateToEvidence: (evidenceId?: string) => void;
  onNavigateToAnomalies: () => void;
  theme: 'dark' | 'light';
}

export const CopilotView: React.FC<CopilotViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onNavigateToNetwork,
  onNavigateToEvidence,
  onNavigateToAnomalies,
  theme,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestedPrompts = [
    'Who is Kavita Nair connected to?',
    'Show financial links involving Deepak Mehta.',
    'Find unusual transaction patterns.',
    'Which entities connect the main communities?',
    'Summarize this investigation.',
    'Explain the strongest investigative leads.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handlePromptClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate voice input
      const sampleQueries = [
        'Analyze transactions between Om Enterprises and Prakash Traders.',
        'Who is Deepak Mehta connected to in this network?',
        'Identify burner SIM phones linked to Suresh Yadav.',
      ];
      const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      setTimeout(() => {
        setInputValue(randomQuery);
        setIsListening(false);
      }, 1800);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-expand textarea up to max height
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  return (
    <div className={`flex flex-col h-full w-full relative overflow-hidden ${
      theme === 'dark' ? 'bg-[#212121] text-[#f4f4f5]' : 'bg-[#fcfcfd] text-[#18181b]'
    }`}>
      {/* Scrollable Conversation Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-8 scrollbar-thin">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Empty / Welcome State (ChatGPT style) */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center pt-8 animate-fade-in">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-xs ${
                theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-slate-900 text-white'
              }`}>
                <Sparkles className="w-6 h-6" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                ANALYSER AI
              </h2>
              <p className={`text-base font-normal mt-2 ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                Your investigation intelligence copilot.
              </p>
              <p className={`text-xs sm:text-sm max-w-md mt-1 ${
                theme === 'dark' ? 'text-zinc-500' : 'text-zinc-500'
              }`}>
                Ask questions about entities, relationships, transactions, evidence, and unusual patterns.
              </p>

              {/* Case Context pill */}
              <div className={`mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border ${
                theme === 'dark' ? 'bg-zinc-800/80 border-zinc-700 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Case {CASE_METADATA.caseId}: {CASE_METADATA.title}</span>
              </div>

              {/* Suggested Prompts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mt-8 max-w-2xl text-left">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    id={`suggested-prompt-${index}`}
                    onClick={() => handlePromptClick(prompt)}
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm transition-all duration-150 flex items-center justify-between group ${
                      theme === 'dark'
                        ? 'bg-[#28282b] hover:bg-[#323236] border-zinc-700/60 text-zinc-300 hover:text-white'
                        : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-zinc-950 shadow-2xs'
                    }`}
                  >
                    <span className="truncate pr-2">{prompt}</span>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                      theme === 'dark' ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-zinc-400 group-hover:text-zinc-700'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Render Active Messages */}
          {messages.map((message) => {
            const isUser = message.sender === 'user';
            return (
              <div
                key={message.id}
                id={`chat-message-${message.id}`}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs shadow-xs mt-0.5 ${
                    theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-900 text-white'
                  }`}>
                    A
                  </div>
                )}

                <div className={`flex flex-col space-y-2 max-w-[90%] sm:max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Message Bubble / Container */}
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? theme === 'dark'
                        ? 'bg-[#303033] text-zinc-100 rounded-tr-xs'
                        : 'bg-[#f4f4f5] text-zinc-900 rounded-tr-xs'
                      : theme === 'dark'
                        ? 'bg-transparent text-zinc-200 pl-0'
                        : 'bg-transparent text-zinc-900 pl-0'
                  }`}>
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    ) : (
                      <div className="space-y-4">
                        {/* Markdown Formatted Text */}
                        <div className={`space-y-3 prose prose-sm max-w-none ${
                          theme === 'dark' ? 'prose-invert' : ''
                        }`}>
                          <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>

                        {/* Structured Key Connections Cards */}
                        {message.keyConnections && message.keyConnections.length > 0 && (
                          <div className="mt-4 pt-2 border-t border-zinc-700/30">
                            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2.5 ${
                              theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
                            }`}>
                              Key Connections Matrix
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {message.keyConnections.map((conn, idx) => (
                                <div
                                  key={idx}
                                  className={`p-2.5 rounded-lg border text-xs ${
                                    theme === 'dark'
                                      ? 'bg-[#28282b]/80 border-zinc-700/60'
                                      : 'bg-zinc-50 border-zinc-200'
                                  }`}
                                >
                                  <div className="font-medium text-zinc-200 dark:text-zinc-100 flex items-center justify-between">
                                    <span className="truncate">{conn.entity}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                                      theme === 'dark' ? 'bg-zinc-800 text-cyan-400' : 'bg-zinc-200 text-zinc-800'
                                    }`}>
                                      {conn.type}
                                    </span>
                                  </div>
                                  <p className={`text-[11px] mt-1 truncate ${
                                    theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                                  }`}>
                                    {conn.detail}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Investigation Leads Callout Banner */}
                        {message.investigationLeads && message.investigationLeads.length > 0 && (
                          <div className={`p-3 rounded-lg border flex gap-2.5 items-start ${
                            theme === 'dark'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                              : 'bg-amber-50 border-amber-200 text-amber-900'
                          }`}>
                            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                            <div className="text-xs space-y-1">
                              <span className="font-semibold block">Investigation Lead (Requires Verification)</span>
                              <ul className="list-disc pl-3.5 space-y-0.5 opacity-90">
                                {message.investigationLeads.map((lead, lIdx) => (
                                  <li key={lIdx}>{lead}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Evidence Source Badges */}
                        {message.evidenceSources && message.evidenceSources.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className={`text-[11px] font-medium mr-1 ${
                              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
                            }`}>
                              Sources:
                            </span>
                            {message.evidenceSources.map((ev, eIdx) => (
                              <button
                                key={eIdx}
                                onClick={() => onNavigateToEvidence(ev.id)}
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-colors flex items-center gap-1 ${
                                  theme === 'dark'
                                    ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                                    : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700'
                                }`}
                                title={`Open ${ev.title} in Evidence Lab`}
                              >
                                <FileText className="w-3 h-3" />
                                <span>{ev.id}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons Below AI Response */}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <button
                            id={`view-network-btn-${message.id}`}
                            onClick={() => onNavigateToNetwork(message.targetEntityId)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              theme === 'dark'
                                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
                            }`}
                          >
                            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>View Network</span>
                          </button>

                          <button
                            id={`view-evidence-btn-${message.id}`}
                            onClick={() => onNavigateToEvidence(message.evidenceId)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              theme === 'dark'
                                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                            <span>View Evidence</span>
                          </button>

                          <button
                            id={`view-anomalies-btn-${message.id}`}
                            onClick={onNavigateToAnomalies}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              theme === 'dark'
                                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
                            }`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span>View Anomalies</span>
                          </button>

                          <button
                            onClick={() => handleCopy(message.id, message.text)}
                            className={`p-1.5 rounded-lg text-xs border transition-colors ml-auto ${
                              theme === 'dark'
                                ? 'hover:bg-zinc-800 text-zinc-400 border-transparent hover:border-zinc-700'
                                : 'hover:bg-zinc-100 text-zinc-500 border-transparent hover:border-zinc-200'
                            }`}
                            title="Copy analysis"
                          >
                            {copiedId === message.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Footnote Disclaimer */}
                        <div className={`text-[11px] pt-1 flex items-center gap-1.5 ${
                          theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
                        }`}>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>AI-generated investigative analysis. Verify against source evidence.</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className={`text-[10px] px-1 ${
                    theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing / Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 sm:gap-4 items-start">
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs shadow-xs ${
                theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-900 text-white'
              }`}>
                A
              </div>
              <div className="flex items-center gap-1.5 py-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className={`text-xs ml-2 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Analyzing graph connections & evidence provenance...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ChatGPT-Style Bottom Message Composer */}
      <div className={`p-4 md:p-6 shrink-0 border-t ${
        theme === 'dark' 
          ? 'bg-[#212121] border-[#2c2c30]' 
          : 'bg-[#fcfcfd] border-[#e4e4e7]'
      }`}>
        <div className="max-w-3xl mx-auto">
          
          {/* Active Listening indicator if Mic is on */}
          {isListening && (
            <div className="flex items-center justify-center gap-2 mb-2 animate-pulse text-xs text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Listening to voice dictation (Audio Context 16kHz)...</span>
            </div>
          )}

          {/* Rounded Input Container */}
          <div className={`relative rounded-3xl border transition-all duration-200 focus-within:ring-2 ${
            theme === 'dark'
              ? 'bg-[#2f2f32] border-[#3e3e42] focus-within:border-zinc-500 focus-within:ring-zinc-700/50'
              : 'bg-white border-zinc-300 focus-within:border-zinc-400 focus-within:ring-zinc-200 shadow-sm'
          }`}>
            <textarea
              ref={textareaRef}
              id="copilot-message-input"
              rows={1}
              value={inputValue}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Message Analyser AI..."
              className={`w-full resize-none py-3.5 pl-12 pr-24 bg-transparent outline-none text-sm placeholder:text-zinc-400 leading-relaxed max-h-40 ${
                theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
              }`}
            />

            {/* Left Controls: Attach (+) */}
            <div className="absolute left-2.5 bottom-2.5 flex items-center">
              <div className="relative">
                <button
                  type="button"
                  id="copilot-attach-btn"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  title="Attach evidence or filter entities"
                  className={`p-2 rounded-full transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200'
                      : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Attach Dropdown Menu */}
                {showAttachMenu && (
                  <div className={`absolute bottom-full left-0 mb-2 w-56 rounded-xl border p-1 shadow-lg text-xs z-30 ${
                    theme === 'dark'
                      ? 'bg-[#28282b] border-zinc-700 text-zinc-200'
                      : 'bg-white border-zinc-200 text-zinc-800'
                  }`}>
                    <button
                      onClick={() => {
                        setShowAttachMenu(false);
                        onNavigateToEvidence();
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                        theme === 'dark' ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'
                      }`}
                    >
                      <Paperclip className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-medium">Attach Evidence</div>
                        <div className={`text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Upload FIR or seizure memo</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setShowAttachMenu(false);
                        onSendMessage('List all key entities with priority index above 50.');
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                        theme === 'dark' ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-medium">Query Key Entities</div>
                        <div className={`text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Filter by priority index</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setShowAttachMenu(false);
                        onNavigateToAnomalies();
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                        theme === 'dark' ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-medium">Scan Anomalies</div>
                        <div className={`text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Run Isolation Forest scan</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Controls: Mic & Send Button */}
            <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1">
              <button
                type="button"
                id="copilot-mic-btn"
                onClick={toggleMic}
                title={isListening ? 'Stop listening' : 'Voice input dictation'}
                className={`p-2 rounded-full transition-colors ${
                  isListening
                    ? 'bg-red-500/20 text-red-400 animate-pulse'
                    : theme === 'dark'
                      ? 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200'
                      : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="button"
                id="copilot-send-btn"
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isLoading}
                title="Send inquiry"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  inputValue.trim() && !isLoading
                    ? theme === 'dark'
                      ? 'bg-zinc-100 text-zinc-900 hover:bg-white'
                      : 'bg-zinc-900 text-white hover:bg-zinc-800'
                    : theme === 'dark'
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subtext beneath composer */}
          <p className={`text-center text-[11px] mt-2 ${
            theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
          }`}>
            AI-generated investigative analysis. Verify against source evidence.
          </p>
        </div>
      </div>
    </div>
  );
};
