<template>
  <div ref="editorWrap">
    <div data-vanillanote v-bind="combinedAttrs"></div>
  </div>
</template>

<script lang="ts" setup>
import { inject, computed, ref, onMounted, onBeforeUnmount, defineEmits, watch } from 'vue'
import { HisonVueConfig } from '..'
import { isValidHexColor, isValidPxValue } from '../utils/validators'
import { Vanillanote, VanillanoteElement, NoteData } from 'vanillanote2'

// props
const props = defineProps<{
  modelValue?: NoteData
  dataId: string
  mainColor?: string
  sizeLevelDesktop?: number
  textareaHeight?: string
}>()

// emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: NoteData): void
  (e: 'mounted', note: VanillanoteElement | null): void
}>()

const config = inject<HisonVueConfig>('hisonvue-config', {})
const vn: Vanillanote = inject('hisonvue-vn')!

const editorWrap = ref<HTMLElement | null>(null)
const noteInstance = ref<VanillanoteElement | null>(null)

// data-id 속성 처리
const dataIdAttr = computed(() => {
  if (!props.dataId) throw new Error(`[HisonVue] data-id attribute is required.`)
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
  const sizeLevel = !isNaN(Number(props.sizeLevelDesktop))
    ? Number(props.sizeLevelDesktop)
    : config.size === 's' ? 1
    : config.size === 'm' ? 3
    : config.size === 'l' ? 5
    : config.size === 'xl' ? 7
    : undefined

  if (sizeLevel !== undefined && (sizeLevel < 1 || sizeLevel > 9)) {
    throw new Error(`[HisonVue] Invalid sizeLevelDesktop: '${sizeLevel}'. Must be between 1 and 9.`)
  }
  return sizeLevel !== undefined ? { 'size-level-desktop': sizeLevel } : {}
})

// textareaHeight 속성 처리
const textareaHeightAttr = computed(() => {
  if (props.textareaHeight && !isValidPxValue(props.textareaHeight)) {
    throw new Error(`[HisonVue] Invalid textareaHeight: '${props.textareaHeight}'. Must be a positive number ending with 'px'.`)
  }
  return props.textareaHeight ? { 'textarea-height': props.textareaHeight } : {}
})

// 모든 속성 합치기
const combinedAttrs = computed(() => ({
  ...dataIdAttr.value,
  ...mainColorAttr.value,
  ...sizeLevelDesktopAttr.value,
  ...textareaHeightAttr.value
}))

// note 데이터 외부로 동기화하는 함수
const syncNoteData = () => {
  if (noteInstance.value) {
    isInput = false;
    const noteData = noteInstance.value.getNoteData()
    emit('update:modelValue', noteData)
  }
}
let isInput = false;
const setIsInputTrue = () => {
  isInput = true;
}

// mounted 시 에디터 등록 및 modelValue 반영
onMounted(() => {
  vn.init()
  if (!editorWrap.value) return
  vn.mountNote(editorWrap.value)

  noteInstance.value = vn.getNote(props.dataId)
  
  // 최초 modelValue 설정
  if (props.modelValue && noteInstance.value) {
    noteInstance.value.setNoteData(props.modelValue)
  }

  // 내부 편집 감지해서 sync
  if (noteInstance.value) {
    const textarea = noteInstance.value._elements?.textarea
    if (textarea) {
      textarea.addEventListener('beforeInput', setIsInputTrue);
      textarea.addEventListener('input', setIsInputTrue);
      textarea.addEventListener('blur', syncNoteData);
    }
  }

  emit('mounted', noteInstance.value)
})

// 언마운트 시 에디터 해제
onBeforeUnmount(() => {
  if (!editorWrap.value) return
  vn.unmountNote(editorWrap.value)
  if (noteInstance.value) {
    const textarea = noteInstance.value._elements?.textarea
    if (textarea) {
      textarea.removeEventListener('beforeInput', setIsInputTrue);
      textarea.removeEventListener('input', setIsInputTrue);
      textarea.removeEventListener('blur', syncNoteData);
    }
  }
})


watch(() => props.modelValue, (newValue) => {
  if (!isInput && newValue && noteInstance.value) {
    noteInstance.value.setNoteData(newValue)
  }
})
</script>

<style scoped>
</style>
