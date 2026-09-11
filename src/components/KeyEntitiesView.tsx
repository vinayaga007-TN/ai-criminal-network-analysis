import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Share2, 
  MessageSquare, 
  ShieldAlert, 
  ExternalLink, 
  ArrowUpDown,
  Building,
  User,
  Phone,
  MapPin,
  CreditCard,
  Radio
} from 'lucide-react';
import { Entity, EntityType } from '../types';
import { CASE_ENTITIES } from '../data/caseData';

interface KeyEntitiesViewProps {
  onSelectEntityInNetwork: (entityId: string) => void;
  onAskAIAboutEntity: (entityName: string) => void;
  theme: 'dark' | 'light';
}

export const KeyEntitiesView: React.FC<KeyEntitiesViewProps> = ({
  onSelectEntityInNetwork,
  onAskAIAboutEntity,
  theme,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'degree' | 'betweenness' | 'pagerank'>('priority');

  const filteredEntities = CASE_ENTITIES.filter((ent) => {
    const matchesSearch = !search || 
      ent.name.toLowerCase().includes(search.toLowerCase()) || 
      ent.role.toLowerCase().includes(search.toLowerCase()) ||
      (ent.alias && ent.alias.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'all' || ent.type === typeFilter;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'priority') return b.investigationPriority - a.investigationPriority;
    if (sortBy === 'degree') return b.degree - a.degree;
    if (sortBy === 'betweenness') return b.betweenness - a.betweenness;
    if (sortBy === 'pagerank') return b.pagerank - a.pagerank;
    return 0;
  });

  const getNodeIcon = (type: EntityType) => {
    switch (type) {
      case 'person': return <User className="w-3.5 h-3.5 text-sky-400" />;
      case 'organization': return <Building className="w-3.5 h-3.5 text-amber-400" />;
      case 'phone': return <Phone className="w-3.5 h-3.5 text-purple-400" />;
      case 'location': return <MapPin className="w-3.5 h-3.5 text-emerald-400" />;
      case 'transaction': return <CreditCard className="w-3.5 h-3.5 text-teal-400" />;
      default: return <Radio className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className={`flex flex-col h-full w-full overflow-y-auto p-4 sm:p-6 md:p-8 scrollbar-thin ${
      theme === 'dark' ? 'bg-[#18181b] text-[#f4f4f5]' : 'bg-[#fcfcfd] text-[#18181b]'
    }`}>
      <div className="max-w-5xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-inherit">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Key Entities Directory</h2>
            <p className={`text-xs sm:text-sm mt-0.5 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Ranked centrality matrix and investigative priority index across 51 identified network nodes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`text-xs py-1.5 px-3 rounded-lg border outline-none font-medium ${
                theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'
              }`}
            >
              <option value="priority">Investigation Priority</option>
              <option value="betweenness">Betweenness Centrality</option>
              <option value="degree">Degree (Connections)</option>
              <option value="pagerank">PageRank Score</option>
            </select>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name, role, alias, or vehicle reg..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full py-2 pl-9 pr-3 rounded-xl text-xs outline-none border transition-colors ${
                theme === 'dark'
                  ? 'bg-[#212124] border-zinc-700 text-zinc-200 placeholder:text-zinc-500 focus:border-cyan-500'
                  : 'bg-white border-zinc-300 text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-400 shadow-2xs'
              }`}
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {['all', 'person', 'organization', 'phone', 'location'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors border ${
                  typeFilter === t
                    ? theme === 'dark'
                      ? 'bg-zinc-700 text-white border-zinc-600 font-semibold shadow-xs'
                      : 'bg-zinc-900 text-white border-zinc-900 font-semibold shadow-xs'
                    : theme === 'dark'
                      ? 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-zinc-200'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:text-zinc-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Entities Ranked Table */}
        <div className={`rounded-xl border overflow-hidden ${
          theme === 'dark' ? 'bg-[#212124] border-zinc-700/80' : 'bg-white border-zinc-200 shadow-2xs'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b font-mono uppercase tracking-wider text-[10px] ${
                  theme === 'dark' ? 'bg-zinc-800/60 text-zinc-400 border-zinc-700' : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                }`}>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3 text-center">Degree</th>
                  <th className="py-3 px-3 text-center">Betweenness</th>
                  <th className="py-3 px-3 text-center">PageRank</th>
                  <th className="py-3 px-4 text-center">Priority</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700/30 dark:divide-zinc-700/40">
                {filteredEntities.map((entity, idx) => (
                  <tr 
                    key={entity.id}
                    className={`transition-colors ${
                      theme === 'dark' ? 'hover:bg-zinc-800/40' : 'hover:bg-zinc-50'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-zinc-400 text-[11px] w-5 text-center">
                          #{idx + 1}
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                          {getNodeIcon(entity.type)}
                        </div>
                        <div>
                          <span className="font-semibold block text-sm">{entity.name}</span>
                          <span className={`text-[11px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            {entity.role} {entity.alias ? `("${entity.alias}")` : ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 capitalize">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        theme === 'dark' ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                      }`}>
                        {entity.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-medium">
                      {entity.degree}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-medium">
                      {entity.betweenness}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-medium">
                      {entity.pagerank}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 font-mono font-bold text-xs">
                        <span className={`px-2 py-0.5 rounded ${
                          entity.priorityLevel === 'High' ? 'bg-rose-500/20 text-rose-400' :
                          entity.priorityLevel === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-cyan-500/20 text-cyan-400'
                        }`}>
                          {entity.investigationPriority}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectEntityInNetwork(entity.id)}
                          title="Locate in Network Graph"
                          className={`p-1.5 rounded-lg border transition-colors ${
                            theme === 'dark' ? 'hover:bg-zinc-700 border-zinc-700 text-cyan-400' : 'hover:bg-zinc-100 border-zinc-200 text-blue-700'
                          }`}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onAskAIAboutEntity(entity.name)}
                          title="Ask Copilot about this entity"
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Ask AI</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
