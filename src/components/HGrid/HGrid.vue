<template>
  <div
    ref="editorWrap"
    :class="['hison-grid', 'hison-wrapper', ...responsiveClassList, visibleClass]"
    :style="props.style"
  >
    <div data-vanillagrid v-bind="bindAttrs"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onBeforeUnmount, ref, nextTick, triggerRef, watch } from 'vue'
import type { Vanillagrid } from 'vanillagrid2'
import type { HGridColumn, HGridMethods } from '../../types'
import { gridEventProps, gridProps } from './props'
import {
    extractResponsiveClasses,
    getHexCodeFromColorText,
    getIndexSpecificClassNameFromClassList,
    getSpecificClassValueFromClassList,
    getUUID,
    registerReloadable,
    reloadHisonComponent,
    toClassString,
    unregisterReloadable
} from '../../utils'
import { hison, Size } from '../..'
import { useDevice } from '../../core'
import { InterfaceDataModel } from 'hisonjs'
import { hisonCloser } from '../../hisonCloser'

export default defineComponent({
  name: 'HGrid',
  props: {
    ...gridProps,
    ...gridEventProps
  },
  emits: ['mounted', 'responsive-change'],
  setup(props, { emit }) {
    const vg: Vanillagrid = hisonCloser.grid
    const editorWrap = ref<HTMLElement | null>(null)
    const gridInstance = ref<HGridMethods | null>(null)
    const id = props.id ? props.id : getUUID()
    const reloadId = `hgrid:${id}`
    const device = useDevice()
    const visible = ref(props.visible)
    const visibleClass = computed(() => (visible.value ? '' : 'hison-display-none'))

    const responsiveClassList = ref<string[]>([])

    const EXCLUDED_KEYS = ['columns', 'id', 'class', 'style', 'visible'] as const
    const bindAttrsTrigger = ref(0)
    const forceRecomputeBindAttrs = () => {
      triggerRef(bindAttrsTrigger)
    }
    const gridColor = ref<string>('')

    const destroyed = ref(false)
    const alive = ref(true)
    let vgInited = false

    const bindAttrs = computed(() => {
        bindAttrsTrigger.value
        const classList = extractResponsiveClasses(toClassString(props.class) || '', device.value)
        const color = getSpecificClassValueFromClassList(classList, 'color') ?? 'primary'
        const size = getSpecificClassValueFromClassList(classList, 'size')
        if (getIndexSpecificClassNameFromClassList(classList, 'col') === -1) classList.push('hison-col-12')
        responsiveClassList.value = classList

        const attrs: Record<string, string> = {}
        attrs['data-id'] = id

        for (const [key, value] of Object.entries(props)) {
            if (EXCLUDED_KEYS.includes(key as any)) continue
            if (value === undefined || value === null) continue

            attrs[key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())] = String(value)
        }

        attrs['size-level'] =
            attrs['size-level'] && hison.utils.isNumber(attrs['size-level'])
            ? String(Math.min(Math.max(Number(attrs['size-level']), 1), 9))
            : getSizeLevel(5, size)

        if (color && !attrs.color) attrs.color = color
        if (attrs.color) {
            attrs.color = getHexCodeFromColorText(attrs.color) ?? attrs.color
        }
        if (props.invertColor || hisonCloser.componentStyle.invertColor) {
            attrs['invert-color'] = 'true'
        }
        gridColor.value = attrs.color
        return attrs
    })

    const getSizeLevel = (sizeLevel: number, size: string | null) => {
        size = size ?? hisonCloser.componentStyle.size
        switch (size) {
            case Size.xs:
                sizeLevel -= 3
                break
            case Size.s:
                sizeLevel -= 2
                break
            case Size.m:
                break
            case Size.l:
                sizeLevel += 2
                break
            case Size.xl:
                sizeLevel += 3
                break
        }
        return String(Math.min(Math.max(sizeLevel, 1), 9))
    }

    const mount = () => {
        if (!alive.value) return

        unregisterReloadable(reloadId)

        registerReloadable(reloadId, () => {
            if (!alive.value) return
            unregisterReloadable(reloadId)
            unmount()
            forceRecomputeBindAttrs()
            nextTick(() => {
                if (!alive.value) return
                mount()
            })
        })

        if (!vgInited) {
            vg.init()
            vgInited = true
        }

        const root = editorWrap.value
        if (!root) return
        const gridElement = root.querySelector('[data-vanillagrid]') as HTMLElement | null
        if (!gridElement) return

        Array.from(gridElement.querySelectorAll('[data-col]')).forEach((el) => el.remove())

        props.columns!.forEach((col) => {
            const colDiv = document.createElement('div')
            colDiv.setAttribute('data-col', '')
            for (const key in col) {
            const value = col[key as keyof HGridColumn]
                if (value !== undefined && value !== null) {
                    const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
                    colDiv.setAttribute(kebabKey, String(value))
                }
            }
            gridElement.appendChild(colDiv)
        })

        vg.mountGrid(root)
        gridElement.style.border = 'none'
        gridElement.style.boxShadow = `0 0.5px 1px 0.5px ${gridColor.value}`
        const gridMethod: any = vg.getGrid(id)
        if (gridMethod) gridMethod.getId = () => {
            return id
        }
        gridInstance.value = gridMethod as HGridMethods

        if (gridInstance.value) {
            gridInstance.value.isHisonvueComponent = true
            gridInstance.value.getId = () => id
            gridInstance.value.getType = () => 'grid'
            if ('isGridVisible' in gridInstance.value) {
                delete (gridInstance.value as any).isGridVisible
            }
            if ('setGridVisible' in gridInstance.value) {
                delete (gridInstance.value as any).setGridVisible
            }
            gridInstance.value.isVisible = () => visible.value
            gridInstance.value.setVisible = (val: boolean) => {
                visible.value = val
            }
            gridInstance.value.getDataModel = () => {
                return new hison.data.DataModel(gridInstance.value!.getValues())
            }
            gridInstance.value.setDataModel = <T extends Record<string, any>>(dataModel: InterfaceDataModel<T>) => {
            if (!dataModel || dataModel.getRowCount() == 0) return
                return gridInstance.value!.load(dataModel)
            }
            gridInstance.value.reload = () => reloadHisonComponent(reloadId)
            const originGridMethodLoad = gridInstance.value.load.bind(gridInstance.value)
            gridInstance.value.load = <T extends Record<string, any>>(
                keyValueOrDatas: Record<string, any> | Record<string, any>[] | InterfaceDataModel<T>
            ) => {
                if (
                    keyValueOrDatas &&
                    (keyValueOrDatas as InterfaceDataModel).getIsDataModel &&
                    (keyValueOrDatas as InterfaceDataModel).getIsDataModel()
                ) {
                    return originGridMethodLoad((keyValueOrDatas as InterfaceDataModel<T>).getRows())
                } else {
                    return originGridMethodLoad(keyValueOrDatas)
                }
            }
        }

        if (gridInstance.value) {
            if (typeof props.activeCell === 'function') gridInstance.value.setOnActiveCell(props.activeCell)
            if (typeof props.activeCells === 'function') gridInstance.value.setOnActiveCells(props.activeCells)
            if (typeof props.activeRow === 'function') gridInstance.value.setOnActiveRow(props.activeRow)
            if (typeof props.activeRows === 'function') gridInstance.value.setOnActiveRows(props.activeRows)
            if (typeof props.activeCol === 'function') gridInstance.value.setOnActiveCol(props.activeCol)
            if (typeof props.activeCols === 'function') gridInstance.value.setOnActiveCols(props.activeCols)
            if (typeof props.beforeChange === 'function') gridInstance.value.setOnBeforeChange(props.beforeChange)
            if (typeof props.afterChange === 'function') gridInstance.value.setOnAfterChange(props.afterChange)
            if (typeof props.beforeClickCell === 'function') gridInstance.value.setOnBeforeClickCell(props.beforeClickCell)
            if (typeof props.afterClickCell === 'function') gridInstance.value.setOnAfterClickCell(props.afterClickCell)
            if (typeof props.clickSelect === 'function') gridInstance.value.setOnClickSelect(props.clickSelect)
            if (typeof props.clickCheckbox === 'function') gridInstance.value.setOnClickCheckbox(props.clickCheckbox)
            if (typeof props.clickButton === 'function') gridInstance.value.setOnClickButton(props.clickButton)
            if (typeof props.clickLink === 'function') gridInstance.value.setOnClickLink(props.clickLink)
            if (typeof props.beforeDblClickCell === 'function') gridInstance.value.setOnBeforeDblClickCell(props.beforeDblClickCell)
            if (typeof props.afterDblClickCell === 'function') gridInstance.value.setOnAfterDblClickCell(props.afterDblClickCell)
            if (typeof props.beforeClickHeader === 'function') gridInstance.value.setOnBeforeClickHeader(props.beforeClickHeader)
            if (typeof props.afterClickHeader === 'function') gridInstance.value.setOnAfterClickHeader(props.afterClickHeader)
            if (typeof props.beforeDblClickHeader === 'function') gridInstance.value.setOnBeforeDblClickHeader(props.beforeDblClickHeader)
            if (typeof props.afterDblClickHeader === 'function') gridInstance.value.setOnAfterDblClickHeader(props.afterDblClickHeader)
            if (typeof props.beforeEditEnter === 'function') gridInstance.value.setOnBeforeEditEnter(props.beforeEditEnter)
            if (typeof props.afterEditEnter === 'function') gridInstance.value.setOnAfterEditEnter(props.afterEditEnter)
            if (typeof props.editEnding === 'function') gridInstance.value.setOnEditEnding(props.editEnding)
            if (typeof props.clickFilter === 'function') gridInstance.value.setOnClickFilter(props.clickFilter)
            if (typeof props.chooseFilter === 'function') gridInstance.value.setOnChooseFilter(props.chooseFilter)
            if (typeof props.paste === 'function') gridInstance.value.setOnPaste(props.paste)
            if (typeof props.copy === 'function') gridInstance.value.setOnCopy(props.copy)
            if (typeof props.resize === 'function') gridInstance.value.setOnResize(props.resize)
            if (typeof props.keydownEditor === 'function') gridInstance.value.setOnKeydownEditor(props.keydownEditor)
            if (typeof props.inputEditor === 'function') gridInstance.value.setOnInputEditor(props.inputEditor)
            if (typeof props.keydownGrid === 'function') gridInstance.value.setOnKeydownGrid(props.keydownGrid)
        }

        destroyed.value = false
        ;(root as any).__hgridDestroyed = false

        emit('mounted', gridInstance.value)
    }

    const unmount = () => {
        unregisterReloadable(reloadId)
        const root = editorWrap.value
        if (!root || destroyed.value) return
        if (!(root as any).isConnected) {
            destroyed.value = true
            return
        }
        try {
            vg.unmountGrid(root)
        } catch (e) {
            console.warn('[HGrid] unmountGrid skipped:', e)
        }
        destroyed.value = true
        ;(root as any).__hgridDestroyed = true
        gridInstance.value = null
    }

    onMounted(mount)

    onBeforeUnmount(() => {
        alive.value = false
        unmount()
    })

    watch(device, (newDevice) => {
        if (destroyed.value) return
        const grid: any = gridInstance.value
        if (!grid) return
        if (typeof grid.setGridSizeLevel !== 'function') return

        const classList = extractResponsiveClasses(toClassString(props.class) || '', device.value)
        const color = getSpecificClassValueFromClassList(classList, 'color')
        const size = getSpecificClassValueFromClassList(classList, 'size')

        const sizeLevel =
            props.sizeLevel && hison.utils.isNumber(String(props.sizeLevel))
            ? String(Math.min(Math.max(Number(props.sizeLevel), 1), 9))
            : getSizeLevel(5, size)
        grid.setGridSizeLevel(Number(sizeLevel))

        let hexColor = ''
        if (color && !props.color) hexColor = color
        if (hexColor) {
            hexColor = getHexCodeFromColorText(hexColor) ?? hexColor
            if (typeof grid.setGridColor === 'function') {
                grid.setGridColor(hexColor)
            }
            if (props.invertColor || hisonCloser.componentStyle.invertColor) {
                if (typeof grid.invertColor === 'function') {
                    grid.invertColor(true)
                }
            }
        }
        emit('responsive-change', newDevice)
    })

    watch(
        () => props.visible,
        (v) => {
            const nv = !!v
            if (nv !== visible.value) visible.value = nv
        }
    )
    watch(
        () => props.class,
        () => {
            forceRecomputeBindAttrs()
        }
    )

    return {
        editorWrap,
        props,
        bindAttrs,
        responsiveClassList,
        visibleClass
    }
  }
})
</script>

<style scoped></style>