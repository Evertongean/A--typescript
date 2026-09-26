import {
  createMazeGrid,
  MazeCoordinate,
} from './createMaze';

const WALLS: readonly MazeCoordinate[] = [
  [2, 2],
  [2, 3],
  [2, 4],
  [4, 7],
  [5, 7],
  [6, 7],
  [8, 3],
  [8, 4],
  [8, 5],
];

export function createKitchenMaze() {
  return createMazeGrid({
    start: [1, 1],
    goal: [10, 10],
    walls: WALLS,
  });
}
