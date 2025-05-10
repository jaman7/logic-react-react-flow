import { TruthTableRow } from '../types/truth-table';

export const exportTruthTableToCSV = (rows: TruthTableRow[], inputLength: number, outputLength: number): string => {
  const configLine = `#config,inputLength=${inputLength};outputLength=${outputLength}`;
  const header = `input,output`;
  const body = rows.map((row) => `${row.input ?? ''},${row.output ?? ''}`).join('\n');

  return [configLine, header, body].join('\n');
};
