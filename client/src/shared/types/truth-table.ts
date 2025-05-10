export interface TruthTableRowBool {
  inputs: boolean[];
  output: boolean;
}

export interface TruthTableRow {
  id: number | null;
  input: string | null;
  output: string | null;
  inputHex: string | null;
  outputHex: string | null;
}

export interface TruthTableMeta {
  inputLength: number;
  outputLength: number;
}

export interface ParsedTruthTable {
  rows: TruthTableRow[];
  meta: TruthTableMeta;
}
