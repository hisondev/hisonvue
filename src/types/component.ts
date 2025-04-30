import { GridAlign, GridVerticalAlign } from "../enums"

export interface HGridColumn {
    id: string
    name?: string
    header?: string
    footer?: string
    dataType?: string
    untarget?: boolean
    rowMerge?: boolean
    colMerge?: boolean
    visible?: boolean
    required?: boolean
    resizable?: boolean
    sortable?: boolean
    filterable?: boolean
    width?: string
    selectSize?: string
    locked?: boolean
    lockedColor?: boolean
    format?: string
    codes?: string
    defaultCode?: string
    maxLength?: number
    maxByte?: number
    maxNumber?: number
    minNumber?: number
    roundNumber?: number
    align?: keyof typeof GridAlign
    verticalAlign?: keyof typeof GridVerticalAlign
    overflowWrap?: string
    wordBreak?: string
    whiteSpace?: string
    backColor?: string
    fontColor?: string
    fontBold?: boolean
    fontItalic?: boolean
    fontThruline?: boolean
    fontUnderline?: boolean
}

export interface HButton extends HTMLButtonElement {
    isDisable(): boolean
    isVisible(): boolean
    setDisable(disable: boolean): void
    setVisible(visible: boolean): void
}
