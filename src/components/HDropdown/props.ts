import { CSSProperties, PropType } from 'vue'
import { HDropdownModel } from '../../types'
import {
    DROPDOWN_TRIGGER_VALUES,
    DropdownTrigger, DropdownTriggerValue, EDIT_MODE_VALUES, EditMode, EditModeValue, TEXT_ALIGN_VALUES, TextAlign,
    TextAlignValue
} from '../../enums'

export const dropdownProps = {
    /**
     * Unique identifier for the dropdown instance.
     * - Retrieve methods via `hison.component.getDropdown(id)`
     * - ⚠️ Duplicate `id` will throw at mount time
     */
    id: { type: String, required: false },
    /**
     * Custom class applied to the dropdown (string / array / object).
     * - Works with responsive classes like `hison-col-*`, `hison-size-*`, etc.
     */
    class: {
        type: [String, Array, Object] as PropType<
        string | string[] | Record<string, boolean>
        >,
        required: false,
    },
    /**
     * Inline styles for the root container (`.hison-dropdown`).
     */
    style: {
        type: [String, Object, Array] as PropType<
        string | CSSProperties | CSSProperties[]
        >,
        required: false,
    },
    /**
     * Inline styles for the toggle area (`.hison-dropdown-toggle`).
     */
    toggleStyle: {
        type: [String, Object, Array] as PropType<
        string | CSSProperties | CSSProperties[]
        >,
        required: false,
    },
    /**
     * Inline styles for the menu container (`.hison-dropdown-menu`).
     * Merged on top of internal computed styles (e.g., maxHeight, overflow).
     */
    menuStyle: {
        type: [String, Object, Array] as PropType<
        string | CSSProperties | CSSProperties[]
        >,
        required: false,
    },
    /**
     * Inline styles applied to each option item (`.hison-dropdown-item`).
     */
    itemStyle: {
        type: [String, Object, Array] as PropType<
        string | CSSProperties | CSSProperties[]
        >,
        required: false,
    },
    /**
     * Visibility flag
     */
    visible: { type: Boolean, default: true },
    /**
     * Edit mode of the dropdown.
     * - 'editable' | 'disable' | 'readonly'
     */
    editMode: {
        type: String as PropType<EditMode | EditModeValue>,
        default: EditMode.editable,
        validator: (v: any) => (EDIT_MODE_VALUES as readonly string[]).includes(v),
    },
    /**
     * Placeholder text shown when no value selected
     */
    placeholder: { type: String, default: '' },
    /**
     * Trigger type to open menu
     * - 'click': click/tap to toggle
     * - 'hover': mouseenter/mouseleave
     */
    trigger: {
        type: String as PropType<DropdownTrigger | DropdownTriggerValue>,
        default: DropdownTrigger.click,
        validator: (v: any) =>
        (DROPDOWN_TRIGGER_VALUES as readonly string[]).includes(v),
    },
    /**
     * Model: { value, options }
     * - value: selected value
     * - options: array of { label, value, disabled? }
     * - Supports v-model
     */
    modelValue: { type: Object as PropType<HDropdownModel>, required: true },
    /**
     * Max menu height in px (scrolls when overflown)
     */
    maxHeight: {
        type: Number,
        default: 240,
        validator: (n: any) => Number.isFinite(n) && n >= 0,
    },
    /**
     * Close menu when selecting an option
     */
    closeOnSelect: { type: Boolean, default: true },
    /**
     * Text alignment for toggle and menu.
     * - 'left' | 'center' | 'right'
     * - Applies to both the toggle and the menu container.
     */
    textAlign: {
        type: String as PropType<TextAlign | TextAlignValue>,
        default: TextAlign.left,
        validator: (v: any) => (TEXT_ALIGN_VALUES as readonly string[]).includes(v),
    },
    /**
     * Animate menu open/close & caret rotation.
     */
    animate: { type: Boolean, default: true },
    /**
     * Animation duration in ms.
     * Applied via CSS var `--hdd-duration`.
     */
    duration: {
        type: Number,
        default: 500,
        validator: (n: any) => Number.isFinite(n) && n >= 0,
    },
    /**
     * CSS timing function (e.g., 'ease', 'linear', 'ease-in-out', 'cubic-bezier(...)').
     * Applied via CSS var `--hdd-easing`.
     */
    easing: { type: String, default: 'ease' },
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
}
