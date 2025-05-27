import { GridMethods } from "vanillagrid2"
import { GridAlign, GridVerticalAlign, InputEditMode, InputType } from "../enums"
import { VanillanoteElement } from "vanillanote2"

export type DeviceType = 'mb' | 'tb' | 'pc' | 'wd'

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
export interface HGridMethods extends GridMethods{
    /**
     * Returns the unique ID of the grid.
     * This is the same as the `id` prop (or auto-generated if not set).
     */
    getId(): string
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
export interface HNoteElement extends VanillanoteElement {
    /**
     * Returns the unique ID of the note.
     * This is the same as the `id` prop (or auto-generated if not set).
     */
    getId(): string
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
export interface HButtonMethods {
    /**
     * Returns the unique ID of the button.
     * This is the same as the `id` prop (or auto-generated if not set).
     */
    getId(): string;
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
export interface HLayoutMethods {
    /**
     * Returns the unique ID of the layout.
     * Matches the `id` prop used in the component.
     */
    getId(): string;
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

export interface HInputMethods {
    /**
     * Returns the unique ID of the input.
     * This is the same as the `id` prop (or auto-generated if not set).
     */
    getId(): string;
    /**
     * 화면상에 나타나는 text를 반환한다.(format이 적용된)
     */
    getText(): string;
    /**
     * Returns whether the input is currently visible.
     * - `false` means `display: none` is applied.
     */
    isVisible(): boolean;
    /**
     * Shows or hides the input.
     * - `true` makes the input visible.
     * - `false` applies `display: none`.
     */
    setVisible(visible: boolean): void;
    /**
     * Gets the current tooltip (title) of the input.
     * - Reflects the current `title` attribute shown on hover.
     */
    getTitle(): string;
    /**
     * Sets the input tooltip (title) text.
     * - Affects what appears on hover.
     */
    setTitle(title: string): void;
    
    /**
     * input의 type에 대한 로직
     * export enum InputType {
            number = 'number',
            date = 'date',
            month = 'month',
            year = 'year',
            minute = 'minute',
            numchar = 'numchar',
            email = 'email',
            mask = 'mask',
            password = 'password',
        }
     */
    getType(): keyof typeof InputType;
    setType(type: keyof typeof InputType): void;

    /**
     * input의 editmode에 대한 로직
     * export enum InputEditMode {
            editable = 'editable',
            readonly = 'readonly',
            disable = 'disable',
        }
        editable => 일반 input
        disable => 수정 불가. input sapn의 css가 disable처리
        readonly => 수정 불가. input sapn의 css가 일반 텍스트 처리
     */
    getEditMode(): keyof typeof InputEditMode;
    setEditMode(mode: keyof typeof InputEditMode): void;

    /**
     * input span의 text를 굵게
     */
    isFontBold(): boolean
    setFontBold(bold: boolean): void;

    /**
     * input span의 text를 기울게
     */
    isFontItalic(): boolean
    setFontItalic(italic: boolean): void;

    /**
     * input span의 text를 취소선
     */
    isFontThruline(): boolean
    setFontThruline(thruline: boolean): void;

    /**
     * input span의 text를 밑줄
     */
    isFontUnderline(): boolean
    setFontUnderline(underline: boolean): void;

    /**
     * format을 지정
     * hison.utils을 적극 활용
     */
    getFormat(): string;
    setFormat(format: string): void;

    /**
     * input에 삽입되는 문자의 length를 조작
     */
    getMaxLength(): number;
    setMaxLength(maxLength: number): void;

    /**
     * input에 삽입되는 문자의 byte를 조작
     */
    getMaxByte(): number;
    setMaxByte(maxByte: number): void;

    /**
     * input의 required속성을 조작
     */
    getRequired(): boolean;
    setRequired(required: boolean): void;

    /**
     * input의 placeholder를 조작
     */
    getPlaceholder(): string;
    setPlaceholder(placeholder: string): void;

    /**
     * input의 value를 조작
     * value가 변경되면 input span도 변경됨.
     */
    getValue(): any;
    setValue(value: any): void;
}
