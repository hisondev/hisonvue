<template>
    <div  ref="editorWrap">
        <div data-vanillagrid data-id="grid01" rownum-visible="false" status-visible="false" word-break="break-all" white-space="normal"
        v-bind="combinedAttrs">
            <div data-col id="col1" header="header;1" data-type="text" width="25%"></div>
            <div data-col id="col2" header=";2" data-type="text" width="25%"></div>
            <div data-col id="col3" header=";3" data-type="text" width="25%"></div>
            <div data-col id="col4" header=";4" data-type="text" width="25%"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { inject, computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { HisonVueConfig } from '..'
import { isValidHexColor } from '../utils/validators'
import { Vanillagrid } from 'vanillagrid2';

const props = defineProps<{
mainColor?: string
}>()

const config = inject<HisonVueConfig>('hisonvue-config', {});
const editorWrap = ref<HTMLElement | null>(null);
const vg: Vanillagrid = inject('hisonvue-vg')!;

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

onMounted(()=>{
  vg.init();
  if(!editorWrap.value) return;
  vg.mountGrid(editorWrap.value);
})

onBeforeUnmount(()=>{
  if(!editorWrap.value) return;
  vg.unmountGrid(editorWrap.value);
})
</script>

<style scoped>
</style>
  
