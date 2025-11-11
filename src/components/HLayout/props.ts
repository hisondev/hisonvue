import { CSSProperties, PropType } from "vue";
import { BACK_IMAGE_ALIGN_VALUES, BACK_IMAGE_STYLE_VALUES, BACK_IMAGE_VERTICAL_ALIGN_VALUES, BackImageAlignValue, BackImageRepeatValue, BackImageVerticalAlignValue } from "../../enums";

export const layoutProps = {
  /**
   * Unique identifier for the layout.
   * - You can later retrieve its methods via `hison.component.getLayout(id)`
   * - ⚠️ Duplicate `id` values will throw an error at mount time
   */
  id: { type: String, required: false },

  /**
   * Custom class string applied to the layout container.
   * - You can use `hison-col-*`, `hison-pos-*`, `hison-size-*` and other responsive classes
   * - These classes will be processed internally for device-specific application
   */
  class: {
    type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    required: false,
  },

  /**
   * Inline style string applied to the layout container.
   * - Accepts valid CSS style text (e.g., 'padding: 10px; margin-top: 20px')
   * - Merged with dynamic computed styles like background and border settings
   */
  style: {
    type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
    required: false,
  },

  /**
   * Controls visibility of the layout.
   * - Boolean only. Use `:visible="false"` (with a colon)
   * - Defaults to visible if not provided
   */
  visible: { type: Boolean, default: true },

  /** Background image URL */
  backImageSrc: { type: String, required: false },

  /**
   * Background repeat/cover/contain settings
   * - Quick tokens: 'repeat' | 'no-repeat' | 'cover' | 'contain'
   * - Also accepts any valid CSS background-repeat/size shorthand string (e.g. 'repeat-x', 'repeat-y', 'no-repeat center/cover')
   */
  backImageRepeat: {
    type: String as PropType<BackImageRepeatValue | string>,
    required: false,
    validator: (v: any) => {
      if (v == null) return true
      if ((BACK_IMAGE_STYLE_VALUES as readonly string[]).includes(v)) return true
      const relaxed =
        /^(repeat-x|repeat-y|repeat|no-repeat)(\s+\S+\/\S+)?$/.test(v) ||
        /^(cover|contain)$/.test(v) ||
        /[\/\s]/.test(v)
      return relaxed
    },
  },

  /** Background width (e.g. '100%', '300px') */
  backImageWidth: { type: String, required: false },

  /** Horizontal alignment: left, center, right */
  backImageAlign: {
    type: String as PropType<BackImageAlignValue>,
    required: false,
    validator: (v: any) => v == null || (BACK_IMAGE_ALIGN_VALUES as readonly string[]).includes(v),
  },

  /** Vertical alignment: top, center, bottom */
  backImageVerticalAlign: {
    type: String as PropType<BackImageVerticalAlignValue>,
    required: false,
    validator: (v: any) => v == null || (BACK_IMAGE_VERTICAL_ALIGN_VALUES as readonly string[]).includes(v),
  },

  /**
   * Background color of layout.
   * Acceptable values:
   * - Hex: '#ffffff', '#fff'
   * - RGB/RGBA: 'rgb(255,255,255)', 'rgba(0,0,0,0.5)'
   * - Keyword: 'primary', 'muted', 'info', 'success', 'danger', 'warning', 'custom1', 'custom2'..
   *   (these will be resolved via getHexCodeFromColorText)
   */
  backColor: { type: String, required: false },

  /**
   * Whether to show border (rendered as subtle box-shadow).
   * - Default: false (no border)
   */
  border: { type: Boolean, default: false },

  /**
   * Height of the layout container.
   * Use valid CSS height values:
   * - e.g., '100px', '50%', 'auto', '100vh'
   */
  height: { type: String, required: false },
}
