import {
  createMazeGrid,
  MazeCoordinate,
} from './createMaze';

const WALLS: readonly MazeCoordinate[] = [
  [2, 3],
  [2, 4],
  [2, 5],
  [3, 5],
  [4, 2],
  [4, 3],
  [4, 5],
  [5, 5],
  [5, 6],
  [5, 7],
  [6, 3],
  [6, 7],
  [7, 3],
  [7, 7],
  [8, 3],
  [8, 4],
  [8, 5],
  [8, 7],
  [8, 8],
  [9, 8],
];

export function createLivingRoomMaze() {
  return createMazeGrid({
    start: [1, 1],
    goal: [10, 10],
    walls: WALLS,
  });
}
