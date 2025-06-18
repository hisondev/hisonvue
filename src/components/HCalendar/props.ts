import { PropType } from 'vue'
import { SpecialTimeMap } from "../../types";

/**
 * Props for the `HCalendar` component.
 *
 * These props allow full configuration of calendar view, selection, and event data.
 */
export const calendarProps = {
    /**
     * Unique identifier for the calendar component.
     * - Use `hison.vue.getCalendar(id)` to access methods at runtime.
     * - ⚠️ Duplicate `id` values will throw an error at mount time.
     */
    id: { type: String, required: false },
    
    /**
     * Custom class string applied to the calender container.
     * - You can use `hison-col-*`, `hison-pos-*`, `hison-size-*` and other responsive classes
     * - These classes will be processed internally for device-specific application
     */
    class: { type: String, required: false },

    style: { type: String, required: false },

    /**
     * Controls visibility of the calendar.
     * - Accepts string values: `'true'` or `'false'` (not boolean)
     * - Defaults to visible if not provided or if value is not `'false'`
     */
    visible: { type: Boolean, required: false, default: true },
    /**
     * Whether the calendar is disabled.
     * - Accepts `'true'` or `'false'` as string.
     * - Affects `disabled` attribute and `hison-disable` class.
     * - Can be changed at runtime via `HButtonMethods.setDisable(true|false)`
     * - Default: `'false'`
     */
    disable : { type: Boolean, required: false, default: false },

    /** css text 
     * 입력 시 해당 색상이 header의 주말에 표시됨
    */
    weekendColor : { type: String, required: false },

    
    /** css text */
    todayColor : { type: String, required: false },
    /** css text */
    selectedColor : { type: String, required: false },

    /**
     * timeFrom: 0 * 60 ~ 24 * 60
     * timeTo: 0 * 60 ~ 24 * 60
        export type SpecialTime = {
            timeFrom: number;
            timeTo: number;
        }
     * 0 = Sunday ~ 6 = Saturday
        export type SpecialTimeMap = {
            [dayOfWeek: number]: SpecialTime[]  // 0~6까지 배열
        }
     */
    specialTime : { type: Object as PropType<SpecialTimeMap>, required: false},



    invertColor : { type: Boolean, required: false },

    /** px */
    dateCellMinHeight : { type: Number, required: false },
    dateCellMaxHeight : { type: Number, required: false },
}
