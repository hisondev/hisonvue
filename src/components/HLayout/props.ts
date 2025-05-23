import { PropType } from "vue";
import { BoolString } from "../../enums";

export const layoutProps = {
    /**
     * Unique identifier for the layout.
     * - When provided, the layout is registered in `hisonCloser.component.layoutList`
     * - You can later retrieve its methods via `hison.vue.getLayout(id)`
     * - ⚠️ Duplicate `id` values will throw an error at mount time
     */
    id: { type: String, required: false },
    /**
     * Custom class string applied to the layout container.
     * - You can use `hison-col-*`, `hison-pos-*`, `hison-size-*` and other responsive classes
     * - These classes will be processed internally for device-specific application
     */
    class: { type: String, required: false },
    /**
     * Inline style string applied to the layout container.
     * - Accepts valid CSS style text (e.g., 'padding: 10px; margin-top: 20px')
     * - Merged with dynamic computed styles like background and border settings
     */
    style: { type: String, required: false },
    /**
     * Controls visibility of the layout.
     * - Accepts string values: `'true'` or `'false'` (not boolean)
     * - Defaults to visible if not provided or if value is not `'false'`
     */
    visible: { type: String as PropType<BoolString>, required: false },
    /** Background image URL */
    backImageSrc: { type: String, required: false },
    /** Background repeat/cover/contain settings */
    backImageStyle: { type: String, required: false },
    /** Background width (e.g. '100%', '300px') */
    backImageWidth: { type: String, required: false },
    /** Horizontal alignment: left, center, right */
    backImageAlign: { type: String, required: false },
    /** Vertical alignment: top, center, bottom */
    backImageVerticalAlign: { type: String, required: false },
    /**
     * Background color of layout.
     * Acceptable values:
     * - Hex: '#ffffff', '#fff'
     * - RGB/RGBA: 'rgb(255,255,255)', 'rgba(0,0,0,0.5)'
     * - Keyword: 'primary', 'muted', 'info', 'success', 'danger', 'warning'
     *   (these will be resolved via getHexCodeFromColorText)
     */
    backColor: { type: String, required: false },
    /**
     * Border color of the layout.
     * Acceptable values are the same as `backColor`.
     */
    borderColor: { type: String, required: false },
    /**
     * Border width of the layout.
     * Use valid CSS size values:
     * - e.g., '1px', '2px', '0.5rem'
     */
    borderWidth: { type: String, required: false },
    /**
     * Height of the layout container.
     * Use valid CSS height values:
     * - e.g., '100px', '50%', 'auto', '100vh'
     */
    height: { type: String, required: false },
}
