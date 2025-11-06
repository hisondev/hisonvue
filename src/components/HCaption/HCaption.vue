<template>
  <div
    :class="[
      'hison-wrapper',
      ...responsiveClassList,
      visibleClass
    ]"
  >
    <component
      :is="renderTag"
      ref="captionRef"
      :class="[
        'hison-caption',
        fontBoldClass,
        fontItalicClass,
        fontThrulineClass,
        fontUnderlineClass,
        borderClass,
        backgroundTypeClass
      ]"
      :style="[textAlignStyle, props.style]"
      :title="title || undefined"
      @click="onClick"
      @mousedown="$emit('mousedown', $event, captionMethods)"
      @mouseup="$emit('mouseup', $event, captionMethods)"
      @mouseover="$emit('mouseover', $event, captionMethods)"
      @mouseout="$emit('mouseout', $event, captionMethods)"
    >
      <template v-if="hasElementSlot">
        <slot />
      </template>
      <template v-else>
        {{ internalText }}
      </template>
    </component>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, onMounted, onBeforeUnmount, nextTick, useSlots, unref, watch, Text
} from 'vue'
import { captionProps } from './props'
import { BackgroundType, TextAlign, type TextAlignValue, type BackgroundTypeValue } from '../..'
import {
  extractResponsiveClasses,
  getUUID,
  addComponentNameToClass,
  registerReloadable,
  reloadHisonComponent,
  toClassString,
  unregisterReloadable,
} from '../../utils'
import { useDevice } from '../../core'
import type { HCaptionMethods } from '../../types'
import { hisonCloser } from '../../hisonCloser'

export default defineComponent({
    name: 'HCaption',
    props: captionProps,
    inheritAttrs: false,
    emits: ['mounted', 'responsive-change', 'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout'],
    setup(props, { emit }) {
      const captionRef = ref<HTMLElement | null>(null)
      const captionMethods = ref<HCaptionMethods | null>(null)
      const id = props.id ? props.id : getUUID()
      const reloadId = `hcaption:${id}`
      const device = useDevice()
      const slots = useSlots()

      const visible = ref<boolean>(props.visible)
      const title = ref<string>(props.title || '')
      const textAlign = ref<TextAlignValue>(props.textAlign ?? TextAlign.left)
      const textAlignStyle = computed(() => ({ textAlign: textAlign.value }))

      const level = ref<number>(props.level ?? 3)
      const renderTag = computed<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>(() => {
        const lv = Math.min(6, Math.max(1, Number(level.value || 3)))
        return `h${lv}` as any
      })

      const fontBold = ref<boolean>(props.fontBold)
      const fontItalic = ref<boolean>(props.fontItalic)
      const fontThruline = ref<boolean>(props.fontThruline)
      const fontUnderline = ref<boolean>(props.fontUnderline)
      const border = ref<boolean>(props.border ?? false)
      const backgroundType = ref<BackgroundType | BackgroundTypeValue>(props.backgroundType ?? BackgroundType.empty)

      const visibleClass = computed(() => (visible.value ? '' : 'hison-display-none'))
      const borderClass = computed(() => (border.value ? 'hison-border' : ''))
      const backgroundTypeClass = computed(() => {
        switch (backgroundType.value) {
          case BackgroundType.empty: return 'hison-bg-empty'
          case BackgroundType.transparent: return 'hison-bg-transparent'
          default: return 'hison-bg-filled'
        }
      })

      const fontBoldClass = computed(() => fontBold.value ? 'hison-font-bold-important' : null)
      const fontItalicClass = computed(() => fontItalic.value ? 'hison-font-italic' : null)
      const fontThrulineClass = computed(() => fontThruline.value ? 'hison-font-thruline' : null)
      const fontUnderlineClass = computed(() => fontUnderline.value ? 'hison-font-underline' : null)

      const slotNodes = computed(() => (slots.default ? slots.default() : []))
      const isTextOnlySlot = computed(() => slotNodes.value.length > 0 && slotNodes.value.every(v => v.type === Text))
      const hasElementSlot = computed(() => !!slots.default && !isTextOnlySlot.value)

      const internalText = ref<string>(props.text || '')
      onMounted(() => {
        if (isTextOnlySlot.value) {
            const text = slotNodes.value.map(v => String(v.children ?? '')).join('')
            internalText.value = text
        }
      })

      const responsiveClassList = ref<string[]>([])
      const refreshResponsiveClassList = () => {
        responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
        addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
        addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
      }

      const onClick = (e: MouseEvent) => {
        emit('click', e, captionMethods.value!)
      }

      const mount = () => {
        if (hisonCloser.component.captionList[id] && hisonCloser.component.captionList[id].isHisonvueComponent) console.warn(`[Hisonvue] The caption ID is at risk of being duplicated. ${id}`)
        registerReloadable(reloadId, () => {
            unmount()
            nextTick(mount)
        })
        refreshResponsiveClassList()

        captionMethods.value = {
          isHisonvueComponent: true,
          getId: () => id,
          getType: () => 'caption',
          isVisible: () => visible.value,
          setVisible: (v: boolean) => { visible.value = v },
          getTitle: () => title.value,
          setTitle: (v: string) => { title.value = v },
          getText: () => (hasElementSlot.value ? '' : internalText.value),
          setText: (v: string) => { if (!hasElementSlot.value) internalText.value = v },
          getLevel: () => level.value,
          setLevel: (lv: number) => {
          const n = Math.min(6, Math.max(1, Number(lv)))
            level.value = n
          },
          getTextAlign: () => textAlign.value,
          setTextAlign: (v: TextAlign | TextAlignValue) => {
            if (v === TextAlign.left || v === TextAlign.center || v === TextAlign.right) {
                textAlign.value = v
            }
          },
          isFontBold: () => fontBold.value,
          setFontBold: (v: boolean) => { fontBold.value = v },
          isFontItalic: () => fontItalic.value,
          setFontItalic: (v: boolean) => { fontItalic.value = v },
          isFontThruline: () => fontThruline.value,
          setFontThruline: (v: boolean) => { fontThruline.value = v },
          isFontUnderline: () => fontUnderline.value,
          setFontUnderline: (v: boolean) => { fontUnderline.value = v },
          isBorder: () => border.value,
          setBorder: (v: boolean) => { border.value = v },
          getBackgroundType: () => backgroundType.value as BackgroundTypeValue,
          setBackgroundType: (t: BackgroundType | BackgroundTypeValue) => { backgroundType.value = t },
          reload: () => reloadHisonComponent(reloadId),
        }

        hisonCloser.component.captionList[id] = captionMethods.value
        emit('mounted', captionMethods.value)
      }

      const unmount = () => {
        unregisterReloadable(reloadId)
        delete hisonCloser.component.captionList[id]
      }

      onMounted(mount)
      onBeforeUnmount(unmount)

      watch(device, () => {
        refreshResponsiveClassList()
        emit('responsive-change', device.value)
      })

      watch(() => props.visible, v => { if (v !== visible.value) visible.value = !!v })
      watch(() => props.title, v => { const t = v ?? ''; if (t !== title.value) title.value = t })
      watch(() => props.text, v => { if (!hasElementSlot.value) { const t = v ?? ''; if (t !== internalText.value) internalText.value = t } })
      watch(() => props.level, v => { const n = Math.min(6, Math.max(1, Number(v ?? 3))); if (n !== level.value) level.value = n })
      watch(() => props.textAlign, v => { if ((v === 'left' || v === 'center' || v === 'right') && v !== textAlign.value) textAlign.value = v as any })
      watch(() => props.fontBold, v => { const nv = !!v; if (nv !== fontBold.value) fontBold.value = nv })
      watch(() => props.fontItalic, v => { const nv = !!v; if (nv !== fontItalic.value) fontItalic.value = nv })
      watch(() => props.fontThruline, v => { const nv = !!v; if (nv !== fontThruline.value) fontThruline.value = nv })
      watch(() => props.fontUnderline, v => { const nv = !!v; if (nv !== fontUnderline.value) fontUnderline.value = nv })
      watch(() => props.border, v => { const nv = !!v; if (nv !== border.value) border.value = nv })
      watch(() => props.backgroundType, v => { if (v && v !== backgroundType.value) backgroundType.value = v as any })
      watch(() => props.class, () => refreshResponsiveClassList())

      return {
        captionRef,
        captionMethods: computed(() => unref(captionMethods)),
        props,
        visibleClass,
        fontBoldClass,
        fontItalicClass,
        fontThrulineClass,
        fontUnderlineClass,
        borderClass,
        backgroundTypeClass,
        textAlignStyle,
        renderTag,
        hasElementSlot,
        internalText,
        responsiveClassList,
        onClick,
        title,
      }
    }
})
</script>

<style scoped></style>
