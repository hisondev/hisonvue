<template>
    <button
        ref="buttonRef"
        v-on="attrs"
        :class="[
            'hison-button',
            props.addClassList,
            sizeClass,
            colorClass,
            visibleClass,
            positionClass,
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
import { defineComponent, computed, ref, onMounted, onBeforeUnmount } from 'vue'
import type { HButtonMethods } from '../../types'
import { Size } from "../../enums"
import { addButtonCssEvent, removeButtonCssEvent } from '../common/setButtonEvent'
import { buttonProps } from './props'
import { hisonCloser } from '../..'

export default defineComponent({
name: 'HButtonInner',
props: buttonProps,
inheritAttrs: false,
emits: ['mounted', 'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout'],
setup(props, { emit, attrs }) {
    const buttonRef = ref<HTMLButtonElement | null>(null)

    if (!props.id) throw new Error(`[Hisonvue] button id attribute is required.`)
    const sizeClass = computed(() => `hison-${props.size || hisonCloser.componentStyle.size}-button`)
    const colorClass = computed(() => `hison-${props.color || 'primary'}-button`)
    const visibleClass = computed(() => props.visible === 'false' ? 'hison-display-none' : '')
    const positionClass = computed(() => {
        if (props.position === 'left') return 'hison-position-left'
        if (props.position === 'right') return 'hison-position-right'
        return ''
    })
    const disableClass = computed(() => props.disable === 'true' ? 'hison-disable' : '')

    
    onMounted(() => {
        if (buttonRef.value) {
            buttonRef.value.dataset.color = props.color || 'primary'
            addButtonCssEvent(buttonRef.value)
            //add methods
            const buttonMethods: HButtonMethods = {
                isDisable : () => buttonRef.value!.disabled,
                isVisible : () => window.getComputedStyle(buttonRef.value!).display !== 'none',
                setDisable : (val: boolean) => {
                    buttonRef.value!.disabled = val
                    buttonRef.value!.classList.toggle('hison-disable', val)
                },
                setVisible : (val: boolean) => {
                    buttonRef.value!.classList.toggle('hison-display-none', !val)
                },
            }
            hisonCloser.component.buttonList[props.id!] = buttonMethods
            emit('mounted', buttonMethods)
        }
    })

    onBeforeUnmount(() => {
        if (buttonRef.value) {
            delete hisonCloser.component.buttonList[props.id!]
            removeButtonCssEvent(buttonRef.value)
        }
    })

    return {
        buttonRef,
        props,
        attrs,
        sizeClass,
        colorClass,
        visibleClass,
        positionClass,
        disableClass,
    }
}
})
</script>

<style scoped></style>
