<template>
  <div
    :class="[
      'hison-layer-host',
      visibleClass
    ]"
  >
    <div
      v-if="isOverlayVisible"
      class="hison-modal-overlay"
      :style="overlayStyleWithZ"
      @click="onOverlayClick"
    ></div>

    <div
      ref="modalWrapperRef"
      :class="[
        'hison-modal-wrapper',
        ...responsiveClassList,
      ]"
      :style="wrapperStyle"
    >
      <div
        ref="modalRef"
        :class="[
          'hison-modal',
          borderClass,
          backgroundTypeClass
        ]"
        :style="props.style"
        role="dialog"
      >
        <HLayout
          v-if="headerVisibleComputed"
          :id="`hison_modal_header_layout_${id}`"
          :class="['hison-modal-header', ...childClassList]"
        >
          <template v-if="$slots.header">
            <slot name="header" />
          </template>

          <template v-else>
            <template v-if="headerHasLeft">
              <HLabel
                v-if="showHeaderCaptionLeft"
                :id="`hison_modal_caption_label_${id}`"
                :class="['hison-modal-caption', 'hison-pos-left', 'hison-pos-vertical-center', ...childClassList]"
                :text="caption ?? ''"
                :border="captionBorder"
                :background-type="captionBackgroundType"
              />
              <slot
                v-if="showHeaderCloseLeft"
                name="close-button"
                :onClick="onClickCloseButton"
                :text="closeButtonText"
                :title="closeButtonTitle || 'Close'"
                :placement="'header-left'"
              >
                <HButton
                  :id="`hison_modal_close_button_${id}`"
                  :class="['hison-modal-close-btn', 'hison-pos-left', 'hison-pos-vertical-center', 'hison-size-s', 'hison-color-danger']"
                  :text="closeButtonText"
                  :title="closeButtonTitle || 'Close'"
                  :border="closeButtonBorder"
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
            </template>

            <template v-if="headerHasCenter">
              <HLabel
                v-if="showHeaderCaptionCenter"
                :id="`hison_modal_caption_label_${id}`"
                :class="['hison-modal-caption', 'hison-pos-center', 'hison-pos-vertical-center', ...childClassList]"
                :text="caption ?? ''"
                :border="captionBorder"
                :background-type="captionBackgroundType"
              />
              <slot
                v-if="showHeaderCloseCenter"
                name="close-button"
                :onClick="onClickCloseButton"
                :text="closeButtonText"
                :title="closeButtonTitle || 'Close'"
                :placement="'header-center'"
              >
                <HButton
                  :id="`hison_modal_close_button_${id}`"
                  :class="['hison-modal-close-btn', 'hison-pos-center', 'hison-pos-vertical-center', 'hison-size-s', 'hison-color-danger']"
                  :text="closeButtonText"
                  :title="closeButtonTitle || 'Close'"
                  :border="closeButtonBorder"
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
            </template>

            <template v-if="headerHasRight">
              <HLabel
                v-if="showHeaderCaptionRight"
                :id="`hison_modal_caption_label_${id}`"
                :class="['hison-modal-caption', 'hison-pos-right', 'hison-pos-vertical-center', ...childClassList]"
                :text="caption ?? ''"
                :border="captionBorder"
                :background-type="captionBackgroundType"
              />
              <slot
                v-if="showHeaderCloseRight"
                name="close-button"
                :onClick="onClickCloseButton"
                :text="closeButtonText"
                :title="closeButtonTitle || 'Close'"
                :placement="'header-right'"
              >
                <HButton
                  :id="`hison_modal_close_button_${id}`"
                  :class="['hison-modal-close-btn', 'hison-pos-right', 'hison-pos-vertical-center', 'hison-size-s', 'hison-color-danger']"
                  :text="closeButtonText"
                  :title="closeButtonTitle || 'Close'"
                  :border="closeButtonBorder"
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
            </template>
          </template>
        </HLayout>

        <HLayout
          :id="`hison_modal_body_layout_${id}`"
          :class="['hison-modal-body', ...childClassList]"
        >
          <slot />
        </HLayout>

        <HLayout
          v-if="footerVisibleComputed"
          :id="`hison_modal_footer_layout_${id}`"
          :class="['hison-modal-footer', ...childClassList]"
        >
          <template v-if="$slots.footer">
            <slot name="footer" />
          </template>

          <template v-else>
            <template v-if="footerHasLeft">
              <HLabel
                v-if="showFooterCaptionLeft"
                :id="`hison_modal_caption_label_${id}`"
                :class="['hison-modal-caption', 'hison-pos-left', 'hison-pos-vertical-center', ...childClassList]"
                :text="caption ?? ''"
                :border="captionBorder"
                :background-type="captionBackgroundType"
              />
              <slot
                v-if="showFooterCloseLeft"
                name="close-button"
                :onClick="onClickCloseButton"
                :text="closeButtonText"
                :title="closeButtonTitle || 'Close'"
                :placement="'footer-left'"
              >
                <HButton
                  :id="`hison_modal_close_button_${id}`"
                  :class="['hison-modal-close-btn', 'hison-pos-left', 'hison-pos-vertical-center', 'hison-size-s', 'hison-color-danger']"
                  :text="closeButtonText"
                  :title="closeButtonTitle || 'Close'"
                  :border="closeButtonBorder"
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
            </template>

            <template v-if="footerHasCenter">
              <HLabel
                v-if="showFooterCaptionCenter"
                :id="`hison_modal_caption_label_${id}`"
                :class="['hison-modal-caption', 'hison-pos-center', 'hison-pos-vertical-center', ...childClassList]"
                :text="caption ?? ''"
                :border="captionBorder"
                :background-type="captionBackgroundType"
              />
              <slot
                v-if="showFooterCloseCenter"
                name="close-button"
                :onClick="onClickCloseButton"
                :text="closeButtonText"
                :title="closeButtonTitle || 'Close'"
                :placement="'footer-center'"
              >
                <HButton
                  :id="`hison_modal_close_button_${id}`"
                  :class="['hison-modal-close-btn', 'hison-pos-center', 'hison-pos-vertical-center', 'hison-size-s', 'hison-color-danger']"
                  :text="closeButtonText"
                  :title="closeButtonTitle || 'Close'"
                  :border="closeButtonBorder"
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
            </template>

            <template v-if="footerHasRight">
              <HLabel
                v-if="showFooterCaptionRight"
                :id="`hison_modal_caption_label_${id}`"
                :class="['hison-modal-caption', 'hison-pos-right', 'hison-pos-vertical-center', ...childClassList]"
                :text="caption ?? ''"
                :border="captionBorder"
                :background-type="captionBackgroundType"
              />
              <slot
                v-if="showFooterCloseRight"
                name="close-button"
                :onClick="onClickCloseButton"
                :text="closeButtonText"
                :title="closeButtonTitle || 'Close'"
                :placement="'footer-right'"
              >
                <HButton
                  :id="`hison_modal_close_button_${id}`"
                  :class="['hison-modal-close-btn', 'hison-pos-right', 'hison-pos-vertical-center', 'hison-size-s', 'hison-color-danger']"
                  :text="closeButtonText"
                  :title="closeButtonTitle || 'Close'"
                  :border="closeButtonBorder"
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
            </template>
          </template>
        </HLayout>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, onMounted, onBeforeUnmount, nextTick, unref, watch
} from 'vue'
import { modalProps } from './props'
import type { HModalMethods } from '../../types'
import { BackgroundType, hisonCloser, ScreenPosition, ScreenPositionValue } from '../..'
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
  name: 'HModal',
  props: modalProps,
  inheritAttrs: false,
  emits: [
    'mounted',
    'responsive-change',
    'open',
    'close',
  ],
  setup(props, { emit, slots }) {
    const id = props.id || getUUID()
    const reloadId = `hmodal:${id}`

    const device = useDevice()

    const modalWrapperRef = ref<HTMLDivElement | null>(null)

    const visible = ref<boolean>(props.visible)
    const headerVisible = ref<boolean>(props.headerVisible)
    const footerVisible = ref<boolean>(props.footerVisible)
    const closeBtnVisible = ref<boolean>(props.closeButtonVisible)
    const caption = ref<string | null>(props.caption ?? null)

    const captionBorder = ref<boolean>(props.captionBorder)
    const captionBackgroundType = ref(props.captionBackgroundType)
    const closeButtonBorder = ref<boolean>(props.closeButtonBorder)
    const closeButtonBackgroundType = ref(props.closeButtonBackgroundType)

    const closeClickOverlay = ref<boolean>(props.closeClickOverlay)
    const showOverlay = ref<boolean>(props.showOverlay)
    const scrollLock = ref<boolean>(props.scrollLock)

    const border = ref<boolean>(props.border)
    const backgroundType = ref(props.backgroundType || BackgroundType.empty)

    const buttonPlacement = ref(props.closeButtonPlacement)
    const captionPlacement = ref(props.captionPlacement)

    const zIndex = ref<number>(props.zIndex ?? 1000)
    const modalPosition = ref<ScreenPositionValue>(props.position as ScreenPositionValue)
    const wrapperStyle = computed(() => {
      const s: Record<string, string | number> = {
        zIndex: zIndex.value,
      }
      s.left = ''; s.right = ''; s.top = ''; s.bottom = ''; s.transform = 'none'

      switch (modalPosition.value) {
        case ScreenPosition.topLeft:
          s.left = '0'; s.top = '0'; break

        case ScreenPosition.topCenter:
          s.left = '50%'; s.top = '0'; s.transform = 'translateX(-50%)'; break

        case ScreenPosition.topRight:
          s.right = '0'; s.top = '0'; break

        case ScreenPosition.middleLeft:
          s.left = '0'; s.top = '50%'; s.transform = 'translateY(-50%)'; break

        case ScreenPosition.middleCenter:
          s.left = '50%'; s.top = '50%'; s.transform = 'translate(-50%, -50%)'; break

        case ScreenPosition.middleRight:
          s.right = '0'; s.top = '50%'; s.transform = 'translateY(-50%)'; break

        case ScreenPosition.bottomLeft:
          s.left = '0'; s.bottom = '0'; break

        case ScreenPosition.bottomCenter:
          s.left = '50%'; s.bottom = '0'; s.transform = 'translateX(-50%)'; break

        case ScreenPosition.bottomRight:
          s.right = '0'; s.bottom = '0'; break
      }
      return s
    })

    const overlayStyleWithZ = computed(() => {
      const zi = (zIndex.value ?? 1000) - 1
      const base = { zIndex: zi } as Record<string, string|number>
      const s = props.overlayStyle
      if (!s) return base
      if (Array.isArray(s)) return [{ ...base }, ...s]
      if (typeof s === 'string') return [base, s] as any
      return { ...base, ...(s as Record<string, string|number>) }
    })

    const visibleClass = computed(() => (visible.value ? '' : 'hison-display-none'))

    const backgroundTypeClass = computed(() => {
      switch (backgroundType.value) {
        case 'transparent': return 'hison-bg-transparent'
        case 'filled': return 'hison-bg-filled'
        default: return 'hison-bg-empty'
      }
    })

    const borderClass = computed(() => border.value ? 'hison-border' : '')

    const responsiveClassList = ref<string[]>([])
    const refreshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
      addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
    }

    const childClassList = computed(() => [
      ...extractPrefixedClasses(toClassString(props.class) || '', 'size'),
      ...extractPrefixedClasses(toClassString(props.class) || '', 'color'),
    ])

    const isOverlayVisible = computed(() => visible.value && showOverlay.value)

    const hasHeaderSlot = computed(() => !!slots.header)
    const hasFooterSlot = computed(() => !!slots.footer)

    const sideOf = (placement: string): 'left'|'center'|'right' =>
      (placement.split('-')[1] as any) || 'left'

    const hasCaption = computed(() => !!(caption.value && caption.value.trim().length))

    const showHeaderCaption = computed(() => hasCaption.value && captionPlacement.value.startsWith('header'))
    const showHeaderCloseButton = computed(() => closeBtnVisible.value && buttonPlacement.value.startsWith('header'))

    const showHeaderCaptionLeft   = computed(() => showHeaderCaption.value && sideOf(captionPlacement.value) === 'left')
    const showHeaderCaptionCenter = computed(() => showHeaderCaption.value && sideOf(captionPlacement.value) === 'center')
    const showHeaderCaptionRight  = computed(() => showHeaderCaption.value && sideOf(captionPlacement.value) === 'right')

    const showHeaderCloseLeft   = computed(() => showHeaderCloseButton.value && sideOf(buttonPlacement.value) === 'left')
    const showHeaderCloseCenter = computed(() => showHeaderCloseButton.value && sideOf(buttonPlacement.value) === 'center')
    const showHeaderCloseRight  = computed(() => showHeaderCloseButton.value && sideOf(buttonPlacement.value) === 'right')

    const headerHasLeft   = computed(() => showHeaderCaptionLeft.value   || showHeaderCloseLeft.value)
    const headerHasCenter = computed(() => showHeaderCaptionCenter.value || showHeaderCloseCenter.value)
    const headerHasRight  = computed(() => showHeaderCaptionRight.value  || showHeaderCloseRight.value)

    const showFooterCaption = computed(() => hasCaption.value && captionPlacement.value.startsWith('footer'))
    const showFooterCloseButton = computed(() => closeBtnVisible.value && buttonPlacement.value.startsWith('footer'))

    const showFooterCaptionLeft   = computed(() => showFooterCaption.value && sideOf(captionPlacement.value) === 'left')
    const showFooterCaptionCenter = computed(() => showFooterCaption.value && sideOf(captionPlacement.value) === 'center')
    const showFooterCaptionRight  = computed(() => showFooterCaption.value && sideOf(captionPlacement.value) === 'right')

    const showFooterCloseLeft   = computed(() => showFooterCloseButton.value && sideOf(buttonPlacement.value) === 'left')
    const showFooterCloseCenter = computed(() => showFooterCloseButton.value && sideOf(buttonPlacement.value) === 'center')
    const showFooterCloseRight  = computed(() => showFooterCloseButton.value && sideOf(buttonPlacement.value) === 'right')

    const footerHasLeft   = computed(() => showFooterCaptionLeft.value   || showFooterCloseLeft.value)
    const footerHasCenter = computed(() => showFooterCaptionCenter.value || showFooterCloseCenter.value)
    const footerHasRight  = computed(() => showFooterCaptionRight.value  || showFooterCloseRight.value)

    const headerVisibleComputed = computed(() =>
      headerVisible.value && (
        hasHeaderSlot.value ||
        headerHasLeft.value || headerHasCenter.value || headerHasRight.value
      )
    )
    const footerVisibleComputed = computed(() =>
      footerVisible.value && (
        hasFooterSlot.value ||
        footerHasLeft.value || footerHasCenter.value || footerHasRight.value
      )
    )

    const lockScroll = () => { if (scrollLock.value) acquireScrollLock(id) }
    const unlockScroll = () => { if (scrollLock.value) releaseScrollLock(id) }

    const modalMethods = ref<HModalMethods | null>(null)

    const onOverlayClick = (e: MouseEvent) => {
      if (closeClickOverlay.value) {
        close()
      }
    }

    const onClickCloseButton = (e: MouseEvent) => {
      close()
    }

    const enterClass = ref(props.enterAnimationClass || 'hison-modal-enter')
    const leaveClass = ref(props.leaveAnimationClass || 'hison-modal-leave')

    const modalRef = ref<HTMLDivElement | null>(null)

    const applyEnterAnimation = async () => {
      const el = modalRef.value
      if (!el || !enterClass.value) return
      el.classList.remove(leaveClass.value)
      void el.offsetWidth
      el.classList.add(enterClass.value)
    }
    const applyLeaveAnimation = async () => {
      const el = modalRef.value
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
      emit('open', unref(modalMethods)!)
    }
    const close = async () => {
      if (!visible.value) return
      try {
        await applyLeaveAnimation()
      } finally {
        visible.value = false
        unlockScroll()
        emit('close', unref(modalMethods)!)
      }
    }
    const toggle = async () => (visible.value ? close() : open())

    const mount = () => {
      if (hisonCloser.component.modalList[id] && hisonCloser.component.modalList[id].isHisonvueComponent) console.warn(`[Hisonvue] The modal ID is at risk of being duplicated. ${id}`)
      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })

      refreshResponsiveClassList()

      if (visible.value) {
        lockScroll()
        nextTick(applyEnterAnimation)
      }

      modalMethods.value = {
        isHisonvueComponent: true,
        getId: () => id,
        getType: () => 'modal',
        isVisible: () => visible.value,
        open, close, toggle,
        setVisible: (v: boolean) => (v ? open() : close()),
        getZIndex: () => zIndex.value,
        setZIndex: (v: number) => { zIndex.value = v },
        getPosition: () => modalPosition.value,
        setPosition: (v) => { modalPosition.value = v as ScreenPositionValue },
        isHeaderVisible: () => headerVisible.value,
        setHeaderVisible: (v: boolean) => { headerVisible.value = v },
        isFooterVisible: () => footerVisible.value,
        setFooterVisible: (v: boolean) => { footerVisible.value = v },
        getCaption: () => caption.value || '',
        setCaption: (t: string | null) => { caption.value = t },
        isCaptionBorder: () => captionBorder.value,
        setCaptionBorder: (v: boolean) => { captionBorder.value = v },
        getCaptionBackgroundType: () => captionBackgroundType.value as any,
        setCaptionBackgroundType: (t: any) => { captionBackgroundType.value = t },
        isCloseButtonVisible: () => closeBtnVisible.value,
        setCloseButtonVisible: (v: boolean) => { closeBtnVisible.value = v },
        isCloseButtonBorder: () => closeButtonBorder.value,
        setCloseButtonBorder: (v: boolean) => { closeButtonBorder.value = v },
        getCloseButtonBackgroundType: () => closeButtonBackgroundType.value as any,
        setCloseButtonBackgroundType: (t: any) => { closeButtonBackgroundType.value = t },
        getButtonPlacement: () => buttonPlacement.value,
        setButtonPlacement: (p) => { buttonPlacement.value = p },
        getCaptionPlacement: () => captionPlacement.value,
        setCaptionPlacement: (p) => { captionPlacement.value = p },
        isCloseClickOverlay: () => closeClickOverlay.value,
        setCloseClickOverlay: (v) => { closeClickOverlay.value = v },
        isOverlayShown: () => showOverlay.value,
        setOverlayShown: (v: boolean) => { showOverlay.value = v },
        isBorder: () => border.value,
        setBorder: (v: boolean) => { border.value = v },
        getBackgroundType: () => backgroundType.value as any,
        setBackgroundType: (t: any) => { backgroundType.value = t },
        isScrollLocked: () => scrollLock.value,
        setScrollLock: (v: boolean) => {
          scrollLock.value = v
          if (visible.value) (v ? lockScroll() : unlockScroll())
        },
        getAnimationClasses: () => ({ enter: enterClass.value, leave: leaveClass.value }),
        setAnimationClasses: (opt) => {
          if ('enter' in opt) enterClass.value = opt.enter || ''
          if ('leave' in opt) leaveClass.value = opt.leave || ''
        },

        reload: () => reloadHisonComponent(reloadId),
      }

      hisonCloser.component.modalList[id] = modalMethods.value
      emit('mounted', modalMethods.value)
    }

    const unmount = () => {
      unregisterReloadable(reloadId)
      delete hisonCloser.component.modalList[id]
      if (visible.value) unlockScroll()
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(device, (newDevice) => {
      refreshResponsiveClassList()
      emit('responsive-change', newDevice)
    })
    
    watch(() => props.visible, v => { const b = !!v; if (b && !visible.value) open(); else if (!b && visible.value) close() })
    watch(() => props.headerVisible, v => { const b = !!v; if (b !== headerVisible.value) headerVisible.value = b })
    watch(() => props.footerVisible, v => { const b = !!v; if (b !== footerVisible.value) footerVisible.value = b })
    watch(() => props.closeButtonVisible, v => { const b = !!v; if (b !== closeBtnVisible.value) closeBtnVisible.value = b })
    watch(() => props.caption, v => { const s = v ?? null; if (s !== caption.value) caption.value = s })
    watch(() => props.captionBorder, v => { const b = !!v; if (b !== captionBorder.value) captionBorder.value = b })
    watch(() => props.captionBackgroundType, v => { if (v && v !== captionBackgroundType.value) captionBackgroundType.value = v as any })
    watch(() => props.closeButtonBorder, v => { const b = !!v; if (b !== closeButtonBorder.value) closeButtonBorder.value = b })
    watch(() => props.closeButtonBackgroundType, v => { if (v && v !== closeButtonBackgroundType.value) closeButtonBackgroundType.value = v as any })
    watch(() => props.closeButtonPlacement, v => { if (v && v !== buttonPlacement.value) buttonPlacement.value = v })
    watch(() => props.captionPlacement, v => { if (v && v !== captionPlacement.value) captionPlacement.value = v })
    watch(() => props.closeClickOverlay, v => { const b = !!v; if (b !== closeClickOverlay.value) closeClickOverlay.value = b })
    watch(() => props.showOverlay, v => { const b = !!v; if (b !== showOverlay.value) showOverlay.value = b })
    watch(() => props.scrollLock, v => { const b = !!v; if (b !== scrollLock.value) { scrollLock.value = b; if (visible.value) (b ? lockScroll() : unlockScroll()) } })
    watch(() => props.border, v => { const b = !!v; if (b !== border.value) border.value = b })
    watch(() => props.backgroundType, v => { if (v && v !== backgroundType.value) backgroundType.value = v as any })
    watch(() => props.zIndex, v => { const n = Number(v ?? 1300); if (n !== zIndex.value) zIndex.value = n })
    watch(() => props.position, v => { if (v && v !== modalPosition.value) modalPosition.value = v as any })
    watch(() => props.enterAnimationClass, v => { const s = v || 'hison-modal-enter'; if (s !== enterClass.value) enterClass.value = s })
    watch(() => props.leaveAnimationClass, v => { const s = v || 'hison-modal-leave'; if (s !== leaveClass.value) leaveClass.value = s })
    watch(() => props.class, () => { refreshResponsiveClassList() })

    return {
      id,
      props,
      modalRef,
      modalWrapperRef,
      caption,
      responsiveClassList,
      visibleClass,
      borderClass,
      backgroundTypeClass,
      isOverlayVisible,
      headerVisibleComputed,
      footerVisibleComputed,
      headerHasLeft, headerHasCenter, headerHasRight,
      showHeaderCaptionLeft, showHeaderCaptionCenter, showHeaderCaptionRight,
      showHeaderCloseLeft, showHeaderCloseCenter, showHeaderCloseRight,
      footerHasLeft, footerHasCenter, footerHasRight,
      showFooterCaptionLeft, showFooterCaptionCenter, showFooterCaptionRight,
      showFooterCloseLeft, showFooterCloseCenter, showFooterCloseRight,
      childClassList,
      overlayStyleWithZ,
      wrapperStyle,
      onOverlayClick,
      onClickCloseButton,
      modalMethods: computed(() => unref(modalMethods)),
      closeButtonVisible: closeBtnVisible,
      buttonPlacement,
      captionPlacement,
      closeButtonText: props.closeButtonText,
      closeButtonTitle: props.closeButtonTitle,
      closeButtonBorder,
      closeButtonBackgroundType,
      captionBorder,
      captionBackgroundType,
    }
  }
})
</script>

<style scoped></style>
