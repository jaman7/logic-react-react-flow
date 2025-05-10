export const convertBinaryToHex = (binary: string | null): string | null => {
  if (!binary || /[^01]/.test(binary)) return null;
  return parseInt(binary, 2).toString(16).toUpperCase();
};
