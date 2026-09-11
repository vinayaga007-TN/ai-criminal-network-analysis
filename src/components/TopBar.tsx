import React from 'react';
import { 
  PanelLeft, 
  Search, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Settings, 
  Database,
  Lock,
  ChevronDown
} from 'lucide-react';
import { ToolType } from '../types';
import { CASE_METADATA } from '../data/caseData';

interface TopBarProps {
  currentTool: ToolType;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTool,
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenSearch,
  onOpenSettings,
  theme,
  onToggleTheme,
}) => {
  const toolTitles: Record<ToolType, { title: string; subtitle?: string }> = {
    copilot: { title: 'Copilot', subtitle: 'Conversational investigation assistant' },
    network: { title: 'Network Intelligence', subtitle: 'Explore relationships across the investigation' },
    'evidence-lab': { title: 'AI Evidence Lab', subtitle: 'Analyze documents while preserving source provenance' },
    timeline: { title: 'Investigation Timeline', subtitle: 'Chronological sequence trace across FIRs & records' },
    anomalies: { title: 'Anomaly Intelligence', subtitle: 'Unusual patterns requiring verification' },
    'key-entities': { title: 'Key Entities', subtitle: 'Ranked centrality matrix of 51 network nodes' },
    reports: { title: 'Investigation Reports', subtitle: 'Generated dossiers & analytical briefings' },
    'audit-trail': { title: 'Audit Trail', subtitle: 'Cryptographic ledger & activity proof' },
    provenance: { title: 'Provenance Verification', subtitle: 'Cryptographic integrity validation' },
  };

  const { title, subtitle } = toolTitles[currentTool];

  return (
    <header 
      id="app-topbar"
      className={`h-14 border-b px-4 flex items-center justify-between shrink-0 select-none z-10 transition-colors ${
        theme === 'dark' 
          ? 'bg-[#18181b] border-[#27272a] text-[#f4f4f5]' 
          : 'bg-[#ffffff] border-[#e4e4e7] text-[#09090b]'
      }`}
    >
      {/* Left: Sidebar Toggle + Case Context */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="topbar-sidebar-toggle"
          onClick={onToggleSidebar}
          title={isSidebarCollapsed ? 'Open sidebar' : 'Collapse sidebar'}
          className={`p-1.5 rounded-md transition-colors ${
            theme === 'dark' 
              ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200' 
              : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 overflow-hidden">
          <div className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold flex items-center gap-1.5 shrink-0 ${
            theme === 'dark' 
              ? 'bg-zinc-800 text-zinc-200 border border-zinc-700/60' 
              : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
          }`}>
            <Lock className="w-3 h-3 text-amber-500" />
            <span>{CASE_METADATA.caseId}</span>
          </div>

          <span className={`text-xs hidden md:inline-block truncate ${
            theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
          }`}>
            {CASE_METADATA.title}
          </span>
        </div>
      </div>

      {/* Center: Current Workspace Title */}
      <div className="flex flex-col items-center justify-center text-center px-2 min-w-0">
        <h1 className="text-xs sm:text-sm font-semibold tracking-tight truncate leading-none">
          {title}
        </h1>
        {subtitle && (
          <span className={`text-[10px] hidden sm:block truncate mt-0.5 ${
            theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
          }`}>
            {subtitle}
          </span>
        )}
      </div>

      {/* Right: Search, Security Badge, Theme, Settings */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          id="topbar-search-btn"
          onClick={onOpenSearch}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors border ${
            theme === 'dark'
              ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700/60'
              : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
          }`}
          title="Search case entities, evidence, or ledger (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden lg:inline text-[11px]">Search...</span>
          <kbd className={`hidden sm:inline-block text-[10px] font-mono px-1 py-0.2 rounded border ${
            theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-zinc-100 border-zinc-300 text-zinc-500'
          }`}>
            ⌘K
          </kbd>
        </button>

        {/* Security Indicator */}
        <div 
          className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium border ${
            theme === 'dark'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
          title="Cryptographic integrity verified in Block #1,402"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] hidden md:inline">SHA-256 Verified</span>
        </div>

        {/* Theme Toggle */}
        <button
          id="topbar-theme-toggle"
          onClick={onToggleTheme}
          className={`p-1.5 rounded-md transition-colors ${
            theme === 'dark' 
              ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200' 
              : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'
          }`}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Settings button */}
        <button
          id="topbar-settings-btn"
          onClick={onOpenSettings}
          className={`p-1.5 rounded-md transition-colors ${
            theme === 'dark' 
              ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200' 
              : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'
          }`}
          title="Investigation settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
