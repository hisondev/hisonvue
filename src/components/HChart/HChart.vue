<template>
    <div
        :class="['hison-chart', 'hison-wrap', ...responsiveClassList, visibleClass]"
        :style="props.style"
    >
    <canvas ref="canvasRef" v-bind="attrs"/>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    onMounted,
    onBeforeUnmount,
    watch,
    computed,
    toRaw
} from 'vue'
import {
    Chart,
    type ChartData,
    type ChartType,
    type ChartOptions
} from 'chart.js'
import { chartProps } from './props'
import { getUUID, extractResponsiveClasses, registerReloadable, unregisterReloadable, getIndexSpecificClassNameFromClassList, addComponentNameToClass, getSpecificClassValueFromClassList, getRGBAFromColorText, deepMerge } from '../../utils'
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

        const refreshResponsiveClassList = () => {
            responsiveClassList.value = extractResponsiveClasses(props.class || '', device.value)
            if (getIndexSpecificClassNameFromClassList(responsiveClassList.value, 'col') === -1) {
                responsiveClassList.value.push('hison-col-12')
            }
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

            // primitive
            return input
        }

        const mount = () => {
            if (chartInstance.value) chartInstance.value.destroy()
            if (!canvasRef.value) return

            chartInstance.value = new Chart(canvasRef.value, {
                type: props.type!,
                data: resolveChartColors(toRaw(props.modelValue!)),
                options: resolveChartColors(toRaw(props.options!))
            })

            const hChartInstance = chartInstance.value as HChartInstance
            hChartInstance.getId = () => id
            hChartInstance.getType = () => 'chart'
            hChartInstance.isVisible = () => visible.value
            hChartInstance.setVisible = (val: boolean) => { visible.value = val }

            hisonCloser.component.chartList[id] = hChartInstance

            registerReloadable(reloadId, () => {
                unmount()
                mount()
            })

            emit('mounted', hisonCloser.component.chartList[id])
        }

        const unmount = () => {
            unregisterReloadable(reloadId)
            chartInstance.value?.destroy()
            chartInstance.value = null
            delete hisonCloser.component.chartList[id]
        }

        onMounted(() => {
            refreshResponsiveClassList()
            mount()
        })

        onBeforeUnmount(() => {
            unmount()
        })

        watch(device, () => {
            refreshResponsiveClassList()
            chartInstance.value?.resize()
            emit('responsive-change', device.value)
        })

        watch(() => props.modelValue, (newVal) => {
            if (chartInstance.value && newVal) {
                chartInstance.value.data = resolveChartColors(newVal)
                chartInstance.value.update()
            }
        }, { deep: true })

        return {
            canvasRef,
            props,
            attrs,
            visibleClass,
            responsiveClassList
        }
    }
})
</script>

<style scoped>
</style>
