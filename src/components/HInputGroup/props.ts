import { PropType } from "vue";
import { DataStatus, EditMode } from "../../enums";
import type { DataStatusValue } from "../../enums"; // 위에서 추가한 타입
import { DATA_STATUS_VALUES, EDIT_MODE_VALUES } from "../../enums";

export const inputGroupProps = {
    /**
     * Unique identifier for the input.
     * - You can later retrieve its methods via `hison.component.getButton(id)`
     * - ⚠️ Duplicate `id` values will throw an error at mount time
     */
    id: { type: String, required: false },

    /**
     * Edit mode of the input.
     * - Values: `'editable'`, `'readonly'`, `'disable'`
     * - `'readonly'` and `'disable'` both prevent editing but differ in styling
     */
    editMode: {
        type: String as PropType<EditMode | typeof EDIT_MODE_VALUES[number]>,
        required: false,
        validator: (v: any) => v == null || (EDIT_MODE_VALUES as readonly string[]).includes(v),
    },

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
     * const group = hison.component.getInputGroup('group1');
     * group.getStatus();      // 'R'
     * group.setStatus('U');   // Change to 'updated'
     * ```
     * 
     * @default 'R'
     */
    status: {
        type: String as PropType<DataStatus | DataStatusValue>,
        required: false,
        default: DataStatus.R,
        validator: (v: any) => (DATA_STATUS_VALUES as readonly string[]).includes(v),
    },

    /**
     * Two-way binding value for the input group.
     *
     * Enables `v-model` support for grouped form data represented as a plain object (`Record<string, any>`),
     * where each property key corresponds to an `<HInput>` component’s `id`.
     *
     * When used, `HInputGroup` will automatically:
     * - Initialize child inputs' values based on this object during registration (`registerToInputGroup`)
     * - Emit `update:modelValue` whenever any input’s value is modified, including the updated object
     * - Maintain modification state and status tracking (`C`, `R`, `U`, `D`) as values change
     *
     * ---  
     *
     * ### Example
     * ```vue
     * <HInputGroup v-model="form" id="group1">
     *   <HInput id="name" inputType="text" />
     *   <HInput id="age" inputType="number" />
     * </HInputGroup>
     *
     * <script setup lang="ts">
     * const form = ref({ name: 'John', age: 26 })
     * </script>
     * ```
     *
     * ---
     *
     * ### Notes
     * - Any input must define an `id` that matches a key in this object to be bound correctly
     * - The object is shallow-merged on each child change to preserve reactivity
     * - This binding is fully compatible with manual `.load()` and `.getDataObject()` usage
     *
     * @prop {Record<string, any>} modelValue - Bound value object for all child inputs. Supports `v-model` binding.
     * @default {}
     */
    modelValue: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({}),
    },
};
