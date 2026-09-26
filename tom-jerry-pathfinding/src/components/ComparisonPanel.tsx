import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '@/constants/colors';
import { ComparisonResult } from '@/models/ComparisonResult';
import { SearchResult } from '@/models/SearchResult';

interface ComparisonPanelProps {
  result: ComparisonResult;
  heuristicName: string;
  movementName: string;
}

export function ComparisonPanel({
  result,
  heuristicName,
  movementName,
}: ComparisonPanelProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        COMPARAÇÃO
      </Text>

      <Text style={styles.title}>
        A* × Busca Gulosa
      </Text>

      <Text style={styles.configuration}>
        {heuristicName}
        {' • '}
        {movementName}
      </Text>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.metricHeader}>
            MÉTRICA
          </Text>

          <Text style={styles.algorithmHeader}>
            A*
          </Text>

          <Text style={styles.algorithmHeader}>
            Guloso
          </Text>
        </View>

        <ComparisonRow
          label="Status"
          aStarValue={getStatus(result.aStar)}
          greedyValue={getStatus(result.greedy)}
          status
          aStarFound={result.aStar.found}
          greedyFound={result.greedy.found}
        />

        <ComparisonRow
          label="Visitados"
          aStarValue={`${result.aStar.visitedNodes.length}`}
          greedyValue={`${result.greedy.visitedNodes.length}`}
        />

        <ComparisonRow
          label="Custo"
          aStarValue={`${result.aStar.totalCost}`}
          greedyValue={`${result.greedy.totalCost}`}
        />

        <ComparisonRow
          label="Passos"
          aStarValue={`${getPathSteps(result.aStar)}`}
          greedyValue={`${getPathSteps(result.greedy)}`}
        />
      </View>

      <View style={styles.explanation}>
        <Text style={styles.explanationText}>
          A* considera G + H; a Busca Gulosa prioriza H.
        </Text>

        <Text style={styles.explanationText}>
          Menos visitados indica menor exploração neste mapa. Menor custo indica um caminho acumulado mais barato.
        </Text>
      </View>
    </View>
  );
}

interface ComparisonRowProps {
  label: string;
  aStarValue: string;
  greedyValue: string;
  status?: boolean;
  aStarFound?: boolean;
  greedyFound?: boolean;
}

function ComparisonRow({
  label,
  aStarValue,
  greedyValue,
  status = false,
  aStarFound = false,
  greedyFound = false,
}: ComparisonRowProps) {
  return (
    <View style={styles.metricRow}>
      <Text style={styles.metricLabel}>
        {label}
      </Text>

      <Text
        style={[
          styles.metricValue,
          status &&
            (aStarFound
              ? styles.statusFound
              : styles.statusNotFound),
        ]}
      >
        {aStarValue}
      </Text>

      <Text
        style={[
          styles.metricValue,
          status &&
            (greedyFound
              ? styles.statusFound
              : styles.statusNotFound),
        ]}
      >
        {greedyValue}
      </Text>
    </View>
  );
}

function getStatus(
  result: SearchResult
) {
  return result.found
    ? 'Encontrado'
    : 'Sem caminho';
}

function getPathSteps(
  result: SearchResult
) {
  return result.found
    ? Math.max(
        result.path.length - 1,
        0
      )
    : 0;
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

    padding: 18,
    marginTop: 16,
  },

  label: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },

  configuration: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 16,
  },

  table: {
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  metricHeader: {
    width: '34%',
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: '800',
  },

  algorithmHeader: {
    flex: 1,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },

  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },

  metricLabel: {
    width: '34%',
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },

  metricValue: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },

  statusFound: {
    color: COLORS.easy,
    fontSize: 11,
  },

  statusNotFound: {
    color: COLORS.hard,
    fontSize: 11,
  },

  explanation: {
    backgroundColor: '#FFF4DC',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    gap: 5,
  },

  explanationText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    lineHeight: 16,
  },
});
