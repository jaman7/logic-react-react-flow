import { TranslationKeys } from '@/shared/enums/error-translate';
import { TranslatableError } from '@/shared/errors/TranslatableError';
import { parseCsvToTruthTable } from '../parseCsvToTruthTable';

jest.mock('i18next', () => ({
  t: (key: string, options?: any) => {
    if (options) return `${key} ${JSON.stringify(options)}`;
    return key;
  },
}));

const createMockFile = (content: string): File => new File([content], 'test.csv', { type: 'text/csv' });

describe('parseCsvToTruthTable', () => {
  test('parses valid CSV with config line', async () => {
    const content = '#config,inputLength=2;outputLength=1\ninput,output\n00,0\n01,1\n10,1\n11,0';
    const file = createMockFile(content); // zostaw input,output tylko raz
    const result = await parseCsvToTruthTable(file);

    expect(result.meta.inputLength).toBe(2);
    expect(result.meta.outputLength).toBe(1);
    expect(result.rows.length).toBe(4);
    expect(result.rows[0]).toEqual({
      id: 1,
      input: '00',
      output: '0',
      inputHex: '0',
      outputHex: '0',
    });
  });

  test('parses valid CSV without config line', async () => {
    const content = '0,0\n1,1'; // <--- bez input,output
    const file = createMockFile(content);
    const result = await parseCsvToTruthTable(file);

    expect(result.rows.length).toBe(2);
    expect(result.rows[1].inputHex).toBe('1');
    expect(result.meta.inputLength).toBe(1);
    expect(result.meta.outputLength).toBe(1);
  });

  test('throws TranslatableError on invalid binary digits', async () => {
    const content = '#config,inputLength=2;outputLength=1\ninput,output\n00,0\n0A,1';
    const file = createMockFile(content);
    await expect(parseCsvToTruthTable(file)).rejects.toThrowError(
      new TranslatableError(TranslationKeys.INVALID_ROW, expect.objectContaining({ row: 2, input: '0A', output: '1' }))
    );
  });

  test('throws TranslatableError when input length mismatch', async () => {
    const content = '#config,inputLength=2;outputLength=1\ninput,output\n0,1';
    const file = createMockFile(content);
    await expect(parseCsvToTruthTable(file)).rejects.toThrowError(TranslatableError);
  });

  test('throws TranslatableError when output length mismatch', async () => {
    const content = '#config,inputLength=2;outputLength=2\ninput,output\n00,1';
    const file = createMockFile(content);
    await expect(parseCsvToTruthTable(file)).rejects.toThrowError(TranslatableError);
  });

  test('throws TranslatableError on malformed CSV line', async () => {
    const content = '#config,inputLength=2;outputLength=1\ninput,output\ninvalid_line';
    const file = createMockFile(content);
    await expect(parseCsvToTruthTable(file)).rejects.toThrowError(TranslatableError);
  });

  test('throws TranslatableError on totally malformed CSV', async () => {
    const file = createMockFile(',,,,,');
    await expect(parseCsvToTruthTable(file)).rejects.toThrowError(TranslatableError);
  });
});
