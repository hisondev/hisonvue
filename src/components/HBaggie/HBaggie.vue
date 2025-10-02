<template>
    <span
      ref="anchorRef"
      :class="['hison-baggie-anchor', visibleClass, ...responsiveClassList]"
      :style="anchorStyle"
      @mousedown="$emit('mousedown', $event, baggieMethods)"
      @mouseup="$emit('mouseup', $event, baggieMethods)"
      @mouseover="$emit('mouseover', $event, baggieMethods)"
      @mouseout="$emit('mouseout', $event, baggieMethods)"
    >
      <span class="hison-baggie-target">
        <slot />
      </span>

      <div
        v-if="baggieVisible"
        ref="baggieRef"
        :class="[
          'hison-baggie',
          positionClass,
          backgroundTypeClass,
          borderClass,
          shapeClass,
          baggieVisibleClass,
          buttonEnabled ? 'hison-baggie-button' : null,
        ]"
        :style="[badgeStyle, props.style]"
        role="status"
        :tabindex="tabIndex ?? undefined"
        @click="onClick"
        @keydown.enter.prevent="onKeyActivate"
        @keydown.space.prevent="onKeyActivate"
      >
        <template v-if="$slots.badge">
          <slot name="badge" />
        </template>
        <template v-else>
          <span class="hison-baggie-text">{{ text }}</span>
        </template>
      </div>
    </span>
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
    const baggieVisible   = ref<boolean>(props.baggieVisible)
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
    const baggieVisibleClass = computed(() => (baggieVisible.value ? '' : 'hison-display-none'))
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

    const responsiveClassList = ref<string[]>([])
    const refreshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
      addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
    }

    const positionClass = computed(() => `hison-baggie-pos-${position.value}`)
    const anchorStyle = computed(() => ({ zIndex: zIndex.value }))
    const badgeStyle = computed(() => ({ zIndex: zIndex.value + 1 }))

    const attachButtonCssEvent = (add = true) => {
      const el = baggieRef.value
      if (!el) return
      removeButtonCssEvent(el)
      if (add && buttonEnabled.value) addButtonCssEvent(el)
    }

    const onClick = (e: MouseEvent) => {
      if (!buttonEnabled.value) return
      emit('click', e, unref(baggieMethods)!)
    }
    const onKeyActivate = () => {
      if (!buttonEnabled.value) return
      onClick(new MouseEvent('click'))
    }

    const baggieMethods = ref<HBaggieMethods | null>(null)

    const mount = () => {
      if (hisonCloser.component.baggieList[id] && hisonCloser.component.baggieList[id].isHisonvueComponent) console.warn(`[Hisonvue] The baggie ID is at risk of being duplicated. ${id}`)
      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })

      refreshResponsiveClassList()
      nextTick(() => attachButtonCssEvent(true))

      baggieMethods.value = {
        isHisonvueComponent: true,
        getId: () => id,
        getType: () => 'baggie',
        isVisible: () => visible.value,
        setVisible: (v: boolean) => { visible.value = v },
        isBaggieVisible: () => baggieVisible.value,
        setBaggieVisible: (v: boolean) => { baggieVisible.value = v },
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
      delete hisonCloser.component.baggieList[id]
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(device, (newDevice) => {
      refreshResponsiveClassList()
      emit('responsive-change', newDevice)
    })

    watch(() => props.visible, v => { if (v !== visible.value) visible.value = !!v })
    watch(() => props.baggieVisible, v => { if (v !== baggieVisible.value) { baggieVisible.value = !!v; nextTick(() => attachButtonCssEvent(true)) } })
    watch(() => props.zIndex, v => { const n = Number(v); if (Number.isFinite(n) && n !== zIndex.value) zIndex.value = n })
    watch(() => props.position, v => { if (typeof v === 'string' && v !== position.value) position.value = v as ScreenPositionValue })
    watch(() => props.text, v => { const t = v ?? ''; if (t !== text.value) text.value = t })
    watch(() => props.border, v => { const b = !!v; if (b !== border.value) border.value = b })
    watch(() => props.backgroundType, v => { if (v && v !== backgroundType.value) backgroundType.value = v as any })
    watch(() => props.shape, v => { if ((v === 'square' || v === 'rounded' || v === 'circle') && v !== shape.value) shape.value = v })
    watch(() => props.tabIndex, v => { const nv = (v === null || v === '') ? null : Number(v); if (nv !== tabIndex.value) tabIndex.value = nv })
    watch(() => props.buttonEnabled, v => { const nv = !!v; if (nv !== buttonEnabled.value) { buttonEnabled.value = nv; nextTick(() => attachButtonCssEvent(true)) } })
    watch(() => props.class, () => refreshResponsiveClassList())

    return {
      id,
      props,
      anchorRef,
      baggieRef,
      text,
      visibleClass,
      baggieVisibleClass,
      responsiveClassList,
      backgroundTypeClass,
      borderClass,
      shapeClass,
      positionClass,
      anchorStyle,
      badgeStyle,
      baggieMethods: computed(() => unref(baggieMethods)),
      tabIndex,
      buttonEnabled,
      onClick,
      onKeyActivate,
    }
  }
})
</script>

<style scoped></style>
