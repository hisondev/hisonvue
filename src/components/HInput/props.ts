import { CSSProperties, PropType } from 'vue'
import {
  EditMode, type EditModeValue,
  InputType, type InputTypeValue, INPUT_TYPE_VALUES,
  TextAlign, type TextAlignValue, TEXT_ALIGN_VALUES
} from '../../enums'

export const inputProps = {
    /**
     * Unique identifier for the input.
     * - You can later retrieve its methods via `hison.component.getInput(id)`
     * - ⚠️ Duplicate `id` values will throw an error at mount time
     */
    id: { type: String, required: false },
    /**
     * HTML `name` attribute.
     * - Default: same as `id` when omitted.
     * - Radio usage (`inputType: 'radio'`):
     *   - All `HInput` with the same `name` form one radio group.
     *   - Each radio’s own `id` is treated as the group’s candidate value.
     *   - The radio’s local `modelValue` is boolean (`true`/`false`) and drives its `checked` state.
     *   - When wrapped by `HInputGroup`, radios are aggregated per `name` and exposed as
     *     `{ [name]: selectedRadioId | null }` via `getDataObject()` / `v-model`.
     *   - To set a selection programmatically (load/set), pass `{ [name]: <radioId> }` to `HInputGroup`.
     *   - Changing `name` at runtime via `setName()` re-registers group membership with `HInputGroup`.
     * - Non-radio inputs: `name` only sets the underlying HTML attribute (no grouping behavior).
     */
    name: { type: String, required: false },
    /**
     * Bound value for the input field.
     * - Controlled via `v-model`
     * - Supports multiple types depending on `inputType`:
     *    - `text`, `email`, `mask`, `digit`, `textarea` → `string`
     *    - `number` → `number`
     *    - `checkbox` → `boolean`
     *    - `select` → `string | number | boolean`
     *    - `date`, `month`, `time` → `string` or `Date`
     * - Internally processed and formatted based on `inputType` and `format`
     */
    modelValue: {
        type: [String, Number, Boolean, Object, Array, Date] as PropType<any>,
        default: null,
    },
    /**
     * Custom class string applied to the input container.
     * - Supports responsive classes like `hison-col-*`, `hison-pos-*`, `hison-size-*`
     * - Accepts string / array / object (Vue standard) form
     */
    class: {
        type: [String, Array, Object] as PropType<
        string | string[] | Record<string, boolean>
        >,
        required: false,
    },
    /**
     * Inline style for the input element.
     * - Accepts string, CSSProperties object, or an array of objects
     * - Merged with internal dynamic styles
     */
    style: {
        type: [String, Object, Array] as PropType<
        string | CSSProperties | CSSProperties[]
        >,
        required: false,
    },
    /**
     * Controls visibility of the input field.
     * - Boolean only. Use `:visible="false"`
     * - Default: `true`
     */
    visible: { type: Boolean, default: true },
    /**
     * Tooltip text shown on hover.
     * - Maps to the `title` attribute
     * - Modifiable at runtime via `HInputMethods.setTitle()`
     */
    title: { type: String, required: false },
    /**
     * Input type.
     * - Available values: `'text'`, `'mask'`, `'number'`, `'digit'`, `'date'`, `'month'`, `'time'`, `'email'`, `'password'`, `'checkbox'`, `'range'`, `'color'`, `'textarea'`, `'select'`
     * - Accepts enum `InputType` or its literal strings
     * - Affects input formatting and behavior
     */
    inputType: {
        type: String as PropType<InputType | InputTypeValue>,
        required: false,
        validator: (v: any) => (INPUT_TYPE_VALUES as readonly string[]).includes(v),
    },
    /**
     * Format string used for displaying or formatting the value.
     * - Used when `type` is `'number'`, `'mask'`, `'date'`, or `'month'`
     */
    format: { type: String, required: false },
    /**
     * Placeholder text to show when value is null or empty.
     * - Used as a display fallback in span mode
     */
    nullText: { type: String, default: '' },
    /**
     * Maximum numeric value.
     * - Only applicable when `type` is `'number'`
     * - Enforced during input and formatting
     * - Accepts string or number
     */
    maxNumber: { type: [String, Number] as PropType<string | number>, required: false },
    /**
     * Minimum numeric value.
     * - Only applicable when `type` is `'number'`
     * - Accepts string or number
     */
    minNumber: { type: [String, Number] as PropType<string | number>, required: false },
    /**
     * Rounding precision for numeric inputs.
     * - Only applies when `type` is `'number'`
     * - Accepts positive or negative integers (string or number)
     */
    roundNumber: { type: [String, Number] as PropType<string | number>, required: false },
    /**
     * Maximum number of characters allowed.
     * - Truncates string if exceeded
     * - Does not consider byte size
     * - Accepts string or number
     */
    maxLength: { type: [String, Number] as PropType<string | number>, required: false },
    /**
     * Maximum number of bytes allowed.
     * - Truncates string based on UTF-8 byte size
     * - Uses `hison.utils.getCutByteLength()` internally
     * - Accepts string or number
     */
    maxByte: { type: [String, Number] as PropType<string | number>, required: false },
    /**
     * Placeholder string shown inside the input when empty.
     * - Maps to the `placeholder` attribute
     */
    placeholder: { type: String, required: false },
    /**
     * Edit mode of the input.
     * - Values: `'editable'`, `'readonly'`, `'disable'`
     * - Accepts enum `EditMode` or its literal strings
     * - `'readonly'` and `'disable'` both prevent editing but differ in styling
     */
    editMode: {
        type: String as PropType<EditMode | EditModeValue>,
        default: EditMode.editable,
        validator: (v: any) => (['editable','disable','readonly'] as const).includes(v),
    },
    /**
     * Whether the input is required.
     * - Boolean only
     * - Adds `hison-input-required` class when `true`
     */
    required: { type: Boolean, default: false },
    /**
     * Bold font style toggle.
     * - Boolean only
     * - Adds `hison-font-bold` class when enabled
     */
    fontBold: { type: Boolean, default: false },
    /**
     * Italic font style toggle.
     * - Boolean only
     * - Adds `hison-font-italic` class when enabled
     */
    fontItalic: { type: Boolean, default: false },
    /**
     * Strikethrough font style toggle.
     * - Boolean only
     * - Adds `hison-font-thruline` class when enabled
     */
    fontThruline: { type: Boolean, default: false },
    /**
     * Underline font style toggle.
     * - Boolean only
     * - Adds `hison-font-underline` class when enabled
     */
    fontUnderline: { type: Boolean, default: false },
    /**
     * Text alignment for the input’s display text.
     * - 'left' | 'center' | 'right'
     * - Accepts enum `TextAlign` or its literal strings
     */
    textAlign: {
        type: String as PropType<TextAlign | TextAlignValue>,
        default: null,
        validator: (v: any) => v == null || (TEXT_ALIGN_VALUES as readonly string[]).includes(v),
    },
    /**
     * Whether to show border (rendered as subtle box-shadow).
     * - Default: false (no border)
     */
    border: { type: Boolean, default: true },
    /**
     * List of selectable options for `inputType: 'select'`.
     * - Each option should be an object with `text` (label shown to the user) and `value` (actual value to bind).
     * - Used only when `inputType === 'select'`.
     * example
     * options: [
     *   { text: 'Active', value: 'A' },
     *   { text: 'Inactive', value: 'I' }
     * ]
     */
    options: {
        type: Array as PropType<{ text: string; value: any }[]>,
        required: false,
        default: () => [],
    },
    /**
     * Output value when checkbox is checked (used in display mode).
     * - Used only when `inputType === 'checkbox'`.
     * - Affects the display text returned by `getText()` and the span view when not editing.
     */
    checkedText: { type: String, default: 'Y' },
    /**
     * Output value when checkbox is unchecked (used in display mode).
     * - Used only when `inputType === 'checkbox'`.
     * - Affects the display text returned by `getText()` and the span view when not editing.
     */
    uncheckedText: { type: String, default: 'N' },
    /**
     * Controls keyboard focus order of the element.
     * - `0` enables natural tab navigation, positive numbers set custom order.
     * - `null` or `''` removes tabindex (not focusable).
     */
    tabIndex: {
        type: [Number, String] as PropType<number | string | null>,
        default: null,
        validator: (v: any) =>
        v === null || v === '' || (!isNaN(+v) && isFinite(+v))
    },
    /**
     * Custom formatter function for display text (span text) of the input component.
     *
     * It overrides the default formatting logic based on `inputType`, allowing full control
     * over the rendered text content of the input.
     *
     * If this prop is provided, it takes priority over any built-in format logic
     * such as number/date formatting, checkbox label mapping, or select label resolution.
     *
     * @example
     * // 1. Formatting numbers as currency
     * <HInput
     *   v-model="form.price"
     *   inputTextdHandler={(val) => `$${Number(val).toLocaleString()}`}
     * />
     * // modelValue = 1200 => "$1,200"
     *
     * @example
     * // 2. Showing 'Yes' or 'No' instead of true/false
     * <HInput
     *   v-model="form.enabled"
     *   inputType="checkbox"
     *   inputTextdHandler={(val) => val ? 'Yes' : 'No'}
     * />
     * // modelValue = true => "Yes"
     *
     * @example
     * // 3. Applying custom date formatting
     * <HInput
     *   v-model="form.hireDate"
     *   inputType="date"
     *   inputTextdHandler={(val) => dayjs(val).format('MMMM D, YYYY')}
     * />
     * // modelValue = '2025-07-03' => "July 3, 2025"
     *
     * @remarks
     * This only affects the `spanText` used in display mode. It does **not** modify the actual value
     * bound via `v-model`, nor the value shown in the actual input box when in editing mode.
     */
    inputTextdHandler: {
        type: Function as PropType<(value: any) => string>,
        default: undefined,
    },
    /**
     * Defines the **visual style** for toggle-type inputs (`checkbox` or `radio`).
     * 
     * - `'default'` : Uses the standard circular (radio) or square (checkbox) design.
     * - `'switch'`  : Renders a modern switch-style toggle (sliding thumb on a track).
     * 
     * @default 'default'
     */
    toggleStyle: {
        type: String as PropType<'default' | 'switch'>,
        default: 'default',
        validator: (v: any) => ['default', 'switch'].includes(v),
    },
}
