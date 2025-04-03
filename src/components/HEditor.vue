<template>
  <div ref="editorWrap">
    <div data-vanillanote v-bind="combinedAttrs"></div>
  </div>
</template>

<script lang="ts" setup>
import { inject, computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { HisonVueConfig } from '..'
import { isValidHexColor, isValidPxValue } from '../utils/validators'
import { Vanillanote } from 'vanillanote2';

const props = defineProps<{
  dataId: string
  mainColor?: string
  sizeLevelDesktop?: number
  textareaHeight?: string
}>()

const config = inject<HisonVueConfig>('hisonvue-config', {});
const editorWrap = ref<HTMLElement | null>(null);
const vn: Vanillanote = inject('hisonvue-vn')!

// mainColor 속성 처리
const dataIdAttr = computed(() => {
  if(!props.dataId) throw new Error(`data-id attribute is requierd`);
  return { 'data-id': props.dataId }
})

// mainColor 속성 처리
const mainColorAttr = computed(() => {
  const color = props.mainColor ?? config.primaryColor
  if (color && !isValidHexColor(color)) {
    throw new Error(`[HisonVue] Invalid mainColor: '${color}'. Must be a valid hex color (e.g., '#ffffff').`)
  }
  return color ? { 'main-color': color } : {}
})

// sizeLevelDesktop 속성 처리
const sizeLevelDesktopAttr = computed(() => {
  const sizeLevelDesktop = !isNaN(Number(props.sizeLevelDesktop))
    ? Number(props.sizeLevelDesktop)
    : config.size === 's' ? 1
    : config.size === 'm' ? 3
    : config.size === 'l' ? 5
    : config.size === 'xl' ? 7
    : undefined

  if (sizeLevelDesktop !== undefined && (sizeLevelDesktop < 1 || sizeLevelDesktop > 9)) {
    throw new Error(`[HisonVue] Invalid sizeLevelDesktop: '${sizeLevelDesktop}'. Must be between 1 and 9.`)
  }
  return sizeLevelDesktop !== undefined ? { 'size-level-desktop': sizeLevelDesktop } : {}
})

// textareaHeight 처리
const textareaHeightAttr = computed(() => {
  if (props.textareaHeight && !isValidPxValue(props.textareaHeight)) {
    throw new Error(`[HisonVue] Invalid textareaHeight: '${props.textareaHeight}'. Must be a positive number ending with 'px'.`)
  }
  return props.textareaHeight ? { 'textarea-height': props.textareaHeight } : {}
})

// 모든 속성 병합
const combinedAttrs = computed(() => ({
  ...dataIdAttr.value,
  ...mainColorAttr.value,
  ...sizeLevelDesktopAttr.value,
  ...textareaHeightAttr.value
}))

onMounted(()=>{
  vn.init();
  if(!editorWrap.value) return;
  vn.mountNote(editorWrap.value);
})

onBeforeUnmount(()=>{
  if(!editorWrap.value) return;
  vn.unmountNote(editorWrap.value);
})
</script>

<style scoped>
</style>
