import React, { memo, useEffect, useState } from 'react';
import { TruthTableRow } from '@/shared/types/truth-table';
import { useTranslation } from 'react-i18next';
import { solve } from 'kmap-solver-lib';
import { MinimizedFunction } from '../../LogicMinimizer.model';
import './MinimizedResult.scss';

interface MinimizedResultProps {
  inputCount: number;
  outputCount: number;
  tableData: TruthTableRow[];
  onResult: (results: MinimizedFunction[]) => void;
}

const MinimizedResult: React.FC<MinimizedResultProps> = ({ inputCount, outputCount, tableData, onResult }) => {
  const { t } = useTranslation('logic-minimizer');
  const [results, setResults] = useState<MinimizedFunction[]>([]);

  console.log('inputCount:', inputCount, 'outputCount:', outputCount, tableData);

  useEffect(() => {
    if (!tableData?.length || inputCount < 1 || outputCount < 1) return;

    const newResults: MinimizedFunction[] = [];

    for (let outputIndex = 0; outputIndex < outputCount; outputIndex++) {
      const ones: number[] = [];
      const variables = Array.from({ length: inputCount }, (_, i) => String.fromCharCode(65 + i));

      tableData?.forEach((row) => {
        const inputBinary = row.input ?? '';
        const outputBinary = row.output ?? '';

        if (inputBinary.length !== inputCount || outputBinary.length !== outputCount) return;

        if (outputBinary[outputIndex] === '1') {
          ones.push(parseInt(inputBinary, 2));
        }
      });

      try {
        let expression = '-';

        if (ones.length === 0) {
          expression = '0';
        } else {
          const minimized = solve(variables, ones, []);
          expression = minimized?.expression ?? '-';
        }

        newResults.push({
          label: `F${outputIndex}(${variables.join(',')})`,
          expression,
        });
      } catch (error) {
        newResults.push({
          label: `F${outputIndex}(${variables.join(',')})`,
          expression: t('minimizedFunction.kmapError'),
        });
      }
    }

    console.log(newResults);

    setResults(newResults);
    onResult(newResults);
  }, [inputCount, outputCount, tableData, t, onResult]);

  if (!results.length) return null;

  return (
    <div className="minimized-result bg-white border rounded shadow p-4">
      <h2 className="text-lg font-bold mb-3">{t('minimizedFunction.title')}</h2>
      <ul>
        {results?.map((res, index) => (
          <li key={index}>
            <strong>{res.label}</strong> = <code>{res.expression}</code>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(MinimizedResult);
