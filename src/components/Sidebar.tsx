import React from 'react';
import { MessageSquare, Share2, FileText, Clock, AlertTriangle, Users, FileBarChart2, ShieldCheck, Hash, Plus, FolderLock, Sun, Moon, Settings, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react';
import { ToolType, ChatSession } from '../types';
import { CASE_METADATA } from '../data/caseData';

interface SidebarProps { currentTool: ToolType; onSelectTool: (tool: ToolType) => void; isCollapsed: boolean; onToggleCollapse: () => void; theme: 'dark' | 'light'; onToggleTheme?: () => void; onOpenSettings: () => void; onNewInvestigation?: () => void; chatSessions?: ChatSession[]; activeSessionId?: string; onSelectSession?: (sessionId: string) => void; onNewChat?: () => void; }

export const Sidebar: React.FC<SidebarProps> = ({ currentTool, onSelectTool, isCollapsed, onToggleCollapse, theme, onToggleTheme, onOpenSettings, onNewInvestigation, chatSessions = [], activeSessionId, onSelectSession, onNewChat }) => {
  const navItems: { id: ToolType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'copilot', label: 'Copilot', icon: MessageSquare },
    { id: 'network', label: 'Network', icon: Share2 },
    { id: 'evidence-lab', label: 'Evidence Lab', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
    { id: 'key-entities', label: 'Key Entities', icon: Users },
    { id: 'exposure-intelligence', label: 'Exposure Intelligence', icon: Search },
    { id: 'reports', label: 'Reports', icon: FileBarChart2 },
    { id: 'audit-trail', label: 'Audit Trail', icon: ShieldCheck },
    { id: 'provenance', label: 'Provenance', icon: Hash },
  ];
  const recentCases = [
    { id: 'NX-2047', name: 'Case NX-2047', active: true },
    { id: 'SE-1092', name: 'South-East Bullion', active: false },
    { id: 'HW-8841', name: 'Hawala Transit 8821', active: false },
    { id: 'MK-2026', name: 'Malkhana Custody', active: false },
  ];
  return <aside id="sidebar-navigation" className={`relative flex flex-col h-full border-r transition-all duration-300 select-none z-20 ${isCollapsed ? 'w-16' : 'w-64 sm:w-72'} ${theme === 'dark' ? 'bg-[#18181b] border-[#27272a] text-[#f4f4f5]' : 'bg-[#fcfcfd] border-[#e4e4e7] text-[#18181b]'}`}>
    <div className="flex items-center justify-between p-3 border-b border-inherit h-14">
      {!isCollapsed && <div className="flex items-center gap-2.5 overflow-hidden pl-1"><div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm tracking-wider ${theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-900 text-white'}`}>A</div><div><span className="font-semibold text-sm tracking-tight block">ANALYSER AI</span><span className={`text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Investigation Copilot</span></div></div>}
      {isCollapsed && <div className="w-full flex justify-center"><div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">A</div></div>}
      <button onClick={onToggleCollapse} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} className={`p-1.5 rounded-md ${isCollapsed ? 'hidden' : 'block'}`}><PanelLeftClose className="w-4 h-4" /></button>
    </div>
    <div className="p-3"><button onClick={onNewChat || onNewInvestigation} className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/50"><Plus className="w-3.5 h-3.5" />{!isCollapsed && <span>New Investigation</span>}</button></div>
    <div className="flex-1 overflow-y-auto px-2 space-y-1">
      {navItems.map((item) => { const Icon = item.icon; const isActive = currentTool === item.id; return <button key={item.id} id={`nav-${item.id}`} onClick={() => onSelectTool(item.id)} title={item.label} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${isActive ? 'bg-zinc-800/90 text-cyan-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'}`}><Icon className="w-4 h-4 shrink-0" />{!isCollapsed && <span className="truncate">{item.label}</span>}{isActive && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}</button>; })}
      {!isCollapsed && chatSessions.length > 0 && <div className="pt-3"><div className="px-3 pb-1 text-[11px] font-semibold tracking-wider uppercase text-zinc-500">Case Inquiries</div>{chatSessions.map((session) => <button key={session.id} onClick={() => { onSelectSession?.(session.id); onSelectTool('copilot'); }} className={`w-full text-left px-3 py-1.5 rounded-md text-xs flex items-center justify-between ${activeSessionId === session.id ? 'text-zinc-100 bg-zinc-800/80' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'}`}><div className="flex items-center gap-2 truncate"><MessageSquare className="w-3.5 h-3.5 text-cyan-400" /><span className="truncate">{session.title}</span></div><span className="text-[10px] opacity-60">{session.timestamp}</span></button>)}</div>}
      {!isCollapsed && <div className="pt-4 pb-1"><div className="px-3 pb-1 text-[11px] font-semibold tracking-wider uppercase text-zinc-500">Recent Investigations</div>{recentCases.map((c) => <button key={c.id} onClick={() => onSelectTool('copilot')} className="w-full text-left px-3 py-1.5 rounded-md text-xs flex items-center justify-between text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20"><div className="flex items-center gap-2 truncate"><FolderLock className="w-3.5 h-3.5" /><span className="truncate">{c.name}</span></div>{c.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}</button>)}</div>}
    </div>
    <div className="p-3 border-t border-inherit"><div className="flex items-center justify-between"><button onClick={onToggleTheme} title="Toggle theme" className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200">{theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button><button onClick={onOpenSettings} title="Settings" className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200"><Settings className="w-4 h-4" /></button>{isCollapsed && <button onClick={onToggleCollapse} title="Expand sidebar" className="p-2 rounded-lg text-zinc-400"><PanelLeftOpen className="w-4 h-4" /></button>}</div>{!isCollapsed && <div className="mt-2 text-[10px] text-zinc-500">{CASE_METADATA.caseId} · Demo / Synthetic Data</div>}</div>
  </aside>;
};
