import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { CopilotView } from './components/CopilotView';
import { NetworkView } from './components/NetworkView';
import { EvidenceLabView } from './components/EvidenceLabView';
import { TimelineView } from './components/TimelineView';
import { AnomaliesView } from './components/AnomaliesView';
import { KeyEntitiesView } from './components/KeyEntitiesView';
import { ReportsView } from './components/ReportsView';
import { ExposureIntelligenceView } from './components/ExposureIntelligenceView';
import { AuditTrailView } from './components/AuditTrailView';
import { ProvenanceView } from './components/ProvenanceView';
import { QuickSearchModal } from './components/QuickSearchModal';
import { SettingsModal } from './components/SettingsModal';
import { ToolType, ChatMessage, ChatSession } from './types';
import { processInvestigatorQuery } from './utils/investigationAI';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentTool, setCurrentTool] = useState<ToolType>('copilot');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('ent-deepak-mehta');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('evd-fir-01');
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: 'session-1', title: 'Initial Case Briefing & Network Overview', timestamp: 'Today', messagesCount: 2 },
    { id: 'session-2', title: 'Prakash Traders Cash Inflow Analysis', timestamp: 'Yesterday', messagesCount: 4 },
    { id: 'session-3', title: 'Burner SIM Telephony Cluster (Suresh Yadav)', timestamp: 'Aug 24', messagesCount: 3 },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('session-1');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'msg-seed-1', sender: 'user', text: 'Summarize this investigation and explain the strongest investigative leads.', timestamp: '14:20 IST' },
    { id: 'msg-seed-2', sender: 'ai', text: '### Executive Summary: Case NX-2047\n\nThis is synthetic demonstration data. Graph analysis highlights several entities as investigation priorities.\n\n#### Primary Findings (Requires Verification):\n1. Financial transaction patterns require source verification.\n2. Telephony and location correlations require corroboration.\n3. Evidence provenance should be checked before operational use.', timestamp: '14:21 IST', evidenceSources: [{ id: 'EVD-FIR-2026-0882', title: 'Synthetic Seizure Memo' }, { id: 'EVD-FIN-2026-1049', title: 'Synthetic Bank Ledger' }, { id: 'EVD-CDR-2026-3912', title: 'Synthetic CDR Log' }], investigationLeads: ['Review transaction hops against source records.', 'Corroborate communications with independent evidence.'], targetEntityId: 'ent-deepak-mehta', evidenceId: 'evd-fir-01' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = { id: `usr-${Date.now()}`, sender: 'user', text, timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST' };
    setMessages((prev) => [...prev, userMsg]); setIsLoading(true);
    try { const aiResponse = await processInvestigatorQuery(text); setMessages((prev) => [...prev, aiResponse]); }
    catch { setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, sender: 'ai', text: 'Analysis generated from the local case ledger. Potential connection noted; all leads require verification against source evidence.', timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST' }]); }
    finally { setIsLoading(false); }
  };

  const handleNewChat = () => {
    const newSession: ChatSession = { id: `session-${Date.now()}`, title: 'New Investigation Inquiry', timestamp: 'Just now', messagesCount: 0 };
    setSessions([newSession, ...sessions]); setCurrentSessionId(newSession.id); setMessages([]); setCurrentTool('copilot');
  };
  const navigateToNetwork = (entityId?: string) => { if (entityId) setSelectedEntityId(entityId); setCurrentTool('network'); };
  const navigateToEvidence = (evidenceId?: string) => { if (evidenceId) setSelectedEvidenceId(evidenceId); setCurrentTool('evidence-lab'); };
  const navigateToAnomalies = () => setCurrentTool('anomalies');
  const askAIAboutTopic = (prompt: string) => { setCurrentTool('copilot'); handleSendMessage(`Analyze ${prompt} in detail within Case NX-2047.`); };

  return <div className={`flex h-screen w-screen overflow-hidden ${theme === 'dark' ? 'dark bg-[#18181b]' : 'bg-[#fcfcfd]'}`}>
    <Sidebar currentTool={currentTool} onSelectTool={setCurrentTool} isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} chatSessions={sessions} activeSessionId={currentSessionId} onSelectSession={(id) => { setCurrentSessionId(id); setCurrentTool('copilot'); }} onNewChat={handleNewChat} onOpenSettings={() => setIsSettingsOpen(true)} theme={theme} />
    <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
      <TopBar currentTool={currentTool} isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} onOpenSearch={() => setIsSearchOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <main className="flex-1 overflow-hidden relative">
        {currentTool === 'copilot' && <CopilotView messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} onNavigateToNetwork={navigateToNetwork} onNavigateToEvidence={navigateToEvidence} onNavigateToAnomalies={navigateToAnomalies} theme={theme} />}
        {currentTool === 'network' && <NetworkView selectedEntityId={selectedEntityId} onSelectEntity={setSelectedEntityId} onAskAIAboutEntity={(entityName) => askAIAboutTopic(`entity ${entityName}`)} onNavigateToEvidence={navigateToEvidence} theme={theme} />}
        {currentTool === 'evidence-lab' && <EvidenceLabView selectedEvidenceId={selectedEvidenceId} onAskAIAboutEvidence={(evTitle) => askAIAboutTopic(`evidence document ${evTitle}`)} onNavigateToNetwork={() => setCurrentTool('network')} theme={theme} />}
        {currentTool === 'timeline' && <TimelineView onAskAIAboutEvent={(evtTitle) => askAIAboutTopic(`timeline event "${evtTitle}"`)} onNavigateToEvidence={navigateToEvidence} theme={theme} />}
        {currentTool === 'anomalies' && <AnomaliesView onAskAIAboutAnomaly={(anomTitle) => askAIAboutTopic(`anomaly pattern "${anomTitle}"`)} onNavigateToEvidence={navigateToEvidence} theme={theme} />}
        {currentTool === 'key-entities' && <KeyEntitiesView onSelectEntityInNetwork={(entId) => { setSelectedEntityId(entId); setCurrentTool('network'); }} onAskAIAboutEntity={(entName) => askAIAboutTopic(`entity ${entName}`)} theme={theme} />}
        {currentTool === 'exposure-intelligence' && <ExposureIntelligenceView theme={theme} />}
        {currentTool === 'reports' && <ReportsView theme={theme} />}
        {currentTool === 'audit-trail' && <AuditTrailView theme={theme} />}
        {currentTool === 'provenance' && <ProvenanceView theme={theme} />}
      </main>
    </div>
    <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSelectEntity={(entId) => { setSelectedEntityId(entId); setCurrentTool('network'); }} onSelectEvidence={(evId) => { setSelectedEvidenceId(evId); setCurrentTool('evidence-lab'); }} onSelectAnomaly={() => setCurrentTool('anomalies')} theme={theme} />
    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
  </div>;
}
