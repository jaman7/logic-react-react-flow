import { FC } from 'react';
import './TruthTable.scss';
import { TruthTableRowBool } from '@/shared/types/truth-table';

interface TruthTableProps {
  truthTable: TruthTableRowBool[];
  activeRow: number;
  onSelectRow: (index: number) => void;
}

const TruthTable: FC<TruthTableProps> = ({ truthTable, activeRow, onSelectRow }) => {
  if (!truthTable.length) return null;

  const inputCount = truthTable[0]?.inputs.length || 0;

  return (
    <table className="truth-table">
      <thead className="thead">
        <tr>
          {Array.from({ length: inputCount }, (_, i) => (
            <th key={`in-${i}`} className="px-2 py-1">
              IN{i + 1}
            </th>
          ))}
          <th className="px-2 py-1">OUT</th>
        </tr>
      </thead>
      <tbody className="tbody">
        {truthTable.map((row, rowIndex) => (
          <tr
            key={`row-${rowIndex}`}
            className={`cursor-pointer ${rowIndex === activeRow ? 'bg-blue text-white' : ''}`}
            onClick={() => onSelectRow(rowIndex)}
          >
            {row.inputs.map((input, inputIndex) => (
              <td key={`INPUT-${rowIndex}-${inputIndex}`} className="px-2 py-1">
                {input ? 1 : 0}
              </td>
            ))}
            <td className="px-2 py-1 font-bold">{row.output ? 1 : 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TruthTable;
