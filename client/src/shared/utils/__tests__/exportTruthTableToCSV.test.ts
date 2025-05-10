import { TruthTableRow } from '@/shared/types/truth-table';
import { exportTruthTableToCSV } from '../exportTruthTableToCSV';

describe('exportTruthTableToCSV', () => {
  const sampleRows: TruthTableRow[] = [
    { id: 1, input: '000', output: '001', inputHex: '0', outputHex: '1' },
    { id: 2, input: '001', output: '011', inputHex: '1', outputHex: '3' },
    { id: 3, input: '010', output: '111', inputHex: '2', outputHex: '7' },
  ];

  it('generates correct CSV with meta header and rows', () => {
    const csv = exportTruthTableToCSV(sampleRows, 3, 3);
    const expected = ['#config,inputLength=3;outputLength=3', 'input,output', '000,001', '001,011', '010,111'].join('\n');

    expect(csv).toBe(expected);
  });

  it('handles empty input/output gracefully', () => {
    const rowsWithMissingValues: TruthTableRow[] = [
      { id: 1, input: null, output: null, inputHex: null, outputHex: null },
      { id: 2, input: '111', output: null, inputHex: '7', outputHex: null },
    ];
    const csv = exportTruthTableToCSV(rowsWithMissingValues, 3, 3);

    expect(csv).toContain('#config,inputLength=3;outputLength=3');
    expect(csv).toContain('input,output');
    expect(csv).toContain(',');
    expect(csv).toContain('111,');
  });
});
