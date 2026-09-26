import { useState } from 'react';

import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import { Grid } from '@/components/Grid';
import { EditorToolbar } from '@/components/EditorToolbar';
import { NodeInfo } from '@/components/NodeInfo';
import { AlgorithmSelector } from '@/components/AlgorithmSelector';
import { HeuristicSelector } from '@/components/HeuristicSelector';
import { MovementSelector } from '@/components/MovementSelector';

import { aStar } from '@/algorithms/aStar';
import { greedyBestFirst } from '@/algorithms/greedyBestFirst';

import { useSearchAnimation } from '@/hooks/useSearchAnimation';

import { COLORS } from '@/constants/colors';

import { CellType } from '@/models/CellType';
import { EditorMode } from '@/models/EditorMode';
import { SearchResult } from '@/models/SearchResult';
import { SearchStep } from '@/models/SearchStep';
import { AlgorithmType } from '@/models/AlgorithmType';
import { HeuristicType } from '@/models/HeuristicType';
import { MovementType } from '@/models/MovementType';

const ROWS = 12;
const COLS = 12;

export default function VisualizerScreen() {
  const router = useRouter();

  const { scenario } = useLocalSearchParams<{
    scenario?: string;
  }>();

  const { width } = useWindowDimensions();

  /* ==========================================
     EDITOR
  ========================================== */

  const [
    editorMode,
    setEditorMode,
  ] = useState<EditorMode>('WALL');

  /* ==========================================
     ALGORITMO
  ========================================== */

  const [
    algorithm,
    setAlgorithm,
  ] = useState<AlgorithmType>('ASTAR');

  /* ==========================================
     HEURÍSTICA
  ========================================== */

  const [
    heuristic,
    setHeuristic,
  ] = useState<HeuristicType>('MANHATTAN');

  /* ==========================================
     MOVIMENTO
  ========================================== */

  const [
    movement,
    setMovement,
  ] = useState<MovementType>('FOUR_DIRECTIONS');

  /* ==========================================
     GRID REAL
  ========================================== */

  const [
    mazeGrid,
    setMazeGrid,
  ] = useState<CellType[][]>(
    () => createExampleGrid()
  );

  /* ==========================================
     GRID VISUAL
  ========================================== */

  const [
    displayGrid,
    setDisplayGrid,
  ] = useState<CellType[][]>(
    () => createExampleGrid()
  );

  /* ==========================================
     STATUS
  ========================================== */

  const [
    searchStatus,
    setSearchStatus,
  ] = useState('Editável');

  /* ==========================================
     RESULTADO
  ========================================== */

  const [
    searchResult,
    setSearchResult,
  ] = useState<SearchResult | null>(null);

  /* ==========================================
     NÓ SELECIONADO
  ========================================== */

  const [
    selectedPosition,
    setSelectedPosition,
  ] = useState<{
    row: number;
    col: number;
  } | null>(null);

  /* ==========================================
     ANIMAÇÃO
  ========================================== */

  const animation =
    useSearchAnimation({
      onGridChange: setDisplayGrid,

      onFinish: (result) => {
        setSearchResult(result);

        if (result.found) {
          setSearchStatus('Concluído');
        } else {
          setSearchStatus('Sem caminho');
        }
      },
    });

  /* ==========================================
     INFORMAÇÃO DO NÓ SELECIONADO
  ========================================== */

  const selectedStep =
    selectedPosition
      ? findVisibleStep(
          searchResult,
          selectedPosition.row,
          selectedPosition.col,
          animation.currentStep,
          animation.isFinished
        )
      : null;

  const selectedCellType =
    selectedPosition
      ? displayGrid[
          selectedPosition.row
        ]?.[
          selectedPosition.col
        ] ?? null
      : null;

  /* ==========================================
     TAMANHO DAS CÉLULAS
  ========================================== */

  const cellSize = Math.min(
    Math.floor(
      (width - 40) / COLS
    ),
    40
  );

  /* ==========================================
     CLIQUE NO GRID
  ========================================== */

  function handleCellPress(
    row: number,
    col: number
  ) {
    /*
     * Primeiro verificamos se essa célula
     * já foi descoberta pelo algoritmo.
     */
    const visibleStep =
      findVisibleStep(
        searchResult,
        row,
        col,
        animation.currentStep,
        animation.isFinished
      );

    /*
     * Se o nó já foi analisado,
     * selecionamos para visualizar
     * G, H e F.
     */
    if (visibleStep) {
      setSelectedPosition({
        row,
        col,
      });

      return;
    }

    /*
     * Enquanto o algoritmo está
     * rodando não permitimos editar.
     */
    if (animation.isRunning) {
      showMessage(
        'Busca em andamento',
        'Reinicie a busca antes de editar o labirinto.'
      );

      return;
    }

    /*
     * Limpa resultado anterior.
     */
    animation.reset();

    setSearchResult(null);
    setSelectedPosition(null);
    setSearchStatus('Editável');

    const newGrid =
      cloneGrid(mazeGrid);

    const currentCell =
      newGrid[row][col];

    /* ======================================
       PAREDE
    ====================================== */

    if (editorMode === 'WALL') {
      if (
        currentCell === 'START' ||
        currentCell === 'GOAL'
      ) {
        showMessage(
          'Não é possível',
          'Não é permitido colocar uma parede sobre Tom ou Jerry.'
        );

        return;
      }

      newGrid[row][col] =
        currentCell === 'WALL'
          ? 'EMPTY'
          : 'WALL';

      updateMaze(newGrid);

      return;
    }

    /* ======================================
       APAGAR
    ====================================== */

    if (editorMode === 'ERASE') {
      newGrid[row][col] =
        'EMPTY';

      updateMaze(newGrid);

      return;
    }

    /* ======================================
       TOM
    ====================================== */

    if (editorMode === 'START') {
      if (currentCell === 'GOAL') {
        showMessage(
          'Posição ocupada',
          'Tom e Jerry não podem ocupar a mesma célula.'
        );

        return;
      }

      if (currentCell === 'WALL') {
        showMessage(
          'Existe uma parede aqui',
          'Apague a parede antes de posicionar Tom.'
        );

        return;
      }

      removeCellType(
        newGrid,
        'START'
      );

      newGrid[row][col] =
        'START';

      updateMaze(newGrid);

      return;
    }

    /* ======================================
       JERRY
    ====================================== */

    if (editorMode === 'GOAL') {
      if (currentCell === 'START') {
        showMessage(
          'Posição ocupada',
          'Tom e Jerry não podem ocupar a mesma célula.'
        );

        return;
      }

      if (currentCell === 'WALL') {
        showMessage(
          'Existe uma parede aqui',
          'Apague a parede antes de posicionar Jerry.'
        );

        return;
      }

      removeCellType(
        newGrid,
        'GOAL'
      );

      newGrid[row][col] =
        'GOAL';

      updateMaze(newGrid);
    }
  }

  /* ==========================================
     ATUALIZAR LABIRINTO
  ========================================== */

  function updateMaze(
    newGrid: CellType[][]
  ) {
    setSelectedPosition(null);

    setMazeGrid(
      cloneGrid(newGrid)
    );

    setDisplayGrid(
      cloneGrid(newGrid)
    );
  }

  /* ==========================================
     TROCAR ALGORITMO
  ========================================== */

  function handleAlgorithmChange(
    value: AlgorithmType
  ) {
    /*
     * Limpamos a execução anterior
     * antes de mudar de algoritmo.
     */
    handleResetSearch();

    setAlgorithm(value);
  }

  /* ==========================================
     TROCAR HEURÍSTICA
  ========================================== */

  function handleHeuristicChange(
    value: HeuristicType
  ) {
    /*
     * Limpamos apenas a execução anterior.
     * Tom, Jerry e paredes permanecem no mapa.
     */
    handleResetSearch();

    setHeuristic(value);
  }

  /* ==========================================
     TROCAR MOVIMENTO
  ========================================== */

  function handleMovementChange(
    value: MovementType
  ) {
    handleResetSearch();

    setMovement(value);
  }

  /* ==========================================
     INICIAR BUSCA
  ========================================== */

  function handleStartSearch() {
    setSelectedPosition(null);

    const tom =
      findCell(
        mazeGrid,
        'START'
      );

    const jerry =
      findCell(
        mazeGrid,
        'GOAL'
      );

    if (!tom) {
      showMessage(
        'Tom não encontrado',
        'Posicione Tom no labirinto antes de iniciar a busca.'
      );

      return;
    }

    if (!jerry) {
      showMessage(
        'Jerry não encontrado',
        'Posicione Jerry no labirinto antes de iniciar a busca.'
      );

      return;
    }

    /*
     * ======================================
     * ESCOLHER ALGORITMO
     * ======================================
     */

    const result =
      algorithm === 'ASTAR'
        ? aStar(
            mazeGrid,
            heuristic,
            movement
          )
        : greedyBestFirst(
            mazeGrid,
            heuristic,
            movement
          );

    setSearchResult(result);

    setSearchStatus('Buscando');

    /*
     * O hook reproduz os passos
     * independente do algoritmo escolhido.
     */
    animation.start(
      result,
      mazeGrid
    );
  }

  /* ==========================================
     RESETAR BUSCA
  ========================================== */

  function handleResetSearch() {
    setSelectedPosition(null);

    animation.reset();

    setDisplayGrid(
      cloneGrid(
        mazeGrid
      )
    );

    setSearchResult(null);

    setSearchStatus(
      'Editável'
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
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
        {/* ===================================
            CABEÇALHO
        ==================================== */}

        <View style={styles.topBar}>
          <Pressable
            style={styles.backButton}
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={
                styles.backButtonText
              }
            >
              ‹
            </Text>
          </Pressable>

          <View
            style={
              styles.topBarCenter
            }
          >
            <Text
              style={
                styles.scenarioLabel
              }
            >
              CENÁRIO
            </Text>

            <Text
              style={
                styles.scenarioName
              }
            >
              {scenario ??
                'Labirinto'}
            </Text>
          </View>

          <View
            style={
              styles.topBarSpacer
            }
          />
        </View>

        {/* ===================================
            VISUALIZADOR
        ==================================== */}

        <View style={styles.header}>
          <View
            style={
              styles.colunnview
            }
          >
            <Text
              style={styles.label}
            >
              VISUALIZADOR
            </Text>

            <Text
              style={styles.title}
            >
              {scenario ??
                'Labirinto'}
            </Text>
          </View>

          {/* INICIAR */}

          <Pressable
            disabled={
              animation.isRunning
            }
            style={({
              pressed,
            }) => [
              styles.startButton,

              animation.isRunning &&
                styles.startButtonDisabled,

              pressed &&
                !animation.isRunning &&
                styles.startButtonPressed,
            ]}
            onPress={
              handleStartSearch
            }
          >
            <Text
              style={
                styles.startButtonText
              }
            >
              ▶ Iniciar busca
            </Text>
          </Pressable>
        </View>

        <Text style={styles.subtitle}>
          Tom precisa encontrar um caminho até Jerry.
        </Text>

        {/* ===================================
            GRID
        ==================================== */}

        <View style={styles.gridCard}>
          <View
            style={
              styles.gridHeader
            }
          >
            <View>
              <Text
                style={
                  styles.gridLabel
                }
              >
                MAPA
              </Text>

              <Text
                style={
                  styles.gridTitle
                }
              >
                {ROWS} × {COLS}
              </Text>
            </View>

            <View
              style={[
                styles.status,

                searchStatus ===
                  'Sem caminho' &&
                  styles.statusError,
              ]}
            >
              <View
                style={[
                  styles.statusDot,

                  searchStatus ===
                    'Sem caminho' &&
                    styles.statusDotError,
                ]}
              />

              <Text
                style={[
                  styles.statusText,

                  searchStatus ===
                    'Sem caminho' &&
                    styles.statusTextError,
                ]}
              >
                {searchStatus}
              </Text>
            </View>
          </View>

          <View
            style={
              styles.gridWrapper
            }
          >
            <Grid
              grid={displayGrid}
              cellSize={cellSize}
              onCellPress={
                handleCellPress
              }
            />
          </View>
        </View>

        {/* ===================================
            INFORMAÇÃO DO NÓ
        ==================================== */}

        <NodeInfo
          step={selectedStep}
          cellType={
            selectedCellType
          }
        />

        {/* ===================================
            ANIMAÇÃO
        ==================================== */}

        <View
          style={
            styles.animationCard
          }
        >
          <View
            style={
              styles.animationHeader
            }
          >
            <View>
              <Text
                style={
                  styles.animationLabel
                }
              >
                ANIMAÇÃO
              </Text>

              <Text
                style={
                  styles.animationTitle
                }
              >
                Execução passo a passo
              </Text>
            </View>

            <View
              style={
                styles.stepBadge
              }
            >
              <Text
                style={
                  styles.stepBadgeText
                }
              >
                {
                  animation.currentStep
                }
                /
                {
                  animation.totalSteps
                }
              </Text>
            </View>
          </View>

          {/* CONTROLES */}

          <View
            style={
              styles.animationButtons
            }
          >
            <Pressable
              disabled={
                !animation.isRunning
              }
              style={[
                styles.animationButton,

                !animation.isRunning &&
                  styles.controlDisabled,
              ]}
              onPress={() => {
                if (
                  animation.isPaused
                ) {
                  animation.resume();
                } else {
                  animation.pause();
                }
              }}
            >
              <Text
                style={
                  styles.animationButtonText
                }
              >
                {animation.isPaused
                  ? '▶ Continuar'
                  : '⏸ Pausar'}
              </Text>
            </Pressable>

            <Pressable
              disabled={
                animation.totalSteps ===
                  0 ||
                animation.isFinished
              }
              style={[
                styles.animationButton,

                (animation.totalSteps ===
                  0 ||
                  animation.isFinished) &&
                  styles.controlDisabled,
              ]}
              onPress={
                animation.nextStep
              }
            >
              <Text
                style={
                  styles.animationButtonText
                }
              >
                ⏭ Próximo
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.animationButton,
                styles.resetButton,
              ]}
              onPress={
                handleResetSearch
              }
            >
              <Text
                style={
                  styles.resetButtonText
                }
              >
                ↻ Reiniciar
              </Text>
            </Pressable>
          </View>

          {/* VELOCIDADE */}

          <Text
            style={
              styles.speedTitle
            }
          >
            Velocidade
          </Text>

          <View
            style={
              styles.speedButtons
            }
          >
            <SpeedButton
              label="Lento"
              selected={
                animation.speed ===
                600
              }
              onPress={() =>
                animation.setSpeed(
                  600
                )
              }
            />

            <SpeedButton
              label="Normal"
              selected={
                animation.speed ===
                250
              }
              onPress={() =>
                animation.setSpeed(
                  250
                )
              }
            />

            <SpeedButton
              label="Rápido"
              selected={
                animation.speed ===
                80
              }
              onPress={() =>
                animation.setSpeed(
                  80
                )
              }
            />
          </View>
        </View>

        {/* ===================================
            SELETOR DE ALGORITMO
        ==================================== */}

        <AlgorithmSelector
          value={algorithm}
          onChange={
            handleAlgorithmChange
          }
          disabled={
            animation.isRunning
          }
        />

        {/* ===================================
            SELETOR DE HEURÍSTICA
        ==================================== */}

        <HeuristicSelector
          value={heuristic}
          onChange={
            handleHeuristicChange
          }
          disabled={
            animation.isRunning
          }
        />

        {/* ===================================
            SELETOR DE MOVIMENTO
        ==================================== */}

        <MovementSelector
          value={movement}
          onChange={
            handleMovementChange
          }
          disabled={
            animation.isRunning
          }
        />

        {/* ===================================
            EDITOR
        ==================================== */}

        <EditorToolbar
          selectedMode={
            editorMode
          }
          onModeChange={
            setEditorMode
          }
        />

        {/* ===================================
            FERRAMENTA ATIVA
        ==================================== */}

        <View
          style={
            styles.selectedToolCard
          }
        >
          <Text
            style={
              styles.selectedToolLabel
            }
          >
            FERRAMENTA ATIVA
          </Text>

          <View
            style={
              styles.selectedToolRow
            }
          >
            <View
              style={
                styles.selectedToolIcon
              }
            >
              <Text
                style={
                  styles.selectedToolSymbol
                }
              >
                {getEditorSymbol(
                  editorMode
                )}
              </Text>
            </View>

            <View
              style={
                styles.selectedToolContent
              }
            >
              <Text
                style={
                  styles.selectedToolTitle
                }
              >
                {getEditorName(
                  editorMode
                )}
              </Text>

              <Text
                style={
                  styles.selectedToolDescription
                }
              >
                {getEditorDescription(
                  editorMode
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* ===================================
            LEGENDA
        ==================================== */}

        <View style={styles.legend}>
          <Text
            style={
              styles.legendTitle
            }
          >
            Legenda
          </Text>

          <View
            style={
              styles.legendRow
            }
          >
            <LegendItem
              color="#DCEEFF"
              label="Tom"
              text="T"
            />

            <LegendItem
              color="#FFE1DC"
              label="Jerry"
              text="J"
            />

            <LegendItem
              color="#FFD966"
              label="Aberto"
            />

            <LegendItem
              color="#76A9EA"
              label="Visitado"
            />

            <LegendItem
              color="#78C98A"
              label="Caminho"
            />

            <LegendItem
              color="#3F4145"
              label="Parede"
            />

            <LegendItem
              color="#FFFFFF"
              label="Livre"
              border
            />
          </View>
        </View>

        {/* ===================================
            CONFIGURAÇÕES
        ==================================== */}

        <View
          style={
            styles.configurationCard
          }
        >
          <Text
            style={
              styles.configurationLabel
            }
          >
            CONFIGURAÇÕES
          </Text>

          <Text
            style={
              styles.configurationTitle
            }
          >
            Busca
          </Text>

          <View
            style={
              styles.configurationRow
            }
          >
            {/* ALGORITMO */}

            <View
              style={
                styles.configurationItem
              }
            >
              <Text
                style={
                  styles.configurationName
                }
              >
                Algoritmo
              </Text>

              <Text
                style={
                  styles.configurationValue
                }
              >
                {algorithm ===
                'ASTAR'
                  ? 'A*'
                  : 'Guloso'}
              </Text>
            </View>

            <View
              style={
                styles.configurationDivider
              }
            />

            {/* HEURÍSTICA */}

            <View
              style={
                styles.configurationItem
              }
            >
              <Text
                style={
                  styles.configurationName
                }
              >
                Heurística
              </Text>

              <Text
                style={
                  styles.configurationValue
                }
              >
                {getHeuristicName(
                  heuristic
                )}
              </Text>
            </View>

            <View
              style={
                styles.configurationDivider
              }
            />

            {/* MOVIMENTO */}

            <View
              style={
                styles.configurationItem
              }
            >
              <Text
                style={
                  styles.configurationName
                }
              >
                Movimento
              </Text>

              <Text
                style={
                  styles.configurationValue
                }
              >
                {getMovementName(
                  movement
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* ===================================
            RESULTADO
        ==================================== */}

        {searchResult &&
          animation.isFinished && (
            <View
              style={
                styles.resultCard
              }
            >
              <Text
                style={
                  styles.resultLabel
                }
              >
                RESULTADO
              </Text>

              <Text
                style={
                  styles.resultTitle
                }
              >
                {searchResult.found
                  ? 'Jerry encontrado!'
                  : 'Sem caminho'}
              </Text>

              {/* Mostra qual algoritmo foi usado */}

              <Text
                style={
                  styles.resultAlgorithm
                }
              >
                {algorithm ===
                'ASTAR'
                  ? 'A*'
                  : 'Guloso'}
                {' • '}
                {getHeuristicName(
                  heuristic
                )}
                {' • '}
                {getMovementName(
                  movement
                )}
              </Text>

              <View
                style={
                  styles.resultRow
                }
              >
                <ResultItem
                  label="Visitados"
                  value={`${searchResult.visitedNodes.length}`}
                />

                <ResultItem
                  label="Custo"
                  value={`${searchResult.totalCost}`}
                />

                <ResultItem
                  label="Passos"
                  value={`${
                    searchResult.found
                      ? Math.max(
                          searchResult.path
                            .length - 1,
                          0
                        )
                      : 0
                  }`}
                />
              </View>
            </View>
          )}

        <Text
          style={
            styles.helpText
          }
        >
          Escolha A* ou Busca Gulosa, execute a busca e toque em uma célula analisada para visualizar G, H e F.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ==========================================
   LOCALIZAR STEP VISÍVEL
========================================== */

function findVisibleStep(
  result: SearchResult | null,
  row: number,
  col: number,
  currentStep: number,
  isFinished: boolean
): SearchStep | null {
  if (!result) {
    return null;
  }

  const lastVisibleIndex =
    isFinished
      ? result.steps.length - 1
      : Math.min(
          currentStep - 1,
          result.steps.length - 1
        );

  if (lastVisibleIndex < 0) {
    return null;
  }

  /*
   * Procura do evento mais recente
   * para o mais antigo.
   */
  for (
    let i = lastVisibleIndex;
    i >= 0;
    i--
  ) {
    const step =
      result.steps[i];

    if (
      step.row === row &&
      step.col === col
    ) {
      return step;
    }
  }

  return null;
}

/* ==========================================
   VELOCIDADE
========================================== */

interface SpeedButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function SpeedButton({
  label,
  selected,
  onPress,
}: SpeedButtonProps) {
  return (
    <Pressable
      style={[
        styles.speedButton,

        selected &&
          styles.speedButtonSelected,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.speedButtonText,

          selected &&
            styles.speedButtonTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* ==========================================
   RESULTADO
========================================== */

interface ResultItemProps {
  label: string;
  value: string;
}

function ResultItem({
  label,
  value,
}: ResultItemProps) {
  return (
    <View
      style={
        styles.resultItem
      }
    >
      <Text
        style={
          styles.resultItemValue
        }
      >
        {value}
      </Text>

      <Text
        style={
          styles.resultItemLabel
        }
      >
        {label}
      </Text>
    </View>
  );
}

/* ==========================================
   EDITOR
========================================== */

function getEditorName(
  mode: EditorMode
) {
  switch (mode) {
    case 'START':
      return 'Posicionar Tom';

    case 'GOAL':
      return 'Posicionar Jerry';

    case 'WALL':
      return 'Criar parede';

    case 'ERASE':
      return 'Apagar';

    default:
      return '';
  }
}

function getEditorSymbol(
  mode: EditorMode
) {
  switch (mode) {
    case 'START':
      return 'T';

    case 'GOAL':
      return 'J';

    case 'WALL':
      return '■';

    case 'ERASE':
      return '×';

    default:
      return '';
  }
}

function getEditorDescription(
  mode: EditorMode
) {
  switch (mode) {
    case 'START':
      return 'Toque em uma célula para mover Tom.';

    case 'GOAL':
      return 'Toque em uma célula para mover Jerry.';

    case 'WALL':
      return 'Toque para criar ou remover uma parede.';

    case 'ERASE':
      return 'Toque para deixar a célula vazia.';

    default:
      return '';
  }
}

/* ==========================================
   HEURÍSTICA
========================================== */

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

/* ==========================================
   MOVIMENTO
========================================== */

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

/* ==========================================
   GRID
========================================== */

function cloneGrid(
  grid: CellType[][]
): CellType[][] {
  return grid.map(
    (row) => [...row]
  );
}

function removeCellType(
  grid: CellType[][],
  type: CellType
) {
  for (
    let row = 0;
    row < grid.length;
    row++
  ) {
    for (
      let col = 0;
      col < grid[row].length;
      col++
    ) {
      if (
        grid[row][col] === type
      ) {
        grid[row][col] =
          'EMPTY';
      }
    }
  }
}

function findCell(
  grid: CellType[][],
  type: CellType
): {
  row: number;
  col: number;
} | null {
  for (
    let row = 0;
    row < grid.length;
    row++
  ) {
    for (
      let col = 0;
      col < grid[row].length;
      col++
    ) {
      if (
        grid[row][col] === type
      ) {
        return {
          row,
          col,
        };
      }
    }
  }

  return null;
}

/* ==========================================
   LEGENDA
========================================== */

interface LegendItemProps {
  color: string;
  label: string;
  text?: string;
  border?: boolean;
}

function LegendItem({
  color,
  label,
  text,
  border,
}: LegendItemProps) {
  return (
    <View
      style={
        styles.legendItem
      }
    >
      <View
        style={[
          styles.legendColor,
          {
            backgroundColor:
              color,

            borderWidth:
              border
                ? 1
                : 0,

            borderColor:
              '#D7D7D7',
          },
        ]}
      >
        {text && (
          <Text
            style={
              styles.legendCellText
            }
          >
            {text}
          </Text>
        )}
      </View>

      <Text
        style={
          styles.legendText
        }
      >
        {label}
      </Text>
    </View>
  );
}

/* ==========================================
   MENSAGEM
========================================== */

function showMessage(
  title: string,
  message: string
) {
  if (
    Platform.OS === 'web' &&
    typeof window !== 'undefined'
  ) {
    window.alert(
      `${title}\n\n${message}`
    );

    return;
  }

  Alert.alert(
    title,
    message
  );
}

/* ==========================================
   GRID INICIAL
========================================== */

function createExampleGrid():
  CellType[][] {
  const grid:
    CellType[][] =
    Array.from(
      {
        length: ROWS,
      },
      () =>
        Array.from(
          {
            length: COLS,
          },
          () =>
            'EMPTY' as CellType
        )
    );

  /*
   * TOM
   */
  grid[1][1] = 'START';

  /*
   * JERRY
   */
  grid[10][10] = 'GOAL';

  /*
   * PAREDES
   */
  const walls: [
    number,
    number
  ][] = [
    [2, 3],
    [2, 4],
    [2, 5],

    [3, 5],

    [4, 2],
    [4, 3],
    [4, 5],

    [5, 5],
    [5, 6],
    [5, 7],

    [6, 3],
    [6, 7],

    [7, 3],
    [7, 7],

    [8, 3],
    [8, 4],
    [8, 5],
    [8, 7],
    [8, 8],

    [9, 8],
  ];

  walls.forEach(
    ([row, col]) => {
      grid[row][col] =
        'WALL';
    }
  );

  return grid;
}

/* ==========================================
   ESTILOS
========================================== */

const styles =
  StyleSheet.create({
    colunnview: {
      flexDirection:
        'column',
    },

    safeArea: {
      flex: 1,

      backgroundColor:
        COLORS.background,
    },

    container: {
      flex: 1,
    },

    content: {
      paddingHorizontal:
        16,

      paddingTop: 18,

      paddingBottom: 50,
    },

    /* TOP BAR */

    topBar: {
      width: '100%',
      maxWidth: 650,
      alignSelf: 'center',

      flexDirection:
        'row',

      alignItems:
        'center',

      marginBottom: 25,
    },

    backButton: {
      width: 44,
      height: 44,

      borderRadius: 14,

      backgroundColor:
        COLORS.surface,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    backButtonText: {
      color: COLORS.text,

      fontSize: 32,

      lineHeight: 32,

      marginTop: -3,
    },

    topBarCenter: {
      flex: 1,

      alignItems:
        'center',
    },

    scenarioLabel: {
      color:
        COLORS.textSecondary,

      fontSize: 9,

      fontWeight:
        '900',

      letterSpacing:
        1.3,
    },

    scenarioName: {
      color:
        COLORS.text,

      fontSize: 17,

      fontWeight:
        '900',

      marginTop: 2,
    },

    topBarSpacer: {
      width: 44,
    },

    /* HEADER */

    header: {
      width: '100%',
      maxWidth: 650,
      alignSelf:
        'center',

      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

      gap: 12,

      marginBottom: 10,
    },

    label: {
      color:
        COLORS.primary,

      fontSize: 11,

      fontWeight:
        '900',

      letterSpacing:
        1.5,
    },

    title: {
      color:
        COLORS.text,

      fontSize: 28,

      fontWeight:
        '900',

      marginTop: 4,
    },

    subtitle: {
      width: '100%',
      maxWidth: 650,
      alignSelf:
        'center',

      color:
        COLORS.textSecondary,

      fontSize: 14,

      marginBottom: 10,
    },

    /* INICIAR */

    startButton: {
      width: '100%',

      maxWidth: 235,

      backgroundColor:
        COLORS.primary,

      paddingHorizontal: 16,

      paddingVertical: 14,

      borderRadius: 16,

      alignItems:
        'center',

      justifyContent:
        'center',

      marginLeft: 12,
    },

    startButtonDisabled: {
      opacity: 0.45,
    },

    startButtonPressed: {
      opacity: 0.8,

      transform: [
        {
          scale: 0.98,
        },
      ],
    },

    startButtonText: {
      color:
        COLORS.white,

      fontSize: 16,

      fontWeight:
        '900',
    },

    /* GRID */

    gridCard: {
      width: '100%',
      maxWidth: 650,
      alignSelf:
        'center',

      backgroundColor:
        COLORS.surface,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      borderRadius: 20,

      paddingHorizontal: 12,

      paddingVertical: 18,
    },

    gridHeader: {
      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

      marginBottom: 18,
    },

    gridLabel: {
      color:
        COLORS.primary,

      fontSize: 10,

      fontWeight:
        '900',

      letterSpacing:
        1.4,
    },

    gridTitle: {
      color:
        COLORS.text,

      fontSize: 18,

      fontWeight:
        '800',

      marginTop: 3,
    },

    status: {
      flexDirection:
        'row',

      alignItems:
        'center',

      backgroundColor:
        '#EAF6ED',

      paddingHorizontal: 10,

      paddingVertical: 6,

      borderRadius: 20,
    },

    statusError: {
      backgroundColor:
        '#FDECEC',
    },

    statusDot: {
      width: 7,

      height: 7,

      borderRadius: 4,

      backgroundColor:
        COLORS.easy,

      marginRight: 6,
    },

    statusDotError: {
      backgroundColor:
        '#D95C59',
    },

    statusText: {
      color:
        '#477E54',

      fontSize: 11,

      fontWeight:
        '800',
    },

    statusTextError: {
      color:
        '#B64745',
    },

    gridWrapper: {
      alignItems:
        'center',

      overflow:
        'hidden',
    },

    /* ANIMAÇÃO */

    animationCard: {
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

    animationHeader: {
      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      marginBottom: 14,
    },

    animationLabel: {
      color:
        COLORS.primary,

      fontSize: 9,

      fontWeight:
        '900',

      letterSpacing:
        1.3,
    },

    animationTitle: {
      color:
        COLORS.text,

      fontSize: 16,

      fontWeight:
        '800',

      marginTop: 3,
    },

    stepBadge: {
      backgroundColor:
        '#FFF0EC',

      paddingHorizontal: 10,

      paddingVertical: 6,

      borderRadius: 20,
    },

    stepBadgeText: {
      color:
        COLORS.primary,

      fontSize: 11,

      fontWeight:
        '900',
    },

    animationButtons: {
      flexDirection:
        'row',

      gap: 8,
    },

    animationButton: {
      flex: 1,

      backgroundColor:
        COLORS.primary,

      borderRadius: 12,

      paddingVertical: 11,

      paddingHorizontal: 5,

      justifyContent:
        'center',

      alignItems:
        'center',
    },

    animationButtonText: {
      color:
        COLORS.white,

      fontSize: 11,

      fontWeight:
        '800',

      textAlign:
        'center',
    },

    resetButton: {
      backgroundColor:
        COLORS.background,

      borderWidth: 1,

      borderColor:
        COLORS.border,
    },

    resetButtonText: {
      color:
        COLORS.text,

      fontSize: 11,

      fontWeight:
        '800',
    },

    controlDisabled: {
      opacity: 0.35,
    },

    speedTitle: {
      color:
        COLORS.textSecondary,

      fontSize: 11,

      fontWeight:
        '700',

      marginTop: 16,

      marginBottom: 8,
    },

    speedButtons: {
      flexDirection:
        'row',

      gap: 8,
    },

    speedButton: {
      flex: 1,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      backgroundColor:
        COLORS.background,

      borderRadius: 10,

      paddingVertical: 8,

      alignItems:
        'center',
    },

    speedButtonSelected: {
      borderColor:
        COLORS.primary,

      backgroundColor:
        '#FFF0EC',
    },

    speedButtonText: {
      color:
        COLORS.textSecondary,

      fontSize: 11,

      fontWeight:
        '700',
    },

    speedButtonTextSelected: {
      color:
        COLORS.primary,

      fontWeight:
        '900',
    },

    /* FERRAMENTA ATIVA */

    selectedToolCard: {
      width: '100%',
      maxWidth: 650,
      alignSelf:
        'center',

      backgroundColor:
        '#FFF4DC',

      borderRadius: 16,

      padding: 14,

      marginTop: 12,
    },

    selectedToolLabel: {
      color:
        COLORS.primary,

      fontSize: 9,

      fontWeight:
        '900',

      letterSpacing:
        1.2,

      marginBottom: 8,
    },

    selectedToolRow: {
      flexDirection:
        'row',

      alignItems:
        'center',
    },

    selectedToolIcon: {
      width: 42,
      height: 42,

      borderRadius: 12,

      backgroundColor:
        COLORS.primary,

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 12,
    },

    selectedToolSymbol: {
      color:
        COLORS.white,

      fontSize: 18,

      fontWeight:
        '900',
    },

    selectedToolContent: {
      flex: 1,
    },

    selectedToolTitle: {
      color:
        COLORS.text,

      fontSize: 14,

      fontWeight:
        '900',
    },

    selectedToolDescription: {
      color:
        COLORS.textSecondary,

      fontSize: 11,

      marginTop: 3,
    },

    /* LEGENDA */

    legend: {
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

    legendTitle: {
      color:
        COLORS.text,

      fontSize: 14,

      fontWeight:
        '800',

      marginBottom: 12,
    },

    legendRow: {
      flexDirection:
        'row',

      flexWrap:
        'wrap',

      gap: 14,
    },

    legendItem: {
      flexDirection:
        'row',

      alignItems:
        'center',
    },

    legendColor: {
      width: 24,
      height: 24,

      borderRadius: 5,

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 6,
    },

    legendCellText: {
      fontSize: 10,

      fontWeight:
        '900',

      color:
        COLORS.text,
    },

    legendText: {
      color:
        COLORS.textSecondary,

      fontSize: 12,
    },

    /* CONFIGURAÇÕES */

    configurationCard: {
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

      padding: 18,

      marginTop: 16,
    },

    configurationLabel: {
      color:
        COLORS.primary,

      fontSize: 10,

      fontWeight:
        '900',

      letterSpacing:
        1.3,
    },

    configurationTitle: {
      color:
        COLORS.text,

      fontSize: 18,

      fontWeight:
        '800',

      marginTop: 3,

      marginBottom: 16,
    },

    configurationRow: {
      flexDirection:
        'row',

      alignItems:
        'center',
    },

    configurationItem: {
      flex: 1,

      alignItems:
        'center',
    },

    configurationName: {
      color:
        COLORS.textSecondary,

      fontSize: 10,
    },

    configurationValue: {
      color:
        COLORS.text,

      fontSize: 12,

      fontWeight:
        '800',

      marginTop: 4,
    },

    configurationDivider: {
      width: 1,

      height: 32,

      backgroundColor:
        COLORS.border,
    },

    /* RESULTADO */

    resultCard: {
      width: '100%',
      maxWidth: 650,
      alignSelf:
        'center',

      backgroundColor:
        '#EAF6ED',

      borderRadius: 18,

      padding: 18,

      marginTop: 16,
    },

    resultLabel: {
      color:
        '#477E54',

      fontSize: 9,

      fontWeight:
        '900',

      letterSpacing:
        1.3,
    },

    resultTitle: {
      color:
        COLORS.text,

      fontSize: 18,

      fontWeight:
        '900',

      marginTop: 4,
    },

    resultAlgorithm: {
      color:
        COLORS.textSecondary,

      fontSize: 11,

      fontWeight:
        '700',

      marginTop: 4,

      marginBottom: 16,
    },

    resultRow: {
      flexDirection:
        'row',
    },

    resultItem: {
      flex: 1,

      alignItems:
        'center',
    },

    resultItemValue: {
      color:
        COLORS.text,

      fontSize: 20,

      fontWeight:
        '900',
    },

    resultItemLabel: {
      color:
        COLORS.textSecondary,

      fontSize: 10,

      marginTop: 3,
    },

    helpText: {
      width: '100%',
      maxWidth: 650,
      alignSelf:
        'center',

      color:
        COLORS.textSecondary,

      fontSize: 11,

      textAlign:
        'center',

      marginTop: 14,
    },
  });