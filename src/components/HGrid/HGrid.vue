<template>
    <div ref="editorWrap">
        <div data-vanillagrid v-bind="gridAttrs"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject, computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { Vanillagrid, GridMethods } from 'vanillagrid2'
import { gridProps } from './props'

export default defineComponent({
    name: 'HGrid',
    props: gridProps,
    emits: ['update:modelValue', 'mounted'],
    setup(props, { emit }) {
        const vg: Vanillagrid = inject('hisonvue-vg')!
        const editorWrap = ref<HTMLElement | null>(null)
        const gridInstance = ref<GridMethods | null>(null)

        const EXCLUDED_KEYS = ['modelValue', 'columns'] as const
        const gridAttrs = computed(() => {
            const attrs: Record<string, string> = {
            'data-id': props.dataId!,
            }

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
                if (col[key] !== undefined && col[key] !== null) {
                colDiv.setAttribute(key, String(col[key]))
                }
            }
            gridElement.appendChild(colDiv)
            })

            vg.mountGrid(editorWrap.value)
            gridInstance.value = vg.getGrid(props.dataId!)

            if (gridInstance.value && props.modelValue) {
            gridInstance.value.load(props.modelValue)
            }

            emit('mounted', gridInstance.value)
        })

        onBeforeUnmount(() => {
            if (!editorWrap.value) return
            vg.unmountGrid(editorWrap.value)
        })

        watch(() => props.modelValue, (newVal) => {
            if (gridInstance.value && newVal) {
            gridInstance.value.load(newVal)
            }
        })

        return {
            editorWrap,
            gridAttrs
        }
    }
})
</script>

<style scoped>
</style>
