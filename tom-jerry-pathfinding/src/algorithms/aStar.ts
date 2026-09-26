import { calculateHeuristic } from '@/algorithms/heuristics';

import { CellType } from '@/models/CellType';
import { HeuristicType } from '@/models/HeuristicType';
import { SearchNode } from '@/models/Node';
import { SearchResult } from '@/models/SearchResult';
import { SearchStep } from '@/models/SearchStep';

/*
 * Neste primeiro A* vamos trabalhar
 * somente com 4 direções.
 *
 * ↑
 * ← → 
 * ↓
 *
 * Cada movimento custa 10.
 *
 * O movimento em 8 direções será
 * adicionado posteriormente.
 */
const DIRECTIONS = [
  {
    row: -1,
    col: 0,
    cost: 10,
  },
  {
    row: 1,
    col: 0,
    cost: 10,
  },
  {
    row: 0,
    col: -1,
    cost: 10,
  },
  {
    row: 0,
    col: 1,
    cost: 10,
  },
];

/*
 * =========================================
 * A*
 * =========================================
 *
 * O A* escolhe o nó com menor:
 *
 * F = G + H
 */
export function aStar(
  grid: CellType[][],
  heuristic: HeuristicType = 'MANHATTAN'
): SearchResult {
  /*
   * Localizamos Tom.
   */
  const startPosition =
    findPosition(
      grid,
      'START'
    );

  /*
   * Localizamos Jerry.
   */
  const goalPosition =
    findPosition(
      grid,
      'GOAL'
    );

  /*
   * Segurança.
   *
   * Se não existir Tom ou Jerry,
   * não é possível executar a busca.
   */
  if (
    !startPosition ||
    !goalPosition
  ) {
    return createEmptyResult();
  }

  /*
   * =====================================
   * LISTA ABERTA
   * =====================================
   *
   * Nós que já foram descobertos,
   * mas ainda podem ser analisados.
   */
  const openList: SearchNode[] = [];

  /*
   * =====================================
   * LISTA FECHADA
   * =====================================
   *
   * Guarda as posições dos nós
   * já analisados.
   */
  const closedSet =
    new Set<string>();

  /*
   * Guarda a melhor versão conhecida
   * de cada nó.
   *
   * Será importante para atualizar
   * G, H, F e parent.
   */
  const nodeMap =
    new Map<string, SearchNode>();

  /*
   * Eventos para a futura animação.
   */
  const steps: SearchStep[] = [];

  /*
   * Nós efetivamente visitados.
   */
  const visitedNodes: SearchNode[] = [];

  /*
   * =====================================
   * CRIAR NÓ INICIAL
   * =====================================
   */

  const startH =
    calculateHeuristic(
      heuristic,

      startPosition.row,
      startPosition.col,

      goalPosition.row,
      goalPosition.col
    );

  const startNode: SearchNode = {
    row: startPosition.row,
    col: startPosition.col,

    g: 0,
    h: startH,
    f: startH,

    parent: null,
  };

  /*
   * Coloca Tom na lista aberta.
   */
  openList.push(startNode);

  nodeMap.set(
    makeKey(
      startNode.row,
      startNode.col
    ),
    startNode
  );

  /*
   * Primeiro evento.
   */
  steps.push({
    row: startNode.row,
    col: startNode.col,

    g: startNode.g,
    h: startNode.h,
    f: startNode.f,

    type: 'OPENED',
  });

  /*
   * =====================================
   * LOOP PRINCIPAL
   * =====================================
   */

  while (
    openList.length > 0
  ) {
    /*
     * Ordenamos pelo menor F.
     *
     * Em caso de empate,
     * usamos menor H.
     */
    openList.sort(
      (a, b) => {
        if (a.f !== b.f) {
          return a.f - b.f;
        }

        return a.h - b.h;
      }
    );

    /*
     * Retira o melhor candidato
     * da lista aberta.
     */
    const current =
      openList.shift();

    if (!current) {
      break;
    }

    const currentKey =
      makeKey(
        current.row,
        current.col
      );

    /*
     * Pode existir uma versão antiga
     * do mesmo nó dentro da openList.
     *
     * Verificamos se esse objeto ainda
     * corresponde à melhor versão.
     */
    const bestCurrent =
      nodeMap.get(currentKey);

    if (
      !bestCurrent ||
      bestCurrent !== current
    ) {
      continue;
    }

    /*
     * Se já foi fechado,
     * ignoramos.
     */
    if (
      closedSet.has(currentKey)
    ) {
      continue;
    }

    /*
     * Agora o nó passa para
     * a lista fechada.
     */
    closedSet.add(currentKey);

    visitedNodes.push(current);

    steps.push({
      row: current.row,
      col: current.col,

      g: current.g,
      h: current.h,
      f: current.f,

      type: 'CLOSED',

      parentRow:
        current.parent?.row,

      parentCol:
        current.parent?.col,
    });

    /*
     * =====================================
     * JERRY ENCONTRADO
     * =====================================
     */

    if (
      current.row ===
        goalPosition.row &&
      current.col ===
        goalPosition.col
    ) {
      const path =
        reconstructPath(
          current,
          nodeMap
        );

      return {
        found: true,

        path,

        visitedNodes,

        steps,

        totalCost:
          current.g,
      };
    }

    /*
     * =====================================
     * ANALISAR VIZINHOS
     * =====================================
     */

    for (
      const direction
      of DIRECTIONS
    ) {
      const neighborRow =
        current.row +
        direction.row;

      const neighborCol =
        current.col +
        direction.col;

      /*
       * Verifica se está
       * dentro do mapa.
       */
      if (
        !isInsideGrid(
          grid,
          neighborRow,
          neighborCol
        )
      ) {
        continue;
      }

      /*
       * Parede não pode
       * ser atravessada.
       */
      if (
        grid[neighborRow][neighborCol] ===
        'WALL'
      ) {
        continue;
      }

      const neighborKey =
        makeKey(
          neighborRow,
          neighborCol
        );

      /*
       * Se já foi completamente
       * analisado, ignoramos.
       */
      if (
        closedSet.has(
          neighborKey
        )
      ) {
        continue;
      }

      /*
       * =================================
       * CALCULAR G
       * =================================
       *
       * G atual +
       * custo do movimento.
       */
      const tentativeG =
        current.g +
        direction.cost;

      /*
       * Verifica se esse nó
       * já tinha sido descoberto.
       */
      const existingNode =
        nodeMap.get(
          neighborKey
        );

      /*
       * Se já existe um caminho
       * melhor ou igual para esse nó,
       * não precisamos atualizar.
       */
      if (
        existingNode &&
        tentativeG >=
          existingNode.g
      ) {
        continue;
      }

      /*
       * =================================
       * CALCULAR H
       * =================================
       */

      const h =
        calculateHeuristic(
          heuristic,

          neighborRow,
          neighborCol,

          goalPosition.row,
          goalPosition.col
        );

      /*
       * =================================
       * CALCULAR F
       * =================================
       *
       * F = G + H
       */
      const f =
        tentativeG + h;

      /*
       * Criamos/atualizamos
       * o vizinho.
       */
      const neighborNode:
        SearchNode = {
        row: neighborRow,
        col: neighborCol,

        g: tentativeG,
        h,
        f,

        parent: {
          row: current.row,
          col: current.col,
        },
      };

      /*
       * Salva a melhor versão.
       */
      nodeMap.set(
        neighborKey,
        neighborNode
      );

      /*
       * Adiciona à lista aberta.
       */
      openList.push(
        neighborNode
      );

      /*
       * Evento para animação.
       */
      steps.push({
        row: neighborNode.row,
        col: neighborNode.col,

        g: neighborNode.g,
        h: neighborNode.h,
        f: neighborNode.f,

        type: 'OPENED',

        parentRow:
          current.row,

        parentCol:
          current.col,
      });
    }
  }

  /*
   * =====================================
   * NÃO EXISTE CAMINHO
   * =====================================
   */

  return {
    found: false,

    path: [],

    visitedNodes,

    steps,

    totalCost: 0,
  };
}

/*
 * =========================================
 * RECONSTRUIR CAMINHO
 * =========================================
 *
 * Começamos em Jerry e vamos seguindo:
 *
 * Jerry
 * ↓
 * parent
 * ↓
 * parent
 * ↓
 * parent
 * ↓
 * Tom
 *
 * Depois invertemos.
 */
function reconstructPath(
  goalNode: SearchNode,
  nodeMap: Map<
    string,
    SearchNode
  >
): SearchNode[] {
  const path: SearchNode[] = [];

  let current:
    | SearchNode
    | undefined =
    goalNode;

  while (current) {
    path.push(current);

    if (!current.parent) {
      break;
    }

    current =
      nodeMap.get(
        makeKey(
          current.parent.row,
          current.parent.col
        )
      );
  }

  /*
   * Estava:
   *
   * Jerry -> ... -> Tom
   *
   * Ficará:
   *
   * Tom -> ... -> Jerry
   */
  return path.reverse();
}

/*
 * =========================================
 * PROCURAR TOM / JERRY
 * =========================================
 */
function findPosition(
  grid: CellType[][],
  type: CellType
): {
  row: number;
  col: number;
} | null {
  for (
    let row = 0;
    row < grid.length;
    row++
  ) {
    for (
      let col = 0;
      col < grid[row].length;
      col++
    ) {
      if (
        grid[row][col] === type
      ) {
        return {
          row,
          col,
        };
      }
    }
  }

  return null;
}

/*
 * =========================================
 * VERIFICAR LIMITES
 * =========================================
 */
function isInsideGrid(
  grid: CellType[][],
  row: number,
  col: number
): boolean {
  return (
    row >= 0 &&
    row < grid.length &&
    col >= 0 &&
    col < grid[row].length
  );
}

/*
 * =========================================
 * CRIAR CHAVE
 * =========================================
 *
 * Exemplo:
 *
 * linha 4 coluna 7
 *
 * "4,7"
 */
function makeKey(
  row: number,
  col: number
): string {
  return `${row},${col}`;
}

/*
 * =========================================
 * RESULTADO VAZIO
 * =========================================
 */
function createEmptyResult():
  SearchResult {
  return {
    found: false,

    path: [],

    visitedNodes: [],

    steps: [],

    totalCost: 0,
  };
}