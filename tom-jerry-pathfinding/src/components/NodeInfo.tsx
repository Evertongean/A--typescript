import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { COLORS } from '@/constants/colors';
import { CellType } from '@/models/CellType';
import { SearchStep } from '@/models/SearchStep';

interface NodeInfoProps {
  step: SearchStep | null;
  cellType: CellType | null;
}

export function NodeInfo({
  step,
  cellType,
}: NodeInfoProps) {
  if (!step || !cellType) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          NÓ SELECIONADO
        </Text>

        <Text style={styles.emptyTitle}>
          Nenhum nó selecionado
        </Text>

        <Text style={styles.emptyText}>
          Toque em uma célula analisada para visualizar G, H e F.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        NÓ SELECIONADO
      </Text>

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Linha {step.row + 1} • Coluna {step.col + 1}
          </Text>

          <Text style={styles.state}>
            Estado: {getStateName(cellType)}
          </Text>
        </View>

        <View style={styles.stateBadge}>
          <Text style={styles.stateBadgeText}>
            {getStateShortName(cellType)}
          </Text>
        </View>
      </View>

      <View style={styles.values}>
        <ValueBox
          label="G"
          value={step.g}
          description="Custo percorrido"
        />

        <ValueBox
          label="H"
          value={step.h}
          description="Estimativa até Jerry"
        />

        <ValueBox
          label="F"
          value={step.f}
          description="G + H"
        />
      </View>

      <View style={styles.explanation}>
        <Text style={styles.explanationTitle}>
          Como interpretar
        </Text>

        <Text style={styles.explanationText}>
          G = custo percorrido desde Tom
        </Text>

        <Text style={styles.explanationText}>
          H = estimativa de distância até Jerry
        </Text>

        <Text style={styles.explanationText}>
          F = G + H
        </Text>
      </View>
    </View>
  );
}

interface ValueBoxProps {
  label: string;
  value: number;
  description: string;
}

function ValueBox({
  label,
  value,
  description,
}: ValueBoxProps) {
  return (
    <View style={styles.valueBox}>
      <Text style={styles.valueLabel}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>

      <Text style={styles.valueDescription}>
        {description}
      </Text>
    </View>
  );
}

function getStateName(
  type: CellType
) {
  switch (type) {
    case 'START':
      return 'Tom / Início';

    case 'GOAL':
      return 'Jerry / Objetivo';

    case 'OPEN':
      return 'Lista aberta';

    case 'CLOSED':
      return 'Visitado';

    case 'PATH':
      return 'Caminho final';

    case 'WALL':
      return 'Parede';

    default:
      return 'Livre';
  }
}

function getStateShortName(
  type: CellType
) {
  switch (type) {
    case 'START':
      return 'START';

    case 'GOAL':
      return 'GOAL';

    case 'OPEN':
      return 'OPEN';

    case 'CLOSED':
      return 'CLOSED';

    case 'PATH':
      return 'PATH';

    default:
      return type;
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
    marginBottom: 8,
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
  },

  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 16,
  },

  title: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '900',
  },

  state: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 4,
  },

  stateBadge: {
    backgroundColor: '#FFF0EC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  stateBadgeText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '900',
  },

  values: {
    flexDirection: 'row',
    gap: 8,
  },

  valueBox: {
    flex: 1,

    backgroundColor: COLORS.background,

    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,

    alignItems: 'center',
  },

  valueLabel: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '900',
  },

  value: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },

  valueDescription: {
    color: COLORS.textSecondary,
    fontSize: 8,
    textAlign: 'center',
    marginTop: 3,
  },

  explanation: {
    backgroundColor: '#FFF4DC',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },

  explanationTitle: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 6,
  },

  explanationText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    lineHeight: 16,
  },
});