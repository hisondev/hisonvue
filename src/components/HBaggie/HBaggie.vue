<template>
  <div :class="['hison-layer-host', visibleClass]">
    <!-- 앵커: 타겟과 배지를 같은 grid 셀(1/1)에 겹쳐 올림 -->
    <span
      ref="anchorRef"
      :class="['hison-baggie-anchor', ...responsiveClassList]"
      @click.stop
      @mousedown.stop="$emit('mousedown', $event, baggieMethods)"
      @mouseup.stop="$emit('mouseup', $event, baggieMethods)"
      @mouseover.stop="$emit('mouseover', $event, baggieMethods)"
      @mouseout.stop="$emit('mouseout', $event, baggieMethods)"
    >
      <!-- 타겟 슬롯: 소비자가 넣는 원본 요소/컴포넌트 -->
      <span class="hison-baggie-target">
        <slot />
      </span>

      <!-- 배지 박스: 같은 셀 위에 겹침 -->
      <div
        v-if="visible"
        ref="baggieRef"
        :class="[
          'hison-baggie',
          positionClass,
          backgroundTypeClass,
          borderClass,
          shapeClass,
          buttonEnabled ? 'hison-baggie-button' : null,
        ]"
        :style="[badgeStyle, props.style]"
        role="status"
        :tabindex="tabIndex ?? undefined"
        @click.stop="onClick"
        @keydown.enter.stop.prevent="onKeyActivate"
        @keydown.space.stop.prevent="onKeyActivate"
      >
        <template v-if="$slots.badge">
          <slot name="badge" />
        </template>
        <template v-else>
          <span class="hison-baggie-text">{{ text }}</span>
        </template>
      </div>
    </span>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, onMounted, onBeforeUnmount, nextTick, unref, watch
} from 'vue'
import { baggieProps } from './props'
import type { HBaggieMethods } from '../../types'
import { BackgroundType, hisonCloser, ScreenPosition, ScreenPositionValue } from '../..'
import {
  addComponentNameToClass,
  extractResponsiveClasses,
  getUUID,
  registerReloadable,
  reloadHisonComponent,
  toClassString,
  unregisterReloadable,
} from '../../utils'
import { useDevice } from '../../core'
import { addButtonCssEvent, removeButtonCssEvent } from '../common/setButtonCssEvent'

export default defineComponent({
  name: 'HBaggie',
  props: baggieProps,
  inheritAttrs: false,
  emits: ['mounted','responsive-change','click','mousedown','mouseup','mouseover','mouseout'],
  setup(props, { emit }) {
    const id = props.id || getUUID()
    const reloadId = `hbaggie:${id}`
    const device = useDevice()

    const anchorRef = ref<HTMLSpanElement | null>(null)
    const baggieRef  = ref<HTMLDivElement | null>(null)

    const visible   = ref<boolean>(props.visible)
    const zIndex    = ref<number>(props.zIndex ?? 1000)
    const position  = ref<ScreenPositionValue>(props.position as ScreenPositionValue)

    const text = ref<string>(props.text ?? '')
    const border = ref<boolean>(props.border ?? true)
    const backgroundType = ref(props.backgroundType || BackgroundType.filled)
    const shape = ref<'square'| 'rounded' | 'circle'>(props.shape || 'rounded')
    const tabIndex = ref<number | null>(
      props.tabIndex !== null && props.tabIndex !== '' ? Number(props.tabIndex) : null
    )
    const buttonEnabled = ref<boolean>(props.buttonEnabled ?? false)

    const visibleClass = computed(() => (visible.value ? '' : 'hison-display-none'))
    const borderClass = computed(() => (border.value ? 'hison-border' : ''))
    const backgroundTypeClass = computed(() => {
      switch (backgroundType.value) {
        case BackgroundType.transparent: return 'hison-bg-transparent'
        case BackgroundType.empty:       return 'hison-bg-empty'
        default:                         return 'hison-bg-filled'
      }
    })
    const shapeClass = computed(() => {
      if (shape.value === 'circle') return 'hison-baggie-shape-circle'
      if (shape.value === 'square') return 'hison-baggie-shape-square'
      return 'hison-baggie-shape-rounded'
    })

    // responsive classes (size, color)
    const responsiveClassList = ref<string[]>([])
    const refreshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
      addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
    }

    const positionClass = computed(() => `hison-baggie-pos-${position.value}`)
    const badgeStyle = computed(() => ({ zIndex: zIndex.value }))

    // 버튼형 인터랙션(선택적)
    const attachButtonCssEvent = (add = true) => {
      const el = baggieRef.value
      if (!el) return
      removeButtonCssEvent(el)
      if (add && buttonEnabled.value) addButtonCssEvent(el)
    }

    const onClick = (e: MouseEvent) => {
      emit('click', e, unref(baggieMethods)!)
    }
    const onKeyActivate = () => {
      if (!buttonEnabled.value) return
      onClick(new MouseEvent('click'))
    }

    // methods
    const baggieMethods = ref<HBaggieMethods | null>(null)

    const mount = () => {
      if (!hisonCloser.component.baggieList) hisonCloser.component.baggieList = {} as any
      if (hisonCloser.component.baggieList[id]) throw new Error('[Hisonvue] baggie id attribute was duplicated.')
      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })

      refreshResponsiveClassList()
      nextTick(() => attachButtonCssEvent(true))

      baggieMethods.value = {
        getId: () => id,
        getType: () => 'baggie',
        isVisible: () => visible.value,
        setVisible: (v: boolean) => { visible.value = v },
        getZIndex: () => zIndex.value,
        setZIndex: (v: number) => { zIndex.value = v },
        getPosition: () => position.value,
        setPosition: (v) => { position.value = v as ScreenPositionValue },
        getText: () => text.value,
        setText: (t: string) => { text.value = t },
        isBorder: () => border.value,
        setBorder: (v: boolean) => { border.value = v },
        getBackgroundType: () => backgroundType.value as any,
        setBackgroundType: (t: any) => { backgroundType.value = t },
        getShape: () => shape.value,
        setShape: (s: 'square' | 'rounded' | 'circle') => { shape.value = s },
        getTabIndex: () => tabIndex.value,
        setTabIndex: (v: number | null) => { tabIndex.value = v !== null && v !== undefined ? Number(v) : null },
        isButtonEnabled: () => buttonEnabled.value,
        setButtonEnabled: (v: boolean) => { buttonEnabled.value = v; nextTick(() => attachButtonCssEvent(true)) },
        reload: () => reloadHisonComponent(reloadId),
      }

      hisonCloser.component.baggieList[id] = baggieMethods.value
      emit('mounted', baggieMethods.value)
    }

    const unmount = () => {
      unregisterReloadable(reloadId)
      const el = baggieRef.value
      if (el) removeButtonCssEvent(el)
      if (hisonCloser.component.baggieList) delete hisonCloser.component.baggieList[id]
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(device, (newDevice) => {
      refreshResponsiveClassList()
      emit('responsive-change', newDevice)
    })

    return {
      id,
      props,
      anchorRef,
      baggieRef,

      // state out
      text,

      // classes/styles
      visibleClass,
      responsiveClassList,
      backgroundTypeClass,
      borderClass,
      shapeClass,
      positionClass,
      badgeStyle,

      // methods for slot/consumers
      baggieMethods: computed(() => unref(baggieMethods)),

      tabIndex,
      buttonEnabled,
      onClick,
      onKeyActivate,
    }
  }
})
</script>

<style scoped>
/* Anchor: 타겟과 배지를 같은 grid 셀(1/1)에 겹쳐놓기 */
.hison-baggie-anchor {
  display: inline-grid;
  position: relative;
  vertical-align: middle;
}
.hison-baggie-target { grid-area: 1 / 1; }

/* 배지 박스: 같은 셀 위에 뜸 */
.hison-baggie {
  grid-area: 1 / 1;
  display: inline-grid;
  place-items: center;
  min-width: 1.25rem;
  min-height: 1.25rem;
  padding: 0.2rem 0.4rem;
  box-sizing: border-box;
  font-family: var(--hison-font-family);
  line-height: 1;
  white-space: nowrap;
  user-select: none;
  pointer-events: auto;
}

/* 모양 */
.hison-baggie-shape-square  { border-radius: 3px; }
.hison-baggie-shape-rounded { border-radius: 8px; }
.hison-baggie-shape-circle  { border-radius: 999px; padding: 0.25rem; min-width: 1.25rem; min-height: 1.25rem; }

/* 텍스트 */
.hison-baggie-text { display: inline-block; text-align: center; }

/* 8방향 포지션 + 살짝 겹치기(translate) */
.hison-baggie-pos-top-left      { place-self: start start;   transform: translate(-35%, -35%); }
.hison-baggie-pos-top-center    { place-self: start center;  transform: translate(0,   -35%); }
.hison-baggie-pos-top-right     { place-self: start end;     transform: translate(35%, -35%); }

.hison-baggie-pos-middle-left   { place-self: center start;  transform: translate(-35%, 0); }
.hison-baggie-pos-middle-right  { place-self: center end;    transform: translate(35%, 0); }

.hison-baggie-pos-bottom-left   { place-self: end start;     transform: translate(-35%, 35%); }
.hison-baggie-pos-bottom-center { place-self: end center;    transform: translate(0,    35%); }
.hison-baggie-pos-bottom-right  { place-self: end end;       transform: translate(35%,  35%); }

/* 색/배경 (HLabel 규칙 재사용) */
.hison-color-primary > .hison-baggie.hison-bg-filled { background-color: var(--hison-primary-buttonColor); color: var(--hison-primary-filledTextColor); }
.hison-color-muted   > .hison-baggie.hison-bg-filled { background-color: var(--hison-muted-buttonColor); color: var(--hison-muted-filledTextColor); }
.hison-color-info    > .hison-baggie.hison-bg-filled { background-color: var(--hison-info-buttonColor); color: var(--hison-info-filledTextColor); }
.hison-color-success > .hison-baggie.hison-bg-filled { background-color: var(--hison-success-buttonColor); color: var(--hison-success-filledTextColor); }
.hison-color-danger  > .hison-baggie.hison-bg-filled { background-color: var(--hison-danger-buttonColor); color: var(--hison-danger-filledTextColor); }
.hison-color-warning > .hison-baggie.hison-bg-filled { background-color: var(--hison-warning-buttonColor); color: var(--hison-warning-filledTextColor); }

.hison-color-primary > .hison-baggie.hison-bg-empty { background-color: var(--hison-emptyColor); color: var(--hison-primary-buttonColor); }
.hison-color-muted   > .hison-baggie.hison-bg-empty { background-color: var(--hison-emptyColor); color: var(--hison-muted-buttonColor); }
.hison-color-info    > .hison-baggie.hison-bg-empty { background-color: var(--hison-emptyColor); color: var(--hison-info-buttonColor); }
.hison-color-success > .hison-baggie.hison-bg-empty { background-color: var(--hison-emptyColor); color: var(--hison-success-buttonColor); }
.hison-color-danger  > .hison-baggie.hison-bg-empty { background-color: var(--hison-emptyColor); color: var(--hison-danger-buttonColor); }
.hison-color-warning > .hison-baggie.hison-bg-empty { background-color: var(--hison-emptyColor); color: var(--hison-warning-buttonColor); }

.hison-color-primary > .hison-baggie.hison-bg-transparent { background-color: transparent; color: var(--hison-primary-buttonColor); }
.hison-color-muted   > .hison-baggie.hison-bg-transparent { background-color: transparent; color: var(--hison-muted-buttonColor); }
.hison-color-info    > .hison-baggie.hison-bg-transparent { background-color: transparent; color: var(--hison-info-buttonColor); }
.hison-color-success > .hison-baggie.hison-bg-transparent { background-color: transparent; color: var(--hison-success-buttonColor); }
.hison-color-danger  > .hison-baggie.hison-bg-transparent { background-color: transparent; color: var(--hison-danger-buttonColor); }
.hison-color-warning > .hison-baggie.hison-bg-transparent { background-color: transparent; color: var(--hison-warning-buttonColor); }

/* border shadow (라벨 규칙 재사용) */
.hison-color-primary > .hison-baggie.hison-border { box-shadow: 0 1px 2px 0 var(--hison-primary-shadowColor); }
.hison-color-muted   > .hison-baggie.hison-border { box-shadow: 0 1px 2px 0 var(--hison-muted-shadowColor); }
.hison-color-info    > .hison-baggie.hison-border { box-shadow: 0 1px 2px 0 var(--hison-info-shadowColor); }
.hison-color-success > .hison-baggie.hison-border { box-shadow: 0 1px 2px 0 var(--hison-success-shadowColor); }
.hison-color-danger  > .hison-baggie.hison-border { box-shadow: 0 1px 2px 0 var(--hison-danger-shadowColor); }
.hison-color-warning > .hison-baggie.hison-border { box-shadow: 0 1px 2px 0 var(--hison-warning-shadowColor); }
</style>
