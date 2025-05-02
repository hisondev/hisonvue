<template>
    <component
    :is="HGridInner"
    v-bind="props"
    @mounted="$emit('mounted', $event)"
    :key="reloadKey" />
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeUnmount } from 'vue'
import HGridInner from './HGridInner.vue'
import { gridProps } from './props'
import { registerReloadable, unregisterReloadable } from '../../utils'

export default defineComponent({
    name: 'HGrid',
    props: gridProps,
    emits: ['mounted'],
    setup(props) {
        const reloadKey = ref(0)
        const reloadId = `hgrid:${props.id}`

        registerReloadable(reloadId, () => {
            reloadKey.value++
        })

        onBeforeUnmount(() => {
            unregisterReloadable(reloadId)
        })

        return {
            reloadKey,
            props,
            HGridInner
        }
    }
})
</script>
