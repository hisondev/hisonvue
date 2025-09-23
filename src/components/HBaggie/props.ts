import type { CSSProperties, PropType } from 'vue'
import {
  BackgroundType, BackgroundTypeValue, BACKGROUND_TYPE_VALUES,
  ScreenPosition, ScreenPositionValue, SCREEN_POSITION_VALUES,
} from '../../enums'

export const baggieProps = {
  id: { type: String, required: false },

  class: {
    type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    required: false,
  },

  style: {
    type: [String, Object, Array] as PropType<string | CSSProperties | CSSProperties[]>,
    required: false,
  },

  /** 표시/숨김 제어 */
  visible: { type: Boolean, default: true },

  /** stacking z-index (기본 1000) - 배지 요소에 적용 */
  zIndex: { type: Number, default: 1000 },

  /** 배지 위치(가운데-가운데 제외). ScreenPosition 값 사용 가능하되 'middle-center'는 불가 */
  position: {
    type: String as PropType<ScreenPosition | ScreenPositionValue>,
    default: ScreenPosition.topRight,
    validator: (v: any) =>
      (SCREEN_POSITION_VALUES as readonly string[]).includes(v) && v !== 'middle-center',
  },

  /** 텍스트(슬롯 'badge' 미사용 시 렌더) */
  text: { type: String, required: false },

  /** 라벨과 동일 규칙: filled | empty | transparent (기본 filled) */
  backgroundType: {
    type: String as PropType<BackgroundType | BackgroundTypeValue>,
    default: BackgroundType.filled,
    validator: (v: any) => (BACKGROUND_TYPE_VALUES as readonly string[]).includes(v),
  },

  /** box-shadow 보더 유무 (기본 true) */
  border: { type: Boolean, default: true },

  /** 모양: square | rounded | circle (기본 rounded) */
  shape: {
    type: String as PropType<'square' | 'rounded' | 'circle'>,
    default: 'rounded',
    validator: (v: any) => ['square','rounded','circle'].includes(v),
  },

  /** 포커스 순서 제어(null이면 미지정) */
  tabIndex: {
    type: [Number, String] as PropType<number | string | null>,
    default: null,
    validator: (v: any) => v === null || v === '' || (!isNaN(+v) && isFinite(+v)),
  },

  /** 버튼형 인터랙션 활성화(addButtonCssEvent 적용) */
  buttonEnabled: { type: Boolean, default: false },
}
