<template>
  <component
    :is="HNoteInner"
    v-bind="props"
    :key="reloadKey"
    @mounted="$emit('mounted', $event)"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeUnmount } from 'vue'
import HNoteInner from './HNoteInner.vue'
import { noteProps } from './props'
import { registerReloadable, unregisterReloadable } from '../../utils'

export default defineComponent({
  name: 'HNote',
  props: noteProps,
  emits: ['update:modelValue', 'mounted'],
  setup(props) {
    const reloadKey = ref(0)
    const reloadId = `hnote:${props.id}`

    registerReloadable(reloadId, () => {
      reloadKey.value++
    })

    onBeforeUnmount(() => {
      unregisterReloadable(reloadId)
    })

    return {
      reloadKey,
      props,
      HNoteInner,
    }
  }
})
</script>
