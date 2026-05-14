import Fuse from 'fuse.js';
import { flattenDocIndex, type DocPageMeta } from './index';

const fuse = new Fuse(flattenDocIndex(), {
  keys: ['title', 'description', 'summary', 'section'],
  threshold: 0.35,
  ignoreLocation: true,
  includeScore: true,
});

export type DocSearchResult = DocPageMeta & { score?: number };

export function searchDocs(query: string, limit = 8): DocSearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  return fuse.search(trimmed).slice(0, limit).map((result) => ({
    ...result.item,
    score: result.score,
  }));
}
