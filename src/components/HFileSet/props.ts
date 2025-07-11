//src/components/HFileSet/props.ts
import type { CSSProperties, PropType } from 'vue'
import { AttachedFileItem } from '../../types'
import { EditMode } from '../../enums'

export const fileSetProps = {
    /**
     * Unique identifier for the input.
     * - You can later retrieve its methods via `hison.vue.getInput(id)`
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
    visible: { type: Boolean, required: false, default: true },
    /**
     * Edit mode of the input.
     * - Values: `'editable'`, `'readonly'`, `'disable'`
     * - `'readonly'` and `'disable'` both prevent editing but differ in styling
     */
    editMode: { type: String as PropType<EditMode>, required: false, default: EditMode.editable },
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
    addButtonText : { type: String, required: false, default: 'Add' },
    /**
     * Text for the file delete button ("Remove" button).
     * 
     * - This text is displayed inside the default remove button beside each file item.
     * - Supports multiline using `\n`, rendered as `<br>`.
     * - To fully customize the remove button (e.g., use icons), use the `remove-button` slot.
     * 
     * @default 'x'
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
    removeButtonText : { type: String, required: false, default: 'x' },
    /**
     * Placeholder string shown inside the input when empty.
     * - Maps to the `placeholder` attribute
     */
    placeholder: { type: String, required: false, default: 'drop your files.' },
    /** 
     * Whether to allow drag-and-drop file uploading.
     * If false, users cannot drop files onto the list area.
     * 
     * @default true
     */
    enableDrop: { type: Boolean, default: true },

    /**
     * v-model로 바인딩할 파일 리스트
     */
    modelValue: { type: Array as PropType<AttachedFileItem[]>, required: false, default: () => [] },

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
     * 파일 묶음 식별자. DB 연동 시 사용됨.
     */
    attId: { type: String, required: false },
    /**
     * 업로드 허용 파일 타입 (MIME string)
     * 예: "image/*", ".pdf", "application/zip"
     */
    accept: { type: String, required: false },
    /**
     * 다중 업로드 허용 여부
     */
    multiple: { type: Boolean, required: false, default: true },
    
    multiCols: { type: Boolean, required: false, default: false },
}
