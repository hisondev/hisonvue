<template>
  <div
    :class="[
      'hison-wrapper',
      'hison-s-input-margin-adjustment',
      ...responsiveClassList,
      visibleClass,
    ]"
  >
    <div
    v-if="inputType === 'range'"
    :class="[
      'hison-input',
      'hison-input-range-div',
    ]"
    :style="[textAlignStyle, props.style]"
    >
      <input
        ref="inputRef"
        :id="`${id}`"
        :name="`${nameAttr}`"
        type="range"
        :class="[
          `hison-input-${inputType}`,
          ...editModeClassList,
          ...requiredClassList,
        ]"
        :value="inputValue"
        :disabled="disable"
        :readonly="readonly"
        :title="title || undefined"
        :tabindex="tabIndex ?? undefined"
        @change="onRangeChange"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"

        @click="$emit('click', $event, inputMethods)"
        @dblclick="$emit('dblclick', $event, inputMethods)"
        @mousedown="$emit('mousedown', $event, inputMethods)"
        @mouseup="$emit('mouseup', $event, inputMethods)"
        @mouseenter="$emit('mouseenter', $event, inputMethods)"
        @mouseleave="$emit('mouseleave', $event, inputMethods)"
        @mouseover="$emit('mouseover', $event, inputMethods)"
        @mouseout="$emit('mouseout', $event, inputMethods)"

        @pointerdown="$emit('pointerdown', $event, inputMethods)"
        @pointerup="$emit('pointerup', $event, inputMethods)"
        @pointermove="$emit('pointermove', $event, inputMethods)"
        @pointerenter="$emit('pointerenter', $event, inputMethods)"
        @pointerleave="$emit('pointerleave', $event, inputMethods)"

        @touchstart="$emit('touchstart', $event, inputMethods)"
        @touchend="$emit('touchend', $event, inputMethods)"
        @touchmove="$emit('touchmove', $event, inputMethods)"
        @touchcancel="$emit('touchcancel', $event, inputMethods)"

        @contextmenu="$emit('contextmenu', $event, inputMethods)"
      />
    </div>

    <div
    v-else-if="inputType === 'color'"
    :class="[
      'hison-input',
      'hison-input-color-div',
    ]"
    :style="[textAlignStyle, props.style]"
    >
      <input
        ref="inputRef"
        :id="`${id}`"
        :name="`${nameAttr}`"
        type="color"
        :class="[
          `hison-input-${inputType}`,
          ...editModeClassList,
          ...requiredClassList,
        ]"
        :value="inputValue"
        :disabled="disable"
        :readonly="readonly"
        :checked="inputValue === true"
        :title="title || undefined"
        :tabindex="tabIndex ?? undefined"
        @change="onColorChange"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"

        @click="$emit('click', $event, inputMethods)"
        @dblclick="$emit('dblclick', $event, inputMethods)"
        @mousedown="$emit('mousedown', $event, inputMethods)"
        @mouseup="$emit('mouseup', $event, inputMethods)"
        @mouseenter="$emit('mouseenter', $event, inputMethods)"
        @mouseleave="$emit('mouseleave', $event, inputMethods)"
        @mouseover="$emit('mouseover', $event, inputMethods)"
        @mouseout="$emit('mouseout', $event, inputMethods)"

        @pointerdown="$emit('pointerdown', $event, inputMethods)"
        @pointerup="$emit('pointerup', $event, inputMethods)"
        @pointermove="$emit('pointermove', $event, inputMethods)"
        @pointerenter="$emit('pointerenter', $event, inputMethods)"
        @pointerleave="$emit('pointerleave', $event, inputMethods)"

        @touchstart="$emit('touchstart', $event, inputMethods)"
        @touchend="$emit('touchend', $event, inputMethods)"
        @touchmove="$emit('touchmove', $event, inputMethods)"
        @touchcancel="$emit('touchcancel', $event, inputMethods)"

        @contextmenu="$emit('contextmenu', $event, inputMethods)"
      />
    </div>

    <div
      v-else-if="inputType === 'checkbox'"
      :class="[
        'hison-input',
        'hison-input-checkbox-div',
      ]"
      :style="[textAlignStyle, props.style]"
    >
      <!-- default -->
      <template v-if="toggleStyle !== 'switch'">
        <input
          ref="inputRef"
          :id="`${id}`"
          :name="`${nameAttr}`"
          type="checkbox"
          :class="[
            `hison-input-${inputType}`,
            ...editModeClassList,
            ...requiredClassList,
          ]"
          :disabled="disable"
          :readonly="readonly"
          :checked="inputValue === true"
          :title="title || undefined"
          :tabindex="tabIndex ?? undefined"
          @change="onCheckboxChange"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onKeydown"

          @click="$emit('click', $event, inputMethods)"
          @dblclick="$emit('dblclick', $event, inputMethods)"
          @mousedown="$emit('mousedown', $event, inputMethods)"
          @mouseup="$emit('mouseup', $event, inputMethods)"
          @mouseenter="$emit('mouseenter', $event, inputMethods)"
          @mouseleave="$emit('mouseleave', $event, inputMethods)"
          @mouseover="$emit('mouseover', $event, inputMethods)"
          @mouseout="$emit('mouseout', $event, inputMethods)"

          @pointerdown="$emit('pointerdown', $event, inputMethods)"
          @pointerup="$emit('pointerup', $event, inputMethods)"
          @pointermove="$emit('pointermove', $event, inputMethods)"
          @pointerenter="$emit('pointerenter', $event, inputMethods)"
          @pointerleave="$emit('pointerleave', $event, inputMethods)"

          @touchstart="$emit('touchstart', $event, inputMethods)"
          @touchend="$emit('touchend', $event, inputMethods)"
          @touchmove="$emit('touchmove', $event, inputMethods)"
          @touchcancel="$emit('touchcancel', $event, inputMethods)"

          @contextmenu="$emit('contextmenu', $event, inputMethods)"
        />
      </template>

      <!-- switch -->
      <template v-else>
        <label :class="['hison-input-checkbox-switch', ...editModeClassList]">
          <input
            ref="inputRef"
            :id="`${id}`"
            :name="`${nameAttr}`"
            type="checkbox"
            class="hison-cswitch-input"
            :disabled="disable"
            :readonly="readonly"
            :checked="inputValue === true"
            :title="title || undefined"
            :tabindex="tabIndex ?? undefined"
            @change="onCheckboxChange"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeydown"

            @click="$emit('click', $event, inputMethods)"
            @dblclick="$emit('dblclick', $event, inputMethods)"
            @mousedown="$emit('mousedown', $event, inputMethods)"
            @mouseup="$emit('mouseup', $event, inputMethods)"
            @mouseenter="$emit('mouseenter', $event, inputMethods)"
            @mouseleave="$emit('mouseleave', $event, inputMethods)"
            @mouseover="$emit('mouseover', $event, inputMethods)"
            @mouseout="$emit('mouseout', $event, inputMethods)"

            @pointerdown="$emit('pointerdown', $event, inputMethods)"
            @pointerup="$emit('pointerup', $event, inputMethods)"
            @pointermove="$emit('pointermove', $event, inputMethods)"
            @pointerenter="$emit('pointerenter', $event, inputMethods)"
            @pointerleave="$emit('pointerleave', $event, inputMethods)"

            @touchstart="$emit('touchstart', $event, inputMethods)"
            @touchend="$emit('touchend', $event, inputMethods)"
            @touchmove="$emit('touchmove', $event, inputMethods)"
            @touchcancel="$emit('touchcancel', $event, inputMethods)"

            @contextmenu="$emit('contextmenu', $event, inputMethods)"
          />
          <span
            class="hison-switch-visual"
            :class="[
              ...editModeClassList,
              ...requiredClassList
            ]"
            aria-hidden="true"
          />
        </label>
      </template>
    </div>

    <div
      v-else-if="inputType === 'radio'"
      :class="['hison-input','hison-input-radio-div']"
      :style="[textAlignStyle, props.style]"
    >
      <template v-if="toggleStyle !== 'switch'">
        <input
          ref="inputRef"
          :id="`${id}`"
          :name="`${nameAttr}`"
          type="radio"
          :class="[
            `hison-input-${inputType}`,
            'hison-input-radio--default',
            ...editModeClassList,
            ...requiredClassList,
          ]"
          :disabled="disable || readonly"
          :readonly="readonly"
          :checked="inputValue === true"
          :title="title || undefined"
          :tabindex="tabIndex ?? undefined"
          @change="onRadioChange"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onKeydown"

          @click="$emit('click', $event, inputMethods)"
          @dblclick="$emit('dblclick', $event, inputMethods)"
          @mousedown="$emit('mousedown', $event, inputMethods)"
          @mouseup="$emit('mouseup', $event, inputMethods)"
          @mouseenter="$emit('mouseenter', $event, inputMethods)"
          @mouseleave="$emit('mouseleave', $event, inputMethods)"
          @mouseover="$emit('mouseover', $event, inputMethods)"
          @mouseout="$emit('mouseout', $event, inputMethods)"

          @pointerdown="$emit('pointerdown', $event, inputMethods)"
          @pointerup="$emit('pointerup', $event, inputMethods)"
          @pointermove="$emit('pointermove', $event, inputMethods)"
          @pointerenter="$emit('pointerenter', $event, inputMethods)"
          @pointerleave="$emit('pointerleave', $event, inputMethods)"

          @touchstart="$emit('touchstart', $event, inputMethods)"
          @touchend="$emit('touchend', $event, inputMethods)"
          @touchmove="$emit('touchmove', $event, inputMethods)"
          @touchcancel="$emit('touchcancel', $event, inputMethods)"

          @contextmenu="$emit('contextmenu', $event, inputMethods)"
        />
      </template>

      <!-- switch 모양: input은 그대로 두고, 시각화 span 추가 -->
      <template v-else>
        <label :class="['hison-input-radio-switch', ...editModeClassList]">
          <input
            ref="inputRef"
            :id="`${id}`"
            :name="`${nameAttr}`"
            type="radio"
            class="hison-radio-switch-input"
            :disabled="disable || readonly"
            :readonly="readonly"
            :checked="inputValue === true"
            :title="title || undefined"
            :tabindex="tabIndex ?? undefined"
            @change="onRadioChange"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeydown"

            @click="$emit('click', $event, inputMethods)"
            @dblclick="$emit('dblclick', $event, inputMethods)"
            @mousedown="$emit('mousedown', $event, inputMethods)"
            @mouseup="$emit('mouseup', $event, inputMethods)"
            @mouseenter="$emit('mouseenter', $event, inputMethods)"
            @mouseleave="$emit('mouseleave', $event, inputMethods)"
            @mouseover="$emit('mouseover', $event, inputMethods)"
            @mouseout="$emit('mouseout', $event, inputMethods)"

            @pointerdown="$emit('pointerdown', $event, inputMethods)"
            @pointerup="$emit('pointerup', $event, inputMethods)"
            @pointermove="$emit('pointermove', $event, inputMethods)"
            @pointerenter="$emit('pointerenter', $event, inputMethods)"
            @pointerleave="$emit('pointerleave', $event, inputMethods)"

            @touchstart="$emit('touchstart', $event, inputMethods)"
            @touchend="$emit('touchend', $event, inputMethods)"
            @touchmove="$emit('touchmove', $event, inputMethods)"
            @touchcancel="$emit('touchcancel', $event, inputMethods)"

            @contextmenu="$emit('contextmenu', $event, inputMethods)"
          />
          <!-- 시각화 -->
          <span
            class="hison-switch-visual"
            :class="[
              ...editModeClassList,
              ...requiredClassList
            ]"
            aria-hidden="true"
          />
        </label>
      </template>
    </div>

    <select
      v-else-if="inputType === 'select'"
      ref="inputRef"
      :id="`${id}`"
      :name="`${nameAttr}`"
      :style="[textAlignStyle, props.style]"
      :class="[
        'hison-input',
        `hison-input-${inputType}`,
        ...editModeClassList,
        ...requiredClassList,
        fontBoldClass,
        fontItalicClass,
        fontThrulineClass,
        fontUnderlineClass,
        borderClass
      ]"
      :value="inputValue"
      :disabled="disable"
      :readonly="readonly"
      :title="title || undefined"
      :tabindex="tabIndex ?? undefined"
      @change="onSelectChange"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"

      @click="$emit('click', $event, inputMethods)"
      @dblclick="$emit('dblclick', $event, inputMethods)"
      @mousedown="$emit('mousedown', $event, inputMethods)"
      @mouseup="$emit('mouseup', $event, inputMethods)"
      @mouseenter="$emit('mouseenter', $event, inputMethods)"
      @mouseleave="$emit('mouseleave', $event, inputMethods)"
      @mouseover="$emit('mouseover', $event, inputMethods)"
      @mouseout="$emit('mouseout', $event, inputMethods)"

      @pointerdown="$emit('pointerdown', $event, inputMethods)"
      @pointerup="$emit('pointerup', $event, inputMethods)"
      @pointermove="$emit('pointermove', $event, inputMethods)"
      @pointerenter="$emit('pointerenter', $event, inputMethods)"
      @pointerleave="$emit('pointerleave', $event, inputMethods)"

      @touchstart="$emit('touchstart', $event, inputMethods)"
      @touchend="$emit('touchend', $event, inputMethods)"
      @touchmove="$emit('touchmove', $event, inputMethods)"
      @touchcancel="$emit('touchcancel', $event, inputMethods)"

      @contextmenu="$emit('contextmenu', $event, inputMethods)"
    >
      <option
        v-for="opt in props.options"
        :key="opt.value"
        :value="opt.value"
      >{{ opt.text }}</option>
    </select>

    <textarea
      v-else-if="inputType === 'textarea'"
      ref="inputRef"
      :id="`${id}`"
      :name="`${nameAttr}`"
      :class="[
        'hison-input',
        `hison-input-${inputType}`,
        ...editModeClassList,
        ...requiredClassList,
        fontBoldClass,
        fontItalicClass,
        fontThrulineClass,
        fontUnderlineClass,
        borderClass
      ]"
      :value="inputValue"
      :style="[textAlignStyle, props.style]"
      :disabled="disable"
      :readonly="readonly"
      :placeholder="placeholder || undefined"
      :title="title || undefined"
      :maxlength="maxLength || undefined"
      :tabindex="tabIndex ?? undefined"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    >{{ inputValue }}</textarea>

    <template v-else>
      <input
        ref="inputTextRef"
        :id="`input_text_${id}`"
        :name="`input_text_${nameAttr}`"
        v-show="!editing"
        :class="[
          'hison-input',
          `hison-input-text-${inputType}`,
          ...editModeClassList,
          ...requiredClassList,
          fontBoldClass,
          fontItalicClass,
          fontThrulineClass,
          fontUnderlineClass,
          borderClass
        ]"
        type="text"
        :value="spanText"
        :style="[textAlignStyle, props.style]"
        :disabled="disable"
        :readonly="readonly"
        :title="title || undefined"
        :placeholder="placeholder || undefined"
        :tabindex="tabIndex ?? undefined"
        @focus="onTextInputFocus"
        @click="$emit('click', $event, inputMethods)"
        @dblclick="$emit('dblclick', $event, inputMethods)"
        @mousedown="$emit('mousedown', $event, inputMethods)"
        @mouseup="$emit('mouseup', $event, inputMethods)"
        @mouseenter="$emit('mouseenter', $event, inputMethods)"
        @mouseleave="$emit('mouseleave', $event, inputMethods)"
        @mouseover="$emit('mouseover', $event, inputMethods)"
        @mouseout="$emit('mouseout', $event, inputMethods)"
        @mousemove="$emit('mousemove', $event, inputMethods)"
    
        @pointerdown="$emit('pointerdown', $event, inputMethods)"
        @pointerup="$emit('pointerup', $event, inputMethods)"
        @pointermove="$emit('pointermove', $event, inputMethods)"
        @pointerenter="$emit('pointerenter', $event, inputMethods)"
        @pointerleave="$emit('pointerleave', $event, inputMethods)"
        @touchstart="$emit('touchstart', $event, inputMethods)"
        @touchend="$emit('touchend', $event, inputMethods)"
        @touchmove="$emit('touchmove', $event, inputMethods)"
        @touchcancel="$emit('touchcancel', $event, inputMethods)"
      />
      <input
        v-show="editing"
        ref="inputRef"
        :id="`${id}`"
        :name="`${nameAttr}`"
        :class="[
          'hison-input',
          `hison-input-${inputType}`,
          ...editModeClassList,
          borderClass
        ]"
        :value="inputValue"
        :style="[textAlignStyle, props.style]"
        :disabled="disable"
        :readonly="readonly"
        :type="inputType"
        :title="title || undefined"
        :placeholder="placeholder || undefined"
        :max="maxNumber || undefined"
        :min="minNumber || undefined"
        :tabindex="tabIndex ?? undefined"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @compositionstart="$emit('compositionstart', $event, inputMethods)"
        @compositionupdate="$emit('compositionupdate', $event, inputMethods)"
        @compositionend="$emit('compositionend', $event, inputMethods)"
        @keydown="$emit('keydown', $event, inputMethods)"
        @keyup="$emit('keyup', $event, inputMethods)"
        @dragstart="$emit('dragstart', $event, inputMethods)"
        @dragend="$emit('dragend', $event, inputMethods)"
        @drag="$emit('drag', $event, inputMethods)"
        @drop="$emit('drop', $event, inputMethods)"
        @copy="$emit('copy', $event, inputMethods)"
        @cut="$emit('cut', $event, inputMethods)"
        @paste="$emit('paste', $event, inputMethods)"
        @wheel="$emit('wheel', $event, inputMethods)"
        @contextmenu="$emit('contextmenu', $event, inputMethods)"
      />
    </template>
  </div>
</template>


<script lang="ts">
import { defineComponent, computed, ref, onMounted, onBeforeUnmount, nextTick, watch, unref, inject } from 'vue'
import type { HInputMethods } from '../../types'
import { inputProps } from './props'
import { DateFormat, hison, EditMode, InputType, YearMonthFormat, TimeFormat, TextAlign, TextAlignValue, InputTypeValue } from '../..'
import { extractResponsiveClasses, getDigitsOnly, getIndexSpecificClassNameFromClassList, getMaskValue, getUUID, isNullOrUndefined, addComponentNameToClass, registerReloadable, reloadHisonComponent, toClassString, unregisterReloadable } from '../../utils'
import { useDevice } from '../../core'
import { addInputCssEvent, addInputTextCssEvent, removeInputCssEvent, removeInputTextCssEvent } from '../common/setInputCssEvent'
import { hisonCloser } from '../../hisonCloser'

export default defineComponent({
  name: 'HInput',
  props: inputProps,
  inheritAttrs: false,
  
  emits: [
    'update:modelValue',
    'mounted',
    'responsive-change',
    'click',
    'dblclick',
    'mousedown',
    'mouseup',
    'mouseenter',
    'mouseleave',
    'mouseover',
    'mouseout',
    'mousemove',
    'pointerdown',
    'pointerup',
    'pointermove',
    'pointerenter',
    'pointerleave',
    'touchstart',
    'touchend',
    'touchmove',
    'touchcancel',
    'focus',
    'blur',
    'input',
    'change',
    'compositionstart',
    'compositionupdate',
    'compositionend',
    'keydown',
    'keyup',
    'dragstart',
    'dragend',
    'drag',
    'drop',
    'copy',
    'cut',
    'paste',
    'wheel',
    'contextmenu',
  ],
  setup(props, { emit }) {
    const inputRef = ref<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null)
    const inputTextRef = ref<HTMLInputElement | null>(null)
    const inputMethods = ref<HInputMethods | null>(null)
    const id = props.id ? props.id : getUUID()
    const name = ref(props.name ?? id)
    const nameAttr = computed(() => name.value)
    const reloadId = `hinput:${id}`
    const device = useDevice()

    const responsiveClassList = ref<string[]>([])
    const refreshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
      if (getIndexSpecificClassNameFromClassList(responsiveClassList.value, 'col') === -1) responsiveClassList.value.push('hison-col-12')
      addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
    }

    const inputType = ref(props.inputType ?? InputType.text)
    const inputExpressionType = computed(() => {
      switch (inputType.value) {
        case InputType.checkbox:
          return 'checkbox'
        case InputType.radio:
          return 'radio'
        case InputType.select:
          return 'select'
        case InputType.range:
          return 'range'
        case InputType.color:
          return 'color'
        default:
          return 'text'
      }
    })
    const inputAttrType = computed(() => {
      switch (inputType.value) {
        case InputType.mask:
        case InputType.digit:
          return 'text'
        default:
          return inputType.value
      }
    })
    const toggleStyle = ref<'default' | 'switch'>(props.toggleStyle ?? 'default')

    const format = ref(props.format ?? null)
    const maxNumber = ref(hison.utils.isNumeric(props.maxNumber) ? Number(props.maxNumber) : null)
    const minNumber = ref(hison.utils.isNumeric(props.minNumber) ? Number(props.minNumber) : null)
    const roundNumber = ref(hison.utils.isInteger(props.roundNumber) || hison.utils.isNegativeInteger(props.roundNumber) || props.roundNumber === '0' ? Number(props.roundNumber) : null)
    const maxLength = ref(hison.utils.isPositiveInteger(props.maxLength) ? Number(props.maxLength) : null)
    const maxByte = ref(hison.utils.isPositiveInteger(props.maxByte) ? Number(props.maxByte) : null)
    const computeDefaultTextAlign = (inputType: InputTypeValue): TextAlign => {
      switch (inputType) {
        case InputType.number:
        case InputType.digit:
          return TextAlign.right
        case InputType.date:
        case InputType.month:
        case InputType.time:
          return TextAlign.center
        default:
          return TextAlign.left
      }
    }
    const textAlign = ref<TextAlignValue>(props.textAlign ?? computeDefaultTextAlign(inputType.value))
    const textAlignStyle = computed(() => ({ textAlign: textAlign.value }))
    const border = ref<boolean>(props.border ?? true)
    const getCutLengthString = (value: any) => {
      value = String(value)
      if(maxLength.value) value = value.substring(0, maxLength.value)
      if(maxByte.value) value = hison.utils.getCutByteLength(value, maxByte.value)
      return value
    }
    const getAdjustedNumber = (value: any) => {
      value = Number(value)
      if(maxNumber.value && value > maxNumber.value) value = maxNumber.value
      if(minNumber.value && value < minNumber.value) value = minNumber.value
      if(roundNumber.value) value = hison.utils.getRound(value, roundNumber.value)
      return value
    }
    const computeValue = (value: any) => {
      if (isNullOrUndefined(value)) {
        if (inputType.value === InputType.checkbox || inputType.value === InputType.radio) {
          return false
        }
        return value
      }
      try {
        switch (inputType.value) {
          case InputType.text:
          case InputType.password:
          case InputType.email:
          case InputType.mask:
          case InputType.digit:
          case InputType.textarea:
            if (inputType.value === InputType.mask) value = getMaskValue(value, format.value ?? '')
            if (inputType.value === InputType.digit) value = getDigitsOnly(value)
            value = getCutLengthString(value)
            break
          case InputType.number:
            if (inputType.value === InputType.number) value = getAdjustedNumber(value)
            break
          case InputType.date:
            if(value) value = hison.utils.getDateWithFormat(value, DateFormat['yyyy-MM-dd'])
            break
          case InputType.month:
            if(value) value = hison.utils.getDateWithFormat(value, YearMonthFormat['yyyy-MM'])
            break
          case InputType.time:
            if(value) value = hison.utils.getDateWithFormat(value, TimeFormat['HH:mm:ss'])
            break
          case InputType.checkbox:
          case InputType.radio:
            value = !!value
          default:
            break
        } 
      } catch (e) {
        console.warn('[HInput] Failed to format value', value, e)
      }
      return value;
    }

    const modelValue = ref(computeValue(props.modelValue))
    const inputValue = computed(() => modelValue.value)
    const oldValue = ref(null)
    const visible = ref(props.visible)
    const title = ref(props.title ?? '')
    const nullText = ref(props.nullText ?? '')
    const editMode = ref(props.editMode)
    const disable = computed(() => {
      if(editMode.value === EditMode.disable) return true
      return false
    })
    const readonly = computed(() => {
      if(editMode.value === EditMode.readonly) return true
      return false
    })
    const borderClass = computed(() => (border.value && !readonly.value ? 'hison-border' : ''))
    const editModeClassList = computed(() => {
      if(editMode.value !== EditMode.editable) return [`hison-input-${editMode.value}`, `hison-input-${inputExpressionType.value}-${editMode.value}`]
      else return []
    })
    const required = ref(props.required)
    const requiredClassList = computed(()=>{
      if(required.value) return [`hison-input-required`, `hison-input-${inputExpressionType.value}-required`]
      else return []
    })
    const placeholder = ref(props.placeholder ?? '')
    const fontBold = ref(props.fontBold)
    const fontBoldClass = computed(()=>{
      if(fontBold.value) return 'hison-font-bold'
    })
    const fontItalic = ref(props.fontItalic)
    const fontItalicClass = computed(()=>{
      if(fontItalic.value) return 'hison-font-italic'
    })
    const fontThruline = ref(props.fontThruline)
    const fontThrulineClass = computed(()=>{
      if(fontThruline.value) return 'hison-font-thruline'
    })
    const fontUnderline = ref(props.fontUnderline)
    const fontUnderlineClass = computed(()=>{
      if(fontUnderline.value) return 'hison-font-underline'
    })
    
    const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')
    const editing = ref(false)
    const isModified = ref(false)
    const tabIndex = ref<number | null>(
      props.tabIndex !== null && props.tabIndex !== '' ? Number(props.tabIndex) : null
    )

    const registerToInputGroup = inject<((inputId: string) => void) | null>('registerToInputGroup', null)
    const notifyInputGroupStatus = inject<((inputId: string, newVal: any) => void) | null>('notifyInputGroupStatus', null)
    const radioMembershipChanged = inject<((inputId: string, oldName: string, newName: string, checked: boolean) => void) | null>('radioMembershipChanged', null)

    const computeSpanText = (value: any) => {
      if (inputType.value === InputType.checkbox || inputType.value === InputType.radio) {
        return value ? props.checkedText : props.uncheckedText
      }
      if (isNullOrUndefined(value) || value === '') return nullText.value ?? ''
      if (props.inputTextdHandler) {
        return props.inputTextdHandler(value)
      }
      let text = String(value)
      try {
        switch (inputType.value) {
          case InputType.password:
            text = '•'.repeat(value.length)
            break;
          case InputType.number:
            text = hison.utils.getNumberFormat(value, format.value ?? hison.getNumberFormat())
            break;
          case InputType.date:
            text = hison.utils.getDateWithFormat(value, format.value ?? hison.getDateFormat())
            break;
          case InputType.month:
            text = hison.utils.getDateWithFormat(value, format.value ?? hison.getYearMonthFormat())
            break;
          case InputType.time:
            text = hison.utils.getDateWithFormat(value, format.value ?? hison.getTimeFormat())
            break;
          case InputType.select:
            const selectEl = inputRef.value as HTMLSelectElement
            const selectedIndex = selectEl.selectedIndex
            text = selectedIndex >= 0 ? selectEl.options[selectedIndex].text : ''
            break;
        }
      } catch (e) {
        console.warn('[HInput] Failed to format value', value, e)
        text = ''
      }
      return text
    }
    const spanText = ref('')
    const onTextInputFocus = (e: Event) => {
      if(editMode.value === EditMode.editable) editing.value = true
      nextTick(() => {
        inputRef.value?.focus()
      })
    }
    const onInput = (e: Event) => {
      let value = inputRef.value!.value
      if (inputType.value === InputType.mask || inputType.value === InputType.digit
        || ((maxLength.value || maxByte.value)
          && (inputType.value === InputType.text
            || inputType.value === InputType.email
            || inputType.value === InputType.password
            || inputType.value === InputType.textarea
          ))
      ) {
        value = computeValue(value)
        inputRef.value!.value = value
      }
      modelValue.value = value
      isModified.value = true
      notifyInputGroupStatus?.(id, modelValue.value)
      emit('input', e, inputMethods.value, modelValue.value)
      emit('update:modelValue', modelValue.value)
    }
    const onFocus = (e: FocusEvent) => {
      oldValue.value = modelValue.value
      emit('focus', e, inputMethods.value)
    }
    const onBlur = (e: Event) => {
      if(oldValue.value !== modelValue.value) {
        updateValue(modelValue.value, true, true)
        isModified.value = true
        notifyInputGroupStatus?.(id, modelValue.value)
      }
      editing.value = false
      emit('blur', e, inputMethods.value)
    }
    const updateValue = (value: any, doComputeValue = true, doCallChangeEmit = false) => {
      modelValue.value = doComputeValue ? computeValue(value) : value
      spanText.value = computeSpanText(modelValue.value)

      if (inputType.value === InputType.checkbox || inputType.value === InputType.radio) {
        (inputRef.value as HTMLInputElement).checked = !!modelValue.value
      } else {
        ;(inputRef.value as any).value = modelValue.value
      }

      if (doCallChangeEmit) emit('change', oldValue.value, modelValue.value, inputMethods.value)
    }

    const onRangeChange = (e: Event) => {
      const target = e.target as HTMLSelectElement
      updateValue(target.value, false, true)
      isModified.value = true
      notifyInputGroupStatus?.(id, modelValue.value)
      emit('update:modelValue', modelValue.value)
    }
    const onColorChange = (e: Event) => {
      const target = e.target as HTMLSelectElement
      updateValue(target.value, false, true)
      isModified.value = true
      notifyInputGroupStatus?.(id, modelValue.value)
      emit('update:modelValue', modelValue.value)
    }
    const onCheckboxChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      updateValue(target.checked, false, true)
      isModified.value = true
      notifyInputGroupStatus?.(id, modelValue.value)
      emit('update:modelValue', modelValue.value)
    }
    const onRadioChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      updateValue(target.checked, false, true)
      isModified.value = true
      if (notifyInputGroupStatus && name.value) {
        notifyInputGroupStatus(name.value, target.checked ? id : null)
      } else {
        notifyInputGroupStatus?.(id, modelValue.value)
      }
      emit('update:modelValue', modelValue.value)
    }
    const onSelectChange = (e: Event) => {
      const target = e.target as HTMLSelectElement
      updateValue(target.value, false, true)
      isModified.value = true
      notifyInputGroupStatus?.(id, modelValue.value)
      emit('update:modelValue', modelValue.value)
    }
    const onKeydown = (e: KeyboardEvent) => {
      if (readonly.value && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      emit('keydown', e, inputMethods.value)
    }

    const mount = () => {
      if (hisonCloser.component.inputList[id] && hisonCloser.component.inputList[id].isHisonvueComponent) console.warn(`[Hisonvue] The input ID is at risk of being duplicated. ${id}`)
      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })
      if (!inputRef.value) return

      refreshResponsiveClassList()
      if(inputTextRef.value) addInputTextCssEvent(inputTextRef.value)
      if(inputType.value !== InputType.checkbox
        && inputType.value !== InputType.radio
        && inputType.value !== InputType.range
        && inputType.value !== InputType.color
      ) addInputCssEvent(inputRef.value!)

      updateValue(modelValue.value, false)
      inputMethods.value = {
        isHisonvueComponent: true,
        getId : () => id,
        getType : () => 'input',
        getName : () => name.value,
        setName : (val: string) => {
          if (val === name.value) return
          const prev = name.value
          name.value = val
          if (inputType.value === InputType.radio) {
            radioMembershipChanged?.(id, prev, val, !!modelValue.value)
          }
        },
        getText : () => { return spanText.value },
        getValue : () => { return modelValue.value },
        setValue : (val: any) => {
          oldValue.value = modelValue.value
          modelValue.value = val
          updateValue(modelValue.value)
        },
        getTitle : () => title.value,
        setTitle : (val: string) => { title.value = val },
        isVisible : () => visible.value,
        setVisible : (val: boolean) => { visible.value = val },
        getInputType : () => { return inputType.value },
        setInputType : (val: keyof typeof InputType) => {
          inputType.value = InputType[val]
          oldValue.value = modelValue.value
          updateValue(modelValue.value)
          if (props.textAlign == null) {
            textAlign.value = computeDefaultTextAlign(inputType.value)
          }
        },
        getFormat : () => { return format.value ?? '' },
        setFormat : (val: string) => {
          format.value = val
          oldValue.value = modelValue.value
          updateValue(modelValue.value)
        },
        getNullText : () => { return nullText.value },
        setNullText : (val: string) => {
          nullText.value = val
          if(isNullOrUndefined(modelValue.value) || modelValue.value === '') spanText.value = computeSpanText(modelValue.value)
        },
        getEditMode : () => { return editMode.value },
        setEditMode : (val: EditMode) => { editMode.value = val },
        getMaxNumber : () => { return maxNumber.value },
        setMaxNumber : (val: number) => {
          if(!hison.utils.isNumeric(val)) return
          maxNumber.value = val
          oldValue.value = modelValue.value
          if(inputType.value === InputType.number) updateValue(modelValue.value)
        },
        getMinNumber : () => { return minNumber.value },
        setMinNumber : (val: number) => {
          if(!hison.utils.isNumeric(val)) return
          minNumber.value = val
          oldValue.value = modelValue.value
          if(inputType.value === InputType.number) updateValue(modelValue.value)
        },
        getRoundNumber : () => { return roundNumber.value },
        setRoundNumber : (val: number) => {
          if(!hison.utils.isPositiveInteger(val)
            && !hison.utils.isNegativeInteger(val)
            && val !== 0) return
          roundNumber.value = val
          oldValue.value = modelValue.value
          if(inputType.value === InputType.number) updateValue(modelValue.value)
        },
        getMaxLength : () => { return maxLength.value },
        setMaxLength : (val: number) => {
          if(hison.utils.isPositiveInteger(val)) maxLength.value = val 
          oldValue.value = modelValue.value
          updateValue(modelValue.value)
        },
        getMaxByte : () => { return maxByte.value },
        setMaxByte : (val: number) => {
          if(hison.utils.isPositiveInteger(val)) maxByte.value = val
          oldValue.value = modelValue.value
          updateValue(modelValue.value)
        },
        getRequired : () => { return required.value },
        setRequired : (val: boolean) => { required.value = val },
        getPlaceholder : () => placeholder.value,
        setPlaceholder : (val: string) => { placeholder.value = val },
        isFontBold : () => { return fontBold.value },
        setFontBold : (val: boolean) => { fontBold.value = val },
        isFontItalic : () => { return fontItalic.value },
        setFontItalic : (val: boolean) => { fontItalic.value = val },
        isFontThruline : () => { return fontThruline.value },
        setFontThruline : (val: boolean) => { fontThruline.value = val },
        isFontUnderline : () => { return fontUnderline.value },
        setFontUnderline : (val: boolean) => { fontUnderline.value = val },
        getTextAlign: () => textAlign.value,
        setTextAlign: (v: TextAlign) => {
          if (v === TextAlign.left || v === TextAlign.center || v === TextAlign.right) {
            textAlign.value = v
          }
        },
        isBorder: () => border.value,
        setBorder: (val: boolean) => { border.value = val },
        isModified : () => { return isModified.value },
        setModified : (val: boolean) => { isModified.value = val},
        getToggleStyle: () => toggleStyle.value,
        setToggleStyle: (style: 'default' | 'switch') => {
          if (style === 'default' || style === 'switch') {
            toggleStyle.value = style
          }
        },
        getTabIndex: () => tabIndex.value,
        setTabIndex: (v: number | null) => {
          tabIndex.value = v !== null && v !== undefined ? Number(v) : null
        },
        focus : () => {
          if(inputTextRef.value) inputTextRef.value.focus()
          else inputRef.value?.focus()
        },
        reload: () => reloadHisonComponent(reloadId)
      }
      hisonCloser.component.inputList[id] = inputMethods.value
      if (registerToInputGroup) {
        registerToInputGroup(id)
      }
      emit('mounted', inputMethods.value)
    }

    const unmount = () => {
      unregisterReloadable(reloadId)
      delete hisonCloser.component.inputList[id]
      if(inputType.value !== InputType.checkbox
        && inputType.value !== InputType.radio
        && inputType.value !== InputType.range
        && inputType.value !== InputType.color
      ) removeInputCssEvent(inputRef.value!)
      if(inputTextRef.value) removeInputTextCssEvent(inputTextRef.value)
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(device, (newDevice) => {
      refreshResponsiveClassList()
      emit('responsive-change', newDevice)
    })
    
    watch(() => props.modelValue, (newVal) => {
      updateValue(newVal, false)
    })

    watch(() => props.name, (v) => {
      if (v && v !== name.value) {
        const prev = name.value
        name.value = v
        if (inputType.value === InputType.radio) {
          radioMembershipChanged?.(id, prev, v, !!modelValue.value)
        }
      }
    })

    watch(() => props.visible, v => { const nv = !!v; if (nv !== visible.value) visible.value = nv })
    watch(() => props.title, v => { const s = v ?? ''; if (s !== title.value) title.value = s })
    watch(() => props.nullText, v => { const s = v ?? ''; if (s !== nullText.value) { nullText.value = s; if (isNullOrUndefined(modelValue.value) || modelValue.value === '') spanText.value = computeSpanText(modelValue.value) } })
    watch(() => props.inputType, v => { if (v && v !== inputType.value) { inputType.value = v as any; if (props.textAlign == null) textAlign.value = computeDefaultTextAlign(inputType.value); updateValue(modelValue.value) } })
    watch(() => props.format, v => { const s = v ?? null; if (s !== format.value) { format.value = s; updateValue(modelValue.value) } })
    watch(() => props.maxNumber, v => { const n = hison.utils.isNumeric(v) ? Number(v) : null; if (n !== maxNumber.value) { maxNumber.value = n; if (inputType.value === InputType.number) updateValue(modelValue.value) } })
    watch(() => props.minNumber, v => { const n = hison.utils.isNumeric(v) ? Number(v) : null; if (n !== minNumber.value) { minNumber.value = n; if (inputType.value === InputType.number) updateValue(modelValue.value) } })
    watch(() => props.roundNumber, v => { const n = (hison.utils.isInteger(v) || hison.utils.isNegativeInteger(v) || v === '0') ? Number(v) : null; if (n !== roundNumber.value) { roundNumber.value = n; if (inputType.value === InputType.number) updateValue(modelValue.value) } })
    watch(() => props.maxLength, v => { const n = hison.utils.isPositiveInteger(v) ? Number(v) : null; if (n !== maxLength.value) { maxLength.value = n; updateValue(modelValue.value) } })
    watch(() => props.maxByte, v => { const n = hison.utils.isPositiveInteger(v) ? Number(v) : null; if (n !== maxByte.value) { maxByte.value = n; updateValue(modelValue.value) } })
    watch(() => props.textAlign, v => { if (v && v !== textAlign.value && (v === TextAlign.left || v === TextAlign.center || v === TextAlign.right)) textAlign.value = v })
    watch(() => props.border, v => { const b = !!v; if (b !== border.value) border.value = b })
    watch(() => props.placeholder, v => { const s = v ?? ''; if (s !== placeholder.value) placeholder.value = s })
    watch(() => props.required, v => { const b = !!v; if (b !== required.value) required.value = b })
    watch(() => props.fontBold, v => { const b = !!v; if (b !== fontBold.value) fontBold.value = b })
    watch(() => props.fontItalic, v => { const b = !!v; if (b !== fontItalic.value) fontItalic.value = b })
    watch(() => props.fontThruline, v => { const b = !!v; if (b !== fontThruline.value) fontThruline.value = b })
    watch(() => props.fontUnderline, v => { const b = !!v; if (b !== fontUnderline.value) fontUnderline.value = b })
    watch(() => props.editMode, v => { if (v && v !== editMode.value) editMode.value = v as any })
    watch(() => props.tabIndex, v => { const nv = (v === null || v === '') ? null : Number(v); if (nv !== tabIndex.value) tabIndex.value = nv })
    watch(() => props.class, () => { refreshResponsiveClassList() })
    watch(() => props.toggleStyle, v => {
      const s = (v ?? 'default') as any
      if (s !== toggleStyle.value && (s === 'default' || s === 'switch')) {
        toggleStyle.value = s
      }
    })

    return {
        inputRef,
        inputTextRef,
        inputMethods: computed(() => unref(inputMethods)),
        inputValue,
        editing,
        props,
        id,
        nameAttr,
        responsiveClassList,
        visibleClass,
        editModeClassList,
        requiredClassList,
        fontBoldClass,
        fontItalicClass,
        fontThrulineClass,
        fontUnderlineClass,
        textAlignStyle,
        borderClass,
        disable,
        readonly,
        inputType,
        inputExpressionType,
        inputAttrType,
        title,
        placeholder,
        maxNumber,
        minNumber,
        spanText,
        toggleStyle,
        tabIndex,
        onInput,
        onTextInputFocus,
        onFocus,
        onBlur,
        onRangeChange,
        onColorChange,
        onCheckboxChange,
        onRadioChange,
        onSelectChange,
        onKeydown,
    }
  }
})
</script>

<style scoped></style>
