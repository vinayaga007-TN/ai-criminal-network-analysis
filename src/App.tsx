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
import { AuditTrailView } from './components/AuditTrailView';
import { ProvenanceView } from './components/ProvenanceView';
import { QuickSearchModal } from './components/QuickSearchModal';
import { SettingsModal } from './components/SettingsModal';
import { ToolType, ChatMessage, ChatSession } from './types';
import { processInvestigatorQuery } from './utils/investigationAI';
import { CASE_METADATA } from './data/caseData';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentTool, setCurrentTool] = useState<ToolType>('copilot');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Deep-link entity/evidence selection states
  const [selectedEntityId, setSelectedEntityId] = useState<string>('ent-deepak-mehta');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('evd-fir-01');

  // Conversation State
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 'session-1',
      title: 'Initial Case Briefing & Network Overview',
      timestamp: 'Today',
      messagesCount: 2,
    },
    {
      id: 'session-2',
      title: 'Prakash Traders Cash Inflow Analysis',
      timestamp: 'Yesterday',
      messagesCount: 4,
    },
    {
      id: 'session-3',
      title: 'Burner SIM Telephony Cluster (Suresh Yadav)',
      timestamp: 'Aug 24',
      messagesCount: 3,
    },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('session-1');

  // Initial messages in active session
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-seed-1',
      sender: 'user',
      text: 'Summarize this investigation and explain the strongest investigative leads.',
      timestamp: '14:20 IST',
    },
    {
      id: 'msg-seed-2',
      sender: 'ai',
      text: `### Executive Summary: Case NX-2047 (Metro Central)

This investigation centers on a coordinated commercial syndicate operating across East Delhi and NCR under **FIR No. 204/2026**. Graph topological analysis highlights **Deepak Mehta** as an apparent key intermediary linking formal wholesale entities (**Prakash Traders**, **Om Enterprises**) with field operators (**Suresh Yadav**) and shadow conduits (**Hawala Transit Conduit**).

#### Primary Findings (Requires Verification):
1. **Financial Structuring:** Six staggered transactions totaling **₹18.4L** were deposited within a 72-hour window into accounts connected to Prakash Traders, exhibiting characteristics consistent with structuring thresholds.
2. **Telephony Intercepts:** CDR records identify burner IMEI \`864920048192014\` pinging within 80 meters of the **Sector 18 Safehouse** during documented cash transfers.
3. **Seizure Corroboration:** Handwritten police seizure memo **EVD-FIR-2026-0882** confirms recovery of vehicle keys for motorcycle **DL-04-CK-8812** and ₹45,000 unaccounted cash in Deepak Mehta's possession.`,
      timestamp: '14:21 IST',
      evidenceSources: [
        { id: 'EVD-FIR-2026-0882', title: 'Handwritten Seizure Memo' },
        { id: 'EVD-FIN-2026-1049', title: 'Bank Account Ledger' },
        { id: 'EVD-CDR-2026-3912', title: 'CDR Tower Dump' },
      ],
      keyConnections: [
        { entity: 'Deepak Mehta', type: 'Person', detail: 'Key intermediary linking wholesale accounts to field contacts' },
        { entity: 'Prakash Traders', type: 'Organization', detail: 'Primary recipient of ₹18.4L in structured transactions' },
        { entity: 'Suresh Yadav', type: 'Person', detail: 'Field operator linked via 18 recorded calls and safehouse telemetry' },
      ],
      investigationLeads: [
        'Examine Prakash Traders bank records for subsequent transfer hops.',
        'Corroborate burner SIM cell-site handoffs against CCTV at Subhash Chowk.',
      ],
      targetEntityId: 'ent-deepak-mehta',
      evidenceId: 'evd-fir-01',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Send message handler
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const aiResponse = await processInvestigatorQuery(text);
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error('Error generating AI response:', err);
      const fallbackAiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Analysis generated from local case ledger. Potential connection noted; all leads require verification against source evidence.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch to new empty chat
  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Investigation Inquiry',
      timestamp: 'Just now',
      messagesCount: 0,
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setCurrentTool('copilot');
  };

  // Cross-workspace navigation helpers
  const navigateToNetwork = (entityId?: string) => {
    if (entityId) setSelectedEntityId(entityId);
    setCurrentTool('network');
  };

  const navigateToEvidence = (evidenceId?: string) => {
    if (evidenceId) setSelectedEvidenceId(evidenceId);
    setCurrentTool('evidence-lab');
  };

  const navigateToAnomalies = () => {
    setCurrentTool('anomalies');
  };

  const askAIAboutTopic = (prompt: string) => {
    setCurrentTool('copilot');
    handleSendMessage(`Analyze ${prompt} in detail within Case NX-2047.`);
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${theme === 'dark' ? 'dark bg-[#18181b]' : 'bg-[#fcfcfd]'}`}>
      
      {/* Persistent Collapsible Left Sidebar (ChatGPT-inspired) */}
      <Sidebar
        currentTool={currentTool}
        onSelectTool={setCurrentTool}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        chatSessions={sessions}
        activeSessionId={currentSessionId}
        onSelectSession={(id) => {
          setCurrentSessionId(id);
          setCurrentTool('copilot');
        }}
        onNewChat={handleNewChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={theme}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        
        {/* Top Bar */}
        <TopBar
          currentTool={currentTool}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        />

        {/* View Switcher based on current tool */}
        <main className="flex-1 overflow-hidden relative">
          {currentTool === 'copilot' && (
            <CopilotView
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onNavigateToNetwork={navigateToNetwork}
              onNavigateToEvidence={navigateToEvidence}
              onNavigateToAnomalies={navigateToAnomalies}
              theme={theme}
            />
          )}

          {currentTool === 'network' && (
            <NetworkView
              selectedEntityId={selectedEntityId}
              onSelectEntity={setSelectedEntityId}
              onAskAIAboutEntity={(entityName) => askAIAboutTopic(`entity ${entityName}`)}
              onNavigateToEvidence={navigateToEvidence}
              theme={theme}
            />
          )}

          {currentTool === 'evidence-lab' && (
            <EvidenceLabView
              selectedEvidenceId={selectedEvidenceId}
              onAskAIAboutEvidence={(evTitle) => askAIAboutTopic(`evidence document ${evTitle}`)}
              onNavigateToNetwork={() => setCurrentTool('network')}
              theme={theme}
            />
          )}

          {currentTool === 'timeline' && (
            <TimelineView
              onAskAIAboutEvent={(evtTitle) => askAIAboutTopic(`timeline event "${evtTitle}"`)}
              onNavigateToEvidence={navigateToEvidence}
              theme={theme}
            />
          )}

          {currentTool === 'anomalies' && (
            <AnomaliesView
              onAskAIAboutAnomaly={(anomTitle) => askAIAboutTopic(`anomaly pattern "${anomTitle}"`)}
              onNavigateToEvidence={navigateToEvidence}
              theme={theme}
            />
          )}

          {currentTool === 'key-entities' && (
            <KeyEntitiesView
              onSelectEntityInNetwork={(entId) => {
                setSelectedEntityId(entId);
                setCurrentTool('network');
              }}
              onAskAIAboutEntity={(entName) => askAIAboutTopic(`entity ${entName}`)}
              theme={theme}
            />
          )}

          {currentTool === 'reports' && (
            <ReportsView theme={theme} />
          )}

          {currentTool === 'audit-trail' && (
            <AuditTrailView theme={theme} />
          )}

          {currentTool === 'provenance' && (
            <ProvenanceView theme={theme} />
          )}
        </main>
      </div>

      {/* Quick Search Modal (Cmd+K) */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectEntity={(entId) => {
          setSelectedEntityId(entId);
          setCurrentTool('network');
        }}
        onSelectEvidence={(evId) => {
          setSelectedEvidenceId(evId);
          setCurrentTool('evidence-lab');
        }}
        onSelectAnomaly={() => setCurrentTool('anomalies')}
        theme={theme}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
    </div>
  );
}
