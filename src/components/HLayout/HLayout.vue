<template>
    <div
        ref="layoutRef"
        :class="[
            'hison-layout',
            ...responsiveClassList,
            visibleClass,
            borderClass,
        ]"
        :style="[props.style, computedBackStyle]"
        @click="$emit('click', $event, layoutMethods)"
        @mousedown="$emit('mousedown', $event, layoutMethods)"
        @mouseup="$emit('mouseup', $event, layoutMethods)"
        @mouseover="$emit('mouseover', $event, layoutMethods)"
        @mouseout="$emit('mouseout', $event, layoutMethods)"
    >
        <div class="hison-layout-frame-adjust"></div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onBeforeUnmount, watch, nextTick, unref } from 'vue'
import type { HLayoutMethods } from '../../types'
import { layoutProps } from './props'
import { hisonCloser } from '../..'
import { addComponentNameToClass, extractResponsiveClasses, getHexCodeFromColorText, getIndexSpecificClassNameFromClassList, getUUID, registerReloadable, reloadHisonComponent, toClassString, unregisterReloadable } from '../../utils'
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
    const border = ref<boolean>(props.border ?? false)
    const borderClass = computed(() => (border.value ? 'hison-border' : ''))

    const computedBackStyle = computed(() => {
        const styles: Record<string, string> = {};

        if (props.backImageSrc) {
            styles.backgroundImage = `url(${props.backImageSrc})`;
            styles.backgroundRepeat = props.backImageRepeat || 'no-repeat';
            styles.backgroundSize = props.backImageWidth || 'auto';
            styles.backgroundPosition = `${props.backImageAlign || 'center'} ${props.backImageVerticalAlign || 'center'}`;
        }
        if (props.backColor) {
            const color = getHexCodeFromColorText(props.backColor) || props.backColor;
            styles.backgroundColor = color;
        }
        if (props.height) {
            styles.height = props.height;
        }

        return styles;
    });

    const responsiveClassList = ref<string[]>([])
    const refreshResponsiveClassList = () => {
        responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
        if (getIndexSpecificClassNameFromClassList(responsiveClassList.value, 'col') === -1) responsiveClassList.value.push('hison-col-12')
        addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
    }
    
    const mount = () => {
        if (hisonCloser.component.layoutList[id] && hisonCloser.component.layoutList[id].isHisonvueComponent) console.warn(`[Hisonvue] The layout ID is at risk of being duplicated. ${id}`)
        registerReloadable(reloadId, () => {
            unmount()
            nextTick(mount)
        })
        if (!layoutRef.value) return

        refreshResponsiveClassList()
        layoutMethods.value = {
            isHisonvueComponent: true,
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
            getBackImageRepeat: () => props.backImageRepeat || '',
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
            isBorder: () => border.value,
            setBorder: (val: boolean) => { border.value = val },
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
        refreshResponsiveClassList()
        emit('responsive-change', newDevice)
    })
    
    watch(() => props.visible, v => { const nv = !!v; if (nv !== visible.value) visible.value = nv })
    watch(() => props.border, v => { const b = !!v; if (b !== border.value) border.value = b })
    watch(() => props.class, () => { refreshResponsiveClassList() })

    return {
        layoutRef,
        layoutMethods: computed(() => unref(layoutMethods)),
        props,
        responsiveClassList,
        visibleClass,
        borderClass,
        computedBackStyle,
    }
}
})
</script>

<style scoped></style>