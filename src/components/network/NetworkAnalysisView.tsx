import React, { useEffect, useRef, useState, useMemo } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import {
  Share2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Filter,
  Route,
  Info,
  CheckCircle,
  ShieldAlert,
  User,
  CreditCard,
  Phone,
  Laptop,
  Globe,
  Car,
  X,
  ExternalLink,
  Layers,
  ArrowRight,
  Compass,
  FileText,
  Radio,
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Entity, Relationship, EntityType, EvidenceItem } from '../../types';
import {
  buildCytoscapeElements,
  getReachableNodesBFS,
  findShortestPath,
  ENTITY_TYPE_CONFIG,
} from '../../utils/graphUtils';

export const NetworkAnalysisView: React.FC = () => {
  const {
    cases,
    selectedCaseId,
    setSelectedCaseId,
    selectedCase,
    entities,
    relationships,
    evidence,
    networkSelectedNodeId,
    setNetworkSelectedNodeId,
    networkHopCount,
    setNetworkHopCount,
    setSelectedEvidenceId,
    setCasesSubTab,
    setActiveTab,
  } = useInvestigation();

  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<EntityType>>(
    new Set(['person', 'bank_account', 'phone', 'device', 'ip_address', 'vehicle'])
  );
  const [layoutName, setLayoutName] = useState<'cose' | 'concentric' | 'breadthfirst' | 'circle'>('cose');

  // Selection states
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<Entity | null>(null);
  const [selectedEdgeDetails, setSelectedEdgeDetails] = useState<Relationship | null>(null);

  // Pathfinding states
  const [isPathFindingActive, setIsPathFindingActive] = useState(false);
  const [pathStartNodeId, setPathStartNodeId] = useState<string>('');
  const [pathEndNodeId, setPathEndNodeId] = useState<string>('');
  const [pathResult, setPathResult] = useState<{ pathNodes: string[]; pathEdges: string[] } | null>(null);

  // Filter entities & relationships for the active case
  const caseEntities = useMemo(
    () => entities.filter((e) => e.caseId === selectedCaseId),
    [entities, selectedCaseId]
  );
  const caseRelationships = useMemo(
    () => relationships.filter((r) => r.caseId === selectedCaseId && r.status === 'approved'),
    [relationships, selectedCaseId]
  );

  // Keep path selector defaults aligned
  useEffect(() => {
    if (caseEntities.length >= 2) {
      if (!pathStartNodeId || !caseEntities.some((e) => e.id === pathStartNodeId)) {
        setPathStartNodeId(caseEntities[0].id);
      }
      if (!pathEndNodeId || !caseEntities.some((e) => e.id === pathEndNodeId)) {
        setPathEndNodeId(caseEntities[caseEntities.length - 1].id);
      }
    }
  }, [caseEntities, selectedCaseId]);

  // Sync selected node with details
  useEffect(() => {
    if (networkSelectedNodeId) {
      const ent = entities.find((e) => e.id === networkSelectedNodeId);
      setSelectedNodeDetails(ent || null);
    } else {
      setSelectedNodeDetails(null);
    }
  }, [networkSelectedNodeId, entities]);

  // Sync selected edge with details
  useEffect(() => {
    if (selectedEdgeId) {
      const rel = relationships.find((r) => r.id === selectedEdgeId);
      setSelectedEdgeDetails(rel || null);
    } else {
      setSelectedEdgeDetails(null);
    }
  }, [selectedEdgeId, relationships]);

  // Initialize or update Cytoscape
  useEffect(() => {
    if (!containerRef.current) return;

    // Build elements respecting entity filters and hop BFS if active
    const elements = buildCytoscapeElements(
      caseEntities,
      caseRelationships,
      selectedTypes,
      networkSelectedNodeId,
      networkHopCount
    );

    // Destroy prior instance if existing
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      boxSelectionEnabled: false,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'border-color': 'data(borderColor)',
            'border-width': 2,
            'label': 'data(label)',
            'color': '#f8fafc',
            'font-size': '11px',
            'font-family': 'Plus Jakarta Sans, sans-serif',
            'font-weight': 600,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-background-color': '#090d16',
            'text-background-opacity': 0.85,
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
            'width': 44,
            'height': 44,
            'transition-property': 'background-color, border-color, border-width, opacity',
            'transition-duration': 0.2,
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-color': '#00f2fe',
            'border-width': 5,
            'border-opacity': 1,
            'z-index': 999,
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2.5,
            'line-color': 'data(lineColor)',
            'target-arrow-color': 'data(lineColor)',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 1.1,
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '9px',
            'color': '#94a3b8',
            'text-rotation': 'autorotate',
            'text-background-color': '#040816',
            'text-background-opacity': 0.85,
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle',
            'transition-property': 'width, line-color, opacity',
            'transition-duration': 0.2,
          },
        },
        {
          selector: 'edge:selected',
          style: {
            'width': 4.5,
            'line-color': '#00f2fe',
            'target-arrow-color': '#00f2fe',
            'font-weight': 700,
            'color': '#00f2fe',
          },
        },
        {
          selector: '.highlighted',
          style: {
            'border-color': '#00f2fe',
            'border-width': 5,
            'border-opacity': 1,
            'z-index': 998,
          },
        },
        {
          selector: '.edge-highlighted',
          style: {
            'width': 4.5,
            'line-color': '#00f2fe',
            'target-arrow-color': '#00f2fe',
            'color': '#00f2fe',
            'font-weight': 700,
          },
        },
        {
          selector: '.dimmed',
          style: {
            'opacity': 0.18,
          },
        },
      ],
      layout: {
        name: layoutName,
        padding: 40,
        animate: true,
        animationDuration: 500,
      },
    });

    cyRef.current = cy;

    // Node click handler
    cy.on('tap', 'node', (evt: EventObject) => {
      const node = evt.target;
      const nodeId = node.id();
      setNetworkSelectedNodeId(nodeId);
      setSelectedEdgeId(null);

      // Highlight incident edges and neighbor nodes
      cy.elements().removeClass('highlighted edge-highlighted dimmed');
      const neighborhood = node.neighborhood().add(node);
      cy.elements().not(neighborhood).addClass('dimmed');
      node.addClass('highlighted');
      node.connectedEdges().addClass('edge-highlighted');
    });

    // Edge click handler
    cy.on('tap', 'edge', (evt: EventObject) => {
      const edge = evt.target;
      setSelectedEdgeId(edge.id());
      setNetworkSelectedNodeId(null);

      cy.elements().removeClass('highlighted edge-highlighted dimmed');
      const endpoints = edge.connectedNodes();
      cy.elements().not(endpoints.add(edge)).addClass('dimmed');
      endpoints.addClass('highlighted');
      edge.addClass('edge-highlighted');
    });

    // Background click handler (resets dimming)
    cy.on('tap', (evt: EventObject) => {
      if (evt.target === cy) {
        setNetworkSelectedNodeId(null);
        setSelectedEdgeId(null);
        cy.elements().removeClass('highlighted edge-highlighted dimmed');
      }
    });

    // If initial selected node exists, zoom and highlight
    if (networkSelectedNodeId) {
      const initialNode = cy.getElementById(networkSelectedNodeId);
      if (initialNode && initialNode.length > 0) {
        initialNode.select();
        const neighborhood = initialNode.neighborhood().add(initialNode);
        cy.elements().not(neighborhood).addClass('dimmed');
        initialNode.addClass('highlighted');
        initialNode.connectedEdges().addClass('edge-highlighted');
      }
    }

    return () => {
      cy.destroy();
    };
  }, [
    caseEntities,
    caseRelationships,
    selectedTypes,
    layoutName,
    networkHopCount,
    // note: networkSelectedNodeId triggers hop BFS re-layout when hop filter applies
  ]);

  // Zoom and Layout Controls
  const handleZoomIn = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 1.25);
  };

  const handleZoomOut = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 0.8);
  };

  const handleFit = () => {
    if (cyRef.current) cyRef.current.fit(undefined, 40);
  };

  // Search entity in graph
  const handleSearchEntity = (query: string) => {
    setSearchQuery(query);
    if (!cyRef.current || !query.trim()) return;

    const matched = cyRef.current.nodes().filter((node) => {
      const label = node.data('label') || '';
      const id = node.data('id') || '';
      const ident = node.data('identifier') || '';
      return (
        label.toLowerCase().includes(query.toLowerCase()) ||
        id.toLowerCase().includes(query.toLowerCase()) ||
        ident.toLowerCase().includes(query.toLowerCase())
      );
    });

    if (matched.length > 0) {
      cyRef.current.elements().removeClass('highlighted edge-highlighted dimmed');
      matched.addClass('highlighted');
      cyRef.current.animate({
        center: { eles: matched },
        zoom: 1.3,
        duration: 400,
      });
      const firstId = matched[0].id();
      setNetworkSelectedNodeId(firstId);
    }
  };

  // Toggle entity type filter
  const toggleEntityType = (type: EntityType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  // Run Path Finding between 2 entities
  const handleFindPath = () => {
    if (!pathStartNodeId || !pathEndNodeId) return;
    const res = findShortestPath(pathStartNodeId, pathEndNodeId, caseRelationships);
    setPathResult(res);

    if (cyRef.current && res) {
      cyRef.current.elements().removeClass('highlighted edge-highlighted dimmed');
      const pathEleCollection = cyRef.current.collection();

      res.pathNodes.forEach((nId) => {
        pathEleCollection.merge(cyRef.current!.getElementById(nId));
      });
      res.pathEdges.forEach((eId) => {
        pathEleCollection.merge(cyRef.current!.getElementById(eId));
      });

      cyRef.current.elements().not(pathEleCollection).addClass('dimmed');
      pathEleCollection.filter('node').addClass('highlighted');
      pathEleCollection.filter('edge').addClass('edge-highlighted');
      cyRef.current.animate({
        center: { eles: pathEleCollection },
        zoom: 1.1,
        duration: 400,
      });
    }
  };

  // Direct connections for selected node
  const directConnections = useMemo(() => {
    if (!selectedNodeDetails) return [];
    return caseRelationships.filter(
      (r) => r.sourceId === selectedNodeDetails.id || r.targetId === selectedNodeDetails.id
    );
  }, [selectedNodeDetails, caseRelationships]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-16">
      {/* Top Controls Toolbar */}
      <div className="bg-[#060e24]/95 border border-[#142346] rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        {/* Left: Case Selector & Quick Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#00f2fe]" />
            <h2 className="text-base font-black text-white tracking-tight uppercase font-mono">
              Forensic Network Link Graph
            </h2>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search entity in graph..."
              value={searchQuery}
              onChange={(e) => handleSearchEntity(e.target.value)}
              className="w-full bg-[#040817] border border-[#172b57] focus:border-[#00f2fe] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00f2fe] font-mono shadow-inner"
            />
          </div>
        </div>

        {/* Center: Hop Selector (1 Hop, 2 Hops, 3 Hops, 4 Hops) */}
        <div className="flex items-center gap-2 bg-[#040817] p-1.5 rounded-xl border border-[#172b57]">
          <span className="text-[11px] font-bold text-slate-300 px-2 uppercase tracking-wider flex items-center gap-1 font-mono">
            <Compass className="w-3.5 h-3.5 text-[#00f2fe]" />
            BFS Hop Analysis:
          </span>
          {[1, 2, 3, 4].map((hop) => (
            <button
              key={hop}
              onClick={() => setNetworkHopCount(hop)}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                networkHopCount === hop
                  ? 'bg-[#00f2fe] text-slate-950 shadow-md shadow-[#00f2fe]/30 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-[#091538]'
              }`}
            >
              {hop} {hop === 1 ? 'Hop' : 'Hops'}
            </button>
          ))}
          <button
            onClick={() => setNetworkHopCount(99)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium font-mono transition-all ${
              networkHopCount > 4
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-[#091538]'
            }`}
          >
            All
          </button>
        </div>

        {/* Right: Path Finding Toggle & Graph Layout */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!cyRef.current) return;
              const nodes = cyRef.current.nodes();
              if (nodes.length === 0) return;
              // Animate a pulse across nodes
              nodes.forEach((n, idx) => {
                setTimeout(() => {
                  n.animate({
                    style: { 'border-width': 8, 'border-color': '#38bdf8' },
                    duration: 250,
                    complete: () => {
                      n.animate({
                        style: { 'border-width': 2, 'border-color': n.data('borderColor') },
                        duration: 350,
                      });
                    },
                  });
                }, idx * 120);
              });
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800 flex items-center gap-1.5 transition-all shadow-sm"
            title="Send radar pulse ping across active network nodes"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Telemetry Ping</span>
          </button>

          <button
            onClick={() => setIsPathFindingActive(!isPathFindingActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isPathFindingActive
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 ring-1 ring-cyan-500/30'
                : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <Route className="w-3.5 h-3.5 text-cyan-400" />
            <span>Path Tracer</span>
          </button>

          <select
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
          >
            <option value="cose">Force Layout (Cose)</option>
            <option value="concentric">Concentric Radar</option>
            <option value="breadthfirst">Breadthfirst Tree</option>
            <option value="circle">Circular Topology</option>
          </select>
        </div>
      </div>

      {/* Entity Type Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#040817]/90 px-4 py-2.5 rounded-xl border border-[#142346] text-xs text-slate-300 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1 font-mono">
            <Filter className="w-3 h-3 text-[#00f2fe]" /> Filter Types:
          </span>

          {(['person', 'bank_account', 'phone', 'device', 'ip_address', 'vehicle'] as EntityType[]).map(
            (type) => {
              const active = selectedTypes.has(type);
              const cfg = ENTITY_TYPE_CONFIG[type];
              return (
                <button
                  key={type}
                  onClick={() => toggleEntityType(type)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all border ${
                    active
                      ? 'bg-[#081536] text-white border-[#00f2fe]/50 shadow-[0_0_10px_-2px_rgba(0,242,254,0.3)]'
                      : 'bg-[#040817] text-slate-400 border-[#142346] hover:text-slate-200 hover:border-[#1e3466]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: active ? cfg.border : '#475569' }}
                  />
                  <span>{cfg.label}</span>
                </button>
              );
            }
          )}
        </div>

        <div className="text-[11px] font-mono text-[#00f2fe] font-bold">
          Nodes: {caseEntities.length} • Edges: {caseRelationships.length}
        </div>
      </div>

      {/* Path Finding Sub-Panel */}
      {isPathFindingActive && (
        <div className="bg-slate-900 border border-cyan-500/40 rounded-xl p-4 shadow-lg space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Graph Shortest Path Finder (BFS Algorithm)
              </h4>
            </div>
            <button
              onClick={() => setIsPathFindingActive(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Origin Entity (Source)</label>
              <select
                value={pathStartNodeId}
                onChange={(e) => setPathStartNodeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              >
                {caseEntities.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Target Entity (Destination)</label>
              <select
                value={pathEndNodeId}
                onChange={(e) => setPathEndNodeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              >
                {caseEntities.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.type})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleFindPath}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-950 flex items-center justify-center gap-1.5 transition-all"
            >
              <Route className="w-3.5 h-3.5" />
              <span>Trace Connection Path</span>
            </button>
          </div>

          {pathResult && (
            <div className="mt-2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-300">
                Path Found:{' '}
                <strong className="text-cyan-300">{pathResult.pathNodes.length} nodes</strong> (
                {pathResult.pathEdges.length} hops)
              </span>
              <div className="flex items-center gap-1.5 font-mono text-cyan-400 text-[11px]">
                {pathResult.pathNodes.map((nId, idx) => {
                  const ent = entities.find((e) => e.id === nId);
                  return (
                    <React.Fragment key={nId}>
                      <span className="bg-slate-850 px-2 py-0.5 rounded text-white font-semibold">
                        {ent?.name || nId}
                      </span>
                      {idx < pathResult.pathNodes.length - 1 && <span>→</span>}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Canvas & Details Drawer Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 relative">
        {/* Graph Canvas Container (3 or 4 cols) */}
        <div
          className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden h-[620px] shadow-2xl"
          style={{
            backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.12) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          {/* Zoom & Fit Floating HUD */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleFit}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Fit to Screen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Graph Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800/80 shadow-xl max-w-xs text-[11px] space-y-1.5">
            <span className="font-bold uppercase tracking-wider text-slate-400 block text-[10px]">
              Network Legend
            </span>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Suspect / Person
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Bank Account
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Phone / SIM
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Hardware / Device
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span> IP / Proxy Gateway
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Vehicle
              </span>
            </div>
            <div className="pt-1.5 border-t border-slate-800 text-[9px] text-slate-400">
              Lines: Green (Transfer), Amber (Call), Blue (Holds Account), Violet (IP/Device).
            </div>
          </div>

          {/* Cytoscape Canvas Target */}
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        </div>

        {/* Right Details Panel (Node or Edge Details) */}
        <div className="bg-[#060e24]/95 border border-[#142346] rounded-xl p-4 h-[620px] overflow-y-auto space-y-4 shadow-xl">
          {/* If Node Selected */}
          {selectedNodeDetails ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {selectedNodeDetails.type.replace('_', ' ')}
                  </span>
                  <h3 className="mt-1.5 text-base font-bold text-white">
                    {selectedNodeDetails.name}
                  </h3>
                  <p className="text-xs font-mono text-cyan-400 mt-0.5">
                    {selectedNodeDetails.identifier}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Risk Index</span>
                  <span
                    className={`text-lg font-bold font-mono ${
                      selectedNodeDetails.riskScore >= 80
                        ? 'text-rose-400'
                        : selectedNodeDetails.riskScore >= 60
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {selectedNodeDetails.riskScore}/100
                  </span>
                </div>
              </div>

              {/* Node Role & Verification */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Role</span>
                <p className="text-slate-200 font-medium">
                  {selectedNodeDetails.role || 'Investigative Subject'}
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Relationship verification: Verified Lead</span>
                </div>
              </div>

              {/* Direct Connections Count & List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-300">
                    Direct Connections ({directConnections.length})
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">1-Hop Degree</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {directConnections.map((rel) => {
                    const isSource = rel.sourceId === selectedNodeDetails.id;
                    const neighborId = isSource ? rel.targetId : rel.sourceId;
                    const neighbor = entities.find((e) => e.id === neighborId);

                    return (
                      <div
                        key={rel.id}
                        onClick={() => setNetworkSelectedNodeId(neighborId)}
                        className="p-2 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 text-xs cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div className="truncate pr-2">
                          <p className="font-semibold text-white truncate">
                            {neighbor?.name || neighborId}
                          </p>
                          <span className="text-[10px] text-cyan-400 font-mono">
                            {rel.label || rel.type}
                          </span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Supporting Evidence Reference */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Supporting Evidence Leads
                </span>
                <div className="space-y-1">
                  {directConnections.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => {
                        setSelectedEvidenceId(rel.evidenceId);
                        setCasesSubTab('evidence');
                        setActiveTab('cases');
                      }}
                      className="w-full text-left p-2 rounded bg-slate-950/40 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between transition-colors font-mono"
                    >
                      <span className="text-cyan-300 truncate">{rel.evidenceId}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedEdgeDetails ? (
            /* If Edge Selected */
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-slate-800">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Relationship Edge
                </span>
                <h3 className="mt-1.5 text-base font-bold text-white">
                  {selectedEdgeDetails.label || selectedEdgeDetails.type}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  ID: {selectedEdgeDetails.id}
                </p>
              </div>

              {/* Edge Endpoints */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Source Node</span>
                  <p className="font-bold text-white mt-0.5">
                    {entities.find((e) => e.id === selectedEdgeDetails.sourceId)?.name || selectedEdgeDetails.sourceId}
                  </p>
                </div>

                <div className="flex justify-center text-cyan-400">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Node</span>
                  <p className="font-bold text-white mt-0.5">
                    {entities.find((e) => e.id === selectedEdgeDetails.targetId)?.name || selectedEdgeDetails.targetId}
                  </p>
                </div>
              </div>

              {/* Relationship Confidence & Status */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Analytic Confidence:</span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {(selectedEdgeDetails.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Review Status:</span>
                  <span className="text-emerald-400 font-semibold uppercase text-[10px]">
                    {selectedEdgeDetails.status}
                  </span>
                </div>
              </div>

              {/* Supporting Evidence Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedEvidenceId(selectedEdgeDetails.evidenceId);
                    setCasesSubTab('evidence');
                    setActiveTab('cases');
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-blue-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Evidence ({selectedEdgeDetails.evidenceId})</span>
                </button>
              </div>
            </div>
          ) : (
            /* Nothing Selected: Empty Guidance State */
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
                <Share2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">Inspect Network Nodes</h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Click any node or relationship edge on the canvas to inspect entity profiles, direct connections, and evidentiary citations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Network Disclaimer Note */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span className="text-slate-300 font-medium">
          Network connections are analytical leads and do not prove criminal activity.
        </span>
      </div>
    </div>
  );
};
