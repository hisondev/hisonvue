<template>
    <div :class="['hison-layer-host', visibleClass]">
        <div
        v-if="isOverlayVisible"
        class="hison-popup-overlay"
        :style="overlayStyleWithZ"
        @click="onOverlayClick"
        ></div>

        <div
        ref="popupWrapperRef"
        :class="['hison-popup-wrapper', ...responsiveClassList]"
        :style="wrapperStyle"
        >
            <div
                ref="popupRef"
                :class="['hison-popup', borderClass]"
                :style="[sizeStyle, props.style]"
                role="dialog"
            >
                <div
                    :class="['hison-popup-topbar', draggable ? 'hison-draggable' : '']"
                    @pointerdown="onTopbarPointerDown">
                    <slot
                        v-if="closeButtonVisible"
                        name="close-button"
                        :onClick="onClickCloseButton"
                        :text="closeButtonText"
                        :title="closeButtonTitle || 'Close'"
                    >
                        <HButton
                            :id="`hison_popup_close_${id}`"
                            :class="['hison-popup-close-btn', 'hison-pos-right', 'hison-pos-vertical-center', 'hison-size-s', ...childClassList]"
                            :text="closeButtonText"
                            :title="closeButtonTitle || 'Close'"
                            :border="false"
                            :background-type="closeButtonBackgroundType"
                            @click="onClickCloseButton"
                        >
                            <template v-if="$slots['close-icon']" #icon>
                                <slot name="close-icon" />
                            </template>
                            <template v-if="$slots['close-label']">
                                <slot name="close-label" />
                            </template>
                        </HButton>
                    </slot>
                </div>

                <div :class="['hison-popup-body']">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    defineComponent, ref, computed, onMounted, onBeforeUnmount, nextTick, unref, watch
} from 'vue'
import { popupProps } from './props'
import type { HPopupMethods } from '../../types'
import { ScreenPosition, ScreenPositionValue } from '../..'
import { hisonCloser } from '../../hisonCloser'
import {
    addComponentNameToClass,
    extractPrefixedClasses,
    extractResponsiveClasses,
    getUUID,
    registerReloadable,
    reloadHisonComponent,
    toClassString,
    unregisterReloadable,
} from '../../utils'
import { useDevice } from '../../core'
import { acquireScrollLock, releaseScrollLock } from '../../utils/scrollManager'

export default defineComponent({
    name: 'HPopup',
    props: popupProps,
    inheritAttrs: false,
    emits: ['mounted', 'responsive-change', 'open', 'close'],
    setup(props, { emit, slots }) {
        const id = props.id || getUUID()
        const reloadId = `hpopup:${id}`

        const device = useDevice()
        const popupWrapperRef = ref<HTMLDivElement | null>(null)
        const popupRef = ref<HTMLDivElement | null>(null)

        const visible = ref<boolean>(props.visible)
        const closeButtonVisible = ref<boolean>(true)
        const zIndex = ref<number>(props.zIndex ?? 1100)

        const
        popupPosition = ref<ScreenPositionValue>(props.position as ScreenPositionValue),
        left = ref<number | null>(props.left ?? null),
        top  = ref<number | null>(props.top  ?? null)

        const width = ref<number | null>(props.width ?? null)
        const height = ref<number | null>(props.height ?? null)

        const showOverlay = ref<boolean>(props.showOverlay)
        const closeClickOverlay = ref<boolean>(props.closeClickOverlay)
        const scrollLock = ref<boolean>(props.scrollLock)

        const enterClass = ref(props.enterAnimationClass || 'hison-popup-enter')
        const leaveClass = ref(props.leaveAnimationClass || 'hison-popup-leave')

        const visibleClass = computed(() => (visible.value ? '' : 'hison-display-none'))

        const responsiveClassList = ref<string[]>([])
        const refreshResponsiveClassList = () => {
            responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
            addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
            addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
        }

        const childClassList = computed(() => [
            ...extractPrefixedClasses(toClassString(props.class) || '', 'color'),
        ])

        const isOverlayVisible = computed(() => visible.value && showOverlay.value)

        const onOverlayClick = () => {
            if (closeClickOverlay.value) close()
        }

        const wrapperStyle = computed(() => {
            const s: Record<string, string | number> = { zIndex: zIndex.value, position: 'fixed' }
            if (left.value != null || top.value != null) {
                s.left = `${left.value ?? 0}px`
                s.top  = `${top.value  ?? 0}px`
                return s
            }
            s.left = ''; s.right = ''; s.top = ''; s.bottom = ''; (s as any).transform = 'none'
            switch (popupPosition.value) {
                case ScreenPosition.topLeft:        s.left = '0';   s.top = '0'; break
                case ScreenPosition.topCenter:      s.left = '50%'; s.top = '0';   (s as any).transform = 'translateX(-50%)'; break
                case ScreenPosition.topRight:       s.right= '0';   s.top = '0'; break
                case ScreenPosition.middleLeft:     s.left = '0';   s.top = '50%'; (s as any).transform = 'translateY(-50%)'; break
                case ScreenPosition.middleCenter:   s.left = '50%'; s.top = '50%'; (s as any).transform = 'translate(-50%, -50%)'; break
                case ScreenPosition.middleRight:    s.right= '0';   s.top = '50%'; (s as any).transform = 'translateY(-50%)'; break
                case ScreenPosition.bottomLeft:     s.left = '0';   s.bottom = '0'; break
                case ScreenPosition.bottomCenter:   s.left = '50%'; s.bottom = '0'; (s as any).transform = 'translateX(-50%)'; break
                case ScreenPosition.bottomRight:    s.right= '0';   s.bottom = '0'; break
            }
            return s
        })

        const overlayStyleWithZ = computed(() => {
            const zi = (zIndex.value ?? 1100) - 1
            const base = { zIndex: zi } as Record<string, string|number>
            const s = props.overlayStyle
            if (!s) return base
            if (Array.isArray(s)) return [{ ...base }, ...s]
            if (typeof s === 'string') return [base, s] as any
            return { ...base, ...(s as Record<string, string|number>) }
        })

        const sizeStyle = computed(() => {
            const s: Record<string, string> = {}
            if (width.value != null)  s.width  = `${width.value}px`
            if (height.value != null) s.height = `${height.value}px`
            return s
        })

        const border = ref<boolean>(props.border)
        const borderClass = computed(() => border.value ? 'hison-border' : 'hison-border-none')
        const closeButtonBackgroundType = computed(() => border.value ? 'filled' : 'empty')

        const lockScroll = () => { if (scrollLock.value) acquireScrollLock(id) }
        const unlockScroll = () => { if (scrollLock.value) releaseScrollLock(id) }

        const applyEnterAnimation = async () => {
            const el = popupRef.value
            if (!el || !enterClass.value) return
            el.classList.remove(leaveClass.value)
            void el.offsetWidth
            el.classList.add(enterClass.value)
        }
        const applyLeaveAnimation = async () => {
            const el = popupRef.value
            if (!el || !leaveClass.value) return
            el.classList.remove(enterClass.value)
            void el.offsetWidth
            el.classList.add(leaveClass.value)
            await new Promise(r => setTimeout(r, 200))
        }

        const open = async () => {
            if (visible.value) return
            visible.value = true
            lockScroll()
            await nextTick()
            applyEnterAnimation()
            emit('open', unref(popupMethods)!)
        }
        const close = async () => {
            if (!visible.value) return
            try {
                await applyLeaveAnimation()
            } finally {
                visible.value = false
                unlockScroll()
                emit('close', unref(popupMethods)!)
            }
        }
        const toggle = async () => (visible.value ? close() : open())

        const onClickCloseButton = () => { close() }

        const draggable = ref<boolean>(props.draggable)
        const isDragging = ref(false)
        let startX = 0, startY = 0
        let startLeft = 0, startTop = 0
        let rafId: number | null = null
        let pending: { l: number; t: number } | null = null

        const enableAbsoluteModeFromCurrentRect = () => {
            if (left.value == null && top.value == null) {
                const el = popupWrapperRef.value
                if (!el) return
                const rect = el.getBoundingClientRect()
                left.value = Math.round(rect.left)
                top.value  = Math.round(rect.top)
            }
        }

        const clampToViewport = (l: number, t: number) => {
            const el = popupWrapperRef.value
            if (!el) return { l, t }
            const vw = window.innerWidth
            const vh = window.innerHeight
            const w = el.offsetWidth
            const h = el.offsetHeight
            const minL = 0
            const minT = 0
            const maxL = Math.max(0, vw - w)
            const maxT = Math.max(0, vh - h)
            return { l: Math.min(Math.max(l, minL), maxL), t: Math.min(Math.max(t, minT), maxT) }
        }

        const applyPendingWithRAF = (l: number, t: number) => {
            pending = { l, t }
            if (rafId != null) return
            rafId = requestAnimationFrame(() => {
                if (pending) {
                left.value = pending.l
                top.value  = pending.t
                pending = null
                }
                rafId = null
            })
        }

        const onPointerMove = (e: PointerEvent) => {
            if (!isDragging.value) return
            const dx = e.clientX - startX
            const dy = e.clientY - startY
            const { l, t } = clampToViewport(startLeft + dx, startTop + dy)
            applyPendingWithRAF(l, t)
        }

        const onPointerUp = () => {
            if (!isDragging.value) return
            isDragging.value = false
            document.removeEventListener('pointermove', onPointerMove, true)
            document.removeEventListener('pointerup', onPointerUp, true)
            document.body.style.userSelect = ''
        }

        const onTopbarPointerDown = (e: PointerEvent) => {
            if (!draggable.value) return
            const target = e.target as HTMLElement
            if (target.closest('.hison-popup-close-btn')) return

            enableAbsoluteModeFromCurrentRect()

            isDragging.value = true
            startX = e.clientX
            startY = e.clientY
            startLeft = left.value ?? 0
            startTop  = top.value  ?? 0

            document.body.style.userSelect = 'none'
            document.addEventListener('pointermove', onPointerMove, true)
            document.addEventListener('pointerup', onPointerUp, true)
        }

        const cleanupDrag = () => {
            if (rafId != null) { cancelAnimationFrame(rafId); rafId = null }
            document.removeEventListener('pointermove', onPointerMove, true)
            document.removeEventListener('pointerup', onPointerUp, true)
            document.body.style.userSelect = ''
            isDragging.value = false
        }

        const popupMethods = ref<HPopupMethods | null>(null)

        const mount = () => {
            if (hisonCloser.component.popupList[id] && hisonCloser.component.popupList[id].isHisonvueComponent) console.warn(`[Hisonvue] The popup ID is at risk of being duplicated. ${id}`)
            registerReloadable(reloadId, () => {
                unmount()
                nextTick(mount)
            })

            refreshResponsiveClassList()

            if (visible.value) {
                lockScroll()
                nextTick(applyEnterAnimation)
            }

            popupMethods.value = {
                isHisonvueComponent: true,
                getId: () => id,
                getType: () => 'popup',
                isVisible: () => visible.value,
                open, close, toggle,
                setVisible: (v: boolean) => (v ? open() : close()),
                getZIndex: () => zIndex.value,
                setZIndex: (v: number) => { zIndex.value = v },
                getPosition: () => popupPosition.value,
                setPosition: (v) => { popupPosition.value = v as ScreenPositionValue },
                getLeft: () => left.value,
                setLeft: (v: number | null) => { left.value = v },
                getTop: () => top.value,
                setTop: (v: number | null) => { top.value = v },
                getWidth: () => width.value,
                setWidth: (v: number | null) => { width.value = v },
                getHeight: () => height.value,
                setHeight: (v: number | null) => { height.value = v },
                isDraggable: () => draggable.value,
                setDraggable: (v: boolean) => {
                    draggable.value = v
                    if (!v) cleanupDrag()
                },
                isOverlayShown: () => showOverlay.value,
                setOverlayShown: (v: boolean) => { showOverlay.value = v },
                isCloseClickOverlay: () => closeClickOverlay.value,
                setCloseClickOverlay: (v) => { closeClickOverlay.value = v },

                isScrollLocked: () => scrollLock.value,
                setScrollLock: (v: boolean) => {
                scrollLock.value = v
                if (visible.value) (v ? lockScroll() : unlockScroll())
                },
                isBorder: () => border.value,
                setBorder: (v: boolean) => { border.value = v },
                getAnimationClasses: () => ({ enter: enterClass.value, leave: leaveClass.value }),
                setAnimationClasses: (opt) => {
                if ('enter' in opt) enterClass.value = opt.enter || ''
                if ('leave' in opt) leaveClass.value = opt.leave || ''
                },
                reload: () => reloadHisonComponent(reloadId),
            }

            hisonCloser.component.popupList[id] = popupMethods.value
            emit('mounted', popupMethods.value)
        }

        const unmount = () => {
            cleanupDrag()
            unregisterReloadable(reloadId)
            delete hisonCloser.component.popupList[id]
            if (visible.value) unlockScroll()
        }

        onMounted(mount)
        onBeforeUnmount(unmount)

        watch(device, (newDevice) => {
            refreshResponsiveClassList()
            emit('responsive-change', newDevice)
        })

        watch(() => props.visible, v => { const b = !!v; if (b !== visible.value) b ? open() : close() })
        watch(() => props.zIndex, v => { const n = Number(v ?? 1100); if (n !== zIndex.value) zIndex.value = n })
        watch(() => props.position, v => { if (v && v !== popupPosition.value) popupPosition.value = v as any })
        watch(() => props.left, v => { const n = v == null ? null : Number(v); if (n !== left.value) left.value = n })
        watch(() => props.top, v => { const n = v == null ? null : Number(v); if (n !== top.value) top.value = n })
        watch(() => props.width, v => { const n = v == null ? null : Number(v); if (n !== width.value) width.value = n })
        watch(() => props.height, v => { const n = v == null ? null : Number(v); if (n !== height.value) height.value = n })
        watch(() => props.draggable, v => {
        const b = !!v
        if (b !== draggable.value) {
            draggable.value = b
            if (!b) cleanupDrag()
        }
        })
        watch(() => props.showOverlay, v => { const b = !!v; if (b !== showOverlay.value) showOverlay.value = b })
        watch(() => props.closeClickOverlay, v => { const b = !!v; if (b !== closeClickOverlay.value) closeClickOverlay.value = b })
        watch(() => props.scrollLock, v => {
        const b = !!v
        if (b !== scrollLock.value) {
            scrollLock.value = b
            if (visible.value) (b ? lockScroll() : unlockScroll())
        }
        })
        watch(() => props.border, v => { const b = !!v; if (b !== border.value) border.value = b })
        watch(() => props.enterAnimationClass, v => { const s = v || 'hison-popup-enter'; if (s !== enterClass.value) enterClass.value = s })
        watch(() => props.leaveAnimationClass, v => { const s = v || 'hison-popup-leave'; if (s !== leaveClass.value) leaveClass.value = s })
        watch(() => props.class, () => { refreshResponsiveClassList() })

        return {
            id,
            props,
            popupRef,
            popupWrapperRef,
            visibleClass,
            responsiveClassList,
            childClassList,
            borderClass,
            wrapperStyle,
            overlayStyleWithZ,
            isOverlayVisible,
            sizeStyle,
            closeButtonVisible,
            closeButtonBackgroundType,
            closeButtonText: 'X',
            closeButtonTitle: 'Close',
            draggable,
            onClickCloseButton,
            onOverlayClick,
            onTopbarPointerDown,
            popupMethods: computed(() => unref(popupMethods)),
        }
    }
})
</script>

<style scoped></style>
