export const exportFile = (content: string | BlobPart, type: string, fileName: string): void => {
  const blob = new Blob([content], { type: `${type};charset=utf-8;` });
  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
