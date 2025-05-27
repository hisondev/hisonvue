
import { CSSProperties, PropType } from "vue";
import type { HGridColumn } from "../../types";
import { SelectionPolicy, GridDateFormat, GridMonthFormat, GridVerticalAlign, BoolString, Color } from "../../enums";

export const gridProps = {
    modelValue: Array as PropType<any[]>,
    id: { type: String, required: true },
    columns: {
        type: Array as PropType<HGridColumn[]>,
        required: true
    },
    class: {type: String, required: false },
    style: { type: [String, Object] as PropType<string | CSSProperties>, required: false },
    /* The name of the grid. If null, the grid Id is inserted. */
    name: { type: String, required: false },
    /* Indicates whether the cell is editable. If true, the cell cannot be edited. */
    locked: { type: String as PropType<BoolString>, required: false },
    /* Indicates whether to display the background color representing the locked state of a locked cell. */
    lockedColor: { type: String as PropType<BoolString>, required: false },
    /* Indicates whether the column width can be adjusted by the user with the mouse. */
    resizable: { type: String as PropType<BoolString>, required: false },
    /* Indicates whether the user can use undo and redo shortcuts while editing the grid. */
    redoable: { type: String as PropType<BoolString>, required: false },
    /* The number of times the grid edit state is recorded for undo and redo. */
    redoCount: { type: String, required: false },
    /* Indicates whether the grid is visible. If false, it will be display none. */
    visible: { type: String as PropType<BoolString>, required: false },
    /* Indicates whether the grid header is visible. If false, it will be display none. */
    headerVisible: { type: String as PropType<BoolString>, required: false },
    /* Indicates whether to display the row number column (v-g-rownum) on the screen. */
    rownumVisible: { type: String as PropType<BoolString>, required: false },
    /* The width size of the row number column (v-g-rownum). */
    rownumSize: { type: String, required: false },
    /* Indicates whether to display the locked color of the row number column (v-g-rownum). */
    rownumLockedColor: { type: String as PropType<BoolString>, required: false },
    /* Indicates whether to display the status column (v-g-status) on the screen. */
    statusVisible: { type: String as PropType<BoolString>, required: false },
    /* Indicates whether to display the locked color of the status column (v-g-status). */
    statusLockedColor: { type: String as PropType<BoolString>, required: false },
    /* The user selection range policy of the grid. 'range': range selection, 'single': single cell selection, 'none': no selection) */
    selectionPolicy: { type: String as PropType<SelectionPolicy>, required: false },
    /* Value representing null in the grid. */
    nullValue: { type: String, required: false },
    /**
     * The format of the date in the grid.
     * 'yyyy-mm-dd', 'yyyy/mm/dd', 'yyyy. mm. dd', 'yyyymmdd'
     * 'mm-dd-yyyy', 'mm/dd/yyyy', 'mm. dd. yyyy', 'mmddyyyy'
     * 'dd-mm-yyyy', 'dd/mm/yyyy', 'dd. mm. yyyy', 'ddmmyyyy' are possible.
     */
    dateFormat: { type: String as PropType<GridDateFormat>, required: false },
    /**
     * The format of the month in the grid.
     * 'yyyymm', 'yyyy-mm', 'yyyy/mm', 'yyyy. mm'
     * 'mmyyyy', 'mm-yyyy', 'mm/yyyy', 'mm. yyyy' are possible.
     */
    monthFormat: { type: String as PropType<GridMonthFormat>, required: false },
    /* Sets the alter-row of the grid (the function that alternates the colors of each row). */
    alterRow: { type: String as PropType<BoolString>, required: false },
    /**
     * Sets the frozen columns of the grid. The number should be set by calculating the invisible columns as well.
     * (Column 1 is v-g-rownum, and column 2 is v-g-status. The user column starts from at least 3 columns.)
     */
    frozenColCount: { type: String, required: false },
    /* Sets the frozen rows of the grid. */
    frozenRowCount: { type: String, required: false },
    /* Indicates whether to use the sorting feature of the grid. */
    sortable: { type: String as PropType<BoolString>, required: false },
    /* Indicates whether to use the filtering feature of the grid. */
    filterable: { type: String as PropType<BoolString>, required: false },
    /* Indicates whether to use the feature that checks or unchecks the column checkboxes when double-clicking the header of a checkbox. */
    allCheckable: { type: String as PropType<BoolString>, required: false },
    /* The value a checkbox type cell has when checked. */
    checkedValue: { type: String, required: false },
    /* The value a checkbox type cell has when unchecked. */
    uncheckedValue: { type: String, required: false },
    /* The width of the grid. Insert cssText. */
    width: { type: String, required: false },
    /* The height of the grid. Insert cssText. */
    height: { type: String, required: false },
    /* The margin of the grid. Insert cssText. */
    margin: { type: String, required: false },
    /* The padding of the grid. Insert cssText. */
    padding: { type: String, required: false },
    /* Specifies the size level of the grid. Enter a positive integer. 5 is the standard ratio. */
    sizeLevel: { type: String, required: false },
    /* Sets the default vertical-align of the grid cell. Choose from 'top', 'center', 'bottom'. */
    verticalAlign: { type: String as PropType<GridVerticalAlign>, required: false },
    /* Specifies the default font-size of the grid cell. Enter a css text. The unit is px. */
    cellFontSize: { type: String, required: false },
    /* Specifies the default min-height of the grid cell. Enter a css text. The unit is px. */
    cellMinHeight: { type: String, required: false },
    /* Sets the horizontal border size of the grid cell. The unit is px. Enter 0 or a positive integer. */
    horizenBorderSize: { type: String, required: false },
    /* Sets the vertical border size of the grid cell. The unit is px. Enter 0 or a positive integer. */
    verticalBorderSize: { type: String, required: false },
    /* Sets the font-family of the grid cell. Enter the font-family in cssText. */
    gridFontFamily: { type: String, required: false },
    /* Sets the font-family of the grid editor. Enter the font-family in cssText. */
    editorFontFamily: { type: String, required: false },
    /* Sets the overflow-wrap of the grid cell. Enter the overflow-wrap in cssText. */
    overflowWrap: { type: String, required: false },
    /* Sets the word-break of the grid cell. Enter the word-break in cssText. */
    wordBreak: { type: String, required: false },
    /* Sets the white-space of the grid cell. Enter the white-space in cssText. */
    whiteSpace: { type: String, required: false },
    /* Indicates whether to display the underline for link type cells. */
    linkHasUnderLine: { type: String, required: false },
    /* Inverts the colors of the grid. */
    invertColor: { type: String as PropType<BoolString>, required: false },
    /* Sets the main color of the grid. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    color: { type: String as PropType<Color> || String, required: false },
    /* Sets the border color of the grid. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    gridBorderColor: { type: String, required: false },
    /* Sets the background color of the header cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    headerCellBackColor: { type: String, required: false },
    /* Sets the border color of the header cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    headerCellBorderColor: { type: String, required: false },
    /* Sets the font color of the header cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    headerCellFontColor: { type: String, required: false },
    /* Sets the background color of the footer cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    footerCellBackColor: { type: String, required: false },
    /* Sets the border color of the footer cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    footerCellBorderColor: { type: String, required: false },
    /* Sets the font color of the footer cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    footerCellFontColor: { type: String, required: false },
    /* Sets the background color of the grid body. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    bodyBackColor: { type: String, required: false },
    /* Sets the background color of the grid body cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    bodyCellBackColor: { type: String, required: false },
    /* Sets the border color of the grid body cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    bodyCellBorderColor: { type: String, required: false },
    /* Sets the font color of the grid body cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    bodyCellFontColor: { type: String, required: false },
    /* Sets the background color of the editor. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    editorBackColor: { type: String, required: false },
    /* Sets the font color of the editor. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    editorFontColor: { type: String, required: false },
    /* Sets the background color of the selected cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    selectCellBackColor: { type: String, required: false },
    /* Sets the font color of the selected cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    selectCellFontColor: { type: String, required: false },
    /* Sets the background color of the selected column header. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    selectColBackColor: { type: String, required: false },
    /* Sets the font color of the selected column header. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    selectColFontColor: { type: String, required: false },
    /* Sets the background color of the selected row. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    selectRowBackColor: { type: String, required: false },
    /* Sets the font color of the selected row. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    selectRowFontColor: { type: String, required: false },
    /* Sets the background color of the mouseover cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    mouseoverCellBackColor: { type: String, required: false },
    /* Sets the font color of the mouseover cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    mouseoverCellFontColor: { type: String, required: false },
    /* Sets the background color of the locked cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    lockCellBackColor: { type: String, required: false },
    /* Sets the font color of the locked cell editor. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    lockCellFontColor: { type: String, required: false },
    /* Sets the background color of the alternate rows. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    alterRowBackColor: { type: String, required: false },
    /* Sets the font color of the alternate rows. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    alterRowFontColor: { type: String, required: false },
    /* Sets the font color of the button type cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    buttonFontColor: { type: String, required: false },
    /* Sets the border color of the button type cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    buttonBorderColor: { type: String, required: false },
    /* Sets the background color of the button type cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    buttonBackColor: { type: String, required: false },
    /* Sets the font color of the button type cell on hover. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    buttonHoverFontColor: { type: String, required: false },
    /* Sets the background color of the button type cell on hover. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    buttonHoverBackColor: { type: String, required: false },
    /* Sets the font color of the button type cell on active. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    buttonActiveFontColor: { type: String, required: false },
    /* Sets the background color of the button type cell on active. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    buttonActiveBackColor: { type: String, required: false },
    /* Sets the font color of the link type cell. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    linkFontColor: { type: String, required: false },
    /* Sets the font color of the link type cell on hover. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    linkHoverFontColor: { type: String, required: false },
    /* Sets the font color of the link type cell on active. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    linkActiveFontColor: { type: String, required: false },
    /* Sets the font color of the link type cell on visited. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    linkVisitedFontColor: { type: String, required: false },
    /* Sets the font color of the link type cell on focus. Enter the 16-digit color code in cssText. Ex) '#ffffff' */
    linkFocusFontColor: { type: String, required: false },
}

export const gridEventProps = {
    activeCell : Function as PropType<(row: number, colId: string) => boolean>,
    activeCells : Function as PropType<(startRow: number, startColId: string, endRow: number, endColId: string) => boolean>,
    activeRow : Function as PropType<(row: number) => boolean>,
    activeRows : Function as PropType<(startRow: number, endRow: number) => boolean>,
    activeCol : Function as PropType<(colId: string) => boolean>,
    activeCols : Function as PropType<(startColId: string, endColId: string) => boolean>,
    beforeChange : Function as PropType<(row: number, colId: string, oldValue: any, newValue: any) => boolean>,
    afterChange : Function as PropType<(row: number, colId: string, oldValue: any, newValue: any) => void>,
    beforeClickCell : Function as PropType<(row: number, colId: string) => boolean>,
    afterClickCell : Function as PropType<(row: number, colId: string) => void>,
    clickSelect : Function as PropType<(row: number, colId: string, selectNode: HTMLElement) => boolean>,
    clickCheckbox : Function as PropType<(row: number, colId: string, checkboxNode: HTMLElement) => boolean>,
    clickButton : Function as PropType<(row: number, colId: string, buttonNude: HTMLElement) => boolean>,
    clickLink : Function as PropType<(row: number, colId: string, linkNode: HTMLElement) => boolean>,
    beforeDblClickCell : Function as PropType<(row: number, colId: string) => boolean>,
    afterDblClickCell : Function as PropType<(row: number, colId: string) => void>,
    beforeClickHeader : Function as PropType<(row: number, colId: string) => boolean>,
    afterClickHeader : Function as PropType<(row: number, colId: string) => void>,
    beforeDblClickHeader : Function as PropType<(row: number, colId: string) => boolean>,
    afterDblClickHeader : Function as PropType<(row: number, colId: string) => void>,
    beforeEditEnter : Function as PropType<(row: number, colId: string, editorNode: HTMLElement) => boolean>,
    afterEditEnter : Function as PropType<(row: number, colId: string, editorNode: HTMLElement) => void>,
    editEnding : Function as PropType<(row: number, colId: string, oldValue: any, newValue: any) => boolean>,
    clickFilter : Function as PropType<(row: number, colId: string, filterNode: HTMLElement) => boolean>,
    chooseFilter : Function as PropType<(row: number, colId: string, oldValue: any, newValue: any) => boolean>,
    paste : Function as PropType<(startRow: number, startColId: string, clipboardText: string) => boolean>,
    copy : Function as PropType<(startRow: number, startColId: string, endRow: number, endColId: string, copyText: string) => boolean>,
    resize : Function as PropType<(colId: string) => boolean>,
    keydownEditor : Function as PropType<(event: KeyboardEvent) => boolean>,
    inputEditor : Function as PropType<(event: InputEvent) => boolean>,
    keydownGrid : Function as PropType<(event: KeyboardEvent) => boolean>,
}
