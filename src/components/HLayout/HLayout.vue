<template>
    <div
        ref="layoutRef"
        :class="[
            'hison-layout',
            ...responsiveClassList,
            visibleClass,
        ]"
        :style="[props.style, computedBackStyle]"
        @click="$emit('click', $event, layoutMethods)"
        @mousedown="$emit('mousedown', $event, layoutMethods)"
        @mouseup="$emit('mouseup', $event, layoutMethods)"
        @mouseover="$emit('mouseover', $event, layoutMethods)"
        @mouseout="$emit('mouseout', $event, layoutMethods)"
    >
        <div class="hison-layout-frame-adjust"></div>
        <slot>Hison Layout</slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onBeforeUnmount, watch, nextTick, unref } from 'vue'
import type { HLayoutMethods } from '../../types'
import { layoutProps } from './props'
import { hisonCloser } from '../..'
import { extractResponsiveClasses, getHexCodeFromColorText, getIndexSpecificClassNameFromClassList, getUUID, registerReloadable, reloadHisonComponent, unregisterReloadable } from '../../utils'
import { useDevice } from '../../core'

export default defineComponent({
name: 'HLayout',
props: layoutProps,
inheritAttrs: false,
emits: ['mounted', 'responsive-change', 'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout'],
setup(props, { emit }) {
    const layoutRef = ref<HTMLDivElement | null>(null)
    const layoutMethods = ref<HLayoutMethods | null>(null)
    const id = props.id ? props.id : getUUID();
    const reloadId = `hlayout:${id}`
    const device = useDevice()

    const visible = ref(props.visible)
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
        if (getIndexSpecificClassNameFromClassList(responsiveClassList.value, 'col') === -1) responsiveClassList.value.push('hison-col-12')
    }
    
    const mount = () => {
        if(hisonCloser.component.layoutList[id]) throw new Error(`[Hisonvue] layout id attribute was duplicated.`)
        registerReloadable(reloadId, () => {
            unmount()
            nextTick(mount)
        })
        if (!layoutRef.value) return

        refleshResponsiveClassList()
        layoutMethods.value = {
            getId : () => { return id },
            getType : () => 'layout',
            isVisible : () => visible.value,
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
            reload: () => reloadHisonComponent(reloadId)
        }
        hisonCloser.component.layoutList[id] = layoutMethods.value
        emit('mounted', layoutMethods.value)
    }
    const unmount = () => {
        unregisterReloadable(reloadId)
        delete hisonCloser.component.layoutList[id]
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(device, (newDevice) => {
        refleshResponsiveClassList()
        emit('responsive-change', newDevice)
    })

    return {
        layoutRef,
        layoutMethods: computed(() => unref(layoutMethods)),
        props,
        responsiveClassList,
        visibleClass,
        computedBackStyle,
    }
}
})
</script>

<style scoped></style>
