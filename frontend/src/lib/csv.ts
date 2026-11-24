export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string | number | boolean | null | undefined | Date;
}

// Evita la inyeccion de formulas al abrir el CSV en Excel/Sheets: una celda que empieza con = + - @ (o tab/CR)
// se prefija con una comilla simple. Los datos vienen de usuarios (nombres, correos, descripciones).
const escapeCell = (raw: unknown): string => {
  let v = raw instanceof Date ? raw.toISOString() : raw === null || raw === undefined ? '' : String(raw);
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return `"${v.replace(/"/g, '""')}"`;
};

export function downloadCsv<T>(filename: string, rows: T[], columns: CsvColumn<T>[]) {
  const lines = [
    columns.map((c) => escapeCell(c.header)).join(';'),
    ...rows.map((r) => columns.map((c) => escapeCell(c.value(r))).join(';')),
  ];
  // BOM + separador ';' para que Excel en espanol abra bien tildes y columnas
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
