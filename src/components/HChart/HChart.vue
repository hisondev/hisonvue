<template>
    <div
        :class="['hison-chart', 'hison-wrapper', ...responsiveClassList, visibleClass]"
        :style="props.style"
        >
        <canvas v-if="!isPending" ref="canvasRef" v-bind="attrs" />
    </div>
</template>

<script lang="ts">
import {
    defineComponent, ref, onMounted, onBeforeUnmount, watch, computed,
    toRaw, nextTick, markRaw, type PropType
} from 'vue'
import {
    Chart, type ChartData, type ChartType, type ChartOptions, ChartDataset
} from 'chart.js'
import { chartProps } from './props'
import {
    getUUID, extractResponsiveClasses, registerReloadable, unregisterReloadable,
    getIndexSpecificClassNameFromClassList, getRGBAFromColorText, reloadHisonComponent, toClassString,
    addComponentNameToClass
} from '../../utils'
import { useDevice } from '../../core'
import { HChartInstance } from '../..'
import { hisonCloser } from '../../hisonCloser'

export default defineComponent({
    name: 'HChart',
    props: chartProps,
    emits: ['update:modelValue', 'mounted', 'responsive-change'],
    setup(props, { emit, attrs }) {
        const id = props.id || getUUID()
        const reloadId = `hchart:${id}`
        const canvasRef = ref<HTMLCanvasElement | null>(null)
        const chartInstance = ref<Chart | null>(null)

        const visible = ref(props.visible)
        const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')

        const device = useDevice()
        const responsiveClassList = ref<string[]>([])
        const isPending = ref(false)
        const loadDelay = ref(props.loadDelay ?? 500)

        let timerId: number | null = null
        let isAlive = true
        let isUnmounting = false
        const destroyed = ref(false)

        const refreshResponsiveClassList = () => {
            responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
            if (getIndexSpecificClassNameFromClassList(responsiveClassList.value, 'col') === -1) {
                responsiveClassList.value.push('hison-col-12')
            }
            addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
            addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
        }

        const resolveChartColors = (input: any): any => {
            if (Array.isArray(input)) {
                return input.map((item) => {
                    if (typeof item === 'string') {
                        const resolved = getRGBAFromColorText(item)
                        return resolved || item
                    } else if (typeof item === 'object' && item !== null) {
                        return resolveChartColors(item)
                    }
                    return item
                })
            }
            if (typeof input === 'object' && input !== null) {
                const result: any = {}
                for (const [key, value] of Object.entries(input)) {
                    if (typeof value === 'string' && /color/i.test(key)) {
                        const resolved = getRGBAFromColorText(value)
                        result[key] = resolved || value
                    } else {
                        result[key] = resolveChartColors(value)
                    }
                }
                return result
            }
            return input
        }

        function getSafeChartData(data: any): ChartData {
            if (!data || typeof data !== 'object' || !Array.isArray(data.datasets)) {
                return { datasets: [] }
            }
            return {
                ...data,
                datasets: (data.datasets as ChartDataset<any, any>[]).filter((ds: ChartDataset<any, any>) => !!ds)
            }
        }
        function getSafeChartOptions(options: any): ChartOptions {
            if (!options || typeof options !== 'object') return {}
            return options
        }

        function mountChart() {
            if (!isAlive || isUnmounting || destroyed.value) return
            if (!canvasRef.value) {
                console.warn('[mountChart] canvasRef.value is null')
                return
            }
            refreshResponsiveClassList()
            chartInstance.value = markRaw(new Chart(canvasRef.value, {
                type: props.type!,
                data: getSafeChartData(resolveChartColors(toRaw(props.modelValue))),
                options: getSafeChartOptions(resolveChartColors(toRaw(props.options))),
            }))
            const hChartInstance = chartInstance.value as HChartInstance
            hChartInstance.isHisonvueComponent = true
            hChartInstance.getId = () => id
            hChartInstance.getType = () => 'chart'
            hChartInstance.isVisible = () => visible.value
            hChartInstance.setVisible = (val: boolean) => { visible.value = val }
            hChartInstance.getLoadDelay = () => loadDelay.value
            hChartInstance.setLoadDelay = (ms: number) => { loadDelay.value = ms }
            hChartInstance.reload = () => reloadHisonComponent(reloadId)
            if (hisonCloser.component.chartList[id] && hisonCloser.component.chartList[id].isHisonvueComponent) console.warn(`[Hisonvue] The chart ID is at risk of being duplicated. ${id}`)
            hisonCloser.component.chartList[id] = hChartInstance
            destroyed.value = false
            emit('mounted', hisonCloser.component.chartList[id])
        }

        const unmount = async () => {
            if (isUnmounting || destroyed.value) {
                isUnmounting = true
                if (timerId !== null) {
                    clearTimeout(timerId)
                    timerId = null
                }
                return
            }
            isUnmounting = true

            if (timerId !== null) {
                clearTimeout(timerId)
                timerId = null
            }

            const chart = chartInstance.value
            if (chart) {
                try {
                    try { (chart as any).stop?.() } catch {}
                    chart.destroy()
                } catch {
                } finally {
                    chartInstance.value = null
                }
            }

            delete hisonCloser.component.chartList[id]

            isPending.value = true
            destroyed.value = true
            await nextTick()
        }

        const mount = async () => {
            if (!isAlive || isUnmounting) return
            if (!isPending.value) return
            isPending.value = false
            await nextTick()
            timerId = window.setTimeout(() => {
                if (!isAlive || isUnmounting || destroyed.value) return
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        mountChart()
                    })
                })
            }, loadDelay.value)
        }

        registerReloadable(reloadId, async () => {
            if (!isAlive) return
            unregisterReloadable(reloadId)
            await unmount()
            await mount()
            registerReloadable(reloadId, async () => {
                if (!isAlive) return
                unregisterReloadable(reloadId)
                await unmount()
                await mount()
                registerReloadable(reloadId, async () => {
                    if (!isAlive) return
                    unregisterReloadable(reloadId)
                    await unmount()
                    await mount()
                })
            })
        })

        onMounted(async () => {
            isPending.value = false
            destroyed.value = false
            await nextTick()
            timerId = window.setTimeout(() => {
                if (!isAlive || isUnmounting || destroyed.value) return
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        mountChart()
                    })
                })
            }, loadDelay.value)
        })

        onBeforeUnmount(async () => {
            isAlive = false
            if (timerId !== null) {
                clearTimeout(timerId)
                timerId = null
            }
            await unmount()
            unregisterReloadable(reloadId)
        })

        watch(device, () => {
            if (isUnmounting || destroyed.value) return
            refreshResponsiveClassList()
            if (chartInstance.value && (canvasRef.value?.isConnected ?? true)) {
                chartInstance.value.resize()
            }
            emit('responsive-change', device.value)
        })

        watch(() => props.modelValue, (newVal) => {
            if (
                isPending.value ||
                isUnmounting ||
                destroyed.value ||
                !chartInstance.value ||
                !newVal ||
                typeof newVal !== 'object' ||
                !Array.isArray(newVal.datasets)
            ) return
            chartInstance.value.data = getSafeChartData(resolveChartColors(toRaw(newVal)))
            chartInstance.value.update('none')
        }, { deep: true })

        watch(() => props.options, (newVal) => {
            if (
                isPending.value ||
                isUnmounting ||
                destroyed.value ||
                !chartInstance.value ||
                !newVal ||
                typeof newVal !== 'object'
            ) return
            chartInstance.value.options = getSafeChartOptions(resolveChartColors(toRaw(newVal)))
            chartInstance.value.update('none')
        }, { deep: true })

        watch(() => props.visible, v => { if (v !== visible.value) visible.value = !!v })
        watch(() => props.loadDelay, v => { const n = Number(v); if (Number.isFinite(n) && n >= 0 && n !== loadDelay.value) loadDelay.value = n })
        watch(() => props.class, () => refreshResponsiveClassList())
        watch(() => props.type, () => { if (!isUnmounting && !destroyed.value) reloadHisonComponent(reloadId) })

        return {
            canvasRef,
            props,
            attrs,
            visibleClass,
            responsiveClassList,
            isPending
        }
    }
})
</script>

<style scoped></style>