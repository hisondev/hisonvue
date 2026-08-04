import { downloadExcelFile } from './xlsx'
import type { HExcelCellType, HExcelColumn, HExcelSheet, HGridExcelOptions, HGridMethods } from '../types'

/**
 * HGrid → sheet conversion.
 *
 * The grid already carries every piece of metadata an export needs (header text,
 * data type, display format, width, hidden state, footer formulas), so the file
 * mirrors what is on screen without re-declaring the columns by hand.
 */

/** vanillagrid 내장 컬럼 — 1번이 행번호, 2번이 행상태이고 사용자 컬럼은 3번부터다 */
const ROWNUM_COL_ID = 'v-g-rownum'
const STATUS_COL_ID = 'v-g-status'

/** 표시 텍스트가 원본 값과 다른 타입 — select는 라벨, link는 {text,value,target} 객체다 */
const SURFACE_TEXT_TYPES = new Set(['select', 'link'])

interface GridColumn extends HExcelColumn {
    colId: string
}

/** vanillagrid의 px 너비 → 엑셀의 문자 수 단위 너비 */
const toExcelWidth = (originWidth: string | null | undefined) => {
    if (!originWidth) return undefined
    const matched = /^(\d+(?:\.\d+)?)px$/.exec(String(originWidth).trim())
    if (!matched) return undefined
    const width = (Number(matched[1]) - 5) / 7
    if (!isFinite(width) || width <= 0) return undefined
    return Math.min(Math.max(width, 2), 255)
}

/** 다단 헤더('그룹;세부')는 가장 구체적인 마지막 조각만 쓴다 (병합은 v2) */
const toHeaderText = (header: string | null | undefined, fallback: string) => {
    if (!header) return fallback
    const segments = String(header).split(';').map(part => part.trim()).filter(Boolean)
    return segments.length ? segments[segments.length - 1] : fallback
}

const toExcelType = (dataType: string | null | undefined): HExcelCellType => {
    switch (dataType) {
        case 'number': return 'number'
        case 'date':
        case 'month': return 'date'
        default: return 'text'
    }
}

const toExcelFormat = (dataType: string | null | undefined, format: string | null | undefined) => {
    // ⚠️ mask 타입의 format은 입력 마스크지 표시 형식이 아니다 — numFmt로 넘기면 안 된다
    if (dataType === 'number') return format ?? null
    if (dataType === 'month') return 'yyyy-mm'
    return null
}

/** 내보낼 컬럼 목록을 colInfo에서 만든다 (행이 0건이어도 헤더는 나와야 하므로 데이터와 분리) */
const resolveColumns = (grid: HGridMethods, options: HGridExcelOptions): GridColumn[] => {
    const colCount = grid.getColCount()
    const all: GridColumn[] = []
    for (let colIndex = 1; colIndex <= colCount; colIndex++) {
        let info: any
        try {
            info = grid.getColInfo(colIndex)
        } catch {
            continue
        }
        if (!info || !info.colId) continue
        if (info.colId === ROWNUM_COL_ID && options.includeRownum !== true) continue
        if (info.colId === STATUS_COL_ID && options.includeStatus !== true) continue
        if (info.colVisible === false && options.includeHiddenColumns !== true) continue

        all.push({
            colId: info.colId,
            header: toHeaderText(grid.getHeaderText(info.colId), info.colId),
            key: info.colId,
            type: toExcelType(info.dataType),
            format: toExcelFormat(info.dataType, info.format),
            width: toExcelWidth(info.originWidth),
        })
    }

    if (options.columns && options.columns.length) {
        // 명시 목록은 순서까지 지정한다
        const byId = new Map(all.map(col => [col.colId, col]))
        return options.columns.map(colId => byId.get(colId)).filter((col): col is GridColumn => !!col)
    }
    if (options.excludeColumns && options.excludeColumns.length) {
        const excluded = new Set(options.excludeColumns)
        return all.filter(col => !excluded.has(col.colId))
    }
    return all
}

/** 필터로 숨겨진 행 골라내기 — __getData는 rowVisible이 참일 때만 값을 복사한다 */
const filterVisibleRows = (rows: any[][]) => {
    const visible = rows.filter(cells => cells.length === 0 || cells[0].rowVisible === true)
    // 판정이 전부 빗나가 한 건도 안 남으면 원본을 그대로 쓴다 (행이 통째로 사라지는 사고 방지)
    return visible.length ? visible : rows
}

/**
 * Builds a sheet from a mounted grid.
 *
 * @param grid    Grid runtime methods (`hison.component.getGrid(id)`).
 * @param options Export options.
 */
export const buildGridSheet = (grid: HGridMethods, options: HGridExcelOptions = {}): HExcelSheet => {
    const columns = resolveColumns(grid, options)
    const sheetName = options.sheetName ?? grid.getId()

    const rawRows = filterVisibleRows(grid.getDatas() as any[][])
    const rows = rawRows.map((cells, rowIndex) => {
        const byColId = new Map<string, any>()
        for (const cell of cells) byColId.set(cell.colId, cell)

        const row: Record<string, any> = {}
        for (const column of columns) {
            const cell = byColId.get(column.colId)
            let value = cell
                ? (SURFACE_TEXT_TYPES.has(String(cell.dataType)) ? (cell.text ?? cell.value) : cell.value)
                : null
            if (options.formatter) {
                const replaced = options.formatter(value, column.colId, rowIndex)
                if (replaced !== undefined) value = replaced
            }
            row[column.colId] = value
        }
        return row
    })

    const sheet: HExcelSheet = {
        name: sheetName,
        columns: columns.map(({ colId, ...column }) => column),
        rows,
    }

    if (options.includeFooter !== false) {
        let footerRowCount = 0
        try {
            footerRowCount = grid.getFooterRowCount()
        } catch {
            footerRowCount = 0
        }
        if (footerRowCount > 0) {
            const footer: any[][] = []
            for (let footerRow = 1; footerRow <= footerRowCount; footerRow++) {
                footer.push(columns.map(column => {
                    try {
                        // 합계행은 이미 계산·서식이 끝난 표시값이다 ($$SUM → "1,234")
                        return grid.getFooterValue(footerRow, column.colId)
                    } catch {
                        return null
                    }
                }))
            }
            sheet.footer = footer
        }
    }

    return sheet
}

/**
 * Builds and downloads an `.xlsx` file from a mounted grid.
 *
 * @param grid    Grid runtime methods.
 * @param options Export options (`fileName` defaults to the sheet name).
 */
export const downloadGridExcel = async (grid: HGridMethods, options: HGridExcelOptions = {}): Promise<boolean> => {
    const sheet = buildGridSheet(grid, options)
    return downloadExcelFile(sheet, {
        ...options,
        fileName: options.fileName ?? `${sheet.name}.xlsx`,
    })
}
