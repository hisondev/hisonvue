<template>
  <button
    ref="buttonRef"
    :class="[
      'hison-button',
      ...responsiveClassList,
      visibleClass,
      disableClass
    ]"
    :style="props.style"
    :disabled="disable"
    :title="title || undefined"
    @click="$emit('click', $event, buttonMethods)"
    @mousedown="$emit('mousedown', $event, buttonMethods)"
    @mouseup="$emit('mouseup', $event, buttonMethods)"
    @mouseover="$emit('mouseover', $event, buttonMethods)"
    @mouseout="$emit('mouseout', $event, buttonMethods)"
  >
    <slot v-if="hasSlot" />
    <span v-else v-html="internalTextHtml"></span>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onBeforeUnmount, nextTick, watch, useSlots, unref } from 'vue'
import type { HButtonMethods } from '../../types'
import { addButtonCssEvent, removeButtonCssEvent } from '../common/setButtonCssEvent'
import { buttonProps } from './props'
import { hisonCloser } from '../..'
import { addComponentNameToClass, extractResponsiveClasses, getUUID, registerReloadable, unregisterReloadable } from '../../utils'
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
    const reloadId = `hbutton:${props.id}`
    const device = useDevice()
    const slots = useSlots()

    const visible = ref(props.visible)
    const disable = ref(props.disable)
    const title = ref(props.title || '')

    const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')
    const disableClass = computed(() => disable.value ? 'hison-disable' : '')

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
        isVisible: () => window.getComputedStyle(buttonRef.value!).display !== 'none',
        isDisable: () => disable.value,
        setText: (val: string) => {
            if (!hasSlot.value) internalText.value = val
        },
        setTitle: (val: string) => {
            title.value = val
        },
        setVisible: (val: boolean) => {
            visible.value = val
        },
        setDisable: (val: boolean) => {
            disable.value = val
        },
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
        title,
        responsiveClassList,
        internalText,
        internalTextHtml,
        hasSlot,
    }
  }
})
</script>

<style scoped></style>
