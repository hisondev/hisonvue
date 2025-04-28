<template>
  <div ref="editorWrap">
    <div data-vanillanote v-bind="bindAttrs"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import type { Vanillanote, VanillanoteElement, NoteData } from 'vanillanote2'
import type { HisonConfig } from '../../types'
import { noteProps } from './props'
import { Size } from "../../enums";
import { hisonCloser } from '../../core';

export default defineComponent({
  name: 'HNote',
  props: noteProps,
  emits: ['update:modelValue', 'mounted'],
  setup(props, { emit }) {
    const config = inject<HisonConfig>('hisonvue-config')!
    const vn: Vanillanote = hisonCloser.note
    console.log(vn);
    const editorWrap = ref<HTMLElement | null>(null)
    const noteInstance = ref<VanillanoteElement | null>(null)

    const EXCLUDED_KEYS = ['modelValue'] as const
    const bindAttrs = computed(() => {
      if (!props.dataId) throw new Error(`[Hisonvue] data-id attribute is required.`)
      const attrs: Record<string, string> = {}
      for (const [key, value] of Object.entries(props)) {
          if (EXCLUDED_KEYS.includes(key as any)) continue
          if (value === undefined || value === null) continue

          attrs[key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())] = String(value)
      }
      const sizeLevelDesktop = getSizeLevel(attrs['size-level-desktop'] ? attrs['size-level-desktop'] : "3")
      attrs['size-level-desktop'] = sizeLevelDesktop
      const sizeLevelMobile = getSizeLevel(attrs['size-level-mobile'] ? attrs['size-level-mobile'] : "7")
      attrs['size-level-mobile'] = sizeLevelMobile

      return attrs
    })

    const getSizeLevel = (sizeLevel: string) => {
      let size = Number(sizeLevel)
      switch(config.componentStyle.size) {
        case Size.s:
          size = size - 2
          break
        case Size.m:
          break
        case Size.l:
          size = size + 2
          break
        case Size.xl:
          size = size + 3
          break
      }
      if(size < 1) size = 1
      if(size > 9) size = 9
      return String(size)
    }

    const mutationObserver = new MutationObserver((mutations) => {
      let mutationEl
      mutations.forEach((mutation) => {
          mutationEl = mutation.target
      })
      if(!mutationEl) return
      const note = getNote(mutationEl as HTMLElement)
      if(!note) return
      syncNoteData()
    })

    const getNote = (targetElement: HTMLElement): VanillanoteElement | null => {
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

    const syncNoteData = () => {
      if (noteInstance.value) {
        const noteData = noteInstance.value.getNoteData()
        emit('update:modelValue', noteData)
      }
    }

    onMounted(() => {
      vn.init()
      if (!editorWrap.value) return
      vn.mountNote(editorWrap.value)

      noteInstance.value = vn.getNote(props.dataId!)
      if (props.modelValue && noteInstance.value) {
        noteInstance.value.setNoteData(props.modelValue)
      }

      if (noteInstance.value) {
        const textarea = noteInstance.value._elements?.textarea
        mutationObserver.observe(textarea, {characterData: true, childList: true, subtree: true})
      }
      emit('mounted', noteInstance.value)
    })

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

    return {
      editorWrap,
      bindAttrs
    }
  }
})
</script>

<style scoped>
</style>
