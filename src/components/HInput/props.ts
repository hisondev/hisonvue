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
   * - Duplicate `id` values can cause unexpected behavior if kept in a global registry.
   */
  id: { type: String, required: false },

  /**
   * Data extraction key for `HInputGroup`.
   * - Used as the key when `HInputGroup.getDataObject()` / `getDataModel()` extracts values.
   * - If omitted or empty, it falls back to `id`.
   * - `id` is still the runtime identifier for `hison.component.getInput(id)`.
   */
  dataKey: { type: String, required: false },

  /**
   * HTML `name` attribute.
   * - Default: same as `id` when omitted.
   * - Radio usage (`inputType: 'radio'`):
   *   - All `HInput` with the same `name` form one radio group.
   *   - Each radio’s own `id` is the runtime identifier, while `dataKey` is the data candidate value
   *     (falls back to `id` when `dataKey` is empty).
   *   - The radio’s local `modelValue` is boolean (`true`/`false`) and drives its `checked` state.
   *   - When wrapped by `HInputGroup`, radios are aggregated per `name` and exposed as
   *     `{ [name]: selectedRadioDataKey | null }`.
   *   - To set a selection programmatically (load/set), pass `{ [name]: <radioDataKey> }` to `HInputGroup`.
   *   - Changing `name` at runtime via `setName()` re-registers group membership with `HInputGroup`.
   * - Non-radio inputs: `name` only sets the underlying HTML attribute (no grouping behavior).
   */
  name: { type: String, required: false },

  /**
   * Bound value for the input field.
   */
  modelValue: {
    type: [String, Number, Boolean, Object, Array, Date] as PropType<any>,
    default: null,
  },

  /**
   * Custom class string applied to the input container.
   */
  class: {
    type: [String, Array, Object] as PropType<
      string | string[] | Record<string, boolean>
    >,
    required: false,
  },

  /**
   * Inline style for the input element.
   */
  style: {
    type: [String, Object, Array] as PropType<
      string | CSSProperties | CSSProperties[]
    >,
    required: false,
  },

  /**
   * Controls visibility of the input field.
   */
  visible: { type: Boolean, default: true },

  /**
   * Tooltip text shown on hover.
   */
  title: { type: String, required: false },

  /**
   * Input type.
   */
  inputType: {
    type: String as PropType<InputType | InputTypeValue>,
    required: false,
    validator: (v: any) => (INPUT_TYPE_VALUES as readonly string[]).includes(v),
  },

  /**
   * Format string used for displaying or formatting the value.
   */
  format: { type: String, required: false },

  /**
   * Placeholder text to show when value is null or empty.
   */
  nullText: { type: String, default: '' },

  /**
   * Maximum numeric value.
   */
  maxNumber: { type: [String, Number] as PropType<string | number>, required: false },

  /**
   * Minimum numeric value.
   */
  minNumber: { type: [String, Number] as PropType<string | number>, required: false },

  /**
   * Rounding precision for numeric inputs.
   */
  roundNumber: { type: [String, Number] as PropType<string | number>, required: false },

  /**
   * Maximum number of characters allowed.
   */
  maxLength: { type: [String, Number] as PropType<string | number>, required: false },

  /**
   * Maximum number of bytes allowed.
   */
  maxByte: { type: [String, Number] as PropType<string | number>, required: false },

  /**
   * Placeholder string shown inside the input when empty.
   */
  placeholder: { type: String, required: false },

  /**
   * Placeholder text color.
   */
  placeholderColor: {
    type: String as PropType<string>,
    default: 'primary',
  },

  /**
   * Edit mode of the input.
   */
  editMode: {
    type: String as PropType<EditMode | EditModeValue>,
    default: EditMode.editable,
    validator: (v: any) => (['editable', 'disable', 'readonly'] as const).includes(v),
  },

  /**
   * Whether the input is required.
   */
  required: { type: Boolean, default: false },

  /**
   * Bold font style toggle.
   */
  fontBold: { type: Boolean, default: false },

  /**
   * Italic font style toggle.
   */
  fontItalic: { type: Boolean, default: false },

  /**
   * Strikethrough font style toggle.
   */
  fontThruline: { type: Boolean, default: false },

  /**
   * Underline font style toggle.
   */
  fontUnderline: { type: Boolean, default: false },

  /**
   * Text alignment for the input’s display text.
   */
  textAlign: {
    type: String as PropType<TextAlign | TextAlignValue>,
    default: null,
    validator: (v: any) => v == null || (TEXT_ALIGN_VALUES as readonly string[]).includes(v),
  },

  /**
   * Whether to show border (rendered as subtle box-shadow).
   */
  border: { type: Boolean, default: true },

  /**
   * List of selectable options for `inputType: 'select'`.
   */
  options: {
    type: Array as PropType<{ text: string; value: any }[]>,
    required: false,
    default: () => [],
  },

  /**
   * Output value when checkbox is checked (used in display mode).
   */
  checkedText: { type: String, default: 'Y' },

  /**
   * Output value when checkbox is unchecked (used in display mode).
   */
  uncheckedText: { type: String, default: 'N' },

  /**
   * Custom formatter function for display text (span text) of the input component.
   */
  inputTextdHandler: {
    type: Function as PropType<(value: any) => string>,
    default: undefined,
  },

  /**
   * Defines the visual style for toggle-type inputs (`checkbox` or `radio`).
   */
  toggleStyle: {
    type: String as PropType<'default' | 'switch'>,
    default: 'default',
    validator: (v: any) => ['default', 'switch'].includes(v),
  },

  /**
   * Disables automatic capitalization behavior on mobile keyboards.
   */
  disableAutoCapitalize: { type: Boolean, default: false },

  /**
   * Controls keyboard focus order of the element.
   */
  tabIndex: {
    type: [Number, String] as PropType<number | string | null>,
    default: null,
    validator: (v: any) =>
      v === null || v === '' || (!isNaN(+v) && isFinite(+v))
  },
}