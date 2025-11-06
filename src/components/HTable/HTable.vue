<template>
  <div
    :class="[
      'hison-wrapper',
      ...responsiveClassList,
      visibleClass
    ]"
  >
    <table
      ref="tableRef"
      :class="[
        'hison-table',
        borderClass,
        tableBackgroundTypeClass,
        stripedClass,
        hoverableClass,
      ]"
      :style="props.style"
    >
      <caption v-if="$slots.caption || caption" class="hison-table-caption">
        <slot name="caption">{{ caption }}</slot>
      </caption>

      <slot name="colgroup" />

      <thead
        v-if="$slots.thead"
        ref="theadRef"
        :class="[
          headerBorderTopClass,
          headerBorderBottomClass,
          headerBorderLeftClass,
          headerBorderRightClass,
          headerTextAlignClass,
          headerVAlignClass,
        ]"
      >
        <slot name="thead" />
      </thead>

      <tbody
        ref="tbodyRef"
        :class="[
          bodyBorderTopClass,
          bodyBorderBottomClass,
          bodyBorderLeftClass,
          bodyBorderRightClass,
          bodyTextAlignClass,
          bodyVAlignClass,
        ]"
      >
        <slot />
      </tbody>

      <tfoot
        v-if="$slots.tfoot"
        ref="tfootRef"
        :class="[
          footerBorderTopClass,
          footerBorderBottomClass,
          footerBorderLeftClass,
          footerBorderRightClass,
          footerTextAlignClass,
          footerVAlignClass,
        ]"
      >
        <slot name="tfoot" />
      </tfoot>
    </table>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, onMounted, onBeforeUnmount, watch, nextTick
} from 'vue'
import { tableProps } from './props'
import type { HTableMethods } from '../../types'
import { BackgroundType, type BackgroundTypeValue, TextAlignValue, VerticalAlignValue } from '../..'
import { hisonCloser } from '../../hisonCloser'
import {
  extractResponsiveClasses, getUUID, addComponentNameToClass,
  registerReloadable, reloadHisonComponent, toClassString, unregisterReloadable
} from '../../utils'
import { useDevice } from '../../core'

type ClassLike = string | string[] | Record<string, boolean>

export default defineComponent({
  name: 'HTable',
  props: tableProps,
  inheritAttrs: false,
  emits: ['mounted', 'responsive-change'],
  setup(props, { emit }) {
    const tableRef = ref<HTMLTableElement | null>(null)
    const theadRef = ref<HTMLTableSectionElement | null>(null)
    const tbodyRef = ref<HTMLTableSectionElement | null>(null)
    const tfootRef = ref<HTMLTableSectionElement | null>(null)

    const id = props.id ? props.id : getUUID()
    const reloadId = `htable:${id}`
    const device = useDevice()

    const tableMethods = ref<HTableMethods | null>(null)

    const visible = ref<boolean>(props.visible)
    const visibleClass = computed(() => (visible.value ? '' : 'hison-display-none'))

    const caption = ref<string>(props.caption || '')

    const border = ref<boolean>(!!props.border)
    const stripedMode = ref<'row'|'col'|'none'>(props.striped ?? 'row')
    const hoverMode   = ref<'row'|'col'|'none'>(props.hoverable ?? 'row')

    const backgroundType = ref<BackgroundTypeValue>(props.backgroundType || BackgroundType.empty)

    const headerBorderTop = ref<boolean>(!!props.headerBorderTop)
    const headerBorderBottom = ref<boolean>(!!props.headerBorderBottom)
    const headerBorderLeft = ref<boolean>(!!props.headerBorderLeft)
    const headerBorderRight = ref<boolean>(!!props.headerBorderRight)
    const bodyBorderTop   = ref<boolean>(!!props.bodyBorderTop)
    const bodyBorderBottom   = ref<boolean>(!!props.bodyBorderBottom)
    const bodyBorderLeft   = ref<boolean>(!!props.bodyBorderLeft)
    const bodyBorderRight   = ref<boolean>(!!props.bodyBorderRight)
    const footerBorderTop = ref<boolean>(!!props.footerBorderTop)
    const footerBorderBottom = ref<boolean>(!!props.footerBorderBottom)
    const footerBorderLeft = ref<boolean>(!!props.footerBorderLeft)
    const footerBorderRight = ref<boolean>(!!props.footerBorderRight)

    const headerTextAlign = ref(props.headerTextAlign)
    const bodyTextAlign   = ref(props.bodyTextAlign)
    const footerTextAlign = ref(props.footerTextAlign)

    const headerVerticalAlign = ref(props.headerVerticalAlign)
    const bodyVerticalAlign   = ref(props.bodyVerticalAlign)
    const footerVerticalAlign = ref(props.footerVerticalAlign)

    const borderClass = computed(() => (border.value ? 'hison-border' : ''))
    const tableBackgroundTypeClass = computed(() => {
      switch (backgroundType.value) {
        case BackgroundType.empty: return 'hison-bg-empty'
        case BackgroundType.transparent: return 'hison-bg-transparent'
        default: return 'hison-bg-filled'
      }
    })

    const stripedClass = computed(() =>
      stripedMode.value === 'row' ? 'is-striped-row' : stripedMode.value === 'col' ? 'is-striped-col' : null
    )
    const hoverableClass = computed(() =>
      hoverMode.value === 'row' ? 'is-hover-row' : hoverMode.value === 'col' ? 'is-hover-col' : null
    )

    const headerBorderTopClass = computed(() => (headerBorderTop.value ? 'hison-header-border-top' : ''))
    const headerBorderBottomClass = computed(() => (headerBorderBottom.value ? 'hison-header-border-bottom' : ''))
    const headerBorderLeftClass = computed(() => (headerBorderLeft.value ? 'hison-header-border-left' : ''))
    const headerBorderRightClass = computed(() => (headerBorderRight.value ? 'hison-header-border-right' : ''))

    const bodyBorderTopClass = computed(() => (bodyBorderTop.value ? 'hison-body-border-top' : ''))
    const bodyBorderBottomClass = computed(() => (bodyBorderBottom.value ? 'hison-body-border-bottom' : ''))
    const bodyBorderLeftClass = computed(() => (bodyBorderLeft.value ? 'hison-body-border-left' : ''))
    const bodyBorderRightClass = computed(() => (bodyBorderRight.value ? 'hison-body-border-right' : ''))

    const footerBorderTopClass = computed(() => (footerBorderTop.value ? 'hison-footer-border-top' : ''))
    const footerBorderBottomClass = computed(() => (footerBorderBottom.value ? 'hison-footer-border-bottom' : ''))
    const footerBorderLeftClass = computed(() => (footerBorderLeft.value ? 'hison-footer-border-left' : ''))
    const footerBorderRightClass = computed(() => (footerBorderRight.value ? 'hison-footer-border-right' : ''))


    const sectionTAClass = (section: 'thead'|'tbody'|'tfoot', ta: any) => {
      const prefix = section === 'thead' ? 'hison-thead' : section === 'tbody' ? 'hison-tbody' : 'hison-tfoot'
      switch (ta) {
        case 'center': return `${prefix}-ta-center`
        case 'right': return `${prefix}-ta-right`
        default: return `${prefix}-ta-left`
      }
    }
    const sectionVAClass = (section: 'thead'|'tbody'|'tfoot', va: any) => {
      const prefix = section === 'thead' ? 'hison-thead' : section === 'tbody' ? 'hison-tbody' : 'hison-tfoot'
      switch (va) {
        case 'top': return `${prefix}-valign-top`
        case 'bottom': return `${prefix}-valign-bottom`
        default: return `${prefix}-valign-middle`
      }
    }

    const headerTextAlignClass= computed(() => sectionTAClass('thead', headerTextAlign.value))
    const bodyTextAlignClass = computed(() => sectionTAClass('tbody', bodyTextAlign.value))
    const footerTextAlignClass= computed(() => sectionTAClass('tfoot', footerTextAlign.value))

    const headerVAlignClass = computed(() => sectionVAClass('thead', headerVerticalAlign.value))
    const bodyVAlignClass = computed(() => sectionVAClass('tbody', bodyVerticalAlign.value))
    const footerVAlignClass = computed(() => sectionVAClass('tfoot', footerVerticalAlign.value))

    const responsiveClassList = ref<string[]>([])
    const refreshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
      addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
    }

    let lastCol = -1
    const clearColHover = () => {
      const tb = tbodyRef.value
      if (!tb) return
      tb.querySelectorAll('td.is-col-hover-cell').forEach(td => td.classList.remove('is-col-hover-cell'))
      lastCol = -1
    }
    const applyColHover = (colIdx: number) => {
      const tb = tbodyRef.value
      if (!tb) return
      clearColHover()
      tb.querySelectorAll('tr').forEach(tr => {
        const td = tr.querySelectorAll('td')[colIdx]
        if (td) td.classList.add('is-col-hover-cell')
      })
      lastCol = colIdx
    }

    const onBodyMouseOver = (e: MouseEvent) => {
      if (hoverMode.value !== 'col') return
      const target = e.target as HTMLElement
      if (!target || target.tagName !== 'TD') return
      const td = target as HTMLTableCellElement
      const colIdx = td.cellIndex // 0-based
      if (colIdx !== lastCol) applyColHover(colIdx)
    }
    const onBodyMouseLeave = () => {
      if (hoverMode.value !== 'col') return
      clearColHover()
    }
    
    const toKebab = (key: string) =>
      key.replace(/[A-Z]/g, m => '-' + m.toLowerCase()).replace(/^ms-/, '-ms-')

    const normalizeClass = (cls?: ClassLike | null): string[] => {
      if (!cls) return []
      if (typeof cls === 'string') return cls.trim().split(/\s+/).filter(Boolean)
      if (Array.isArray(cls)) return cls.flatMap(normalizeClass)
      return Object.entries(cls).filter(([, on]) => !!on).map(([k]) => k)
    }

    const normalizeStyleList = (styleInput?: any): Array<Record<string, any>> => {
      if (!styleInput) return []
      if (typeof styleInput === 'string') {
        const map: Record<string, string> = {}
        styleInput.split(';').forEach(pair => {
          const [k, v] = pair.split(':')
          if (!k || !v) return
          map[k.trim()] = v.trim()
        })
        return [map]
      }
      if (Array.isArray(styleInput)) return styleInput.filter(Boolean)
      if (typeof styleInput === 'object') return [styleInput]
      return []
    }

    const mergeStylePreferUser = (el: HTMLElement, styleInput?: any) => {
      const list = normalizeStyleList(styleInput)
      if (!list.length) return
      for (const styleMap of list) {
        for (const [k, v] of Object.entries(styleMap)) {
          if (v == null || v === '') continue
          const name = toKebab(k)
          if (el.style.getPropertyValue(name)) continue
          el.style.setProperty(name, String(v))
        }
      }
    }

    const mergeClass = (el: HTMLElement, classInput?: ClassLike | null) => {
      const classes = normalizeClass(classInput)
      if (classes.length) el.classList.add(...classes)
    }

    const applyHeaderBulk = () => {
      const thead = theadRef.value
      if (!thead) return
      const ths = Array.from(thead.querySelectorAll('th'))
      ths.forEach(th => {
        mergeClass(th as HTMLElement, props.headerCellClass)
        mergeStylePreferUser(th as HTMLElement, props.headerCellStyle)
      })
    }

    const applyBodyBulk = () => {
      const tbody = tbodyRef.value
      if (!tbody) return
      const tds = Array.from(tbody.querySelectorAll('td'))
      tds.forEach(td => {
        mergeClass(td as HTMLElement, props.bodyCellClass)
        mergeStylePreferUser(td as HTMLElement, props.bodyCellStyle)
      })
    }

    const applyFooterBulk = () => {
      const tfoot = tfootRef.value
      if (!tfoot) return
      const tds = Array.from(tfoot.querySelectorAll('td'))
      tds.forEach(td => {
        mergeClass(td as HTMLElement, props.footerCellClass)
        mergeStylePreferUser(td as HTMLElement, props.footerCellStyle)
      })
    }

    const mount = async () => {
      if (hisonCloser.component.tableList[id] && hisonCloser.component.tableList[id].isHisonvueComponent) console.warn(`[Hisonvue] The table ID is at risk of being duplicated. ${id}`)

      registerReloadable(reloadId, () => {
        unmount()
        setTimeout(mount)
      })
      refreshResponsiveClassList()

      if (tbodyRef.value) {
        tbodyRef.value.addEventListener('mouseover', onBodyMouseOver)
        tbodyRef.value.addEventListener('mouseleave', onBodyMouseLeave)
      }

      await nextTick()
      applyHeaderBulk()
      applyBodyBulk()
      applyFooterBulk()

      tableMethods.value = {
        isHisonvueComponent: true,
        getId: () => id,
        getType: () => 'table',
        isVisible: () => visible.value,
        setVisible: (v: boolean) => { visible.value = v },
        isBorder: () => border.value,
        setBorder: (v: boolean) => { border.value = v },
        isHeaderBorderTop:     () => headerBorderTop.value,
        setHeaderBorderTop:    (v: boolean) => { headerBorderTop.value = v },
        isHeaderBorderBottom:  () => headerBorderBottom.value,
        setHeaderBorderBottom: (v: boolean) => { headerBorderBottom.value = v },
        isHeaderBorderLeft:    () => headerBorderLeft.value,
        setHeaderBorderLeft:   (v: boolean) => { headerBorderLeft.value = v },
        isHeaderBorderRight:   () => headerBorderRight.value,
        setHeaderBorderRight:  (v: boolean) => { headerBorderRight.value = v },
        isBodyBorderTop:       () => bodyBorderTop.value,
        setBodyBorderTop:      (v: boolean) => { bodyBorderTop.value = v },
        isBodyBorderBottom:    () => bodyBorderBottom.value,
        setBodyBorderBottom:   (v: boolean) => { bodyBorderBottom.value = v },
        isBodyBorderLeft:      () => bodyBorderLeft.value,
        setBodyBorderLeft:     (v: boolean) => { bodyBorderLeft.value = v },
        isBodyBorderRight:     () => bodyBorderRight.value,
        setBodyBorderRight:    (v: boolean) => { bodyBorderRight.value = v },
        isFooterBorderTop:     () => footerBorderTop.value,
        setFooterBorderTop:    (v: boolean) => { footerBorderTop.value = v },
        isFooterBorderBottom:  () => footerBorderBottom.value,
        setFooterBorderBottom: (v: boolean) => { footerBorderBottom.value = v },
        isFooterBorderLeft:    () => footerBorderLeft.value,
        setFooterBorderLeft:   (v: boolean) => { footerBorderLeft.value = v },
        isFooterBorderRight:   () => footerBorderRight.value,
        setFooterBorderRight:  (v: boolean) => { footerBorderRight.value = v },
        getStriped: () => stripedMode.value,
        setStriped: (v: 'row'|'col'|'none') => { stripedMode.value = v },
        getHoverable: () => hoverMode.value,
        setHoverable: (v: 'row'|'col'|'none') => { hoverMode.value = v },
        getCaption: () => caption.value,
        setCaption: (t: string) => { caption.value = t },
        getBackgroundType: () => backgroundType.value,
        setBackgroundType: (t: BackgroundTypeValue) => { backgroundType.value = t },
        getHeaderTextAlign: () => headerTextAlign.value,
        setHeaderTextAlign: (v: TextAlignValue) => { headerTextAlign.value = v },
        getBodyTextAlign: () => bodyTextAlign.value,
        setBodyTextAlign: (v: TextAlignValue) => { bodyTextAlign.value = v },
        getFooterTextAlign: () => footerTextAlign.value,
        setFooterTextAlign: (v: TextAlignValue) => { footerTextAlign.value = v },
        getHeaderVerticalAlign: () => headerVerticalAlign.value,
        setHeaderVerticalAlign: (v: VerticalAlignValue) => { headerVerticalAlign.value = v },
        getBodyVerticalAlign: () => bodyVerticalAlign.value,
        setBodyVerticalAlign: (v: VerticalAlignValue) => { bodyVerticalAlign.value = v },
        getFooterVerticalAlign: () => footerVerticalAlign.value,
        setFooterVerticalAlign: (v: VerticalAlignValue) => { footerVerticalAlign.value = v },
        getRowCount: () => {
          const tb = tbodyRef.value
          return tb ? tb.querySelectorAll(':scope > tr').length : 0
        },
        getRowElement: (index: number) => {
          const tb = tbodyRef.value
          if (!tb || !Number.isInteger(index) || index < 0) return null
          const rows = tb.querySelectorAll(':scope > tr')
          return index >= rows.length ? null : (rows[index] as HTMLTableRowElement)
        },
        getHeadElement: () => theadRef.value,
        getBodyElement: () => tbodyRef.value,
        getFootElement: () => tfootRef.value,
        reload: () => reloadHisonComponent(reloadId),
      }

      hisonCloser.component.tableList[id] = tableMethods.value
      emit('mounted', tableMethods.value)
    }

    const unmount = () => {
      if (tbodyRef.value) {
        tbodyRef.value.removeEventListener('mouseover', onBodyMouseOver)
        tbodyRef.value.removeEventListener('mouseleave', onBodyMouseLeave)
      }
      unregisterReloadable(reloadId)
      delete hisonCloser.component.tableList[id]
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(device, (d) => {
      refreshResponsiveClassList()
      emit('responsive-change', d)
    })

    watch(() => props.visible, v => { const b = !!v; if (b !== visible.value) visible.value = b })
    watch(() => props.caption, v => { const t = v ?? ''; if (t !== caption.value) caption.value = t })
    watch(() => props.border, v => { const b = !!v; if (b !== border.value) border.value = b })
    watch(() => props.backgroundType, v => { if (v && v !== backgroundType.value) backgroundType.value = v as any })
    watch(() => props.striped, v => {
      const nv = (v ?? 'row') as 'row'|'col'|'none'
      if (nv !== stripedMode.value) stripedMode.value = nv
    })
    watch(() => props.hoverable, v => {
      const nv = (v ?? 'row') as 'row'|'col'|'none'
      if (nv !== hoverMode.value) hoverMode.value = nv
    })
    watch(() => props.headerBorderTop,    v => { const b = !!v; if (b !== headerBorderTop.value)    headerBorderTop.value = b })
    watch(() => props.headerBorderBottom, v => { const b = !!v; if (b !== headerBorderBottom.value) headerBorderBottom.value = b })
    watch(() => props.headerBorderLeft,   v => { const b = !!v; if (b !== headerBorderLeft.value)   headerBorderLeft.value = b })
    watch(() => props.headerBorderRight,  v => { const b = !!v; if (b !== headerBorderRight.value)  headerBorderRight.value = b })
    watch(() => props.bodyBorderTop,      v => { const b = !!v; if (b !== bodyBorderTop.value)      bodyBorderTop.value = b })
    watch(() => props.bodyBorderBottom,   v => { const b = !!v; if (b !== bodyBorderBottom.value)   bodyBorderBottom.value = b })
    watch(() => props.bodyBorderLeft,     v => { const b = !!v; if (b !== bodyBorderLeft.value)     bodyBorderLeft.value = b })
    watch(() => props.bodyBorderRight,    v => { const b = !!v; if (b !== bodyBorderRight.value)    bodyBorderRight.value = b })
    watch(() => props.footerBorderTop,    v => { const b = !!v; if (b !== footerBorderTop.value)    footerBorderTop.value = b })
    watch(() => props.footerBorderBottom, v => { const b = !!v; if (b !== footerBorderBottom.value) footerBorderBottom.value = b })
    watch(() => props.footerBorderLeft,   v => { const b = !!v; if (b !== footerBorderLeft.value)   footerBorderLeft.value = b })
    watch(() => props.footerBorderRight,  v => { const b = !!v; if (b !== footerBorderRight.value)  footerBorderRight.value = b })
    watch(() => props.headerTextAlign, v => { if (v && v !== headerTextAlign.value) headerTextAlign.value = v as any })
    watch(() => props.bodyTextAlign,   v => { if (v && v !== bodyTextAlign.value)   bodyTextAlign.value   = v as any })
    watch(() => props.footerTextAlign, v => { if (v && v !== footerTextAlign.value) footerTextAlign.value = v as any })
    watch(() => props.headerVerticalAlign, v => { if (v && v !== headerVerticalAlign.value) headerVerticalAlign.value = v as any })
    watch(() => props.bodyVerticalAlign,   v => { if (v && v !== bodyVerticalAlign.value)   bodyVerticalAlign.value   = v as any })
    watch(() => props.footerVerticalAlign, v => { if (v && v !== footerVerticalAlign.value) footerVerticalAlign.value = v as any })
    watch(() => props.headerCellClass, () => nextTick(applyHeaderBulk))
    watch(() => props.headerCellStyle, () => nextTick(applyHeaderBulk))
    watch(() => props.bodyCellClass,   () => nextTick(applyBodyBulk))
    watch(() => props.bodyCellStyle,   () => nextTick(applyBodyBulk))
    watch(() => props.footerCellClass, () => nextTick(applyFooterBulk))
    watch(() => props.footerCellStyle, () => nextTick(applyFooterBulk))
    watch(() => props.class, () => { refreshResponsiveClassList() })

    return {
      props,
      tableRef,
      theadRef,
      tbodyRef,
      tfootRef,

      visibleClass,
      stripedClass,
      hoverableClass,
      caption,
      border,

      borderClass,
      tableBackgroundTypeClass,
      responsiveClassList,

      headerBorderTopClass, bodyBorderTopClass, footerBorderTopClass,
      headerBorderBottomClass, bodyBorderBottomClass, footerBorderBottomClass,
      headerBorderLeftClass, bodyBorderLeftClass, footerBorderLeftClass,
      headerBorderRightClass, bodyBorderRightClass, footerBorderRightClass,
      headerTextAlignClass, bodyTextAlignClass, footerTextAlignClass,
      headerVAlignClass, bodyVAlignClass, footerVAlignClass,
    }
  }
})
</script>

<style scoped></style>
