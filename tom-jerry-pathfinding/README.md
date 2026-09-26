# Tom & Jerry Pathfinding Visualizer

Visualizador interativo de algoritmos de busca de caminho em que Tom representa o ponto inicial e Jerry representa o objetivo. A aplicação permite editar um labirinto e acompanhar, passo a passo, como diferentes estratégias exploram o grid até encontrar um caminho.

## Sobre o projeto

O projeto foi desenvolvido com React Native, Expo e TypeScript, com navegação baseada em arquivos por meio do Expo Router. Toda a execução acontece localmente no dispositivo ou navegador: não há backend, banco de dados ou autenticação.

A proposta é educacional e busca tornar conceitos de busca informada mais fáceis de observar por meio de cores, animações, custos e estados dos nós.

## Objetivo

O objetivo é demonstrar visualmente como algoritmos de busca percorrem um labirinto:

- Tom representa o estado inicial **START**.
- Jerry representa o objetivo **GOAL**.
- Paredes representam posições que não podem ser atravessadas.
- O algoritmo explora o grid até encontrar Jerry ou concluir que não existe caminho.

O usuário pode escolher movimentos em quatro direções (cima, baixo, esquerda e direita) ou em oito direções, que também incluem as quatro diagonais. Movimentos retos custam 10 e movimentos diagonais custam 14.

## Funcionalidades implementadas

- Grid editável de 12 × 12 células.
- Posicionamento e reposicionamento de Tom.
- Posicionamento e reposicionamento de Jerry.
- Criação e remoção de paredes.
- Ferramenta para apagar células.
- Algoritmo A*.
- Busca Gulosa (Greedy Best-First Search).
- Seleção entre A* e Busca Gulosa.
- Comparação entre A* e Busca Gulosa no mesmo mapa e sob a mesma configuração.
- Seleção das heurísticas Manhattan, Euclidiana e Diagonal.
- Seleção entre movimento em quatro ou oito direções.
- Prevenção de movimentos diagonais que cortariam cantos bloqueados por paredes.
- Visualização da lista aberta (**OPEN**) em amarelo.
- Visualização dos nós fechados/visitados (**CLOSED**) em azul.
- Visualização do caminho final (**PATH**) em verde.
- Animação passo a passo da execução.
- Controles para pausar, continuar, avançar um passo e reiniciar.
- Controle de velocidade: lento, normal e rápido.
- Inspeção de linha, coluna, estado e valores G, H e F dos nós analisados.
- Resultado com algoritmo, heurística, quantidade de nós visitados, custo e passos.
- Tela inicial com presets reais para Cozinha, Sala, Porão e Manual.
- Restauração do preset original sem alterar algoritmo, heurística, movimento ou velocidade selecionados.

## Cenários

- **Cozinha:** cenário fácil, com poucas paredes e rotas mais diretas.
- **Sala:** cenário intermediário, com barreiras que exigem desvios.
- **Porão:** cenário difícil, organizado como um labirinto em corredores.
- **Manual:** grid livre, com Tom e Jerry posicionados e sem paredes iniciais.

Todos os cenários continuam editáveis. O botão **Reiniciar** limpa somente a busca e preserva as edições atuais; **Restaurar cenário** recupera Tom, Jerry e as paredes originais do preset escolhido.

## Algoritmos

### A*

O A* prioriza o nó com menor custo total estimado:

```text
F = G + H
```

Onde:

- **G** é o custo percorrido desde Tom.
- **H** é a estimativa de custo até Jerry.
- **F** é o custo total estimado do caminho que passa pelo nó.

### Busca Gulosa

A Busca Gulosa prioriza o nó com menor valor de **H**, escolhendo primeiro as posições que parecem estar mais próximas de Jerry. Os valores G e F também são calculados para permitir a inspeção dos nós na interface, mas não determinam a prioridade principal dessa busca.

### Comparação

O botão **Comparar A* × Guloso** executa os dois algoritmos sobre o labirinto atual, usando a mesma heurística e o mesmo tipo de movimento. O painel compara status, nós visitados, custo total e passos do caminho sem alterar ou animar o grid.

## Heurísticas

### Manhattan

Soma as distâncias horizontal e vertical entre o nó atual e Jerry. É especialmente adequada ao movimento em quatro direções.

### Euclidiana

Estima a distância em linha reta entre o nó atual e Jerry.

### Diagonal

Estima a distância considerando a relação entre deslocamentos retos e diagonais, com custos aproximados de 10 e 14.

A heurística e o tipo de movimento são configurações independentes. Escolher a heurística Diagonal não ativa automaticamente oito direções, e qualquer heurística pode ser experimentada com quatro ou oito direções.

## Estados das células

| Estado | Descrição |
| --- | --- |
| **EMPTY** | Célula livre e ainda não explorada. |
| **WALL** | Parede que não pode ser atravessada. |
| **START** | Posição inicial de Tom. |
| **GOAL** | Posição objetivo de Jerry. |
| **OPEN** | Nó descoberto e disponível para análise. |
| **CLOSED** | Nó retirado da lista aberta e analisado. |
| **PATH** | Célula pertencente ao caminho final encontrado. |

## Estrutura do projeto

```text
tom-jerry-pathfinding/
├── assets/
│   └── images/
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
│       ├── HeuristicType.ts
│       ├── MovementType.ts
│       ├── Node.ts
│       ├── SearchResult.ts
│       └── SearchStep.ts
├── app.json
├── package.json
└── tsconfig.json
```

## Como executar

### Pré-requisitos

- Node.js.
- npm.
- Um navegador, emulador ou dispositivo compatível com Expo.

### Instalação

Na pasta do projeto, instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npx expo start
```

A partir do terminal do Expo, a aplicação pode ser aberta:

- no navegador;
- em um emulador ou dispositivo Android;
- no iOS, quando o ambiente de desenvolvimento permitir.

## Como usar

1. Na tela inicial, escolha uma das opções de cenário.
2. Selecione A* ou Busca Gulosa.
3. Selecione a heurística Manhattan, Euclidiana ou Diagonal.
4. Escolha movimento em quatro ou oito direções.
5. Posicione Tom e Jerry e edite as paredes do labirinto.
6. Inicie a busca e observe os estados **OPEN**, **CLOSED** e **PATH**.
7. Pause, continue ou avance manualmente quando desejar analisar a execução.
8. Toque em um nó analisado para visualizar linha, coluna, estado, G, H e F.
9. Consulte o resultado final com visitados, custo e quantidade de passos.
10. Use **Restaurar cenário** quando quiser descartar as edições e recuperar o preset original.

Trocar o algoritmo, a heurística ou o tipo de movimento limpa apenas a visualização da busca anterior e preserva Tom, Jerry e as paredes do labirinto. O controle **Reiniciar** tem o mesmo comportamento de preservação do mapa editado.

## Validação TypeScript

Execute:

```bash
npx tsc --noEmit
```

Esse comando verifica os tipos do projeto sem gerar arquivos JavaScript.

## Tecnologias

- React.
- React Native.
- Expo.
- TypeScript.
- Expo Router.

## Status do projeto

O projeto está em desenvolvimento e já oferece o fluxo principal de edição, execução e inspeção dos algoritmos.

### Próximos passos

- Adicionar testes automatizados para algoritmos e componentes.
- Usar sprites de Tom e Jerry dentro do grid.
- Ampliar as métricas de comparação entre buscas.
