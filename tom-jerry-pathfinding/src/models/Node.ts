export interface SearchNode {
  row: number;
  col: number;

  /*
   * G = custo real percorrido
   * desde Tom até este nó.
   */
  g: number;

  /*
   * H = estimativa de distância
   * deste nó até Jerry.
   */
  h: number;

  /*
   * F = G + H
   */
  f: number;

  /*
   * Posição do nó anterior.
   *
   * Será usada depois para reconstruir
   * o caminho final até Tom.
   */
  parent: {
    row: number;
    col: number;
  } | null;
}