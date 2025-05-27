<template>
  <input
    v-show="!editing"
    :class="[
      'hison-input',
      ...responsiveClassList,
      visibleClass,
    ]"
    type="text"
    :value="spanText"
    :style="props.style"
    :disabled="false"
    :title="title || undefined"
    @focus="onTextInputFocus"
    @mouseover="$emit('mouseover', $event, inputMethods)"
    @mouseout="$emit('mouseout', $event, inputMethods)"
  />
  <input
    v-show="editing"
    ref="inputRef"
    :class="[
      'hison-input',
      ...responsiveClassList,
      visibleClass,
    ]"
    :value="inputValue"
    :style="props.style"
    :disabled="false"
    :type="type"
    :title="title || undefined"
    @input="onInput"
    @click="$emit('input-click', $event, inputMethods)"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onBeforeUnmount, nextTick, watch, unref } from 'vue'
import type { HInputMethods } from '../../types'
import { inputProps } from './props'
import { hison, hisonCloser, InputEditMode, InputType } from '../..'
import { addComponentNameToClass, extractResponsiveClasses, getUUID, registerReloadable } from '../../utils'
import { useDevice } from '../../core'

export default defineComponent({
  name: 'HInput',
  props: inputProps,
  inheritAttrs: false,
  emits: [
    'update:modelValue',
    'mounted',
    'responsive-change',
    'input-click',
    'focus',
    'blur',
    'input',
    'change',
    'mouseover',
    'mouseout'
  ],
  setup(props, { emit }) {
    const inputRef = ref<HTMLInputElement | null>(null)
    const inputMethods = ref<HInputMethods | null>(null)
    const id = props.id ? props.id : getUUID()
    const reloadId = `hinput:${props.id}`
    const device = useDevice()

    const responsiveClassList = ref<string[]>([])
    const refleshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(props.class || '', device.value)
      addComponentNameToClass(responsiveClassList.value, 'size', 'input', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'input', 'primary')
    }

    const modelValue = ref(props.modelValue ?? '')
    const inputValue = computed(() => modelValue.value)
    const oldValue = ref(props.modelValue ?? '')
    const visible = ref(props.visible !== 'false')
    const title = ref(props.title ?? '')
    const type = ref(props.type ?? InputType.text)
    const format = ref(props.format ?? '')
    const editMode = ref(props.editMode ?? InputEditMode.editable)
    const editModeClass = computed(() => '')
    const fontBold = ref(props.fontBold ?? false)
    const fontItalic = ref(props.fontItalic ?? false)
    const fontThruline = ref(props.fontThruline ?? false)
    const fontUnderline = ref(props.fontUnderline ?? false)
    const maxLength = ref(props.maxLength ?? null)
    const maxByte = ref(props.maxByte ?? null)
    const required = ref(props.required ?? false)
    const placeholder = ref(props.placeholder ?? '')
    
    const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')
    const editing = ref(false)
    const computeSpanText = (value: any) => {
      let text = String(value)
      switch (type.value) {
        case InputType.text:
          break;
        case InputType.number:
          text = hison.utils.getNumberFormat(value, format.value ?? hison.getNumberFormat())
          break;
        case InputType.mask:
          break;
        case InputType.numchar:
          break;
        case InputType.email:
          break;
        case InputType.password:
          break;
        case InputType.date:
          break;
        case InputType.year:
          break;
        case InputType.month:
          break;
        case InputType.minute:
          break;
        default:
          break;
      }
      if (text === null || text === undefined) text = ''
      return text
    }
    const spanText = ref(computeSpanText(modelValue.value))
    const onTextInputFocus = (e: Event) => {
      if(editMode.value === InputEditMode.editable) editing.value = true
      nextTick(() => {
        inputRef.value?.focus()
      })
    }
    const onInput = (e: Event) => {
      modelValue.value = inputRef.value!.value
      emit('update:modelValue', modelValue.value)
    }
    const onFocus = (e: FocusEvent) => {
      oldValue.value = inputRef.value!.value
      console.log('onFocus modelValue', modelValue.value)
      emit('focus', e, inputMethods.value)
    }
    const onBlur = (e: Event) => {
      const newValue = modelValue.value
      console.log('onBlur newValue', newValue)
      if (newValue !== oldValue.value) {
        emit('change', oldValue.value, newValue, inputMethods.value)
        spanText.value = computeSpanText(newValue)
      }
      editing.value = false
      emit('blur', e, inputMethods.value)
      console.log('onBlur modelValue', modelValue.value)
    }

    const mount = () => {
      if (inputRef.value) {
        if (hisonCloser.component.inputList[id]) throw new Error(`[Hisonvue] input id attribute was duplicated.`)
        refleshResponsiveClassList()

        inputMethods.value = {
            getId: () => id,
            getText: () => { return spanText.value },
            getTitle: () => title.value,
            isVisible: () => window.getComputedStyle(inputRef.value!).display !== 'none',
            setTitle: (val: string) => { title.value = val },
            setVisible: (val: boolean) => { visible.value = val },
            getType: () => { return InputType.text },
            setType: (val: keyof typeof InputType) => { type.value = InputType[val] /** input text 새로고침 필요!!! */ },
            getFormat: () => {return format.value},
            setFormat: (val: string) => { format.value = val  /** input text 새로고침 필요!!! */ },
            getEditMode: () => {return InputEditMode.editable},
            setEditMode: () => {},
            isFontBold: () => {return true},
            setFontBold: () => {},
            isFontItalic: () => {return true},
            setFontItalic: () => {},
            isFontThruline: () => {return true},
            setFontThruline: () => {},
            isFontUnderline: () => {return true},
            setFontUnderline: () => {},
            getMaxLength: () => {return 0},
            setMaxLength: () => {},
            getMaxByte: () => {return 0},
            setMaxByte: () => {},
            getRequired: () => {return true},
            setRequired: () => {},
            getPlaceholder: () => {return ''},
            setPlaceholder: () => {},
            getValue: () => {return null},
            setValue: () => {},
        }

        hisonCloser.component.inputList[id] = inputMethods.value
        emit('mounted', inputMethods.value)
      }
    }

    const unmount = () => {
      if (inputRef.value) {
        delete hisonCloser.component.inputList[id]
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
        inputRef,
        inputMethods: computed(() => unref(inputMethods)),
        inputValue,
        props,
        responsiveClassList,
        visibleClass,
        type,
        title,
        spanText,
        editing,
        onInput,
        onTextInputFocus,
        onFocus,
        onBlur,
    }
  }
})
</script>

<style scoped></style>
