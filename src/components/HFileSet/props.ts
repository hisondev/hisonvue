import type { CSSProperties, PropType } from 'vue'
import { AttachedFileItem } from '../../types'
import { EDIT_MODE_VALUES, EditMode, EditModeValue } from '../../enums'

export const filesetProps = {
    /**
     * Unique identifier for the file set.
     * - Access methods via `hison.component.getFileset(id)`
     * - ⚠️ Duplicate `id` will throw at mount time
     */
    id: { type: String, required: false },
    /**
     * Custom class for the root (string / array / object supported).
     * - Works with responsive classes like `hison-col-*`, `hison-size-*`, etc.
     */
    class: {
        type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
        required: false,
    },
    /**
     * Inline style for the root (string | object | array of objects).
     */
    style: {
        type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
        required: false,
    },
    /**
     * Visibility of the component.
     * - Boolean only. Use `:visible="false"`
     */
    visible: { type: Boolean, default: true },
    /**
     * Edit mode of the component.
     * - 'editable' | 'readonly' | 'disable'
     */
    editMode: {
        type: String as PropType<EditMode | EditModeValue>,
        default: EditMode.editable,
        validator: (v: any) => (EDIT_MODE_VALUES as readonly string[]).includes(v),
    },
    /**
     * v-model: list of attached files.
     */
    modelValue: {
        type: Array as PropType<AttachedFileItem[]>,
        default: () => [],
    },
    /**
     * Attachment group id for backend linkage.
     */
    attId: { type: String, default: '' },
    /**
     * Text for the "Add" button. (Use `#add-button` slot to fully customize.)
     */
    addButtonText: { type: String, default: 'Add' },
    /**
     * Text for the "Remove" button. (Use `#remove-button` slot to fully customize.)
     */
    removeButtonText: { type: String, default: 'x' },
    /**
     * Placeholder text when list is empty.
     */
    placeholder: { type: String, default: 'There are no files.' },
    /**
     * Enable drag-and-drop file upload.
     */
    enableDrop: { type: Boolean, default: true },
    /**
     * Custom download handler. Overrides default behavior when provided.
     */
    downloadHandler: {
        type: Function as PropType<(file: AttachedFileItem) => void>,
        default: undefined,
    },
    /**
     * Wrap files into multiple columns (UI option).
     */
    multiCols: { type: Boolean, default: false },
    /**
     * Allow multiple file selection.
     */
    multiple: { type: Boolean, default: true },
    /**
     * Allowed file types (string or string[]).
     * - Accepts MIME types ('image/png') or extensions ('.jpg').
     * - Comma-separated string will be split internally.
     * - Takes precedence over `disallowedTypes`.
     */
    allowedTypes: {
        type: [String, Array] as PropType<string | string[]>,
        default: undefined,
        validator: (v: any) =>
        v === undefined ||
        typeof v === 'string' ||
        (Array.isArray(v) && v.every(i => typeof i === 'string')),
    },
    /**
     * Disallowed file types (string or string[]).
     * - MIME types or extensions. Comma-separated string supported.
     * - Ignored if `allowedTypes` is set.
     */
    disallowedTypes: {
        type: [String, Array] as PropType<string | string[]>,
        default: undefined,
        validator: (v: any) =>
        v === undefined ||
        typeof v === 'string' ||
        (Array.isArray(v) && v.every(i => typeof i === 'string')),
    },
    /**
     * Max file size per file (bytes). Infinity = no limit.
     */
    maxFileSize: {
        type: Number,
        default: Infinity,
        validator: (n: any) =>
        (Number.isFinite(n) && n >= 0) || n === Infinity,
    },
    /**
     * Max total size of all files (bytes). Infinity = no limit.
     */
    maxTotalFileSize: {
        type: Number,
        default: Infinity,
        validator: (n: any) =>
        (Number.isFinite(n) && n >= 0) || n === Infinity,
    },
    /**
     * Max number of files (0 = unlimited).
     */
    maxFileCount: {
        type: Number,
        default: 0,
        validator: (n: any) =>
        Number.isInteger(n) && n >= 0,
    },
    /**
     * Callback when file type is disallowed.
     * (file, allowedTypes[]|null, disallowedTypes[]|null) => void
     */
    onDisallowedType: {
        type: Function as PropType<
        (currentCheckFile: File, allowedTypes: string[] | null, disallowedTypes: string[] | null) => void
        >,
        default: undefined,
    },
    /**
     * Callback when a file exceeds `maxFileSize`.
     * (file, size, max) => void
     */
    onMaxFileSizeExceeded: {
        type: Function as PropType<
        (currentCheckFile: File, currentFileSize: number, maxFileSizeAllowed: number) => void
        >,
        default: undefined,
    },
    /**
     * Callback when total size exceeds `maxTotalFileSize`.
     * (file, total, max) => void
     */
    onMaxTotalSizeExceeded: {
        type: Function as PropType<
        (currentCheckFile: File, currentTotalFileSize: number, maxTotalFileSizeAllowed: number) => void
        >,
        default: undefined,
    },
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
