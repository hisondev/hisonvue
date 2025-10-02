import type { CSSProperties, PropType } from 'vue'
import {
  BackgroundType, BackgroundTypeValue, BACKGROUND_TYPE_VALUES,
  ScreenPosition, ScreenPositionValue, SCREEN_POSITION_VALUES,
} from '../../enums'

export const baggieProps = {
  /**
   * Unique identifier for the baggie instance.
   * - You can later retrieve its methods via `hison.component.getBaggie(id)`
   * - Duplicate `id` values will throw an error at mount time
   */
  id: { type: String, required: false },

  /**
   * Custom class applied to the **anchor scope** (the wrapper that contains target + badge).
   * - Accepts string/array/object (Vue class binding formats)
   * - You can use responsive tokens such as `hison-col-*`, `hison-size-*`, `hison-color-*`
   * - Processed internally to apply device-specific classes
   */
  class: {
    type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    required: false,
  },

  /**
   * Inline style(s) applied to the **badge element** (not to the anchor).
   * - Accepts string, object, or array of objects (Vue style binding formats)
   * - Use this for badge-specific size/spacing overrides
   */
  style: {
    type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
    required: false,
  },

  /**
   * Controls visibility of the **anchor block** (target + badge container).
   * - When `false`, both target and badge area are hidden from layout via `hison-display-none`
   * - Default: `true`
   */
  visible: { type: Boolean, default: true },

  /**
   * Controls visibility of the **badge only** (target stays visible).
   * - Useful to keep the target interactive while toggling the badge bubble
   * - Default: `true`
   */
  baggieVisible: { type: Boolean, default: true },

  /**
   * Stacking order base for the baggie.
   * - Applied to the **anchor** as `z-index: zIndex`
   * - The **badge** renders above the anchor using `zIndex + 1`
   * - Default: `1000`
   */
  zIndex: { type: Number, default: 1000 },

  /**
   * On-target position where the badge is pinned (grid overlay).
   * - Tokens: 'top-left' | 'top-center' | 'top-right' |
   *           'middle-left' | 'middle-center' | 'middle-right' |
   *           'bottom-left' | 'bottom-center' | 'bottom-right'
   * - Default: `top-right`
   */
  position: {
    type: String as PropType<ScreenPosition | ScreenPositionValue>,
    default: ScreenPosition.topRight,
    validator: (v: any) => (SCREEN_POSITION_VALUES as readonly string[]).includes(v),
  },

  /**
   * Text content rendered inside the badge when the `badge` slot is not provided.
   * - If slot `#badge` exists, this prop is ignored
   */
  text: { type: String, required: false },

  /**
   * Badge background mode.
   * - One of: `'empty' | 'transparent' | 'filled'` (see `BackgroundType`)
   * - Default: `filled`
   */
  backgroundType: {
    type: String as PropType<BackgroundType | BackgroundTypeValue>,
    default: BackgroundType.filled,
    validator: (v: any) => (BACKGROUND_TYPE_VALUES as readonly string[]).includes(v),
  },

  /**
   * Whether the badge renders with border styling (component theme shadow).
   * - Default: `true`
   */
  border: { type: Boolean, default: true },

  /**
   * Badge shape.
   * - Tokens: `'square' | 'rounded' | 'circle'`
   * - Default: `'rounded'`
   */
  shape: {
    type: String as PropType<'square' | 'rounded' | 'circle'>,
    default: 'rounded',
    validator: (v: any) => ['square','rounded','circle'].includes(v),
  },

  /**
   * Controls keyboard focus order of the badge (if interactive).
   * - `null` or `''` removes `tabindex` (not focusable)
   * - `0` enables natural tab navigation; positive numbers set custom order
   * - Default: `null`
   */
  tabIndex: {
    type: [Number, String] as PropType<number | string | null>,
    default: null,
    validator: (v: any) => v === null || v === '' || (!isNaN(+v) && isFinite(+v)),
  },

  /**
   * Enables button-like interaction styling/behavior on the badge.
   * - Applies CSS state classes via `addButtonCssEvent` (focus/hover/active)
   * - Default: `false`
   */
  buttonEnabled: { type: Boolean, default: false },
}
