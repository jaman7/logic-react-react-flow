import React, { memo, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from 'primereact/tooltip';
import { Group, KarnaughMapViewerProps } from './KarnaughMapViewer.model';
import { generateGrayCode, getColor, getLogicalLabel, splitBits } from './KarnaughMapViewer.utils';
import './KarnaughMapViewer.scss';

const KarnaughMapViewer: React.FC<KarnaughMapViewerProps> = ({ inputCount, tableData, minimizedFunctions }) => {
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [groups, setGroups] = useState<Group[]>([]);

  const [rowBits, colBits] = useMemo(() => splitBits(inputCount), [inputCount]);
  const rowGray = useMemo(() => generateGrayCode(rowBits), [rowBits]);
  const colGray = useMemo(() => generateGrayCode(colBits), [colBits]);

  const getKMapMatrix = (outputIndex: number): number[][] => {
    const matrix: number[][] = Array.from({ length: rowGray.length }, () => Array(colGray.length).fill(0));

    tableData?.forEach((row) => {
      if (!row.input || !row.output) return;
      const input = row.input.padStart(inputCount, '0');
      const rowKey = input.slice(0, rowBits);
      const colKey = input.slice(rowBits);

      const rowIndex = rowGray.indexOf(rowKey);
      const colIndex = colGray.indexOf(colKey);

      if (rowIndex >= 0 && colIndex >= 0 && row.output[outputIndex] === '1') {
        matrix[rowIndex][colIndex] = 1;
      }
    });

    return matrix;
  };

  const detectGroups = (matrix: number[][]): Group[] => {
    const groups: Group[] = [];
    const rows = matrix.length;
    const cols = matrix[0]?.length ?? 0;
    let groupIndex = 0;

    const addGroup = (cells: string[]) => {
      groups.push({
        cells: new Set(cells),
        label: getLogicalLabel(cells, rowGray, colGray, inputCount),
        color: getColor(groupIndex++),
      });
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (matrix[r][c] === 1 && matrix[r][(c + 1) % cols] === 1) {
          addGroup([`${r}-${c}`, `${r}-${(c + 1) % cols}`]);
        }

        if (matrix[r][c] === 1 && matrix[(r + 1) % rows][c] === 1) {
          addGroup([`${r}-${c}`, `${(r + 1) % rows}-${c}`]);
        }

        if (
          matrix[r][c] === 1 &&
          matrix[r][(c + 1) % cols] === 1 &&
          matrix[(r + 1) % rows][c] === 1 &&
          matrix[(r + 1) % rows][(c + 1) % cols] === 1
        ) {
          addGroup([`${r}-${c}`, `${r}-${(c + 1) % cols}`, `${(r + 1) % rows}-${c}`, `${(r + 1) % rows}-${(c + 1) % cols}`]);
        }
      }
    }

    return groups;
  };

  useEffect(() => {
    if (minimizedFunctions?.length && tableData?.length) {
      const groups = detectGroups(getKMapMatrix(0));
      setGroups(groups);
    }
  }, [minimizedFunctions, tableData]);

  const toggleCell = (key: string) => {
    setSelectedCells((prev) => {
      const newSet = new Set(prev);
      newSet.has(key) ? newSet.delete(key) : newSet.add(key);
      return newSet;
    });
  };

  const getGroupLabelForCell = (r: number, c: number): string => {
    const key = `${r}-${c}`;
    const found = groups?.find((g) => g.cells.has(key));
    return found?.label || '';
  };

  const getGroupColorForCell = (r: number, c: number): string | undefined => {
    const key = `${r}-${c}`;
    const found = groups?.find((g) => g.cells.has(key));
    return found?.color;
  };

  return (
    <div className="kmap-viewer">
      <h2 className="kmap-title">Karnaugh Map ({inputCount} vars)</h2>
      <div className="kmap-content">
        {minimizedFunctions?.map((fn, outputIndex) => {
          const kmap = getKMapMatrix(outputIndex);
          const label = fn.label || `F${outputIndex}`;

          return (
            <div className="kmap-container" key={`output-${outputIndex}`}>
              <h3 className="kmap-output-label">{label}</h3>
              <div className={`kmap-grid border rounded shadow p-3 kmap-${rowGray.length}x${colGray.length}`}>
                <div className="kmap-empty" />
                {colGray?.map((c) => (
                  <div key={`kmap-col-${c}`} className="kmap-label kmap-col-label">
                    {c}
                  </div>
                ))}

                {rowGray.map((r, rowIndex) => (
                  <React.Fragment key={`kmap-rowGray-${outputIndex}-${r}-${rowIndex}`}>
                    <div className="kmap-label kmap-row-label">{r}</div>
                    {colGray?.map((_, colIndex) => {
                      const val = kmap[rowIndex][colIndex];
                      const key = `${rowIndex}-${colIndex}`;
                      const isManual = selectedCells.has(key);
                      const color = getGroupColorForCell(rowIndex, colIndex);

                      return (
                        <React.Fragment key={`kmap-cell-fragment-kmap-cell-${outputIndex}-${r}-${rowIndex}-${colIndex}`}>
                          <motion.div
                            key={`kmap-cell-${outputIndex}-${r}-${rowIndex}-${colIndex}`}
                            className={`kmap-cell ${val === 1 ? 'highlight' : ''} ${isManual ? 'manual' : ''} target-tooltip-kmap-cell-${outputIndex}-${rowIndex}-${colIndex}`}
                            style={{ backgroundColor: color || undefined }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: (rowIndex * colGray.length + colIndex) * 0.02 }}
                            onClick={() => toggleCell(key)}
                            data-pr-tooltip={getGroupLabelForCell(rowIndex, colIndex)}
                            data-pr-classname={`shadow-none`}
                            data-pr-position="top"
                          >
                            {val}
                          </motion.div>
                          <Tooltip target={`.target-tooltip-kmap-cell-${outputIndex}-${rowIndex}-${colIndex}`} autoHide={false} />
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
              <p className="kmap-expression border rounded shadow p-3 w-100">{fn.expression}</p>

              <div className="kmap-legend border rounded shadow p-2 w-100">
                {groups?.map((g, idx) => (
                  <div key={`kmap-legend-${idx}`} className="kmap-legend-item" style={{ backgroundColor: g.color }}>
                    {g.label}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(KarnaughMapViewer);
