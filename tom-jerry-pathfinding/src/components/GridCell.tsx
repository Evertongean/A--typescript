import { Pressable, StyleSheet, Text } from 'react-native';

import { CellType } from '@/models/CellType';

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
  function getBackgroundColor() {
    switch (type) {
      case 'WALL':
        return '#3F4145';

      case 'START':
        return '#DCEEFF';

      case 'GOAL':
        return '#FFE1DC';

      case 'OPEN':
        return '#FFD966';

      case 'CLOSED':
        return '#76A9EA';

      case 'PATH':
        return '#78C98A';

      default:
        return '#FFFFFF';
    }
  }

  function getContent() {
    switch (type) {
      case 'START':
        return 'T';

      case 'GOAL':
        return 'J';

      default:
        return '';
    }
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      <Text style={styles.content}>
        {getContent()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    borderWidth: 0.5,
    borderColor: '#D7D7D7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    fontSize: 11,
    fontWeight: '900',
    color: '#292929',
  },
});