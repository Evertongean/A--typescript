import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '@/constants/colors';
import { AlgorithmType } from '@/models/AlgorithmType';

interface AlgorithmSelectorProps {
  value: AlgorithmType;

  onChange: (
    algorithm: AlgorithmType
  ) => void;

  disabled?: boolean;
}

export function AlgorithmSelector({
  value,
  onChange,
  disabled = false,
}: AlgorithmSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        ALGORITMO
      </Text>

      <View style={styles.options}>
        <Option
          title="A*"
          subtitle="F = G + H"
          selected={
            value ===
            'ASTAR'
          }
          disabled={
            disabled
          }
          onPress={() =>
            onChange(
              'ASTAR'
            )
          }
        />

        <Option
          title="Guloso"
          subtitle="Prioridade = H"
          selected={
            value ===
            'GREEDY'
          }
          disabled={
            disabled
          }
          onPress={() =>
            onChange(
              'GREEDY'
            )
          }
        />
      </View>

      <View style={styles.explanation}>
        <Text style={styles.explanationTitle}>
          {value === 'ASTAR'
            ? 'A*'
            : 'Busca Gulosa'}
        </Text>

        <Text style={styles.explanationText}>
          {value === 'ASTAR'
            ? 'Considera o custo percorrido G e a estimativa H. A prioridade é F = G + H.'
            : 'Prioriza aquilo que parece estar mais próximo de Jerry. A prioridade é H.'}
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

const styles =
  StyleSheet.create({
    container: {
      width: '100%',
      maxWidth: 650,
      alignSelf:
        'center',

      backgroundColor:
        COLORS.surface,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 18,

      padding: 16,

      marginTop: 16,
    },

    label: {
      color:
        COLORS.primary,

      fontSize: 9,

      fontWeight:
        '900',

      letterSpacing:
        1.3,

      marginBottom: 10,
    },

    options: {
      flexDirection:
        'row',

      gap: 10,
    },

    option: {
      flex: 1,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 14,

      backgroundColor:
        COLORS.background,

      paddingVertical: 12,

      paddingHorizontal: 10,

      alignItems:
        'center',
    },

    optionSelected: {
      borderColor:
        COLORS.primary,

      backgroundColor:
        '#FFF0EC',
    },

    optionTitle: {
      color:
        COLORS.text,

      fontSize: 15,

      fontWeight:
        '900',
    },

    optionTitleSelected: {
      color:
        COLORS.primary,
    },

    optionSubtitle: {
      color:
        COLORS.textSecondary,

      fontSize: 10,

      marginTop: 3,
    },

    optionSubtitleSelected: {
      color:
        COLORS.primary,
    },

    disabled: {
      opacity: 0.4,
    },

    explanation: {
      backgroundColor:
        '#FFF4DC',

      borderRadius: 12,

      padding: 12,

      marginTop: 12,
    },

    explanationTitle: {
      color:
        COLORS.text,

      fontSize: 12,

      fontWeight:
        '900',
    },

    explanationText: {
      color:
        COLORS.textSecondary,

      fontSize: 10,

      lineHeight: 16,

      marginTop: 4,
    },
  });