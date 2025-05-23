import { GridMethods } from "vanillagrid2"
import { GridAlign, GridVerticalAlign } from "../enums"
import { VanillanoteElement } from "vanillanote2"

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

export interface HGridMethods extends GridMethods{
    getId(): string
}

export interface HNoteElement extends VanillanoteElement {
    getId(): string
}

export interface HButtonMethods {
    getId(): string
    isDisable(): boolean
    isVisible(): boolean
    setDisable(disable: boolean): void
    setVisible(visible: boolean): void
}

export interface HLayoutMethods {
    getId(): string
    isVisible(): boolean
    setVisible(visible: boolean): void
    getBackImageSrc(): string
    setBackImageSrc(val: string): void
    getBackImageRepeat(): string
    setBackImageRepeat(val: string): void
    getBackImageWidth(): string
    setBackImageWidth(val: string): void
    getBackImageAlign(): string
    setBackImageAlign(val: string): void
    getBackImageVerticalAlign(): string
    setBackImageVerticalAlign(val: string): void
    getBackColor(): string
    setBackColor(val: string): void
    getBorderColor(): string
    setBorderColor(val: string): void
    getBorderWidth(): string
    setBorderWidth(val: string): void
    getHeight(): string
    setHeight(val: string): void
}

export type DeviceType = 'mb' | 'tb' | 'pc' | 'wd'
