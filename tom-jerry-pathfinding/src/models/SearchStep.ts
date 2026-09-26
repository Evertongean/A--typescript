export type SearchStepType =
  | 'OPENED'
  | 'CLOSED';

export interface SearchStep {
  row: number;
  col: number;

  g: number;
  h: number;
  f: number;

  type: SearchStepType;

  parentRow?: number;
  parentCol?: number;
}