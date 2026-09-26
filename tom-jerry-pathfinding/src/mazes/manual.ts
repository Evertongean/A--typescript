import { createMazeGrid } from './createMaze';

export function createManualMaze() {
  return createMazeGrid({
    start: [1, 1],
    goal: [10, 10],
    walls: [],
  });
}
