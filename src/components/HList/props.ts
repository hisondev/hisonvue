import type { CSSProperties, PropType } from 'vue'
import { BackgroundType, type BackgroundTypeValue, BACKGROUND_TYPE_VALUES } from '../../enums'

export const listProps = {
  /**
   * Unique identifier for the list.
   * - Access methods via `hison.component.getList(id)`
   * - Duplicate `id` will throw at mount time
   */
  id: { type: String, required: false },
  /**
   * Custom class applied to the wrapper (string / array / object).
   * - Works with responsive classes like `hison-col-*`, `hison-size-*`, `hison-color-*`, etc.
   */
  class: {
    type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    required: false
  },
  /**
   * Inline style for the root list container.
   */
  style: {
    type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
    required: false
  },
  /**
   * Inline style for the root list container.
   */
  listItemStyle: {
    type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
    required: false
  },
  /**
   * Inline style for the root list container.
   */
  listItemInnerStyle: {
    type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
    required: false
  },
  /**
   * Controls visibility of the list.
   */
  visible: { type: Boolean, default: true },
  /**
   * Overall border (box-shadow) for the list container.
   */
  border: { type: Boolean, default: false },
  /**
   * Whether each list item (`li`) shows border (box-shadow).
   */
  listBorder: { type: Boolean, default: false },
  /**
   * Background type of the list container.
   * - 'filled' | 'empty' | 'transparent'
   * - Default: 'empty'
   */
  backgroundType: {
    type: String as PropType<BackgroundType | BackgroundTypeValue>,
    default: BackgroundType.empty,
    validator: (v: any) => (BACKGROUND_TYPE_VALUES as readonly string[]).includes(v)
  },
  /**
   * Background type of each list item (`li`).
   * - 'filled' | 'empty' | 'transparent'
   * - Default: 'empty'
   */
  listBackgroundType: {
    type: String as PropType<BackgroundType | BackgroundTypeValue>,
    default: BackgroundType.empty,
    validator: (v: any) => (BACKGROUND_TYPE_VALUES as readonly string[]).includes(v)
  },
  /**
   * Choose underlying list tag: 'ul' or 'ol'.
   */
  listType: {
    type: String as PropType<'ul'|'ol'>,
    default: 'ul',
    validator: (v: any) => v === 'ul' || v === 'ol'
  },
  /**
   * When listType='ul', the bullet character shown inside each item (instead of native marker).
   * - Ignored if `showMarker=false`
   */
  bulletChar: { type: String, default: '•' },
  /**
   * Show marker on each item
   * - 'ol' → index+1
   * - 'ul' → bulletChar
   */
  showMarker: { type: Boolean, default: true },
  /**
   * Text list data. Used when:
   * - default slot is absent, OR
   * - default slot is present but composed of text-only nodes (no element vnode).
   *
   * If `#item` scoped slot is provided, it will be used to render each item with props `{ item, index }`.
   */
  textList: {
    type: Array as PropType<Array<string | number>>,
    default: () => []
  },
  /**
   * NEW: Attach textbox-like CSS events (+ emit) to each item.
   * - true : bind addButtonCssEvent to `.hison-list-item-inner` and emit interaction events
   * - false: unbind and do not emit
   */
  addEvent: { type: Boolean, default: false },
  /**
   * Controls keyboard focus order of the element.
   * - `0` enables natural tab navigation, positive numbers set custom order.
   * - `null` or `''` removes tabindex (not focusable).
   * The same tabIndex is inserted into the list items.
   */
  tabIndex: {
    type: [Number, String] as PropType<number | string | null>,
    default: null,
    validator: (v: any) =>
      v === null || v === '' || (!isNaN(+v) && isFinite(+v))
  },
}
