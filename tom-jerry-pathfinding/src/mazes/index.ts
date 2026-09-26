import { CellType } from '@/models/CellType';

import { createBasementMaze } from './basement';
import { createKitchenMaze } from './kitchen';
import { createLivingRoomMaze } from './livingRoom';
import { createManualMaze } from './manual';

export {
  MAZE_COLS,
  MAZE_ROWS,
} from './createMaze';

export function createMazeForScenario(
  scenario?: string
): CellType[][] {
  const normalizedScenario = normalizeScenario(
    scenario
  );

  switch (normalizedScenario) {
    case 'cozinha':
      return createKitchenMaze();

    case 'sala':
      return createLivingRoomMaze();

    case 'porao':
      return createBasementMaze();

    case 'manual':
    default:
      return createManualMaze();
  }
}

function normalizeScenario(
  scenario?: string
) {
  return (scenario ?? '')
    .trim()
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
