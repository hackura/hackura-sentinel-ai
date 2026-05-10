import neo4j from 'neo4j-driver';

type Driver = any

const { Driver: DriverCtor } = neo4j as any;
import { logger } from '../config/logger.js';

const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

let driver: any | null = null;

function getDriver(): any | null {
  if (!NEO4J_URI || !NEO4J_PASSWORD) {
    logger.warn('Neo4j credentials not configured — graph queries will use AI fallback');
    return null;
  }

  if (!driver) {
    try {
driver = neo4j.driver(
        NEO4J_URI,
        neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD),
        {}
      );
      logger.info('Neo4j driver initialized');
    } catch (error) {
      logger.error({ error }, 'Failed to create Neo4j driver');
      return null;
    }
  }

  return driver;
}

// Query threat graph for an entity from Neo4j
export async function queryThreatGraph(entity: string): Promise<{ nodes: any[]; edges: any[] } | null> {
  const neo4j = getDriver();
  if (!neo4j) return null;

  const session = neo4j.session();
  try {
    // Find central entity by name, then get 2-hop neighborhood
    const query = `
      MATCH (center)
      WHERE toLower(center.name) = toLower($entity)
        OR center.id = $entity
      WITH center
      LIMIT 1

      OPTIONAL MATCH (center)-[r1]-(neighbor1)
      WITH center, collect(DISTINCT {node: neighbor1, rel: r1}) as level1

      UNWIND level1 as item1
      OPTIONAL MATCH (item1.node)-[r2]-(neighbor2)
      WITH center, level1, collect(DISTINCT {node: neighbor2, rel: r2}) as level2

      // Collect all unique nodes
      WITH center,
           [center] +
           [x IN level1 WHERE x.node IS NOT NULL | x.node] +
           [x IN level2 WHERE x.node IS NOT NULL AND NOT x.node IN [center] + [y IN level1 | y.node] | x.node] as allNodes,
           [x IN level1 WHERE x.rel IS NOT NULL | x.rel] +
           [x IN level2 WHERE x.rel IS NOT NULL | x.rel] as allRels

      UNWIND allNodes as n
      WITH collect(DISTINCT n) as uniqueNodes, allRels
      UNWIND allRels as rel
      WITH uniqueNodes, collect(DISTINCT rel) as uniqueRels

      RETURN uniqueNodes as nodes, uniqueRels as rels
    `;

    const result = await session.run(query, { entity: entity.toLowerCase().trim() });

    if (!result.records.length || result.records[0].get('nodes').length === 0) {
      return null;
    }

    const record = result.records[0];
    const nodes = record.get('nodes') || [];
    const rels = record.get('rels') || [];

    // Transform Neo4j nodes to API format
    const nodeList = nodes.map((node: any): any => {
      const labels = node.labels || [];
      const props = node.properties || {};
      return {
        id: props.id || props.name || node.elementId,
        label: props.name || props.id || node.elementId,
        type: labels[0]?.toLowerCase() || 'unknown',
        risk_level: props.risk_level || 'MEDIUM',
        description: props.description,
      };
    });

    // Transform relationships
    const edgeList = (rels || []).map((rel: any) => {
      const startId = rel.startNodeElementId || rel.start?.properties?.id || rel.start?.properties?.name;
      const endId = rel.endNodeElementId || rel.end?.properties?.id || rel.end?.properties?.name;
      return {
        source: startId,
        target: endId,
        relationship: rel.type || 'related_to',
      };
    }).filter((e: any) => e.source && e.target);

    return { nodes: nodeList, edges: edgeList };
  } catch (error: any) {
    logger.error({ error: error.message, entity }, 'Neo4j query failed');
    return null;
  } finally {
    await session.close();
  }
}

// Get stats from Neo4j (optional enhancement)
export async function getNeo4jStats() {
  const neo4j = getDriver();
  if (!neo4j) return null;

  const session = neo4j.session();
  try {
    const result = await session.run(`
      MATCH (n)
      RETURN
        count(n) as total_nodes,
        size([(n)-[]->() | n]) as total_relationships
    `);

    if (result.records.length) {
      const record = result.records[0];
      return {
        total_nodes: record.get('total_nodes'),
        total_relationships: record.get('total_relationships'),
      };
    }
    return null;
  } catch (error: any) {
    logger.error({ error }, 'Neo4j stats query failed');
    return null;
  } finally {
    await session.close();
  }
}

// Close driver on shutdown
export function closeNeo4j() {
  if (driver) {
    driver.close();
    logger.info('Neo4j driver closed');
  }
}
