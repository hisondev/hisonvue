import { CSSProperties, PropType } from "vue";
import { BackgroundType } from "../../enums";

export const buttonProps = {
    /**
     * Unique identifier for the button.
     * - You can later retrieve its methods via `hison.component.getButton(id)`
     * - ⚠️ Duplicate `id` values will throw an error at mount time
     */
    id: { type: String, required: false },
    /**
     * Custom class string applied to the button container.
     * - You can use `hison-col-*`, `hison-pos-*`, `hison-size-*` and other responsive classes
     * - These classes will be processed internally for device-specific application
     */
    class: { type: String, required: false },
    /**
     * Inline style string applied to the button container.
     * - Accepts valid CSS style text (e.g., 'padding: 10px; margin-top: 20px')
     * - Merged with dynamic computed styles like background and border settings
     */
    style: { type: [String, Object] as PropType<string | CSSProperties>, required: false },
    /**
     * Controls visibility of the button.
     * - Accepts string values: `'true'` or `'false'` (not boolean)
     * - Defaults to visible if not provided or if value is not `'false'`
     */
    visible: { type: Boolean, default: true},
    /**
     * Whether the button is disabled.
     * - Accepts `'true'` or `'false'` as string.
     * - Affects `disabled` attribute and `hison-disable` class.
     * - Can be changed at runtime via `HButtonMethods.setDisable(true|false)`
     * - Default: `'false'`
     */
    disable : { type: Boolean, default: false },
    /**
     * Tooltip text shown when hovering over the button.
     * - Maps to the `title` attribute.
     * - Can be retrieved or updated via `HButtonMethods.getTitle()` / `setTitle()`
     * - Default: `''` (no tooltip)
     */
    title : { type: String, required: false },
    /**
     * Text content of the button (alternative to slot).
     * - If provided, will be rendered inside the button.
     * - Can be retrieved or updated via `HButtonMethods.getText()` / `setText()`
     * - Default: `''` (slot or fallback content is shown)
     */
    text : { type: String, required: false },
    /**
     * Minimum interval (ms) between button clicks.
     * - If set, button cannot be clicked again until this time has elapsed.
     * - Default: 0 (no interval limit)
     */
    clickInterval: { type: Number, default: 0 },
    /**
     * Button background type
     * - `'filled'` (default): theme color background (`hison-color-primary`, etc)
     * - `'empty'`: always uses --hison-emptyColor as background
     * - `'transparent'`: transparent background (CSS transparent)
     * @default 'filled'
     */
    backgroundType: { type: String as PropType<BackgroundType>, default: BackgroundType.filled, },
}
