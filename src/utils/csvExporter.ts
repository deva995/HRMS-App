import Papa from 'papaparse';

export function exportToCsv<T extends Record<string, unknown>>(
  filename: string,
  data: T[],
  headers?: { key: keyof T; label: string }[]
): void {
  let rowsToExport: Record<string, unknown>[] = data;

  if (headers && headers.length > 0) {
    rowsToExport = data.map((item) => {
      const row: Record<string, unknown> = {};
      headers.forEach((h) => {
        row[h.label] = item[h.key];
      });
      return row;
    });
  }

  const csv = Papa.unparse(rowsToExport);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
