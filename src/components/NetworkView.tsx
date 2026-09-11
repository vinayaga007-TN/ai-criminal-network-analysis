import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Play, 
  Pause, 
  Filter, 
  Search, 
  MessageSquare, 
  ShieldAlert, 
  X, 
  ExternalLink, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Building,
  User,
  Phone,
  MapPin,
  CreditCard,
  Radio
} from 'lucide-react';
import { Entity, EntityType, NetworkEdge } from '../types';
import { CASE_ENTITIES, CASE_EDGES, CASE_METADATA } from '../data/caseData';

interface NetworkViewProps {
  selectedEntityId?: string;
  onSelectEntity: (entityId: string) => void;
  onAskAIAboutEntity: (entityName: string) => void;
  onNavigateToEvidence: (evidenceId: string) => void;
  theme: 'dark' | 'light';
}

interface NodePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const NetworkView: React.FC<NetworkViewProps> = ({
  selectedEntityId,
  onSelectEntity,
  onAskAIAboutEntity,
  onNavigateToEvidence,
  theme,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPhysicsActive, setIsPhysicsActive] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [communityClusters, setCommunityClusters] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({});

  // Initialize node positions in a radial / force layout
  useEffect(() => {
    const positions: Record<string, NodePosition> = {};
    const width = 800;
    const height = 550;
    const centerX = width / 2;
    const centerY = height / 2;

    CASE_ENTITIES.forEach((entity, index) => {
      // Deepak Mehta at center
      if (entity.id === 'ent-deepak-mehta') {
        positions[entity.id] = { x: centerX, y: centerY, vx: 0, vy: 0 };
      } else {
        const angle = (index / (CASE_ENTITIES.length - 1)) * 2 * Math.PI;
        const radius = 170 + (index % 3) * 45;
        positions[entity.id] = {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        };
      }
    });
    setNodePositions(positions);
  }, []);

  // Simple gentle physics loop
  useEffect(() => {
    if (!isPhysicsActive) return;
    let animationFrameId: number;

    const updatePhysics = () => {
      setNodePositions((prev) => {
        const next: Record<string, NodePosition> = {};
        const width = 800;
        const height = 550;
        const centerX = width / 2;
        const centerY = height / 2;

        Object.keys(prev).forEach((id) => {
          if (id === draggingNodeId) {
            next[id] = prev[id];
            return;
          }

          let { x, y, vx, vy } = prev[id];

          // Center gravity
          const dx = centerX - x;
          const dy = centerY - y;
          vx += dx * 0.0003;
          vy += dy * 0.0003;

          // Repulsion from other nodes
          Object.keys(prev).forEach((otherId) => {
            if (id === otherId) return;
            const ox = prev[otherId].x;
            const oy = prev[otherId].y;
            const diffX = x - ox;
            const diffY = y - oy;
            const dist = Math.sqrt(diffX * diffX + diffY * diffY) || 1;
            if (dist < 180) {
              const force = (180 - dist) / dist * 0.04;
              vx += diffX * force;
              vy += diffY * force;
            }
          });

          // Damping
          vx *= 0.85;
          vy *= 0.85;

          x += vx;
          y += vy;

          // Boundaries
          x = Math.max(80, Math.min(width - 80, x));
          y = Math.max(80, Math.min(height - 80, y));

          next[id] = { x, y, vx, vy };
        });

        return next;
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPhysicsActive, draggingNodeId]);

  const filteredEntities = CASE_ENTITIES.filter((ent) => {
    const matchesFilter = filterType === 'all' || ent.type === filterType;
    const matchesSearch = !searchQuery || 
      ent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ent.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const selectedEntity = CASE_ENTITIES.find((e) => e.id === selectedEntityId) || CASE_ENTITIES[0];

  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== 'svg' && (e.target as HTMLElement).id !== 'network-canvas-bg') {
      return;
    }
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (draggingNodeId && nodePositions[draggingNodeId]) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const svgX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
        const svgY = (e.clientY - rect.top - panOffset.y) / zoomLevel;
        setNodePositions((prev) => ({
          ...prev,
          [draggingNodeId]: { ...prev[draggingNodeId], x: svgX, y: svgY, vx: 0, vy: 0 },
        }));
      }
    } else if (isDraggingCanvas) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUpCanvas = () => {
    setIsDraggingCanvas(false);
    setDraggingNodeId(null);
  };

  const getNodeColor = (type: EntityType) => {
    switch (type) {
      case 'person':
        return theme === 'dark' ? '#38bdf8' : '#0284c7'; // Sky / Blue
      case 'organization':
        return theme === 'dark' ? '#fbbf24' : '#d97706'; // Amber
      case 'phone':
        return theme === 'dark' ? '#c084fc' : '#9333ea'; // Purple
      case 'location':
        return theme === 'dark' ? '#34d399' : '#059669'; // Emerald
      case 'transaction':
        return theme === 'dark' ? '#2dd4bf' : '#0d9488'; // Teal
      default:
        return '#94a3b8';
    }
  };

  const getNodeIcon = (type: EntityType) => {
    switch (type) {
      case 'person': return <User className="w-3.5 h-3.5" />;
      case 'organization': return <Building className="w-3.5 h-3.5" />;
      case 'phone': return <Phone className="w-3.5 h-3.5" />;
      case 'location': return <MapPin className="w-3.5 h-3.5" />;
      case 'transaction': return <CreditCard className="w-3.5 h-3.5" />;
      default: return <Radio className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDownCanvas}
      onMouseMove={handleMouseMoveCanvas}
      onMouseUp={handleMouseUpCanvas}
      className={`flex h-full w-full relative overflow-hidden select-none ${
        theme === 'dark' ? 'bg-[#18181b] text-[#f4f4f5]' : 'bg-[#fcfcfd] text-[#18181b]'
      }`}
    >
      {/* Top Filter & Toolbar */}
      <div className={`absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 p-1.5 rounded-xl border backdrop-blur-md shadow-xs ${
        theme === 'dark' 
          ? 'bg-[#212124]/90 border-zinc-700/70 text-zinc-300' 
          : 'bg-white/90 border-zinc-200 text-zinc-800'
      }`}>
        {/* Entity Type Filter Tabs */}
        <div className="flex items-center gap-1">
          {['all', 'person', 'organization', 'phone', 'location'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                filterType === type
                  ? theme === 'dark'
                    ? 'bg-zinc-700 text-white font-semibold'
                    : 'bg-zinc-900 text-white font-semibold'
                  : theme === 'dark'
                    ? 'hover:bg-zinc-800 text-zinc-400'
                    : 'hover:bg-zinc-100 text-zinc-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className={`h-4 w-px ${theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-200'}`} />

        {/* Search Node */}
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2 top-2 text-zinc-400" />
          <input
            type="text"
            placeholder="Find node..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-28 sm:w-36 py-0.5 pl-6 pr-2 rounded-lg text-xs outline-none border transition-colors ${
              theme === 'dark'
                ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200 placeholder:text-zinc-500'
                : 'bg-zinc-50 border-zinc-200 text-zinc-800 placeholder:text-zinc-400'
            }`}
          />
        </div>

        <div className={`h-4 w-px ${theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-200'}`} />

        {/* Physics Toggle */}
        <button
          onClick={() => setIsPhysicsActive(!isPhysicsActive)}
          title={isPhysicsActive ? 'Pause physics layout' : 'Resume physics layout'}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            isPhysicsActive 
              ? theme === 'dark' ? 'text-cyan-400 bg-cyan-950/40' : 'text-cyan-700 bg-cyan-50' 
              : 'text-zinc-400 hover:bg-zinc-700/50'
          }`}
        >
          {isPhysicsActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Zoom Controls */}
        <button
          onClick={() => setZoomLevel((z) => Math.min(2, z + 0.15))}
          title="Zoom In"
          className="p-1.5 rounded-lg hover:bg-zinc-700/40 text-zinc-400 transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.15))}
          title="Zoom Out"
          className="p-1.5 rounded-lg hover:bg-zinc-700/40 text-zinc-400 transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}
          title="Reset View"
          className="p-1.5 rounded-lg hover:bg-zinc-700/40 text-zinc-400 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main SVG Interactive Graph Area */}
      <div className="flex-1 h-full w-full relative cursor-grab active:cursor-grabbing">
        <svg
          id="network-canvas-bg"
          className="w-full h-full"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Subtle Grid Background */}
          <defs>
            <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={theme === 'dark' ? '#27272a' : '#f0f0f2'}
                strokeWidth="0.8"
              />
            </pattern>
            {/* Edge Marker Arrows */}
            <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={theme === 'dark' ? '#52525b' : '#a1a1aa'} />
            </marker>
          </defs>

          <rect width="2000" height="2000" x="-500" y="-500" fill="url(#graph-grid)" />

          {/* Render Graph Edges */}
          <g className="edges">
            {CASE_EDGES.map((edge) => {
              const srcPos = nodePositions[edge.source];
              const tgtPos = nodePositions[edge.target];
              if (!srcPos || !tgtPos) return null;

              const isHighlighted = edge.source === selectedEntityId || edge.target === selectedEntityId;
              const midX = (srcPos.x + tgtPos.x) / 2;
              const midY = (srcPos.y + tgtPos.y) / 2;

              return (
                <g key={edge.id} className="transition-all">
                  <line
                    x1={srcPos.x}
                    y1={srcPos.y}
                    x2={tgtPos.x}
                    y2={tgtPos.y}
                    stroke={
                      isHighlighted
                        ? theme === 'dark' ? '#38bdf8' : '#0284c7'
                        : theme === 'dark' ? '#3f3f46' : '#cbd5e1'
                    }
                    strokeWidth={isHighlighted ? 2.2 : 1.2}
                    strokeDasharray={edge.type === 'intermediary' ? '4 3' : 'none'}
                    markerEnd="url(#arrow)"
                    className="transition-colors"
                  />
                  {isHighlighted && (
                    <text
                      x={midX}
                      y={midY - 6}
                      textAnchor="middle"
                      className={`text-[10px] font-mono font-medium pointer-events-none select-none ${
                        theme === 'dark' ? 'fill-cyan-300' : 'fill-blue-700'
                      }`}
                    >
                      {edge.amount || edge.callsCount ? `${edge.amount || `${edge.callsCount} calls`}` : edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Render Graph Nodes */}
          <g className="nodes">
            {filteredEntities.map((entity) => {
              const pos = nodePositions[entity.id];
              if (!pos) return null;

              const isSelected = entity.id === selectedEntityId;
              const color = getNodeColor(entity.type);
              const radius = entity.id === 'ent-deepak-mehta' ? 26 : 20;

              return (
                <g
                  key={entity.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDraggingNodeId(entity.id);
                    onSelectEntity(entity.id);
                  }}
                >
                  {/* Outer selection ring */}
                  {isSelected && (
                    <circle
                      r={radius + 8}
                      fill="none"
                      stroke={theme === 'dark' ? '#38bdf8' : '#0284c7'}
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="animate-spin-slow"
                    />
                  )}

                  {/* Priority halo */}
                  <circle
                    r={radius + 3}
                    fill={color}
                    fillOpacity={theme === 'dark' ? 0.15 : 0.2}
                  />

                  {/* Core Node Circle */}
                  <circle
                    r={radius}
                    fill={theme === 'dark' ? '#27272a' : '#ffffff'}
                    stroke={color}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all group-hover:scale-105"
                  />

                  {/* Node Label inside/under */}
                  <text
                    textAnchor="middle"
                    dy=".3em"
                    fill={color}
                    fontSize="10"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    {entity.name.split(' ')[0].substring(0, 3).toUpperCase()}
                  </text>

                  {/* Node Name Subtext */}
                  <text
                    y={radius + 14}
                    textAnchor="middle"
                    fill={theme === 'dark' ? '#e4e4e7' : '#18181b'}
                    fontSize="11"
                    fontWeight={isSelected ? '600' : '500'}
                    className="pointer-events-none select-none drop-shadow-xs"
                  >
                    {entity.name}
                  </text>

                  {/* Priority Tag */}
                  <text
                    y={radius + 25}
                    textAnchor="middle"
                    fill={theme === 'dark' ? '#a1a1aa' : '#71717a'}
                    fontSize="9"
                    fontFamily="monospace"
                    className="pointer-events-none select-none"
                  >
                    PRI: {entity.investigationPriority}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Right Contextual Dossier Panel (ChatGPT / Analyser AI style) */}
      <div className={`w-80 sm:w-96 border-l flex flex-col h-full shrink-0 z-10 transition-all duration-200 overflow-y-auto scrollbar-thin ${
        theme === 'dark' ? 'bg-[#1e1e22] border-[#2c2c30]' : 'bg-white border-zinc-200'
      }`}>
        {/* Dossier Header */}
        <div className="p-4 border-b border-inherit flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
              selectedEntity.type === 'person' ? 'bg-sky-500/20 text-sky-400' :
              selectedEntity.type === 'organization' ? 'bg-amber-500/20 text-amber-400' :
              selectedEntity.type === 'phone' ? 'bg-purple-500/20 text-purple-400' :
              selectedEntity.type === 'location' ? 'bg-emerald-500/20 text-emerald-400' :
              'bg-teal-500/20 text-teal-400'
            }`}>
              {getNodeIcon(selectedEntity.type)}
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight">{selectedEntity.name}</h3>
              <p className={`text-xs capitalize ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {selectedEntity.type} • {selectedEntity.alias || selectedEntity.role}
              </p>
            </div>
          </div>
        </div>

        {/* Priority & Centrality Metrics */}
        <div className="p-4 space-y-4">
          <div className={`p-3 rounded-xl border ${
            theme === 'dark' ? 'bg-[#26262b] border-zinc-700/60' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Investigation Priority
              </span>
              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                selectedEntity.priorityLevel === 'High' 
                  ? 'bg-rose-500/20 text-rose-400' 
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {selectedEntity.investigationPriority} / 100 ({selectedEntity.priorityLevel})
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-zinc-700/40 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-1.5 rounded-full" 
                style={{ width: `${selectedEntity.investigationPriority}%` }}
              />
            </div>
          </div>

          {/* Centrality Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className={`p-2.5 rounded-lg border text-center ${
              theme === 'dark' ? 'bg-[#26262b] border-zinc-700/60' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <span className="text-[10px] text-zinc-400 block font-mono">DEGREE</span>
              <span className="text-sm font-semibold">{selectedEntity.degree}</span>
            </div>
            <div className={`p-2.5 rounded-lg border text-center ${
              theme === 'dark' ? 'bg-[#26262b] border-zinc-700/60' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <span className="text-[10px] text-zinc-400 block font-mono">BETWEENNESS</span>
              <span className="text-sm font-semibold">{selectedEntity.betweenness}</span>
            </div>
            <div className={`p-2.5 rounded-lg border text-center ${
              theme === 'dark' ? 'bg-[#26262b] border-zinc-700/60' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <span className="text-[10px] text-zinc-400 block font-mono">PAGERANK</span>
              <span className="text-sm font-semibold">{selectedEntity.pagerank}</span>
            </div>
          </div>

          {/* Aggregated Topology Counts */}
          <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${
            theme === 'dark' ? 'bg-[#26262b]/60 border-zinc-700/40' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <div className="flex justify-between">
              <span className="text-zinc-400">Total Connections:</span>
              <span className="font-medium font-mono">{selectedEntity.connectionsCount} nodes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Organizations:</span>
              <span className="font-medium font-mono">{selectedEntity.organizationsCount} entities</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Recorded Transactions:</span>
              <span className="font-medium font-mono">{selectedEntity.transactionsCount} traces</span>
            </div>
          </div>

          {/* Potential Leads (Requires Verification) */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
              <span>Potential Leads</span>
              <span className="text-[10px] text-amber-500 font-normal">Requires verification</span>
            </h4>
            <div className="space-y-1.5">
              {selectedEntity.potentialLeads.map((lead, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs leading-relaxed ${
                    theme === 'dark' ? 'bg-[#26262b] border-zinc-700/60 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                  }`}
                >
                  {lead}
                </div>
              ))}
            </div>
          </div>

          {/* Details / Notes */}
          {selectedEntity.details.financialVolume && (
            <div className={`p-2.5 rounded-lg border text-xs ${
              theme === 'dark' ? 'bg-[#26262b]/40 border-zinc-700/40' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <span className="text-zinc-400 block text-[10px] font-mono">FINANCIAL VOLUME</span>
              <span className="font-semibold text-emerald-400">{selectedEntity.details.financialVolume}</span>
            </div>
          )}

          {/* Ask AI Action Button */}
          <div className="pt-2">
            <button
              id="ask-ai-dossier-btn"
              onClick={() => onAskAIAboutEntity(selectedEntity.name)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask AI about {selectedEntity.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
