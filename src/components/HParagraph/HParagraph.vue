<template>
  <div
    :class="[
      'hison-wrapper',
      'hison-paragraph-wrapper',
      ...responsiveClassList,
      visibleClass
    ]"
  >
    <div
      v-if="copyEnabled && showCopyButton"
      class="hison-paragraph-copybtn"
    >
      <slot
        name="copy-button"
        :onClick="onCopyButtonClick"
        :text="copyButtonText"
      >
        <HButton
          :id="copyButtonId"
          :class="[...buttonClassList, 'hison-size-s']"
          :border="true"
          :text="copyButtonText"
          :background-type="backgroundType"
          @click="onCopyButtonClick"
          title="Copy content"
        >
          <template v-if="$slots['copy-icon']" #icon>
            <slot name="copy-icon" />
          </template>
          <template v-if="$slots['copy-label']">
            <slot name="copy-label" />
          </template>
        </HButton>
      </slot>
    </div>
    <p
      ref="paraRef"
      class="hison-paragraph"
      :class="[
        borderClass,
        backgroundTypeClass,
        fontBoldClass,
        fontItalicClass,
        fontThrulineClass,
        fontUnderlineClass,
        whiteSpaceClass,
        textAlignClass,
        verticalAlignClass,
        copyGuardClass
      ]"
      :style="props.style"
      :title="title || undefined"
      tabindex="0"
      @keydown="onKeydown"
      @copy="onCopyEvent"
      @cut="onCutEvent"
      @selectstart="onSelectStart"
    >
      <template v-if="hasElementSlot"><slot /></template>
      <template v-else>{{ internalText }}</template>
    </p>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, onMounted, onBeforeUnmount, nextTick,
  useSlots, unref, watch, Text, type VNode, type PropType
} from 'vue'
import type { HParagraphMethods } from '../../types'
import {
  extractResponsiveClasses,
  getUUID,
  addComponentNameToClass,
  registerReloadable,
  reloadHisonComponent,
  toClassString,
  unregisterReloadable,
  extractPrefixedClasses
} from '../../utils'
import {
  BackgroundType, hisonCloser, TextAlign, TextAlignValue, WhiteSpaceValue, VerticalAlignValue
} from '../..'
import { useDevice } from '../../core'
import { paragraphProps } from './props'

export default defineComponent({
  name: 'HParagraph',
  props: paragraphProps,
  inheritAttrs: false,
  emits: [
    'mounted',
    'responsive-change',
    'copy-click',
    'copied',
    'copy-error',
  ],
  setup(props, { emit }) {
    const paraRef = ref<HTMLElement | null>(null)
    const paragraphMethods = ref<HParagraphMethods | null>(null)
    const id = props.id ? props.id : getUUID()
    const copyButtonId = computed(() => `hison_paragraph_copy_button_${id}`)
    const reloadId = `hparagraph:${id}`
    const device = useDevice()
    const slots = useSlots()

    const visible = ref<boolean>(props.visible)
    const title = ref<string>(props.title || '')
    const internalText = ref<string>(props.text || '')

    const fontBold = ref<boolean>(props.fontBold)
    const fontItalic = ref<boolean>(props.fontItalic)
    const fontThruline = ref<boolean>(props.fontThruline)
    const fontUnderline = ref<boolean>(props.fontUnderline)

    const textAlign = ref<TextAlignValue>(props.textAlign ?? TextAlign.left)
    const verticalAlign = ref<VerticalAlignValue>(props.verticalAlign)

    const border = ref<boolean>(props.border)
    const backgroundType = ref(props.backgroundType)
    const whiteSpace = ref<WhiteSpaceValue | null>(props.whiteSpace)

    const copyEnabled = ref<boolean>(props.copyEnabled)
    const showCopyButton = ref<boolean>(props.showCopyButton)
    const copyButtonText = ref<string>(props.copyButtonText)

    const slotNodes = computed(() => (slots.default ? slots.default() : []))
    const isTextOnlySlot = computed(
      () => slotNodes.value.length > 0 && slotNodes.value.every(v => v.type === Text)
    )
    const hasElementSlot = computed(() => !!slots.default && !isTextOnlySlot.value)
    const hasAnySlot = computed(() => !!slots.default && slotNodes.value.length > 0)
    onMounted(() => {
      if (isTextOnlySlot.value) {
        const text = slotNodes.value.map(v => String(v.children ?? '')).join('')
        internalText.value = text
      }
    })

    const visibleClass = computed(() => (visible.value ? '' : 'hison-display-none'))
    const borderClass = computed(() => (border.value ? 'hison-border' : ''))
    const backgroundTypeClass = computed(() => {
      switch (backgroundType.value) {
        case BackgroundType.empty: return 'hison-bg-empty'
        case BackgroundType.transparent: return 'hison-bg-transparent'
        default: return 'hison-bg-filled'
      }
    })
    const fontBoldClass = computed(() => (fontBold.value ? 'hison-font-bold' : ''))
    const fontItalicClass = computed(() => (fontItalic.value ? 'hison-font-italic' : ''))
    const fontThrulineClass = computed(() => (fontThruline.value ? 'hison-font-thruline' : ''))
    const fontUnderlineClass = computed(() => (fontUnderline.value ? 'hison-font-underline' : ''))

    const copyGuardClass = computed(() => (!copyEnabled.value ? 'hison-no-select' : ''))

    const responsiveClassList = ref<string[]>([])
    const refreshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
      addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
    }
    const buttonClassList = computed(() => {
      const classList: string[] = []
      classList.push(...extractPrefixedClasses(toClassString(props.class) || '', 'color'))
      return classList
    })

    const effectiveWhiteSpace = computed<WhiteSpaceValue>(() => whiteSpace.value ?? 'pre-wrap')

    const whiteSpaceClass = computed(() => {
      switch (effectiveWhiteSpace.value) {
        case 'normal':       return 'hison-ws-normal'
        case 'pre':          return 'hison-ws-pre'
        case 'pre-wrap':     return 'hison-ws-pre-wrap'
        case 'pre-line':     return 'hison-ws-pre-line'
        case 'break-spaces': return 'hison-ws-break-spaces'
        default:             return ''
      }
    })

    const textAlignClass = computed(() => {
      switch (textAlign.value) {
        case 'center': return 'hison-ta-center'
        case 'right':  return 'hison-ta-right'
        default:       return 'hison-ta-left'
      }
    })

    const verticalAlignClass = computed(() => {
      switch (verticalAlign.value) {
        case 'middle': return 'hison-valign-middle'
        case 'bottom': return 'hison-valign-bottom'
        default:       return ''
      }
    })

    const getRenderedText = (): string => {
      const el = paraRef.value
      if (!el) return ''
      return (el as HTMLElement).innerText ?? ''
    }

    function hasNonEmptySelection(): boolean {
      const sel = typeof window !== 'undefined' ? window.getSelection() : null
      return !!sel && !sel.isCollapsed && sel.toString().length > 0
    }

    const doCopy = async () => {
      if (!copyEnabled.value) return false
      const text = getRenderedText()
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          await navigator.clipboard.writeText(text)
          return true
        }
      } catch {}
      try {
        const range = document.createRange()
        const el = paraRef.value as HTMLElement | null
        if (!el) throw new Error('no element')
        range.selectNodeContents(el)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
        const ok = document.execCommand('copy')
        sel?.removeAllRanges()
        return ok
      } catch {
        return false
      }
    }

    const handleCopyIntent = async (src: 'button' | 'keyboard' | 'native', ev?: Event) => {
      emit('copy-click', { src, event: ev, api: paragraphMethods.value! })
      try {
        const ok = await doCopy()
        emit('copied', ok, paragraphMethods.value!)
      } catch (err) {
        emit('copy-error', err, paragraphMethods.value!)
      }
    }

    const onCopyButtonClick = async (e: MouseEvent) => { await handleCopyIntent('button', e) }

    const onKeydown = async (e: KeyboardEvent) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
      const isCopy = (isMac ? e.metaKey : e.ctrlKey) && (e.key === 'c' || e.key === 'C')
      const isCut  = (isMac ? e.metaKey : e.ctrlKey) && (e.key === 'x' || e.key === 'X')

      if (!copyEnabled.value && (isCopy || isCut)) {
        e.preventDefault(); e.stopPropagation()
        return
      }
      if (copyEnabled.value && isCopy) {
        if (hasNonEmptySelection()) return

        e.preventDefault(); e.stopPropagation()
        await handleCopyIntent('keyboard', e)
      }
    }

    const onCopyEvent = async (e: ClipboardEvent) => {
      if (!copyEnabled.value) { e.preventDefault(); return }
      if (hasNonEmptySelection()) return

      e.preventDefault()
      await handleCopyIntent('native', e)
    }
    const onCutEvent = (e: ClipboardEvent) => { if (!copyEnabled.value) e.preventDefault() }
    const onSelectStart = (e: Event) => { if (!copyEnabled.value) e.preventDefault() }

    const mount = () => {
      if (hisonCloser.component.paragraphList[id] && hisonCloser.component.paragraphList[id].isHisonvueComponent) console.warn(`[Hisonvue] The paragraph ID is at risk of being duplicated. ${id}`)
      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })
      refreshResponsiveClassList()

      paragraphMethods.value = {
        isHisonvueComponent: true,
        getId: () => id,
        getType: () => 'paragraph',
        isVisible: () => visible.value,
        setVisible: (v: boolean) => { visible.value = v },
        getTitle: () => title.value,
        setTitle: (v: string) => { title.value = v || '' },
        getText: () => (hasElementSlot.value ? '' : internalText.value),
        setText: (v: string) => { if (!hasElementSlot.value) internalText.value = v ?? '' },
        getTextAlign: () => textAlign.value,
        setTextAlign: (v: TextAlign | TextAlignValue) => {
          if (v === 'left' || v === 'center' || v === 'right') textAlign.value = v
        },
        getVerticalAlign: () => verticalAlign.value,
        setVerticalAlign: (v: 'top' | 'middle' | 'bottom') => { verticalAlign.value = v },
        isFontBold: () => fontBold.value,
        setFontBold: (b: boolean) => { fontBold.value = b },
        isFontItalic: () => fontItalic.value,
        setFontItalic: (i: boolean) => { fontItalic.value = i },
        isFontThruline: () => fontThruline.value,
        setFontThruline: (t: boolean) => { fontThruline.value = t },
        isFontUnderline: () => fontUnderline.value,
        setFontUnderline: (u: boolean) => { fontUnderline.value = u },
        isBorder: () => border.value,
        setBorder: (b: boolean) => { border.value = b },
        getBackgroundType: () => backgroundType.value,
        setBackgroundType: (t: BackgroundType) => { backgroundType.value = t },
        getWhiteSpace: () => whiteSpace.value,
        setWhiteSpace: (ws: any) => { whiteSpace.value = ws },
        getCopyButtonText: () => copyButtonText.value,
        setCopyButtonText: (buttonText: string) => { copyButtonText.value = buttonText },
        isCopyEnabled: () => copyEnabled.value,
        setCopyEnabled: (v: boolean) => { copyEnabled.value = v },
        isShowCopyButton: () => showCopyButton.value,
        setShowCopyButton: (v: boolean) => { showCopyButton.value = v },
        copy: async () => { return await doCopy() },
        reload: () => reloadHisonComponent(reloadId),
      }

      hisonCloser.component.paragraphList[id] = paragraphMethods.value
      emit('mounted', paragraphMethods.value)
    }

    const unmount = () => {
      unregisterReloadable(reloadId)
      delete hisonCloser.component.paragraphList[id]
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(device, (newDevice) => {
      refreshResponsiveClassList()
      emit('responsive-change', newDevice)
    })

    watch(() => props.visible, v => { const b = !!v; if (b !== visible.value) visible.value = b })
    watch(() => props.title, v => { const s = v ?? ''; if (s !== title.value) title.value = s })
    watch(() => props.text, v => { const s = v ?? ''; if (!hasElementSlot.value && s !== internalText.value) internalText.value = s })
    watch(() => props.fontBold, v => { const b = !!v; if (b !== fontBold.value) fontBold.value = b })
    watch(() => props.fontItalic, v => { const b = !!v; if (b !== fontItalic.value) fontItalic.value = b })
    watch(() => props.fontThruline, v => { const b = !!v; if (b !== fontThruline.value) fontThruline.value = b })
    watch(() => props.fontUnderline, v => { const b = !!v; if (b !== fontUnderline.value) fontUnderline.value = b })
    watch(() => props.textAlign, v => { if (v && v !== textAlign.value && (v === 'left' || v === 'center' || v === 'right')) textAlign.value = v as any })
    watch(() => props.verticalAlign, v => { if (v && v !== verticalAlign.value && (v === 'top' || v === 'middle' || v === 'bottom')) verticalAlign.value = v as any })
    watch(() => props.whiteSpace, v => { const n = (v ?? null) as any; if (n !== whiteSpace.value) whiteSpace.value = n })
    watch(() => props.border, v => { const b = !!v; if (b !== border.value) border.value = b })
    watch(() => props.backgroundType, v => { if (v && v !== backgroundType.value) backgroundType.value = v as any })
    watch(() => props.copyEnabled, v => { const b = !!v; if (b !== copyEnabled.value) copyEnabled.value = b })
    watch(() => props.showCopyButton, v => { const b = !!v; if (b !== showCopyButton.value) showCopyButton.value = b })
    watch(() => props.copyButtonText, v => { const s = v ?? 'copy'; if (s !== copyButtonText.value) copyButtonText.value = s })
    watch(() => props.class, () => { refreshResponsiveClassList() })

    return {
      paraRef,
      paragraphMethods: computed(() => unref(paragraphMethods)),
      props,
      id,
      copyButtonId,
      title,
      visibleClass,
      borderClass,
      backgroundType,
      backgroundTypeClass,
      fontBoldClass,
      fontItalicClass,
      fontThrulineClass,
      fontUnderlineClass,
      responsiveClassList,
      buttonClassList,
      internalText,
      copyButtonText,
      copyEnabled,
      showCopyButton,
      hasElementSlot,
      hasAnySlot,
      whiteSpaceClass,
      textAlignClass,
      verticalAlignClass,
      copyGuardClass,
      onKeydown,
      onCopyEvent,
      onCutEvent,
      onSelectStart,
      onCopyButtonClick,
    }
  }
})
</script>

<style scoped></style>