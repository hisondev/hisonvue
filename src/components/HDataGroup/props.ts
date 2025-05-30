import { PropType } from "vue";
import { DataStatus, EditMode } from "../../enums";
import { DataModel } from "hisonjs";

export const dataGroupProps = {
    /**
     * Unique identifier for the input.
     * - You can later retrieve its methods via `hison.vue.getButton(id)`
     * - ⚠️ Duplicate `id` values will throw an error at mount time
     */
    id: { type: String, required: false },
    /**
     * Bound value for the input field.
     * - This is controlled via `v-model`
     * - Internally processed and formatted based on `type` and `format`
     */
    modelValue: { type: DataModel, required: false },
    /**
     * Edit mode of the input.
     * - Values: `'editable'`, `'readonly'`, `'disable'`
     * - `'readonly'` and `'disable'` both prevent editing but differ in styling
     */
    editMode: { type: String as PropType<EditMode>, required: false },
    //dataGroup의 상태값. default는 DataStatus.read ('R') 이다.
    status: { type: String as PropType<DataStatus>, required: false },

}
