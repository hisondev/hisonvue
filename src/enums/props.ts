import { ColorSet, DateFormat, MonthFormat, SelectionPolicy, VerticalAlign as GridVerticalAlign } from "vanillagrid2"

export const BACK_IMAGE_ALIGN_VALUES = ['left', 'center', 'right'] as const
export type BackImageAlignValue = 'left' | 'center' | 'right'
export enum BackImageAlign {
    left = 'left',
    center = 'center',
    right = 'right',
}

export const BACK_IMAGE_VERTICAL_ALIGN_VALUES = ['top', 'center', 'bottom'] as const
export type BackImageVerticalAlignValue = 'top' | 'center' | 'bottom'
export enum BackImageVerticalAlign {
    top = 'top',
    center = 'center',
    bottom = 'bottom',
}

export const BACK_IMAGE_STYLE_VALUES = ['repeat', 'no-repeat', 'cover', 'contain'] as const
export type BackImageRepeatValue = 'repeat' | 'no-repeat' | 'cover' | 'contain'
export enum BackImageRepeat {
    repeat = 'repeat',
    no_repeat = 'no-repeat',
    cover = 'cover',
    contain = 'contain',
}

export const BACKGROUND_TYPE_VALUES = ['filled', 'empty', 'transparent'] as const
export type BackgroundTypeValue = 'filled' | 'empty' | 'transparent'
export enum BackgroundType {
    filled = 'filled',
    empty = 'empty',
    transparent = 'transparent',
}

export const MODAL_PLACEMENT_VALUES = ['header-left', 'header-center', 'header-right', 'footer-left', 'footer-center', 'footer-right'] as const
export type ModalPlacementValue = 'header-left' | 'header-center' | 'header-right' | 'footer-left' | 'footer-center' | 'footer-right'
export enum ModalPlacement {
  headerLeft = 'header-left',
  headerCenter = 'header-center',
  headerRight = 'header-right',
  footerLeft = 'footer-left',
  footerCenter = 'footer-center',
  footerRight = 'footer-right',
}

export const SCREEN_POSITION_VALUES = [
  'top-left', 'top-center', 'top-right',
  'middle-left', 'middle-center', 'middle-right',
  'bottom-left', 'bottom-center', 'bottom-right'
] as const
export type ScreenPositionValue =
  | 'top-left' | 'top-center' | 'top-right'
  | 'middle-left' | 'middle-center' | 'middle-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'
export enum ScreenPosition {
  topLeft = 'top-left',
  topCenter = 'top-center',
  topRight = 'top-right',
  middleLeft = 'middle-left',
  middleCenter = 'middle-center',
  middleRight = 'middle-right',
  bottomLeft = 'bottom-left',
  bottomCenter = 'bottom-center',
  bottomRight = 'bottom-right',
}

export const SPINNER_TYPE_VALUES = ['ring', 'dots', 'bars', 'pulse'] as const
export type SpinnerTypeValue = 'ring' | 'dots' | 'bars' | 'pulse'
export enum SpinnerType {
  ring = 'ring',
  dots = 'dots',
  bars = 'bars',
  pulse = 'pulse',
}

export const VERTICAL_ALIGN_VALUES = ['top', 'middle', 'bottom'] as const
export type VerticalAlignValue = typeof VERTICAL_ALIGN_VALUES[number]
export enum VerticalAlign {
  top = 'top',
  middle = 'middle',
  bottom = 'bottom',
}

export const WHITE_SPACE_VALUES = ['normal', 'pre', 'pre-wrap', 'pre-line', 'break-spaces'] as const
export type WhiteSpaceValue = typeof WHITE_SPACE_VALUES[number]
export enum WhiteSpace {
  normal = 'normal',
  pre = 'pre',
  preWrap = 'pre-wrap',
  preLine = 'pre-line',
  breakSpaces = 'break-spaces',
}

export const H_GAP_RULE_VALUES = ['none', 'horizontal', 'vertical'] as const
export type HGapLineValue = typeof H_GAP_RULE_VALUES[number]
export enum HGapLine {
  none = 'none',
  horizontal = 'horizontal',
  vertical = 'vertical'
}

export const H_GAP_LINE_STYLE_VALUES = ['solid','dashed','dotted','double','groove','ridge','inset','outset'] as const
export type HGapLineStyleValue = typeof H_GAP_LINE_STYLE_VALUES[number]
export enum HGapLineStyle {
  solid = 'solid',
  dashed = 'dashed',
  dotted = 'dotted',
  double = 'double',
  groove = 'groove',
  ridge = 'ridge',
  inset = 'inset',
  outset = 'outset'
}

export enum InputType {
    text = 'text',
    mask = 'mask',
    number = 'number',
    digit = 'digit',
    date = 'date',
    month = 'month',
    time = 'time',
    email = 'email',
    password = 'password',
    checkbox = 'checkbox',
    range = 'range',
    color = 'color',
    textarea = 'textarea',
    select = 'select',
}
export const INPUT_TYPE_VALUES = [
  InputType.text, InputType.mask, InputType.number, InputType.digit,
  InputType.date, InputType.month, InputType.time, InputType.email,
  InputType.password, InputType.checkbox, InputType.range, InputType.color,
  InputType.textarea, InputType.select,
] as const
export type InputTypeValue = typeof INPUT_TYPE_VALUES[number]

export const EDIT_MODE_VALUES = ['editable', 'disable', 'readonly'] as const
export type EditModeValue = typeof EDIT_MODE_VALUES[number]
export enum EditMode {
    editable = 'editable',
    disable = 'disable',
    readonly = 'readonly',
}

export const DROPDOWN_TRIGGER_VALUES = ['click', 'hover'] as const
export type DropdownTriggerValue = typeof DROPDOWN_TRIGGER_VALUES[number]
export enum DropdownTrigger {
    click = 'click',
    hover = 'hover'
}

export const TEXT_ALIGN_VALUES = ['left', 'center', 'right'] as const
export type TextAlignValue = typeof TEXT_ALIGN_VALUES[number]
export enum TextAlign {
    left = 'left',
    center = 'center',
    right = 'right'
}

export const SELECTION_POLICY_VALUES = [
  SelectionPolicy.single,
  SelectionPolicy.range,
  SelectionPolicy.none,
] as const

export const GRID_DATE_FORMAT_VALUES = [
  DateFormat["yyyy-mm-dd"],
  DateFormat["yyyy/mm/dd"],
  DateFormat["yyyy. mm. dd"],
  DateFormat["yyyymmdd"],
  DateFormat["mm-dd-yyyy"],
  DateFormat["mm/dd/yyyy"],
  DateFormat["mm. dd. yyyy"],
  DateFormat["mmddyyyy"],
  DateFormat["dd-mm-yyyy"],
  DateFormat["dd/mm/yyyy"],
  DateFormat["dd. mm. yyyy"],
  DateFormat["ddmmyyyy"],
] as const

export const GRID_MONTH_FORMAT_VALUES = [
  MonthFormat["yyyymm"],
  MonthFormat["yyyy-mm"],
  MonthFormat["yyyy/mm"],
  MonthFormat["yyyy. mm"],
  MonthFormat["mmyyyy"],
  MonthFormat["mm-yyyy"],
  MonthFormat["mm/yyyy"],
  MonthFormat["mm. yyyy"],
] as const


export const GRID_VERTICAL_ALIGN_VALUES = [
  GridVerticalAlign.top,
  GridVerticalAlign.center,
  GridVerticalAlign.bottom,
] as const

export const COLOR_SET_VALUES = [
  ColorSet.skyblue,
  ColorSet.blue,
  ColorSet.light_red,
  ColorSet.red,
  ColorSet.light_green,
  ColorSet.green,
  ColorSet.orange,
  ColorSet.yellow,
  ColorSet.purple,
  ColorSet.brown,
  ColorSet.black,
] as const

export type SelectionPolicyValue = typeof SELECTION_POLICY_VALUES[number]
export type GridDateFormatValue = typeof GRID_DATE_FORMAT_VALUES[number]
export type GridMonthFormatValue = typeof GRID_MONTH_FORMAT_VALUES[number]
export type GridVerticalAlignValue = typeof GRID_VERTICAL_ALIGN_VALUES[number]

export const HEX_COLOR_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
export const CSS_VAR_RE = /^var\(--[a-z0-9\-]+\)$/i
export const isCssColorLike = (v: string) => typeof v === "string" && (HEX_COLOR_RE.test(v) || CSS_VAR_RE.test(v) || v.length > 0)

export const DATA_STATUS_VALUES = ['C', 'R', 'U', 'D'] as const
export type DataStatusValue = typeof DATA_STATUS_VALUES[number]
export enum DataStatus {
    R = 'R',
    C = 'C',
    U = 'U',
    D = 'D',
}

export enum DayOfWeek {
    sun = 0,
    mon = 1,
    tue = 2,
    wed = 3,
    thu = 4,
    fri = 5,
    sat = 6,
}

export const H_CALENDAR_VIEW_VALUES = ['day', 'week', 'month', 'year', 'years'] as const
export type HCalendarViewValue = typeof H_CALENDAR_VIEW_VALUES[number]
export enum HCalendarView {
    day = 'day',
    week = 'week',
    month = 'month',
    year = 'year',
    years = 'years',
}

export const H_CALENDAR_TIME_FORMAT_VALUES = [
  'H','HH','h','hh','m','mm',
  'H:m','H:mm','HH:m','HH:mm','h:m','h:mm','hh:m','hh:mm',
  'H{am}','HH{am}','h{am}','hh{am}','m{am}','mm{am}',
  'H:m{am}','H:mm{am}','HH:m{am}','HH:mm{am}','h:m{am}','h:mm{am}','hh:m{am}','hh:mm{am}',
] as const
export type HCalendarTimeFormatValue = typeof H_CALENDAR_TIME_FORMAT_VALUES[number]
export enum HCalendarTimeFormat {
    'h24' = 'H',
    'hh24' = 'HH',
    'h' = 'h',
    'hh' = 'hh',
    'm' = 'm',
    'mm' = 'mm',
    'h24:m' = 'H:m',
    'h24:mm' = 'H:mm',
    'hh24:m' = 'HH:m',
    'hh24:mm' = 'HH:mm',
    'h:m' = 'h:m',
    'h:mm' = 'h:mm',
    'hh:m' = 'hh:m',
    'hh:mm' = 'hh:mm',

    'h24{am}' = 'H{am}',
    'hh24{am}' = 'HH{am}',
    'h{am}' = 'h{am}',
    'hh{am}' = 'hh{am}',
    'm{am}' = 'm{am}',
    'mm{am}' = 'mm{am}',
    'h24:m{am}' = 'H:m{am}',
    'h24:mm{am}' = 'H:mm{am}',
    'hh24:m{am}' = 'HH:m{am}',
    'hh24:mm{am}' = 'HH:mm{am}',
    'h:m{am}' = 'h:m{am}',
    'h:mm{am}' = 'h:mm{am}',
    'hh:m{am}' = 'hh:m{am}',
    'hh:mm{am}' = 'hh:mm{am}',
}

export const NOTE_MODE_BY_DEVICE_VALUES = ['ADAPTIVE', 'MOBILE', 'DESKTOP'] as const
export type NoteModeByDeviceValue = 'ADAPTIVE' | 'MOBILE' | 'DESKTOP'

export const TOOL_POSITION_VALUES = ['TOP', 'BOTTOM'] as const
export type ToolPositionValue = 'TOP' | 'BOTTOM'
