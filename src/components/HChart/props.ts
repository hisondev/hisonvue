import type { CSSProperties, PropType } from 'vue'
import type { ChartType, ChartData, ChartOptions } from 'chart.js'

export const chartProps = {
    /**
     * Unique identifier for the chart instance.
     * - Use `hison.component.getChart(id)` to access chart methods at runtime.
     * - ⚠️ Duplicate `id` values will throw at mount time.
     */
    id: { type: String, required: false },

    /**
     * Custom class applied to the chart container.
     * - Accepts string / array / object. Works with `hison-col-*`, `hison-size-*`, etc.
     */
    class: {
        type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
        required: false,
    },

    /**
     * Inline style applied to the chart container.
     * - Accepts string / object / array of objects (Vue style binding forms)
     */
    style: {
        type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
        required: false,
    },

    /**
     * The chart type to render.
     * - Examples: `'line'`, `'bar'`, `'doughnut'`, `'pie'`, `'radar'`, etc.
     * - Uses Chart.js `ChartType` internally
     * - This is a required prop.
     */
    type: { type: String as PropType<ChartType>, required: true },

    /**
     * The data object used to render the chart.
     * - Follows the Chart.js `ChartData` structure
     * - Supports `v-model`.
     */
    modelValue: { type: Object as PropType<ChartData>, required: true },

    /**
     * Optional configuration for the chart.
     * - Follows the Chart.js `ChartOptions` structure
     */
    options: { type: Object as PropType<ChartOptions>, required: false },

    /**
     * Controls the visibility of the chart.
     */
    visible: { type: Boolean, default: true },

    /**
     * Delay (ms) before recreating the chart on reload.
     */
    loadDelay: { type: Number, default: 500 },
}
