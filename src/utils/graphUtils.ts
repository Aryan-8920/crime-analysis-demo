import { Entity, Relationship, EntityType } from '../types';

export interface CytoscapeNodeData {
  id: string;
  label: string;
  type: EntityType;
  identifier: string;
  riskScore: number;
  caseId: string;
  verified: boolean;
  degree?: number;
  color: string;
  borderColor: string;
}

export interface CytoscapeEdgeData {
  id: string;
  source: string;
  target: string;
  label: string;
  type: string;
  evidenceId: string;
  confidence: number;
  status: string;
  lineColor: string;
}

export const ENTITY_TYPE_CONFIG: Record<
  EntityType,
  { label: string; bg: string; border: string; icon: string; text: string }
> = {
  person: {
    label: 'Person / Suspect',
    bg: '#1e3a8a', // Deep Blue
    border: '#3b82f6',
    icon: 'user',
    text: '#93c5fd',
  },
  bank_account: {
    label: 'Bank Account',
    bg: '#064e3b', // Deep Emerald
    border: '#10b981',
    icon: 'credit-card',
    text: '#6ee7b7',
  },
  phone: {
    label: 'Phone / SIM',
    bg: '#78350f', // Deep Amber
    border: '#f59e0b',
    icon: 'phone',
    text: '#fcd34d',
  },
  device: {
    label: 'Hardware / Device',
    bg: '#581c87', // Deep Purple
    border: '#a855f7',
    icon: 'laptop',
    text: '#d8b4fe',
  },
  ip_address: {
    label: 'IP Address / Gateway',
    bg: '#134e4a', // Deep Teal
    border: '#14b8a6',
    icon: 'globe',
    text: '#5eead4',
  },
  vehicle: {
    label: 'Vehicle',
    bg: '#831843', // Deep Rose
    border: '#f43f5e',
    icon: 'car',
    text: '#fda4af',
  },
};

/**
 * Perform correct Breadth-First Search (BFS) to find all nodes
 * reachable within `maxHops` from `startNodeId`.
 * Guarantees no infinite loops, handles cycles and bidirectional navigation.
 */
export function getReachableNodesBFS(
  startNodeId: string,
  maxHops: number,
  edges: Relationship[]
): Set<string> {
  const reachable = new Set<string>([startNodeId]);
  if (maxHops <= 0) return reachable;

  // Build undirected adjacency list for reachability exploration
  const adj = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (edge.status !== 'approved') return;
    if (!adj.has(edge.sourceId)) adj.set(edge.sourceId, []);
    if (!adj.has(edge.targetId)) adj.set(edge.targetId, []);
    adj.get(edge.sourceId)!.push(edge.targetId);
    adj.get(edge.targetId)!.push(edge.sourceId);
  });

  const queue: { nodeId: string; depth: number }[] = [{ nodeId: startNodeId, depth: 0 }];
  const visited = new Set<string>([startNodeId]);

  while (queue.length > 0) {
    const { nodeId, depth } = queue.shift()!;
    if (depth >= maxHops) continue;

    const neighbors = adj.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        reachable.add(neighbor);
        queue.push({ nodeId: neighbor, depth: depth + 1 });
      }
    }
  }

  return reachable;
}

/**
 * Find shortest path between two nodes using BFS.
 * Returns ordered array of node IDs and edge IDs along the path.
 */
export function findShortestPath(
  startNodeId: string,
  targetNodeId: string,
  edges: Relationship[]
): { pathNodes: string[]; pathEdges: string[] } | null {
  if (startNodeId === targetNodeId) {
    return { pathNodes: [startNodeId], pathEdges: [] };
  }

  // Build adjacency with edge references
  const adj = new Map<string, { neighborId: string; edgeId: string }[]>();
  edges.forEach((edge) => {
    if (edge.status !== 'approved') return;
    if (!adj.has(edge.sourceId)) adj.set(edge.sourceId, []);
    if (!adj.has(edge.targetId)) adj.set(edge.targetId, []);
    adj.get(edge.sourceId)!.push({ neighborId: edge.targetId, edgeId: edge.id });
    adj.get(edge.targetId)!.push({ neighborId: edge.sourceId, edgeId: edge.id });
  });

  const queue: string[] = [startNodeId];
  const visited = new Set<string>([startNodeId]);
  const parent = new Map<string, { prevNodeId: string; edgeId: string }>();

  let found = false;
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === targetNodeId) {
      found = true;
      break;
    }

    const neighbors = adj.get(current) || [];
    for (const { neighborId, edgeId } of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        parent.set(neighborId, { prevNodeId: current, edgeId });
        queue.push(neighborId);
      }
    }
  }

  if (!found) return null;

  // Reconstruct path backwards
  const pathNodes: string[] = [];
  const pathEdges: string[] = [];
  let curr: string | undefined = targetNodeId;

  while (curr && curr !== startNodeId) {
    pathNodes.unshift(curr);
    const p = parent.get(curr);
    if (p) {
      pathEdges.unshift(p.edgeId);
      curr = p.prevNodeId;
    } else {
      break;
    }
  }
  pathNodes.unshift(startNodeId);

  return { pathNodes, pathEdges };
}

/**
 * Format entities and relationships into Cytoscape JSON element format.
 */
export function buildCytoscapeElements(
  entities: Entity[],
  relationships: Relationship[],
  selectedTypes: Set<EntityType>,
  hopFilterNodeId: string | null = null,
  maxHops: number = 4
) {
  let activeEntities = entities.filter((e) => selectedTypes.has(e.type));
  let approvedRelationships = relationships.filter((r) => r.status === 'approved');

  // If a hop filter is active on a chosen node, prune using BFS
  if (hopFilterNodeId) {
    const reachableNodeIds = getReachableNodesBFS(hopFilterNodeId, maxHops, approvedRelationships);
    activeEntities = activeEntities.filter((e) => reachableNodeIds.has(e.id));
  }

  const validNodeIds = new Set(activeEntities.map((e) => e.id));

  // Edges only between currently active nodes
  const activeEdges = approvedRelationships.filter(
    (r) => validNodeIds.has(r.sourceId) && validNodeIds.has(r.targetId)
  );

  // Compute degree for each active node
  const degreeMap = new Map<string, number>();
  activeEdges.forEach((e) => {
    degreeMap.set(e.sourceId, (degreeMap.get(e.sourceId) || 0) + 1);
    degreeMap.set(e.targetId, (degreeMap.get(e.targetId) || 0) + 1);
  });

  const cyNodes = activeEntities.map((entity) => {
    const config = ENTITY_TYPE_CONFIG[entity.type] || ENTITY_TYPE_CONFIG.person;
    return {
      data: {
        id: entity.id,
        label: entity.name,
        type: entity.type,
        identifier: entity.identifier,
        riskScore: entity.riskScore,
        caseId: entity.caseId,
        verified: entity.verified,
        degree: degreeMap.get(entity.id) || 0,
        color: config.bg,
        borderColor: config.border,
      },
    };
  });

  const cyEdges = activeEdges.map((rel) => {
    let lineColor = '#475569';
    if (rel.type === 'TRANSACTED_TO') lineColor = '#10b981';
    else if (rel.type === 'CALL_RECORD') lineColor = '#f59e0b';
    else if (rel.type === 'HOLDS_ACCOUNT') lineColor = '#3b82f6';
    else if (rel.type === 'ACCESSED_IP' || rel.type === 'USED_DEVICE') lineColor = '#8b5cf6';

    return {
      data: {
        id: rel.id,
        source: rel.sourceId,
        target: rel.targetId,
        label: rel.label,
        type: rel.type,
        evidenceId: rel.evidenceId,
        confidence: rel.confidence,
        status: rel.status,
        lineColor,
      },
    };
  });

  return [...cyNodes, ...cyEdges];
}
