import { createClient } from 'neo4j-driver';
import { logger } from '../config/logger.js';

const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

let neo4jDriver: ReturnType<typeof createClient> | null = null;

function getNeo4jDriver() {
  if (!NEO4J_URI || !NEO4J_USERNAME || !NEO4J_PASSWORD) {
    logger.warn('Neo4j credentials not configured. Graph queries will use AI fallback.');
    return null;
  }

  if (!neo4jDriver) {
    try {
      neo4jDriver = createClient(NEO4J_URI, {
        username: NEO4J_USERNAME,
        password: NEO4J_PASSWORD,
      });
      logger.info('Neo4j driver initialized');
    } catch (error) {
      logger.error({ error }, 'Failed to create Neo4j driver');
      return null;
    }
  }

  return neo4jDriver;
}

export { getNeo4jDriver };