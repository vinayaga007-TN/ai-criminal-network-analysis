import React from 'react';
import { 
  MessageSquare, 
  Share2, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Users, 
  FileBarChart2, 
  ShieldCheck, 
  Hash, 
  Plus, 
  FolderLock, 
  Sun, 
  Moon, 
  Settings, 
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCircle2
} from 'lucide-react';
import { ToolType, ChatSession } from '../types';
import { CASE_METADATA } from '../data/caseData';

interface SidebarProps {
  currentTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  theme: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenSettings: () => void;
  onNewInvestigation?: () => void;
  chatSessions?: ChatSession[];
  activeSessionId?: string;
  onSelectSession?: (sessionId: string) => void;
  onNewChat?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTool,
  onSelectTool,
  isCollapsed,
  onToggleCollapse,
  theme,
  onToggleTheme,
  onOpenSettings,
  onNewInvestigation,
  chatSessions = [],
  activeSessionId,
  onSelectSession,
  onNewChat,
}) => {
  const navItems: { id: ToolType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'copilot', label: 'Copilot', icon: MessageSquare },
    { id: 'network', label: 'Network', icon: Share2 },
    { id: 'evidence-lab', label: 'Evidence Lab', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
    { id: 'key-entities', label: 'Key Entities', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileBarChart2 },
    { id: 'audit-trail', label: 'Audit Trail', icon: ShieldCheck },
    { id: 'provenance', label: 'Provenance', icon: Hash },
  ];

  const recentCases = [
    { id: 'NX-2047', name: 'Case NX-2047', active: true, tag: 'Chain Snatching' },
    { id: 'SE-1092', name: 'South-East Bullion', active: false, tag: 'Gold Fencing' },
    { id: 'HW-8841', name: 'Hawala Transit 8821', active: false, tag: 'Financial Layering' },
    { id: 'MK-2026', name: 'Malkhana Custody', active: false, tag: 'Evidence Audit' },
  ];

  return (
    <aside 
      id="sidebar-navigation"
      className={`relative flex flex-col h-full border-r transition-all duration-300 select-none z-20 ${
        isCollapsed ? 'w-16' : 'w-64 sm:w-72'
      } ${
        theme === 'dark' 
          ? 'bg-[#18181b] border-[#27272a] text-[#f4f4f5]' 
          : 'bg-[#fcfcfd] border-[#e4e4e7] text-[#18181b]'
      }`}
    >
      {/* Top Branding & Collapse Button */}
      <div className="flex items-center justify-between p-3 border-b border-inherit h-14">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden pl-1">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm tracking-wider shadow-xs ${
              theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-900 text-white'
            }`}>
              A
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm tracking-tight truncate leading-tight">
                ANALYSER AI
              </span>
              <span className={`text-[10px] truncate leading-tight font-medium ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
              }`}>
                Investigation Copilot
              </span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-xs ${
              theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-900 text-white'
            }`}>
              A
            </div>
          </div>
        )}

        <button
          id="sidebar-toggle-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`p-1.5 rounded-md transition-colors ${
            theme === 'dark' 
              ? 'hover:bg-[#27272a] text-zinc-400 hover:text-zinc-200' 
              : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800'
          } ${isCollapsed ? 'hidden' : 'block'}`}
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* New Investigation / New Chat Button */}
      <div className="p-3">
        <button
          id="new-investigation-btn"
          onClick={onNewChat || onNewInvestigation}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            theme === 'dark'
              ? 'bg-[#27272a] hover:bg-[#323238] text-zinc-200 border border-zinc-700/50 hover:border-zinc-600'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200'
          }`}
          title="Start new investigation workspace"
        >
          <Plus className="w-3.5 h-3.5" />
          {!isCollapsed && <span>New Investigation</span>}
        </button>
      </div>

      {/* Primary Navigation Workspaces */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-thin">
        <div className="pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTool === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onSelectTool(item.id)}
                title={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors group relative ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-zinc-800/90 text-cyan-400 font-semibold shadow-xs'
                      : 'bg-zinc-200/80 text-zinc-950 font-semibold shadow-xs'
                    : theme === 'dark'
                      ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${
                  isActive 
                    ? theme === 'dark' ? 'text-cyan-400' : 'text-zinc-950'
                    : 'text-inherit'
                }`} />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full ${
                    theme === 'dark' ? 'bg-cyan-400' : 'bg-zinc-900'
                  }`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Chat History Section (ChatGPT style) */}
        {!isCollapsed && chatSessions.length > 0 && (
          <div className="pt-3 pb-1">
            <div className={`px-3 pb-1 text-[11px] font-semibold tracking-wider uppercase ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              Case Inquiries
            </div>
            <div className="space-y-0.5 mt-1">
              {chatSessions.map((session) => (
                <button
                  key={session.id}
                  id={`chat-session-${session.id}`}
                  onClick={() => {
                    onSelectSession?.(session.id);
                    onSelectTool('copilot');
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between group ${
                    activeSessionId === session.id
                      ? theme === 'dark'
                        ? 'text-zinc-100 bg-zinc-800/80 font-medium'
                        : 'text-zinc-900 bg-zinc-200/70 font-medium'
                      : theme === 'dark'
                        ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 text-cyan-400 opacity-70" />
                    <span className="truncate">{session.title}</span>
                  </div>
                  <span className="text-[10px] opacity-60 font-mono shrink-0 ml-1">
                    {session.timestamp}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Investigations Section */}
        {!isCollapsed && (
          <div className="pt-4 pb-1">
            <div className={`px-3 pb-1 text-[11px] font-semibold tracking-wider uppercase ${
              theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
            }`}>
              Recent Investigations
            </div>
            <div className="space-y-0.5 mt-1">
              {recentCases.map((c) => (
                <button
                  key={c.id}
                  id={`recent-case-${c.id}`}
                  onClick={() => onSelectTool('copilot')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between group ${
                    c.active
                      ? theme === 'dark'
                        ? 'text-zinc-200 bg-zinc-800/30'
                        : 'text-zinc-900 bg-zinc-100'
                      : theme === 'dark'
                        ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FolderLock className={`w-3.5 h-3.5 shrink-0 ${
                      c.active ? 'text-amber-500' : 'text-zinc-400'
                    }`} />
                    <span className="truncate">{c.name}</span>
                  </div>
                  {c.active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Active Case" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Area: Workspace Status & Settings & Theme */}
      <div className={`p-3 border-t border-inherit space-y-2 ${
        theme === 'dark' ? 'bg-[#151518]' : 'bg-[#f8f8fa]'
      }`}>
        {!isCollapsed && (
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold truncate leading-none">
                  {CASE_METADATA.caseId}
                </p>
                <p className={`text-[10px] truncate leading-tight mt-0.5 ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                  Air-gapped & Protected
                </p>
              </div>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
              theme === 'dark' ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'
            }`}>
              AES-256
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <button
            id="toggle-theme-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-lg text-xs transition-colors flex items-center justify-center ${
              theme === 'dark'
                ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            id="open-settings-btn"
            onClick={onOpenSettings}
            title="Investigation Settings & Security"
            className={`p-2 rounded-lg text-xs transition-colors flex items-center justify-center ${
              theme === 'dark'
                ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>

          {isCollapsed && (
            <button
              id="sidebar-expand-btn"
              onClick={onToggleCollapse}
              title="Expand sidebar"
              className={`p-2 rounded-lg text-xs transition-colors ${
                theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
              }`}
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
