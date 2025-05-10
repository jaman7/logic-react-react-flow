import { TruthTableRow } from '@/shared/types/truth-table';

export interface KarnaughMapViewerProps {
  inputCount: number;
  tableData: TruthTableRow[];
  minimizedFunctions: { label: string; expression: string }[];
}

export interface Group {
  cells: Set<string>;
  label: string;
  color?: string;
}
