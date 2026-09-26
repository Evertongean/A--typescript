import { HeuristicType } from '@/models/HeuristicType';

/*
 * ==========================================
 * MANHATTAN
 * ==========================================
 *
 * H = (|x1 - x2| + |y1 - y2|) * 10
 *
 * Ideal para movimentos em 4 direções.
 */
export function manhattan(
  row1: number,
  col1: number,
  row2: number,
  col2: number
): number {
  const rowDistance =
    Math.abs(row1 - row2);

  const colDistance =
    Math.abs(col1 - col2);

  return (
    rowDistance +
    colDistance
  ) * 10;
}

/*
 * ==========================================
 * EUCLIDIANA
 * ==========================================
 *
 * Vamos implementar agora também
 * para já deixar a arquitetura preparada.
 */
export function euclidean(
  row1: number,
  col1: number,
  row2: number,
  col2: number
): number {
  const dx =
    Math.abs(row1 - row2);

  const dy =
    Math.abs(col1 - col2);

  return Math.floor(
    Math.sqrt(
      dx * dx +
      dy * dy
    ) * 10
  );
}

/*
 * ==========================================
 * DIAGONAL
 * ==========================================
 *
 * Movimento reto = 10
 * Movimento diagonal = 14
 */
export function diagonal(
  row1: number,
  col1: number,
  row2: number,
  col2: number
): number {
  const dx =
    Math.abs(row1 - row2);

  const dy =
    Math.abs(col1 - col2);

  const minDistance =
    Math.min(dx, dy);

  const maxDistance =
    Math.max(dx, dy);

  return (
    14 * minDistance +
    10 *
      (maxDistance - minDistance)
  );
}

/*
 * ==========================================
 * FUNÇÃO PRINCIPAL
 * ==========================================
 *
 * Depois o A* e o Guloso vão chamar
 * apenas essa função.
 *
 * Assim eles não precisam saber
 * como cada heurística é calculada.
 */
export function calculateHeuristic(
  type: HeuristicType,
  row1: number,
  col1: number,
  row2: number,
  col2: number
): number {
  switch (type) {
    case 'MANHATTAN':
      return manhattan(
        row1,
        col1,
        row2,
        col2
      );

    case 'EUCLIDEAN':
      return euclidean(
        row1,
        col1,
        row2,
        col2
      );

    case 'DIAGONAL':
      return diagonal(
        row1,
        col1,
        row2,
        col2
      );

    default:
      return manhattan(
        row1,
        col1,
        row2,
        col2
      );
  }
}