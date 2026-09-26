import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import { ScenarioCard } from '@/components/ScenarioCard';
import { COLORS } from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();

  function handleScenarioPress(
    scenario: string
  ) {
    router.push({
      pathname: '/visualizer',
      params: {
        scenario,
      },
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          COLORS.background
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <View style={styles.hero}>
          <View
            pointerEvents="none"
            style={styles.heroGlowTop}
          />

          <View
            pointerEvents="none"
            style={styles.heroGlowBottom}
          />

          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>
              ALGORITMOS EM AÇÃO
            </Text>
          </View>

          <Image
            source={require('../../assets/images/tomjerry.png')}
            style={styles.heroImage}
            resizeMode="contain"
            accessibilityLabel="Tom perseguindo Jerry"
          />

          <Text style={styles.title}>
            Tom & Jerry
          </Text>

          <Text style={styles.subtitle}>
            Visualizador de Busca
          </Text>

          <Text style={styles.description}>
            Ajude Tom a encontrar Jerry e acompanhe, passo a passo, como cada estratégia explora o labirinto.
          </Text>

          <View style={styles.characterGuide}>
            <View style={styles.characterPill}>
              <View
                style={[
                  styles.characterDot,
                  styles.tomDot,
                ]}
              />

              <Text style={styles.characterPillText}>
                Tom • início
              </Text>
            </View>

            <View style={styles.characterPill}>
              <View
                style={[
                  styles.characterDot,
                  styles.jerryDot,
                ]}
              />

              <Text style={styles.characterPillText}>
                Jerry • objetivo
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionLabel}>
                ESCOLHA UM CENÁRIO
              </Text>

              <Text style={styles.sectionTitle}>
                Onde começa a perseguição?
              </Text>
            </View>

            <View style={styles.sectionCount}>
              <Text style={styles.sectionCountText}>
                4 mapas
              </Text>
            </View>
          </View>

          <ScenarioCard
            emoji="🍳"
            title="Cozinha"
            difficulty="Fácil"
            description="Poucos obstáculos. Ideal para entender o funcionamento dos algoritmos."
            color={COLORS.easy}
            onPress={() =>
              handleScenarioPress(
                'Cozinha'
              )
            }
          />

          <ScenarioCard
            emoji="🛋️"
            title="Sala"
            difficulty="Médio"
            description="Mais corredores, obstáculos e diferentes possibilidades de caminho."
            color={COLORS.medium}
            onPress={() =>
              handleScenarioPress(
                'Sala'
              )
            }
          />

          <ScenarioCard
            emoji="📦"
            title="Porão"
            difficulty="Difícil"
            description="Becos e caminhos enganosos para desafiar os algoritmos."
            color={COLORS.hard}
            onPress={() =>
              handleScenarioPress(
                'Porão'
              )
            }
          />

          <ScenarioCard
            emoji="✏️"
            title="Manual"
            difficulty="Personalizado"
            description="Crie seu próprio labirinto posicionando Tom, Jerry e as paredes."
            color={COLORS.manual}
            onPress={() =>
              handleScenarioPress(
                'Manual'
              )
            }
          />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Text style={styles.infoIcon}>
              💡
            </Text>
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Como funciona?
            </Text>

            <Text style={styles.infoText}>
              Tom é o ponto inicial e Jerry é o objetivo. Escolha A* ou Busca Gulosa, edite o mapa e observe a exploração acontecer.
            </Text>
          </View>
        </View>

        <View style={styles.algorithmPreview}>
          <View style={styles.algorithmItem}>
            <Text style={styles.algorithmName}>
              A*
            </Text>

            <Text style={styles.algorithmFormula}>
              F = G + H
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.algorithmItem}>
            <Text style={styles.algorithmName}>
              Guloso
            </Text>

            <Text style={styles.algorithmFormula}>
              prioridade = H
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Visualizador de algoritmos de busca informada
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 48,
    marginTop: 30,
  },

  hero: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    alignItems: 'center',

    overflow: 'hidden',

    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 28,

    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,

    marginTop: 18,
    marginBottom: 34,

    shadowColor: '#6A4938',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,

    elevation: 4,
  },

  heroGlowTop: {
    position: 'absolute',
    top: -70,
    right: -45,

    width: 180,
    height: 180,

    borderRadius: 90,

    backgroundColor: '#FFE7B4',
    opacity: 0.7,
  },

  heroGlowBottom: {
    position: 'absolute',
    bottom: -85,
    left: -55,

    width: 180,
    height: 180,

    borderRadius: 90,

    backgroundColor: COLORS.tom,
    opacity: 0.62,
  },

  heroBadge: {
    zIndex: 1,

    backgroundColor: '#FFF0EC',

    borderWidth: 1,
    borderColor: '#F5C7BB',
    borderRadius: 20,

    paddingHorizontal: 11,
    paddingVertical: 5,
  },

  heroBadgeText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  heroImage: {
    zIndex: 1,

    width: '100%',
    maxWidth: 470,
    height: 205,

    marginTop: 2,
  },

  title: {
    zIndex: 1,

    color: COLORS.text,
    fontSize: 38,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.8,
  },

  subtitle: {
    zIndex: 1,

    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 1,
    textAlign: 'center',
  },

  description: {
    zIndex: 1,

    maxWidth: 500,

    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',

    marginTop: 13,
    paddingHorizontal: 8,
  },

  characterGuide: {
    zIndex: 1,

    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,

    marginTop: 16,
  },

  characterPill: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: COLORS.white,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,

    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  characterDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 6,
  },

  tomDot: {
    backgroundColor: '#6FA8DC',
  },

  jerryDot: {
    backgroundColor: '#E98B5A',
  },

  characterPillText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '800',
  },

  section: {
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,

    marginBottom: 18,
  },

  sectionHeading: {
    flex: 1,
  },

  sectionLabel: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 5,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 23,
    fontWeight: '900',
  },

  sectionCount: {
    backgroundColor: '#FFF0EC',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  sectionCountText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '900',
  },

  infoCard: {
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFF4DC',

    borderWidth: 1,
    borderColor: '#F1D9A9',
    borderRadius: 18,

    padding: 17,
    marginTop: 10,
  },

  infoIconContainer: {
    width: 44,
    height: 44,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.surface,
    borderRadius: 13,

    marginRight: 13,
  },

  infoIcon: {
    fontSize: 24,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    color: COLORS.text,
    fontWeight: '900',
    fontSize: 15,
    marginBottom: 4,
  },

  infoText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 19,
  },

  algorithmPreview: {
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',

    flexDirection: 'row',

    backgroundColor: COLORS.surface,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,

    marginTop: 16,
    paddingVertical: 16,
  },

  algorithmItem: {
    flex: 1,
    alignItems: 'center',
  },

  algorithmName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },

  algorithmFormula: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },

  divider: {
    width: 1,
    backgroundColor: COLORS.border,
  },

  footer: {
    color: '#988D84',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 30,
  },
});
