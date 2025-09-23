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
import { HChartInstance, hisonCloser } from '../..'

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

        // 타이밍/생명주기 가드
        let timerId: number | null = null
        let isAlive = true
        let isUnmounting = false

        const refreshResponsiveClassList = () => {
            responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
            if (getIndexSpecificClassNameFromClassList(responsiveClassList.value, 'col') === -1) {
                responsiveClassList.value.push('hison-col-12')
            }
            addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
            addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
        }

        // Chart data deep color 변환
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

        // 실제로 chart를 생성
        function mountChart() {
            if (!isAlive || isUnmounting) return
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
            // ChartInstance 확장
            const hChartInstance = chartInstance.value as HChartInstance
            hChartInstance.getId = () => id
            hChartInstance.getType = () => 'chart'
            hChartInstance.isVisible = () => visible.value
            hChartInstance.setVisible = (val: boolean) => { visible.value = val }
            hChartInstance.getLoadDelay = () => loadDelay.value
            hChartInstance.setLoadDelay = (ms: number) => { loadDelay.value = ms }
            hChartInstance.reload = () => reloadHisonComponent(reloadId)
            hisonCloser.component.chartList[id] = hChartInstance
            emit('mounted', hisonCloser.component.chartList[id])
        }

        // 안전한 destroy
        const unmount = async () => {
            isUnmounting = true

            // 타이머 정리
            if (timerId !== null) {
                clearTimeout(timerId)
                timerId = null
            }

            // 업데이트/옵션 재할당 없이 즉시 정지 후 파괴
            const chart = chartInstance.value
            if (chart) {
                try {
                    try { (chart as any).stop?.() } catch {}
                    chart.destroy()
                } catch {
                    // 파괴 중 에러 무시
                } finally {
                    chartInstance.value = null
                }
            }

            delete hisonCloser.component.chartList[id]

            isPending.value = true
            await nextTick()
        }

        // 안전한 mount (언제든 재사용)
        const mount = async () => {
            if (!isPending.value) return
            if (!isAlive || isUnmounting) return
            isPending.value = false
            await nextTick()
            // 마운트 타이밍: loadDelay + RAF 2회
            timerId = window.setTimeout(() => {
                if (!isAlive || isUnmounting) return
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        mountChart()
                    })
                })
            }, loadDelay.value)
        }

        // 반드시 destroy → DOM flush → mount 순서
        registerReloadable(reloadId, async () => {
            await unmount()
            await mount()
        })

        onMounted(async () => {
            isPending.value = false
            await nextTick()
            timerId = window.setTimeout(() => {
                if (!isAlive || isUnmounting) return
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
            if (isUnmounting) return
            refreshResponsiveClassList()
            chartInstance.value?.resize()
            emit('responsive-change', device.value)
        })

        // modelValue 변경 감지 및 유효성 검사
        watch(() => props.modelValue, (newVal) => {
            if (
                isPending.value ||
                isUnmounting ||
                !chartInstance.value ||
                !newVal ||
                typeof newVal !== 'object' ||
                !Array.isArray(newVal.datasets)
            ) return
            chartInstance.value.data = getSafeChartData(resolveChartColors(toRaw(newVal)))
            chartInstance.value.update('none')
        }, { deep: true })

        // options 변경 감지 및 유효성 검사
        watch(() => props.options, (newVal) => {
            if (
                isPending.value ||
                isUnmounting ||
                !chartInstance.value ||
                !newVal ||
                typeof newVal !== 'object'
            ) return
            chartInstance.value.options = getSafeChartOptions(resolveChartColors(toRaw(newVal)))
            chartInstance.value.update('none')
        }, { deep: true })

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

<style scoped>
</style>
