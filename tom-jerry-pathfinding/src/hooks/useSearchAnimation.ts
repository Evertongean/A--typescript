import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { CellType } from '@/models/CellType';
import { SearchResult } from '@/models/SearchResult';

interface UseSearchAnimationProps {
  onGridChange: (grid: CellType[][]) => void;

  onFinish?: (
    result: SearchResult
  ) => void;
}

export function useSearchAnimation({
  onGridChange,
  onFinish,
}: UseSearchAnimationProps) {
  /*
   * Resultado atual da busca.
   */
  const resultRef =
    useRef<SearchResult | null>(
      null
    );

  /*
   * Grid usado exclusivamente
   * durante a animação.
   */
  const workingGridRef =
    useRef<CellType[][]>([]);

  /*
   * Para conseguirmos chamar
   * onFinish sem problemas
   * de referência.
   */
  const onFinishRef =
    useRef(onFinish);

  useEffect(() => {
    onFinishRef.current =
      onFinish;
  }, [onFinish]);

  /*
   * Índice do próximo evento.
   */
  const [
    currentStep,
    setCurrentStep,
  ] = useState(0);

  /*
   * Estado da animação.
   */
  const [
    isRunning,
    setIsRunning,
  ] = useState(false);

  const [
    isPaused,
    setIsPaused,
  ] = useState(false);

  const [
    isFinished,
    setIsFinished,
  ] = useState(false);

  /*
   * Milissegundos entre
   * cada passo.
   */
  const [
    speed,
    setSpeed,
  ] = useState(250);

  /*
   * =====================================
   * APLICAR UM EVENTO
   * =====================================
   */
  const applyStep =
    useCallback(
      (stepIndex: number) => {
        const result =
          resultRef.current;

        if (!result) {
          return;
        }

        const step =
          result.steps[
            stepIndex
          ];

        if (!step) {
          return;
        }

        const grid =
          workingGridRef.current;

        const currentType =
          grid[step.row][
            step.col
          ];

        /*
         * Nunca sobrescrevemos
         * Tom, Jerry ou parede.
         */
        if (
          currentType !==
            'START' &&
          currentType !==
            'GOAL' &&
          currentType !==
            'WALL'
        ) {
          if (
            step.type ===
            'OPENED'
          ) {
            grid[step.row][
              step.col
            ] = 'OPEN';
          }

          if (
            step.type ===
            'CLOSED'
          ) {
            grid[step.row][
              step.col
            ] = 'CLOSED';
          }
        }

        onGridChange(
          cloneGrid(grid)
        );
      },
      [onGridChange]
    );

  /*
   * =====================================
   * FINALIZAR E DESENHAR PATH
   * =====================================
   */
  const finishAnimation =
    useCallback(() => {
      const result =
        resultRef.current;

      if (!result) {
        return;
      }

      const grid =
        workingGridRef.current;

      /*
       * Depois que todos os
       * OPEN/CLOSED terminaram,
       * desenhamos o caminho.
       */
      result.path.forEach(
        (node) => {
          const type =
            grid[node.row][
              node.col
            ];

          /*
           * Não substituímos
           * Tom e Jerry.
           */
          if (
            type === 'START' ||
            type === 'GOAL'
          ) {
            return;
          }

          grid[node.row][
            node.col
          ] = 'PATH';
        }
      );

      onGridChange(
        cloneGrid(grid)
      );

      setIsRunning(false);
      setIsPaused(false);
      setIsFinished(true);

      onFinishRef.current?.(
        result
      );
    }, [onGridChange]);

  /*
   * =====================================
   * REPRODUÇÃO AUTOMÁTICA
   * =====================================
   */
  useEffect(() => {
    if (
      !isRunning ||
      isPaused
    ) {
      return;
    }

    const result =
      resultRef.current;

    if (!result) {
      return;
    }

    const timer =
      setTimeout(() => {
        /*
         * Ainda existem eventos.
         */
        if (
          currentStep <
          result.steps.length
        ) {
          applyStep(
            currentStep
          );

          setCurrentStep(
            (previous) =>
              previous + 1
          );

          return;
        }

        /*
         * Terminaram os eventos.
         */
        finishAnimation();
      }, speed);

    return () => {
      clearTimeout(timer);
    };
  }, [
    currentStep,
    isRunning,
    isPaused,
    speed,
    applyStep,
    finishAnimation,
  ]);

  /*
   * =====================================
   * INICIAR
   * =====================================
   */
  function start(
    result: SearchResult,
    baseGrid: CellType[][]
  ) {
    resultRef.current =
      result;

    workingGridRef.current =
      cloneGrid(baseGrid);

    onGridChange(
      cloneGrid(baseGrid)
    );

    setCurrentStep(0);

    setIsFinished(false);
    setIsPaused(false);
    setIsRunning(true);
  }

  /*
   * =====================================
   * PAUSAR
   * =====================================
   */
  function pause() {
    if (!isRunning) {
      return;
    }

    setIsPaused(true);
  }

  /*
   * =====================================
   * CONTINUAR
   * =====================================
   */
  function resume() {
    if (!isRunning) {
      return;
    }

    setIsPaused(false);
  }

  /*
   * =====================================
   * PRÓXIMO PASSO
   * =====================================
   */
  function nextStep() {
    const result =
      resultRef.current;

    if (
      !result ||
      isFinished
    ) {
      return;
    }

    /*
     * Se estava rodando,
     * pausa automaticamente.
     */
    setIsPaused(true);

    /*
     * Executa apenas
     * um evento.
     */
    if (
      currentStep <
      result.steps.length
    ) {
      applyStep(
        currentStep
      );

      setCurrentStep(
        currentStep + 1
      );

      return;
    }

    /*
     * Depois do último evento,
     * mostra o PATH.
     */
    finishAnimation();
  }

  /*
   * =====================================
   * RESETAR ANIMAÇÃO
   * =====================================
   */
  function reset() {
    resultRef.current =
      null;

    workingGridRef.current =
      [];

    setCurrentStep(0);

    setIsRunning(false);
    setIsPaused(false);
    setIsFinished(false);
  }

  const totalSteps =
    resultRef.current
      ?.steps.length ?? 0;

  return {
    start,
    pause,
    resume,
    nextStep,
    reset,

    isRunning,
    isPaused,
    isFinished,

    currentStep,
    totalSteps,

    speed,
    setSpeed,
  };
}

/*
 * Copiar matriz.
 */
function cloneGrid(
  grid: CellType[][]
): CellType[][] {
  return grid.map(
    (row) => [...row]
  );
}