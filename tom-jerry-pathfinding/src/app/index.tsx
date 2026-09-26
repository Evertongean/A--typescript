import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import { ScenarioCard } from '@/components/ScenarioCard';
import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';

export default function HomeScreen() {

  const router = useRouter();

  function handleScenarioPress(scenario: string) {
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
        backgroundColor={COLORS.background}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image
            source={require('../../assets/images/tomjerry.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />

          <Text style={styles.title}>
            Tom & Jerry
          </Text>

          <Text style={styles.subtitle}>
            Visualizador de Busca
          </Text>

          <Text style={styles.description}>
            Ajude Tom a encontrar Jerry enquanto visualiza,
            passo a passo, como diferentes algoritmos de busca
            percorrem o labirinto.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ESCOLHA UM CENÁRIO</Text>

          <Text style={styles.sectionTitle}>
            Onde Tom vai procurar Jerry?
          </Text>

          <ScenarioCard
            emoji="🍳"
            title="Cozinha"
            difficulty="Fácil"
            description="Poucos obstáculos. Ideal para entender o funcionamento dos algoritmos."
            color={COLORS.easy}
            onPress={() => handleScenarioPress('Cozinha')}
          />

          <ScenarioCard
            emoji="🛋️"
            title="Sala"
            difficulty="Médio"
            description="Mais corredores, obstáculos e diferentes possibilidades de caminho."
            color={COLORS.medium}
            onPress={() => handleScenarioPress('Sala')}
          />

          <ScenarioCard
            emoji="📦"
            title="Porão"
            difficulty="Difícil"
            description="Becos e caminhos enganosos para desafiar os algoritmos."
            color={COLORS.hard}
            onPress={() => handleScenarioPress('Porão')}
          />

          <ScenarioCard
            emoji="✏️"
            title="Manual"
            difficulty="Personalizado"
            description="Crie seu próprio labirinto posicionando Tom, Jerry e as paredes."
            color={COLORS.manual}
            onPress={() => handleScenarioPress('Manual')}
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Como funciona?
            </Text>

            <Text style={styles.infoText}>
              Tom é o ponto inicial e Jerry é o objetivo.
              Depois você poderá escolher se Tom utilizará
              A* ou Busca Gulosa para encontrar o caminho.
            </Text>
          </View>
        </View>

        <View style={styles.algorithmPreview}>
          <View style={styles.algorithmItem}>
            <Text style={styles.algorithmName}>A*</Text>
            <Text style={styles.algorithmFormula}>
              F = G + H
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.algorithmItem}>
            <Text style={styles.algorithmName}>Guloso</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  hero: {
    alignItems: 'center',
    marginBottom: 38,
  },

 
  title: {
    color: COLORS.text,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
  },

  heroImage: {
    width: '100%',
    maxWidth: 420,
    height: 200,
},

  subtitle: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },

  description: {
    maxWidth: 500,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 10,
  },

  section: {
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
  },

  sectionLabel: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 23,
    fontWeight: '800',
    marginBottom: 18,
  },

  infoCard: {
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF4DC',
    borderRadius: 18,
    padding: 18,
    marginTop: 10,
  },

  infoIcon: {
    fontSize: 28,
    marginRight: 14,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 5,
  },

  infoText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
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
    fontWeight: '800',
  },

  algorithmFormula: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },

  divider: {
    width: 1,
    backgroundColor: COLORS.border,
  },

  footer: {
    color: '#9A948C',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 30,
  },
});