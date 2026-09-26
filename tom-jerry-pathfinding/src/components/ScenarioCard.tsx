import { Pressable, StyleSheet, Text, View } from 'react-native';

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
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>

          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{difficulty}</Text>
          </View>
        </View>

        <Text style={styles.description}>{description}</Text>
      </View>

      <Text style={[styles.arrow, { color }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5DDCF',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 3,
  },

  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  emoji: {
    fontSize: 30,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#292929',
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 10,
    textTransform: 'uppercase',
  },

  description: {
    color: '#686868',
    fontSize: 13,
    lineHeight: 19,
  },

  arrow: {
    fontSize: 32,
    fontWeight: '300',
    marginLeft: 8,
  },
});