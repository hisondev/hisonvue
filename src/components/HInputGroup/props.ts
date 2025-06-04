import { PropType } from "vue";
import { DataStatus, EditMode } from "../../enums";

export const inputGroupProps = {
    /**
     * Unique identifier for the input.
     * - You can later retrieve its methods via `hison.vue.getButton(id)`
     * - ⚠️ Duplicate `id` values will throw an error at mount time
     */
    id: { type: String, required: false },
    /**
     * Edit mode of the input.
     * - Values: `'editable'`, `'readonly'`, `'disable'`
     * - `'readonly'` and `'disable'` both prevent editing but differ in styling
     */
    editMode: { type: String as PropType<EditMode>, required: false },
    /**
     * Initial status of the input group.
     * 
     * This prop sets the internal data status of the group, which is managed using `DataStatus` enum.
     * Typical values are:
     * - `'C'`: Created (new)
     * - `'R'`: Read (default)
     * - `'U'`: Updated (modified)
     * - `'D'`: Deleted
     * 
     * The status value is used to track the data lifecycle and is accessible or modifiable
     * through runtime methods:
     * 
     * ```ts
     * const group = hison.vue.getInputGroup('group1');
     * group.getStatus();      // 'R'
     * group.setStatus('U');   // Change to 'updated'
     * ```
     * 
     * @default 'R'
     */
    status: { type: String as PropType<DataStatus>, required: false },

}
