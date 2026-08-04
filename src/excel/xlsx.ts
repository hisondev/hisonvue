import { createZip, type ZipEntry } from './zip'
import type {
    HExcelCellType,
    HExcelColumn,
    HExcelOptions,
    HExcelSaveHandler,
    HExcelSheet,
} from '../types'

/**
 * Dependency-free XLSX writer.
 *
 * A workbook is six XML parts inside a ZIP. Strings are written straight into the
 * cells with `t="inlineStr"`, so no `sharedStrings.xml` is needed.
 */

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
const NS_MAIN = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
const NS_REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
const NS_PKG_REL = 'http://schemas.openxmlformats.org/package/2006/relationships'
/** 엑셀 시트 최대 행 수 (1,048,576) — 헤더 1행을 뺀 값이 데이터 상한 */
const EXCEL_MAX_ROWS = 1048575

/**
 * 🔴 XML 1.0이 금지하는 제어문자. 남겨두면 엑셀이 "파일이 손상되었습니다"를 띄운다.
 * 수기 입력 칸에 붙여넣기로 실제로 섞여 들어오므로 반드시 제거한다.
 */
const INVALID_XML_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g

/** Escapes a string for XML text/attribute content, stripping characters XLSX rejects. */
export const escapeXml = (value: string) => value
    .replace(INVALID_XML_CHARS, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

/** 1-based 컬럼 번호 → 엑셀 열 문자 (1 → A, 27 → AA) */
export const getColumnLetter = (colIndex: number) => {
    let remain = colIndex
    let name = ''
    while (remain > 0) {
        const mod = (remain - 1) % 26
        name = String.fromCharCode(65 + mod) + name
        remain = Math.floor((remain - 1) / 26)
    }
    return name
}

/* ------------------------------------------------------------------ *
 *  값 → 셀 변환
 * ------------------------------------------------------------------ */

/** 엑셀 날짜 epoch = 1899-12-30 (엑셀이 1900년을 윤년으로 잘못 세는 역사적 버그 보정) */
const EXCEL_EPOCH = Date.UTC(1899, 11, 30)
const MS_PER_DAY = 86400000

const DATE_PATTERN = /^(\d{4})[-/.]?(\d{2})[-/.]?(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?$/
const MONTH_PATTERN = /^(\d{4})[-/.]?(\d{2})$/

const toSerial = (year: number, month: number, day: number, hour = 0, minute = 0, second = 0) => {
    const utc = Date.UTC(year, month - 1, day, hour, minute, second)
    // Date.UTC가 넘겨받은 값을 보정해버리므로(2026-02-31 → 3월) 원본과 대조해 검증한다
    const check = new Date(utc)
    if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null
    return (utc - EXCEL_EPOCH) / MS_PER_DAY
}

/**
 * 날짜 값 → 엑셀 시리얼.
 *
 * `YYYYMMDD`(vanillagrid date 셀의 저장 형태) · `YYYY-MM-DD` · `YYYY/MM/DD` ·
 * 시각이 붙은 형태 · `YYYYMM`/`YYYY-MM`(month 셀) · `Date` 인스턴스를 받는다.
 */
export const toExcelSerial = (value: any): { serial: number, hasTime: boolean } | null => {
    if (value instanceof Date) {
        if (isNaN(value.getTime())) return null
        // 엑셀에는 타임존 개념이 없으므로 로컬 시각 그대로 옮긴다
        const serial = toSerial(
            value.getFullYear(), value.getMonth() + 1, value.getDate(),
            value.getHours(), value.getMinutes(), value.getSeconds(),
        )
        if (serial === null) return null
        const hasTime = value.getHours() !== 0 || value.getMinutes() !== 0 || value.getSeconds() !== 0
        return { serial, hasTime }
    }

    const text = String(value ?? '').trim()
    if (!text) return null

    const dateMatch = DATE_PATTERN.exec(text)
    if (dateMatch) {
        const serial = toSerial(
            Number(dateMatch[1]), Number(dateMatch[2]), Number(dateMatch[3]),
            Number(dateMatch[4] ?? 0), Number(dateMatch[5] ?? 0), Number(dateMatch[6] ?? 0),
        )
        if (serial === null) return null
        return { serial, hasTime: dateMatch[4] !== undefined }
    }

    const monthMatch = MONTH_PATTERN.exec(text)
    if (monthMatch) {
        const serial = toSerial(Number(monthMatch[1]), Number(monthMatch[2]), 1)
        if (serial === null) return null
        return { serial, hasTime: false }
    }
    return null
}

type CellKind = 'blank' | 'text' | 'number' | 'date' | 'boolean'
interface ResolvedCell {
    kind: CellKind
    text: string
    num: number
    /** 시각까지 있는 날짜 (yyyy-mm-dd hh:mm 서식 필요) */
    hasTime: boolean
}

const BLANK: ResolvedCell = { kind: 'blank', text: '', num: 0, hasTime: false }

const asText = (value: any): ResolvedCell => ({ kind: 'text', text: String(value), num: 0, hasTime: false })

/** 값과 선언된 타입으로 셀 종류를 결정한다. 변환에 실패하면 언제나 텍스트로 흘려보낸다. */
export const resolveCell = (value: any, type: HExcelCellType, dateAsText: boolean): ResolvedCell => {
    if (value === null || value === undefined || value === '') return BLANK
    if (typeof value === 'object' && !(value instanceof Date)) {
        // link 셀({text, value, target}) 등 객체 값은 표시 텍스트를 우선한다
        const label = (value as any).text ?? (value as any).label ?? (value as any).value
        if (label !== undefined && label !== null && typeof label !== 'object') return asText(label)
        return asText(JSON.stringify(value))
    }

    if (type === 'text') return asText(value)

    if (type === 'number' || (type === 'auto' && typeof value === 'number')) {
        const num = typeof value === 'number' ? value : Number(String(value).replace(/,/g, ''))
        if (!isFinite(num)) return asText(value)
        return { kind: 'number', text: '', num, hasTime: false }
    }

    if (type === 'boolean' || (type === 'auto' && typeof value === 'boolean')) {
        const truthy = value === true || value === 'true' || value === 'Y' || value === 1 || value === '1'
        return { kind: 'boolean', text: '', num: truthy ? 1 : 0, hasTime: false }
    }

    if (type === 'date' || type === 'datetime' || (type === 'auto' && value instanceof Date)) {
        if (dateAsText) {
            if (value instanceof Date) {
                const pad = (n: number) => String(n).padStart(2, '0')
                return asText(`${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`)
            }
            return asText(value)
        }
        const parsed = toExcelSerial(value)
        if (!parsed) return asText(value)
        return {
            kind: 'date',
            text: '',
            num: parsed.serial,
            hasTime: parsed.hasTime || type === 'datetime',
        }
    }

    return asText(value)
}

/* ------------------------------------------------------------------ *
 *  styles.xml
 * ------------------------------------------------------------------ */

const FMT_DATE = 'yyyy-mm-dd'
const FMT_DATETIME = 'yyyy-mm-dd hh:mm'
/** 커스텀 표시 형식 id는 예약 구간(0~163)을 피해 164부터 매긴다 */
const FIRST_CUSTOM_NUM_FMT_ID = 164

/** 고정 스타일 인덱스 — 기본 / 헤더 / 합계행 */
export const STYLE_DEFAULT = 0
export const STYLE_HEADER = 1
export const STYLE_FOOTER = 2

const BASE_XFS = [
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>',
    '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>',
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="2" xfId="0" applyFont="1" applyBorder="1"/>',
]

/** 표시 형식 × 굵기 조합을 모아 styles.xml 한 장으로 직렬화한다 */
class StyleTable {
    private numFmtCodes: string[] = []
    private numFmtIds = new Map<string, number>()
    private xfs: string[] = [...BASE_XFS]
    private xfIndexes = new Map<string, number>()

    private registerNumFmt(code: string) {
        const cached = this.numFmtIds.get(code)
        if (cached !== undefined) return cached
        const id = FIRST_CUSTOM_NUM_FMT_ID + this.numFmtCodes.length
        this.numFmtCodes.push(code)
        this.numFmtIds.set(code, id)
        return id
    }

    /** 표시 형식 코드(없으면 null)와 굵기에 해당하는 cellXfs 인덱스 */
    getStyle(formatCode: string | null | undefined, bold = false) {
        if (!formatCode) return bold ? STYLE_FOOTER : STYLE_DEFAULT
        const key = `${formatCode} ${bold ? 1 : 0}`
        const cached = this.xfIndexes.get(key)
        if (cached !== undefined) return cached

        const numFmtId = this.registerNumFmt(formatCode)
        const index = this.xfs.length
        this.xfs.push(
            `<xf numFmtId="${numFmtId}" fontId="${bold ? 1 : 0}" fillId="0" borderId="${bold ? 2 : 0}" xfId="0" applyNumberFormat="1"${bold ? ' applyFont="1" applyBorder="1"' : ''}/>`
        )
        this.xfIndexes.set(key, index)
        return index
    }

    /** 날짜 셀 스타일 (시각 포함 여부로 서식이 갈린다) */
    getDateStyle(formatCode: string | null | undefined, hasTime: boolean, bold = false) {
        return this.getStyle(formatCode || (hasTime ? FMT_DATETIME : FMT_DATE), bold)
    }

    toXml() {
        const numFmts = this.numFmtCodes.length
            ? `<numFmts count="${this.numFmtCodes.length}">${this.numFmtCodes
                .map((code, i) => `<numFmt numFmtId="${FIRST_CUSTOM_NUM_FMT_ID + i}" formatCode="${escapeXml(code)}"/>`)
                .join('')}</numFmts>`
            : ''
        return `${XML_HEADER}<styleSheet xmlns="${NS_MAIN}">${numFmts}`
            + '<fonts count="2">'
            + '<font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font>'
            + '<font><b/><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font>'
            + '</fonts>'
            + '<fills count="3">'
            + '<fill><patternFill patternType="none"/></fill>'
            + '<fill><patternFill patternType="gray125"/></fill>'
            + '<fill><patternFill patternType="solid"><fgColor rgb="FFF2F2F2"/><bgColor indexed="64"/></patternFill></fill>'
            + '</fills>'
            + '<borders count="3">'
            + '<border><left/><right/><top/><bottom/><diagonal/></border>'
            + '<border><left/><right/><top/><bottom style="thin"><color rgb="FFBFBFBF"/></bottom><diagonal/></border>'
            + '<border><left/><right/><top style="thin"><color rgb="FFBFBFBF"/></top><bottom/><diagonal/></border>'
            + '</borders>'
            + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
            + `<cellXfs count="${this.xfs.length}">${this.xfs.join('')}</cellXfs>`
            + '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
            + '</styleSheet>'
    }
}

/* ------------------------------------------------------------------ *
 *  시트 XML
 * ------------------------------------------------------------------ */

interface NormalizedColumn {
    header: string
    key: string | null
    type: HExcelCellType
    format: string | null
    width: number | null
}

const normalizeColumns = (sheet: HExcelSheet): { columns: NormalizedColumn[], hasHeader: boolean } => {
    if (sheet.columns && sheet.columns.length) {
        return {
            columns: sheet.columns.map((col: HExcelColumn, i) => ({
                header: col.header ?? col.key ?? '',
                key: col.key ?? null,
                type: col.type ?? 'auto',
                format: col.format ?? null,
                width: typeof col.width === 'number' ? col.width : null,
            })),
            hasHeader: sheet.columns.some(col => !!(col.header ?? col.key)),
        }
    }

    const firstRow = sheet.rows.find(row => row !== null && row !== undefined)
    // 컬럼 정의 없이 배열 행만 준 경우 = 헤더 없는 원시 표
    if (!firstRow || Array.isArray(firstRow)) {
        const width = Array.isArray(firstRow) ? firstRow.length : 0
        return {
            columns: Array.from({ length: width }, () => ({ header: '', key: null, type: 'auto' as HExcelCellType, format: null, width: null })),
            hasHeader: false,
        }
    }
    // 객체 행이면 첫 행의 키 순서를 컬럼으로 삼는다
    return {
        columns: Object.keys(firstRow).map(key => ({ header: key, key, type: 'auto' as HExcelCellType, format: null, width: null })),
        hasHeader: true,
    }
}

const getCellValue = (row: Record<string, any> | any[], column: NormalizedColumn, colIndex: number) => {
    if (Array.isArray(row)) return row[colIndex]
    return column.key ? row[column.key] : undefined
}

const renderCell = (ref: string, styleIndex: number, cell: ResolvedCell) => {
    const style = styleIndex ? ` s="${styleIndex}"` : ''
    switch (cell.kind) {
        case 'blank':
            return ''
        case 'number':
        case 'date':
            return `<c r="${ref}"${style}><v>${cell.num}</v></c>`
        case 'boolean':
            return `<c r="${ref}"${style} t="b"><v>${cell.num}</v></c>`
        default:
            return `<c r="${ref}"${style} t="inlineStr"><is><t xml:space="preserve">${escapeXml(cell.text)}</t></is></c>`
    }
}

const buildSheetXml = (sheet: HExcelSheet, styles: StyleTable, options: HExcelOptions, isFirstSheet: boolean) => {
    const { columns, hasHeader } = normalizeColumns(sheet)
    const dateAsText = options.dateAsText === true
    const footerRows = sheet.footer ?? []
    const colCount = Math.max(
        columns.length,
        ...sheet.rows.map(row => (Array.isArray(row) ? row.length : 0)),
        ...footerRows.map(row => row.length),
    )
    const lastColumn = getColumnLetter(Math.max(colCount, 1))
    const totalRows = (hasHeader ? 1 : 0) + sheet.rows.length + footerRows.length

    const parts: string[] = []
    parts.push(`${XML_HEADER}<worksheet xmlns="${NS_MAIN}" xmlns:r="${NS_REL}">`)
    parts.push(`<dimension ref="A1:${lastColumn}${Math.max(totalRows, 1)}"/>`)

    // sheetViews → cols → sheetData → autoFilter 순서는 OOXML 스키마가 강제한다 (어기면 손상 파일)
    const freeze = hasHeader && options.freezeHeader !== false
    parts.push(`<sheetViews><sheetView${isFirstSheet ? ' tabSelected="1"' : ''} workbookViewId="0">`)
    if (freeze) {
        parts.push('<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>')
        parts.push('<selection pane="bottomLeft" activeCell="A2" sqref="A2"/>')
    }
    parts.push('</sheetView></sheetViews>')
    parts.push('<sheetFormatPr defaultRowHeight="15"/>')

    const widthCols = columns
        .map((col, i) => ({ col, i }))
        .filter(({ col }) => col.width !== null && col.width > 0)
    if (widthCols.length) {
        parts.push('<cols>')
        for (const { col, i } of widthCols) {
            parts.push(`<col min="${i + 1}" max="${i + 1}" width="${col.width!.toFixed(2)}" customWidth="1"/>`)
        }
        parts.push('</cols>')
    }

    parts.push('<sheetData>')
    let rowNumber = 0

    if (hasHeader) {
        rowNumber += 1
        const cells = columns
            .map((col, i) => renderCell(`${getColumnLetter(i + 1)}${rowNumber}`, STYLE_HEADER, asText(col.header)))
            .join('')
        parts.push(`<row r="${rowNumber}">${cells}</row>`)
    }

    for (const row of sheet.rows) {
        rowNumber += 1
        const cells: string[] = []
        for (let i = 0; i < colCount; i++) {
            const column = columns[i] ?? { header: '', key: null, type: 'auto' as HExcelCellType, format: null, width: null }
            const cell = resolveCell(getCellValue(row ?? {}, column, i), column.type, dateAsText)
            const styleIndex = cell.kind === 'date'
                ? styles.getDateStyle(column.format, cell.hasTime)
                : styles.getStyle(cell.kind === 'number' ? column.format : null)
            cells.push(renderCell(`${getColumnLetter(i + 1)}${rowNumber}`, styleIndex, cell))
        }
        parts.push(`<row r="${rowNumber}">${cells.join('')}</row>`)
    }

    for (const row of footerRows) {
        rowNumber += 1
        const cells: string[] = []
        for (let i = 0; i < colCount; i++) {
            const column = columns[i] ?? { header: '', key: null, type: 'auto' as HExcelCellType, format: null, width: null }
            const cell = resolveCell(row[i], column.type, dateAsText)
            const styleIndex = cell.kind === 'date'
                ? styles.getDateStyle(column.format, cell.hasTime, true)
                : styles.getStyle(cell.kind === 'number' ? column.format : null, true)
            cells.push(renderCell(`${getColumnLetter(i + 1)}${rowNumber}`, styleIndex, cell))
        }
        parts.push(`<row r="${rowNumber}">${cells.join('')}</row>`)
    }

    parts.push('</sheetData>')

    if (hasHeader && options.autoFilter !== false && sheet.rows.length) {
        parts.push(`<autoFilter ref="A1:${lastColumn}${(hasHeader ? 1 : 0) + sheet.rows.length}"/>`)
    }
    parts.push('</worksheet>')
    return parts.join('')
}

/* ------------------------------------------------------------------ *
 *  워크북 조립
 * ------------------------------------------------------------------ */

/** 시트 탭 이름 규칙: 금지문자 치환 · 31자 제한 · 중복 시 번호 부여 */
const normalizeSheetNames = (sheets: HExcelSheet[]) => {
    const used = new Set<string>()
    return sheets.map((sheet, i) => {
        let name = (sheet.name ?? `Sheet${i + 1}`).replace(/[\\/?*[\]:]/g, '_').trim().slice(0, 31)
        if (!name) name = `Sheet${i + 1}`
        if (used.has(name)) {
            let suffix = 2
            let candidate = `${name.slice(0, 28)}(${suffix})`
            while (used.has(candidate)) {
                suffix += 1
                candidate = `${name.slice(0, 28)}(${suffix})`
            }
            name = candidate
        }
        used.add(name)
        return name
    })
}

/**
 * Builds an `.xlsx` file in memory.
 *
 * @param sheetOrSheets One sheet or an array of sheets.
 * @param options       Export options.
 * @returns A `Blob` with the spreadsheet MIME type.
 */
export const createExcelBlob = async (
    sheetOrSheets: HExcelSheet | HExcelSheet[],
    options: HExcelOptions = {},
): Promise<Blob> => {
    if (typeof Blob === 'undefined') {
        throw new Error('[hisonvue] Excel export requires a browser environment (Blob is undefined).')
    }
    const sheets = Array.isArray(sheetOrSheets) ? sheetOrSheets : [sheetOrSheets]
    if (!sheets.length) throw new Error('[hisonvue] Excel export requires at least one sheet.')

    for (const sheet of sheets) {
        if (!sheet || !Array.isArray(sheet.rows)) {
            throw new Error('[hisonvue] Excel export requires each sheet to have a `rows` array.')
        }
        // 상한을 넘으면 조용히 잘라내지 않고 던진다 — 잘린 파일이 그대로 보고서가 되는 사고를 막는다
        if (typeof options.maxRows === 'number' && sheet.rows.length > options.maxRows) {
            throw new Error(`[hisonvue] Excel export exceeds maxRows (${sheet.rows.length} > ${options.maxRows}). Narrow the period or raise maxRows.`)
        }
        if (sheet.rows.length > EXCEL_MAX_ROWS) {
            throw new Error(`[hisonvue] Excel export exceeds the sheet limit of ${EXCEL_MAX_ROWS} rows.`)
        }
    }

    const styles = new StyleTable()
    // styles.xml은 시트를 다 만든 뒤에 직렬화해야 한다 (쓰이는 서식이 그때 확정된다)
    const sheetXmls = sheets.map((sheet, i) => buildSheetXml(sheet, styles, options, i === 0))
    const names = normalizeSheetNames(sheets)

    const contentTypes = `${XML_HEADER}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`
        + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        + '<Default Extension="xml" ContentType="application/xml"/>'
        + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
        + sheetXmls.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')
        + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
        + '</Types>'

    const rootRels = `${XML_HEADER}<Relationships xmlns="${NS_PKG_REL}">`
        + `<Relationship Id="rId1" Type="${NS_REL}/officeDocument" Target="xl/workbook.xml"/>`
        + '</Relationships>'

    const workbook = `${XML_HEADER}<workbook xmlns="${NS_MAIN}" xmlns:r="${NS_REL}"><sheets>`
        + names.map((name, i) => `<sheet name="${escapeXml(name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')
        + '</sheets></workbook>'

    const workbookRels = `${XML_HEADER}<Relationships xmlns="${NS_PKG_REL}">`
        + sheetXmls.map((_, i) => `<Relationship Id="rId${i + 1}" Type="${NS_REL}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')
        + `<Relationship Id="rId${sheetXmls.length + 1}" Type="${NS_REL}/styles" Target="styles.xml"/>`
        + '</Relationships>'

    const encoder = new TextEncoder()
    const entries: ZipEntry[] = [
        { path: '[Content_Types].xml', data: encoder.encode(contentTypes) },
        { path: '_rels/.rels', data: encoder.encode(rootRels) },
        { path: 'xl/workbook.xml', data: encoder.encode(workbook) },
        { path: 'xl/_rels/workbook.xml.rels', data: encoder.encode(workbookRels) },
        { path: 'xl/styles.xml', data: encoder.encode(styles.toXml()) },
        ...sheetXmls.map((xml, i) => ({ path: `xl/worksheets/sheet${i + 1}.xml`, data: encoder.encode(xml) })),
    ]

    const bytes = await createZip(entries, options.compression ?? 'auto')
    return new Blob([bytes as unknown as BlobPart], { type: XLSX_MIME })
}

/* ------------------------------------------------------------------ *
 *  저장
 * ------------------------------------------------------------------ */

/** 앱 전역 저장 훅 (웹뷰 브리지 등) — hison.excel.setSaveHandler()로 등록 */
let globalSaveHandler: HExcelSaveHandler | null = null

/** Registers a save handler used by every export that does not pass its own. */
export const setExcelSaveHandler = (handler: HExcelSaveHandler | null) => { globalSaveHandler = handler }

/** Returns the globally registered save handler, or `null`. */
export const getExcelSaveHandler = () => globalSaveHandler

/** `.xlsx` 확장자 보정 + 경로 구분자 제거 */
export const normalizeExcelFileName = (fileName?: string) => {
    let name = (fileName ?? '').replace(/[\\/:*?"<>|]/g, '_').trim()
    if (!name) name = 'export'
    if (!/\.xlsx$/i.test(name)) name += '.xlsx'
    return name
}

/**
 * Hands a generated workbook to the save handler, or downloads it in the browser.
 *
 * @param blob     Workbook bytes.
 * @param fileName File name (already normalized).
 * @param save     Per-call handler; falls back to the global one.
 */
export const saveExcelBlob = async (blob: Blob, fileName: string, save?: HExcelSaveHandler): Promise<boolean> => {
    const handler = save ?? globalSaveHandler
    if (handler) {
        const handled = await handler(blob, fileName)
        // false를 돌려주면 "내가 처리 못 했다" → 기본 다운로드로 폴백
        if (handled !== false) return true
    }
    if (typeof document === 'undefined' || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
        throw new Error('[hisonvue] Excel download requires a browser environment. Register hison.excel.setSaveHandler() to handle it elsewhere.')
    }

    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = fileName
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    // 클릭 처리가 끝나기 전에 revoke하면 일부 브라우저에서 저장이 취소된다
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return true
}

/**
 * Builds a workbook and saves it.
 *
 * @param sheetOrSheets One sheet or an array of sheets.
 * @param options       Export options (`fileName` defaults to `export.xlsx`).
 */
export const downloadExcelFile = async (
    sheetOrSheets: HExcelSheet | HExcelSheet[],
    options: HExcelOptions = {},
): Promise<boolean> => {
    const blob = await createExcelBlob(sheetOrSheets, options)
    return saveExcelBlob(blob, normalizeExcelFileName(options.fileName), options.save)
}
