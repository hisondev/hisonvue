import type { PropType } from 'vue'
import type { ChartType, ChartData, ChartOptions } from 'chart.js'

export const chartProps = {
    /**
     * Unique identifier for the chart instance.
     * - Use `hison.vue.getChart(id)` to access chart methods at runtime.
     * - ⚠️ Duplicate `id` values will throw an error at mount time.
     * - If omitted, a UUID will be auto-generated internally.
     */
    id: { type: String, required: false },
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
     * - This prop supports `v-model` binding.
     * - When changed reactively, the chart will auto-update.
     */
    modelValue: { type: Object as PropType<ChartData>, required: true },
    /**
     * Optional configuration for the chart.
     * - Follows the Chart.js `ChartOptions` structure
     * - If omitted, Chart.js internal defaults are used
     * - Automatically merged with internal color resolution logic (e.g., `'primary-50'` → rgba)
     */
    options: { type: Object as PropType<ChartOptions>, required: false },
    /**
     * Custom class string applied to the chart container.
     * - Use responsive classes like `hison-col-*`, `hison-pos-*`, `hison-size-*`
     * - These will be internally parsed and adjusted based on current device
     * - If no `hison-col-*` class is found, `hison-col-12` will be added by default
     */
    class: { type: String, required: false },
    /**
     * Inline style applied to the chart container.
     * - Accepts string, object, or array of valid Vue `style` formats
     * - Merged with internal styles computed for visibility and layout
     */
    style: { type: [String, Object, Array] as PropType<any>, required: false },
    /**
     * Controls the visibility of the chart.
     * - `true`: chart is visible
     * - `false`: `display: none` is applied
     * - Default: `true`
     * - Runtime control available via `HChartInstance.setVisible(true|false)`
     */
    visible: { type: Boolean, required: false, default: true },
}
