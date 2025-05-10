import { useTranslation } from 'react-i18next';
import { LogicMinimizerTranslate } from './LogicMinimizer.enum';
import { ITableColumns } from '@/shared/components/table/table.model';
import { TruthTableRow } from '@/shared/types/truth-table';
import { JSX } from 'react';
import { BiError } from 'react-icons/bi';
import { FcOk } from 'react-icons/fc';
import { IFormPanelValues } from './components/InputsSettings/InputsSettings.model';

export const customMessage = (inputCount: number) =>
  useTranslation('logic-minimizer').t(LogicMinimizerTranslate.INVALIDBINARY, { bits: inputCount ?? 1 });

export const generateValidationReport = (tableData: TruthTableRow[], inputCount: number, outputCount: number): [boolean, JSX.Element[]] => {
  const report: JSX.Element[] = [];
  let valid = true;

  tableData?.forEach((row, index) => {
    const id = row.id ?? 'n/a';
    const input = row?.input;
    const output = row?.output;

    const errors: string[] = [];

    if (typeof input !== 'string' || typeof output !== 'string') {
      errors.push('Not a string');
    } else if (input.length > 4) {
      errors.push(`Input length = ${input.length} (expected ${inputCount})`);
    } else if (output.length > 4) {
      errors.push(`Output length = ${output.length} (expected ${outputCount})`);
    } else {
      if (!/^[01]+$/.test(input)) errors.push('Invalid binary input');
      if (!/^[01]+$/.test(output)) errors.push('Invalid binary output');
      if (input.length !== inputCount) errors.push(`Input length = ${input.length} (expected ${inputCount})`);
      if (output.length !== outputCount) errors.push(`Output length = ${output.length} (expected ${outputCount})`);
    }

    if (errors.length) {
      valid = false;
      report.push(
        <div className="d-flex align-items-center" key={`error-${index}`}>
          <BiError />
          <strong>
            Row {index} (ID: {id})
          </strong>
          <ul className="ml-4 list-disc">
            {errors.map((e, i) => (
              <li key={`err-${index}-${i}`}>{e}</li>
            ))}
          </ul>
        </div>
      );
    } else {
      report.push(
        <div className="d-flex align-items-center" key={`ok-${index}`}>
          <FcOk />
          <strong>
            Row {index} (ID: {id})
          </strong>
          <span> — Valid</span>
        </div>
      );
    }
  });

  return [valid, report];
};

export const generateTableConfig = (
  inputCount: number,
  outputCount: number,
  t: (key: string, options?: any) => string
): Record<string, ITableColumns> => {
  const binaryRegex = /^[01]+$/;

  const dynamicConfig: Record<string, ITableColumns> = {
    input: {
      editable: true,
      editorType: 'input',
      header: 'table.input',
      filter: { type: 'input' },
      validatorConfig: {
        regex: binaryRegex,
        maxLength: inputCount ?? 1,
        customMessage: t(LogicMinimizerTranslate.INVALIDBINARY, { bits: inputCount ?? 1 }),
      },
    },
    inputHex: { editable: false, header: 'table.inputHex', filter: { type: 'input' } },
    output: {
      editable: true,
      editorType: 'input',
      header: 'table.output',
      filter: { type: 'input' },
      validatorConfig: {
        regex: binaryRegex,
        maxLength: outputCount ?? 1,
        customMessage: t(LogicMinimizerTranslate.INVALIDBINARY, { bits: outputCount ?? 1 }),
      },
    },
    outputHex: { editable: false, header: 'table.outputHex', filter: { type: 'input' } },
  };

  const extendedConfig: Record<string, ITableColumns> = Object.entries(dynamicConfig).reduce(
    (acc, [key, col]) => {
      acc[key] = {
        ...col,
        editorValidator: (val, _rowData, column, index) => {
          const { regex, maxLength, customMessage } = column?.validatorConfig ?? {};
          if (!val || typeof val !== 'string') return t(LogicMinimizerTranslate.REQUIRED);
          if (regex && !regex.test(val)) return customMessage as string;
          if (maxLength && val?.length !== Number(maxLength))
            return t(LogicMinimizerTranslate.INVALIDLENGTH, { maxLength, col: t(column?.header as string), lp: index });
          return true;
        },
      };
      return acc;
    },
    {} as Record<string, ITableColumns>
  );

  return extendedConfig;
};

export const formDefault: IFormPanelValues = {
  inputs: 3,
  outputs: 2,
  thruhTable: null,
};
