import type { CSSProperties, PropType } from 'vue'
import { AttachedFileItem } from '../../types'
import { EditMode } from '../../enums'

export const fileSetProps = {
    /**
     * Unique identifier for the input.
     * - You can later retrieve its methods via `hison.component.getInput(id)`
     * - ⚠️ Duplicate `id` values will throw an error at mount time
     */
    id: { type: String, required: false },
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
     * Edit mode of the input.
     * - Values: `'editable'`, `'readonly'`, `'disable'`
     * - `'readonly'` and `'disable'` both prevent editing but differ in styling
     */
    editMode: { type: String as PropType<EditMode>, default: EditMode.editable },
    /**
     * File list bound via `v-model`.
     *
     * This prop holds the current list of attached files and supports both preloaded (from DB)
     * and newly uploaded files. The component will emit `update:modelValue` with changes
     * when files are added or removed.
     *
     * Each file is an object of type `AttachedFileItem` with the following properties:
     * - `fileName`: string — Display name of the file
     * - `fileSize`: number — Size in bytes
     * - `extension`: string — File extension (e.g., `'pdf'`, `'jpg'`)
     * - `file`: File — The actual uploaded file (for new files only)
     * - `filePath`: string — Path to file (for preloaded files)
     * - `fileId`: string — Optional identifier (used with backend integration)
     * - `isDeleted`: boolean — If true, file will be excluded from visible list
     * - `isNew`: boolean — Marks if the file is newly added
     *
     * :::note
     * Use this prop to initialize the component with files, or to sync it externally.
     * The internal list will reflect changes in this array unless overridden manually.
     * :::
     *
     * @example
     * ```vue
     * <HFileSet v-model="files" />
     * 
     * <script setup lang="ts">
     * import type { AttachedFileItem } from 'hisonvue'
     * const files = ref<AttachedFileItem[]>([
     *   {
     *     fileName: 'document.pdf',
     *     fileSize: 102400,
     *     extension: 'pdf',
     *     filePath: '/upload/doc/document.pdf',
     *     fileId: 'F001',
     *     isDeleted: false,
     *     isNew: false,
     *   },
     *   {
     *     fileName: 'image.png',
     *     fileSize: 20480,
     *     extension: 'png',
     *     file: new File(['...'], 'image.png', { type: 'image/png' }),
     *     isNew: true,
     *   }
     * ])
     * </script>
     * ```
     */
    modelValue: { type: Array as PropType<AttachedFileItem[]>, default: () => [] },
    /**
     * Identifier for the file group.
     * Useful when linking this file set to a specific attachment group in the backend.
     */
    attId: { type: String, default: '' },
    /**
     * Text for the file upload button ("Add" button).
     * 
     * - This text is shown on the default add button when no `add-button` slot is provided.
     * - Supports multiline text using `\n`, which is rendered as `<br>`.
     * - If you want to fully customize the add button (e.g., use icons or custom markup),
     *   use the `add-button` named slot instead.
     * 
     * @default 'Add'
     * 
     * @slot add-button
     * Named slot to override the file upload button.
     * The slot receives `{ add }` as a prop, which triggers the file input dialog.
     * 
     * @example
     * <HFileSet v-model="files">
     *   <template #add-button="{ add }">
     *     <HButton icon="plus" @click="add">Upload</HButton>
     *   </template>
     * </HFileSet>
     */
    addButtonText : { type: String, default: 'Add' },
    /**
     * Text for the file delete button ("Remove" button).
     * 
     * - This text is displayed inside the default remove button beside each file item.
     * - Supports multiline using `\n`, rendered as `<br>`.
     * - To fully customize the remove button (e.g., use icons), use the `remove-button` slot.
     * 
     * @default 'remove'
     * 
     * @slot remove-button
     * Named slot to override the file remove button per file item.
     * The slot receives `{ file, index, remove }` as props.
     * You must call `remove()` to remove the file from the list.
     * 
     * @example
     * <HFileSet v-model="files">
     *   <template #remove-button="{ remove }">
     *     <HButton icon="trash" @click="remove" />
     *   </template>
     * </HFileSet>
     */
    removeButtonText : { type: String, default: 'x' },
    /**
     * Placeholder string shown inside the input when empty.
     * - Maps to the `placeholder` attribute
     */
    placeholder: { type: String, default: 'There are no files.' },
    /** 
     * Whether to allow drag-and-drop file uploading.
     * If false, users cannot drop files onto the list area.
     * 
     * @default true
     */
    enableDrop: { type: Boolean, default: true },
    /**
     * Custom handler function for downloading a file.
     * 
     * If provided, this function will override the default download behavior.
     * It allows consumers to add access control, token injection, or custom logic
     * (e.g. S3 presigned URL download, file streaming with auth headers, etc).
     * 
     * @prop {(file: AttachedFileItem) => void} downloadHandler
     * A function that receives a file item and performs the download manually.
     * 
     * @example
     * <HFileSet
     *   v-model="fileList"
     *   :downloadHandler="secureDownload"
     * />
     * 
     * <script lang="ts">
     * const secureDownload = (file: AttachedFileItem) => {
     *   if (!userHasPermission(file)) {
     *     alert('You do not have permission to download this file.')
     *     return
     *   }
     *   const token = localStorage.getItem('access_token')
     *   const url = `${file.filePath}?token=${token}`
     * 
     *   const link = document.createElement('a')
     *   link.href = url
     *   link.download = file.fileName || 'download'
     *   link.click()
     * }
     * </script>
     */
    downloadHandler: { type: Function as PropType<(file: AttachedFileItem) => void>, default: undefined },
    /**
     * Whether to display the file list in multiple columns.
     * If true, files are wrapped into two lines.
     */
    multiCols: { type: Boolean, default: false },
    /**
     * Whether to allow multiple file selection.
     * If set to false, only one file can be uploaded at a time. Subsequent uploads will replace the previous file.
     */
    multiple: { type: Boolean, default: true },
    /**
     * Allowed file types for upload.
     *
     * - Accepts:
     *   - MIME types like `'image/png'`, `'application/pdf'`
     *   - File extensions like `'.jpg'`, `'.docx'`
     * - You can pass:
     *   - An array: `['image/jpeg', 'image/png', '.pdf']`
     *   - A comma-separated string: `'image/jpeg,image/png,.pdf'`
     *
     * - If this prop is provided, only files matching this list will be accepted.
     * - Takes precedence over `disallowedTypes`.
     *
     * :::note
     * Comma-separated strings will automatically be split internally into an array.
     * ::: 
     *
     * @example
     * <HFileSet allowedTypes="image/png,.jpg,.jpeg" />
     *
     * @example
     * <HFileSet :allowedTypes="['image/png', '.jpg']" />
     */
    allowedTypes: { type: [String, Array] as PropType<string | string[]>, default: undefined, },
    /**
     * Disallowed file types for upload.
     *
     * - Accepts:
     *   - MIME types like `'application/x-msdownload'`, `'application/javascript'`
     *   - File extensions like `'.exe'`, `'.bat'`
     * - You can pass:
     *   - An array: `['application/x-msdownload', '.exe']`
     *   - A comma-separated string: `'application/x-msdownload,.exe'`
     *
     * - If `allowedTypes` is set, it takes priority over this list.
     * - If only this prop is set, any file not in this list will be accepted.
     *
     * :::note
     * Comma-separated strings will automatically be split internally into an array.
     * ::: 
     *
     * @example
     * <HFileSet disallowedTypes="application/x-msdownload,.exe" />
     *
     * @example
     * <HFileSet :disallowedTypes="['.exe', '.bat']" />
     */
    disallowedTypes: { type: [String, Array] as PropType<string | string[]>, default: undefined, },
    /**
     * Maximum allowed file size for each file (in bytes).
     * - If a file exceeds this size, it will be rejected on selection
     *
     * @default Infinity
     *
     * @example
     * maxFileSize: 10 * 1024 * 1024 // 10MB
     */
    maxFileSize: { type: Number, default: Infinity, },
    /**
     * Maximum total file size for all files combined (in bytes).
     * - This includes previously added files plus new ones
     * - If the total size would exceed this, new files will be rejected
     *
     * @default Infinity
     *
     * @example
     * maxTotalFileSize: 100 * 1024 * 1024 // 100MB
     */
    maxTotalFileSize: { type: Number, default: Infinity, },
    /**
     * Maximum number of files that can be uploaded.
     * When set to 0, there is no file count restriction.
     *
     * Files exceeding this count will be ignored on both file selection and drag-and-drop.
     *
     * @example
     * <HFileSet v-model="files" :maxFileCount="5" />
     */
    maxFileCount: { type: Number, default: 0, },
    /**
     * Called when a file has a disallowed type or extension.
     *
     * This is triggered when the uploaded file does not match the `allowedTypes` list
     * or is explicitly listed in the `disallowedTypes`.
     *
     * You can use this to notify the user of unsupported formats.
     *
     * @param checkFile - The file being evaluated
     * @param allowedTypes - The array of allowed types (`null` if not applied)
     * @param disallowedTypes - The array of disallowed types (`null` if not applied)
     *
     * @example
     * <HFileSet
     *   :onDisallowedType="(file, allow, deny) => {
     *     if (allow) alert(`${file.name} is not in allowed types: ${allow.join(', ')}`)
     *     if (deny) alert(`${file.name} is explicitly disallowed: ${deny.join(', ')}`)
     *   }"
     * />
     */
    onDisallowedType: Function as PropType<(currentCheckFile: File, allowedTypes: string[] | null, disallowedTypes: string[] | null) => void>,
    /**
     * Called when an individual file exceeds the maximum file size limit.
     *
     * Use this callback to alert or log when a file is too large to upload.
     *
     * @param currentCheckFile - The file being evaluated
     * @param currentFileSize - The actual file size in bytes
     * @param maxFileSizeAllowed - The configured size limit
     *
     * @example
     * <HFileSet
     *   :onMaxFileSizeExceeded="(file, size, max) => alert(`${file.name} is too large (${size} > ${max})`)"
     * />
     */
    onMaxFileSizeExceeded: Function as PropType<(currentCheckFile: File, currentFileSize: number, maxFileSizeAllowed: number) => void>,
    /**
     * Called when the total accumulated file size exceeds the allowed limit.
     *
     * This occurs before the current file is added. It includes the size of all previously
     * accepted files plus the current file being processed.
     *
     * @param currentCheckFile - The file attempting to be added
     * @param currentTotalFileSize - The projected total size in bytes (existing + current)
     * @param maxTotalFileSizeAllowed - The configured total size limit
     *
     * @example
     * <HFileSet
     *   :onMaxTotalSizeExceeded="(file, total, max) => alert(`Uploading ${file.name} exceeds total size (${total} > ${max})`)"
     * />
     */
    onMaxTotalSizeExceeded: Function as PropType<(currentCheckFile: File, currentTotalFileSize: number, maxTotalFileSizeAllowed: number) => void>,
}
