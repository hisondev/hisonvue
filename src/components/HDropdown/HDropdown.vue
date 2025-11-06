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

    <!-- 메뉴: 같은 트리에 두되 화면 기준 fixed 좌표 -->
    <div
      ref="menuRef"
      class="hison-dropdown-menu hison-dropdown-menu-fixed"
      :class="[
        isOpen ? 'hison-open' : '',
        openBelow ? 'hison-open-below' : 'hison-open-above'
      ]"
      :style="[fixedMenuStyle, textAlignStyle, props.menuStyle]"
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
import { DropdownTrigger, EditMode, TextAlign, TextAlignValue } from '../..'
import type { HDropdownMethods, HDropdownModel, HDropdownOption } from '../../types'
import { addButtonCssEvent, removeButtonCssEvent } from '../common/setButtonCssEvent'
import { hisonCloser } from '../../hisonCloser'

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
    const textAlign = ref<TextAlignValue>((props.textAlign as TextAlign) ?? TextAlign.left)
    const textAlignStyle = computed(() => ({ textAlign: textAlign.value }))

    const animate  = ref(props.animate ?? true)
    const duration = ref(props.duration ?? 500)
    const easing   = ref(props.easing ?? 'ease')

    const tabIndex = ref<number | null>(
      props.tabIndex !== null && props.tabIndex !== '' ? Number(props.tabIndex) : null
    )
    const zIndex = ref<number>(props.zIndex ?? 1100)

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

    // ---------- 화면 기준(FIXED) 좌표 ----------
    const fixedMenuStyle = ref<Record<string, string>>({})
    const openBelow = ref(true) // 애니메이션 origin에 쓰기
    const OFFSET_Y = 0   // 정확히 맞추려면 0, 필요시 미세조정
    const MIN_SHOW_PX = 120

    function getContentNaturalHeight(): number {
      if (!menuRef.value) return 0
      // 실제 컨텐츠 영역의 자연 높이
      const inner = menuRef.value.querySelector('.hison-dropdown-panel-inner') as HTMLElement | null
      if (!inner) return 0
      // 스크롤 가능한 전체 내용 높이
      return inner.scrollHeight || 0
    }

    function positionMenu() {
      if (!isOpen.value || !toggleRef.value) return
      const r  = toggleRef.value.getBoundingClientRect()
      const vh = window.innerHeight

      const width = r.width
      const left  = r.left

      const spaceBelow = vh - r.bottom
      const spaceAbove = r.top
      openBelow.value = spaceBelow >= MIN_SHOW_PX

      // 실제 컨텐츠 높이(자연 높이)
      const naturalH = getContentNaturalHeight()

      // 가용 공간과 maxHeight로 클램프
      const capByViewport = openBelow.value ? spaceBelow - OFFSET_Y : spaceAbove - OFFSET_Y
      const desiredH = Math.max(0, Math.min(naturalH || maxHeight.value, maxHeight.value, capByViewport))

      // 위/아래 별 top 계산
      const topPx = openBelow.value
        ? (r.bottom + OFFSET_Y)
        : (r.top - desiredH - OFFSET_Y)

      const fs = getComputedStyle(toggleRef.value).fontSize || 'inherit'

      fixedMenuStyle.value = {
        position: 'fixed',
        left: `${left}px`,
        top: `${topPx}px`,
        width: `${width}px`,

        // 중요: 위로 열릴 때는 컨테이너 높이를 '고정'해서 기준점이 안 흔들리게
        // (아래로 열릴 때는 auto여도 무방)
        height: openBelow.value ? 'auto' : `${desiredH}px`,
        maxHeight: `${desiredH}px`,

        overflowY: 'auto',
        zIndex: String(zIndex.value),
        fontSize: fs,
        transformOrigin: openBelow.value ? 'top center' : 'bottom center'
      }
    }

    function onScrollOrResize() {
      if (isOpen.value) positionMenu()
    }

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
      nextTick(() => {
        positionMenu()
        // 폰트/스크롤바 반영 후 재보정
        requestAnimationFrame(() => positionMenu())
      })
      emit('open', e ?? null, dropdownMethods.value)
    }

    const close = (e?: Event | null) => {
      if (!isOpen.value) return

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
      if (hisonCloser.component.dropdownList[id] && hisonCloser.component.dropdownList[id].isHisonvueComponent) console.warn(`[Hisonvue] The dropdown ID is at risk of being duplicated. ${id}`)
      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })
      if (toggleRef.value) addButtonCssEvent(toggleRef.value)
      refreshResponsiveClassList()

      dropdownMethods.value = {
        isHisonvueComponent: true,
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
          nextTick(positionMenu)
        },
        isCloseOnSelect: () => closeOnSelect.value,
        setCloseOnSelect: (v: boolean) => { closeOnSelect.value = !!v },

        getTextAlign: () => textAlign.value,
        setTextAlign: (v: TextAlign) => {
          if (v === TextAlign.left || v === TextAlign.center || v === TextAlign.right) {
            textAlign.value = v
            nextTick(positionMenu)
          }
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
        getZIndex: () => zIndex.value,
        setZIndex: (v: number) => { zIndex.value = v },
        focus: () => { toggleRef.value?.focus() },
        reload: () => reloadHisonComponent(reloadId),
      }
      hisonCloser.component.dropdownList[id] = dropdownMethods.value

      document.addEventListener('mousedown', onDocMousedown)
      window.addEventListener('scroll', onScrollOrResize, true)
      window.addEventListener('resize', onScrollOrResize)

      nextTick(positionMenu)

      emit('mounted', dropdownMethods.value)
    }

    const unmount = () => {
      unregisterReloadable(reloadId)
      try { document.removeEventListener('mousedown', onDocMousedown) } catch {}
      try { window.removeEventListener('scroll', onScrollOrResize, true) } catch {}
      try { window.removeEventListener('resize', onScrollOrResize) } catch {}
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
      nextTick(positionMenu)
    }, { deep: true })

    watch(device, (newDevice) => {
      refreshResponsiveClassList()
      emit('responsive-change', newDevice)
      nextTick(positionMenu)
    })

    watch(() => props.visible, v => { if (!!v !== visible.value) visible.value = !!v })
    watch(() => props.editMode, v => { if (v && v !== editMode.value) editMode.value = v as any })
    watch(() => props.placeholder, v => { const t = v ?? ''; if (t !== placeholder.value) placeholder.value = t })
    watch(() => props.trigger, v => { if (v && v !== trigger.value) trigger.value = v as any })
    watch(() => props.textAlign, v => { if ((v === TextAlign.left || v === TextAlign.center || v === TextAlign.right) && v !== textAlign.value) { textAlign.value = v; nextTick(positionMenu) } })
    watch(() => props.animate, v => { const nv = !!v; if (nv !== animate.value) animate.value = nv })
    watch(() => props.duration, v => { const n = Number(v); if (Number.isFinite(n) && n >= 0 && n !== duration.value) duration.value = n })
    watch(() => props.easing, v => { const s = typeof v === 'string' ? v : 'ease'; if (s !== easing.value) easing.value = s })
    watch(() => props.tabIndex, v => { const nv = (v === null || v === '') ? null : Number(v); if (nv !== tabIndex.value) tabIndex.value = nv })
    watch(() => props.maxHeight, v => { const n = Number(v); if (Number.isFinite(n) && n >= 0 && n !== maxHeight.value) { maxHeight.value = n; nextTick(positionMenu) } })
    watch(() => props.closeOnSelect, v => { const nv = !!v; if (nv !== closeOnSelect.value) closeOnSelect.value = nv })
    watch(() => props.class, () => { refreshResponsiveClassList(); nextTick(positionMenu) })
    watch(() => props.zIndex, v => { const n = Number(v); if (Number.isFinite(n) && n !== zIndex.value) zIndex.value = n })

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
      fixedMenuStyle,
      openBelow,
      onToggleClick, onSelect, textAlignStyle,
      open, close, toggle
    }
  }
})
</script>

<style scoped></style>
