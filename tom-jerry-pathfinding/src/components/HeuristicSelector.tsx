import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '@/constants/colors';
import { HeuristicType } from '@/models/HeuristicType';

interface HeuristicSelectorProps {
  value: HeuristicType;
  onChange: (value: HeuristicType) => void;
  disabled?: boolean;
}

const HEURISTIC_DESCRIPTIONS: Record<
  HeuristicType,
  string
> = {
  MANHATTAN:
    'Soma a distância horizontal e vertical até Jerry. É especialmente adequada para movimentos em 4 direções.',
  EUCLIDEAN:
    'Estima a distância em linha reta entre a posição atual e Jerry.',
  DIAGONAL:
    'Considera a relação entre deslocamentos retos e diagonais usando custos aproximados de 10 e 14.',
};

export function HeuristicSelector({
  value,
  onChange,
  disabled = false,
}: HeuristicSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        HEURÍSTICA
      </Text>

      <View style={styles.options}>
        <Option
          title="Manhattan"
          selected={value === 'MANHATTAN'}
          disabled={disabled}
          onPress={() =>
            onChange('MANHATTAN')
          }
        />

        <Option
          title="Euclidiana"
          selected={value === 'EUCLIDEAN'}
          disabled={disabled}
          onPress={() =>
            onChange('EUCLIDEAN')
          }
        />

        <Option
          title="Diagonal"
          selected={value === 'DIAGONAL'}
          disabled={disabled}
          onPress={() =>
            onChange('DIAGONAL')
          }
        />
      </View>

      <View style={styles.explanation}>
        <Text style={styles.explanationTitle}>
          {getHeuristicName(value)}
        </Text>

        <Text style={styles.explanationText}>
          {HEURISTIC_DESCRIPTIONS[value]}
        </Text>
      </View>
    </View>
  );
}

interface OptionProps {
  title: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}

function Option({
  title,
  selected,
  disabled,
  onPress,
}: OptionProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.option,
        selected &&
          styles.optionSelected,
        disabled &&
          styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.optionTitle,
          selected &&
            styles.optionTitleSelected,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function getHeuristicName(
  heuristic: HeuristicType
) {
  switch (heuristic) {
    case 'MANHATTAN':
      return 'Manhattan';

    case 'EUCLIDEAN':
      return 'Euclidiana';

    case 'DIAGONAL':
      return 'Diagonal';
  }
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
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
    marginBottom: 10,
  },

  options: {
    flexDirection: 'row',
    gap: 10,
  },

  option: {
    flex: 1,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,

    backgroundColor: COLORS.background,

    paddingVertical: 12,
    paddingHorizontal: 6,

    alignItems: 'center',
    justifyContent: 'center',
  },

  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF0EC',
  },

  optionTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },

  optionTitleSelected: {
    color: COLORS.primary,
  },

  disabled: {
    opacity: 0.4,
  },

  explanation: {
    backgroundColor: '#FFF4DC',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },

  explanationTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
  },

  explanationText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },
});
