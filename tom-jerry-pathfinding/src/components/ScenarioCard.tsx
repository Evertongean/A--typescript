import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '@/constants/colors';

interface ScenarioCardProps {
  emoji: string;
  title: string;
  difficulty: string;
  description: string;
  color: string;
  onPress?: () => void;
}

export function ScenarioCard({
  emoji,
  title,
  difficulty,
  description,
  color,
  onPress,
}: ScenarioCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir cenário ${title}, dificuldade ${difficulty}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed &&
          styles.cardPressed,
      ]}
    >
      <View
        style={[
          styles.accent,
          {
            backgroundColor: color,
          },
        ]}
      />

      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor:
              `${color}18`,
            borderColor:
              `${color}38`,
          },
        ]}
      >
        <Text style={styles.emoji}>
          {emoji}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>
            {title}
          </Text>

          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  `${color}18`,
                borderColor:
                  `${color}45`,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color,
                },
              ]}
            >
              {difficulty}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>
          {description}
        </Text>
      </View>

      <View
        style={[
          styles.arrowContainer,
          {
            backgroundColor:
              `${color}16`,
          },
        ]}
      >
        <Text
          style={[
            styles.arrow,
            {
              color,
            },
          ]}
        >
          ›
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',

    flexDirection: 'row',
    alignItems: 'center',

    overflow: 'hidden',

    backgroundColor: COLORS.surface,

    borderRadius: 20,

    paddingVertical: 16,
    paddingHorizontal: 17,

    marginBottom: 13,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#6A4938',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },

  cardPressed: {
    opacity: 0.78,

    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  accent: {
    position: 'absolute',

    left: 0,
    top: 12,
    bottom: 12,

    width: 4,

    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

  iconContainer: {
    width: 56,
    height: 56,

    borderWidth: 1,
    borderRadius: 17,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 14,
  },

  emoji: {
    fontSize: 28,
  },

  content: {
    flex: 1,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',

    gap: 8,
    marginBottom: 6,
  },

  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
  },

  badge: {
    borderWidth: 1,
    borderRadius: 12,

    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  badgeText: {
    fontWeight: '900',
    fontSize: 9,
    textTransform: 'uppercase',
  },

  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  arrowContainer: {
    width: 30,
    height: 30,

    borderRadius: 15,

    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: 9,
  },

  arrow: {
    fontSize: 26,
    fontWeight: '500',
    lineHeight: 27,
    marginTop: -2,
  },
});
