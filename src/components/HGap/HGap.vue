<template>
    <div
        :class="[
        'hison-wrapper',
        ...responsiveClassList,
        visibleClass
        ]"
    >
        <div
        ref="gapRef"
        :class="[
            'hison-gap',
            borderClass,
            backgroundTypeClass
        ]"
        :style="props.style"
        >
            <div v-if="line === 'horizontal'" class="hison-gap-line-horizontal" :style="horizontalStyle" />
            <div v-else-if="line === 'vertical'"   class="hison-gap-line-vertical"   :style="verticalStyle" />
        </div>
    </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, onMounted, onBeforeUnmount, nextTick, watch
} from 'vue'
import { gapProps } from './props'
import { BackgroundType, type BackgroundTypeValue, HGapLineStyle, HGapLineStyleValue } from '../..'
import {
  extractResponsiveClasses,
  getUUID,
  addComponentNameToClass,
  registerReloadable,
  reloadHisonComponent,
  toClassString,
  unregisterReloadable,
  getIndexSpecificClassNameFromClassList,
  getSpecificClassValueFromClassList,
  getHexCodeFromColorText
} from '../../utils'
import { useDevice } from '../../core'
import type { HGapMethods } from '../../types'
import { hisonCloser } from '../../hisonCloser'

export default defineComponent({
    name: 'HGap',
    props: gapProps,
    inheritAttrs: false,
    emits: ['mounted', 'responsive-change'],
    setup(props, { emit }) {
        const gapRef = ref<HTMLDivElement | null>(null)
        const gapMethods = ref<HGapMethods | null>(null)
        const id = props.id ? props.id : getUUID()
        const reloadId = `hgap:${id}`
        const device = useDevice()

        const visible = ref<boolean>(props.visible)
        const border = ref<boolean>(props.border ?? false)
        const backgroundType = ref<BackgroundType | BackgroundTypeValue>(props.backgroundType ?? BackgroundType.empty)
        const line = ref(props.line)
        const lineStyle = ref<HGapLineStyleValue>(props.lineStyle || 'solid')
        const lineWidthRaw = ref<number | string>(props.lineWidth ?? 1)
        const lineColor = ref<string>(props.lineColor || '')

        const effectiveLineColor = computed(() => {
            const explicit = String(lineColor.value || '').trim()
            const colorText = getHexCodeFromColorText(explicit)
            if (colorText) return colorText
            if (explicit) return explicit

            const colorName = getSpecificClassValueFromClassList(responsiveClassList.value, 'color')
            const hex = colorName ? getHexCodeFromColorText(colorName) : null
            if (hex) return hex

            return hisonCloser?.componentStyle?.mutedColor || '#999999'
        })

        const lineWidthCss = computed(() => {
            const v = lineWidthRaw.value
            return typeof v === 'number' ? `${v}px` : (String(v || '1px'))
        })

        const horizontalStyle = computed(() => ({
            borderTop: `${lineWidthCss.value} ${lineStyle.value} ${effectiveLineColor.value}`,
        }))
        const verticalStyle = computed(() => ({
            borderLeft: `${lineWidthCss.value} ${lineStyle.value} ${effectiveLineColor.value}`,
        }))

        const visibleClass = computed(() => (visible.value ? '' : 'hison-display-none'))
        const borderClass = computed(() => (border.value ? 'hison-border' : ''))
        const backgroundTypeClass = computed(() => {
            switch (backgroundType.value) {
                case BackgroundType.empty: return 'hison-bg-empty'
                case BackgroundType.transparent: return 'hison-bg-transparent'
                default: return 'hison-bg-filled'
        }
        })

        const responsiveClassList = ref<string[]>([])
        const refreshResponsiveClassList = () => {
            responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
            addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
            addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
            if (getIndexSpecificClassNameFromClassList(responsiveClassList.value, 'col') === -1) {
                responsiveClassList.value.push('hison-col-12')
            }
        }

        const mount = () => {
            if (hisonCloser.component.gapList[id] && hisonCloser.component.gapList[id].isHisonvueComponent) console.warn(`[Hisonvue] The gap ID is at risk of being duplicated. ${id}`)

            registerReloadable(reloadId, () => {
                unmount()
                nextTick(mount)
            })

            refreshResponsiveClassList()

            gapMethods.value = {
                isHisonvueComponent: true,
                getId: () => id,
                getType: () => 'gap',
                isVisible: () => visible.value,
                setVisible: (v: boolean) => { visible.value = v },

                isBorder: () => border.value,
                setBorder: (v: boolean) => { border.value = v },

                getBackgroundType: () => backgroundType.value as BackgroundTypeValue,
                setBackgroundType: (t: BackgroundType | BackgroundTypeValue) => { backgroundType.value = t },

                getLine: () => line.value,
                setLine: (r: 'none' | 'horizontal' | 'vertical') => { line.value = r },

                getLineStyle: () => lineStyle.value,
                setLineStyle: (s: HGapLineStyleValue) => { lineStyle.value = s },

                getLineWidth: () => lineWidthRaw.value,
                setLineWidth: (w: number | string) => { lineWidthRaw.value = w },

                getLineColor: () => lineColor.value,
                setLineColor: (c?: string) => { lineColor.value = c ?? '' },

                reload: () => reloadHisonComponent(reloadId),
            }

            hisonCloser.component.gapList[id] = gapMethods.value
            emit('mounted', gapMethods.value)
        }

        const unmount = () => {
            unregisterReloadable(reloadId)
            delete hisonCloser.component.gapList[id]
        }

        onMounted(mount)
        onBeforeUnmount(unmount)

        watch(device, (d) => {
            refreshResponsiveClassList()
            emit('responsive-change', d)
        })

        watch(() => props.visible, v => { const nv = !!v; if (nv !== visible.value) visible.value = nv })
        watch(() => props.border, v => { const nv = !!v; if (nv !== border.value) border.value = nv })
        watch(() => props.backgroundType, v => { if (v && v !== backgroundType.value) backgroundType.value = v as any })
        watch(() => props.line, v => { if ((v === 'none' || v === 'horizontal' || v === 'vertical') && v !== line.value) line.value = v })
        watch(() => props.lineStyle, v => { if (['solid','dashed','dotted','double','groove','ridge','inset','outset'].includes(v as any) && v !== lineStyle.value) lineStyle.value = v as HGapLineStyleValue })
        watch(() => props.lineWidth, v => { const nv = (typeof v === 'number' && Number.isFinite(v) && v >= 0) ? v : (typeof v === 'string' ? v : lineWidthRaw.value); if (nv !== lineWidthRaw.value) lineWidthRaw.value = nv as any })
        watch(() => props.lineColor, v => { const s = (v ?? '').toString(); if (s !== lineColor.value) lineColor.value = s })
        watch(() => props.class, () => { refreshResponsiveClassList() })

        return {
        gapRef,
        props,
        line,
        visibleClass,
        borderClass,
        backgroundTypeClass,
        responsiveClassList,
        horizontalStyle,
        verticalStyle,
        }
    }
})
</script>

<style scoped></style>
