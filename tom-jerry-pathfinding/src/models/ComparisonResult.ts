import { SearchResult } from '@/models/SearchResult';

export interface ComparisonResult {
  aStar: SearchResult;
  greedy: SearchResult;
}
