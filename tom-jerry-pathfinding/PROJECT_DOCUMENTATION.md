# Tom & Jerry Pathfinding Visualizer

O **Tom & Jerry Pathfinding Visualizer** é uma aplicação interativa e didática para observar algoritmos de busca informada em um grid. Tom representa o estado inicial (`START`), Jerry representa o objetivo (`GOAL`) e as paredes representam posições não atravessáveis. O usuário pode escolher um cenário, editar o labirinto, configurar a busca e acompanhar sua execução passo a passo.

O projeto foi construído com React, React Native, Expo, Expo Router e TypeScript. Todo o processamento ocorre localmente: não há backend, banco de dados, autenticação ou serviço externo necessário para executar os algoritmos.

> Documento baseado no código existente em 26 de setembro de 2026. Funcionalidades propostas, mas ausentes do código, aparecem somente na seção de melhorias possíveis.

## 1. Visão geral

A aplicação apresenta um grid 12 × 12 no qual:

- Tom é o ponto de partida da busca;
- Jerry é o destino;
- células vazias podem ser percorridas;
- paredes impedem o movimento;
- estados `OPEN`, `CLOSED` e `PATH` mostram a evolução visual da busca.

O objetivo acadêmico é permitir que o estudante observe a ordem de exploração, compare A* com Busca Gulosa, entenda a influência da heurística e do modelo de movimento e inspecione os valores `G`, `H` e `F` dos nós descobertos.

Dois grids são mantidos no Visualizer. `mazeGrid` é a matriz lógica editável usada pelos algoritmos; `displayGrid` é a cópia visual que recebe temporariamente `OPEN`, `CLOSED` e `PATH`. Essa separação preserva o cenário editado durante a animação.

## 2. Tecnologias

As versões abaixo vêm diretamente de `package.json`.

| Tecnologia | Versão declarada | Uso no projeto |
|---|---:|---|
| React | `19.2.3` | Componentes e estado da interface |
| React Native | `0.86.3` | Componentes visuais multiplataforma |
| Expo | `~57.0.25` | Ambiente de desenvolvimento, execução e exportação |
| Expo Router | `~57.0.23` | Navegação baseada em arquivos |
| TypeScript | `~6.0.3` | Tipagem estática e modelos do domínio |
| React DOM | `19.2.3` | Renderização web |
| React Native Web | `~0.21.0` | Adaptação da interface para navegador |

O manifesto também declara módulos auxiliares do ecossistema Expo, mas o código em `src/` importa diretamente apenas React, React Native e Expo Router. O `app.json` habilita rotas tipadas, React Compiler, orientação retrato e exportação web estática.

## 3. Arquitetura do projeto

Estrutura principal real:

```text
tom-jerry-pathfinding/
├── assets/
│   ├── expo.icon/
│   └── images/
├── example/                 # backup local do starter; ignorado pelo Git
├── src/
│   ├── algorithms/
│   │   ├── aStar.ts
│   │   ├── greedyBestFirst.ts
│   │   ├── heuristics.ts
│   │   └── movements.ts
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── visualizer.tsx
│   ├── components/
│   │   ├── AlgorithmSelector.tsx
│   │   ├── ComparisonPanel.tsx
│   │   ├── EditorToolbar.tsx
│   │   ├── Grid.tsx
│   │   ├── GridCell.tsx
│   │   ├── HeuristicSelector.tsx
│   │   ├── MovementSelector.tsx
│   │   ├── NodeInfo.tsx
│   │   └── ScenarioCard.tsx
│   ├── constants/
│   │   └── colors.ts
│   ├── hooks/
│   │   └── useSearchAnimation.ts
│   ├── mazes/
│   │   ├── basement.ts
│   │   ├── createMaze.ts
│   │   ├── index.ts
│   │   ├── kitchen.ts
│   │   ├── livingRoom.ts
│   │   └── manual.ts
│   └── models/
│       ├── AlgorithmType.ts
│       ├── CellType.ts
│       ├── ComparisonResult.ts
│       ├── EditorMode.ts
│       ├── HeuristicType.ts
│       ├── MovementType.ts
│       ├── Node.ts
│       ├── SearchResult.ts
│       └── SearchStep.ts
├── app.json
├── package.json
├── README.md
└── tsconfig.json
```

Responsabilidades por pasta:

- `src/app/`: telas e configuração do Stack do Expo Router.
- `src/algorithms/`: A*, Busca Gulosa, heurísticas e movimentos permitidos.
- `src/components/`: componentes de apresentação e controles reutilizáveis.
- `src/hooks/`: reprodução temporal do resultado calculado pela busca.
- `src/mazes/`: construção, validação e seleção dos presets.
- `src/models/`: tipos TypeScript do domínio.
- `src/constants/`: paleta visual compartilhada.
- `assets/`: imagens da interface e arquivos de ícone/splash.
- `example/`: material remanescente do starter Expo; não compõe a aplicação principal e está em `.gitignore`.

O alias `@/*`, configurado em `tsconfig.json`, aponta para `./src/*`.

## 4. Fluxo da aplicação

```text
Home (`/`)
  ↓ escolha de um cenário
router.push({ pathname: '/visualizer', params: { scenario } })
  ↓
Visualizer (`/visualizer`)
  ↓ carrega preset e permite edição/configuração
A* ou Busca Gulosa
  ↓ produz SearchResult completo
useSearchAnimation
  ↓ reproduz SearchStep e depois PATH
Resultado / NodeInfo / comparação opcional
```

`src/app/_layout.tsx` cria um `Stack` sem cabeçalho nativo. A Home usa `useRouter()` e envia o nome do cenário como parâmetro. O Visualizer obtém esse valor por `useLocalSearchParams`, chama `createMazeForScenario(scenario)` e oferece um botão próprio para voltar com `router.back()`.

## 5. Tela inicial

`src/app/index.tsx` implementa a Home dentro de `SafeAreaView` e `ScrollView`. O hero contém `tomjerry.png`, o nome do projeto, uma descrição e indicadores de Tom/início e Jerry/objetivo. A área de cenários usa `ScenarioCard`, com ícone, título, descrição, cor e badge de dificuldade.

Os quatro cards existentes são:

| Cenário | Badge na Home | Descrição visual |
|---|---|---|
| Cozinha | Fácil | Poucos obstáculos e introdução aos algoritmos |
| Sala | Médio | Mais corredores e possibilidades de caminho |
| Porão | Difícil | Becos e caminhos enganosos |
| Manual | Personalizado | Edição livre a partir de um grid sem paredes |

Os cards preservam a navegação atual; nenhum cenário é calculado na Home. O layout usa largura total com limites de `650` ou `720` pixels, margens laterais e conteúdo rolável, o que permite adaptação entre telas móveis e web.

## 6. Cenários e presets

Todos os presets são construídos por `createMazeGrid()` com `MAZE_ROWS = 12` e `MAZE_COLS = 12`. As coordenadas armazenadas no código usam índice iniciado em zero; portanto, `[1, 1]` aparece visualmente como linha 2, coluna 2.

| Cenário | START | GOAL | Paredes | Característica observada |
|---|---:|---:|---:|---|
| Cozinha | `[1, 1]` | `[10, 10]` | 9 | Três pequenas barreiras separadas; cenário mais aberto |
| Sala | `[1, 1]` | `[10, 10]` | 20 | Barreiras distribuídas que formam desvios intermediários |
| Porão | `[1, 1]` | `[10, 10]` | 43 | Três grandes barreiras verticais com aberturas e paredes adicionais, formando corredores |
| Manual | `[1, 1]` | `[10, 10]` | 0 | Matriz livre para edição |

`createMazeGrid()` cria uma nova matriz com `Array.from` a cada chamada. Também valida que coordenadas são inteiras e internas ao grid, que START e GOAL são diferentes, que paredes não ocupam os endpoints e que não há paredes duplicadas.

`createMazeForScenario()` normaliza espaços, caixa e acentos em português. `Cozinha`, `Sala`, `Porão` e `Manual` selecionam suas respectivas fábricas; um nome ausente ou desconhecido usa o preset Manual.

Todos os presets continuam editáveis. Os controles têm semânticas diferentes:

- **Reiniciar**: interrompe/limpa a busca, remove os estados visuais e restaura `displayGrid` a partir do `mazeGrid` já editado.
- **Restaurar cenário**: chama novamente a fábrica do preset, descartando alterações em Tom, Jerry e paredes. Algoritmo, heurística, movimento e velocidade selecionados não são redefinidos.

## 7. Estados das células

`src/models/CellType.ts` define sete estados:

| Estado | Significado | Representação atual |
|---|---|---|
| `EMPTY` | Célula livre não marcada | Branco `#FFFFFF` |
| `WALL` | Obstáculo não atravessável | Cinza escuro `#3F4145` |
| `START` | Posição de Tom | Fundo azul-claro `#DCEEFF` e `tom.png` |
| `GOAL` | Posição de Jerry | Fundo rosa-claro `#FFE1DC` e `jerry.png` |
| `OPEN` | Nó descoberto e disponível para análise | Amarelo `#FFD966` |
| `CLOSED` | Nó retirado de OPEN e analisado | Azul `#76A9EA` |
| `PATH` | Célula intermediária do caminho final | Verde `#78C98A` |

As linhas internas usam `#D8D0C4`; o contorno externo do grid usa a cor de parede. `Grid` percorre a matriz por linha e coluna, enquanto cada `GridCell` resolve cor, imagem e rótulo acessível a partir de seu tipo.

## 8. Editor do labirinto

`EditorToolbar` expõe quatro modos definidos por `EditorMode`:

- `START` — posicionar Tom;
- `GOAL` — posicionar Jerry;
- `WALL` — criar ou remover parede;
- `ERASE` — deixar a célula vazia.

O modo inicial é `WALL`. O clique em uma célula segue estas regras reais:

1. Se houver um `SearchStep` já visível para a posição, o clique seleciona o nó para o `NodeInfo` em vez de editar.
2. Durante uma animação, células ainda não analisadas não podem ser editadas; é exibida uma mensagem.
3. Parede alterna entre `WALL` e `EMPTY`, mas não pode substituir START ou GOAL.
4. Tom não pode ser colocado sobre Jerry ou parede. Ao posicioná-lo, qualquer START anterior é removido, garantindo no máximo um START.
5. Jerry segue a regra simétrica, garantindo no máximo um GOAL.
6. Apagar converte qualquer célula em `EMPTY`, inclusive START ou GOAL. Nesse caso, uma busca posterior solicita que o endpoint removido seja reposicionado.

Uma edição válida atualiza tanto `mazeGrid` quanto `displayGrid`, limpa seleção e comparação e invalida o resultado anterior. A edição ocorre por toque/clique individual; não há edição por arraste.

## 9. Modelo de nó

`src/models/Node.ts` define a interface `SearchNode`:

| Campo | Tipo | Função |
|---|---|---|
| `row` | `number` | Índice de linha no grid |
| `col` | `number` | Índice de coluna no grid |
| `g` | `number` | Custo real acumulado desde Tom |
| `h` | `number` | Estimativa heurística do nó até Jerry |
| `f` | `number` | Soma `G + H` |
| `parent` | posição ou `null` | Coordenada do predecessor usada para reconstruir o caminho |

Conceitualmente:

```text
G = custo acumulado desde START
H = estimativa de custo até GOAL
F = G + H
```

O nó inicial recebe `g = 0`, `h` calculado para sua posição, `f = h` e `parent = null`.

## 10. Algoritmo A*

`src/algorithms/aStar.ts` implementa A* com uma lista aberta em array, um `Set` de posições fechadas e um `Map` da melhor versão conhecida de cada nó.

Fluxo real:

1. Localiza START e GOAL. Se algum não existir, retorna um resultado vazio.
2. Calcula `H` do início, cria o nó inicial e registra um evento `OPENED`.
3. Ordena `openList` pelo menor `F`; empates usam o menor `H`.
4. Remove o primeiro nó. Entradas antigas que deixaram de ser a melhor versão no `nodeMap` são ignoradas.
5. Se ainda não estiver fechado, inclui o nó em `closedSet`, `visitedNodes` e registra `CLOSED`.
6. Se o nó for GOAL, segue os pais até START, inverte essa sequência e retorna o caminho.
7. Caso contrário, gera os movimentos configurados, rejeita posições externas, paredes, diagonais inválidas e vizinhos já fechados.
8. Para cada vizinho, calcula `tentativeG = current.g + movement.cost`. Se o caminho conhecido for melhor ou igual, ignora a atualização.
9. Em uma melhoria, recalcula `H`, define `F = G + H`, atualiza o pai, salva a nova versão, insere-a em OPEN e registra `OPENED`.
10. Se OPEN esvaziar, retorna `found: false`, caminho vazio e custo total zero, preservando eventos e visitados produzidos.

Pseudocódigo simplificado:

```text
inserir START em OPEN
registrar START como OPENED

enquanto OPEN não estiver vazia:
    ordenar por menor F e, em empate, menor H
    retirar o melhor nó válido
    marcar como CLOSED e registrar visita

    se for GOAL:
        reconstruir caminho seguindo parent
        retornar sucesso

    para cada vizinho permitido:
        calcular G provisório
        se for melhor que o G conhecido:
            calcular H e F
            registrar parent
            inserir nova versão em OPEN

retornar sem caminho
```

A implementação ordena o array inteiro a cada iteração; isso é simples e adequado ao grid didático de 144 células, embora não use uma fila de prioridade especializada.

## 11. Busca Gulosa

`src/algorithms/greedyBestFirst.ts` compartilha a estrutura geral do A*, mas sua prioridade é exclusivamente heurística:

```text
A*:     prioridade = F = G + H
Guloso: prioridade = H
```

OPEN é ordenada pelo menor `H`; em empate, o menor `G` mantém um resultado determinístico. `G` e `F` continuam sendo calculados para custo final, eventos da animação e inspeção no `NodeInfo`.

Diferentemente do A*, quando uma posição já existe em `nodeMap`, a Busca Gulosa não atualiza seu custo nem seu pai. A primeira descoberta é preservada. O caminho retornado é válido segundo os movimentos usados, mas não há garantia de custo mínimo.

Pseudocódigo:

```text
inserir START em OPEN
registrar START como OPENED

enquanto OPEN não estiver vazia:
    ordenar por menor H e, em empate, menor G
    retirar o melhor nó válido
    marcar como CLOSED e registrar visita

    se for GOAL:
        reconstruir caminho seguindo parent
        retornar sucesso

    para cada vizinho permitido ainda desconhecido:
        calcular G, H e F
        registrar parent
        inserir em OPEN

retornar sem caminho
```

## 12. Heurísticas

`HeuristicType` admite `MANHATTAN`, `EUCLIDEAN` e `DIAGONAL`. `calculateHeuristic()` centraliza a seleção.

### Manhattan

```text
H = (|linha1 - linha2| + |coluna1 - coluna2|) × 10
```

O fator 10 coloca a estimativa na mesma escala do custo dos movimentos ortogonais.

### Euclidiana

```text
dx = |linha1 - linha2|
dy = |coluna1 - coluna2|
H = floor(sqrt(dx² + dy²) × 10)
```

A implementação usa `Math.sqrt`, multiplica por 10 e aplica `Math.floor`.

### Diagonal

```text
menor = min(dx, dy)
maior = max(dx, dy)
H = 14 × menor + 10 × (maior - menor)
```

Essa fórmula combina o custo 14 para a parte diagonal e 10 para o deslocamento reto restante.

Heurística e movimento são seleções independentes na interface. Qualquer heurística pode ser combinada com quatro ou oito direções; escolher “Diagonal” não ativa diagonais automaticamente.

## 13. Movimento

`src/algorithms/movements.ts` define objetos com deslocamento de linha, deslocamento de coluna, custo e indicador `diagonal`.

### Quatro direções

```text
↑  (-1,  0) custo 10
↓  ( 1,  0) custo 10
←  ( 0, -1) custo 10
→  ( 0,  1) custo 10
```

### Oito direções

Inclui os quatro movimentos anteriores e:

```text
↖  (-1, -1) custo 14
↗  (-1,  1) custo 14
↙  ( 1, -1) custo 14
↘  ( 1,  1) custo 14
```

`getMovements('EIGHT_DIRECTIONS')` retorna as oito opções. Qualquer outro valor válido do tipo resulta no conjunto de quatro direções.

## 14. Regra de corte de cantos

`canMoveDiagonally()` permite movimentos ortogonais sem verificação adicional. Em uma diagonal, obtém as duas células laterais entre origem e destino:

- célula vertical: `grid[currentRow + movement.row][currentCol]`;
- célula horizontal: `grid[currentRow][currentCol + movement.col]`.

A diagonal só é aceita quando **ambas existem e nenhuma é `WALL`**. Portanto, uma única parede lateral já bloqueia o movimento.

```text
T █
· X
```

Tom não alcança `X` diagonalmente porque a célula horizontal é parede. Também seria bloqueado se a célula vertical fosse parede:

```text
T ·
█ X
```

Com duas paredes, o bloqueio é igualmente garantido:

```text
T █
█ X
```

## 15. SearchResult e SearchStep

`SearchResult` representa a execução já calculada:

| Campo | Conteúdo |
|---|---|
| `found` | Indica se GOAL foi alcançado |
| `path` | Nós de Tom até Jerry, inclusive |
| `visitedNodes` | Nós efetivamente retirados de OPEN e analisados |
| `steps` | Eventos cronológicos usados pela animação |
| `totalCost` | `G` do nó objetivo; zero quando não há caminho |

`SearchStep` é um evento visual com `row`, `col`, `g`, `h`, `f`, `type` e coordenadas opcionais do pai (`parentRow` e `parentCol`). Os tipos atuais são:

- `OPENED`: uma posição foi descoberta/adicionada à lista aberta;
- `CLOSED`: uma posição foi escolhida para análise e fechada.

O pai está presente nos passos gerados a partir de vizinhos e nos fechamentos de nós não iniciais. A interface atual não exibe `parentRow` nem `parentCol`.

## 16. Sistema de animação

Os algoritmos não aguardam entre operações: eles calculam todo o `SearchResult` de forma síncrona. Depois, `useSearchAnimation` reproduz `result.steps` sobre uma cópia do grid.

```text
SearchResult.steps
        ↓
useSearchAnimation
        ↓
OPEN / CLOSED, um evento por intervalo
        ↓
PATH completo ao término
```

API do hook:

| Membro | Comportamento |
|---|---|
| `start(result, baseGrid)` | Armazena o resultado, clona o grid, zera o índice e inicia |
| `pause()` | Pausa se a animação estiver ativa |
| `resume()` | Retoma se ainda estiver ativa |
| `nextStep()` | Pausa automaticamente e aplica um evento; após os eventos, finaliza |
| `reset()` | Limpa resultado interno, grid de trabalho e flags |
| `speed` / `setSpeed` | Intervalo em milissegundos e seu setter |
| `currentStep` | Índice do próximo evento a aplicar |
| `totalSteps` | Quantidade de eventos do resultado corrente |
| `isRunning` | Execução ainda ativa, mesmo se pausada |
| `isPaused` | Reprodução automática suspensa |
| `isFinished` | Eventos concluídos e PATH aplicado |

A reprodução automática usa `setTimeout`. As opções visíveis são lento (`600 ms`), normal (`250 ms`, padrão) e rápido (`80 ms`). Os botões de velocidade continuam disponíveis durante a busca.

`applyStep()` não substitui START, GOAL ou WALL. `finishAnimation()` percorre o caminho final e marca apenas as células intermediárias como PATH; depois atualiza as flags e chama `onFinish`, que define o status como “Concluído” ou “Sem caminho”.

## 17. Visualização OPEN, CLOSED e PATH

Quando um evento `OPENED` é reproduzido, uma célula comum se torna `OPEN` (`#FFD966`). Quando o evento `CLOSED` da mesma posição chega, ela se torna `CLOSED` (`#76A9EA`). Como o passo mais recente prevalece, um nó aberto e posteriormente analisado termina azul.

Depois de todos os eventos, o caminho retornado é desenhado em `PATH` (`#78C98A`). START e GOAL permanecem com as imagens de Tom e Jerry porque tanto `applyStep()` quanto `finishAnimation()` os preservam explicitamente. Paredes também não são sobrescritas pelos eventos.

Os status textuais do mapa são “Editável”, “Buscando”, “Concluído” e “Sem caminho”.

## 18. NodeInfo

`NodeInfo` começa no estado “Nenhum nó selecionado”. Ao tocar em uma posição, `findVisibleStep()` busca do evento visível mais recente para o mais antigo. Durante a execução, somente índices anteriores a `currentStep` podem ser consultados; após o término, todos os passos ficam disponíveis.

O painel mostra:

- linha e coluna em numeração iniciada em 1;
- nome e badge do estado visual atual;
- `G` — custo percorrido;
- `H` — estimativa até Jerry;
- `F` — `G + H`.

Apesar de `SearchStep` poder carregar o pai, o painel não o apresenta. O clique em uma célula com passo visível tem prioridade sobre a edição do labirinto.

## 19. Seleção de algoritmo

`AlgorithmSelector` oferece:

- **A\*** — “F = G + H”;
- **Guloso** — “Prioridade = H”.

A opção inicial é A*. O seletor recebe `disabled={animation.isRunning}`, portanto não pode ser alterado enquanto a animação está ativa, inclusive quando pausada. Uma troca chama `handleResetSearch()`, limpando a execução visual anterior sem modificar o labirinto.

## 20. Seleção de heurística

`HeuristicSelector` apresenta Manhattan, Euclidiana e Diagonal, além de uma explicação da opção ativa. A escolha altera o cálculo de `H` passado ao algoritmo.

O padrão é Manhattan. O seletor é bloqueado durante a animação; uma mudança reinicia somente a execução e remove uma comparação anterior, preservando Tom, Jerry e paredes.

## 21. Seleção de movimento

`MovementSelector` apresenta quatro direções e oito direções com descrições de custos. O padrão é quatro direções. Como nos demais seletores, a alteração é bloqueada durante a animação e limpa resultado visual e comparação sem desfazer o mapa editado.

## 22. Comparação entre A* e Busca Gulosa

O botão **Comparar A* × Guloso** funciona quando não há animação ativa e START/GOAL existem. O handler:

1. clona `mazeGrid` para A*;
2. executa A* com heurística e movimento atuais;
3. clona novamente o mesmo `mazeGrid` para a Busca Gulosa;
4. executa a busca com a mesma configuração;
5. armazena ambos em `ComparisonResult`.

Os algoritmos apenas leem o grid, e a comparação não chama o hook de animação nem modifica `displayGrid`. O painel apresenta:

| Métrica | Cálculo |
|---|---|
| Status | “Encontrado” ou “Sem caminho” |
| Visitados | `visitedNodes.length` |
| Custo | `totalCost` |
| Passos | `path.length - 1` quando encontrado; zero caso contrário |

Não existe declaração automática de vencedor. As métricas permitem interpretar exploração e custo, que podem favorecer aspectos diferentes.

## 23. Resultados e métricas

O card de resultado principal aparece somente quando há `searchResult` e `animation.isFinished` é verdadeiro. Ele mostra:

- “Jerry encontrado!” ou “Sem caminho”;
- algoritmo usado (`A*` ou `Guloso`);
- heurística;
- movimento;
- número de visitados;
- custo total;
- quantidade de passos (`path.length - 1`, ou zero sem caminho).

O resultado é calculado antes da animação, mas só é revelado ao final da reprodução.

## 24. Fluxo completo de execução

1. O usuário escolhe Cozinha, Sala, Porão ou Manual.
2. A Home envia `scenario` para `/visualizer`.
3. O Visualizer cria `mazeGrid` e `displayGrid` independentes a partir do preset.
4. O usuário pode editar Tom, Jerry e paredes.
5. Seleciona A* ou Busca Gulosa.
6. Seleciona Manhattan, Euclidiana ou Diagonal.
7. Seleciona movimento em quatro ou oito direções.
8. Ao iniciar, a tela valida a existência de START e GOAL.
9. O algoritmo escolhido calcula `SearchResult` completo.
10. `useSearchAnimation.start()` recebe o resultado e uma cópia do labirinto lógico.
11. Eventos `OPENED` e `CLOSED` são reproduzidos na velocidade selecionada.
12. Depois dos eventos, as células intermediárias do caminho se tornam PATH.
13. O card de resultado aparece.
14. O usuário pode tocar em nós com eventos já visíveis para consultar `G`, `H` e `F`.
15. Opcionalmente, pode executar a comparação não animada sobre o mesmo mapa.

## 25. Identidade visual e assets

Imagens temáticas efetivamente usadas pela interface:

| Asset | Dimensões | Uso atual |
|---|---:|---|
| `assets/images/tomjerry.png` | 1448 × 921 | Hero da Home e ilustração do cabeçalho do Visualizer |
| `assets/images/tom.png` | 1374 × 1145 | START no grid e miniatura de Tom na legenda |
| `assets/images/jerry.png` | 1448 × 1086 | GOAL no grid e miniatura de Jerry na legenda |

O `app.json` também usa `icon.png`, os três assets de ícone adaptativo Android, `favicon.png` e `splash-icon.png` para configuração da aplicação. Logos do React/Expo, badges, ícones de tabs, `logo-glow.png` e `tutorial-web.png` existem em `assets/images/`, mas não são usados pelas telas atuais em `src/`.

A paleta centralizada em `colors.ts` usa fundo quente (`#F8F2E7`), superfície clara (`#FFFDF9`), primária coral (`#DE583D`) e cores didaticamente distintas para os estados de busca.

## 26. Responsividade e acessibilidade

Recursos existentes:

- telas dentro de `SafeAreaView` e conteúdo vertical rolável;
- cards com `width: '100%'` e larguras máximas para web;
- `useWindowDimensions()` no Visualizer;
- célula calculada por `min(max(floor((width - 68) / 12), 1), 40)`;
- cabeçalho muda para coluna abaixo de 520 px;
- arte do cabeçalho é omitida abaixo de 360 px;
- títulos longos do cenário usam uma linha no cabeçalho;
- cards de cenário, botão voltar, iniciar e restaurar possuem papel/rótulo acessível explícito;
- cada célula do grid é um botão com rótulo correspondente ao estado;
- imagens internas de Tom/Jerry nas células são marcadas como não acessíveis para evitar anúncio duplicado.

Outros `Pressable`, como seletores, toolbar e controles de animação, têm texto visível e estado `disabled`, mas nem todos possuem `accessibilityRole` ou `accessibilityLabel` explícitos. Não há evidência de auditoria WCAG, teste com leitor de tela ou garantia formal de conformidade.

## 27. Principais componentes

| Componente | Responsabilidade |
|---|---|
| `ScenarioCard` | Apresentar cenário, dificuldade e ação de navegação |
| `Grid` | Percorrer e renderizar a matriz de células |
| `GridCell` | Exibir cor/imagem por estado e encaminhar o clique |
| `EditorToolbar` | Selecionar Tom, Jerry, Parede ou Apagar |
| `AlgorithmSelector` | Escolher A* ou Guloso |
| `HeuristicSelector` | Escolher a função de estimativa |
| `MovementSelector` | Escolher quatro ou oito direções |
| `NodeInfo` | Mostrar posição, estado e valores G/H/F |
| `ComparisonPanel` | Comparar status, visitados, custo e passos |

O card de animação, a legenda, o resumo de configuração e o card de resultado permanecem implementados diretamente em `visualizer.tsx`.

## 28. Principais modelos

| Modelo | Função |
|---|---|
| `CellType` | União dos sete estados possíveis de uma célula |
| `SearchNode` | Nó com posição, custos e predecessor |
| `SearchStep` / `SearchStepType` | Evento `OPENED` ou `CLOSED` da animação |
| `SearchResult` | Resultado completo de uma execução |
| `ComparisonResult` | Par de resultados A* e Guloso |
| `AlgorithmType` | `ASTAR` ou `GREEDY` |
| `HeuristicType` | Manhattan, Euclidiana ou Diagonal |
| `MovementType` | Quatro ou oito direções |
| `EditorMode` | START, GOAL, WALL ou ERASE |

## 29. Como instalar

Pré-requisitos práticos:

- Node.js compatível com o ecossistema Expo 57;
- npm;
- navegador, dispositivo ou emulador conforme o alvo desejado.

Na raiz do projeto:

```bash
npm install
```

O projeto possui `package-lock.json`, portanto o fluxo documentado usa npm.

## 30. Como executar

Servidor de desenvolvimento:

```bash
npx expo start
```

Scripts equivalentes presentes em `package.json`:

```bash
npm run start
npm run web
npm run android
npm run ios
```

O terminal do Expo oferece opções para navegador, Android, iOS e Expo Go conforme o ambiente local. A configuração declara orientação retrato, web estática e não contém pastas nativas `android/` ou `ios/`; essas pastas são geradas pelo fluxo Expo quando necessário.

## 31. Validação e estado técnico

Comando TypeScript definido para verificação manual:

```bash
npx tsc --noEmit
```

No estado analisado, esse comando global falha porque `tsconfig.json` inclui `**/*.ts` e `**/*.tsx`, alcançando `example/`. Os erros são imports e rotas do starter, não do app principal. Uma validação equivalente restrita a `src/**/*.ts` e `src/**/*.tsx` foi executada e passou sem erros.

O script de lint declarado é:

```bash
npm run lint
```

Entretanto, `package.json` não declara ESLint nem `eslint-config-expo`, e não há configuração ESLint versionada. Com o preset Expo disponível no ambiente de análise, `src/` apresentou um erro da regra `react-hooks/refs` em `useSearchAnimation.ts`: a expressão que deriva `totalSteps` acessa `resultRef.current` durante a renderização. O código não foi alterado.

Para verificar whitespace antes de uma entrega:

```bash
git diff --check
```

Não há script de testes e não foram encontrados arquivos `test` ou `spec` no projeto.

## 32. Limitações conhecidas

- Não há persistência: edições e configurações se perdem ao encerrar/recarregar a aplicação.
- Não há backend, sincronização, contas ou armazenamento de cenários.
- Não existem testes automatizados para algoritmos, hook ou componentes.
- A validação TypeScript global inclui o backup ignorado `example/` e falha por problemas desse diretório; `src/` isolado passa.
- O lint com preset Expo aponta acesso a ref durante render em `useSearchAnimation.ts`, na obtenção de `totalSteps`.
- O lint não está configurado de forma reprodutível no manifesto atual: dependências/configuração do ESLint não estão versionadas.
- `npm run reset-project` referencia `./scripts/reset-project.js`, mas esse arquivo não existe na raiz. A única cópia observada está em `example/scripts/`, fora do fluxo principal.
- `NodeInfo` não mostra as coordenadas do pai, embora `SearchStep` possa armazená-las.
- A edição é célula a célula; não há desenho contínuo por arraste.
- O README ainda lista “usar sprites de Tom e Jerry dentro do grid” como próximo passo, embora `GridCell.tsx` já use `tom.png` e `jerry.png`.
- Somente A* e Busca Gulosa estão disponíveis; não há BFS, Dijkstra ou DFS.

Essas limitações descrevem o estado observado e não implicam que escolhas como processamento local ou grid fixo sejam defeitos.

## 33. Próximas melhorias possíveis

Ideias ainda ausentes, não requisitos obrigatórios:

- adicionar testes unitários para heurísticas, movimentos, corte de cantos e reconstrução de caminho;
- adicionar testes de integração para editor, animação e comparação;
- excluir formalmente `example/` do `tsconfig` ou removê-lo do ambiente de validação;
- versionar a configuração de lint e suas dependências;
- persistir ou salvar labirintos localmente;
- importar/exportar cenários;
- adicionar outros algoritmos de busca;
- exibir o pai no `NodeInfo` ou uma trilha visual de predecessores;
- oferecer mais métricas, como tempo de cálculo e tamanho máximo de OPEN;
- adicionar tutorial interativo e controles de acessibilidade mais completos;
- permitir edição por arraste em plataformas compatíveis.

## 34. Decisões importantes de arquitetura

- **Algoritmo separado da interface:** A* e Guloso recebem uma matriz e devolvem dados puros de resultado; não renderizam nem temporizam a execução.
- **Animação posterior ao cálculo:** `useSearchAnimation` consome eventos já produzidos, permitindo os mesmos controles para ambos os algoritmos.
- **Grid lógico e visual separados:** estados transitórios não contaminam o mapa usado em novas buscas.
- **Domínio tipado:** células, nós, resultados, configurações e editor têm tipos dedicados.
- **Heurísticas e movimentos centralizados:** os dois algoritmos compartilham exatamente as mesmas funções.
- **Presets como fábricas:** cada solicitação produz uma matriz independente validada.
- **Componentização da interface:** grid, célula, seletores, toolbar, informações e comparação são reutilizáveis.
- **Processamento local:** o fluxo não depende de rede ou servidor.
- **Navegação por arquivos:** a Home e o Visualizer correspondem diretamente às rotas em `src/app/`.

## 35. Exemplo conceitual

Configuração hipotética, sem métricas inventadas:

```text
Tom       → START
Jerry     → GOAL
Algoritmo → A*
Heurística→ Manhattan
Movimento → 4 direções
```

Ao expandir o grid, `G` cresce em 10 por movimento ortogonal. `H` estima a distância restante por Manhattan, também na escala de 10. `F = G + H`, e o A* escolhe o menor F, usando H no desempate.

Na mesma configuração, a Busca Gulosa escolheria principalmente o menor H. Ela tende a avançar na direção que parece mais próxima de Jerry, sem usar G como parte da prioridade; por isso pode explorar menos nós em certos mapas, mas também pode produzir um caminho mais caro.

## 36. Diagrama textual da arquitetura

```text
Home (`index.tsx`)
 │
 │ scenario
 ▼
Visualizer (`visualizer.tsx`)
 │
 ├── Maze factory (`src/mazes`)
 ├── EditorToolbar ───────────────┐
 ├── AlgorithmSelector            │ atualizam estado/configuração
 ├── HeuristicSelector            │
 └── MovementSelector ────────────┘
 │
 ├──────────────┬─────────────────┐
 ▼              ▼                 ▼
A*          Busca Gulosa      Comparação direta
 └──────────────┬─────────────────┘
                ▼
          SearchResult
                │
                ▼
      useSearchAnimation
                │
      ┌─────────┼─────────┐
      ▼         ▼         ▼
     OPEN     CLOSED     PATH
                │
                ▼
        Grid / GridCell
                │
        ┌───────┴────────┐
        ▼                ▼
     NodeInfo        Resultado
```

## 37. Diagrama do fluxo A*

```text
START
  │
  ▼
inserir em OPEN e registrar OPENED
  │
  ▼
ordenar por menor F (empate: menor H)
  │
  ▼
retirar melhor versão válida
  │
  ▼
marcar CLOSED e registrar visita
  │
  ▼
é GOAL?
  ├── sim ──► seguir parents ──► inverter ──► PATH
  │
  └── não
       │
       ▼
  gerar vizinhos permitidos
       │
       ▼
  calcular G provisório
       │
       ▼
  caminho é melhor?
       ├── não ──► ignorar
       └── sim ──► calcular H/F, salvar parent e inserir em OPEN
```

## 38. Diagrama da Busca Gulosa

```text
START
  │
  ▼
inserir em OPEN e registrar OPENED
  │
  ▼
ordenar por menor H (empate: menor G)
  │
  ▼
retirar melhor nó conhecido
  │
  ▼
marcar CLOSED e registrar visita
  │
  ▼
é GOAL?
  ├── sim ──► seguir parents ──► inverter ──► PATH
  │
  └── não
       │
       ▼
  gerar vizinhos permitidos ainda desconhecidos
       │
       ▼
  calcular G, H e F
       │
       ▼
  salvar parent e inserir em OPEN
```

## 39. Estado atual resumido

O fluxo principal está implementado: seleção de quatro cenários, edição do grid, A*, Busca Gulosa, três heurísticas, movimentos em quatro/oito direções, bloqueio de corte de cantos, animação controlável, inspeção G/H/F, resultado e comparação. A interface usa assets locais de Tom e Jerry e funciona sem backend.

O código principal em `src/` passa na checagem TypeScript isolada e foi exportado para web com sucesso na validação anterior do estado atual. As pendências técnicas observadas concentram-se em testes ausentes, configuração de lint, inclusão de `example/` na checagem global, o alerta de refs no hook e o script `reset-project` sem alvo na raiz.

### Arquivos de referência desta documentação

- configuração: `package.json`, `tsconfig.json`, `app.json`, `.gitignore`, `README.md`;
- rotas: `src/app/_layout.tsx`, `src/app/index.tsx`, `src/app/visualizer.tsx`;
- algoritmos: todos os arquivos em `src/algorithms/`;
- animação: `src/hooks/useSearchAnimation.ts`;
- presets: todos os arquivos em `src/mazes/`;
- componentes: todos os arquivos em `src/components/`;
- domínio: todos os arquivos em `src/models/`;
- visual: `src/constants/colors.ts` e usos de `assets/images/`;
- referência separada: conteúdo local de `example/`.
