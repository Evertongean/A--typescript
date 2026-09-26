import { calculateHeuristic } from '@/algorithms/heuristics';

import { CellType } from '@/models/CellType';
import { HeuristicType } from '@/models/HeuristicType';
import { SearchNode } from '@/models/Node';
import { SearchResult } from '@/models/SearchResult';
import { SearchStep } from '@/models/SearchStep';

/*
 * Movimento em 4 direções.
 *
 * Por enquanto:
 *
 * ↑ ↓ ← →
 *
 * custo = 10
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
 * ==========================================
 * BUSCA GULOSA
 * ==========================================
 *
 * DIFERENÇA PRINCIPAL:
 *
 * A*
 * prioridade = F
 *
 * Guloso
 * prioridade = H
 *
 * Mesmo assim calculamos:
 *
 * G
 * H
 * F
 *
 * porque precisamos desses valores
 * para mostrar na interface.
 */
export function greedyBestFirst(
  grid: CellType[][],
  heuristic: HeuristicType = 'MANHATTAN'
): SearchResult {
  const startPosition =
    findPosition(
      grid,
      'START'
    );

  const goalPosition =
    findPosition(
      grid,
      'GOAL'
    );

  if (
    !startPosition ||
    !goalPosition
  ) {
    return createEmptyResult();
  }

  /*
   * Nós descobertos.
   */
  const openList:
    SearchNode[] = [];

  /*
   * Nós já analisados.
   */
  const closedSet =
    new Set<string>();

  /*
   * Melhor representação
   * conhecida de cada nó.
   */
  const nodeMap =
    new Map<
      string,
      SearchNode
    >();

  /*
   * Eventos da animação.
   */
  const steps:
    SearchStep[] = [];

  /*
   * Nós visitados.
   */
  const visitedNodes:
    SearchNode[] = [];

  /*
   * H do ponto inicial.
   */
  const startH =
    calculateHeuristic(
      heuristic,

      startPosition.row,
      startPosition.col,

      goalPosition.row,
      goalPosition.col
    );

  const startNode:
    SearchNode = {
    row:
      startPosition.row,

    col:
      startPosition.col,

    g: 0,

    h: startH,

    f: startH,

    parent: null,
  };

  openList.push(
    startNode
  );

  nodeMap.set(
    makeKey(
      startNode.row,
      startNode.col
    ),
    startNode
  );

  steps.push({
    row:
      startNode.row,

    col:
      startNode.col,

    g:
      startNode.g,

    h:
      startNode.h,

    f:
      startNode.f,

    type:
      'OPENED',
  });

  /*
   * ======================================
   * LOOP PRINCIPAL
   * ======================================
   */
  while (
    openList.length > 0
  ) {
    /*
     * AQUI ESTÁ A DIFERENÇA.
     *
     * A Busca Gulosa escolhe
     * o menor H.
     *
     * NÃO escolhe o menor F.
     */
    openList.sort(
      (a, b) => {
        if (
          a.h !== b.h
        ) {
          return (
            a.h - b.h
          );
        }

        /*
         * Desempate apenas
         * para manter o resultado
         * consistente.
         */
        return (
          a.g - b.g
        );
      }
    );

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

    const bestCurrent =
      nodeMap.get(
        currentKey
      );

    if (
      !bestCurrent ||
      bestCurrent !==
        current
    ) {
      continue;
    }

    if (
      closedSet.has(
        currentKey
      )
    ) {
      continue;
    }

    /*
     * Nó analisado.
     */
    closedSet.add(
      currentKey
    );

    visitedNodes.push(
      current
    );

    steps.push({
      row:
        current.row,

      col:
        current.col,

      g:
        current.g,

      h:
        current.h,

      f:
        current.f,

      type:
        'CLOSED',

      parentRow:
        current.parent?.row,

      parentCol:
        current.parent?.col,
    });

    /*
     * ======================================
     * JERRY ENCONTRADO
     * ======================================
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
     * ======================================
     * ANALISAR VIZINHOS
     * ======================================
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
       * Fora do mapa.
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
       * Parede.
       */
      if (
        grid[
          neighborRow
        ][
          neighborCol
        ] === 'WALL'
      ) {
        continue;
      }

      const neighborKey =
        makeKey(
          neighborRow,
          neighborCol
        );

      /*
       * Já visitado.
       */
      if (
        closedSet.has(
          neighborKey
        )
      ) {
        continue;
      }

      /*
       * ==================================
       * G
       * ==================================
       */
      const tentativeG =
        current.g +
        direction.cost;

      const existingNode =
        nodeMap.get(
          neighborKey
        );

      /*
       * Se já conhecemos esse nó,
       * não precisamos adicioná-lo
       * novamente.
       *
       * Na busca gulosa o importante
       * é a estimativa H.
       */
      if (existingNode) {
        continue;
      }

      /*
       * ==================================
       * H
       * ==================================
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
       * ==================================
       * F
       * ==================================
       *
       * Continua sendo calculado
       * para visualização.
       */
      const f =
        tentativeG + h;

      const neighborNode:
        SearchNode = {
        row:
          neighborRow,

        col:
          neighborCol,

        g:
          tentativeG,

        h,

        f,

        parent: {
          row:
            current.row,

          col:
            current.col,
        },
      };

      nodeMap.set(
        neighborKey,
        neighborNode
      );

      openList.push(
        neighborNode
      );

      steps.push({
        row:
          neighborNode.row,

        col:
          neighborNode.col,

        g:
          neighborNode.g,

        h:
          neighborNode.h,

        f:
          neighborNode.f,

        type:
          'OPENED',

        parentRow:
          current.row,

        parentCol:
          current.col,
      });
    }
  }

  /*
   * Nenhum caminho encontrado.
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
 * ==========================================
 * RECONSTRUIR CAMINHO
 * ==========================================
 */
function reconstructPath(
  goalNode:
    SearchNode,

  nodeMap:
    Map<
      string,
      SearchNode
    >
): SearchNode[] {
  const path:
    SearchNode[] = [];

  let current:
    | SearchNode
    | undefined =
    goalNode;

  while (current) {
    path.push(
      current
    );

    if (
      !current.parent
    ) {
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

  return path.reverse();
}

/*
 * ==========================================
 * PROCURAR TOM / JERRY
 * ==========================================
 */
function findPosition(
  grid:
    CellType[][],

  type:
    CellType
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
      col <
        grid[row].length;
      col++
    ) {
      if (
        grid[row][col] ===
        type
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
 * ==========================================
 * VERIFICAR LIMITES
 * ==========================================
 */
function isInsideGrid(
  grid:
    CellType[][],

  row: number,

  col: number
): boolean {
  return (
    row >= 0 &&
    row < grid.length &&
    col >= 0 &&
    col <
      grid[row].length
  );
}

/*
 * ==========================================
 * CHAVE
 * ==========================================
 */
function makeKey(
  row: number,
  col: number
): string {
  return `${row},${col}`;
}

/*
 * ==========================================
 * RESULTADO VAZIO
 * ==========================================
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