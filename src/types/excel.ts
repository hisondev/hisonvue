/**
 * Excel(XLSX) export types.
 *
 * hisonvue ships a **dependency-free** XLSX writer: the file is assembled in the
 * browser as a ZIP of OOXML parts, so no external library (SheetJS, ExcelJS, JSZip …)
 * is required and no server round-trip is involved.
 *
 * Two entry points share the same writer:
 * - `hison.excel.download(sheets, options)` — build a workbook from plain data
 * - `grid.downloadExcel(options)` — build a workbook from a mounted `HGrid`
 */

/**
 * How a cell value is written into the sheet.
 *
 * - `auto` — infer from the JavaScript value (`number` → numeric, `Date` → date,
 *   `boolean` → boolean, everything else → text). Date-like **strings stay text**.
 * - `text` — always written as an inline string
 * - `number` — written as a numeric cell (non-numeric values fall back to text)
 * - `date` / `datetime` — written as an Excel date serial so Excel can sort and
 *   compute on it (see {@link HExcelOptions.dateAsText} to opt out globally)
 * - `boolean` — written as an Excel boolean cell
 */
export type HExcelCellType = 'auto' | 'text' | 'number' | 'date' | 'datetime' | 'boolean'

/**
 * ZIP compression strategy for the generated `.xlsx` container.
 *
 * - `auto` (default) — use the native `CompressionStream('deflate-raw')` when the
 *   browser provides it, otherwise fall back to **STORE** (no compression)
 * - `store` — never compress. Larger file, but works everywhere
 * - `deflate` — compress when available; silently degrades to STORE when not
 *
 * @remarks
 * `CompressionStream` requires Safari 16.4+, so STORE is the guaranteed path on
 * older iOS WebViews. An uncompressed xlsx opens normally in Excel, Numbers and
 * LibreOffice — it is simply bigger (roughly 10x).
 */
export type HExcelCompression = 'auto' | 'store' | 'deflate'

/**
 * Custom save handler, used to hand the generated file to a native layer.
 *
 * Return `false` to fall back to the default browser download
 * (`<a download>` + object URL). Any other return value — including `undefined` —
 * means the handler took care of saving.
 *
 * @example
 * // Route downloads through a WebView bridge on the native app, browser default on web
 * hison.excel.setSaveHandler(async (blob, fileName) => {
 *   if (!window.NativeBridge) return false
 *   window.NativeBridge.saveFile(fileName, await blobToBase64(blob))
 * })
 */
export type HExcelSaveHandler = (blob: Blob, fileName: string) => boolean | void | Promise<boolean | void>

/** Column definition for a sheet built from plain data. */
export interface HExcelColumn {
  /** Header text shown in row 1. Falls back to {@link key}. */
  header?: string
  /**
   * Property name to read from each row object.
   * Ignored when rows are supplied as arrays (the column order is used instead).
   */
  key?: string
  /** How the value is written. Default `'auto'`. */
  type?: HExcelCellType
  /**
   * Excel number format code applied to the column
   * (e.g. `'#,##0'`, `'#,##0.00'`, `'0%'`, `'yyyy-mm-dd'`).
   *
   * @remarks
   * vanillagrid number formats are compatible with Excel format codes and are
   * passed through as-is when exporting a grid.
   */
  format?: string | null
  /** Column width in Excel character units (roughly `(px - 5) / 7`). */
  width?: number
}

/** One worksheet of a workbook. */
export interface HExcelSheet {
  /**
   * Sheet tab name. Invalid characters (`\ / ? * [ ] :`) are replaced, the name is
   * truncated to 31 characters, and duplicates get a numeric suffix.
   */
  name?: string
  /** Column definitions. When omitted, keys of the first row object are used. */
  columns?: HExcelColumn[]
  /** Data rows — either objects keyed by {@link HExcelColumn.key}, or positional arrays. */
  rows: Array<Record<string, any> | any[]>
  /** Extra rows appended below the data (totals etc.), rendered in bold. */
  footer?: any[][]
}

/** Options shared by every export entry point. */
export interface HExcelOptions {
  /** File name. `.xlsx` is appended when missing. Default `'export.xlsx'`. */
  fileName?: string
  /**
   * Write dates as plain text instead of Excel date serials.
   *
   * Default `false` — dates are written as serials (epoch `1899-12-30`) with a
   * `yyyy-mm-dd` format so Excel can sort and compute on them.
   */
  dateAsText?: boolean
  /** Freeze the header row. Default `true`. */
  freezeHeader?: boolean
  /** Add an auto-filter over the header row. Default `true`. */
  autoFilter?: boolean
  /** ZIP compression strategy. Default `'auto'`. */
  compression?: HExcelCompression
  /**
   * Row-count guard. When the data exceeds this number the export **throws**
   * instead of silently truncating. Default: no limit.
   */
  maxRows?: number
  /**
   * Per-call save handler. Takes precedence over the one registered with
   * `hison.excel.setSaveHandler()`.
   */
  save?: HExcelSaveHandler
}

/**
 * Options for `grid.downloadExcel()`.
 *
 * Column metadata (header text, data type, number format, width, hidden state) is
 * read from the grid itself, so the file mirrors what is on screen.
 */
export interface HGridExcelOptions extends HExcelOptions {
  /** Sheet tab name. Default: the grid id. */
  sheetName?: string
  /** Include columns whose `colVisible` is `false`. Default `false`. */
  includeHiddenColumns?: boolean
  /** Include the built-in row-number column (`v-g-rownum`). Default `false`. */
  includeRownum?: boolean
  /** Include the built-in status column (`v-g-status`). Default `false`. */
  includeStatus?: boolean
  /**
   * Explicit column id list. When given, only these columns are exported, **in the
   * given order**. Takes precedence over {@link excludeColumns}.
   */
  columns?: string[]
  /** Column ids to drop from the export. */
  excludeColumns?: string[]
  /** Append the grid footer rows (`$$SUM`, `$$AVG`, …). Default `true`. */
  includeFooter?: boolean
  /**
   * Value transform applied to every exported cell, e.g. to unmask or relabel data.
   * Return the value to write; return `undefined` to keep the original.
   *
   * @param value  The raw cell value.
   * @param colId  Column id of the cell.
   * @param rowIndex Zero-based index of the exported row.
   */
  formatter?: (value: any, colId: string, rowIndex: number) => any
}
