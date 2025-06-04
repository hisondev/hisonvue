import { PropType } from 'vue'
import { DataStatus, EditMode } from '../../enums'

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
     * Edit mode of the calendar.
     * - Values: `'editable'`, `'readonly'`, `'disable'`
     * - `'readonly'` and `'disable'` both prevent interaction but differ in UI style.
     */
    editMode: { type: String as PropType<EditMode>, required: false },
    /**
     * Initial status of the calendar.
     *
     * Controlled via `DataStatus` enum. This value tracks the data state:
     * - `'C'`: Created
     * - `'R'`: Read (default)
     * - `'U'`: Updated
     * - `'D'`: Deleted
     *
     * Example:
     * ```ts
     * const calendar = hison.vue.getCalendar('calendar1');
     * calendar.setStatus('U');
     * ```
     *
     * @default 'R'
     */
    status: { type: String as PropType<DataStatus>, required: false },
    /**
     * List of events to display in the calendar.
     * - Each event should follow VueCal's event format.
     * - Reactive updates are supported.
     */
    modelValue: {
    type: Array as PropType<any[]>, // 향후 타입 명확화 가능 (예: CalendarEvent[])
    required: false
    },
    /**
     * Current calendar view mode.
     * - Values: `'month'`, `'week'`, `'day'`, `'year'`, `'custom'`
     * - Default is `'month'`.
     */
    view: {
    type: String as PropType<'month' | 'week' | 'day' | 'year' | 'custom'>,
    default: 'month'
    },
    /**
     * The currently selected date.
     * - Format: ISO 8601 string (e.g., `'2025-06-04'`)
     * - When changed, updates the calendar’s focus.
     */
    selectedDate: {
    type: String,
    required: false
    },
    /**
     * Whether to hide the top title bar (month/year navigation).
     * - Useful for compact or embedded views.
     */
    hideTitleBar: {
    type: Boolean,
    default: false
    }
}
