import type { CSSProperties, PropType } from 'vue'
import {
  BackgroundType, BackgroundTypeValue, BACKGROUND_TYPE_VALUES,
  ScreenPosition, ScreenPositionValue, SCREEN_POSITION_VALUES,
  ModalPlacement, ModalPlacementValue
} from '../../enums'

export const modalProps = {
  /**
   * Unique identifier for the modal instance.
   * - You can later retrieve its methods via `hison.component.getModal(id)`
   * - Duplicate `id` values will throw an error at mount time
   */
  id: { type: String, required: false },

  /**
   * Custom class applied to the modal wrapper scope.
   * - Accepts string/array/object (Vue class binding formats)
   * - You can use responsive tokens such as `hison-col-*`, `hison-size-*`, `hison-color-*`
   * - Processed internally to apply device-specific classes
   */
  class: {
    type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    required: false,
  },

  /**
   * Inline style(s) for the modal **dialog element** (not the overlay nor the fixed wrapper).
   * - Accepts string, object, or array of objects (Vue style binding formats)
   * - Use this for width/height/padding of the dialog itself
   */
  style: {
    type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
    required: false,
  },

  /**
   * Initial visibility of the modal.
   * - Runtime visibility is controlled **only** via methods (`open/close/toggle/setVisible`)
   * - Default: `false`
   */
  visible: { type: Boolean, default: false },

  /**
   * Whether the dialog has a border (rendered via component theme shadow).
   * - Default: `true`
   */
  border: { type: Boolean, default: true },

  /**
   * Background fill mode of the dialog body/header/footer.
   * - One of: `'empty' | 'transparent' | 'filled'` (see `BackgroundType`)
   * - Default: `BackgroundType.empty`
   */
  backgroundType: {
    type: String as PropType<BackgroundType | BackgroundTypeValue>,
    default: BackgroundType.empty,
    validator: (v: any) => (BACKGROUND_TYPE_VALUES as readonly string[]).includes(v),
  },

  /**
   * Stacking order for this modal **wrapper** (fixed container).
   * - Applied to `.hison-modal-wrapper`; the overlay uses `zIndex - 1`
   * - Default: `1300`
   * - When stacking multiple modals, set different `zIndex` values to ensure the desired front/back order.
   */
  zIndex: { type: Number, default: 1300 },

  /**
   * On-screen position of the **fixed wrapper** (where the dialog is anchored).
   * - Tokens: 'top-left' | 'top-center' | 'top-right' |
   *           'middle-left' | 'middle-center' | 'middle-right' |
   *           'bottom-left' | 'bottom-center' | 'bottom-right'
   * - Default: `middle-center`
   * - This controls only the fixed anchor (wrapper); dialog sizes/layout are still governed by `style`
   */
  position: {
    type: String as PropType<ScreenPosition | ScreenPositionValue>,
    default: ScreenPosition.middleCenter,
    validator: (v: any) => (SCREEN_POSITION_VALUES as readonly string[]).includes(v),
  },

  /**
   * Initial header visibility flag.
   * - Final rendering also depends on **content existence**:
   *   header will hide if no slot and no caption/close-button are placed in header
   * - Default: `true`
   */
  headerVisible: { type: Boolean, default: true },

  /**
   * Initial footer visibility flag.
   * - Final rendering also depends on **content existence**:
   *   footer will hide if no slot and no caption/close-button are placed in footer
   * - Default: `true`
   */
  footerVisible: { type: Boolean, default: true },

  /**
   * Caption text.
   * - If `null`/empty string, caption is considered **not present** (affects header/footer auto visibility)
   * - Default: `null`
   */
  caption: { type: String as PropType<string | null>, default: null },

  /**
   * Whether caption renders with border styling.
   * - Default: `false`
   */
  captionBorder: { type: Boolean, default: false },

  /**
   * Background type for the caption element.
   * - One of `BackgroundType` tokens
   * - Default: `filled`
   */
  captionBackgroundType: {
    type: String as PropType<BackgroundType | BackgroundTypeValue>,
    default: BackgroundType.filled,
    validator: (v: any) => (BACKGROUND_TYPE_VALUES as readonly string[]).includes(v),
  },

  /**
   * Placement of the caption: which section and side it appears in.
   * - Tokens: 'header-left' | 'header-center' | 'header-right' |
   *           'footer-left' | 'footer-center' | 'footer-right'
   * - Default: `'header-center'`
   * - Note: Caption renders only if `caption` text is present.
   */
  captionPlacement: {
    type: String as PropType<ModalPlacement | ModalPlacementValue>,
    default: 'header-center'
  },

  /**
   * Whether the close button is shown initially.
   * - Default: `true`
   */
  closeButtonVisible: { type: Boolean, default: true },

  /** Label text for the close button (e.g., 'X'). Default: 'X' */
  closeButtonText: { type: String, default: 'X' },

  /** Title (tooltip) for the close button. Default: 'close' */
  closeButtonTitle: { type: String, default: 'close' },

  /** Whether the close button renders with border styling. Default: `true` */
  closeButtonBorder:  { type: Boolean, default: true },

  /**
   * Background type for the close button.
   * - One of `BackgroundType` tokens
   * - Default: `empty`
   */
  closeButtonBackgroundType: {
    type: String as PropType<BackgroundType | BackgroundTypeValue>,
    default: BackgroundType.empty,
    validator: (v: any) => (BACKGROUND_TYPE_VALUES as readonly string[]).includes(v),
  },

  /**
   * Placement of the close button: which section and side it appears in.
   * - Tokens: 'header-left' | 'header-center' | 'header-right' |
   *           'footer-left' | 'footer-center' | 'footer-right'
   * - Default: `'footer-right'`
   */
  closeButtonPlacement: {
    type: String as PropType<ModalPlacement | ModalPlacementValue>,
    default: 'footer-right'
  },

  /**
   * Whether clicking the overlay closes the modal.
   * - Default: `true`
   */
  closeClickOverlay: { type: Boolean, default: true },

  /**
   * Whether the overlay (backdrop) is rendered at all.
   * - Default: `true`
   */
  showOverlay: { type: Boolean, default: true },

  /**
   * Styles applied to the overlay element.
   * - Accepts string/object/array; merged with an internal `{ zIndex: (zIndex - 1) }`
   * - Example: `overlay-style="{ backgroundColor: 'rgba(0,0,0,.4)' }"`
   */
  overlayStyle: {
    type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
    required: false
  },

  /**
   * Locks page scroll while the modal is open (reference-counted across nested modals).
   * - Default: `true`
   */
  scrollLock: { type: Boolean, default: true },

  /**
   * Optional enter animation class for the dialog.
   * - Default: internal `'hison-modal-enter'` if not provided
   */
  enterAnimationClass: { type: String, required: false },

  /**
   * Optional leave animation class for the dialog.
   * - Default: internal `'hison-modal-leave'` if not provided
   */
  leaveAnimationClass: { type: String, required: false },
}
