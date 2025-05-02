<template>
  <component
    :is="HButtonInner"
    v-bind="props"
    :key="reloadKey"
    @mounted="$emit('mounted', $event)"
    @click="$emit('click', $event)"
    @mousedown="$emit('mousedown', $event)"
    @mouseup="$emit('mouseup', $event)"
    @mouseover="$emit('mouseover', $event)"
    @mouseout="$emit('mouseout', $event)"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeUnmount } from 'vue'
import HButtonInner from './HButtonInner.vue'
import { buttonProps } from './props'
import { registerReloadable, unregisterReloadable } from '../../utils'

export default defineComponent({
  name: 'HButton',
  props: buttonProps,
  emits: ['mounted', 'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout'],
  setup(props) {
    const reloadKey = ref(0)
    const reloadId = `hbutton:${props.id}`

    registerReloadable(reloadId, () => {
      reloadKey.value++
    })

    onBeforeUnmount(() => {
      unregisterReloadable(reloadId)
    })

    return {
      reloadKey,
      props,
      HButtonInner
    }
  }
})
</script>
