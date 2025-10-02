<!-- src/components/HBanner/HBanner.vue -->
<template>
    <div
        :class="[
            'hison-wrapper',
            ...responsiveClassList,
            visibleClass,
        ]"
    >
        <div
            :class="[
            'hison-banner',
            borderClass,
            backgroundTypeClass
            ]"
            :style="props.style"
            @mouseenter="onMouseEnter"
            @mouseleave="onMouseLeave"
            @touchstart.passive="onTouchStart"
            @touchmove.prevent="onTouchMove"
            @touchend.passive="onTouchEnd"
        >
            <div class="hison-banner-viewport">
                <div
                    ref="trackRef"
                    class="hison-banner-track"
                    :style="trackStyle"
                >
                    <div
                    v-for="(node, i) in slideNodes"
                    :key="i"
                    class="hison-banner-slide"
                    >
                    <component :is="node" />
                    </div>
                </div>
            </div>
            <div
            v-if="showNavButtons && slideCount > 1"
            class="hison-banner-nav"
            >
                <div class="hison-banner-nav-prev">
                    <slot name="prev-button" :prev="goPrev" :disabled="isPrevDisabled">
                    <HButton
                        :id="`hison_banner_prev_button_${id}`"
                        :disable="isPrevDisabled"
                        :class="['hison-col-12', ...buttonClassList]"
                        :background-type="'transparent'"
                        :border="false"
                        @click="goPrev"
                    >
                        <template #icon>
                        <span v-if="navButtonStyle === 'chevron'">〈</span>
                        <span v-else-if="navButtonStyle === 'triangle'">◀</span>
                        </template>
                    </HButton>
                    </slot>
                </div>
                <div class="hison-banner-nav-next">
                    <slot name="next-button" :next="goNext" :disabled="isNextDisabled">
                    <HButton
                        :id="`hison_banner_next_button_${id}`"
                        :disable="isNextDisabled"
                        :class="['hison-col-12', ...buttonClassList]"
                        :background-type="'transparent'"
                        :border="false"
                        @click="goNext"
                    >
                        <template #icon>
                        <span v-if="navButtonStyle === 'chevron'">〉</span>
                        <span v-else-if="navButtonStyle === 'triangle'">▶</span>
                        </template>
                    </HButton>
                    </slot>
                </div>
            </div>
            <div
                v-if="showIndicators && slideCount > 0"
                class="hison-banner-indicators"
                :class="[indicatorsPositionClass]"
            >
                <button
                    v-for="i in slideCount"
                    :key="i"
                    class="hison-banner-indicator"
                    :class="{ active: currentIndex === (i - 1), 'no-pointer': !indicatorClickable }"
                    :title="`Go to ${i}`"
                    type="button"
                    @click="indicatorClickable ? goTo(i - 1) : null"
                >
                    ●
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, nextTick, onMounted, onBeforeUnmount, watch, useSlots, VNode, unref
} from 'vue'
import type { HBannerMethods } from '../../types'
import { bannerProps } from './props'
import { BackgroundType, type BackgroundTypeValue, hisonCloser } from '../..'
import {
  extractResponsiveClasses,
  addComponentNameToClass,
  getIndexSpecificClassNameFromClassList,
  getUUID,
  registerReloadable,
  reloadHisonComponent,
  toClassString,
  extractPrefixedClasses
} from '../../utils'
import { useDevice } from '../../core'
import HButton from '../HButton/HButton.vue'
import type { CSSProperties } from 'vue'

export default defineComponent({
  name: 'HBanner',
  components: { HButton },
  props: bannerProps,
  emits: [
    'mounted',
    'responsive-change',
    'change',
    'next',
    'prev',
    'autoplay-start',
    'autoplay-stop'
  ],
  setup(props, { emit }) {
    const id = props.id ? props.id : getUUID()
    const reloadId = `hbanner:${id}`
    const device = useDevice()
    const slots = useSlots()
    const bannerMethods = ref<HBannerMethods | null>(null)
    const trackRef = ref<HTMLDivElement | null>(null)

    const visible = ref<boolean>(props.visible)
    const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')

    const border = ref<boolean>(props.border ?? false)
    const borderClass = computed(() => (border.value ? 'hison-border' : ''))

    const backgroundType = ref<BackgroundType | BackgroundTypeValue>(props.backgroundType)
    const backgroundTypeClass = computed(() => {
      switch (backgroundType.value) {
        case BackgroundType.empty: return 'hison-bg-empty'
        case BackgroundType.transparent: return 'hison-bg-transparent'
        default: return 'hison-bg-filled'
      }
    })

    const navButtonStyle = ref<'chevron' | 'triangle'>(props.navButtonStyle)
    const showNavButtons = ref<boolean>(props.showNavButtons)
    const showIndicators = ref<boolean>(props.showIndicators)
    const indicatorsPosition = ref<'bottom' | 'overlay'>(props.indicatorsPosition)
    const indicatorsPositionClass = computed(() =>
        indicatorsPosition.value === 'overlay'
            ? 'hison-banner-indicators-overlay'
            : 'hison-banner-indicators-bottom'
    )
    const indicatorClickable = ref<boolean>(props.indicatorClickable)

    const autoIntervalMs = ref<number>(props.autoIntervalMs)
    const autoDirection = ref<'next' | 'prev'>(props.autoDirection)
    const loop = ref<boolean>(props.loop)
    const pauseOnHover = ref<boolean>(props.pauseOnHover)
    const transitionMs = ref<number>(props.transitionMs)
    let autoplayTimer: number | undefined

    const currentIndex = ref<number>(0)

    const initialIndex = ref<number>(props.initialIndex ?? 0)

    const slideNodes = computed<VNode[]>(() => {
      const nodes = slots.default?.() ?? []
      return nodes
    })
    const slideCount = computed(() => slideNodes.value.length)

    const responsiveClassList = ref<string[]>([])
    const refreshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
      if (getIndexSpecificClassNameFromClassList(responsiveClassList.value, 'col') === -1) {
        responsiveClassList.value.push('hison-col-12')
      }
      addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
    }
    const buttonClassList = computed(() => {
      const classList: string[] = []
      classList.push(...extractPrefixedClasses(toClassString(props.class) || '', 'size'))
      classList.push(...extractPrefixedClasses(toClassString(props.class) || '', 'color'))
      return classList
    })

    const isPrevDisabled = computed(() => !loop.value && currentIndex.value <= 0)
    const isNextDisabled = computed(() => !loop.value && currentIndex.value >= Math.max(0, slideCount.value - 1))

    const trackStyle = computed<CSSProperties>(() => {
      const translate = `translateX(${-currentIndex.value * 100}%)`
      return {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        transform: translate,
        transition: `transform ${Math.max(0, transitionMs.value)}ms ease`
      }
    })

    const clampIndex = (idx: number) => {
      if (slideCount.value <= 0) return 0
      if (loop.value) {
        const c = slideCount.value
        return ((idx % c) + c) % c
      }
      return Math.min(Math.max(0, idx), slideCount.value - 1)
    }

    const goTo = (idx: number) => {
      const prev = currentIndex.value
      const next = clampIndex(idx)
      if (prev === next) return
      currentIndex.value = next
      emit('change', next, bannerMethods.value)
    }

    const goPrev = () => {
      if (!loop.value && isPrevDisabled.value) return
      const next = clampIndex(currentIndex.value - 1)
      currentIndex.value = next
      emit('prev', next, bannerMethods.value)
      emit('change', next, bannerMethods.value)
    }

    const goNext = () => {
      if (!loop.value && isNextDisabled.value) return
      const next = clampIndex(currentIndex.value + 1)
      currentIndex.value = next
      emit('next', next, bannerMethods.value)
      emit('change', next, bannerMethods.value)
    }

    const clearAutoplay = () => {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer)
        autoplayTimer = undefined
        emit('autoplay-stop', bannerMethods.value)
      }
    }
    const startAutoplay = () => {
      clearAutoplay()
      const ms = Number(autoIntervalMs.value)
      if (!Number.isFinite(ms) || ms < 100 || slideCount.value <= 1) return
      autoplayTimer = window.setInterval(() => {
        if (autoDirection.value === 'prev') goPrev()
        else goNext()
      }, ms)
      emit('autoplay-start', bannerMethods.value)
    }

    const onMouseEnter = () => { if (pauseOnHover.value) clearAutoplay() }
    const onMouseLeave = () => { if (pauseOnHover.value) startAutoplay() }

    const touchStartX = ref<number | null>(null)
    const touchDeltaX = ref<number>(0)
    const onTouchStart = (e: TouchEvent) => {
      if (!e.touches || e.touches.length !== 1) return
      touchStartX.value = e.touches[0].clientX
      touchDeltaX.value = 0
    }
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartX.value == null || !e.touches || e.touches.length !== 1) return
      touchDeltaX.value = e.touches[0].clientX - touchStartX.value
    }
    const onTouchEnd = () => {
      const threshold = 40
      if (Math.abs(touchDeltaX.value) > threshold) {
        if (touchDeltaX.value > 0) goPrev()
        else goNext()
      }
      touchStartX.value = null
      touchDeltaX.value = 0
    }

    const mount = () => {
      if (hisonCloser.component.bannerList[id] && hisonCloser.component.bannerList[id].isHisonvueComponent) console.warn(`[Hisonvue] The banner ID is at risk of being duplicated. ${id}`)
      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })
      refreshResponsiveClassList()

      bannerMethods.value = {
        isHisonvueComponent: true,
        getId: () => id,
        getType: () => 'banner',
        isVisible: () => visible.value,
        setVisible: (val: boolean) => { visible.value = val },
        isBorder: () => border.value,
        setBorder: (val: boolean) => { border.value = val },
        getBackgroundType: () => backgroundType.value,
        setBackgroundType: (type: BackgroundType | BackgroundTypeValue) => { backgroundType.value = type },
        getCurrentIndex: () => currentIndex.value,
        setCurrentIndex: (i: number) => { goTo(i) },
        getInitialIndex: () => initialIndex.value,
        setInitialIndex: (i: number) => {
          initialIndex.value = Number.isFinite(i) ? Math.max(0, Math.trunc(i)) : 0
          goTo(initialIndex.value)
        },
        getSlideCount: () => slideCount.value,
        next: () => { goNext() },
        prev: () => { goPrev() },
        goTo: (i: number) => { goTo(i) },
        getNavButtonStyle: () => navButtonStyle.value,
        setNavButtonStyle: (s: 'chevron' | 'triangle') => { navButtonStyle.value = s },
        isShowNavButtons: () => showNavButtons.value,
        setShowNavButtons: (v: boolean) => { showNavButtons.value = v },
        isShowIndicators: () => showIndicators.value,
        setShowIndicators: (v: boolean) => { showIndicators.value = v },
        getIndicatorsPosition: () => indicatorsPosition.value,
        setIndicatorsPosition: (p: 'bottom' | 'overlay') => { indicatorsPosition.value = p },
        isIndicatorClickable: () => indicatorClickable.value,
        setIndicatorClickable: (v: boolean) => { indicatorClickable.value = v },
        getAutoInterval: () => autoIntervalMs.value,
        setAutoInterval: (ms: number) => {
          autoIntervalMs.value = Number(ms)
          if (autoplayTimer) startAutoplay()
        },
        getAutoDirection: () => autoDirection.value,
        setAutoDirection: (d: 'next' | 'prev') => { autoDirection.value = d },
        isLoop: () => loop.value,
        setLoop: (v: boolean) => { loop.value = v },
        isPauseOnHover: () => pauseOnHover.value,
        setPauseOnHover: (v: boolean) => { pauseOnHover.value = v },
        startAuto: () => { startAutoplay() },
        stopAuto: () => { clearAutoplay() },
        getTransitionMs: () => transitionMs.value,
        setTransitionMs: (ms: number) => { transitionMs.value = Math.max(0, Number(ms) || 0) },
        reload: () => reloadHisonComponent(reloadId),
      }

      hisonCloser.component.bannerList[id] = bannerMethods.value
      emit('mounted', bannerMethods.value)

      currentIndex.value = clampIndex(initialIndex.value)
      startAutoplay()
    }

    const unmount = () => {
      clearAutoplay()
      delete hisonCloser.component.bannerList[id]
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(device, (newDevice) => {
      refreshResponsiveClassList()
      emit('responsive-change', newDevice)
    })

    watch(() => props.visible, v => visible.value = v)
    watch(() => props.border, v => border.value = !!v)
    watch(() => props.backgroundType, v => backgroundType.value = v)
    watch(() => props.navButtonStyle, v => navButtonStyle.value = v)
    watch(() => props.showNavButtons, v => showNavButtons.value = v)
    watch(() => props.showIndicators, v => showIndicators.value = v)
    watch(() => props.indicatorsPosition, v => { indicatorsPosition.value = v })
    watch(() => props.indicatorClickable, v => indicatorClickable.value = v)
    watch(() => props.transitionMs, v => transitionMs.value = v)
    watch(() => props.autoIntervalMs, v => {
      autoIntervalMs.value = v
      if (autoplayTimer) startAutoplay()
    })
    watch(() => props.autoDirection, v => autoDirection.value = v)
    watch(() => props.loop, v => loop.value = v)
    watch(() => props.pauseOnHover, v => pauseOnHover.value = v)
    watch(() => props.initialIndex, (v) => {
      const i = Number.isFinite(v as number) ? Math.max(0, Math.trunc(v as number)) : 0
      initialIndex.value = i
      goTo(i)
    })
    watch(() => props.class, () => {
      refreshResponsiveClassList()
    })

    return {
      id,
      props,
      bannerMethods: computed(() => unref(bannerMethods)),

      visibleClass,
      borderClass,
      backgroundTypeClass,
      responsiveClassList,
      buttonClassList,

      slideNodes,
      slideCount,
      currentIndex,

      navButtonStyle,
      showNavButtons,
      showIndicators,
      indicatorsPositionClass,
      indicatorClickable,
      isPrevDisabled,
      isNextDisabled,

      trackStyle,
      trackRef,

      goPrev,
      goNext,
      goTo,
      onMouseEnter,
      onMouseLeave,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    }
  }
})
</script>

<style scoped></style>
