export const removeRowById = <T extends { id: number }>(table: T[], idToRemove: number): T[] => {
  return table?.filter((row) => row.id !== idToRemove) ?? [];
};
