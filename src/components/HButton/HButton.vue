<template>
  <button
    ref="buttonRef"
    :class="[
      'hison-button',
      ...responsiveClassList,
      visibleClass,
      disableClass,
      backgroundTypeClass
    ]"
    :style="props.style"
    :disabled="disable"
    :title="title || undefined"
    @click="onClick"
    @mousedown="$emit('mousedown', $event, buttonMethods)"
    @mouseup="$emit('mouseup', $event, buttonMethods)"
    @mouseover="$emit('mouseover', $event, buttonMethods)"
    @mouseout="$emit('mouseout', $event, buttonMethods)"
  >
    <template v-if="$slots.icon">
      <slot name="icon" />
    </template>
    <slot v-if="hasSlot" />
    <span v-else v-html="internalTextHtml"></span>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onBeforeUnmount, nextTick, watch, useSlots, unref } from 'vue'
import type { HButtonMethods } from '../../types'
import { addButtonCssEvent, removeButtonCssEvent } from '../common/setButtonCssEvent'
import { buttonProps } from './props'
import { BackgroundType, hisonCloser } from '../..'
import { addComponentNameToClass, extractResponsiveClasses, getSpecificClassValueFromClassList, getUUID, registerReloadable, reloadHisonComponent, unregisterReloadable } from '../../utils'
import { useDevice } from '../../core'

export default defineComponent({
  name: 'HButton',
  props: buttonProps,
  inheritAttrs: false,
  emits: ['mounted', 'responsive-change', 'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout'],
  setup(props, { emit }) {
    const buttonRef = ref<HTMLButtonElement | null>(null)
    const buttonMethods = ref<HButtonMethods | null>(null)
    const id = props.id ? props.id : getUUID()
    const reloadId = `hbutton:${id}`
    const device = useDevice()
    const slots = useSlots()
    const isPending = ref(false)
    const clickInterval = ref(props.clickInterval || 0) // ref로 내부에서만 관리
    const lastClickTime = ref(0)

    const visible = ref(props.visible)
    const disable = ref(props.disable)
    const title = ref(props.title || '')

    const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')
    const disableClass = computed(() => disable.value ? 'hison-disable' : '')
    const backgroundType = ref(props.backgroundType || BackgroundType.filled)
    const backgroundTypeClass = computed(() => {
      switch (backgroundType.value) {
        case BackgroundType.empty:
          return 'hison-bg-empty'
        case BackgroundType.transparent:
          return 'hison-bg-transparent'
        default:
          return ''
      }
    })

    const hasSlot = computed(() => !!slots.default)
    const internalText = ref(props.text || '')
    const internalTextHtml = computed(() =>
        hasSlot.value ? '' : (internalText.value || '').replace(/\n/g, '<br>')
    )

    const responsiveClassList = ref<string[]>([])
    const refleshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(props.class || '', device.value)
      addComponentNameToClass(responsiveClassList.value, 'size', 'button', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'button', 'primary')
    }

    const onClick = async (e: MouseEvent) => {
      const now = Date.now()
      if (isPending.value) return
      if (clickInterval.value > 0 && now - lastClickTime.value < clickInterval.value) return
      lastClickTime.value = now
      isPending.value = true
      try {
        const results = emit('click', e, buttonMethods.value!)
        const resultArray = Array.isArray(results) ? results : []
        await Promise.all(
          resultArray
            .filter(res => res && typeof res.then === 'function')
            .map(res => res as Promise<any>)
        )
      } finally {
        isPending.value = false
      }
    }

    const mount = () => {
      if (hisonCloser.component.buttonList[id]) throw new Error(`[Hisonvue] button id attribute was duplicated.`)
      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })
      if (!buttonRef.value) return
      
      refleshResponsiveClassList()
      addButtonCssEvent(buttonRef.value)
      buttonMethods.value = {
        getId: () => id,
        getType : () => 'button',
        getText: () => hasSlot.value ? '' : internalText.value,
        getTitle: () => title.value,
        isVisible: () => visible.value,
        isDisable: () => disable.value,
        setText: (val: string) => { if (!hasSlot.value) internalText.value = val },
        setTitle: (val: string) => { title.value = val },
        setVisible: (val: boolean) => { visible.value = val },
        setDisable: (val: boolean) => { disable.value = val },
        getBackgroundType: () => backgroundType.value,
        setBackgroundType: (type: BackgroundType) => { backgroundType.value = type },
        unlock: () => { isPending.value = false },
        getClickInterval: () => clickInterval.value,
        setClickInterval: (ms: number) => {
          clickInterval.value = ms
          lastClickTime.value = 0 // 즉시 클릭 가능하게 초기화 (선택)
        },
        focus: () => { buttonRef.value?.focus(); },
        reload: () => reloadHisonComponent(reloadId)
      }
      hisonCloser.component.buttonList[id] = buttonMethods.value
      emit('mounted', buttonMethods.value)
    }

    const unmount = () => {
      unregisterReloadable(reloadId)
      delete hisonCloser.component.buttonList[id]
      if (buttonRef.value) {
        removeButtonCssEvent(buttonRef.value)
      }
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(device, (newDevice) => {
      refleshResponsiveClassList()
      emit('responsive-change', newDevice)
    })

    return {
        buttonRef,
        buttonMethods: computed(() => unref(buttonMethods)),
        props,
        visibleClass,
        disable,
        disableClass,
        backgroundTypeClass,
        title,
        responsiveClassList,
        internalText,
        internalTextHtml,
        hasSlot,
        onClick,
    }
  }
})
</script>

<style scoped></style>
