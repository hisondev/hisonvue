<template>
  <div ref="editorWrap">
    <div data-vanillanote v-bind="combinedAttrs"></div>
  </div>
</template>

<script lang="ts" setup>
import { inject, computed, ref, onMounted, onBeforeUnmount, defineEmits, watch } from 'vue'
import { HisonvueConfig } from '../..'
import { isValidHexColor, isValidPxValue } from '../../utils/validators'
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

const config = inject<HisonvueConfig>('hisonvue-config', {})
const vn: Vanillanote = inject('hisonvue-vn')!

const editorWrap = ref<HTMLElement | null>(null)
const noteInstance = ref<VanillanoteElement | null>(null)

// data-id 속성 처리
const dataIdAttr = computed(() => {
  if (!props.dataId) throw new Error(`[Hisonvue] data-id attribute is required.`)
  return { 'data-id': props.dataId }
})

// mainColor 속성 처리
const mainColorAttr = computed(() => {
  const color = props.mainColor ?? config.primaryColor
  if (color && !isValidHexColor(color)) {
    throw new Error(`[Hisonvue] Invalid mainColor: '${color}'. Must be a valid hex color (e.g., '#ffffff').`)
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
    throw new Error(`[Hisonvue] Invalid sizeLevelDesktop: '${sizeLevel}'. Must be between 1 and 9.`)
  }
  return sizeLevel !== undefined ? { 'size-level-desktop': sizeLevel } : {}
})

// textareaHeight 속성 처리
const textareaHeightAttr = computed(() => {
  if (props.textareaHeight && !isValidPxValue(props.textareaHeight)) {
    throw new Error(`[Hisonvue] Invalid textareaHeight: '${props.textareaHeight}'. Must be a positive number ending with 'px'.`)
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

const mutationObserver = new MutationObserver((mutations) => {
  let mutationEl
  mutations.forEach((mutation) => {
      mutationEl = mutation.target
  })
  if(!mutationEl) return
  const note = getParentNote(mutationEl)
  if(!note) return
  syncNoteData()
})

const getParentNote = (targetElement: HTMLElement): VanillanoteElement | null => {
  let target: any = targetElement
  while(!(target instanceof Element)) {
      target = target.parentNode
  }
  if(!target.closest) return null
  return target.closest('[data-vanillanote]')!
}

const isNoteDataEqual = (a: NoteData, b: NoteData) => {
  if (!a || !b) return false;
  if (a.html !== b.html) return false;
  if (a.plainText !== b.plainText) return false;

  if (JSON.stringify(a.links) !== JSON.stringify(b.links)) return false;
  if (JSON.stringify(a.files) !== JSON.stringify(b.files)) return false;
  if (JSON.stringify(a.images) !== JSON.stringify(b.images)) return false;
  if (JSON.stringify(a.videos) !== JSON.stringify(b.videos)) return false;

  const fileKeysA = Object.keys(a.fileObjects || {});
  const fileKeysB = Object.keys(b.fileObjects || {});
  if (fileKeysA.length !== fileKeysB.length) return false;
  if (!fileKeysA.every(k => fileKeysB.includes(k))) return false;

  const imageKeysA = Object.keys(a.imageObjects || {});
  const imageKeysB = Object.keys(b.imageObjects || {});
  if (imageKeysA.length !== imageKeysB.length) return false;
  if (!imageKeysA.every(k => imageKeysB.includes(k))) return false;

  return true;
}

// note 데이터 외부로 동기화하는 함수
const syncNoteData = () => {
  if (noteInstance.value) {
    const noteData = noteInstance.value.getNoteData()
    emit('update:modelValue', noteData)
  }
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
    mutationObserver.observe(textarea, {characterData: true, childList: true, subtree: true})
  }
  emit('mounted', noteInstance.value)
})

// 언마운트 시 에디터 해제
onBeforeUnmount(() => {
  if (!editorWrap.value) return
  vn.unmountNote(editorWrap.value)
  if (noteInstance.value) {
    mutationObserver.disconnect()
  }
})

watch(() => props.modelValue, (newValue) => {
  if (!noteInstance.value) return;
  const current = noteInstance.value.getNoteData();
  if (!isNoteDataEqual(current, newValue!)) {
    noteInstance.value.setNoteData(newValue!);
  }
})
</script>

<style scoped>
</style>
