import {
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';

import { COLORS } from '@/constants/colors';
import { CellType } from '@/models/CellType';

const TOM_IMAGE =
  require('../../assets/images/tom.png');

const JERRY_IMAGE =
  require('../../assets/images/jerry.png');

interface GridCellProps {
  type: CellType;
  size: number;
  onPress?: () => void;
}

export function GridCell({
  type,
  size,
  onPress,
}: GridCellProps) {
  const characterImage =
    getCharacterImage(type);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        getAccessibilityLabel(type)
      }
      onPress={onPress}
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor:
            getBackgroundColor(type),
        },
      ]}
    >
      {characterImage && (
        <Image
          source={characterImage}
          accessible={false}
          style={{
            width: getCharacterSize(
              size
            ),
            height: getCharacterSize(
              size
            ),
          }}
          resizeMode="contain"
        />
      )}
    </Pressable>
  );
}

function getCharacterSize(
  cellSize: number
) {
  return Math.max(
    Math.min(
      cellSize - 4,
      cellSize * 0.82
    ),
    1
  );
}

function getBackgroundColor(
  type: CellType
) {
  switch (type) {
    case 'WALL':
      return COLORS.wall;

    case 'START':
      return COLORS.tom;

    case 'GOAL':
      return COLORS.jerry;

    case 'OPEN':
      return COLORS.open;

    case 'CLOSED':
      return COLORS.closed;

    case 'PATH':
      return COLORS.path;

    default:
      return COLORS.white;
  }
}

function getCharacterImage(
  type: CellType
) {
  switch (type) {
    case 'START':
      return TOM_IMAGE;

    case 'GOAL':
      return JERRY_IMAGE;

    default:
      return null;
  }
}

function getAccessibilityLabel(
  type: CellType
) {
  switch (type) {
    case 'START':
      return 'Tom, início';

    case 'GOAL':
      return 'Jerry, objetivo';

    case 'WALL':
      return 'Parede';

    case 'OPEN':
      return 'Nó aberto';

    case 'CLOSED':
      return 'Nó visitado';

    case 'PATH':
      return 'Caminho';

    default:
      return 'Célula livre';
  }
}

const styles = StyleSheet.create({
  cell: {
    borderWidth: 0.5,
    borderColor: COLORS.gridLine,

    justifyContent: 'center',
    alignItems: 'center',
  },
});
