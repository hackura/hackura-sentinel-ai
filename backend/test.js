#!/usr/bin/env node
/**
 * Quick test script for backend endpoints
 * Usage: node test.js
 */

const axios = require('axios');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const TOKEN = process.env.TEST_TOKEN; // optional — for protected routes

async function test() {
  console.log(`🧪 Testing ${BASE_URL}\n`);

  // Health
  try {
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health:', health.data);
  } catch (e: any) {
    console.error('❌ Health failed:', e.message);
    return;
  }

  // Graph (requires auth)
  if (TOKEN) {
    try {
      const graph = await axios.get(`${BASE_URL}/graph/example.com`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      console.log('✅ Graph:', `${graph.data.nodes?.length || 0} nodes, ${graph.data.edges?.length || 0} edges`);
    } catch (e: any) {
      console.error('❌ Graph failed:', e.message);
    }
  } else {
    console.log('⚠️  Skipping /graph (no TEST_TOKEN)');
  }

  // Stats (requires auth)
  if (TOKEN) {
    try {
      const stats = await axios.get(`${BASE_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      console.log('✅ Stats:', stats.data);
    } catch (e: any) {
      console.error('❌ Stats failed:', e.message);
    }
  } else {
    console.log('⚠️  Skipping /dashboard/stats (no TEST_TOKEN)');
  }

  console.log('\n✨ Test complete');
}

test().catch(console.error);
