import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '@/constants/colors';

const JERRY_IMAGE =
  require('../../assets/images/jerry.png');

interface NoPathModalProps {
  visible: boolean;
  onRestore: () => void;
  onContinueEditing: () => void;
}

export function NoPathModal({
  visible,
  onRestore,
  onContinueEditing,
}: NoPathModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={
        onContinueEditing
      }
    >
      <View
        style={styles.overlay}
        accessibilityViewIsModal
      >
        <View style={styles.card}>
          <View style={styles.artwork}>
            <Image
              source={JERRY_IMAGE}
              style={styles.image}
              resizeMode="contain"
              accessibilityLabel="Jerry escondido"
            />
          </View>

          <Text style={styles.title}>
            Jerry se escondeu!
          </Text>

          <Text style={styles.message}>
            Tom não conseguiu encontrar um caminho até Jerry.
          </Text>

          <Text style={styles.secondaryMessage}>
            Parece que Jerry ficou isolado pelas paredes. Você pode restaurar o cenário original ou continuar editando o labirinto.
          </Text>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Restaurar cenário original"
              onPress={onRestore}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed &&
                  styles.buttonPressed,
              ]}
            >
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                Restaurar cenário
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continuar editando o labirinto"
              onPress={
                onContinueEditing
              }
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed &&
                  styles.buttonPressed,
              ]}
            >
              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                Continuar editando
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor:
      'rgba(43, 39, 36, 0.52)',

    padding: 20,
  },

  card: {
    width: '100%',
    maxWidth: 390,

    alignItems: 'center',

    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,

    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 22,

    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 18,

    elevation: 8,
  },

  artwork: {
    width: 86,
    height: 86,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.jerry,
    borderRadius: 43,

    marginBottom: 14,
  },

  image: {
    width: 76,
    height: 68,
  },

  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },

  message: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    textAlign: 'center',

    marginTop: 10,
  },

  secondaryMessage: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',

    marginTop: 7,
  },

  actions: {
    width: '100%',
    gap: 10,

    marginTop: 20,
  },

  primaryButton: {
    minHeight: 46,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.primary,
    borderRadius: 14,

    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },

  secondaryButton: {
    minHeight: 46,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.background,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,

    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },

  buttonPressed: {
    opacity: 0.78,
  },
});
