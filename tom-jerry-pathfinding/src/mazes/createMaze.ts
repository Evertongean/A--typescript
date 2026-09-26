import { CellType } from '@/models/CellType';

export const MAZE_ROWS = 12;
export const MAZE_COLS = 12;

export type MazeCoordinate = readonly [
  row: number,
  col: number,
];

type MazeDefinition = {
  start: MazeCoordinate;
  goal: MazeCoordinate;
  walls: readonly MazeCoordinate[];
};

export function createMazeGrid({
  start,
  goal,
  walls,
}: MazeDefinition): CellType[][] {
  validateCoordinate(start, 'START');
  validateCoordinate(goal, 'GOAL');

  if (sameCoordinate(start, goal)) {
    throw new Error(
      'START e GOAL precisam ocupar células diferentes.'
    );
  }

  const grid = Array.from(
    { length: MAZE_ROWS },
    () =>
      Array.from(
        { length: MAZE_COLS },
        () => 'EMPTY' as CellType
      )
  );

  const occupiedWalls = new Set<string>();

  walls.forEach((wall) => {
    validateCoordinate(wall, 'WALL');

    if (
      sameCoordinate(wall, start) ||
      sameCoordinate(wall, goal)
    ) {
      throw new Error(
        'Uma parede não pode ocupar START ou GOAL.'
      );
    }

    const key = wall.join(':');

    if (occupiedWalls.has(key)) {
      throw new Error(
        `Parede duplicada na posição ${key}.`
      );
    }

    occupiedWalls.add(key);
    grid[wall[0]][wall[1]] = 'WALL';
  });

  grid[start[0]][start[1]] = 'START';
  grid[goal[0]][goal[1]] = 'GOAL';

  return grid;
}

function validateCoordinate(
  [row, col]: MazeCoordinate,
  cellType: CellType
) {
  const isInsideGrid =
    Number.isInteger(row) &&
    Number.isInteger(col) &&
    row >= 0 &&
    row < MAZE_ROWS &&
    col >= 0 &&
    col < MAZE_COLS;

  if (!isInsideGrid) {
    throw new Error(
      `${cellType} fora dos limites: ${row}, ${col}.`
    );
  }
}

function sameCoordinate(
  first: MazeCoordinate,
  second: MazeCoordinate
) {
  return (
    first[0] === second[0] &&
    first[1] === second[1]
  );
}
