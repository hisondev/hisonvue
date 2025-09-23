<template>
  <div
    :class="[
      'hison-wrapper',
      ...responsiveClassList,
      visibleClass
    ]"
  >
    <button
      ref="buttonRef"
      :class="[
        'hison-button',
        disableClass,
        borderClass,
        backgroundTypeClass
      ]"
      :style="props.style"
      :disabled="disable"
      :title="title || undefined"
      :tabindex="tabIndex ?? undefined"
      @click.stop="onClick"
      @mousedown.stop="$emit('mousedown', $event, buttonMethods)"
      @mouseup.stop="$emit('mouseup', $event, buttonMethods)"
      @mouseover.stop="$emit('mouseover', $event, buttonMethods)"
      @mouseout.stop="$emit('mouseout', $event, buttonMethods)"
      :aria-label="computedAriaLabel"
    >
      <template v-if="$slots.icon">
        <slot name="icon" />
      </template>
      <template v-if="hasLabelSlot">
        <slot name="label" v-if="$slots.label" />
        <slot v-else />
      </template>
      <span v-else class="hison-button-text">{{ internalText }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, computed, ref, onMounted, onBeforeUnmount, nextTick, watch,
  useSlots, unref, Text, Comment, type VNode
} from 'vue'
import type { HButtonMethods } from '../../types'
import { addButtonCssEvent, removeButtonCssEvent } from '../common/setButtonCssEvent'
import { buttonProps } from './props'
import { BackgroundType, hisonCloser } from '../..'
import {
  extractResponsiveClasses, getUUID, addComponentNameToClass,
  registerReloadable, reloadHisonComponent, toClassString, unregisterReloadable
} from '../../utils'
import { useDevice } from '../../core'

export default defineComponent({
  name: 'HButton',
  props: buttonProps,
  inheritAttrs: false,
  emits: ['mounted', 'responsive-change', 'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout'],
  setup(props, { emit }) {
    const buttonRef = ref<HTMLButtonElement | null>(null)
    const buttonMethods = ref<HButtonMethods | null>(null)
    const id = props.id ? props.id : getUUID()
    const reloadId = `hbutton:${id}`
    const device = useDevice()
    const slots = useSlots()
    const isPending = ref(false)
    const clickInterval = ref(props.clickInterval || 0)
    const lastClickTime = ref(0)

    const visible = ref(props.visible)
    const disable = ref(props.disable)
    const title = ref(props.title || '')

    const visibleClass = computed(() => (visible.value ? '' : 'hison-display-none'))
    const disableClass = computed(() => (disable.value ? 'hison-disable' : ''))
    const border = ref<boolean>(props.border ?? false)
    const borderClass = computed(() => (border.value ? 'hison-border' : ''))
    const backgroundType = ref(props.backgroundType || BackgroundType.filled)
    const backgroundTypeClass = computed(() => {
      switch (backgroundType.value) {
        case BackgroundType.empty: return 'hison-bg-empty'
        case BackgroundType.transparent: return 'hison-bg-transparent'
        default: return 'hison-bg-filled'
      }
    })

    const internalText = ref(props.text || '')
    const absorbedDefaultAsText = ref(false)
    const tabIndex = ref<number | null>(
      props.tabIndex !== null && props.tabIndex !== '' ? Number(props.tabIndex) : null
    )

    const hasNonTrivial = (nodes?: VNode[]) => {
      if (!nodes || !nodes.length) return false
      return nodes.some(n => {
        if (n.type === Comment) return false
        if (n.type === Text) return !/^\s*$/.test(String(n.children ?? ''))
        return true
      })
    }

    const initialDefaultNodes = slots.default?.() ?? []
    const isTextOnlyDefaultInitial =
      initialDefaultNodes.length > 0 && initialDefaultNodes.every(n => n.type === Text)

    if (!slots.label && isTextOnlyDefaultInitial) {
      const merged = initialDefaultNodes
        .map(n => String((n as any).children ?? ''))
        .join('')
        .trim()
      internalText.value = merged
      absorbedDefaultAsText.value = true
    }

    const defaultNodes = computed(() => slots.default?.() ?? [])
    const hasDefaultSlotContent = computed(() => hasNonTrivial(defaultNodes.value))

    const hasLabelSlot = computed(() => {
      if (slots.label) return true
      if (absorbedDefaultAsText.value) return false
      return hasDefaultSlotContent.value
    })

    const computedAriaLabel = computed(() => {
      const hasIconOnly = !!slots.icon && !hasLabelSlot.value && !internalText.value
      if (hasIconOnly) return props.title || 'button'
      return undefined
    })

    const responsiveClassList = ref<string[]>([])
    const refreshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
      addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
    }

    const onClick = async (e: MouseEvent) => {
      const now = Date.now()
      if (isPending.value) return
      if (clickInterval.value > 0 && now - lastClickTime.value < clickInterval.value) return
      lastClickTime.value = now
      isPending.value = true
      try {
        const results = emit('click', e, buttonMethods.value!)
        const resultArray = Array.isArray(results) ? results : []
        await Promise.all(
          resultArray
            .filter(res => res && typeof (res as any).then === 'function')
            .map(res => res as Promise<any>)
        )
      } finally {
        isPending.value = false
      }
    }

    const mount = () => {
      if (hisonCloser.component.buttonList[id]) throw new Error(`[Hisonvue] button id attribute was duplicated.`)
      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })
      if (buttonRef.value) addButtonCssEvent(buttonRef.value)
      refreshResponsiveClassList()

      buttonMethods.value = {
        getId: () => id,
        getType : () => 'button',
        getText: () => (hasLabelSlot.value ? '' : internalText.value),
        getTitle: () => title.value,
        isVisible: () => visible.value,
        isDisable: () => disable.value,
        setText: (val: string) => { if (!hasLabelSlot.value) internalText.value = val },
        setTitle: (val: string) => { title.value = val },
        setVisible: (val: boolean) => { visible.value = val },
        setDisable: (val: boolean) => { disable.value = val },
        isBorder: () => border.value,
        setBorder: (val: boolean) => { border.value = val },
        getBackgroundType: () => backgroundType.value,
        setBackgroundType: (type: BackgroundType) => { backgroundType.value = type },
        unlock: () => { isPending.value = false },
        getClickInterval: () => clickInterval.value,
        setClickInterval: (ms: number) => {
          clickInterval.value = ms
          lastClickTime.value = 0
        },
        getTabIndex: () => tabIndex.value,
        setTabIndex: (v: number | null) => {
          tabIndex.value = v !== null && v !== undefined ? Number(v) : null
        },
        focus: () => { buttonRef.value?.focus() },
        reload: () => reloadHisonComponent(reloadId),
      }

      hisonCloser.component.buttonList[id] = buttonMethods.value
      emit('mounted', buttonMethods.value)
    }

    const unmount = () => {
      unregisterReloadable(reloadId)
      delete hisonCloser.component.buttonList[id]
      if (buttonRef.value) removeButtonCssEvent(buttonRef.value)
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(device, () => {
      refreshResponsiveClassList()
      emit('responsive-change', device.value)
    })

    return {
      buttonRef,
      buttonMethods: computed(() => unref(buttonMethods)),
      props,
      visibleClass,
      disable,
      disableClass,
      borderClass,
      backgroundTypeClass,
      title,
      responsiveClassList,
      hasLabelSlot,
      computedAriaLabel,
      internalText,
      tabIndex,
      onClick,
    }
  }
})
</script>

<style scoped></style>
