import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '@/constants/colors';
import { EditorMode } from '@/models/EditorMode';

interface EditorToolbarProps {
  selectedMode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
}

export function EditorToolbar({
  selectedMode,
  onModeChange,
}: EditorToolbarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        EDITOR DO LABIRINTO
      </Text>

      <Text style={styles.title}>
        Escolha uma ferramenta
      </Text>

      <View style={styles.toolbar}>
        <ToolButton
          label="Tom"
          symbol="T"
          mode="START"
          selectedMode={selectedMode}
          onPress={onModeChange}
        />

        <ToolButton
          label="Jerry"
          symbol="J"
          mode="GOAL"
          selectedMode={selectedMode}
          onPress={onModeChange}
        />

        <ToolButton
          label="Parede"
          symbol="■"
          mode="WALL"
          selectedMode={selectedMode}
          onPress={onModeChange}
        />

        <ToolButton
          label="Apagar"
          symbol="×"
          mode="ERASE"
          selectedMode={selectedMode}
          onPress={onModeChange}
        />
      </View>
    </View>
  );
}

interface ToolButtonProps {
  label: string;
  symbol: string;
  mode: EditorMode;
  selectedMode: EditorMode;
  onPress: (mode: EditorMode) => void;
}

function ToolButton({
  label,
  symbol,
  mode,
  selectedMode,
  onPress,
}: ToolButtonProps) {
  const selected = mode === selectedMode;

  return (
    <Pressable
      onPress={() => onPress(mode)}
      style={[
        styles.button,
        selected && styles.buttonSelected,
      ]}
    >
      <View
        style={[
          styles.symbolContainer,
          selected && styles.symbolContainerSelected,
        ]}
      >
        <Text
          style={[
            styles.symbol,
            selected && styles.symbolSelected,
          ]}
        >
          {symbol}
        </Text>
      </View>

      <Text
        style={[
          styles.buttonText,
          selected && styles.buttonTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',

    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 18,

    padding: 16,
    marginTop: 16,
  },

  label: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  title: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 3,
    marginBottom: 14,
  },

  toolbar: {
    flexDirection: 'row',
    gap: 8,
  },

  button: {
    flex: 1,
    alignItems: 'center',

    backgroundColor: COLORS.background,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 14,

    paddingVertical: 10,
    paddingHorizontal: 4,
  },

  buttonSelected: {
    backgroundColor: '#FFF0EC',
    borderColor: COLORS.primary,
  },

  symbolContainer: {
    width: 34,
    height: 34,

    borderRadius: 10,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.surface,

    marginBottom: 6,
  },

  symbolContainerSelected: {
    backgroundColor: COLORS.primary,
  },

  symbol: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },

  symbolSelected: {
    color: COLORS.white,
  },

  buttonText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },

  buttonTextSelected: {
    color: COLORS.primary,
    fontWeight: '900',
  },
});