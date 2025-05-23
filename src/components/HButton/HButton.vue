<template>
    <button
        ref="buttonRef"
        :class="[
            'hison-button',
            ...responsiveClassList,
            visibleClass,
            disableClass
        ]"
        :style="props.style"
        :title="props.title || undefined"
        :disabled="props.disable === 'true'"
        @click="$emit('click', $event)"
        @mousedown="$emit('mousedown', $event)"
        @mouseup="$emit('mouseup', $event)"
        @mouseover="$emit('mouseover', $event)"
        @mouseout="$emit('mouseout', $event)"
    >
        <slot>Hison Button</slot>
    </button>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import type { HButtonMethods } from '../../types'
import { addButtonCssEvent, removeButtonCssEvent } from '../common/setButtonEvent'
import { buttonProps } from './props'
import { hisonCloser } from '../..'
import { addComponentNameToClass, extractResponsiveClasses, getUUID, registerReloadable } from '../../utils'
import { useDevice } from '../../core'

export default defineComponent({
name: 'HButton',
props: buttonProps,
inheritAttrs: false,
emits: ['mounted', 'responsive-change', 'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout'],
setup(props, { emit }) {
    const buttonRef = ref<HTMLButtonElement | null>(null)
    const id = props.id ? props.id : getUUID()
    const reloadId = `hbutton:${props.id}`
    const device = useDevice()

    const visible = ref(props.visible !== 'false')  //'false'가 아닌 경우 모두 true
    const disable = ref(props.disable === 'true')   //'true'가 아닌 경우 모두 false
    const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')
    const disableClass = computed(() => disable.value ? 'hison-disable' : '')

    const responsiveClassList = ref<string[]>([])
    const refleshResponsiveClassList = () => {
        responsiveClassList.value = extractResponsiveClasses(props.class || '', device.value)
        addComponentNameToClass(responsiveClassList.value, 'size', 'button', hisonCloser.componentStyle.size)
        addComponentNameToClass(responsiveClassList.value, 'color', 'button', 'primary')
    }

    const mount = () => {
        if (buttonRef.value) {
            if(hisonCloser.component.buttonList[id]) throw new Error(`[Hisonvue] button id attribute was duplicated.`)
            refleshResponsiveClassList()
            addButtonCssEvent(buttonRef.value)
            //add methods
            const buttonMethods: HButtonMethods = {
                getId : () => { return id },
                isDisable : () => buttonRef.value!.disabled,
                isVisible : () => window.getComputedStyle(buttonRef.value!).display !== 'none',
                setDisable : (val: boolean) => {
                    disable.value = val
                    buttonRef.value!.disabled = val
                },
                setVisible : (val: boolean) => {
                    visible.value = val
                },
            }
            hisonCloser.component.buttonList[id] = buttonMethods
            emit('mounted', buttonMethods)
        }
    }
    const unmount = () => {
        if (buttonRef.value) {
            delete hisonCloser.component.buttonList[id]
            removeButtonCssEvent(buttonRef.value)
        }
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
        buttonRef,
        props,
        responsiveClassList,
        visibleClass,
        disableClass,
    }
}
})
</script>

<style scoped></style>
