import type { CSSProperties, PropType } from 'vue'
import { BackgroundType, type BackgroundTypeValue, BACKGROUND_TYPE_VALUES, TextAlignValue, TEXT_ALIGN_VALUES, VerticalAlignValue, VERTICAL_ALIGN_VALUES, VerticalAlign, TextAlign } from '../../enums'

export const tableProps = {
  /**
   * Unique identifier for the table.
   * - Access methods via `hison.component.getTable(id)`
   * - Duplicate `id` will throw at mount time
   */
  id: { type: String, required: false },

  /**
   * Custom class applied to the wrapper element (string / array / object supported).
   * - Works with responsive classes like `hison-col-*`, `hison-size-*`, `hison-color-*`, etc.
   */
  class: {
    type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    required: false,
  },

  /**
   * Extra class applied to all header `<th>` cells (merged once after mount).
   */
  headerCellClass: {
    type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    required: false,
  },
  /**
   * Extra class applied to all body `<td>` cells (merged once after mount).
   */
  bodyCellClass: {
    type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    required: false,
  },
  /**
   * Extra class applied to all footer `<td>` cells (merged once after mount).
   */
  footerCellClass: {
    type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    required: false,
  },

  /**
   * Inline style for the `<table>` element (string, object, or array of objects).
   */
  style: {
    type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
    required: false,
  },
  /**
   * Extra inline style applied to all header `<th>` cells (merged once after mount).
   */
  headerCellStyle: {
    type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
    required: false,
  },
  /**
   * Extra inline style applied to all body `<td>` cells (merged once after mount).
   */
  bodyCellStyle: {
    type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
    required: false,
  },
  /**
   * Extra inline style applied to all footer `<td>` cells (merged once after mount).
   */
  footerCellStyle: {
    type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
    required: false,
  },

  /**
   * Controls visibility of the table.
   * - Boolean only. Use `:visible="false"` (with a colon).
   */
  visible: { type: Boolean, default: true },

  /**
   * Caption text for the table.
   * - Use the `#caption` slot for full customization.
   */
  caption: { type: String, default: '' },

  /**
   * Striped row/col background mode.
   * - 'row' → apply alternating background per row
   * - 'col' → apply alternating background per column
   * - 'none' → no striping
   * - Default: 'row'
   */
  striped: { type: String as PropType<'row'|'col'|'none'>, default: 'row' },

  /**
   * Hover highlight mode.
   * - 'row' → highlight row on hover
   * - 'col' → highlight column on hover
   * - 'none' → no hover effect
   * - Default: 'row'
   */
  hoverable: { type: String as PropType<'row'|'col'|'none'>, default: 'row' },

  /**
   * Whether to show border (rendered as subtle box-shadow).
   * - Default: false (no border)
   */
  border: { type: Boolean, default: false },

  /**
   * Toggles top border line on table header cells.
   */
  headerBorderTop: { type: Boolean, default: false },
  /**
   * Toggles bottom border line on table header cells.
   */
  headerBorderBottom: { type: Boolean, default: false },
  /**
   * Toggles left border line on table header cells.
   */
  headerBorderLeft: { type: Boolean, default: false },
  /**
   * Toggles right border line on table header cells.
   */
  headerBorderRight: { type: Boolean, default: false },

  /**
   * Toggles top border line on table body cells.
   */
  bodyBorderTop: { type: Boolean, default: false },
  /**
   * Toggles bottom border line on table body cells.
   */
  bodyBorderBottom: { type: Boolean, default: false },
  /**
   * Toggles left border line on table body cells.
   */
  bodyBorderLeft: { type: Boolean, default: false },
  /**
   * Toggles right border line on table body cells.
   */
  bodyBorderRight: { type: Boolean, default: false },

  /**
   * Toggles top border line on table footer cells.
   */
  footerBorderTop: { type: Boolean, default: false },
  /**
   * Toggles bottom border line on table footer cells.
   */
  footerBorderBottom: { type: Boolean, default: false },
  /**
   * Toggles left border line on table footer cells.
   */
  footerBorderLeft: { type: Boolean, default: false },
  /**
   * Toggles right border line on table footer cells.
   */
  footerBorderRight: { type: Boolean, default: false },

  /**
   * Horizontal text alignment for header cells.
   * - 'left' | 'center' | 'right'
   * - Accepts enum `TextAlign` or its literal strings
   * - Default: 'center'
   */
  headerTextAlign: {
    type: String as PropType<TextAlign | TextAlignValue>,
    default: TextAlign.center,
    validator: (v: any) => v == null || (TEXT_ALIGN_VALUES as readonly string[]).includes(v),
  },
  /**
   * Horizontal text alignment for body cells.
   * - 'left' | 'center' | 'right'
   * - Accepts enum `TextAlign` or its literal strings
   * - Default: 'left'
   */
  bodyTextAlign: {
    type: String as PropType<TextAlign | TextAlignValue>,
    default: TextAlign.left,
    validator: (v: any) => v == null || (TEXT_ALIGN_VALUES as readonly string[]).includes(v),
  },
  /**
   * Horizontal text alignment for footer cells.
   * - 'left' | 'center' | 'right'
   * - Accepts enum `TextAlign` or its literal strings
   * - Default: 'right'
   */
  footerTextAlign: {
    type: String as PropType<TextAlign | TextAlignValue>,
    default: TextAlign.right,
    validator: (v: any) => v == null || (TEXT_ALIGN_VALUES as readonly string[]).includes(v),
  },

  /**
   * Vertical alignment for header cells.
   * - 'top' | 'middle' | 'bottom'
   * - Default: 'middle'
   */
  headerVerticalAlign: {
    type: String as PropType<VerticalAlign | VerticalAlignValue>,
    default: VerticalAlign.middle,
    validator: (v: any) => (VERTICAL_ALIGN_VALUES as readonly string[]).includes(v),
  },
  /**
   * Vertical alignment for body cells.
   * - 'top' | 'middle' | 'bottom'
   * - Default: 'middle'
   */
  bodyVerticalAlign: {
    type: String as PropType<VerticalAlign | VerticalAlignValue>,
    default: VerticalAlign.middle,
    validator: (v: any) => (VERTICAL_ALIGN_VALUES as readonly string[]).includes(v),
  },
  /**
   * Vertical alignment for footer cells.
   * - 'top' | 'middle' | 'bottom'
   * - Default: 'middle'
   */
  footerVerticalAlign: {
    type: String as PropType<VerticalAlign | VerticalAlignValue>,
    default: VerticalAlign.middle,
    validator: (v: any) => (VERTICAL_ALIGN_VALUES as readonly string[]).includes(v),
  },

  /**
   * Background type for the table.
   * - 'filled' | 'empty' | 'transparent'
   * - Default: 'empty'
   */
  backgroundType: {
    type: String as PropType<BackgroundType | BackgroundTypeValue>,
    default: BackgroundType.empty,
    validator: (v: any) => (BACKGROUND_TYPE_VALUES as readonly string[]).includes(v),
  },
}
