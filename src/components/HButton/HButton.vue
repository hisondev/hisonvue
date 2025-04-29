<template>
  <button
    ref="buttonRef"
    :class="['hison-button', props.addClassList, sizeClass, colorClass, visibleClass]"
    :style="props.style"
    @click="$emit('click')"
  >
    <slot>Hison Button</slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, inject, computed, ref, onMounted, onBeforeUnmount } from 'vue'
import type { HisonConfig } from '../../types'
import { Size } from "../../enums";
import { addButtonCssEvent, removeButtonCssEvent } from '../common/setButtonEvent';
import { buttonProps } from './props';
import { hisonCloser } from '../../core';

export default defineComponent({
  name: 'HButton',
  props: buttonProps,
  emits: ['mounted', 'click'],
  setup(props, { emit }) {
    const config = inject<HisonConfig>('hisonvue-config')!
    const buttonRef = ref<HTMLButtonElement | null>(null)
    if (!props.id) throw new Error(`[Hisonvue] button id attribute is required.`)

    const sizeClass = computed(() => {
      if (!props.size) return `hison-${config.componentStyle.size}-button`
      return `hison-${props.size}-button`
    })

    const colorClass = computed(() => {
      if (!props.color) return 'hison-primary-button'
      return `hison-${props.color}-button`
    })

    const visibleClass = computed(() => {
      if (props.visible === 'false') return 'hison-on-display-none'
      else return ''
    })

    onMounted(() => {
      if (buttonRef.value) {
        hisonCloser.element.buttonList[props.id!] = buttonRef.value
        buttonRef.value.dataset.color = props.color || 'primary'; //이벤트를 위한 dataset처리
        addButtonCssEvent(buttonRef.value)

        emit('mounted', buttonRef.value)
      }
    })

    onBeforeUnmount(() => {
      if (buttonRef.value) {
        delete hisonCloser.element.buttonList[props.id!]
        removeButtonCssEvent(buttonRef.value)
      }
    })

    return {
      buttonRef,
      props,
      sizeClass,
      colorClass,
      visibleClass
    }
  }
})
</script>

<style scoped>
</style>
