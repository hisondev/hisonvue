<template>
    <vanilla-grid id="grid01" rownum-visible="false" status-visible="false" word-break="break-all" white-space="normal"
    v-bind="combinedAttrs">
        <v-col id="col1" header="grid\nattributes" data-type="link" width="25%"></v-col>
        <v-col id="col2" header="column\nattributes" data-type="link" width="25%"></v-col>
        <v-col id="col3" header="events" data-type="link" width="25%"></v-col>
        <v-col id="col4" header="methods" data-type="link" width="25%"></v-col>
    </vanilla-grid>
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue'
import { HisonVueConfig } from '..'
import { isValidHexColor } from '../utils/validators'

const props = defineProps<{
mainColor?: string
}>()

const config = inject<HisonVueConfig>('hisonvue-config', {})
const vg = inject('hisonvue-vg')

if (!vg) {
    throw new Error('[HisonVue] Vanillagrid instance not found. Ensure <HProvider> is used.')
}

// mainColor 속성 처리
const mainColorAttr = computed(() => {
    const color = props.mainColor ?? config.primaryColor
    if (color && !isValidHexColor(color)) {
        throw new Error(`[HisonVue] Invalid mainColor: '${color}'. Must be a valid hex color (e.g., '#ffffff').`)
    }
    return color ? { 'color': color } : {}
})

// 모든 속성 병합
const combinedAttrs = computed(() => ({
...mainColorAttr.value,
}))
</script>

<style scoped>
</style>
  
