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
      ref="listRef"
      :class="[
        'hison-list',
        borderClass,
        backgroundTypeClass
      ]"
      :style="props.style"
      @keydown.stop.enter.prevent="onItemClick"
      @keydown.stop.space.prevent="onItemClick"
    >
      <template v-if="hasElementSlot">
        <li
          v-for="(node, i) in elementNodes"
          :key="i"
          :class="[
            'hison-list-item',
            listBorderClass,
            listBackgroundTypeClass
          ]"
          :style="props.listItemStyle"
          :ref="setItemRef"
          :tabindex="tabIndex ?? undefined"
          @click.stop="onItemClick"
          @mousedown.stop="emitItem('mousedown', $event)"
          @mouseup.stop="emitItem('mouseup', $event)"
          @mouseover.stop="emitItem('mouseover', $event)"
          @mouseout.stop="emitItem('mouseout', $event)"
        >
          <div
            class="hison-list-item-inner"
            :style="props.listItemInnerStyle"
            :ref="setItemInnerRef"
          >
            <div v-if="showMarker" class="hison-list-marker">
              <span v-if="listType==='ol'">{{ i + 1 }}.</span>
              <span v-else>{{ bulletChar }}</span>
            </div>
            <div class="hison-list-content">
              <component :is="node" />
            </div>
          </div>
        </li>
      </template>

      <template v-else>
        <li
          v-for="(item, i) in normalizedItems"
          :key="i"
          :class="[
            'hison-list-item',
            listBorderClass,
            listBackgroundTypeClass
          ]"
          :ref="setItemRef"
          :tabindex="tabIndex ?? undefined"
          @click.stop="onItemClick"
          @mousedown.stop="emitItem('mousedown', $event)"
          @mouseup.stop="emitItem('mouseup', $event)"
          @mouseover.stop="emitItem('mouseover', $event)"
          @mouseout.stop="emitItem('mouseout', $event)"
        >
          <div
            class="hison-list-item-inner"
            :style="props.listItemInnerStyle"
            :ref="setItemInnerRef"
          >
            <div v-if="showMarker" class="hison-list-marker">
              <span v-if="listType==='ol'">{{ i + 1 }}.</span>
              <span v-else>{{ bulletChar }}</span>
            </div>

            <div class="hison-list-content">
              <template v-if="$slots.item">
                <slot name="item" :item="item" :index="i" />
              </template>
              <template v-else>
                <span class="hison-list-item-text">{{ String(item ?? '') }}</span>
              </template>
            </div>
          </div>
        </li>
      </template>
    </component>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, onMounted, onBeforeUnmount, nextTick, Text, Comment, Fragment, type VNode,
  watch, type ComponentPublicInstance
} from 'vue'
import { listProps } from './props'
import type { HListMethods } from '../../types'
import { BackgroundType, type BackgroundTypeValue, hisonCloser } from '../..'
import {
  extractResponsiveClasses, getUUID, addComponentNameToClass,
  registerReloadable, reloadHisonComponent, toClassString, unregisterReloadable
} from '../../utils'
import { useDevice } from '../../core'
import { addButtonCssEvent, removeButtonCssEvent } from '../common/setButtonCssEvent'

export default defineComponent({
  name: 'HList',
  props: listProps,
  inheritAttrs: false,
  emits: ['mounted', 'responsive-change', 'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout'],
  setup(props, { emit, slots }) {
    const listRef = ref<HTMLElement | null>(null)
    const itemRefs = ref<HTMLElement[]>([])
    const itemInnerRefs = ref<HTMLElement[]>([])

    const id = props.id ? props.id : getUUID()
    const reloadId = `hlist:${id}`
    const device = useDevice()

    const listMethods = ref<HListMethods | null>(null)

    const visible = ref<boolean>(props.visible)
    const visibleClass = computed(() => (visible.value ? '' : 'hison-display-none'))

    const listType = ref<'ul'|'ol'>(props.listType || 'ul')
    const bulletChar = ref<string>(props.bulletChar || '•')
    const showMarker = ref<boolean>(props.showMarker !== false)

    const border = ref<boolean>(props.border ?? false)
    const listBorder = ref<boolean>(props.listBorder ?? false)
    const backgroundType = ref<BackgroundTypeValue>(props.backgroundType || BackgroundType.empty)
    const listBackgroundType = ref<BackgroundTypeValue>(props.listBackgroundType || BackgroundType.empty)

    const addEventEnabled = ref<boolean>(!!props.addEvent)

    const borderClass = computed(() => (border.value ? 'hison-border' : ''))
    const listBorderClass = computed(() => (listBorder.value ? 'hison-border' : ''))
    const backgroundTypeClass = computed(() => {
      switch (backgroundType.value) {
        case BackgroundType.empty: return 'hison-bg-empty'
        case BackgroundType.transparent: return 'hison-bg-transparent'
        default: return 'hison-bg-filled'
      }
    })
    const listBackgroundTypeClass = computed(() => {
      switch (listBackgroundType.value) {
        case BackgroundType.empty: return 'hison-bg-empty'
        case BackgroundType.transparent: return 'hison-bg-transparent'
        default: return 'hison-bg-filled'
      }
    })

    const defaultNodes = computed(() => slots.default?.() ?? [])
    const tabIndex = ref<number | null>(
      props.tabIndex !== null && props.tabIndex !== '' ? Number(props.tabIndex) : null
    )

    const flattenElements = (nodes: VNode[] | undefined, out: VNode[] = []): VNode[] => {
      if (!nodes || nodes.length === 0) return out
      for (const n of nodes) {
        if (n.type === Comment) continue
        if (n.type === Text) continue
        if (n.type === Fragment) {
          const children = (n.children as any) as VNode[] | undefined
          flattenElements(children, out)
        } else {
          out.push(n)
        }
      }
      return out
    }

    const elementNodes = computed(() => flattenElements(defaultNodes.value))
    const hasElementSlot = computed(() => elementNodes.value.length > 0)

    const internalItems = ref<Array<string | number>>(
      Array.isArray(props.textList) ? props.textList : []
    )
    const normalizedItems = computed(() => internalItems.value ?? [])

    const renderTag = computed<'ul'|'ol'>(() => listType.value)

    const responsiveClassList = ref<string[]>([])
    const refreshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
      addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
    }

    const attachItemCssEvents = (add = true) => {
      nextTick(() => {
        itemRefs.value.forEach(el => {
          if (!el) return
          removeButtonCssEvent(el)
          if (add && addEventEnabled.value)
            addButtonCssEvent(el)
        })
      })
    }

    const onItemClick = (e: MouseEvent) => {
      if (!addEventEnabled.value) return
      emit('click', e, listMethods.value!)
    }
    const emitItem = (name: 'mousedown'|'mouseup'|'mouseover'|'mouseout', e: MouseEvent) => {
      if (!addEventEnabled.value) return
      emit(name, e, listMethods.value!)
    }

    const mount = () => {
      if (hisonCloser.component.listList[id]) throw new Error(`[Hisonvue] list id attribute was duplicated.`)

      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })

      refreshResponsiveClassList()
      attachItemCssEvents(true)

      listMethods.value = {
        getId: () => id,
        getType: () => 'list',
        isVisible: () => visible.value,
        setVisible: (v: boolean) => { visible.value = v },
        getListType: () => listType.value,
        setListType: (t: 'ul'|'ol') => { listType.value = t },
        isShowMarker: () => showMarker.value,
        setShowMarker: (v: boolean) => { showMarker.value = v },
        getBulletChar: () => bulletChar.value,
        setBulletChar: (ch: string) => { bulletChar.value = ch },
        isBorder: () => border.value,
        setBorder: (v: boolean) => { border.value = v },
        isListBorder: () => listBorder.value,
        setListBorder: (v: boolean) => { listBorder.value = v },
        getBackgroundType: () => backgroundType.value,
        setBackgroundType: (t: BackgroundTypeValue) => { backgroundType.value = t },
        getListBackgroundType: () => listBackgroundType.value,
        setListBackgroundType: (t: BackgroundTypeValue) => { listBackgroundType.value = t },
        getTextList: () => [...normalizedItems.value],
        setTextList: (arr: Array<string | number>) => { internalItems.value = Array.isArray(arr) ? arr : [] },
        isAddEvent: () => addEventEnabled.value,
        setAddEvent: (v: boolean) => {
          addEventEnabled.value = !!v
          attachItemCssEvents(true)
        },
        getTabIndex: () => tabIndex.value,
        setTabIndex: (v: number | null) => {
          tabIndex.value = v !== null && v !== undefined ? Number(v) : null
        },
        getListRowCount: () => itemRefs.value.length,
        getListItem: (index: number) => {
          if (!Number.isInteger(index) || index < 0 || index >= itemRefs.value.length) {
            return null
          }
          return itemRefs.value[index] ?? null
        },
        focus: (index: number = 0) => {
          if (!addEventEnabled.value) return
          const ti = tabIndex.value
          if (ti == null || ti === -1) return
          if (!Number.isInteger(index) || index < 0 || index >= itemRefs.value.length) return
          const el = itemRefs.value[index]
          el?.focus?.()
        },
        reload: () => reloadHisonComponent(reloadId),
      }

      hisonCloser.component.listList[id] = listMethods.value
      emit('mounted', listMethods.value)
    }

    const unmount = () => {
      unregisterReloadable(reloadId)
      itemRefs.value.forEach(el => el && removeButtonCssEvent(el))
      if (hisonCloser.component.listList) delete hisonCloser.component.listList[id]
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    const stop1 = watch(device, (d) => {
      refreshResponsiveClassList()
      emit('responsive-change', d)
    })

    const toHTMLElement = (v: Element | ComponentPublicInstance | null): HTMLElement | null => {
      if (!v) return null
      if (v instanceof Element) return v as HTMLElement
      const root = (v as ComponentPublicInstance).$el as Element | undefined
      return root instanceof Element ? (root as HTMLElement) : null
    }

    const setItemRef = (el: Element | ComponentPublicInstance | null) => {
      const html = toHTMLElement(el)
      if (!html) return
      if (!itemRefs.value.includes(html)) itemRefs.value.push(html)
    }
    const setItemInnerRef = (el: Element | ComponentPublicInstance | null) => {
      const html = toHTMLElement(el)
      if (!html) return
      if (!itemInnerRefs.value.includes(html)) itemInnerRefs.value.push(html)
    }

    return {
      props,
      listRef,
      itemRefs,
      itemInnerRefs,
      renderTag,
      listType,
      bulletChar,
      showMarker,
      visibleClass,
      borderClass,
      listBorderClass,
      backgroundTypeClass,
      listBackgroundTypeClass,
      responsiveClassList,
      hasElementSlot,
      elementNodes,
      normalizedItems,
      tabIndex,
      setItemRef,
      setItemInnerRef,
      onItemClick,
      emitItem
    }
  }
})
</script>

<style scoped></style>
