<template>
  <button
    class="hison-button"
    @click="$emit('click')"
  >
    <slot>Hison Button</slot>
  </button>
</template>
<!--
  <button
    class="hison-button"
    :style="`background-color: ${buttonColor}; ${buttonSize}`"
    @click="$emit('click')"
  >
-->

<script lang="ts">
import { defineComponent, inject, computed } from 'vue'
import type { HisonConfig } from '../../types'
import { Size } from "../../enums";

export default defineComponent({
  name: 'HButton',
  props: {
    textColor: String
  },
  emits: ['click'],
  setup(_, { emit }) {
    const config = inject<HisonConfig>('hisonvue-config')!
    //속성(props)으로 받아야함!!!!!
    const buttonColor = computed(() => config?.primaryColor || '#000')
    const buttonSize = computed(() => {
      switch (config?.size) {
        case Size.s : return 'padding: 0.5rem 0.6rem; font-size: 0.7rem;'
        case Size.m : return 'padding: 0.6rem 0.75rem; font-size: 0.8rem;'
        case Size.l : return 'padding: 0.8rem 1rem; font-size: 0.9rem;'
        case Size.xl : return 'padding: 1rem 1.25rem; font-size: 1rem;'
        default: return ''
      }
    })

    return {
      buttonColor,
      buttonSize
    }
  }
})
</script>

<style scoped>
/*
.hison-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: var(--primary-color, #000);
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
  margin: 2px 2px;
  border-radius: 5px;
  box-shadow: 0.25px 0.25px 2px 0.25px #9dae9d;
}
*/
.hison-button:hover {
  opacity: 0.7;
  box-shadow : 0.25px 0.25px 0.25px 0.25px #9dae9d;
}
</style>
