import Papa from 'papaparse';
import { TranslationKeys } from '../enums/error-translate';
import { TranslatableError } from '../errors/TranslatableError';
import { ParsedTruthTable, TruthTableRow } from '../types/truth-table';
import { convertBinaryToHex } from './convertBinaryToHex';

export const parseCsvToTruthTable = async (file: File): Promise<ParsedTruthTable> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const text = reader.result as string;
        const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');

        // Odczyt configu
        let configLine = lines[0].startsWith('#config') ? lines.shift() : null;
        let inputLength = 0;
        let outputLength = 0;

        if (configLine) {
          const configPairs = configLine.replace('#config,', '').split(';');
          configPairs.forEach((pair) => {
            const [key, value] = pair.split('=');
            if (key === 'inputLength') inputLength = parseInt(value);
            if (key === 'outputLength') outputLength = parseInt(value);
          });
        }

        const hasHeader = lines[0]?.toLowerCase()?.includes('input') && lines[0]?.toLowerCase()?.includes('output');
        if (!hasHeader) {
          lines.unshift('input,output');
        }

        const csvContent = lines.join('\n');

        Papa.parse(csvContent, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              const dataRaw = results?.data as { input: string; output: string }[];
              if (!dataRaw || dataRaw.length === 0) {
                throw new TranslatableError(TranslationKeys.CSV_ERROR, { reason: 'empty or invalid data' });
              }

              const data: TruthTableRow[] = dataRaw.map((row, i) => {
                const id = i + 1;
                const input = row.input?.trim();
                const output = row.output?.trim();

                if (
                  !input ||
                  !output ||
                  !/^[01]{1,32}$/.test(input) ||
                  !/^[01]{1,32}$/.test(output) ||
                  (inputLength && input.length !== inputLength) ||
                  (outputLength && output.length !== outputLength)
                ) {
                  throw new TranslatableError(TranslationKeys.INVALID_ROW, { row: i + 1, input, output });
                }

                return {
                  id,
                  input,
                  output,
                  inputHex: convertBinaryToHex(input),
                  outputHex: convertBinaryToHex(output),
                };
              });

              if (data.length === 0) {
                throw new TranslatableError(TranslationKeys.CSV_ERROR, { reason: 'no valid rows' });
              }

              resolve({
                rows: data,
                meta: {
                  inputLength: (inputLength || data[0]?.input?.length) ?? 0,
                  outputLength: (outputLength || data[0]?.output?.length) ?? 0,
                },
              });
            } catch (err) {
              reject(err instanceof TranslatableError ? err : new TranslatableError(TranslationKeys.CSV_ERROR, { error: err }));
            }
          },
          error: (err: unknown) => reject(new TranslatableError(TranslationKeys.CSV_ERROR, { error: err })),
        });
      } catch (err: unknown) {
        reject(new TranslatableError(TranslationKeys.CSV_ERROR, { error: err }));
      }
    };

    reader.onerror = () => {
      reject(new TranslatableError(TranslationKeys.CSV_ERROR, { error: reader.error }));
    };

    reader.readAsText(file);
  });
};
