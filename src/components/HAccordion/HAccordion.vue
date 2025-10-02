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
import { TextAlign, TextAlignValue, hisonCloser } from '../..'
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

    const textAlign = ref<TextAlignValue>((props.textAlign as TextAlign) ?? 'left')

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

      const active = document.activeElement as HTMLElement | null
      const contentEl = contentRef.value
      if (contentEl && active && contentEl.contains(active)) {
        headerRef.value?.focus()
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
      if (hisonCloser.component.accordionList[id] && hisonCloser.component.accordionList[id].isHisonvueComponent) console.warn(`[Hisonvue] The accordion ID is at risk of being duplicated. ${id}`)
      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })
      if(headerRef.value) addButtonCssEvent(headerRef.value)
      refreshResponsiveClassList()

      accordionMethods.value = {
        isHisonvueComponent: true,
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

    watch(() => props.visible, v => { if (v !== visible.value) visible.value = !!v })
    watch(() => props.title, v => { const t = v ?? ''; if (t !== title.value) title.value = t })
    watch(() => props.defaultOpen, v => v ? open(null) : close(null))
    watch(() => props.textAlign, v => { if ((v === 'left' || v === 'center' || v === 'right') && v !== textAlign.value) textAlign.value = v as any })
    watch(() => props.animate, v => { const nv = !!v; if (nv !== animate.value) animate.value = nv })
    watch(() => props.duration, v => { const n = Number(v); if (Number.isFinite(n) && n >= 0 && n !== duration.value) duration.value = n })
    watch(() => props.easing, v => { if (typeof v === 'string' && v !== easing.value) easing.value = v })
    watch(() => props.tabIndex, v => { const nv = (v === null || v === '') ? null : Number(v); if (nv !== tabIndex.value) tabIndex.value = nv })
    watch(() => props.class, () => refreshResponsiveClassList())

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
