import { CSSProperties, PropType } from "vue";
import { EditMode, InputType } from "../../enums";

export const inputProps = {
    /**
     * Unique identifier for the input.
     * - You can later retrieve its methods via `hison.component.getInput(id)`
     * - ⚠️ Duplicate `id` values will throw an error at mount time
     */
    id: { type: String, required: false },
    /**
     * Bound value for the input field.
     * - Controlled via `v-model`
     * - Supports multiple types depending on `inputType`:
     *    - `text`, `email`, `mask`, `digit` → `string`
     *    - `number` → `number`
     *    - `checkbox` → `boolean`
     *    - `select` → `string | number | boolean`
     *    - `date`, `month` → `string` or `Date`
     *    - `textarea` → `string`
     * - Internally processed and formatted based on `inputType` and `format`
     */
    modelValue: { type: [String, Number, Boolean, Object, Array, Date] as PropType<any>, default: null },
    /**
     * Custom class string applied to the input container.
     * - Supports responsive classes like `hison-col-*`, `hison-pos-*`, `hison-size-*`
     * - Internally parsed and applied per device type
     */
    class: { type: String, required: false },
    /**
     * Inline style for the input element.
     * - Accepts either string or `CSSProperties` object
     * - Merged with internal dynamic styles
     */
    style: { type: [String, Object] as PropType<string | CSSProperties>, required: false },
    /**
     * Controls visibility of the input field.
     * - Accepts string values: `'true'` or `'false'`
     * - Default: `'true'` (visible)
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
     * - Available values: `'text'`, `'mask'`, `'number'`, `'digit'`, `'date'`, `'month'`, `'email'`, `'password'`
     * - Affects input formatting and behavior
     */
    inputType: { type: String as PropType<InputType>, required: false },
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
     */
    maxNumber: { type: String, required: false },
    /**
     * Minimum numeric value.
     * - Only applicable when `type` is `'number'`
     */
    minNumber: { type: String, required: false },
    /**
     * Rounding precision for numeric inputs.
     * - Only applies when `type` is `'number'`
     * - Accepts positive or negative integers
     */
    roundNumber: { type: String, required: false },
    /**
     * Maximum number of characters allowed.
     * - Truncates string if exceeded
     * - Does not consider byte size
     */
    maxLength: { type: String, required: false },
    /**
     * Maximum number of bytes allowed.
     * - Truncates string based on UTF-8 byte size
     * - Uses `hison.utils.getCutByteLength()` internally
     */
    maxByte: { type: String, required: false },
    /**
     * Placeholder string shown inside the input when empty.
     * - Maps to the `placeholder` attribute
     */
    placeholder: { type: String, required: false },
    /**
     * Edit mode of the input.
     * - Values: `'editable'`, `'readonly'`, `'disable'`
     * - `'readonly'` and `'disable'` both prevent editing but differ in styling
     */
    editMode: { type: String as PropType<EditMode>, default: EditMode.editable },
    /**
     * Whether the input is required.
     * - Accepts `'true'` or `'false'`
     * - Adds `hison-input-required` class when `'true'`
     */
    required: { type: Boolean, default: false },
    /**
     * Bold font style toggle.
     * - Accepts `'true'` or `'false'`
     * - Adds `hison-font-bold` class when enabled
     */
    fontBold: { type: Boolean, default: false },
    /**
     * Italic font style toggle.
     * - Accepts `'true'` or `'false'`
     * - Adds `hison-font-italic` class when enabled
     */
    fontItalic: { type: Boolean, default: false },
    /**
     * Strikethrough font style toggle.
     * - Accepts `'true'` or `'false'`
     * - Adds `hison-font-thruline` class when enabled
     */
    fontThruline: { type: Boolean, default: false },
    /**
     * Underline font style toggle.
     * - Accepts `'true'` or `'false'`
     * - Adds `hison-font-underline` class when enabled
     */
    fontUnderline: { type: Boolean, default: false },
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
    inputTextdHandler: { type: Function as PropType<(value: any) => string>, default: undefined },
}
