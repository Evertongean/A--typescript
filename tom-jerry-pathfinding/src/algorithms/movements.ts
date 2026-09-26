import type { CellType } from '@/models/CellType';
import type { MovementType } from '@/models/MovementType';

export interface Movement {
  row: number;
  col: number;
  cost: number;
  diagonal: boolean;
}

const FOUR_DIRECTIONS: readonly Movement[] = [
  {
    row: -1,
    col: 0,
    cost: 10,
    diagonal: false,
  },
  {
    row: 1,
    col: 0,
    cost: 10,
    diagonal: false,
  },
  {
    row: 0,
    col: -1,
    cost: 10,
    diagonal: false,
  },
  {
    row: 0,
    col: 1,
    cost: 10,
    diagonal: false,
  },
];

const DIAGONALS: readonly Movement[] = [
  {
    row: -1,
    col: -1,
    cost: 14,
    diagonal: true,
  },
  {
    row: -1,
    col: 1,
    cost: 14,
    diagonal: true,
  },
  {
    row: 1,
    col: -1,
    cost: 14,
    diagonal: true,
  },
  {
    row: 1,
    col: 1,
    cost: 14,
    diagonal: true,
  },
];

const EIGHT_DIRECTIONS: readonly Movement[] = [
  ...FOUR_DIRECTIONS,
  ...DIAGONALS,
];

export function getMovements(
  type: MovementType
): readonly Movement[] {
  if (
    type ===
    'EIGHT_DIRECTIONS'
  ) {
    return EIGHT_DIRECTIONS;
  }

  return FOUR_DIRECTIONS;
}

/*
 * Um movimento diagonal atravessa o espaço
 * entre duas células ortogonais.
 *
 * Para impedir que Tom corte cantos, ambas
 * precisam existir e estar livres de paredes.
 */
export function canMoveDiagonally(
  grid: CellType[][],
  currentRow: number,
  currentCol: number,
  movement: Movement
): boolean {
  if (!movement.diagonal) {
    return true;
  }

  const verticalCell =
    grid[
      currentRow +
        movement.row
    ]?.[currentCol];

  const horizontalCell =
    grid[currentRow]?.[
      currentCol +
        movement.col
    ];

  return (
    verticalCell !== undefined &&
    horizontalCell !== undefined &&
    verticalCell !== 'WALL' &&
    horizontalCell !== 'WALL'
  );
}
