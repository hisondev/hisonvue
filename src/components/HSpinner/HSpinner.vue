<template>
  <div
    :class="['hison-layer-host', visibleClass]"
  >
    <div
        v-if="visible"
        class="hison-spinner-overlay"
        :style="overlayStyleWithZ"
    ></div>

    <div
        ref="wrapperRef"
        tabindex="-1"
        :class="['hison-spinner-wrapper', ...responsiveClassList]"
        :style="wrapperStyle"
    >
        <div
            ref="spinnerRef"
            :class="[
                'hison-spinner',
                spinnerTypeClass,
            ]"
            :style="props.style"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <slot
                name="spinner"
                :spinner-el="spinnerRef"
                :spinner="spinnerMethods"
                :type="spinnerType"
            >
                <div v-if="spinnerType === 'ring'" class="hison-spinner-ring">
                    <span class="hison-spinner-ring-seg"></span>
                    <span class="hison-spinner-ring-seg"></span>
                    <span class="hison-spinner-ring-seg"></span>
                    <span class="hison-spinner-ring-seg"></span>
                    <span class="hison-spinner-ring-seg"></span>
                    <span class="hison-spinner-ring-seg"></span>
                    <span class="hison-spinner-ring-seg"></span>
                </div>

                <div v-else-if="spinnerType === 'dots'" class="hison-spinner-dots">
                    <span class="hison-spinner-dot"></span>
                    <span class="hison-spinner-dot"></span>
                    <span class="hison-spinner-dot"></span>
                </div>

                <div v-else-if="spinnerType === 'bars'" class="hison-spinner-bars">
                    <span class="hison-spinner-bar"></span>
                    <span class="hison-spinner-bar"></span>
                    <span class="hison-spinner-bar"></span>
                    <span class="hison-spinner-bar"></span>
                </div>

                <div v-else class="hison-spinner-pulse">
                    <span class="hison-spinner-pulse-span"></span>
                </div>
            </slot>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
    defineComponent, ref, computed, onMounted, onBeforeUnmount, nextTick, unref, watch
} from 'vue'
import { spinnerProps } from './props'
import type { HSpinnerMethods } from '../../types'
import { BackgroundType, ScreenPosition, ScreenPositionValue } from '../..'
import { hisonCloser } from '../../hisonCloser'
import {
    addComponentNameToClass,
    extractResponsiveClasses,
    getUUID,
    registerReloadable,
    reloadHisonComponent,
    toClassString,
    unregisterReloadable
} from '../../utils'
import { useDevice } from '../../core'
import { acquireScrollLock, releaseScrollLock } from '../../utils/scrollManager'

export default defineComponent({
    name: 'HSpinner',
    props: spinnerProps,
    inheritAttrs: false,
    emits: ['mounted','responsive-change','open','close','toggle'],
    setup(props, { emit }) {
        const id = props.id || getUUID()
        const reloadId = `hspinner:${id}`

        const device = useDevice()

        const wrapperRef = ref<HTMLDivElement | null>(null)
        const spinnerRef = ref<HTMLDivElement | null>(null)

        const visible = ref<boolean>(props.visible)
        const zIndex = ref<number>(props.zIndex ?? 1400)
        const position = ref<ScreenPositionValue>(props.position as ScreenPositionValue)
        const overlayStyleProp = ref(props.overlayStyle)
        const timeoutMs = ref<number>(props.timeoutMs ?? 0)
        const spinnerType = ref(props.spinnerType)

        const visibleClass = computed(() => (visible.value ? '' : 'hison-display-none'))
        const spinnerTypeClass = computed(() => `hison-spinner-type-${spinnerType.value}`)

        const responsiveClassList = ref<string[]>([])
        const refreshResponsiveClassList = () => {
            responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
            addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
            addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
        }

        const wrapperStyle = computed(() => {
            const s: Record<string, string | number> = { zIndex: zIndex.value }
            s.left = ''; s.right = ''; s.top = ''; s.bottom = ''; s.transform = 'none'

            switch (position.value) {
                case ScreenPosition.topLeft:       s.left = '5%';    s.top = '5%'; break
                case ScreenPosition.topCenter:     s.left = '50%'; s.top = '5%'; s.transform = 'translateX(-50%)'; break
                case ScreenPosition.topRight:      s.right = '5%';  s.top = '5%'; break
                case ScreenPosition.middleLeft:    s.left = '5%';   s.top = '50%'; s.transform = 'translateY(-50%)'; break
                case ScreenPosition.middleCenter:  s.left = '50%'; s.top = '50%'; s.transform = 'translate(-50%, -50%)'; break
                case ScreenPosition.middleRight:   s.right = '5%';  s.top = '50%'; s.transform = 'translateY(-50%)'; break
                case ScreenPosition.bottomLeft:    s.left = '5%';   s.bottom = '5%'; break
                case ScreenPosition.bottomCenter:  s.left = '50%'; s.bottom = '5%'; s.transform = 'translateX(-50%)'; break
                case ScreenPosition.bottomRight:   s.right = '5%';  s.bottom = '5%'; break
            }
            return s
        })

        const overlayStyleWithZ = computed(() => {
            const zi = (zIndex.value ?? 1400) - 1
            const base = { zIndex: zi } as Record<string, string|number>
            const s = overlayStyleProp.value
            if (!s) return base
            if (Array.isArray(s)) return [{ ...base }, ...s]
            if (typeof s === 'string') return [base, s] as any
            return { ...base, ...(s as Record<string, string|number>) }
        })

        let timeoutHandle: number | null = null
        const clearTimeoutIfAny = () => {
            if (timeoutHandle != null) {
                clearTimeout(timeoutHandle)
                timeoutHandle = null
            }
        }
        const armTimeout = () => {
            clearTimeoutIfAny()
            if (timeoutMs.value > 0) {
                timeoutHandle = window.setTimeout(() => {
                close()
                }, timeoutMs.value)
            }
        }

        const lockScroll = () => acquireScrollLock(id)
        const unlockScroll = () => releaseScrollLock(id)

        const open = async () => {
            if (visible.value) return
            const ae = document.activeElement as any
            if (ae && typeof ae.blur === 'function') ae.blur()
            visible.value = true
            lockScroll()
            await nextTick()
            wrapperRef.value?.focus()
            armTimeout()
            emit('open', unref(spinnerMethods)!)
        }
        const close = async () => {
            if (!visible.value) return
            try {
                clearTimeoutIfAny()
            } finally {
                visible.value = false
                unlockScroll()
                emit('close', unref(spinnerMethods)!)
            }
        }
        const toggle = async () => {
            if (visible.value) {
                await close()
            } else {
                await open()
            }
            emit('toggle', unref(spinnerMethods)!)
        }

        const spinnerMethods = ref<HSpinnerMethods | null>(null)

        const mount = () => {
            if (hisonCloser.component.spinnerList[id] && hisonCloser.component.spinnerList[id].isHisonvueComponent) console.warn(`[Hisonvue] The spinner ID is at risk of being duplicated. ${id}`)
            registerReloadable(reloadId, () => {
                unmount()
                nextTick(mount)
            })

            refreshResponsiveClassList()

            if (visible.value) {
                const ae = document.activeElement as any
                if (ae && typeof ae.blur === 'function') ae.blur()
                lockScroll()
                nextTick(() => {
                    wrapperRef.value?.focus()
                })
                armTimeout()
            }

            spinnerMethods.value = {
                isHisonvueComponent: true,
                getId: () => id,
                getType: () => 'spinner',
                isVisible: () => visible.value,
                open, close, toggle,
                setVisible: (v: boolean) => (v ? open() : close()),
                getZIndex: () => zIndex.value,
                setZIndex: (v: number) => { zIndex.value = v },
                getPosition: () => position.value,
                setPosition: (v) => { position.value = v as ScreenPositionValue },
                getTimeout: () => timeoutMs.value,
                setTimeout: (ms: number) => {
                timeoutMs.value = Math.max(0, Number(ms) || 0)
                if (visible.value) armTimeout()
                },
                getSpinnerType: () => spinnerType.value,
                setSpinnerType: (t) => { spinnerType.value = t as any },
                getOverlayStyle: () => overlayStyleProp.value,
                setOverlayStyle: (s: any) => { overlayStyleProp.value = s },
                reload: () => reloadHisonComponent(reloadId),
            }

            hisonCloser.component.spinnerList[id] = spinnerMethods.value
            emit('mounted', spinnerMethods.value)
        }

        const unmount = () => {
            unregisterReloadable(reloadId)
            delete hisonCloser.component.spinnerList[id]
            clearTimeoutIfAny()
            if (visible.value) unlockScroll()
        }

        onMounted(mount)
        onBeforeUnmount(unmount)

        watch(device, (newDevice) => {
            refreshResponsiveClassList()
            emit('responsive-change', newDevice)
        })
        watch(() => props.visible, v => { const b = !!v; if (b !== visible.value) b ? open() : close() })
        watch(() => props.zIndex, v => { const n = Number(v ?? 1400); if (n !== zIndex.value) zIndex.value = n })
        watch(() => props.position, v => { if (v && v !== position.value) position.value = v as any })
        watch(() => props.overlayStyle, v => { if (v !== overlayStyleProp.value) overlayStyleProp.value = v as any })
        watch(() => props.timeoutMs, v => {
        const n = Math.max(0, Number(v) || 0)
        if (n !== timeoutMs.value) {
            timeoutMs.value = n
            if (visible.value) armTimeout()
        }
        })
        watch(() => props.spinnerType, v => { if (v && v !== spinnerType.value) spinnerType.value = v as any })
        watch(() => props.class, () => { refreshResponsiveClassList() })

        return {
            id,
            props,
            wrapperRef,
            spinnerRef,

            visible,
            visibleClass,
            responsiveClassList,

            overlayStyleWithZ,
            wrapperStyle,

            spinnerType,
            spinnerTypeClass,

            spinnerMethods: computed(() => unref(spinnerMethods)),
        }
    }
})
</script>

<style scoped></style>