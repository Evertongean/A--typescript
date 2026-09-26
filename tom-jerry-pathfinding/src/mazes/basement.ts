import {
  createMazeGrid,
  MazeCoordinate,
} from './createMaze';

const WALLS: readonly MazeCoordinate[] = [
  [0, 3],
  [1, 3],
  [3, 3],
  [4, 3],
  [5, 3],
  [6, 3],
  [7, 3],
  [8, 3],
  [9, 3],
  [10, 3],
  [11, 3],

  [0, 6],
  [1, 6],
  [2, 6],
  [3, 6],
  [4, 6],
  [5, 6],
  [6, 6],
  [7, 6],
  [8, 6],
  [10, 6],
  [11, 6],

  [0, 9],
  [1, 9],
  [2, 9],
  [3, 9],
  [5, 9],
  [6, 9],
  [7, 9],
  [8, 9],
  [9, 9],
  [10, 9],
  [11, 9],

  [5, 1],
  [5, 2],
  [4, 4],
  [6, 5],
  [8, 4],
  [8, 7],
  [6, 8],
  [4, 7],
  [6, 10],
  [8, 11],
];

export function createBasementMaze() {
  return createMazeGrid({
    start: [1, 1],
    goal: [10, 10],
    walls: WALLS,
  });
}
