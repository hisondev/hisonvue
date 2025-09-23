<template>
  <div 
    :class="[
      'hison-wrapper',
      ...responsiveClassList,
      visibleClass,
    ]"
  >
    <div
      :class="[
        'hison-accordion',
        isOpen ? 'hison-open' : '',
        !animate ? 'hison-no-anim' : ''
      ]"
      :style="[rootInlineStyle, props.style]"
    >
      <!-- Header -->
      <div
        ref="headerRef"
        class="hison-accordion-header"
        :style="[headerBoxStyle, props.headerStyle]"
        role="button"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :tabindex="tabIndex ?? undefined"
        @click="onToggleClick($event)"
        @keydown.enter.prevent="onToggleClick($event)"
        @keydown.space.prevent="onToggleClick($event)"
      >
        <div class="hison-accordion-title" :style="[titleInlineStyle]">
          <slot name="title">
            {{ title }}
          </slot>
        </div>

        <div class="hison-accordion-toggle">
          <slot name="toggle">
            <span class="hison-dropdown-caret">▾</span>
          </slot>
        </div>
      </div>

      <div
        ref="contentRef"
        class="hison-accordion-content"
        :style="props.contentStyle"
        role="region"
        :inert="!isOpen || undefined"
      >
        <div class="hison-accordion-panel">
          <div class="hison-accordion-panel-inner">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, onMounted, onBeforeUnmount, nextTick, watch
} from 'vue'
import { accordionProps } from './props'
import {
  getUUID,
  extractResponsiveClasses,
  registerReloadable, unregisterReloadable,
  reloadHisonComponent,
  toClassString,
  getIndexSpecificClassNameFromClassList,
  addComponentNameToClass
} from '../../utils'
import { useDevice } from '../../core'
import { TextAlign, hisonCloser } from '../..'
import type { HAccordionMethods } from '../../types'
import { addButtonCssEvent, removeButtonCssEvent } from '../common/setButtonCssEvent'

export default defineComponent({
  name: 'HAccordion',
  props: accordionProps,
  inheritAttrs: false,
  emits: ['mounted', 'responsive-change', 'open', 'close', 'toggle'],
  setup(props, { emit }) {
    const id = props.id || getUUID()
    const reloadId = `haccordion:${id}`

    const headerRef  = ref<HTMLElement | null>(null)
    const contentRef   = ref<HTMLElement | null>(null)
    const device = useDevice()

    const visible  = ref(!!props.visible)
    const title    = ref(props.title ?? '')
    const isOpen   = ref(!!props.defaultOpen)

    const textAlign = ref<TextAlign>((props.textAlign as TextAlign) ?? 'left')

    const animate  = ref(props.animate ?? true)
    const duration = ref(props.duration ?? 500)
    const easing   = ref(props.easing ?? 'ease')

    const tabIndex = ref<number | null>(
      props.tabIndex !== null && props.tabIndex !== '' ? Number(props.tabIndex) : null
    )

    const visibleClass = computed(() => (visible.value ? '' : 'hison-display-none'))

    const responsiveClassList = ref<string[]>([])
    const refreshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
      if (getIndexSpecificClassNameFromClassList(responsiveClassList.value, 'col') === -1) {
        responsiveClassList.value.push('hison-col-12')
      }
      addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
    }

    const rootInlineStyle = computed(() => ({
      '--hacc-duration': `${duration.value}ms`,
      '--hacc-easing': easing.value
    } as Record<string, string>))

    const headerBoxStyle = computed(() => ({}))
    const titleInlineStyle = computed(() => ({ textAlign: textAlign.value }))

    const open = (e?: Event | null) => {
      if (isOpen.value) return
      const prev = isOpen.value
      isOpen.value = true
      emit('open', e ?? null, accordionMethods.value)
    }

    const close = (e?: Event | null) => {
      if (!isOpen.value) return

      // 🔒 닫히는 순간, 내부에 포커스가 남아있다면 헤더로 이동
      const active = document.activeElement as HTMLElement | null
      const contentEl = contentRef.value
      if (contentEl && active && contentEl.contains(active)) {
        headerRef.value?.focus()       // 헤더로 초점 이동
      }

      isOpen.value = false
      emit('close', e ?? null, accordionMethods.value)
    }

    const toggle = (e?: Event | null) => (isOpen.value ? close(e) : open(e))

    const onToggleClick = (e: MouseEvent | KeyboardEvent) => {
      emit('toggle', e, accordionMethods.value)
      toggle(e)
    }

    const accordionMethods = ref<HAccordionMethods | null>(null)

    const mount = () => {
      if (hisonCloser.component.accordionList[id]) throw new Error('[Hisonvue] accordion id attribute was duplicated.')
      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })
      if(headerRef.value) addButtonCssEvent(headerRef.value)
      refreshResponsiveClassList()

      accordionMethods.value = {
        getId: () => id,
        getType: () => 'accordion',
        isVisible: () => visible.value,
        setVisible: (v: boolean) => { visible.value = !!v },
        isOpen: () => isOpen.value,
        open, close, toggle,
        getTitle: () => title.value,
        setTitle: (t: string) => { title.value = t ?? '' },

        getTextAlign: () => textAlign.value,
        setTextAlign: (v: TextAlign) => {
          if (v === 'left' || v === 'center' || v === 'right') textAlign.value = v
        },
        getAnimate: () => animate.value,
        setAnimate: (v: boolean) => { animate.value = !!v },

        getDuration: () => duration.value,
        setDuration: (ms: number) => {
          const n = Number(ms)
          if (Number.isFinite(n) && n >= 0) duration.value = n
        },
        getEasing: () => easing.value,
        setEasing: (fn: string) => { if (typeof fn === 'string') easing.value = fn },
        getTabIndex: () => tabIndex.value,
        setTabIndex: (v: number | null) => {
          tabIndex.value = v !== null && v !== undefined ? Number(v) : null
        },
        focus: () => { headerRef.value?.focus() },
        reload: () => reloadHisonComponent(reloadId)
      }

      hisonCloser.component.accordionList[id] = accordionMethods.value
      emit('mounted', accordionMethods.value)
    }

    const unmount = () => {
      unregisterReloadable(reloadId)
      if (headerRef.value) removeButtonCssEvent(headerRef.value)
      if (hisonCloser.component?.accordionList) {
        delete hisonCloser.component.accordionList[id]
      }
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(device, (newDevice) => {
      refreshResponsiveClassList()
      emit('responsive-change', newDevice)
    })

    return {
      headerRef, contentRef,
      props,
      visibleClass,
      responsiveClassList,
      isOpen, title,
      headerBoxStyle, titleInlineStyle,
      rootInlineStyle,
      animate,
      tabIndex,
      onToggleClick,
      open, close, toggle
    }
  }
})
</script>

<style scoped>
</style>
