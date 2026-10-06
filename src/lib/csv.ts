type CsvValue = string | number | null | undefined;

function escapeCsvCell(value: CsvValue): string {
  let text = value == null ? '' : String(value);
  // Prevent spreadsheet programs from treating imported data as a formula.
  if (/^\s*[=+@\-]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function downloadCsv(filename: string, rows: CsvValue[][]): void {
  const contents = rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
  const blob = new Blob([`\uFEFF${contents}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
