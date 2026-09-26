import { SearchNode } from '@/models/Node';
import { SearchStep } from '@/models/SearchStep';

export interface SearchResult {
  /*
   * true = Jerry foi encontrado
   * false = não existe caminho
   */
  found: boolean;

  /*
   * Caminho final:
   *
   * Tom -> ... -> Jerry
   */
  path: SearchNode[];

  /*
   * Nós realmente retirados da lista aberta
   * e analisados pelo algoritmo.
   */
  visitedNodes: SearchNode[];

  /*
   * Eventos usados futuramente
   * para fazer a animação.
   */
  steps: SearchStep[];

  /*
   * Custo G de Jerry.
   */
  totalCost: number;
}