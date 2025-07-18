import type { CSSProperties, PropType } from 'vue'
import { EditMode } from '../../enums'
import { AttachedFileItem } from '../../types'

export const imageBoxProps = {
	/**
	* Unique identifier for the image box.
	* - Use this for programmatic access: `hison.vue.getInput(id)`
	* - Duplicated `id` values will throw an error at mount time.
	*
	* @example
	* <HImageBox id="profilePic" />
	*/
    id: { type: String, required: false },
	/**
	* Custom class string for responsive/layout/color/size.
	* - Accepts any space-separated classes, such as `"size-xl color-warning"`
	* - Supports hisonvue responsive prefixes.
	*/
    class: { type: String, required: false },
	/**
	* Inline style for the image box container.
	* - Accepts a CSS string or a CSSProperties object.
	* - Merged with internal dynamic styles.
	*
	* @example
	* <HImageBox :style="{ margin: '8px', border: '1px solid #eee' }" />
	*/
    style: { type: [String, Object] as PropType<string | CSSProperties>, required: false },
    /**
     * Custom style object or string applied to <img> element.
     * Allows fine-grained control of image rendering.
     */
    imgStyle: { type: [String, Object] as PropType<string | CSSProperties>, required: false },
	/**
	* Controls visibility of the image box.
	* - If false, the component is not displayed (`display: none`).
	* - Can be toggled at runtime with imageBoxMethods.setVisible().
	*
	* @default true
	*/
    visible: { type: Boolean, default: true },
	/**
	* Edit mode of the image box.
	* - `'editable'`: default, upload/remove buttons visible and enabled.
	* - `'readonly'`: all buttons hidden (not rendered, layout preserved).
	* - `'disable'`: buttons visible but disabled.
	* - Can be changed at runtime using imageBoxMethods.setEditMode().
	*
	* @default 'editable'
	*/
    editMode: { type: String as PropType<EditMode>, default: EditMode.editable },
    /**
     * The current image data, bound via `v-model`.
     *
     * This prop holds the image information to be displayed and manipulated in the component.
     * It accepts an `AttachedFileItem` object, supporting both:
     * - Server-loaded files (from DB): with file metadata and URL.
     * - Newly uploaded files: with native File object.
     * 
     * ### Usage
     * - Set this prop to display an existing image from the server (use `filePath`).
     * - When uploading, provide a new `AttachedFileItem` with a `File` object.
     * - When `null`, the placeholder is displayed.
     * - The component will emit `update:modelValue` with an updated value when the image is added or removed.
     *
     * ### AttachedFileItem Properties
     * - `fileName`: string — Display name of the image file (with extension).
     * - `fileSize`: number — File size in bytes (may be omitted for server files).
     * - `extension`: string — File extension, such as `'jpg'`, `'png'`.
     * - `file`: File — Native browser File object (for newly uploaded images).
     * - `filePath`: string — URL or path to the image (for server files).
     * - `fileId`: string — Optional unique identifier for server-provided images.
     * - `isDeleted`: boolean — If true, image will not be shown (for soft-delete).
     * - `isNew`: boolean — Marks if the image was just added (for upload tracking).
     * - `attId`: string — (optional) Identifier for the attachment group (used for backend linking).
     *
     * :::note
     * Use this prop for two-way binding with the parent state.  
     * You can initialize the component with an image (server or uploaded),
     * or clear it by setting to `null`.  
     * Deleting a server-loaded image sets `isDeleted = true`; deleting a local-upload image sets `modelValue = null`.
     * :::
     *
     * @example
     * ```vue
     * <HImageBox v-model="image" />
     * 
     * <script setup lang="ts">
     * import type { AttachedFileItem } from 'hisonvue'
     * import { ref } from 'vue'
     * // Example with a preloaded image from server
     * const image = ref<AttachedFileItem | null>({
     *   fileId: 'IMG01',
     *   fileName: 'avatar.jpg',
     *   filePath: '/uploads/user/avatar.jpg',
     *   fileSize: 34567,
     *   extension: 'jpg',
     *   isNew: false,
     *   isDeleted: false,
     * })
     * // Or for a new upload:
     * // const image = ref<AttachedFileItem | null>(null)
     * </script>
     * ```
     */
    modelValue: { type: Object as PropType<AttachedFileItem | null>, default: null },
    /**
     * Identifier for the file group.
     * Useful when linking this image to a specific attachment group in the backend.
     */
    attId: { type: String, default: '' },
	/**
	* Text label for the add/upload button.
	* - If the `add-button` slot is provided, this prop is ignored.
	* - Supports multiline (use '\\n', rendered as <br>).
	*
	* @default '+'
	*
	* @slot add-button
	* Named slot to fully customize the add button.
	* The slot receives `{ add }` as a prop, which triggers the file input dialog.
	*
	* @example
	* <HImageBox>
	*   <template #add-button="{ add }">
	*     <span><i class="fa fa-plus"></i> Add Image</span>
	*   </template>
	* </HImageBox>
	*/
    addButtonText: { type: String, default: 'Add' },
	/**
	* Text label for the remove/delete button.
	* - If the `remove-button` slot is provided, this prop is ignored.
	* - Supports multiline (use '\\n', rendered as <br>).
	*
	* @default 'x'
	*
	* @slot remove-button
	* Named slot to fully customize the remove button.
	* The slot receives `{ remove }` as a prop.
	*
	* @example
	* <HImageBox>
	*   <template #remove-button="{ remove }">
	*     <span><i class="fa fa-trash"></i> Delete</span>
	*   </template>
	* </HImageBox>
	*/
    removeButtonText: { type: String, default: 'Remove' },
	/**
	* Placeholder string shown when no image is present.
	* - Displayed in the center of the preview area when modelValue is null or empty.
	* - Use for instructional text or icons.
	*
	* @default 'There is no image'
	*
	* @notice
	* If there is an empty slot, the placeholder will not appear.
	* <HImageBox>
    * 	<template #empty>
    *  	  <div class="custom-empty">
    *     	<span>Drag image here or click the button below</span>
    *     </div>
    * 	</template>
	* </HImageBox>
	*/
    placeholder: { type: String, default: 'There is no image' },
    /**
     * Whether to allow drag-and-drop file uploading.
     * If false, users cannot drop files onto the image area.
     *
     * @default true
     *
     * @example
     * <HImageBox :enableDrop="false" />
     */
    enableDrop: { type: Boolean, default: true },
	/**
	* Allowed file types/extensions for upload.
	* - Accepts MIME types (`'image/png'`), wildcards (`'image/*'`), or extensions (`'.jpg'`).
	* - String or array. String is split by comma.
	* - If set, only listed types/extensions are accepted.
	* - Takes priority over disallowedTypes.
	*
	* @default ['.jpg', '.jpeg', '.png', '.gif', 'image/*']
	*
	* @example
	* <HImageBox allowedTypes=".jpg,.jpeg,.png" />
	* <HImageBox :allowedTypes="['image/png', '.jpg']" />
	*/
    allowedTypes: { type: [String, Array] as PropType<string | string[]>, default: () => ['.jpg', '.jpeg', '.png', '.gif', 'image/*'] },
	/**
	* Disallowed file types/extensions for upload.
	* - Accepts MIME types or extensions, as string (comma-separated) or array.
	* - If allowedTypes is set, it takes precedence over this list.
	* - Otherwise, any file NOT in this list will be accepted.
	*
	* :::note
	* Comma-separated strings are automatically split into arrays.
	* :::
	*
	* @default undefined
	*
	* @example
	* <HImageBox disallowedTypes=".exe,.svg" />
	* <HImageBox :disallowedTypes="['application/x-msdownload', '.bmp']" />
	*/
    disallowedTypes: { type: [String, Array] as PropType<string | string[]>, default: undefined, },
	/**
	* Maximum allowed file size for the uploaded image (bytes).
	* - 0 means unlimited size.
	* - Files exceeding this size will be rejected.
	*
	* @default 0
	*
	* @example
	* <HImageBox :maxFileSize="2 * 1024 * 1024" /> <!-- 2MB -->
	*/
    maxFileSize: { type: Number, default: Infinity },
	/**
	* Custom callback for disallowed file type or extension.
	* - Called when a user selects a file that is not accepted.
	* - Use to notify users about allowed formats.
	*
	* @param currentCheckFile - The file being checked.
	* @param allowedTypes - Array of allowed types (or null).
	* @param disallowedTypes - Array of disallowed types (or null).
	*
	* @example
	* <HImageBox
	*   :onDisallowedType="(file, allow, deny) => {
	*     alert(`${file.name} is not allowed!`);
	*   }"
	* />
	*/
    onDisallowedType: Function as PropType<(currentCheckFile: File, allowedTypes: string[] | null, disallowedTypes: string[] | null) => void>,
	/**
	* Custom callback for exceeding max file size.
	* - Called when the selected file size is too large.
	* - Use for user alerts or validation UI.
	*
	* @param file - The file being checked.
	* @param size - The actual file size.
	* @param max - The configured max size.
	*
	* @example
	* <HImageBox
	*   :onMaxFileSizeExceeded="(file, size, max) => alert('File too big!')"
	* />
	*/
    onMaxFileSizeExceeded: Function as PropType<(file: File, size: number, max: number) => void>,
}
