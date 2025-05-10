export const generateGrayCode = (bits: number): string[] => {
  if (bits === 0) return [''];
  const prev = generateGrayCode(bits - 1);
  return [...prev.map((code) => '0' + code), ...prev.reverse().map((code) => '1' + code)];
};

export const splitBits = (totalBits: number): [number, number] => {
  const rowBits = Math.floor(totalBits / 2);
  const colBits = totalBits - rowBits;
  return [rowBits, colBits];
};

export const getColor = (index: number): string => `hsl(${(index * 47) % 360}, 70%, 80%)`;

export const getLogicalLabel = (cells: string[], rowGray: string[], colGray: string[], inputCount: number): string => {
  const binaryInputs = cells.map((key) => {
    const [r, c] = key.split('-').map(Number);
    return rowGray[r] + colGray[c];
  });

  const sharedBits = Array(inputCount).fill(null);

  for (let bitIndex = 0; bitIndex < inputCount; bitIndex++) {
    const bitValues = new Set(binaryInputs.map((val) => val[bitIndex]));
    if (bitValues.size === 1) {
      sharedBits[bitIndex] = [...bitValues][0];
    }
  }

  return (
    sharedBits
      .map((bit, idx) => {
        if (bit === null) return null;
        const char = String.fromCharCode(65 + idx);
        return bit === '1' ? char : `¬${char}`;
      })
      .filter(Boolean)
      .join('·') || '1'
  );
};
