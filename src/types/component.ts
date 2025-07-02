import { GridMethods } from "vanillagrid2"
import { GridAlign, GridVerticalAlign, EditMode, InputType, DataStatus, DayOfWeek, HCalenderView, HCalenderTimeFormat } from "../enums"
import { VanillanoteElement } from "vanillanote2"
import { InterfaceDataModel, InterfaceDataWrapper } from "hisonjs"
import { Chart, ChartData, ChartOptions } from "chart.js"

export type DeviceType = 'mb' | 'tb' | 'pc' | 'wd'

/**
 * Defines a special time block on a specific day.
 * This can be used to highlight time ranges (e.g., lunch breaks, maintenance periods)
 * with a custom background color or class.
 *
 * - Time units are in **minutes** from midnight (0–1440).
 * - Use `className` to apply specific CSS styling to that time range.
 *
 * @example
 * {
 *   from: 12 * 60,     // 12:00 PM
 *   to: 13 * 60,       // 1:00 PM
 *   className: 'lunch-time'
 * }
 */
export type HCalendarSpecialTime = {
  from: number
  to: number
  className?: string
}

/**
 * Maps days of the week to arrays of special time blocks.
 * Allows you to specify custom time ranges (with styles) for each day.
 *
 * - Keys are 0 (Sunday) through 6 (Saturday).
 * - Values are arrays of `HCalendarSpecialTime` entries.
 *
 * @example
 * {
 *   1: [ { from: 720, to: 780, className: 'meeting-block' } ],  // Monday 12:00–13:00
 *   5: [ { from: 1080, to: 1140 } ]                             // Friday 18:00–19:00
 * }
 */
export type HCalendarSpecialTimeMap =  {
  [key in DayOfWeek]?: HCalendarSpecialTime[]
}

/**
 * Defines a calendar event shown on the calendar.
 *
 * Supports both formatted date strings (e.g., '2025-06-16 10:00')
 * and JavaScript `Date` objects for `start` and `end` fields.
 *
 * Optional fields can control how the event is rendered or interacted with.
 * These map directly to `vue-cal` behavior.
 *
 * @example
 * {
 *   start: '2025-07-01 09:00',
 *   end: '2025-07-01 10:30',
 *   title: 'Team Meeting',
 *   background: true,
 *   deletable: true,
 *   class: 'event-blue'
 * }
 */
export type HCalendarEvent = {
  start: Date | string;
  end: Date | string;
  title?: string;
  content?: string;
  class?: string;
  /**
   * If true, the event is treated as a background highlight.
   * Does not display as a block, but colors the background area.
   */
  background?: boolean;
  /**
   * Optional `vue-cal` property to group events or apply external schedule logic.
   */
  schedule?: number;
  /**
   * If true, the event spans the whole day without a specific time.
   */
  allDay?: boolean;
  /**
   * If true, the user can delete this event.
   */
  deletable?: boolean;
  /**
   * If true, the user cannot resize this event.
   */
  resizable?: boolean;
}

/**
 * This is config about the column.
 */
export interface HGridColumn {
  /**
   * Required value. It is the id of the column.
   */
  id: string
  /**
   * The name of the column. If null, the grid Id is inserted.
   */
  name?: string
  /**
   * Header text value. Use ';' as the delimiter. Empty values are automatically merged.
   */
  header?: string
  /**
   * Insert the footer using ';' as the delimiter. General text: Insert the string as text in the footer.
   * $$MAX: Calculate and display the maximum value in the footer.
   * $$MIN: Calculate and display the minimum value in the footer.
   * $$SUM: Calculate and display the sum in the footer.
   * $$AVG: Calculate and display the average in the footer (excluding null).
   */
  footer?: string
  /**
   * Sets the type of the column.
   * text: Text input type. A textarea input box is created on double click.
   * number: Number input type. An input number type is created on double click.
   * date: Date input type. An input date type is created on double click.
   * month: Month input type. An input month type is created on double click.
   * mask: Text input type that matches the format. An input text type is created on double click. Controlled by the format attribute.
   * select: Input select type. Options are received when inserting values. Ex) [{value:"val1", text:"text1", selected:true},{value:"val2", text:"text2"}..]
   * checkbox: Input checkbox type. Checked if it matches the checkedValue of the grid info, unchecked otherwise.
   * button: Button type. The inserted value is displayed as the innerText of the button. If there is no value, the button is not created.
   * link: a tag. Insert the value as an object in the form {text:"text", value:"https://..", target:"_blank"}. The text is set as innerText, the value as href, and the target as target.
   * code: A type that cannot have or display values other than the specified codes. If nullValue is not in the codes, it is not allowed. Empty values are stored as default-code.
   */
  dataType?: string
  /**
   * If untarget is true, the cells in this column cannot be selected.
   */
  untarget?: boolean
  /**
   * If rowMerge is true, this column merges rows based on the cell above if the value, data-type, and format are the same.
   */
  rowMerge?: boolean
  /**
   * If colMerge is true, this column merges columns based on the cell in front if the value, data-type, and format are the same.
   */
  colMerge?: boolean
  /**
   * If visible is false, this column's width becomes 0 and size cannot be changed (hidden).
   */
  visible?: boolean
  /**
   * If required is true, this column can be checked for input using the checkRequired() method.
   */
  required?: boolean
  /**
   * If resizable is false, the user cannot change the width size of this column.
   */
  resizable?: boolean
  /**
   * Indicates whether the user can use the sorting feature for this column.
   */
  sortable?: boolean
  /**
   * Indicates whether the user can use the filtering feature for this column.
   */
  filterable?: boolean
  /**
   * The width of the column. Insert cssText. If only a number is entered, the unit is 'px'.
   */
  width?: string
  /**
   * Sets the select width size for this column. Insert cssText. The unit can only be px or %.
   */
  selectSize?: string
  /**
   * If locked is true, the cells in this column cannot be changed.
   */
  locked?: boolean
  /**
   * If lockedColor is true, the cells in this column will display a background color indicating the locked state when locked.
   */
  lockedColor?: boolean
  /**
   * Sets the format for data-type mask, number.
   * Mask format: A: Uppercase letter, a: Lowercase letter, 9: Number, others: Matching character.
   * Ex) format: "AAA-991", value: "ABC-123456" => result: "ABC-12"
   * 
   * Number format:
   * Integer part:
   * "#,###": Display with thousand separators, 0 is displayed as null, "#,##0": Display with thousand separators,
   * 0 is displayed as 0, "#": Display as is, 0 is displayed as null, "0": Display as is, 0 is displayed as 0.
   * Decimal part: "#": Display if present, "0": Display as 0 if not present.
   * Others: Characters before and after are displayed as is, and if the last character is "%", it is displayed as a percentage.
   * Ex1) format: "#,##0.## $", number: 1234.1234 => result: "1,234.12 $"
   * Ex2) format: "0%", number: 0.12 => result: "12%"
   */
  format?: string
  /**
   * Valid only for columns with data-type code. Sets codes separated by ";". This column can only have the specified code values.
   * Ex) "US;KR;JP" => Can only have the values "US", "KR", "JP"
   */
  codes?: string
  /**
   * Valid only for columns with data-type code. If a column with data-type code has no value, the default-code is used as the value instead of grid.info's nullValue.
   */
  defaultCode?: string
  /**
   * Valid only for columns with data-type text. Sets the maximum string length that can be inserted into the value. Enter only positive integers.
   */
  maxLength?: number
  /**
   * Valid only for columns with data-type text. Sets the maximum byte size of the string that can be inserted into the value. Enter only positive integers.
   * Byte size criteria are set with vg.lessoreq0x7ffByte, vg.lessoreq0xffffByte, vg.greater0xffffByte.
   * lessoreq0x7ffByte: Characters with charCode less than or equal to 0x7FF, default value is 2 (common symbols or English alphabet based on UTF-8).
   * lessoreq0xffffByte: Characters with charCode less than or equal to 0xFFFF, default value is 3 (additional alphabets such as Latin based on UTF-8).
   * greater0xffffByte: Characters with charCode greater than 0xFFFF, default value is 4 (emoji, Korean, Chinese, Japanese, etc. based on UTF-8).
   */
  maxByte?: number
  /**
   * Valid only for columns with data-type number. Sets the maximum value. If a value exceeding this is entered, it is stored as the maximum value. Enter only numbers.
   */
  maxNumber?: number
  /**
   * Valid only for columns with data-type number. Sets the minimum value. If a value below this is entered, it is stored as the minimum value. Enter only numbers.
   */
  minNumber?: number
  /**
   * Valid only for columns with data-type number. Specifies the rounding place.
   * roundNumber positive integer: Specifies the decimal place to round.
   * roundNumber negative integer: Specifies the integer place to round.
   * Ex) roundNumber: 2, number: 1234.1234 => result: 1234.12
   * Ex) roundNumber: -2, number: 1234.1234 => result: 1200
   */
  roundNumber?: number
  /**
   * Sets the align of the column. Choose from 'left', 'center', 'right'. If no value is specified, the default align follows the data-type.
   * text, mask: left, number: right, date, month, code, select, checkbox, button, link: center.
   */
  align?: GridAlign
  /**
   * Sets the default vertical-align of the column. Choose from 'top', 'center', 'bottom'. If no value is specified, it defaults to center.
   */
  verticalAlign?: GridVerticalAlign
  /**
   * Sets the default overflow-wrap of the column. Enter the overflow-wrap in cssText.
   */
  overflowWrap?: string
  /**
   * Sets the default word-break of the column. Enter the word-break in cssText.
   */
  wordBreak?: string
  /**
   * Sets the default white-space of the column. Enter the white-space in cssText.
   */
  whiteSpace?: string
  /**
   * Sets the background color of the column. Insert the 16-digit color code in cssText. Ex) "#ffffff"
   */
  backColor?: string
  /**
   * Sets the font color of the column. Insert the 16-digit color code in cssText. Ex) "#ffffff"
   */
  fontColor?: string
  /**
   * If fontBold is true, the innerText of the column's cells will be bold.
   */
  fontBold?: boolean
  /**
   * If fontItalic is true, the innerText of the column's cells will be italic.
   */
  fontItalic?: boolean
  /**
   * If fontThruline is true, the innerText of the column's cells will have a strikethrough.
   */
  fontThruline?: boolean
  /**
   * If fontUnderline is true, the innerText of the column's cells will be underlined.
   */
  fontUnderline?: boolean
}

/**
 * Basic methods in all components
 */
export interface ComponentMethods {
  /**
   * Returns the unique ID of the component.
   * This is the same as the `id` prop (or auto-generated if not set).
   */
  getId(): string
  /**
   * Returns the type of the component.
   */
  getType(): string
}

/**
 * Provides various methods to manipulate and manage a Vanillagrid instance.
 *
 * - This interface includes over 200 methods for handling grid structure, data,
 *   filtering, sorting, appearance, and user interactions.
 * - A `GridMethods` instance can be retrieved using `vg.getGrid({gridId})`.
 * - It allows users to dynamically modify grid properties, update cell values,
 *   and customize the grid's behavior through predefined methods.
 *
 * ### Key Features:
 * - Manage grid headers, footers, rows, and columns.
 * - Load and retrieve data as JSON.
 * - Apply filters, sorting, and styling dynamically.
 * - Control grid visibility, locking, and resizing.
 * - Undo and redo changes within the grid.
 *
 * ### Example usage:
 * ```typescript
 * const grid = vg.getGrid('gridId');
 * grid.setHeaderText('col1', 'New Header');
 * grid.setCellValue(1, 'col1', 'Updated Value');
 * ```
 */
export interface HGridMethods extends ComponentMethods, Omit<GridMethods, 'isGridVisible' | 'setGridVisible'>{
  /**
   * Returns the type of the grid.
   */
  getType(): 'grid'
  /**
   * Returns whether the grid is currently visible.
   * - `false` means `display: none` is applied.
   */
  isVisible(): boolean;
  /**
   * Shows or hides the grid.
   * - `true` makes the grid visible.
   * - `false` applies `display: none`.
   */
  setVisible(visible: boolean): void;
}

/**
 * Represents a single editable Vanillanote instance within the DOM.
 *
 * - Each Vanillanote editor on the page is mounted into a `VanillanoteElement`,
 *   which extends `HTMLDivElement` and adds additional internal properties and methods.
 * - All editors are dynamically generated based on a `<div data-vanillanote>` element.
 * - Editors are automatically assigned a unique `_id`, based on creation order or a custom `data-id`.
 * - Each `VanillanoteElement` manages its own selection state, styling, events, attachment data, and DOM references.
 *
 * ### Key Features:
 * - Manages internal selections, styles, file attachments, and UI states independently per editor.
 * - Provides API methods like `getNoteData()` to export editor content and `setNoteData()` to restore editor state.
 * - Supports rich text editing features including text styling, file/image/video attachment, undo/redo history, placeholders, and more.
 * - Integrates before/after event hooks to customize interaction behaviors.
 *
 * ### Internal Structure:
 * - `_selection`: Tracks selection state like current selection range, start/end nodes, and drag selections.
 * - `_attributes`: Stores editor behavior settings like device mode, language, and size constraints.
 * - `_status`: Stores current toggled states (e.g., bold active, selected color).
 * - `_elements`: References to important DOM elements (textarea, toolbar buttons, modals, etc.).
 * - `_cssEvents`: Low-level event handlers (click, touch) for custom interaction logic.
 * - `_elementEvents`: High-level hooks for specific UI elements.
 * - `_attFiles`, `_attImages`: Manage attached files/images.
 * - `_recodes`: Manage undo/redo history for editing actions.
 *
 * ### Usage Example:
 * ```ts
 * const note = Vanillanote.getNote('my-editor-id');
 * const data = note.getNoteData();
 *
 * console.log(data.html); // Editor HTML content
 * editor.setNoteData(data); // Restore content
 * ```
 *
 * @remarks
 * - `VanillanoteElement` is automatically created when calling `vn.mountNote()`.
 * - It should not be manually instantiated by developers.
 * - Each `VanillanoteElement` belongs to a shared singleton `Vanillanote` object.
 * - Supports multiple editors per page.
 *
 * @see Vanillanote
 * @see getNoteData
 * @see setNoteData
 */
export interface HNoteElement extends ComponentMethods, VanillanoteElement {
  /**
   * Returns the type of the note.
   */
  getType(): 'note'
  /**
   * Gets whether the note is currently required.
   * - If `true`, the note will show a visual required style.
   */
  getRequired(): boolean;
  /**
   * Sets the required state of the note.
   */
  setRequired(required: boolean): void;
  /**
   * Returns whether the note is currently visible.
   * - `false` means `display: none` is applied.
   */
  isVisible(): boolean;
  /**
   * Shows or hides the note.
   * - `true` makes the note visible.
   * - `false` applies `display: none`.
   */
  setVisible(visible: boolean): void;
  /**
   * Gets the current edit mode.
   * - Possible values: `'editable'`, `'readonly'`, `'disable'`
   */
  getEditMode(): EditMode;
  /**
   * Sets the edit mode of the note.
   * - `'readonly'` and `'disable'` both prevent editing but differ in style.
   */
  setEditMode(mode: EditMode): void;
  /**
   * Returns whether any note inside the group has been modified by user interaction.
   * 
   * @returns `true` if at least one note is marked as modified.
   */
  isModified(): boolean;
  /**
   * Resets the modification status of all notes in the group.
   * 
   * Typically called after saving or loading new data.
   */
  initModified(): void;
  /**
   * Focus on the note.
   */
  focus(): void;
}

/**
 * Runtime control methods for `HButton` component.
 *
 * This interface defines methods that can be accessed via `hison.vue.getButton(id)`.
 * Use these methods to manipulate button state programmatically at runtime.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const btn = hison.vue.getButton('btn01');
 * btn.setVisible(false);
 * btn.setDisable(true);
 * btn.setText('Loading...');
 * btn.setTitle('Please wait');
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - `setText` and `getText` only work if the button **does not use a slot**.
 * - All changes are reactive and immediately reflected in the DOM.
 */
export interface HButtonMethods extends ComponentMethods {
  /**
   * Returns the type of the button.
   */
  getType(): 'button'
  /**
   * Gets the current button text.
   * - Returns `''` if the button uses a `<slot>`.
   * - Returns the internally managed `text` otherwise.
   */
  getText(): string;
  /**
   * Gets the current tooltip (title) of the button.
   * - Reflects the current `title` attribute shown on hover.
   */
  getTitle(): string;
  /**
   * Returns whether the button is currently disabled.
   * - `true` means the button cannot be clicked.
   */
  isDisable(): boolean;
  /**
   * Returns whether the button is currently visible.
   * - `false` means `display: none` is applied.
   */
  isVisible(): boolean;
  /**
   * Sets the button text (only if no slot is used).
   * - If a slot is used, this has no effect.
   * - Updates internal reactive `text` state.
   */
  setText(text: string): void;
  /**
   * Sets the button tooltip (title) text.
   * - Affects what appears on hover.
   */
  setTitle(title: string): void;
  /**
   * Enables or disables the button.
   * - When disabled, button is grayed out and not clickable.
   */
  setDisable(disable: boolean): void;
  /**
   * Shows or hides the button.
   * - `true` makes the button visible.
   * - `false` applies `display: none`.
   */
  setVisible(visible: boolean): void;
  /**
   * Focus on the button.
   */
  focus(): void;
}

/**
 * Runtime control methods for `HLayout` component.
 *
 * This interface defines programmatic access to a layout's visibility,
 * background, border, and layout styling. You can retrieve an instance
 * using `hison.vue.getLayout(id)`.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const layout = hison.vue.getLayout('layout01');
 * layout.setVisible(true);
 * layout.setBackColor('primary');
 * layout.setBackImageSrc('/assets/bg.jpg');
 * layout.setHeight('300px');
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - All methods are reactive and immediately affect the DOM.
 * - Background-related methods directly modify the `style` attribute of the layout.
 */
export interface HLayoutMethods extends ComponentMethods {
  /**
   * Returns the type of the layout.
   */
  getType(): 'layout'
  /**
   * Returns whether the layout is currently visible.
   * `false` means `display: none` is applied.
   */
  isVisible(): boolean;
  /**
   * Shows or hides the layout.
   * - `true` makes it visible.
   * - `false` sets `display: none`.
   */
  setVisible(visible: boolean): void;
  /**
   * Gets the current background image URL (`background-image`).
   */
  getBackImageSrc(): string;
  /**
   * Sets the background image URL.
   * Applies to `background-image` via `url(...)`.
   */
  setBackImageSrc(src: string): void;
  /**
   * Gets the background repeat or scaling mode.
   * Corresponds to `background-repeat` or `background-size`.
   */
  getBackImageRepeat(): string;
  /**
   * Sets the background repeat or scale style.
   * Examples: `'no-repeat'`, `'repeat'`, `'cover'`, `'contain'`
   */
  setBackImageRepeat(cssText: string): void;
  /**
   * Gets the background image width setting (`background-size`).
   * Examples: `'100%'`, `'300px'`
   */
  getBackImageWidth(): string;
  /**
   * Sets the background image width (`background-size`).
   */
  setBackImageWidth(cssText: string): void;
  /**
   * Gets the horizontal alignment of the background image.
   * Values: `'left'`, `'center'`, `'right'`
   */
  getBackImageAlign(): string;
  /**
   * Sets the horizontal alignment of the background image.
   */
  setBackImageAlign(cssText: string): void;
  /**
   * Gets the vertical alignment of the background image.
   * Values: `'top'`, `'center'`, `'bottom'`
   */
  getBackImageVerticalAlign(): string;
  /**
   * Sets the vertical alignment of the background image.
   */
  setBackImageVerticalAlign(cssText: string): void;
  /**
   * Gets the background color of the layout.
   * May be a hex color, rgba string, or keyword (e.g. `'primary'`).
   */
  getBackColor(): string;
  /**
   * Sets the background color.
   * Accepts hex, rgba, or `hison` keyword values (`'primary'`, `'danger'`, etc.).
   */
  setBackColor(cssText: string): void;
  /**
   * Gets the current border color of the layout.
   * Same format as background color.
   */
  getBorderColor(): string;
  /**
   * Sets the border color.
   * Automatically applies `border-style: solid`.
   */
  setBorderColor(cssText: string): void;
  /**
   * Gets the current border width (e.g. `'1px'`, `'0.5rem'`).
   */
  getBorderWidth(): string;
  /**
   * Sets the border width.
   * Automatically applies `border-style: solid`.
   */
  setBorderWidth(cssText: string): void;
  /**
   * Gets the current height of the layout container.
   * Examples: `'100px'`, `'50%'`, `'auto'`, `'100vh'`
   */
  getHeight(): string;
  /**
   * Sets the height of the layout container.
   */
  setHeight(cssText: string): void;
}

/**
 * Runtime control methods for `HInput` component.
 *
 * This interface defines methods accessible via `hison.vue.getInput(id)`.
 * It enables full runtime control over the input’s value, style, state, and formatting.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const input = hison.vue.getInput('input01');
 * input.setValue('123456');
 * input.setVisible(true);
 * input.setFormat('###-###');
 * input.setEditMode('readonly');
 * input.setFontUnderline(true);
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - All changes are reactive and immediately reflected in the DOM.
 * - Formatting is internally handled via `hison.utils` functions.
 * - Input can operate in `editable`, `readonly`, or `disable` mode.
 */
export interface HInputMethods extends ComponentMethods {
  /**
   * Returns the type of the input.
   */
  getType(): 'input'
  /**
   * Returns the formatted display text shown in the span layer.
   * - Applies `format`, `nullText`, and masking logic based on `type`.
   */
  getText(): string;
  /**
   * Gets the current raw input value (after internal processing).
   * - For example, digit-only inputs are stripped via `getDigitsOnly`.
   */
  getValue(): any;
  /**
   * Sets the current input value.
   * - Automatically re-applies formatting and validation.
   */
  setValue(value: any): void;
  /**
   * Gets the current input type.
   * - Matches the `InputType` enum (e.g., `'text'`, `'date'`, `'number'`, etc.)
   */
  getInputType(): InputType;
  /**
   * Sets the input type.
   * - Automatically adjusts formatting/rendering logic.
   */
  setInputType(type: InputType): void;
  /**
   * Gets the format string used to format the value.
   * - Affects `'number'`, `'mask'`, `'date'`, `'month'` types.
   */
  getFormat(): string;
  /**
   * Sets the input format.
   * - Uses `hison.utils.getDateWithFormat`, `getNumberFormat`, etc.
   */
  setFormat(format: string): void;
  /**
   * Returns whether the input is currently visible.
   * - `false` means `display: none` is applied.
   */
  isVisible(): boolean;
  /**
   * Shows or hides the input.
   * - `true` makes the input visible.
   * - `false` hides it using `display: none`.
   */
  setVisible(visible: boolean): void;
  /**
   * Gets the tooltip (title attribute) of the input.
   */
  getTitle(): string;
  /**
   * Sets the tooltip (title attribute) of the input.
   * - Appears on hover.
   */
  setTitle(title: string): void;
  /**
   * Gets the current `nullText` string used when value is empty.
   */
  getNullText(): string;
  /**
   * Sets the `nullText` to display when the value is empty or null.
   */
  setNullText(nullText: string): void;
  /**
   * Gets the current edit mode.
   * - Possible values: `'editable'`, `'readonly'`, `'disable'`
   */
  getEditMode(): EditMode;
  /**
   * Sets the edit mode of the input.
   * - `'readonly'` and `'disable'` both prevent editing but differ in style.
   */
  setEditMode(mode: EditMode): void;
  /**
   * Gets the maximum allowed numeric value (if applicable).
   * - Only applies when `type === 'number'`
   */
  getMaxNumber(): number | null;
  /**
   * Sets the maximum numeric value.
   * - Enforced on input and formatting.
   */
  setMaxNumber(maxNumber: number): void;
  /**
   * Gets the minimum allowed numeric value.
   */
  getMinNumber(): number | null;
  /**
   * Sets the minimum numeric value.
   * - Enforced during input.
   */
  setMinNumber(minNumber: number): void;
  /**
   * Gets the rounding precision for numeric values.
   * - Applies only to `type === 'number'`
   */
  getRoundNumber(): number | null;
  /**
   * Sets the rounding precision.
   * - Accepts positive/negative integers or `0`.
   */
  setRoundNumber(roundNumber: number): void;
  /**
   * Gets the current maximum character length allowed.
   * - Input is truncated if exceeded.
   */
  getMaxLength(): number | null;
  /**
   * Sets the maximum allowed character length.
   */
  setMaxLength(maxLength: number): void;
  /**
   * Gets the maximum allowed byte size.
   * - Uses UTF-8 encoding logic via `hison.utils.getCutByteLength()`.
   */
  getMaxByte(): number | null;
  /**
   * Sets the maximum allowed byte size.
   * - Truncates input based on encoded byte length.
   */
  setMaxByte(maxByte: number): void;
  /**
   * Gets whether the input is currently required.
   * - If `true`, the input will show a visual required style.
   */
  getRequired(): boolean;
  /**
   * Sets the required state of the input.
   */
  setRequired(required: boolean): void;
  /**
   * Gets the current placeholder text.
   */
  getPlaceholder(): string;
  /**
   * Sets the placeholder text.
   * - Maps to the native `placeholder` attribute.
   */
  setPlaceholder(placeholder: string): void;
  /**
   * Returns whether bold font is applied to the span text.
   */
  isFontBold(): boolean;
  /**
   * Applies or removes bold style from the span text.
   */
  setFontBold(bold: boolean): void;
  /**
   * Returns whether italic font is applied to the span text.
   */
  isFontItalic(): boolean;
  /**
   * Applies or removes italic style from the span text.
   */
  setFontItalic(italic: boolean): void;
  /**
   * Returns whether strikethrough is applied to the span text.
   */
  isFontThruline(): boolean;
  /**
   * Applies or removes strikethrough style from the span text.
   */
  setFontThruline(thruline: boolean): void;
  /**
   * Returns whether underline is applied to the span text.
   */
  isFontUnderline(): boolean;
  /**
   * Applies or removes underline style from the span text.
   */
  setFontUnderline(underline: boolean): void;
  /**
   * Returns whether the input value has been modified since initial load or last reset.
   * - Modification is only tracked via user interactions (`onInput`, `onBlur`).
   * - This is used by parent components like `HInputGroup` to determine group-level state.
   */
  isModified(): boolean;
  /**
   * Sets the modified state of the input manually.
   * - Typically used by container components (e.g., `HInputGroup`) to reset modification tracking.
   * @param modified A boolean indicating whether the input should be marked as modified.
   */
  setModified(modified: boolean): void;
  /**
   * Focus on the input.
   */
  focus(): void;
}

/**
 * Runtime control methods for `HInputGroup` component.
 *
 * This interface defines the available methods on `HInputGroup`,
 * accessible via `hison.vue.getInputGroup(id)`, to programmatically control
 * input group behaviors, state tracking, and data retrieval.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const group = hison.vue.getInputGroup('inputGroup1');
 * group.load({ userid: 'hison', email: 'a@b.com' });
 * group.setStatus('U');
 * if (group.isModified()) {
 *   const updated = group.getDataWrapper();
 *   saveToServer(updated);
 * }
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - `HInputGroup` tracks internal status (`R`, `C`, `U`, `D`) to reflect data lifecycle.
 * - Modification is automatically tracked when any child input emits a user-driven change.
 * - Supports runtime edit mode toggle and required-field validation.
 */
export interface HInputGroupMethods extends ComponentMethods {
  /**
   * Returns the type identifier for the component.
   * Always returns `'inputGroup'`.
   */
  getType(): 'inputGroup';
  /**
   * Clears all values inside the group’s child inputs.
   * 
   * @param autoSetStatus If `true`, resets status to `'C'` (created) and clears modification state.
   */
  clear(autoSetStatus?: boolean): void;
  /**
   * Retrieves the current input values as a `DataWrapper` instance.
   * 
   * @returns A `DataWrapper` object that holds key-value pairs of group input values.
   */
  getDataWrapper(): InterfaceDataWrapper;
  /**
   * Retrieves the current input values as a `DataModel` instance.
   * 
   * @returns A `DataModel` object representing the group data as a table (1 row).
   */
  getDataModel(): InterfaceDataModel;
  /**
   * Retrieves the current input values as a plain JavaScript object.
   * 
   * @returns An object with keys matching input IDs and values as their current values.
   */
  getDataObject(): Record<string, any>;
  /**
   * Loads data into the group’s inputs.
   * 
   * Supports `Record<string, any>`, `DataModel`, or `DataWrapper` as source.
   *
   * @param data The data source to apply to the group inputs.
   * @param autoSetStatus If `true`, resets status to `'R'` (read) and clears modification state.
   */
  load(data: Record<string, any> | InterfaceDataModel | InterfaceDataWrapper, autoSetStatus?: boolean): void;
  /**
   * Returns the current status of the input group.
   *
   * - `R`: Read
   * - `C`: Created
   * - `U`: Updated
   * - `D`: Deleted
   */
  getStatus(): DataStatus;
  /**
   * Sets the status of the input group.
   *
   * Used to manually change the internal data lifecycle state.
   * 
   * @param status A valid `DataStatus` value (`R`, `C`, `U`, `D`).
   */
  setStatus(status: DataStatus): void;
  /**
   * Returns whether any input inside the group has been modified by user interaction.
   * 
   * @returns `true` if at least one input is marked as modified.
   */
  isModified(): boolean;
  /**
   * Resets the modification status of all inputs in the group.
   * 
   * Typically called after saving or loading new data.
   */
  initModified(): void;
  /**
   * Validates required fields in the group.
   * 
   * Checks all child `HInput` and `HNote` components with `required=true`.
   *
   * @returns The first invalid component’s method instance, or `null` if all pass.
   */
  checkRequired(): HInputMethods | null;
  /**
   * Gets the current edit mode of the group.
   *
   * Possible values:
   * - `'editable'`: Inputs are editable
   * - `'readonly'`: Inputs are readonly (visually different)
   * - `'disable'`: Inputs are disabled (fully blocked)
   */
  getEditMode(): EditMode;
  /**
   * Sets the edit mode for all inputs in the group.
   *
   * @param mode One of: `'editable'`, `'readonly'`, `'disable'`
   */
  setEditMode(mode: EditMode): void;
  /**
   * Focus on the first input that is editable.
   *
   * - The order of input components in the view may not follow the rendered DOM order due to Vue's mounting behavior.
   * - Therefore, the inputs are sorted alphabetically by their assigned string `id` before applying focus.
   */
  focus(): void;
}

/**
 * Runtime control methods for `HCalendar` component.
 *
 * This interface defines the available methods on `HCalendar`,
 * accessible via `hison.vue.getCalendar(id)`, to programmatically control
 * calendar state, selected date, events, and display configuration.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const calendar = hison.vue.getCalendar('cal1');
 * calendar.setSelectedDate('2025-07-01');
 * calendar.setDisable(true);
 * calendar.setVisible(false);
 *
 * const events = calendar.getEvents();
 * calendar.setEvents([...events, { start: '2025-07-02 10:00', end: '2025-07-02 11:00', title: 'Meeting' }]);
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - Each `HCalendar` instance is automatically registered by `id` via `hison.vue.getCalendar(id)`.
 * - Style-related changes (e.g. `weekendColor`, `selectedColor`) are applied via dynamic CSS variables.
 * - Date/time options use minutes (0~1440) where applicable (e.g. `timeFrom`, `timeTo`).
 * - Some properties like view mode (`setActiveView`) or locale (`setLocale`) can be changed live without re-render.
 * - `HCalendar` supports both `v-model:selected-date` and `v-model:events`, but changes via method calls will override both.
 */
export interface HCalendarMethods extends ComponentMethods {
  /**
   * Returns the type identifier for the component.
   * Always returns `'calendar'`.
   */
  getType(): 'calendar';
  /**
   * Returns whether the calendar is currently disabled.
   * - `true` means the calendar cannot be clicked.
   */
  isDisable(): boolean;
  /**
   * Enables or disables the calendar.
   * - When disabled, calendar is grayed out and not clickable.
   * @param disable
   */
  setDisable(disable: boolean): void;
  /**
   * Returns whether the calendar is currently visible.
   * - `false` means `display: none` is applied.
   */
  isVisible(): boolean;
  /**
   * Shows or hides the calendar.
   * - `true` makes the calendar visible.
   * - `false` applies `display: none`.
   * @param visible
   */
  setVisible(visible: boolean): void;
  /**
   * Returns the currently selected date.
   * @param getDateType If `true`, returns a `Date` object; otherwise returns a formatted string.
   * @param format Optional format string. Defaults to global hison datetime format.
   */
  getSelectedDate(getDateType?: boolean, format?: string): string | Date;
  /**
   * Sets the selected date in the calendar.
   * @param selectedDate A string or Date object.
   */
  setSelectedDate(selectedDate: string | Date): void;
  /**
   * Returns the array of events currently displayed in the calendar.
   */
  getEvents(): HCalendarEvent[];
  /**
   * Updates the calendar events array.
   * @param events List of events to set.
   */
  setEvents(events: HCalendarEvent[]): void;
  /**
   * Returns the map of special time highlights.
   */
  getSpecialTime(): HCalendarSpecialTimeMap;
  /**
   * Sets special time ranges for specific days of the week.
   * @param specialTimeMap Object mapping day index to time ranges.
   */
  setSpecialTime(specialTimeMap: HCalendarSpecialTimeMap): void;
  /**
   * Returns the background color for weekend header cells.
   */
  getWeekendColor(): string | undefined;
  /**
   * Sets the weekend header background color.
   * @param cssText CSS color value (e.g., `#ff0000`, `rgba(...)`).
   */
  setWeekendColor(cssText: string): void;
    /**
   * Returns which weekday indices are considered weekends.
   */
  getWeekendDays(): number[] | undefined;
  /**
   * Sets which weekday indices are treated as weekends.
   * @param weekendDays Array of day indices (0 = Sunday).
   */
  setWeekendDays(weekendDays: number[]): void;
  /**
   * Returns whether today is highlighted with background color.
   */
  isShowTodayColor(): boolean;
  /**
   * Enables or disables special background highlight for today's date.
   * @param showTodayColor Boolean
   */
  setShowTodayColor(showTodayColor: boolean): void;
  /**
   * Returns the background color for the selected date.
   */
  getSelectedColor(): string | undefined;
  /**
   * Sets the background color for the selected date cell.
   * @param cssText (e.g., '#ff0000' or 'rgba(255,0,0,0.2)')
   */
  setSelectedColor(cssText: string): void;
  /**
   * Returns the minimum height (in px) for date cells in month view.
   */
  getDateCellMinHeight(): number | undefined;
  /**
   * Sets the minimum height (in px) for date cells in month view.
   * @param minHeight number of px
   */
  setDateCellMinHeight(minHeight: number): void;
  /**
   * Returns the maximum height (in px) for date cells in month view.
   */
  getDateCellMaxHeight(): number | undefined;
  /**
   * Sets the maximum height (in px) for date cells in month view.
   * @param maxHeight number of px
   */
  setDateCellMaxHeight(maxHeight: number): void;
  /**
   * Returns the list of disabled dates.
   * - These are dates that users cannot select in the calendar.
   */
  getDisableDays(): string[] | undefined;
  /**
   * Sets the list of disabled dates.
   * @param disableDays array of string dates (e.g., ['2025-06-26', '2025-06-27'])
   */
  setDisableDays(disableDays: string[]): void;
  /**
   * Returns the current setting for month view event display.
   * - Can be `false`, `'short'`, or other strings for full event text.
   */
  getEventsOnMonthView(): string | boolean | undefined;
  /**
   * Sets how events are displayed in the month view.
   * @param eventsOnMonthView
   * - `false`: shows event count only
   * - `'short'`: shows only titles
   * - others: shows full event contents
   */
  setEventsOnMonthView(eventsOnMonthView: string | boolean): void;
  /**
   * Returns which weekdays are currently hidden.
   * - Array of weekday indexes: 0 = Sunday, 6 = Saturday
   */
  getHideWeekdays(): number[] | undefined;
  /**
   * Hides or shows specific weekdays.
   * @param hideWeekdays Array of weekday indexes to hide (e.g., [2,3] to hide Tue/Wed)
   */
  setHideWeekdays(hideWeekdays: number[]): void;
  /**
   * Returns whether weekends (Saturday and Sunday) are currently hidden.
   */
  getHideWeekends(): boolean;
  /**
   * Hides or shows weekends in the calendar.
   * @param hideWeekends
   */
  setHideWeekends(hideWeekends: boolean): void;
  /**
   * Returns the current locale (language code).
   * - Example: 'en', 'ko'
   */
  getLocale(): string;
  /**
   * Sets the calendar language (locale).
   * - Example: 'fr', 'zh-cn'
   * @param locale See vue-cal docs for full list of locales
   */
  setLocale(locale: string): void;
  /**
   * Returns the maximum selectable date.
   * @param getDateType If `true`, returns a Date object; otherwise returns a string.
  */
  getMaxDate(getDateType?: boolean): string | Date | undefined | null;
  /**
   * Sets the maximum date users can select.
   * @param maxDate A string or Date object.
   */
  setMaxDate(maxDate: string | Date): void;
  /**
   * Returns the minimum selectable date.
   * @param getDateType If `true`, returns a Date object; otherwise returns a string.
   */
  getMinDate(getDateType?: boolean): string | Date | undefined | null;
  /**
   * Sets the minimum date users can select.
   * @param minDate A string or Date object.
   */
  setMinDate(minDate: string | Date): void;
  /**
   * Returns whether the week starts on Sunday.
   * - `true`: Sunday, `false`: Monday
   */
  isStartWeekOnSunday(): boolean;
  /**
   * Sets the start day of the week.
   * @param startWeekOnSunday `true` for Sunday, `false` for Monday
   */
  setStartWeekOnSunday(startWeekOnSunday: boolean): void;
  /**
   * Returns whether time cells are currently shown in 'day' or 'week' views.
   * - Equivalent to the `time` prop.
   */
  isShowTimeCell(): boolean;
  /**
   * Enables or disables display of time cells.
   * @param showTimeCell `true` to show time column, `false` to hide
   */
  setShowTimeCell(showTimeCell: boolean): void;
  /**
   * Returns the height (in pixels) of each time cell.
   */
  getTimeCellHeight(): number | undefined;
  /**
   * Sets the height (in pixels) of each time cell.
   * @param timeCellHeight A positive number (e.g., `40`)
   */
  setTimeCellHeight(timeCellHeight: number): void;
  /**
   * Returns the current time format used in the time column.
   */
  getTimeFormat(): string | undefined;
  /**
   * Sets the time format used for displaying time cells.
   * @param timeFormat Format string from `HCalenderTimeFormat` enum
   */
  setTimeFormat(timeFormat: HCalenderTimeFormat): void;
  /**
   * Returns the start time of the time axis (in minutes).
   */
  getTimeFrom(): number | undefined;
  /**
   * Sets the start time of the time axis (in minutes).
   * @param timeFrom A number between 0 and 1440 (e.g., `9 * 60` = 9:00 AM)
   */
  setTimeFrom(timeFrom: number): void;
  /**
   * Returns the time step between time cells (in minutes).
   */
  getTimeStep(): number | undefined;
  /**
   * Sets the time step interval for time cells.
   * @param timeStep A number between 1 and 60 (e.g., `30` for half-hour blocks)
   */
  setTimeStep(timeStep: number): void;
  /**
   * Returns the end time of the time axis (in minutes).
   */
  getTimeTo(): number | undefined;
  /**
   * Sets the end time of the time axis (in minutes).
   * @param timeTo A number between 0 and 1440 (e.g., `18 * 60` = 6:00 PM)
   */
  setTimeTo(timeTo: number): void;
  /**
   * Returns whether the title bar (month/year label & arrows) is hidden.
   */
  isHideTitleBar(): boolean;
  /**
   * Shows or hides the title bar at the top of the calendar.
   * @param hideTitleBar `true` to hide, `false` to show
   */
  setHideTitleBar(hideTitleBar: boolean): void;
  /**
   * Returns whether the calendar is using 12-hour AM/PM format.
   */
  isTwelveHour(): boolean;
  /**
   * Enables or disables 12-hour format display.
   * @param twelveHour `true` for AM/PM display, `false` for 24-hour
   */
  setTwelveHour(twelveHour: boolean): void;
  /**
   * Returns the currently active view mode.
   * - One of `'day'`, `'week'`, `'month'`, `'year'`, `'years'`
   */
  getActiveView(): HCalenderView;
  /**
   * Changes the active calendar view.
   * @param view New view mode from `HCalenderView` enum
   */
  setActiveView(view: HCalenderView): void;
  /**
   * Returns the list of views that are currently disabled.
   */
  getDisableViews(): HCalenderView[] | undefined;
  /**
   * Disables specific view modes to restrict user navigation.
   * @param disableViews Array of view modes to disable
   */
  setDisableViews(disableViews: HCalenderView[]): void;
}

/**
 * Runtime control interface for the `HChart` component.
 *
 * This interface is returned by `hison.vue.getChart(id)` and allows full programmatic control of the chart.
 *
 * ---
 *
 * ### 📊 Example Usage
 * ```ts
 * const chart = hison.vue.getChart('salesChart')
 * if (chart) {
 *   chart.setVisible(true)
 *   chart.data.labels = ['Jan', 'Feb', 'Mar']
 *   chart.data.datasets[0].data = [10, 20, 30]
 *   chart.update()
 * }
 * ```
 *
 * ---
 *
 * ### ⚙️ Chart.js Integration
 * - `HChartInstance` extends [`Chart`](https://www.chartjs.org/docs/latest/api/chart) from Chart.js.
 * - This means **you can directly use all Chart.js instance methods**, such as:
 *   - `.update()`
 *   - `.resize()`
 *   - `.destroy()`
 *   - `.reset()`
 *   - `.render()`
 *   - `.stop()`
 *   - `.toBase64Image()`
 *   - `.getElementsAtEventForMode()`
 * - You also have full access to mutable properties like:
 *   - `chart.data`
 *   - `chart.options`
 *   - `chart.canvas`
 *   - `chart.config`
 *   - `chart.scales`, etc.
 *
 * ---
 *
 * ### ⚠️ Notes
 * - `getChartInstance()` is no longer needed; the entire Chart instance is exposed directly.
 * - `setData()` and `setOptions()` helpers are unnecessary—just mutate `data` or `options` and call `.update()`.
 */
export interface HChartInstance extends ComponentMethods, Chart {
  /**
   * Returns the type identifier.
   * Always returns `'chart'`.
   */
  getType(): 'chart';
  /**
   * Returns whether the chart is currently visible.
   * - `false` means `display: none` is applied.
   */
  isVisible(): boolean;
  /**
   * Shows or hides the chart.
   * - `true` makes the chart visible.
   * - `false` applies `display: none`.
   * @param visible
   */
  setVisible(visible: boolean): void;
}
