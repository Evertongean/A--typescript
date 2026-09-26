import { StyleSheet, View } from 'react-native';

import { GridCell } from '@/components/GridCell';
import { CellType } from '@/models/CellType';

interface GridProps {
  grid: CellType[][];
  cellSize: number;
  onCellPress?: (row: number, col: number) => void;
}

export function Grid({
  grid,
  cellSize,
  onCellPress,
}: GridProps) {
  return (
    <View style={styles.grid}>
      {grid.map((row, rowIndex) => (
        <View
          key={`row-${rowIndex}`}
          style={styles.row}
        >
          {row.map((cell, colIndex) => (
            <GridCell
              key={`${rowIndex}-${colIndex}`}
              type={cell}
              size={cellSize}
              onPress={() =>
                onCellPress?.(rowIndex, colIndex)
              }
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    borderWidth: 2,
    borderColor: '#3F4145',
    alignSelf: 'center',
  },

  row: {
    flexDirection: 'row',
  },
});