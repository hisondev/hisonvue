<template>
    <div
        ref="layoutRef"
        :class="[
            'hison-layout',
            ...responsiveClassList,
            visibleClass,
        ]"
        :style="[props.style, computedBackStyle]"
        @click="$emit('click', $event)"
        @mousedown="$emit('mousedown', $event)"
        @mouseup="$emit('mouseup', $event)"
        @mouseover="$emit('mouseover', $event)"
        @mouseout="$emit('mouseout', $event)"
    >
        <slot>Hison Layout</slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import type { HLayoutMethods } from '../../types'
import { layoutProps } from './props'
import { hisonCloser } from '../..'
import { extractResponsiveClasses, getHexCodeFromColorText, getUUID, registerReloadable, unregisterReloadable } from '../../utils'
import { useDevice } from '../../core'

export default defineComponent({
name: 'HLayout',
props: layoutProps,
inheritAttrs: false,
emits: ['mounted', 'responsive-change', 'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout'],
setup(props, { emit }) {
    const layoutRef = ref<HTMLDivElement | null>(null)
    const id = props.id ? props.id : getUUID();
    const reloadId = `hlayout:${props.id}`
    const device = useDevice()

    const visible = ref(props.visible !== 'false')  //'false'가 아닌 경우 모두 true
    const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')

    const computedBackStyle = computed(() => {
        const styles: Record<string, string> = {};

        if (props.backImageSrc) {
            styles.backgroundImage = `url(${props.backImageSrc})`;
            styles.backgroundRepeat = props.backImageStyle || 'no-repeat';
            styles.backgroundSize = props.backImageWidth || 'auto';
            styles.backgroundPosition = `${props.backImageAlign || 'center'} ${props.backImageVerticalAlign || 'center'}`;
        }
        if (props.backColor) {
            const color = getHexCodeFromColorText(props.backColor) || props.backColor;
            styles.backgroundColor = color;
        }
        if (props.borderColor) {
            const color = getHexCodeFromColorText(props.borderColor) || props.borderColor;
            styles.borderColor = color;
            styles.borderStyle = 'solid';
        }
        if (props.borderWidth) {
            styles.borderWidth = props.borderWidth;
            styles.borderStyle = 'solid';
        }
        if (props.height) {
            styles.height = props.height;
        }

        return styles;
    });

    const responsiveClassList = ref<string[]>([])
    const refleshResponsiveClassList = () => {
        responsiveClassList.value = extractResponsiveClasses(props.class || '', device.value)
    }
    
    const mount = () => {
        if (layoutRef.value) {
            if(hisonCloser.component.layoutList[id]) throw new Error(`[Hisonvue] layout id attribute was duplicated.`)
            refleshResponsiveClassList()

            const layoutMethods: HLayoutMethods = {
                getId : () => { return id },
                isVisible : () => window.getComputedStyle(layoutRef.value!).display !== 'none',
                setVisible : (val: boolean) => {
                    visible.value = val
                },
                getBackImageSrc: () => props.backImageSrc || '',
                setBackImageSrc: (val: string) => {
                    if (layoutRef.value) layoutRef.value.style.backgroundImage = `url(${val})`;
                },
                getBackImageRepeat: () => props.backImageStyle || '',
                setBackImageRepeat: (val: string) => {
                    if (layoutRef.value) layoutRef.value.style.backgroundRepeat = val;
                },
                getBackImageWidth: () => props.backImageWidth || '',
                setBackImageWidth: (val: string) => {
                    if (layoutRef.value) layoutRef.value.style.backgroundSize = val;
                },
                getBackImageAlign: () => props.backImageAlign || '',
                setBackImageAlign: (val: string) => {
                    if (layoutRef.value) {
                    const currentY = props.backImageVerticalAlign || 'center';
                    layoutRef.value.style.backgroundPosition = `${val} ${currentY}`;
                    }
                },
                getBackImageVerticalAlign: () => props.backImageVerticalAlign || '',
                setBackImageVerticalAlign: (val: string) => {
                    if (layoutRef.value) {
                    const currentX = props.backImageAlign || 'center';
                    layoutRef.value.style.backgroundPosition = `${currentX} ${val}`;
                    }
                },
                getBackColor: () => props.backColor || '',
                setBackColor: (val: string) => {
                    if (layoutRef.value) {
                        layoutRef.value.style.backgroundColor = getHexCodeFromColorText(val) || val;
                    }
                },
                getBorderColor: () => props.borderColor || '',
                setBorderColor: (val: string) => {
                    if (layoutRef.value) {
                        layoutRef.value.style.borderColor = getHexCodeFromColorText(val) || val;
                        layoutRef.value.style.borderStyle = 'solid';
                    }
                },
                getBorderWidth: () => props.borderWidth || '',
                setBorderWidth: (val: string) => {
                    if (layoutRef.value) {
                        layoutRef.value.style.borderWidth = val;
                        layoutRef.value.style.borderStyle = 'solid';
                    }
                },
                getHeight: () => props.height || '',
                setHeight: (val: string) => {
                    if (layoutRef.value) {
                        layoutRef.value.style.height = val;
                    }
                },
            }
            hisonCloser.component.layoutList[id] = layoutMethods
            emit('mounted', layoutMethods)
        }
    }
    const unmount = () => {
        if (layoutRef.value) {
            delete hisonCloser.component.layoutList[id]
        }
        unregisterReloadable(reloadId)
    }
    registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
    })
    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(device, (newDevice) => {
        refleshResponsiveClassList()
        emit('responsive-change', newDevice)
    })

    return {
        layoutRef,
        props,
        responsiveClassList,
        visibleClass,
        computedBackStyle,
    }
}
})
</script>

<style scoped></style>
