<template>
  <div
    :class="[
      'hison-dropdown',
      ...responsiveClassList,
      visibleClass,
      disableClass,
      readonlyClass,
      isOpen ? 'hison-open' : '',
      !animate ? 'hison-no-anim' : ''
    ]"
    :style="[rootInlineStyle, props.style]"
    @mouseenter="trigger === 'hover' ? open($event) : null"
    @mouseleave="trigger === 'hover' ? close($event) : null"
  >
    <!-- Toggle -->
    <div
      ref="toggleRef"
      class="hison-dropdown-toggle"
      :class="[
        isDisabled ? 'hison-disable' : '',
        isReadonly ? 'hison-readonly' : '',
      ]"
      :aria-expanded="isOpen"
      role="combobox"
      :aria-disabled="(isDisabled || isReadonly) ? 'true' : 'false'"
      :tabindex="tabIndex ?? undefined"
      :style="[textAlignStyle, props.toggleStyle]"
      @click="onToggleClick($event)"
      @keydown.enter.prevent="onToggleClick($event)"
      @keydown.space.prevent="onToggleClick($event)"
    >
      <span class="hison-dropdown-label">
        {{ selectedLabel || placeholder }}
      </span>
      <slot name="caret">
        <span class="hison-dropdown-caret">▾</span>
      </slot>
    </div>

    <div
      ref="menuRef"
      class="hison-dropdown-menu"
      :style="[textAlignStyle, props.menuStyle]"
      role="listbox"
      :aria-activedescendant="activeDescId"
      :inert="!isOpen || undefined"
    >
      <div class="hison-dropdown-panel">
        <div
          class="hison-dropdown-panel-inner"
          :style="menuInlineStyle"
        >
          <div
            v-for="(opt, idx) in options"
            :key="`opt-${idx}`"
            class="hison-dropdown-item"
            :class="[
              opt.disabled ? 'hison-disable' : '',
              opt.value === selectedValue ? 'hison-selected' : ''
            ]"
            :style="props.itemStyle"
            role="option"
            :aria-selected="opt.value === selectedValue ? 'true' : 'false'"
            @click="onSelect(opt, $event)"
          >
            {{ opt.label }}
          </div>
          <div v-if="options.length === 0" class="hison-dropdown-empty">No options</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, onMounted, onBeforeUnmount, nextTick, watch, unref
} from 'vue'
import { dropdownProps } from './props'
import {
  getUUID, extractResponsiveClasses, registerReloadable, unregisterReloadable,
  reloadHisonComponent,
  toClassString,
  addComponentNameToClass
} from '../../utils'
import { useDevice } from '../../core'
import { DropdownTrigger, EditMode, hisonCloser, TextAlign } from '../..'
import type { HDropdownMethods, HDropdownModel, HDropdownOption } from '../../types'
import { addButtonCssEvent, removeButtonCssEvent } from '../common/setButtonCssEvent'

export default defineComponent({
  name: 'HDropdown',
  props: dropdownProps,
  inheritAttrs: false,
  emits: ['mounted', 'responsive-change', 'open', 'close', 'toggle-click', 'item-click', 'change', 'update:modelValue'],
  setup(props, { emit }) {
    const id = props.id || getUUID()
    const reloadId = `hdropdown:${id}`

    const toggleRef = ref<HTMLElement | null>(null)
    const menuRef   = ref<HTMLElement | null>(null)

    const device = useDevice()

    const isOpen = ref(false)

    const options = ref<HDropdownOption[]>(props.modelValue?.options ?? [])
    const selectedValue = ref<any>(props.modelValue?.value ?? null)

    const visible   = ref(!!props.visible)
    const editMode  = ref(props.editMode)
    const isDisabled = computed(() => editMode.value === EditMode.disable)
    const isReadonly = computed(() => editMode.value === EditMode.readonly)
    const placeholder = ref(props.placeholder || '')
    const trigger     = ref(props.trigger)
    const textAlign = ref<TextAlign>((props.textAlign as TextAlign) ?? TextAlign.left)
    const textAlignStyle = computed(() => ({ textAlign: textAlign.value }))

    // ✅ Animation controls (Accordion과 동일한 인터페이스)
    const animate  = ref(props.animate ?? true)
    const duration = ref(props.duration ?? 500)
    const easing   = ref(props.easing ?? 'ease')

    const tabIndex = ref<number | null>(
      props.tabIndex !== null && props.tabIndex !== '' ? Number(props.tabIndex) : null
    )

    // 인스턴스별 CSS 변수
    const rootInlineStyle = computed(() => ({
      '--hdd-duration': `${duration.value}ms`,
      '--hdd-easing': easing.value
    } as Record<string, string>))

    const visibleClass = computed(() => (visible.value ? '' : 'hison-display-none'))
    const disableClass  = computed(() => (isDisabled.value ? 'hison-disable' : ''))
    const readonlyClass = computed(() => (isReadonly.value ? 'hison-readonly' : ''))

    const responsiveClassList = ref<string[]>([])
    const refreshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
      addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
    }

    const selectedLabel = computed(() => {
      const found = options.value.find(o => o.value === selectedValue.value)
      return found?.label ?? ''
    })

    // 메뉴 내부 스크롤은 inner에서 처리 (grid 애니메이션과 충돌 방지)
    const maxHeight = ref<number>(props.maxHeight ?? 240)
    const menuInlineStyle = computed(() => ({
      maxHeight: `${maxHeight.value}px`,
      overflowY: 'auto'
    } as Record<string,string>))

    const closeOnSelect = ref<boolean>(props.closeOnSelect ?? true)

    const activeDescId = computed(() => {
      const idx = options.value.findIndex(o => o.value === selectedValue.value)
      return idx >= 0 ? `opt-${idx}` : undefined
    })

    const onDocMousedown = (e: MouseEvent) => {
      if (!isOpen.value) return
      const t = e.target as Node | null
      const inToggle = !!toggleRef.value && !!t && toggleRef.value.contains(t)
      const inMenu   = !!menuRef.value   && !!t && menuRef.value.contains(t)
      if (!inToggle && !inMenu) close()
    }

    const open = (e?: Event | null) => {
      if (isDisabled.value || isReadonly.value || !visible.value) return
      if (isOpen.value) return
      isOpen.value = true
      emit('open', e ?? null, dropdownMethods.value)
    }

    const close = (e?: Event | null) => {
      if (!isOpen.value) return

      // 🔒 메뉴 내부 포커스가 남아있으면 토글로 이동
      const active = document.activeElement as HTMLElement | null
      const menuEl = menuRef.value
      if (menuEl && active && menuEl.contains(active)) {
        toggleRef.value?.focus()
      }

      isOpen.value = false
      emit('close', e ?? null, dropdownMethods.value)
    }

    const toggle = (e?: Event | null) => (isOpen.value ? close(e) : open(e))

    const onToggleClick = (e: MouseEvent | KeyboardEvent) => {
      if (trigger.value !== 'click') return
      if (isDisabled.value || isReadonly.value) return
      emit('toggle-click', e, dropdownMethods.value)
      toggle(e)
    }

    const onSelect = (opt: HDropdownOption, e?: MouseEvent) => {
      if (opt.disabled || isDisabled.value || isReadonly.value) return
      if (e) emit('item-click', e, dropdownMethods.value, opt)

      const prev = selectedValue.value
      if (opt.value !== prev) {
        selectedValue.value = opt.value
        const newModel: HDropdownModel = { value: selectedValue.value, options: unref(options) }
        emit('update:modelValue', newModel)
        emit('change', prev, selectedValue.value, dropdownMethods.value)
      }

      if (closeOnSelect.value) close(e)
    }

    const dropdownMethods = ref<HDropdownMethods | null>(null)

    const mount = () => {
      if (hisonCloser.component.dropdownList[id]) throw new Error('[Hisonvue] dropdown id attribute was duplicated.')
      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })
      if (toggleRef.value) addButtonCssEvent(toggleRef.value)
      refreshResponsiveClassList()

      dropdownMethods.value = {
        getId: () => id,
        getType: () => 'dropdown',
        isVisible: () => visible.value,
        setVisible: (v: boolean) => { visible.value = v },
        getEditMode: () => editMode.value,
        setEditMode: (v: any) => { editMode.value = v },
        isOpen: () => isOpen.value,
        open, close, toggle,
        getValue: () => selectedValue.value,
        setValue: (val: any) => { selectedValue.value = val },
        getText: () => selectedLabel.value,
        getOptions: () => unref(options),
        setOptions: (opts: HDropdownOption[]) => { options.value = Array.isArray(opts) ? opts : [] },
        setTriggerType: (t: DropdownTrigger) => { trigger.value = t },
        getMaxHeight: () => maxHeight.value,
        setMaxHeight: (px: number) => {
          const n = Number(px)
          if (!Number.isFinite(n) || n < 0) return
          maxHeight.value = n
        },
        isCloseOnSelect: () => closeOnSelect.value,
        setCloseOnSelect: (v: boolean) => { closeOnSelect.value = !!v },

        getTextAlign: () => textAlign.value,
        setTextAlign: (v: TextAlign) => {
          if (v === TextAlign.left || v === TextAlign.center || v === TextAlign.right) {
            textAlign.value = v
          }
        },
        // Animation runtime controls (Accordion과 동일)
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
        focus: () => { toggleRef.value?.focus() },
        reload: () => reloadHisonComponent(reloadId),
      }
      hisonCloser.component.dropdownList[id] = dropdownMethods.value
      document.addEventListener('mousedown', onDocMousedown)

      emit('mounted', dropdownMethods.value)
    }

    const unmount = () => {
      unregisterReloadable(reloadId)
      try { document.removeEventListener('mousedown', onDocMousedown) } catch {}
      if (toggleRef.value) removeButtonCssEvent(toggleRef.value)
      if (hisonCloser.component?.dropdownList) {
        delete hisonCloser.component.dropdownList[id]
      }
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(() => props.modelValue, (nv) => {
      if (!nv || typeof nv !== 'object') return
      if (Array.isArray(nv.options)) options.value = nv.options
      selectedValue.value = (nv as any).value
    }, { deep: true })

    watch(device, (newDevice) => {
      refreshResponsiveClassList()
      emit('responsive-change', newDevice)
    })

    return {
      toggleRef, menuRef,
      props,
      isDisabled, isReadonly,
      visibleClass, disableClass, readonlyClass,
      responsiveClassList,
      isOpen, trigger,
      selectedValue, selectedLabel, placeholder,
      activeDescId, menuInlineStyle,
      options,
      animate, rootInlineStyle,
      tabIndex,
      onToggleClick, onSelect, textAlignStyle,
      open, close, toggle
    }
  }
})
</script>

<style scoped>
</style>
