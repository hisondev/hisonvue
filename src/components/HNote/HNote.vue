<template>
  <component
  :is="HNoteInner"
  v-bind="props"
  v-on="$attrs"
  :key="reloadKey" />
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeUnmount } from 'vue'
import HNoteInner from './HNoteInner.vue'
import { noteProps } from './props'
import { registerReloadable, unregisterReloadable } from '../../utils'

export default defineComponent({
  name: 'HNote',
  props: noteProps,
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
      HNoteInner
    }
  }
})
</script>
