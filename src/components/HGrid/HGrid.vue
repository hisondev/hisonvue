<template>
    <div ref="editorWrap">
        <div data-vanillagrid v-bind="bindAttrs"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, computed, onMounted, onBeforeUnmount, ref } from 'vue'
import type { Vanillagrid, GridMethods } from 'vanillagrid2'
import type { HGridColumn } from '../../types'
import { gridProps } from './props'

export default defineComponent({
    name: 'HGrid',
    props: gridProps,
    emits: ['mounted'],
    setup(props, { emit }) {
        const vg: Vanillagrid = inject('hisonvue-vg')!
        const editorWrap = ref<HTMLElement | null>(null)
        const gridInstance = ref<GridMethods | null>(null)

        const EXCLUDED_KEYS = ['columns'] as const
        const bindAttrs = computed(() => {
            if (!props.dataId) throw new Error(`[Hisonvue] data-id attribute is required.`)
            const attrs: Record<string, string> = {}

            for (const [key, value] of Object.entries(props)) {
                if (EXCLUDED_KEYS.includes(key as any)) continue
                if (value === undefined || value === null) continue

                attrs[key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())] = String(value)
            }
            return attrs
        })

        onMounted(() => {
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
            gridInstance.value = vg.getGrid(props.dataId!)
            emit('mounted', gridInstance.value)
        })

        onBeforeUnmount(() => {
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

<style scoped>
</style>
