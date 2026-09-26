import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '@/constants/colors';
import { MovementType } from '@/models/MovementType';

interface MovementSelectorProps {
  value: MovementType;
  onChange: (value: MovementType) => void;
  disabled?: boolean;
}

const MOVEMENT_DESCRIPTIONS: Record<
  MovementType,
  string
> = {
  FOUR_DIRECTIONS:
    'Tom pode se mover apenas horizontalmente e verticalmente. Cada movimento custa 10.',
  EIGHT_DIRECTIONS:
    'Tom também pode usar movimentos diagonais. Movimentos retos custam 10 e diagonais custam 14.',
};

export function MovementSelector({
  value,
  onChange,
  disabled = false,
}: MovementSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        MOVIMENTO
      </Text>

      <View style={styles.options}>
        <Option
          title="4 direções"
          subtitle="↑ ↓ ← →"
          selected={
            value ===
            'FOUR_DIRECTIONS'
          }
          disabled={disabled}
          onPress={() =>
            onChange(
              'FOUR_DIRECTIONS'
            )
          }
        />

        <Option
          title="8 direções"
          subtitle="↑ ↓ ← → + diagonais"
          selected={
            value ===
            'EIGHT_DIRECTIONS'
          }
          disabled={disabled}
          onPress={() =>
            onChange(
              'EIGHT_DIRECTIONS'
            )
          }
        />
      </View>

      <View style={styles.explanation}>
        <Text style={styles.explanationTitle}>
          {getMovementName(value)}
        </Text>

        <Text style={styles.explanationText}>
          {MOVEMENT_DESCRIPTIONS[value]}
        </Text>
      </View>
    </View>
  );
}

interface OptionProps {
  title: string;
  subtitle: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}

function Option({
  title,
  subtitle,
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

      <Text
        style={[
          styles.optionSubtitle,
          selected &&
            styles.optionSubtitleSelected,
        ]}
      >
        {subtitle}
      </Text>
    </Pressable>
  );
}

function getMovementName(
  movement: MovementType
) {
  switch (movement) {
    case 'FOUR_DIRECTIONS':
      return '4 direções';

    case 'EIGHT_DIRECTIONS':
      return '8 direções';
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
    paddingHorizontal: 10,

    alignItems: 'center',
  },

  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF0EC',
  },

  optionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '900',
  },

  optionTitleSelected: {
    color: COLORS.primary,
  },

  optionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 3,
    textAlign: 'center',
  },

  optionSubtitleSelected: {
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
