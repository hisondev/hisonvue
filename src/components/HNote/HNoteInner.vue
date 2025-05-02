<template>
    <div ref="editorWrap">
      <div data-vanillanote v-bind="bindAttrs"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import type { Vanillanote, VanillanoteElement, NoteData } from 'vanillanote2'
import { noteProps } from './props'
import { Size } from "../../enums"
import { getHexCodeFromColorText } from '../../utils'
import { hisonCloser } from '../..'

export default defineComponent({
name: 'HNoteInner',
props: noteProps,
emits: ['update:modelValue', 'mounted'],
setup(props, { emit }) {
    const vn: Vanillanote = hisonCloser.note
    const editorWrap = ref<HTMLElement | null>(null)
    const noteInstance = ref<VanillanoteElement | null>(null)

    const EXCLUDED_KEYS = ['modelValue'] as const
    const bindAttrs = computed(() => {
        if (!props.id) throw new Error(`[Hisonvue] id attribute is required.`)
        const attrs: Record<string, string> = {}
        attrs['data-id'] = props.id

        for (const [key, value] of Object.entries(props)) {
            if (EXCLUDED_KEYS.includes(key as any)) continue
            if (value === undefined || value === null) continue

            attrs[key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())] = String(value)
        }

        const sizeLevelDesktop = getSizeLevel(attrs['size-level-desktop'] || "3")
        attrs['size-level-desktop'] = sizeLevelDesktop
        const sizeLevelMobile = getSizeLevel(attrs['size-level-mobile'] || "7")
        attrs['size-level-mobile'] = sizeLevelMobile

        if (attrs.color) {
            attrs.color = getHexCodeFromColorText(attrs.color) ?? attrs.color
            attrs['main-color'] = attrs.color
            delete attrs.color
        }
        
        if (hisonCloser.componentStyle.invertColor) {
            attrs['invert-color'] = 'true'
        }

        return attrs
    })

    const getSizeLevel = (sizeLevel: string) => {
        let size = Number(sizeLevel)
        switch (hisonCloser.componentStyle.size) {
            case Size.s: size -= 2; break
            case Size.m: break
            case Size.l: size += 2; break
            case Size.xl: size += 3; break
        }
        return String(Math.min(Math.max(size, 1), 9))
    }

    const mutationObserver = new MutationObserver((mutations) => {
        const el = mutations[0]?.target
        if (!el) return
        const note = getNote(el as HTMLElement)
        if (!note) return
        syncNoteData()
    })

    const getNote = (targetElement: HTMLElement): VanillanoteElement | null => {
        let target: any = targetElement
        while (!(target instanceof Element)) target = target.parentNode
        return target.closest?.('[data-vanillanote]') || null
    }

    const isNoteDataEqual = (a: NoteData, b: NoteData) => {
        if (!a || !b) return false
        if (a.html !== b.html || a.plainText !== b.plainText) return false
        if (JSON.stringify(a.links) !== JSON.stringify(b.links)) return false
        if (JSON.stringify(a.files) !== JSON.stringify(b.files)) return false
        if (JSON.stringify(a.images) !== JSON.stringify(b.images)) return false
        if (JSON.stringify(a.videos) !== JSON.stringify(b.videos)) return false

        const fileKeysA = Object.keys(a.fileObjects || {})
        const fileKeysB = Object.keys(b.fileObjects || {})
        if (fileKeysA.length !== fileKeysB.length || !fileKeysA.every(k => fileKeysB.includes(k))) return false

        const imageKeysA = Object.keys(a.imageObjects || {})
        const imageKeysB = Object.keys(b.imageObjects || {})
        if (imageKeysA.length !== imageKeysB.length || !imageKeysA.every(k => imageKeysB.includes(k))) return false

        return true
    }

    const syncNoteData = () => {
        if (noteInstance.value) {
            emit('update:modelValue', noteInstance.value.getNoteData())
        }
    }

    onMounted(() => {
        vn.init()
        if (!editorWrap.value) return
        vn.mountNote(editorWrap.value)

        noteInstance.value = vn.getNote(props.id!)
        if (props.modelValue && noteInstance.value) {
            noteInstance.value.setNoteData(props.modelValue)
        }

        if (noteInstance.value) {
            const textarea = noteInstance.value._elements?.textarea
            mutationObserver.observe(textarea, { characterData: true, childList: true, subtree: true })
        }

        emit('mounted', noteInstance.value)
    })

    onBeforeUnmount(() => {
        if (!editorWrap.value) return
        vn.unmountNote(editorWrap.value)
        mutationObserver.disconnect()
    })

    watch(() => props.modelValue, (newVal) => {
        if (!noteInstance.value) return
        const current = noteInstance.value.getNoteData()
        if (!isNoteDataEqual(current, newVal!)) {
            noteInstance.value.setNoteData(newVal!)
        }
    })

    return {
        editorWrap,
        bindAttrs
    }
}
})
</script>

<style scoped></style>
  
