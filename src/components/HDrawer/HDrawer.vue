<template>
  <div :class="['hison-layer-host', visibleClass]">
    <div
      v-if="isOverlayVisible"
      class="hison-drawer-overlay"
      :style="overlayStyleWithZ"
      @click="onOverlayClick"
    ></div>

    <div
      ref="wrapperRef"
      :class="['hison-drawer-wrapper', `hison-pos-${position}`, ...responsiveClassList]"
      :style="wrapperStyle"
    >
      <div
        ref="drawerRef"
        :class="['hison-drawer', borderClass, backgroundTypeClass]"
        :style="[sizeStyle, props.style]"
        role="dialog"
        @pointerdown="onSwipePointerDown"
      >
        <slot
          v-if="closeButtonVisible"
          name="close-button"
          :onClick="onClickClose"
          :text="closeButtonText"
          :title="closeButtonTitle || 'Close'"
        >
          <HButton
            :id="`hison_drawer_close_${id}`"
            :class="['hison-drawer-close-btn', 'hison-pos-right', 'hison-pos-top', 'hison-size-s', ...childClassList]"
            :text="closeButtonText"
            :title="closeButtonTitle || 'Close'"
            :border="closeButtonBorder"
            :background-type="closeButtonBackgroundType"
            @click="onClickClose"
          >
            <template v-if="$slots['close-icon']" #icon>
              <slot name="close-icon" />
            </template>
            <template v-if="$slots['close-label']">
              <slot name="close-label" />
            </template>
          </HButton>
        </slot>

        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, onMounted, onBeforeUnmount, nextTick, unref, watch
} from 'vue'
import { drawerProps } from './props'
import type { HDrawerMethods } from '../../types'
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
import { hisonCloser } from '../../hisonCloser'

type DrawerPos = 'top'|'bottom'|'left'|'right'

export default defineComponent({
  name: 'HDrawer',
  props: drawerProps,
  inheritAttrs: false,
  emits: ['mounted', 'responsive-change', 'open', 'close'],
  setup(props, { emit, slots }) {
    const id = props.id || getUUID()
    const reloadId = `hdrawer:${id}`

    const device = useDevice()

    const wrapperRef = ref<HTMLDivElement | null>(null)
    const drawerRef = ref<HTMLDivElement | null>(null)

    const visible = ref<boolean>(props.visible)
    const zIndex = ref<number>(props.zIndex ?? 1100)
    const border = ref<boolean>(props.border)
    const showOverlay = ref<boolean>(props.showOverlay)
    const closeClickOverlay = ref<boolean>(props.closeClickOverlay)
    const scrollLock = ref<boolean>(props.scrollLock)
    const position = ref<DrawerPos>(props.position)
    const width = ref<number | null>(props.width ?? null)
    const height = ref<number | null>(props.height ?? null)

    const closeButtonVisible = ref<boolean>(props.closeButtonVisible)
    const closeButtonBorder = computed(() => border.value)
    const closeButtonBackgroundType = computed(() => (border.value ? 'filled' : 'empty') as any)
    const closeButtonText = ref(props.closeButtonText || 'X')
    const closeButtonTitle = ref(props.closeButtonTitle || 'Close')

    const swipeClose = ref<boolean>(props.swipeClose)

    const defaultEnterByPos: Record<DrawerPos, string> = {
      top: 'hison-drawer-enter-top',
      bottom: 'hison-drawer-enter-bottom',
      left: 'hison-drawer-enter-left',
      right: 'hison-drawer-enter-right',
    }
    const defaultLeaveByPos: Record<DrawerPos, string> = {
      top: 'hison-drawer-leave-top',
      bottom: 'hison-drawer-leave-bottom',
      left: 'hison-drawer-leave-left',
      right: 'hison-drawer-leave-right',
    }
    const enterClass = ref(props.enterAnimationClass || defaultEnterByPos[position.value])
    const leaveClass = ref(props.leaveAnimationClass || defaultLeaveByPos[position.value])

    const backgroundTypeClass = computed(() => 'hison-bg-empty')
    const borderClass = computed(() => (border.value ? 'hison-border' : ''))

    const visibleClass = computed(() => (visible.value ? '' : 'hison-display-none'))

    const responsiveClassList = ref<string[]>([])
    const refreshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
      addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle?.size || 'm')
      addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
    }
    const childClassList = computed(() => [
      ...extractPrefixedClasses(toClassString(props.class) || '', 'color'),
    ])

    const isOverlayVisible = computed(() => visible.value && showOverlay.value)
    const overlayStyleWithZ = computed(() => {
      const zi = (zIndex.value ?? 1100) - 1
      const base = { zIndex: zi } as Record<string, string|number>
      const s = props.overlayStyle
      if (!s) return base
      if (Array.isArray(s)) return [{ ...base }, ...s]
      if (typeof s === 'string') return [base, s] as any
      return { ...base, ...(s as Record<string, string|number>) }
    })
    const onOverlayClick = () => { if (closeClickOverlay.value) close() }

    const wrapperStyle = computed(() => {
      const s: Record<string, string | number> = { zIndex: zIndex.value, position: 'fixed', inset: 'auto' as any }
      s.left = ''; s.right = ''; s.top = ''; s.bottom = ''
      switch (position.value) {
        case 'top':    s.left = '0'; s.right = '0'; s.top = '0'; break
        case 'bottom': s.left = '0'; s.right = '0'; s.bottom = '0'; break
        case 'left':   s.left = '0'; s.top = '0'; s.bottom = '0'; break
        case 'right':  s.right = '0'; s.top = '0'; s.bottom = '0'; break
      }
      return s
    })

    const sizeStyle = computed(() => {
      const s: Record<string, string> = {}
      if (position.value === 'top' || position.value === 'bottom') {
        s.width = '100vw'
        if (height.value != null) s.height = `${height.value}px`
        if (width.value != null) s.width = `${width.value}px`
      } else {
        s.height = '100vh'
        if (width.value != null) s.width = `${width.value}px`
        if (height.value != null) s.height = `${height.value}px`
      }
      return s
    })

    const lockScroll = () => { if (scrollLock.value) acquireScrollLock(id) }
    const unlockScroll = () => { if (scrollLock.value) releaseScrollLock(id) }

    const applyEnterAnimation = async () => {
      const el = drawerRef.value
      if (!el || !enterClass.value) return
      el.classList.remove(leaveClass.value)
      void el.offsetWidth
      el.classList.add(enterClass.value)
    }
    const applyLeaveAnimation = async () => {
      const el = drawerRef.value
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
      emit('open', unref(drawerMethods)!)
    }
    const close = async () => {
      if (!visible.value) return
      try {
        await applyLeaveAnimation()
      } finally {
        visible.value = false
        unlockScroll()
        emit('close', unref(drawerMethods)!)
      }
    }
    const toggle = async () => (visible.value ? close() : open())
    const onClickClose = () => close()

    let swiping = false
    let sx = 0, sy = 0
    const SWIPE_THRESHOLD = 40
    const onSwipePointerDown = (e: PointerEvent) => {
      if (!swipeClose.value) return
      swiping = true
      sx = e.clientX
      sy = e.clientY
      window.addEventListener('pointerup', onSwipePointerUp, { once: true, capture: true })
    }
    const onSwipePointerUp = (e: PointerEvent) => {
      if (!swiping) return
      swiping = false
      const dx = e.clientX - sx
      const dy = e.clientY - sy
      const absX = Math.abs(dx), absY = Math.abs(dy)

      if (position.value === 'top' && absY > absX && dy > SWIPE_THRESHOLD) close()
      else if (position.value === 'bottom' && absY > absX && dy < -SWIPE_THRESHOLD) close()
      else if (position.value === 'left' && absX > absY && dx < -SWIPE_THRESHOLD) close()
      else if (position.value === 'right' && absX > absY && dx > SWIPE_THRESHOLD) close()
    }

    const SIZE_DUR = 200
    const SIZE_EASE = 'ease'

    function animateDimension(
      el: HTMLElement,
      dim: 'width'|'height',
      fromPx: number,
      toPx: number,
      dur = SIZE_DUR,
      ease = SIZE_EASE
    ): Promise<void> {
      return new Promise(resolve => {
        el.style.transition = 'none'
        el.style[dim] = `${fromPx}px`
        void el.offsetWidth
        el.style.transition = `${dim} ${dur}ms ${ease}`
        el.style[dim] = `${toPx}px`

        const done = () => {
          el.removeEventListener('transitionend', done)
          el.style.transition = ''
          resolve()
        }
        el.addEventListener('transitionend', done)
        setTimeout(done, dur + 50)
      })
    }

    const isHorizontal = computed(() => position.value === 'left' || position.value === 'right')
    const isVertical   = computed(() => position.value === 'top'  || position.value === 'bottom')

    async function setWidthImpl(next: number | null, animate = true) {
      const el = drawerRef.value
      if (!el) { width.value = next; return }
      const from = el.getBoundingClientRect().width
      if ((next ?? from) === from) { width.value = next; return }

      if (!animate || next == null || !isHorizontal.value) { width.value = next; return }

      width.value = next
      await nextTick()
      await animateDimension(el, 'width', from, next)
    }

    async function setHeightImpl(next: number | null, animate = true) {
      const el = drawerRef.value
      if (!el) { height.value = next; return }
      const from = el.getBoundingClientRect().height
      if ((next ?? from) === from) { height.value = next; return }

      if (!animate || next == null || !isVertical.value) { height.value = next; return }

      height.value = next
      await nextTick()
      await animateDimension(el, 'height', from, next)
    }

    const drawerMethods = ref<HDrawerMethods | null>(null)

    const mount = () => {
      if (hisonCloser.component.drawerList[id] && hisonCloser.component.drawerList[id].isHisonvueComponent) console.warn(`[Hisonvue] The drawer ID is at risk of being duplicated. ${id}`)

      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })

      refreshResponsiveClassList()

      if (visible.value) {
        lockScroll()
        nextTick(applyEnterAnimation)
      }

      drawerMethods.value = {
        isHisonvueComponent: true,
        getId: () => id,
        getType: () => 'drawer',
        isVisible: () => visible.value,
        open, close, toggle,
        setVisible: (v: boolean) => (v ? open() : close()),
        getZIndex: () => zIndex.value,
        setZIndex: (v: number) => { zIndex.value = v },
        getPosition: () => position.value,
        setPosition: (p) => {
          position.value = p as DrawerPos
          if (!props.enterAnimationClass) enterClass.value = defaultEnterByPos[position.value]
          if (!props.leaveAnimationClass) leaveClass.value = defaultLeaveByPos[position.value]
        },
        getWidth: () => width.value,
        setWidth: (v: number | null, animate = true) => setWidthImpl(v, animate),
        getHeight: () => height.value,
        setHeight: (v: number | null, animate = true) => setHeightImpl(v, animate),
        isSwipeCloseEnabled: () => swipeClose.value,
        setSwipeCloseEnabled: (v: boolean) => { swipeClose.value = v },
        isCloseButtonVisible: () => closeButtonVisible.value,
        setCloseButtonVisible: (v: boolean) => { closeButtonVisible.value = v },
        isOverlayShown: () => showOverlay.value,
        setOverlayShown: (v: boolean) => { showOverlay.value = v },
        isCloseClickOverlay: () => closeClickOverlay.value,
        setCloseClickOverlay: (v: boolean) => { closeClickOverlay.value = v },
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

      hisonCloser.component.drawerList[id] = drawerMethods.value
      emit('mounted', drawerMethods.value)
    }

    const unmount = () => {
      unregisterReloadable(reloadId)
      delete hisonCloser.component.drawerList[id]
      if (visible.value) unlockScroll()
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(device, (newDevice) => {
      refreshResponsiveClassList()
      emit('responsive-change', newDevice)
    })

    watch(() => props.visible, v => { if (!!v !== visible.value) (v ? open() : close()) })
    watch(() => props.zIndex, v => { const n = Number(v); if (Number.isFinite(n) && n !== zIndex.value) zIndex.value = n })
    watch(() => props.border, v => { const nv = !!v; if (nv !== border.value) border.value = nv })
    watch(() => props.showOverlay, v => { const nv = !!v; if (nv !== showOverlay.value) showOverlay.value = nv })
    watch(() => props.closeClickOverlay, v => { const nv = !!v; if (nv !== closeClickOverlay.value) closeClickOverlay.value = nv })
    watch(() => props.scrollLock, v => { const nv = !!v; if (nv !== scrollLock.value) { scrollLock.value = nv; if (visible.value) (nv ? lockScroll() : unlockScroll()) } })
    watch(() => props.position, v => { if (v && v !== position.value) { position.value = v as DrawerPos; if (!props.enterAnimationClass) enterClass.value = defaultEnterByPos[position.value]; if (!props.leaveAnimationClass) leaveClass.value = defaultLeaveByPos[position.value] } })
    watch(() => props.width, v => { const n = v == null ? null : Number(v); if (n !== width.value) setWidthImpl(n, false) })
    watch(() => props.height, v => { const n = v == null ? null : Number(v); if (n !== height.value) setHeightImpl(n, false) })
    watch(() => props.closeButtonVisible, v => { const nv = !!v; if (nv !== closeButtonVisible.value) closeButtonVisible.value = nv })
    watch(() => props.closeButtonText, v => { const t = v ?? 'X'; if (t !== closeButtonText.value) closeButtonText.value = t })
    watch(() => props.closeButtonTitle, v => { const t = v ?? 'Close'; if (t !== closeButtonTitle.value) closeButtonTitle.value = t })
    watch(() => props.swipeClose, v => { const nv = !!v; if (nv !== swipeClose.value) swipeClose.value = nv })
    watch(() => props.enterAnimationClass, v => { const nc = v || defaultEnterByPos[position.value]; if (nc !== enterClass.value) enterClass.value = nc })
    watch(() => props.leaveAnimationClass, v => { const nc = v || defaultLeaveByPos[position.value]; if (nc !== leaveClass.value) leaveClass.value = nc })
    watch(() => props.class, () => refreshResponsiveClassList())

    return {
      id,
      props,
      wrapperRef,
      drawerRef,
      position,
      visibleClass,
      responsiveClassList,
      childClassList,
      borderClass,
      backgroundTypeClass,
      wrapperStyle,
      overlayStyleWithZ,
      isOverlayVisible,
      sizeStyle,
      closeButtonVisible,
      closeButtonBorder,
      closeButtonBackgroundType,
      closeButtonText,
      closeButtonTitle,
      onOverlayClick,
      onClickClose,
      onSwipePointerDown,
      drawerMethods: computed(() => unref(drawerMethods)),
    }
  }
})
</script>

<style scoped></style>
