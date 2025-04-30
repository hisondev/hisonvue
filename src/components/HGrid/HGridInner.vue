<template>
    <div ref="editorWrap">
      <div data-vanillagrid v-bind="bindAttrs"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onBeforeUnmount, ref } from 'vue'
import type { Vanillagrid, GridMethods } from 'vanillagrid2'
import type { HGridColumn } from '../../types'
import { gridProps } from './props'
import { hisonCloser } from '../../core'
import { getHexCodeFromColorText } from '../../utils'

export default defineComponent({
name: 'HGridInner',
props: gridProps,
emits: ['mounted'],
setup(props, { emit }) {
    const vg: Vanillagrid = hisonCloser.grid
    const editorWrap = ref<HTMLElement | null>(null)
    const gridInstance = ref<GridMethods | null>(null)

    const EXCLUDED_KEYS = ['columns', 'id'] as const
    const bindAttrs = computed(() => {
        if (!props.id) throw new Error(`[Hisonvue] id attribute is required.`)
        const attrs: Record<string, string> = {}
        attrs['data-id'] = props.id

        for (const [key, value] of Object.entries(props)) {
            if (EXCLUDED_KEYS.includes(key as any)) continue
            if (value === undefined || value === null) continue

            attrs[key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())] = String(value)
        }

        if (attrs.color) {
            attrs.color = getHexCodeFromColorText(attrs.color) ?? attrs.color
        }
        return attrs
    })

    onMounted(() => {
        console.log('grid onMounted')
        vg.init()
        if (!editorWrap.value) return

        const gridElement = editorWrap.value.querySelector('[data-vanillagrid]') as HTMLElement
        if (!gridElement) return

        props.columns!.forEach(col => {
            const colDiv = document.createElement('div')
            colDiv.setAttribute('data-col', '')
            for (const key in col) {
            if (col[key as keyof HGridColumn] !== undefined && col[key as keyof HGridColumn] !== null) {
                colDiv.setAttribute(key, String(col[key as keyof HGridColumn]))
            }
            }
            gridElement.appendChild(colDiv)
        })

        vg.mountGrid(editorWrap.value)

        const color = getHexCodeFromColorText(props.color ?? 'primary') ?? props.color
        gridElement.style.border = 'none'
        gridElement.style.boxShadow = `0 0.5px 1px 0.5px ${color}`

        gridInstance.value = vg.getGrid(props.id!)
        emit('mounted', gridInstance.value)
    })

    onBeforeUnmount(() => {
        console.log('grid onBeforeUnmount')
        if (!editorWrap.value) return
        vg.unmountGrid(editorWrap.value)
    })

    return {
        editorWrap,
        bindAttrs
    }
}
})
</script>

<style scoped></style>
  
