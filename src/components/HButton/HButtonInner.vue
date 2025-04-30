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
        @click="handleClick"
        @mousedown="handleMousedown"
        @mouseup="handleMouseup"
        @mouseover="handleMouseover"
        @mouseout="handleMouseout"
    >
        <slot>Hison Button</slot>
    </button>
</template>

<script lang="ts">
import { defineComponent, inject, computed, ref, onMounted, onBeforeUnmount } from 'vue'
import type { HButton, HisonConfig } from '../../types'
import { Size } from "../../enums"
import { addButtonCssEvent, removeButtonCssEvent } from '../common/setButtonEvent'
import { buttonProps } from './props'
import { hisonCloser } from '../../core'

export default defineComponent({
name: 'HButtonInner',
props: buttonProps,
inheritAttrs: false,
emits: ['mounted', 'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout'],
setup(props, { emit, attrs }) {
    const config = inject<HisonConfig>('hisonvue-config')!
    const buttonRef = ref<HTMLButtonElement | null>(null)

    if (!props.id) throw new Error(`[Hisonvue] button id attribute is required.`)

    const sizeClass = computed(() => `hison-${props.size || config.componentStyle.size}-button`)
    const colorClass = computed(() => `hison-${props.color || 'primary'}-button`)
    const visibleClass = computed(() => props.visible === 'false' ? 'hison-display-none' : '')
    const positionClass = computed(() => {
        if (props.position === 'left') return 'hison-position-left'
        if (props.position === 'right') return 'hison-position-right'
        return ''
    })
    const disableClass = computed(() => props.disable === 'true' ? 'hison-disable' : '')

    const handleClick = (e: MouseEvent) => {
        if (props.disable === 'true') return
        emit('click', e)
    }
    const handleMousedown = (e: MouseEvent) => {
        if (props.disable === 'true') return
        emit('mousedown', e)
    }
    const handleMouseup = (e: MouseEvent) => {
        if (props.disable === 'true') return
        emit('mouseup', e)
    }
    const handleMouseover = (e: MouseEvent) => {
        if (props.disable === 'true') return
        emit('mouseover', e)
    }
    const handleMouseout = (e: MouseEvent) => {
        if (props.disable === 'true') return
        emit('mouseout', e)
    }

    const setMethods = (element: HButton) => {
        element.isDisable = () => element.disabled
        element.isVisible = () => window.getComputedStyle(element).display !== 'none'
        element.setDisable = (val: boolean) => {
            element.disabled = val
            element.classList.toggle('hison-disable', val)
        }
        element.setVisible = (val: boolean) => {
            element.classList.toggle('hison-display-none', !val)
        }
    }

    onMounted(() => {
        console.log('buttonRef onMounted')
        if (buttonRef.value) {
            setMethods(buttonRef.value as HButton)
            hisonCloser.component.buttonList[props.id!] = buttonRef.value as HButton
            buttonRef.value.dataset.color = props.color || 'primary'
            addButtonCssEvent(buttonRef.value)
            emit('mounted', buttonRef.value)
        }
    })

    onBeforeUnmount(() => {
        console.log('buttonRef onBeforeUnmount')
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
        handleClick,
        handleMousedown,
        handleMouseup,
        handleMouseover,
        handleMouseout
    }
}
})
</script>

<style scoped></style>
