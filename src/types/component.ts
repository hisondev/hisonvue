import { GridMethods } from "vanillagrid2"
import { GridAlign, GridVerticalAlign, EditMode, InputType, DataStatus } from "../enums"
import { VanillanoteElement } from "vanillanote2"
import { InterfaceDataModel, InterfaceDataWrapper } from "hisonjs"

export type DeviceType = 'mb' | 'tb' | 'pc' | 'wd'

/**
 * timeFrom: 0 * 60 ~ 24 * 60
 * timeTo: 0 * 60 ~ 24 * 60
 */
export type SpecialTime = {
  timeFrom: number;
  timeTo: number;
}

/**
 * 0 = Sunday ~ 6 = Saturday
 */
export type SpecialTimeMap = {
  [dayOfWeek: number]: SpecialTime[]  // 0~6까지 배열
}

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
export interface HGridMethods extends ComponentMethods, GridMethods{
    /**
     * Returns the type of the grid.
     */
    getType(): 'grid'
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
     * Gets whether the input is currently required.
     * - If `true`, the input will show a visual required style.
     */
    getRequired(): boolean;
    /**
     * Sets the required state of the input.
     */
    setRequired(required: boolean): void;
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
    setBackImageSrc(val: string): void;
    /**
     * Gets the background repeat or scaling mode.
     * Corresponds to `background-repeat` or `background-size`.
     */
    getBackImageRepeat(): string;
    /**
     * Sets the background repeat or scale style.
     * Examples: `'no-repeat'`, `'repeat'`, `'cover'`, `'contain'`
     */
    setBackImageRepeat(val: string): void;
    /**
     * Gets the background image width setting (`background-size`).
     * Examples: `'100%'`, `'300px'`
     */
    getBackImageWidth(): string;
    /**
     * Sets the background image width (`background-size`).
     */
    setBackImageWidth(val: string): void;
    /**
     * Gets the horizontal alignment of the background image.
     * Values: `'left'`, `'center'`, `'right'`
     */
    getBackImageAlign(): string;
    /**
     * Sets the horizontal alignment of the background image.
     */
    setBackImageAlign(val: string): void;
    /**
     * Gets the vertical alignment of the background image.
     * Values: `'top'`, `'center'`, `'bottom'`
     */
    getBackImageVerticalAlign(): string;
    /**
     * Sets the vertical alignment of the background image.
     */
    setBackImageVerticalAlign(val: string): void;
    /**
     * Gets the background color of the layout.
     * May be a hex color, rgba string, or keyword (e.g. `'primary'`).
     */
    getBackColor(): string;
    /**
     * Sets the background color.
     * Accepts hex, rgba, or `hison` keyword values (`'primary'`, `'danger'`, etc.).
     */
    setBackColor(val: string): void;
    /**
     * Gets the current border color of the layout.
     * Same format as background color.
     */
    getBorderColor(): string;
    /**
     * Sets the border color.
     * Automatically applies `border-style: solid`.
     */
    setBorderColor(val: string): void;
    /**
     * Gets the current border width (e.g. `'1px'`, `'0.5rem'`).
     */
    getBorderWidth(): string;
    /**
     * Sets the border width.
     * Automatically applies `border-style: solid`.
     */
    setBorderWidth(val: string): void;
    /**
     * Gets the current height of the layout container.
     * Examples: `'100px'`, `'50%'`, `'auto'`, `'100vh'`
     */
    getHeight(): string;
    /**
     * Sets the height of the layout container.
     */
    setHeight(val: string): void;
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
    getInputType(): keyof typeof InputType;
    /**
     * Sets the input type.
     * - Automatically adjusts formatting/rendering logic.
     */
    setInputType(type: keyof typeof InputType): void;
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
    getEditMode(): keyof typeof EditMode;
    /**
     * Sets the edit mode of the input.
     * - `'readonly'` and `'disable'` both prevent editing but differ in style.
     */
    setEditMode(mode: keyof typeof EditMode): void;
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
}

//Focus 기능 필요!!!!!!!!!!!!
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
  getStatus(): keyof typeof DataStatus;
  /**
   * Sets the status of the input group.
   *
   * Used to manually change the internal data lifecycle state.
   * 
   * @param status A valid `DataStatus` value (`R`, `C`, `U`, `D`).
   */
  setStatus(status: keyof typeof DataStatus): void;
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
  getEditMode(): keyof typeof EditMode;
  /**
   * Sets the edit mode for all inputs in the group.
   *
   * @param mode One of: `'editable'`, `'readonly'`, `'disable'`
   */
  setEditMode(mode: keyof typeof EditMode): void;
}

export interface HCalendarMethods extends ComponentMethods {
  /**
   * Returns the type identifier for the component.
   * Always returns `'calendar'`.
   */
  getType(): 'calendar';
}
