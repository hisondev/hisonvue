<template>
  <div ref="editorWrap" :class="['hison-wrap', ...responsiveClassList, requiredClass]" :style="props.style">
    <div data-vanillanote v-bind="bindAttrs"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onBeforeUnmount, watch, nextTick, triggerRef } from 'vue'
import type { Vanillanote, VanillanoteElement, NoteData } from 'vanillanote2'
import { noteEventProps, noteProps } from './props'
import { Size } from '../../enums'
import { extractResponsiveClasses, getSpecificClassNameFromClassList, getHexCodeFromColorText, getUUID, registerReloadable, getIndexSpecificClassNameFromClassList } from '../../utils'
import { hison, hisonCloser } from '../..'
import { useDevice } from '../../core'
import { HNoteElement } from '../../types'

export default defineComponent({
  name: 'HNote',
  props: {
    ...noteProps,
    ...noteEventProps
  },
  emits: ['update:modelValue', 'mounted', 'responsive-change'],
  setup(props, { emit }) {
    const vn: Vanillanote = hisonCloser.note
    const editorWrap = ref<HTMLElement | null>(null)
    const noteInstance = ref<HNoteElement | null>(null)
    const id = props.id ? props.id : getUUID();
    const reloadId = `hnote:${props.id}`
    const reloadTrigger = ref(0)
    const required = ref(props.required === 'true')
    const requiredClass = computed(()=>{
      if(required.value) return 'hison-note-required'
    })
    const device = useDevice()

    const responsiveClassList = ref<string[]>([])
    const EXCLUDED_KEYS = ['modelValue', 'id', 'class', 'style'] as const
    const bindAttrs = computed(() => {
      reloadTrigger.value
      const classList = extractResponsiveClasses(props.class || '', device.value)
      const color = getSpecificClassNameFromClassList(classList, 'color')
      const size = getSpecificClassNameFromClassList(classList, 'size')
      if (getIndexSpecificClassNameFromClassList(classList, 'col') === -1) classList.push('hison-col-12')
      responsiveClassList.value = classList

      const attrs: Record<string, string> = {}
      attrs['data-id'] = id

      for (const [key, value] of Object.entries(props)) {
        if (EXCLUDED_KEYS.includes(key as any)) continue
        if (value === undefined || value === null) continue

        attrs[key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())] = String(value)
      }
      
      attrs['size-level-desktop'] = attrs['size-level-desktop'] && hison.utils.isNumber(attrs['size-level-desktop'])
        ? String(Math.min(Math.max(Number(attrs['size-level-desktop']), 1), 9))
        : getSizeLevel(3, size)
      attrs['size-level-mobile'] = attrs['size-level-mobile'] && hison.utils.isNumber(attrs['size-level-mobile'])
        ? String(Math.min(Math.max(Number(attrs['size-level-mobile']), 1), 9))
        : getSizeLevel(5, size)

      if (color && !attrs.color) attrs.color = color
      if (attrs.color) {
        attrs.color = getHexCodeFromColorText(attrs.color) ?? attrs.color
        attrs['main-color'] = attrs.color
        delete attrs.color
      }

      if (attrs['invert-color'] !== 'false' && hisonCloser.componentStyle.invertColor) {
        attrs['invert-color'] = 'true'
      }

      return attrs
    })

    const getSizeLevel = (sizeLevel: number, size: string | null) => {
      size = size ?? hisonCloser.componentStyle.size
      switch (size) {
        case Size.s: sizeLevel -= 2; break
        case Size.m: break
        case Size.l: sizeLevel += 2; break
        case Size.xl: sizeLevel += 3; break
      }
      return String(Math.min(Math.max(sizeLevel, 1), 9))
    }

    //v-model note data
    const mutationObserver = new MutationObserver((mutations) => {
      const el = mutations[0]?.target
      if (!el) return
      const note = getNoteElement(el as HTMLElement)
      if (!note) return
      syncNoteData()
    })
    const getNoteElement = (targetElement: HTMLElement): VanillanoteElement | null => {
      let target: any = targetElement
      while (!(target instanceof Element)) target = target.parentNode
      return target.closest?.('[data-vanillanote]') || null
    }
    const isNoteDataEqual = (a: NoteData, b: NoteData) => {
      if (!a || !b) return false
      if (a.html !== b.html || a.plainText !== b.plainText) return false
      if (JSON.stringify(a.links) !== JSON.stringify(b.links)) return false
      if (JSON.stringify(a.files) !== JSON.stringify(b.files)) return false
      if (JSON.stringify(a.images) !== JSON.stringify(b.images)) return false
      if (JSON.stringify(a.videos) !== JSON.stringify(b.videos)) return false
      const fileKeysA = Object.keys(a.fileObjects || {})
      const fileKeysB = Object.keys(b.fileObjects || {})
      if (fileKeysA.length !== fileKeysB.length || !fileKeysA.every(k => fileKeysB.includes(k))) return false
      const imageKeysA = Object.keys(a.imageObjects || {})
      const imageKeysB = Object.keys(b.imageObjects || {})
      if (imageKeysA.length !== imageKeysB.length || !imageKeysA.every(k => imageKeysB.includes(k))) return false
      return true
    }
    const syncNoteData = () => {
      if (noteInstance.value) {
        emit('update:modelValue', noteInstance.value.getNoteData())
      }
    }

    const mount = () => {
      vn.init()
      if (!editorWrap.value) return
      vn.mountNote(editorWrap.value)

      const noteElement: any = vn.getNote(id)
      noteElement.getId = () => { return id }
      noteInstance.value = noteElement as HNoteElement
      const note = noteInstance.value
      
      if (props.modelValue && note) {
        note.setNoteData(props.modelValue)
      }

      //methods
      if (note) {
        note.getId = () => id
        note.getType = () => 'note'
        note.getRequired = () => required.value
        note.setRequired = (val: boolean) => { required.value = val }
      }

      //v-model
      if (note) {
        const textarea = note._elements?.textarea
        mutationObserver.observe(textarea, { characterData: true, childList: true, subtree: true })
      }

      //이벤트 바인딩
      if (note) {
        note._cssEvents.target_onBeforeClick = hisonCloser.event.cssEvent.button_onBeforeClick
        note._cssEvents.target_onAfterClick = hisonCloser.event.cssEvent.button_onAfterClick
        note._cssEvents.target_onBeforeMouseover = hisonCloser.event.cssEvent.button_onBeforeMouseover
        note._cssEvents.target_onAfterMouseover = hisonCloser.event.cssEvent.button_onAfterMouseover
        note._cssEvents.target_onBeforeMouseout = hisonCloser.event.cssEvent.button_onBeforeMouseout
        note._cssEvents.target_onAfterMouseout = hisonCloser.event.cssEvent.button_onAfterMouseout
        note._cssEvents.target_onBeforeTouchstart = hisonCloser.event.cssEvent.button_onBeforeTouchstart
        note._cssEvents.target_onAfterTouchstart = hisonCloser.event.cssEvent.button_onAfterTouchstart
        note._cssEvents.target_onBeforeTouchend = hisonCloser.event.cssEvent.button_onBeforeTouchend
        note._cssEvents.target_onAfterTouchend = hisonCloser.event.cssEvent.button_onAfterTouchend

        if (typeof props.textareaBeforeClick === 'function') note._elementEvents.textarea_onBeforeClick = props.textareaBeforeClick
        if (typeof props.textareaAfterClick === 'function') note._elementEvents.textarea_onAfterClick = props.textareaAfterClick
        if (typeof props.textareaBeforeFocus === 'function') note._elementEvents.textarea_onBeforeFocus = props.textareaBeforeFocus
        if (typeof props.textareaAfterFocus === 'function') note._elementEvents.textarea_onAfterFocus = props.textareaAfterFocus
        if (typeof props.textareaBeforeBlur === 'function') note._elementEvents.textarea_onBeforeBlur = props.textareaBeforeBlur
        if (typeof props.textareaAfterBlur === 'function') note._elementEvents.textarea_onAfterBlur = props.textareaAfterBlur
        if (typeof props.paragraphStyleSelectBeforeClick === 'function') note._elementEvents.paragraphStyleSelect_onBeforeClick = props.paragraphStyleSelectBeforeClick
        if (typeof props.paragraphStyleSelectAfterClick === 'function') note._elementEvents.paragraphStyleSelect_onAfterClick = props.paragraphStyleSelectAfterClick
        if (typeof props.toolToggleBeforeClick === 'function') note._elementEvents.toolToggleButton_onBeforeClick = props.toolToggleBeforeClick
        if (typeof props.toolToggleAfterClick === 'function') note._elementEvents.toolToggleButton_onAfterClick = props.toolToggleAfterClick
        if (typeof props.styleNomalBeforeClick === 'function') note._elementEvents.styleNomal_onBeforeClick = props.styleNomalBeforeClick
        if (typeof props.styleNomalAfterClick === 'function') note._elementEvents.styleNomal_onAfterClick = props.styleNomalAfterClick
        if (typeof props.styleHeader1BeforeClick === 'function') note._elementEvents.styleHeader1_onBeforeClick = props.styleHeader1BeforeClick
        if (typeof props.styleHeader1AfterClick === 'function') note._elementEvents.styleHeader1_onAfterClick = props.styleHeader1AfterClick
        if (typeof props.styleHeader2BeforeClick === 'function') note._elementEvents.styleHeader2_onBeforeClick = props.styleHeader2BeforeClick
        if (typeof props.styleHeader2AfterClick === 'function') note._elementEvents.styleHeader2_onAfterClick = props.styleHeader2AfterClick
        if (typeof props.styleHeader3BeforeClick === 'function') note._elementEvents.styleHeader3_onBeforeClick = props.styleHeader3BeforeClick
        if (typeof props.styleHeader3AfterClick === 'function') note._elementEvents.styleHeader3_onAfterClick = props.styleHeader3AfterClick
        if (typeof props.styleHeader4BeforeClick === 'function') note._elementEvents.styleHeader4_onBeforeClick = props.styleHeader4BeforeClick
        if (typeof props.styleHeader4AfterClick === 'function') note._elementEvents.styleHeader4_onAfterClick = props.styleHeader4AfterClick
        if (typeof props.styleHeader5BeforeClick === 'function') note._elementEvents.styleHeader5_onBeforeClick = props.styleHeader5BeforeClick
        if (typeof props.styleHeader5AfterClick === 'function') note._elementEvents.styleHeader5_onAfterClick = props.styleHeader5AfterClick
        if (typeof props.styleHeader6BeforeClick === 'function') note._elementEvents.styleHeader6_onBeforeClick = props.styleHeader6BeforeClick
        if (typeof props.styleHeader6AfterClick === 'function') note._elementEvents.styleHeader6_onAfterClick = props.styleHeader6AfterClick
        if (typeof props.boldBeforeClick === 'function') note._elementEvents.boldButton_onBeforeClick = props.boldBeforeClick
        if (typeof props.boldAfterClick === 'function') note._elementEvents.boldButton_onAfterClick = props.boldAfterClick
        if (typeof props.underlineBeforeClick === 'function') note._elementEvents.underlineButton_onBeforeClick = props.underlineBeforeClick
        if (typeof props.underlineAfterClick === 'function') note._elementEvents.underlineButton_onAfterClick = props.underlineAfterClick
        if (typeof props.italicBeforeClick === 'function') note._elementEvents.italicButton_onBeforeClick = props.italicBeforeClick
        if (typeof props.italicAfterClick === 'function') note._elementEvents.italicButton_onAfterClick = props.italicAfterClick
        if (typeof props.ulBeforeClick === 'function') note._elementEvents.ulButton_onBeforeClick = props.ulBeforeClick
        if (typeof props.ulAfterClick === 'function') note._elementEvents.ulButton_onAfterClick = props.ulAfterClick
        if (typeof props.olBeforeClick === 'function') note._elementEvents.olButton_onBeforeClick = props.olBeforeClick
        if (typeof props.olAfterClick === 'function') note._elementEvents.olButton_onAfterClick = props.olAfterClick
        if (typeof props.textAlignSelectBeforeClick === 'function') note._elementEvents.textAlignSelect_onBeforeClick = props.textAlignSelectBeforeClick
        if (typeof props.textAlignSelectAfterClick === 'function') note._elementEvents.textAlignSelect_onAfterClick = props.textAlignSelectAfterClick
        if (typeof props.textAlignLeftBeforeClick === 'function') note._elementEvents.textAlignLeft_onBeforeClick = props.textAlignLeftBeforeClick
        if (typeof props.textAlignLeftAfterClick === 'function') note._elementEvents.textAlignLeft_onAfterClick = props.textAlignLeftAfterClick
        if (typeof props.textAlignCenterBeforeClick === 'function') note._elementEvents.textAlignCenter_onBeforeClick = props.textAlignCenterBeforeClick
        if (typeof props.textAlignCenterAfterClick === 'function') note._elementEvents.textAlignCenter_onAfterClick = props.textAlignCenterAfterClick
        if (typeof props.textAlignRightBeforeClick === 'function') note._elementEvents.textAlignRight_onBeforeClick = props.textAlignRightBeforeClick
        if (typeof props.textAlignRightAfterClick === 'function') note._elementEvents.textAlignRight_onAfterClick = props.textAlignRightAfterClick
        if (typeof props.attLinkBeforeClick === 'function') note._elementEvents.attLinkButton_onBeforeClick = props.attLinkBeforeClick
        if (typeof props.attLinkAfterClick === 'function') note._elementEvents.attLinkButton_onAfterClick = props.attLinkAfterClick
        if (typeof props.attFileBeforeClick === 'function') note._elementEvents.attFileButton_onBeforeClick = props.attFileBeforeClick
        if (typeof props.attFileAfterClick === 'function') note._elementEvents.attFileButton_onAfterClick = props.attFileAfterClick
        if (typeof props.attImageBeforeClick === 'function') note._elementEvents.attImageButton_onBeforeClick = props.attImageBeforeClick
        if (typeof props.attImageAfterClick === 'function') note._elementEvents.attImageButton_onAfterClick = props.attImageAfterClick
        if (typeof props.attVideoBeforeClick === 'function') note._elementEvents.attVideoButton_onBeforeClick = props.attVideoBeforeClick
        if (typeof props.attVideoAfterClick === 'function') note._elementEvents.attVideoButton_onAfterClick = props.attVideoAfterClick
        if (typeof props.fontSizeBoxBeforeClick === 'function') note._elementEvents.fontSizeInputBox_onBeforeClick = props.fontSizeBoxBeforeClick
        if (typeof props.fontSizeBoxAfterClick === 'function') note._elementEvents.fontSizeInputBox_onAfterClick = props.fontSizeBoxAfterClick
        if (typeof props.fontSizeBeforeClick === 'function') note._elementEvents.fontSizeInput_onBeforeClick = props.fontSizeBeforeClick
        if (typeof props.fontSizeAfterClick === 'function') note._elementEvents.fontSizeInput_onAfterClick = props.fontSizeAfterClick
        if (typeof props.fontSizeBeforeInput === 'function') note._elementEvents.fontSizeInput_onBeforeInput = props.fontSizeBeforeInput
        if (typeof props.fontSizeAfterInput === 'function') note._elementEvents.fontSizeInput_onAfterInput = props.fontSizeAfterInput
        if (typeof props.fontSizeBeforeBlur === 'function') note._elementEvents.fontSizeInput_onBeforeBlur = props.fontSizeBeforeBlur
        if (typeof props.fontSizeAfterBlur === 'function') note._elementEvents.fontSizeInput_onAfterBlur = props.fontSizeAfterBlur
        if (typeof props.letterSpacingBoxBeforeClick === 'function') note._elementEvents.letterSpacingInputBox_onBeforeClick = props.letterSpacingBoxBeforeClick
        if (typeof props.letterSpacingBoxAfterClick === 'function') note._elementEvents.letterSpacingInputBox_onAfterClick = props.letterSpacingBoxAfterClick
        if (typeof props.letterSpacingBeforeClick === 'function') note._elementEvents.letterSpacingInput_onBeforeClick = props.letterSpacingBeforeClick
        if (typeof props.letterSpacingAfterClick === 'function') note._elementEvents.letterSpacingInput_onAfterClick = props.letterSpacingAfterClick
        if (typeof props.letterSpacingBeforeInput === 'function') note._elementEvents.letterSpacingInput_onBeforeInput = props.letterSpacingBeforeInput
        if (typeof props.letterSpacingAfterInput === 'function') note._elementEvents.letterSpacingInput_onAfterInput = props.letterSpacingAfterInput
        if (typeof props.letterSpacingBeforeBlur === 'function') note._elementEvents.letterSpacingInput_onBeforeBlur = props.letterSpacingBeforeBlur
        if (typeof props.letterSpacingAfterBlur === 'function') note._elementEvents.letterSpacingInput_onAfterBlur = props.letterSpacingAfterBlur
        if (typeof props.lineHeightBoxBeforeClick === 'function') note._elementEvents.lineHeightInputBox_onBeforeClick = props.lineHeightBoxBeforeClick
        if (typeof props.lineHeightBoxAfterClick === 'function') note._elementEvents.lineHeightInputBox_onAfterClick = props.lineHeightBoxAfterClick
        if (typeof props.lineHeightBeforeClick === 'function') note._elementEvents.lineHeightInput_onBeforeClick = props.lineHeightBeforeClick
        if (typeof props.lineHeightAfterClick === 'function') note._elementEvents.lineHeightInput_onAfterClick = props.lineHeightAfterClick
        if (typeof props.lineHeightBeforeInput === 'function') note._elementEvents.lineHeightInput_onBeforeInput = props.lineHeightBeforeInput
        if (typeof props.lineHeightAfterInput === 'function') note._elementEvents.lineHeightInput_onAfterInput = props.lineHeightAfterInput
        if (typeof props.lineHeightBeforeBlur === 'function') note._elementEvents.lineHeightInput_onBeforeBlur = props.lineHeightBeforeBlur
        if (typeof props.lineHeightAfterBlur === 'function') note._elementEvents.lineHeightInput_onAfterBlur = props.lineHeightAfterBlur
        if (typeof props.fontFamilySelectBeforeClick === 'function') note._elementEvents.fontFamilySelect_onBeforeClick = props.fontFamilySelectBeforeClick
        if (typeof props.fontFamilySelectAfterClick === 'function') note._elementEvents.fontFamilySelect_onAfterClick = props.fontFamilySelectAfterClick
        if (typeof props.colorTextSelectBeforeClick === 'function') note._elementEvents.colorTextSelect_onBeforeClick = props.colorTextSelectBeforeClick
        if (typeof props.colorTextSelectAfterClick === 'function') note._elementEvents.colorTextSelect_onAfterClick = props.colorTextSelectAfterClick
        if (typeof props.colorTextSelectBoxBeforeClick === 'function') note._elementEvents.colorTextSelectBox_onBeforeClick = props.colorTextSelectBoxBeforeClick
        if (typeof props.colorTextSelectBoxAfterClick === 'function') note._elementEvents.colorTextSelectBox_onAfterClick = props.colorTextSelectBoxAfterClick
        if (typeof props.colorText0BeforeClick === 'function') note._elementEvents.colorText0_onBeforeClick = props.colorText0BeforeClick
        if (typeof props.colorText0AfterClick === 'function') note._elementEvents.colorText0_onAfterClick = props.colorText0AfterClick
        if (typeof props.colorText1BeforeClick === 'function') note._elementEvents.colorText1_onBeforeClick = props.colorText1BeforeClick
        if (typeof props.colorText1AfterClick === 'function') note._elementEvents.colorText1_onAfterClick = props.colorText1AfterClick
        if (typeof props.colorText2BeforeClick === 'function') note._elementEvents.colorText2_onBeforeClick = props.colorText2BeforeClick
        if (typeof props.colorText2AfterClick === 'function') note._elementEvents.colorText2_onAfterClick = props.colorText2AfterClick
        if (typeof props.colorText3BeforeClick === 'function') note._elementEvents.colorText3_onBeforeClick = props.colorText3BeforeClick
        if (typeof props.colorText3AfterClick === 'function') note._elementEvents.colorText3_onAfterClick = props.colorText3AfterClick
        if (typeof props.colorText4BeforeClick === 'function') note._elementEvents.colorText4_onBeforeClick = props.colorText4BeforeClick
        if (typeof props.colorText4AfterClick === 'function') note._elementEvents.colorText4_onAfterClick = props.colorText4AfterClick
        if (typeof props.colorText5BeforeClick === 'function') note._elementEvents.colorText5_onBeforeClick = props.colorText5BeforeClick
        if (typeof props.colorText5AfterClick === 'function') note._elementEvents.colorText5_onAfterClick = props.colorText5AfterClick
        if (typeof props.colorText6BeforeClick === 'function') note._elementEvents.colorText6_onBeforeClick = props.colorText6BeforeClick
        if (typeof props.colorText6AfterClick === 'function') note._elementEvents.colorText6_onAfterClick = props.colorText6AfterClick
        if (typeof props.colorText7BeforeClick === 'function') note._elementEvents.colorText7_onBeforeClick = props.colorText7BeforeClick
        if (typeof props.colorText7AfterClick === 'function') note._elementEvents.colorText7_onAfterClick = props.colorText7AfterClick
        if (typeof props.colorTextRBeforeClick === 'function') note._elementEvents.colorTextRInput_onBeforeClick = props.colorTextRBeforeClick
        if (typeof props.colorTextRAfterClick === 'function') note._elementEvents.colorTextRInput_onAfterClick = props.colorTextRAfterClick
        if (typeof props.colorTextRBeforeInput === 'function') note._elementEvents.colorTextRInput_onBeforeInput = props.colorTextRBeforeInput
        if (typeof props.colorTextRAfterInput === 'function') note._elementEvents.colorTextRInput_onAfterInput = props.colorTextRAfterInput
        if (typeof props.colorTextRBeforeBlur === 'function') note._elementEvents.colorTextRInput_onBeforeBlur = props.colorTextRBeforeBlur
        if (typeof props.colorTextRAfterBlur === 'function') note._elementEvents.colorTextRInput_onAfterBlur = props.colorTextRAfterBlur
        if (typeof props.colorTextGBeforeClick === 'function') note._elementEvents.colorTextGInput_onBeforeClick = props.colorTextGBeforeClick
        if (typeof props.colorTextGAfterClick === 'function') note._elementEvents.colorTextGInput_onAfterClick = props.colorTextGAfterClick
        if (typeof props.colorTextGBeforeInput === 'function') note._elementEvents.colorTextGInput_onBeforeInput = props.colorTextGBeforeInput
        if (typeof props.colorTextGAfterInput === 'function') note._elementEvents.colorTextGInput_onAfterInput = props.colorTextGAfterInput
        if (typeof props.colorTextGBeforeBlur === 'function') note._elementEvents.colorTextGInput_onBeforeBlur = props.colorTextGBeforeBlur
        if (typeof props.colorTextGAfterBlur === 'function') note._elementEvents.colorTextGInput_onAfterBlur = props.colorTextGAfterBlur
        if (typeof props.colorTextBBeforeClick === 'function') note._elementEvents.colorTextBInput_onBeforeClick = props.colorTextBBeforeClick
        if (typeof props.colorTextBAfterClick === 'function') note._elementEvents.colorTextBInput_onAfterClick = props.colorTextBAfterClick
        if (typeof props.colorTextBBeforeInput === 'function') note._elementEvents.colorTextBInput_onBeforeInput = props.colorTextBBeforeInput
        if (typeof props.colorTextBAfterInput === 'function') note._elementEvents.colorTextBInput_onAfterInput = props.colorTextBAfterInput
        if (typeof props.colorTextBBeforeBlur === 'function') note._elementEvents.colorTextBInput_onBeforeBlur = props.colorTextBBeforeBlur
        if (typeof props.colorTextBAfterBlur === 'function') note._elementEvents.colorTextBInput_onAfterBlur = props.colorTextBAfterBlur
        if (typeof props.colorTextOpacityBeforeClick === 'function') note._elementEvents.colorTextOpacityInput_onBeforeClick = props.colorTextOpacityBeforeClick
        if (typeof props.colorTextOpacityAfterClick === 'function') note._elementEvents.colorTextOpacityInput_onAfterClick = props.colorTextOpacityAfterClick
        if (typeof props.colorTextOpacityBeforeInput === 'function') note._elementEvents.colorTextOpacityInput_onBeforeInput = props.colorTextOpacityBeforeInput
        if (typeof props.colorTextOpacityAfterInput === 'function') note._elementEvents.colorTextOpacityInput_onAfterInput = props.colorTextOpacityAfterInput
        if (typeof props.colorTextOpacityBeforeBlur === 'function') note._elementEvents.colorTextOpacityInput_onBeforeBlur = props.colorTextOpacityBeforeBlur
        if (typeof props.colorTextOpacityAfterBlur === 'function') note._elementEvents.colorTextOpacityInput_onAfterBlur = props.colorTextOpacityAfterBlur
        if (typeof props.colorBackSelectBeforeClick === 'function') note._elementEvents.colorBackSelect_onBeforeClick = props.colorBackSelectBeforeClick
        if (typeof props.colorBackSelectAfterClick === 'function') note._elementEvents.colorBackSelect_onAfterClick = props.colorBackSelectAfterClick
        if (typeof props.colorBackSelectBoxBeforeClick === 'function') note._elementEvents.colorBackSelectBox_onBeforeClick = props.colorBackSelectBoxBeforeClick
        if (typeof props.colorBackSelectBoxAfterClick === 'function') note._elementEvents.colorBackSelectBox_onAfterClick = props.colorBackSelectBoxAfterClick
        if (typeof props.colorBack0BeforeClick === 'function') note._elementEvents.colorBack0_onBeforeClick = props.colorBack0BeforeClick
        if (typeof props.colorBack0AfterClick === 'function') note._elementEvents.colorBack0_onAfterClick = props.colorBack0AfterClick
        if (typeof props.colorBack1BeforeClick === 'function') note._elementEvents.colorBack1_onBeforeClick = props.colorBack1BeforeClick
        if (typeof props.colorBack1AfterClick === 'function') note._elementEvents.colorBack1_onAfterClick = props.colorBack1AfterClick
        if (typeof props.colorBack2BeforeClick === 'function') note._elementEvents.colorBack2_onBeforeClick = props.colorBack2BeforeClick
        if (typeof props.colorBack2AfterClick === 'function') note._elementEvents.colorBack2_onAfterClick = props.colorBack2AfterClick
        if (typeof props.colorBack3BeforeClick === 'function') note._elementEvents.colorBack3_onBeforeClick = props.colorBack3BeforeClick
        if (typeof props.colorBack3AfterClick === 'function') note._elementEvents.colorBack3_onAfterClick = props.colorBack3AfterClick
        if (typeof props.colorBack4BeforeClick === 'function') note._elementEvents.colorBack4_onBeforeClick = props.colorBack4BeforeClick
        if (typeof props.colorBack4AfterClick === 'function') note._elementEvents.colorBack4_onAfterClick = props.colorBack4AfterClick
        if (typeof props.colorBack5BeforeClick === 'function') note._elementEvents.colorBack5_onBeforeClick = props.colorBack5BeforeClick
        if (typeof props.colorBack5AfterClick === 'function') note._elementEvents.colorBack5_onAfterClick = props.colorBack5AfterClick
        if (typeof props.colorBack6BeforeClick === 'function') note._elementEvents.colorBack6_onBeforeClick = props.colorBack6BeforeClick
        if (typeof props.colorBack6AfterClick === 'function') note._elementEvents.colorBack6_onAfterClick = props.colorBack6AfterClick
        if (typeof props.colorBack7BeforeClick === 'function') note._elementEvents.colorBack7_onBeforeClick = props.colorBack7BeforeClick
        if (typeof props.colorBack7AfterClick === 'function') note._elementEvents.colorBack7_onAfterClick = props.colorBack7AfterClick
        if (typeof props.colorBackRBeforeClick === 'function') note._elementEvents.colorBackRInput_onBeforeClick = props.colorBackRBeforeClick
        if (typeof props.colorBackRAfterClick === 'function') note._elementEvents.colorBackRInput_onAfterClick = props.colorBackRAfterClick
        if (typeof props.colorBackRBeforeInput === 'function') note._elementEvents.colorBackRInput_onBeforeInput = props.colorBackRBeforeInput
        if (typeof props.colorBackRAfterInput === 'function') note._elementEvents.colorBackRInput_onAfterInput = props.colorBackRAfterInput
        if (typeof props.colorBackRBeforeBlur === 'function') note._elementEvents.colorBackRInput_onBeforeBlur = props.colorBackRBeforeBlur
        if (typeof props.colorBackRAfterBlur === 'function') note._elementEvents.colorBackRInput_onAfterBlur = props.colorBackRAfterBlur
        if (typeof props.colorBackGBeforeClick === 'function') note._elementEvents.colorBackGInput_onBeforeClick = props.colorBackGBeforeClick
        if (typeof props.colorBackGAfterClick === 'function') note._elementEvents.colorBackGInput_onAfterClick = props.colorBackGAfterClick
        if (typeof props.colorBackGBeforeInput === 'function') note._elementEvents.colorBackGInput_onBeforeInput = props.colorBackGBeforeInput
        if (typeof props.colorBackGAfterInput === 'function') note._elementEvents.colorBackGInput_onAfterInput = props.colorBackGAfterInput
        if (typeof props.colorBackGBeforeBlur === 'function') note._elementEvents.colorBackGInput_onBeforeBlur = props.colorBackGBeforeBlur
        if (typeof props.colorBackGAfterBlur === 'function') note._elementEvents.colorBackGInput_onAfterBlur = props.colorBackGAfterBlur
        if (typeof props.colorBackBBeforeClick === 'function') note._elementEvents.colorBackBInput_onBeforeClick = props.colorBackBBeforeClick
        if (typeof props.colorBackBAfterClick === 'function') note._elementEvents.colorBackBInput_onAfterClick = props.colorBackBAfterClick
        if (typeof props.colorBackBBeforeInput === 'function') note._elementEvents.colorBackBInput_onBeforeInput = props.colorBackBBeforeInput
        if (typeof props.colorBackBAfterInput === 'function') note._elementEvents.colorBackBInput_onAfterInput = props.colorBackBAfterInput
        if (typeof props.colorBackBBeforeBlur === 'function') note._elementEvents.colorBackBInput_onBeforeBlur = props.colorBackBBeforeBlur
        if (typeof props.colorBackBAfterBlur === 'function') note._elementEvents.colorBackBInput_onAfterBlur = props.colorBackBAfterBlur
        if (typeof props.colorBackOpacityBeforeClick === 'function') note._elementEvents.colorBackOpacityInput_onBeforeClick = props.colorBackOpacityBeforeClick
        if (typeof props.colorBackOpacityAfterClick === 'function') note._elementEvents.colorBackOpacityInput_onAfterClick = props.colorBackOpacityAfterClick
        if (typeof props.colorBackOpacityBeforeInput === 'function') note._elementEvents.colorBackOpacityInput_onBeforeInput = props.colorBackOpacityBeforeInput
        if (typeof props.colorBackOpacityAfterInput === 'function') note._elementEvents.colorBackOpacityInput_onAfterInput = props.colorBackOpacityAfterInput
        if (typeof props.colorBackOpacityBeforeBlur === 'function') note._elementEvents.colorBackOpacityInput_onBeforeBlur = props.colorBackOpacityBeforeBlur
        if (typeof props.colorBackOpacityAfterBlur === 'function') note._elementEvents.colorBackOpacityInput_onAfterBlur = props.colorBackOpacityAfterBlur
        if (typeof props.formatClearBeforeClick === 'function') note._elementEvents.formatClearButton_onBeforeClick = props.formatClearBeforeClick
        if (typeof props.formatClearAfterClick === 'function') note._elementEvents.formatClearButton_onAfterClick = props.formatClearAfterClick
        if (typeof props.undoBeforeClick === 'function') note._elementEvents.undoButton_onBeforeClick = props.undoBeforeClick
        if (typeof props.undoAfterClick === 'function') note._elementEvents.undoButton_onAfterClick = props.undoAfterClick
        if (typeof props.redoBeforeClick === 'function') note._elementEvents.redoButton_onBeforeClick = props.redoBeforeClick
        if (typeof props.redoAfterClick === 'function') note._elementEvents.redoButton_onAfterClick = props.redoAfterClick
        if (typeof props.helpBeforeClick === 'function') note._elementEvents.helpButton_onBeforeClick = props.helpBeforeClick
        if (typeof props.helpAfterClick === 'function') note._elementEvents.helpButton_onAfterClick = props.helpAfterClick
        if (typeof props.modalBackBeforeClick === 'function') note._elementEvents.modalBack_onBeforeClick = props.modalBackBeforeClick
        if (typeof props.modalBackAfterClick === 'function') note._elementEvents.modalBack_onAfterClick = props.modalBackAfterClick
        if (typeof props.attLinkModalBeforeClick === 'function') note._elementEvents.attLinkModal_onBeforeClick = props.attLinkModalBeforeClick
        if (typeof props.attLinkModalAfterClick === 'function') note._elementEvents.attLinkModal_onAfterClick = props.attLinkModalAfterClick
        if (typeof props.attLinkTextBeforeInput === 'function') note._elementEvents.attLinkText_onBeforeInput = props.attLinkTextBeforeInput
        if (typeof props.attLinkTextAfterInput === 'function') note._elementEvents.attLinkText_onAfterInput = props.attLinkTextAfterInput
        if (typeof props.attLinkTextBeforeBlur === 'function') note._elementEvents.attLinkText_onBeforeBlur = props.attLinkTextBeforeBlur
        if (typeof props.attLinkTextAfterBlur === 'function') note._elementEvents.attLinkText_onAfterBlur = props.attLinkTextAfterBlur
        if (typeof props.attLinkHrefBeforeInput === 'function') note._elementEvents.attLinkHref_onBeforeInput = props.attLinkHrefBeforeInput
        if (typeof props.attLinkHrefAfterInput === 'function') note._elementEvents.attLinkHref_onAfterInput = props.attLinkHrefAfterInput
        if (typeof props.attLinkHrefBeforeBlur === 'function') note._elementEvents.attLinkHref_onBeforeBlur = props.attLinkHrefBeforeBlur
        if (typeof props.attLinkHrefAfterBlur === 'function') note._elementEvents.attLinkHref_onAfterBlur = props.attLinkHrefAfterBlur
        if (typeof props.attLinkInsertBeforeClick === 'function') note._elementEvents.attLinkInsertButton_onBeforeClick = props.attLinkInsertBeforeClick
        if (typeof props.attLinkInsertAfterClick === 'function') note._elementEvents.attLinkInsertButton_onAfterClick = props.attLinkInsertAfterClick
        if (typeof props.attFileModalBeforeClick === 'function') note._elementEvents.attFileModal_onBeforeClick = props.attFileModalBeforeClick
        if (typeof props.attFileModalAfterClick === 'function') note._elementEvents.attFileModal_onAfterClick = props.attFileModalAfterClick
        if (typeof props.attFileUploadBeforeClick === 'function') note._elementEvents.attFileUploadButton_onBeforeClick = props.attFileUploadBeforeClick
        if (typeof props.attFileUploadAfterClick === 'function') note._elementEvents.attFileUploadButton_onAfterClick = props.attFileUploadAfterClick
        if (typeof props.attFileUploadDivBeforeDragover === 'function') note._elementEvents.attFileUploadDiv_onBeforeDragover = props.attFileUploadDivBeforeDragover
        if (typeof props.attFileUploadDivAfterDragover === 'function') note._elementEvents.attFileUploadDiv_onAfterDragover = props.attFileUploadDivAfterDragover
        if (typeof props.attFileUploadDivBeforeDrop === 'function') note._elementEvents.attFileUploadDiv_onBeforeDrop = props.attFileUploadDivBeforeDrop
        if (typeof props.attFileUploadDivAfterDrop === 'function') note._elementEvents.attFileUploadDiv_onAfterDrop = props.attFileUploadDivAfterDrop
        if (typeof props.attFileUploadDivBeforeClick === 'function') note._elementEvents.attFileUploadDiv_onBeforeClick = props.attFileUploadDivBeforeClick
        if (typeof props.attFileUploadDivAfterClick === 'function') note._elementEvents.attFileUploadDiv_onAfterClick = props.attFileUploadDivAfterClick
        if (typeof props.attFileUploadBeforeInput === 'function') note._elementEvents.attFileUpload_onBeforeInput = props.attFileUploadBeforeInput
        if (typeof props.attFileUploadAfterInput === 'function') note._elementEvents.attFileUpload_onAfterInput = props.attFileUploadAfterInput
        if (typeof props.attFileUploadBeforeBlur === 'function') note._elementEvents.attFileUpload_onBeforeBlur = props.attFileUploadBeforeBlur
        if (typeof props.attFileUploadAfterBlur === 'function') note._elementEvents.attFileUpload_onAfterBlur = props.attFileUploadAfterBlur
        if (typeof props.attFileInsertBeforeClick === 'function') note._elementEvents.attFileInsertButton_onBeforeClick = props.attFileInsertBeforeClick
        if (typeof props.attFileInsertAfterClick === 'function') note._elementEvents.attFileInsertButton_onAfterClick = props.attFileInsertAfterClick
        if (typeof props.attLinkTooltipEditBeforeClick === 'function') note._elementEvents.attLinkTooltipEditButton_onBeforeClick = props.attLinkTooltipEditBeforeClick
        if (typeof props.attLinkTooltipEditAfterClick === 'function') note._elementEvents.attLinkTooltipEditButton_onAfterClick = props.attLinkTooltipEditAfterClick
        if (typeof props.attLinkTooltipUnlinkBeforeClick === 'function') note._elementEvents.attLinkTooltipUnlinkButton_onBeforeClick = props.attLinkTooltipUnlinkBeforeClick
        if (typeof props.attLinkTooltipUnlinkAfterClick === 'function') note._elementEvents.attLinkTooltipUnlinkButton_onAfterClick = props.attLinkTooltipUnlinkAfterClick
        if (typeof props.attImageModalBeforeClick === 'function') note._elementEvents.attImageModal_onBeforeClick = props.attImageModalBeforeClick
        if (typeof props.attImageModalAfterClick === 'function') note._elementEvents.attImageModal_onAfterClick = props.attImageModalAfterClick
        if (typeof props.attImageUploadViewBeforeDragover === 'function') note._elementEvents.attImageUploadButtonAndView_onBeforeDragover = props.attImageUploadViewBeforeDragover
        if (typeof props.attImageUploadViewAfterDragover === 'function') note._elementEvents.attImageUploadButtonAndView_onAfterDragover = props.attImageUploadViewAfterDragover
        if (typeof props.attImageUploadViewBeforeDrop === 'function') note._elementEvents.attImageUploadButtonAndView_onBeforeDrop = props.attImageUploadViewBeforeDrop
        if (typeof props.attImageUploadViewAfterDrop === 'function') note._elementEvents.attImageUploadButtonAndView_onAfterDrop = props.attImageUploadViewAfterDrop
        if (typeof props.attImageUploadViewBeforeClick === 'function') note._elementEvents.attImageUploadButtonAndView_onBeforeClick = props.attImageUploadViewBeforeClick
        if (typeof props.attImageUploadViewAfterClick === 'function') note._elementEvents.attImageUploadButtonAndView_onAfterClick = props.attImageUploadViewAfterClick
        if (typeof props.attImageViewPreBeforeClick === 'function') note._elementEvents.attImageViewPreButton_onBeforeClick = props.attImageViewPreBeforeClick
        if (typeof props.attImageViewPreAfterClick === 'function') note._elementEvents.attImageViewPreButton_onAfterClick = props.attImageViewPreAfterClick
        if (typeof props.attImageViewNextBeforeClick === 'function') note._elementEvents.attImageViewNextButton_onBeforeClick = props.attImageViewNextBeforeClick
        if (typeof props.attImageViewNextAfterClick === 'function') note._elementEvents.attImageViewNextButton_onAfterClick = props.attImageViewNextAfterClick
        if (typeof props.attImageUploadBeforeInput === 'function') note._elementEvents.attImageUpload_onBeforeInput = props.attImageUploadBeforeInput
        if (typeof props.attImageUploadAfterInput === 'function') note._elementEvents.attImageUpload_onAfterInput = props.attImageUploadAfterInput
        if (typeof props.attImageUploadBeforeBlur === 'function') note._elementEvents.attImageUpload_onBeforeBlur = props.attImageUploadBeforeBlur
        if (typeof props.attImageUploadAfterBlur === 'function') note._elementEvents.attImageUpload_onAfterBlur = props.attImageUploadAfterBlur
        if (typeof props.attImageURLBeforeInput === 'function') note._elementEvents.attImageURL_onBeforeInput = props.attImageURLBeforeInput
        if (typeof props.attImageURLAfterInput === 'function') note._elementEvents.attImageURL_onAfterInput = props.attImageURLAfterInput
        if (typeof props.attImageURLBeforeBlur === 'function') note._elementEvents.attImageURL_onBeforeBlur = props.attImageURLBeforeBlur
        if (typeof props.attImageURLAfterBlur === 'function') note._elementEvents.attImageURL_onAfterBlur = props.attImageURLAfterBlur
        if (typeof props.attImageInsertBeforeClick === 'function') note._elementEvents.attImageInsertButton_onBeforeClick = props.attImageInsertBeforeClick
        if (typeof props.attImageInsertAfterClick === 'function') note._elementEvents.attImageInsertButton_onAfterClick = props.attImageInsertAfterClick
        if (typeof props.attVideoModalBeforeClick === 'function') note._elementEvents.attVideoModal_onBeforeClick = props.attVideoModalBeforeClick
        if (typeof props.attVideoModalAfterClick === 'function') note._elementEvents.attVideoModal_onAfterClick = props.attVideoModalAfterClick
        if (typeof props.attVideoEmbedIdBeforeInput === 'function') note._elementEvents.attVideoEmbedId_onBeforeInput = props.attVideoEmbedIdBeforeInput
        if (typeof props.attVideoEmbedIdAfterInput === 'function') note._elementEvents.attVideoEmbedId_onAfterInput = props.attVideoEmbedIdAfterInput
        if (typeof props.attVideoEmbedIdBeforeBlur === 'function') note._elementEvents.attVideoEmbedId_onBeforeBlur = props.attVideoEmbedIdBeforeBlur
        if (typeof props.attVideoEmbedIdAfterBlur === 'function') note._elementEvents.attVideoEmbedId_onAfterBlur = props.attVideoEmbedIdAfterBlur
        if (typeof props.attVideoWidthBeforeInput === 'function') note._elementEvents.attVideoWidth_onBeforeInput = props.attVideoWidthBeforeInput
        if (typeof props.attVideoWidthAfterInput === 'function') note._elementEvents.attVideoWidth_onAfterInput = props.attVideoWidthAfterInput
        if (typeof props.attVideoWidthBeforeBlur === 'function') note._elementEvents.attVideoWidth_onBeforeBlur = props.attVideoWidthBeforeBlur
        if (typeof props.attVideoWidthAfterBlur === 'function') note._elementEvents.attVideoWidth_onAfterBlur = props.attVideoWidthAfterBlur
        if (typeof props.attVideoHeightBeforeInput === 'function') note._elementEvents.attVideoHeight_onBeforeInput = props.attVideoHeightBeforeInput
        if (typeof props.attVideoHeightAfterInput === 'function') note._elementEvents.attVideoHeight_onAfterInput = props.attVideoHeightAfterInput
        if (typeof props.attVideoHeightBeforeBlur === 'function') note._elementEvents.attVideoHeight_onBeforeBlur = props.attVideoHeightBeforeBlur
        if (typeof props.attVideoHeightAfterBlur === 'function') note._elementEvents.attVideoHeight_onAfterBlur = props.attVideoHeightAfterBlur
        if (typeof props.attVideoInsertBeforeClick === 'function') note._elementEvents.attVideoInsertButton_onBeforeClick = props.attVideoInsertBeforeClick
        if (typeof props.attVideoInsertAfterClick === 'function') note._elementEvents.attVideoInsertButton_onAfterClick = props.attVideoInsertAfterClick
        if (typeof props.attImageAndVideoTooltipWidthBeforeInput === 'function') note._elementEvents.attImageAndVideoTooltipWidthInput_onBeforeInput = props.attImageAndVideoTooltipWidthBeforeInput
        if (typeof props.attImageAndVideoTooltipWidthAfterInput === 'function') note._elementEvents.attImageAndVideoTooltipWidthInput_onAfterInput = props.attImageAndVideoTooltipWidthAfterInput
        if (typeof props.attImageAndVideoTooltipWidthBeforeBlur === 'function') note._elementEvents.attImageAndVideoTooltipWidthInput_onBeforeBlur = props.attImageAndVideoTooltipWidthBeforeBlur
        if (typeof props.attImageAndVideoTooltipWidthAfterBlur === 'function') note._elementEvents.attImageAndVideoTooltipWidthInput_onAfterBlur = props.attImageAndVideoTooltipWidthAfterBlur
        if (typeof props.attImageAndVideoTooltipWidthBeforeKeyup === 'function') note._elementEvents.attImageAndVideoTooltipWidthInput_onBeforeKeyup = props.attImageAndVideoTooltipWidthBeforeKeyup
        if (typeof props.attImageAndVideoTooltipWidthAfterKeyup === 'function') note._elementEvents.attImageAndVideoTooltipWidthInput_onAfterKeyup = props.attImageAndVideoTooltipWidthAfterKeyup
        if (typeof props.attImageAndVideoTooltipFloatRadioNoneBeforeClick === 'function') note._elementEvents.attImageAndVideoTooltipFloatRadioNone_onBeforeClick = props.attImageAndVideoTooltipFloatRadioNoneBeforeClick
        if (typeof props.attImageAndVideoTooltipFloatRadioNoneAfterClick === 'function') note._elementEvents.attImageAndVideoTooltipFloatRadioNone_onAfterClick = props.attImageAndVideoTooltipFloatRadioNoneAfterClick
        if (typeof props.attImageAndVideoTooltipFloatRadioLeftBeforeClick === 'function') note._elementEvents.attImageAndVideoTooltipFloatRadioLeft_onBeforeClick = props.attImageAndVideoTooltipFloatRadioLeftBeforeClick
        if (typeof props.attImageAndVideoTooltipFloatRadioLeftAfterClick === 'function') note._elementEvents.attImageAndVideoTooltipFloatRadioLeft_onAfterClick = props.attImageAndVideoTooltipFloatRadioLeftAfterClick
        if (typeof props.attImageAndVideoTooltipFloatRadioRightBeforeClick === 'function') note._elementEvents.attImageAndVideoTooltipFloatRadioRight_onBeforeClick = props.attImageAndVideoTooltipFloatRadioRightBeforeClick
        if (typeof props.attImageAndVideoTooltipFloatRadioRightAfterClick === 'function') note._elementEvents.attImageAndVideoTooltipFloatRadioRight_onAfterClick = props.attImageAndVideoTooltipFloatRadioRightAfterClick
        if (typeof props.attImageAndVideoTooltipShapeRadioSquareBeforeClick === 'function') note._elementEvents.attImageAndVideoTooltipShapeRadioSquare_onBeforeClick = props.attImageAndVideoTooltipShapeRadioSquareBeforeClick
        if (typeof props.attImageAndVideoTooltipShapeRadioSquareAfterClick === 'function') note._elementEvents.attImageAndVideoTooltipShapeRadioSquare_onAfterClick = props.attImageAndVideoTooltipShapeRadioSquareAfterClick
        if (typeof props.attImageAndVideoTooltipShapeRadioRadiusBeforeClick === 'function') note._elementEvents.attImageAndVideoTooltipShapeRadioRadius_onBeforeClick = props.attImageAndVideoTooltipShapeRadioRadiusBeforeClick
        if (typeof props.attImageAndVideoTooltipShapeRadioRadiusAfterClick === 'function') note._elementEvents.attImageAndVideoTooltipShapeRadioRadius_onAfterClick = props.attImageAndVideoTooltipShapeRadioRadiusAfterClick
        if (typeof props.attImageAndVideoTooltipShapeRadioCircleBeforeClick === 'function') note._elementEvents.attImageAndVideoTooltipShapeRadioCircle_onBeforeClick = props.attImageAndVideoTooltipShapeRadioCircleBeforeClick
        if (typeof props.attImageAndVideoTooltipShapeRadioCircleAfterClick === 'function') note._elementEvents.attImageAndVideoTooltipShapeRadioCircle_onAfterClick = props.attImageAndVideoTooltipShapeRadioCircleAfterClick
        if (typeof props.helpModalBeforeClick === 'function') note._elementEvents.helpModal_onBeforeClick = props.helpModalBeforeClick
        if (typeof props.helpModalAfterClick === 'function') note._elementEvents.helpModal_onAfterClick = props.helpModalAfterClick
        if (typeof props.placeholderBeforeClick === 'function') note._elementEvents.placeholder_onBeforeClick = props.placeholderBeforeClick
        if (typeof props.placeholderAfterClick === 'function') note._elementEvents.placeholder_onAfterClick = props.placeholderAfterClick
      }

      emit('mounted', note)
    }
    const unmount = () => {
      if (!editorWrap.value) return
      vn.unmountNote(editorWrap.value)
      mutationObserver.disconnect()
    }
    const reload = () => {
        unmount()
        triggerRef(reloadTrigger)
        nextTick(mount)
    }
    registerReloadable(reloadId, reload)
    onMounted(mount)
    onBeforeUnmount(unmount)
    
    watch(device, (newDevice) => {
      reload()
      emit('responsive-change', newDevice)
    })

    watch(() => props.modelValue, (newVal) => {
      if (!noteInstance.value) return
      const current = noteInstance.value.getNoteData()
      if (!isNoteDataEqual(current, newVal!)) {
        noteInstance.value.setNoteData(newVal!)
      }
    })

    return {
      editorWrap,
      props,
      bindAttrs,
      responsiveClassList,
      requiredClass
    }
  }
})
</script>

<style scoped></style>
