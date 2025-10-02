<template>
    <div
        :class="[
        'hison-pagination',
        ...responsiveClassList,
        visibleClass,
        ]"
        :style="containerStyle"
    >
        <HButton
            v-if="showFirst"
            :id="`hison_pagination_first_${id}`"
            :disable="isFirstDisabled || disableAll"
            :class="[...buttonClassList]"
            :border="border"
            :background-type="backgroundType"
            :click-interval="clickInterval"
            :tabindex="tabIndex ?? undefined"
            title="First"
            @click="(e, btn) => { goFirst(); emitNav('first','click', e, btn) }"
            @mouseover="(e, btn) => emitNav('first','mouseover', e, btn)"
            @mouseout="(e, btn) => emitNav('first','mouseout', e, btn)"
        >
            <template v-if="$slots.first">
                <slot name="first" :goFirst="goFirst" />
            </template>
            <template v-else>«</template>
        </HButton>

        <HButton
            v-if="showPrev"
            :id="`hison_pagination_prev_${id}`"
            :disable="isPrevDisabled || disableAll"
            :class="[...buttonClassList]"
            :border="border"
            :background-type="backgroundType"
            :click-interval="clickInterval"
            :tabindex="tabIndex ?? undefined"
            title="Previous"
            @click="(e, btn) => { goPrev(); emitNav('prev','click', e, btn) }"
            @mouseover="(e, btn) => emitNav('prev','mouseover', e, btn)"
            @mouseout="(e, btn) => emitNav('prev','mouseout', e, btn)"
        >
            <template v-if="$slots.prev">
                <slot name="prev" :goPrev="goPrev" />
            </template>
            <template v-else>‹</template>
        </HButton>

        <template v-for="p in pageWindow" :key="`p-${p}`">
            <HButton
                :id="`hison_pagination_page_${p}_${id}`"
                :disable="disableAll"
                :class="[ ...buttonClassList, p === currentPage ? activeButtonClass : '' ]"
                :border="border"
                :background-type="backgroundType"
                :click-interval="clickInterval"
                :title="String(p)"
            @click="(e, btn) => { goPage(p); emitPageEvt('click', p, e, btn) }"
            @mouseover="(e, btn) => emitPageEvt('mouseover', p, e, btn)"
            @mouseout="(e, btn) => emitPageEvt('mouseout', p, e, btn)"
            >
                <template v-if="$slots.page">
                <slot name="page" :page="p" :goPage="goPage" :isActive="p === currentPage" />
                </template>
                <template v-else>{{ p }}</template>
            </HButton>
        </template>

        <HButton
            v-if="showNext"
            :id="`hison_pagination_next_${id}`"
            :disable="isNextDisabled || disableAll"
            :class="[...buttonClassList]"
            :border="border"
            :background-type="backgroundType"
            :click-interval="clickInterval"
            :tabindex="tabIndex ?? undefined"
            title="Next"
            @click="(e, btn) => { goNext(); emitNav('next','click', e, btn) }"
            @mouseover="(e, btn) => emitNav('next','mouseover', e, btn)"
            @mouseout="(e, btn) => emitNav('next','mouseout', e, btn)"
        >
            <template v-if="$slots.next">
                <slot name="next" :goNext="goNext" />
            </template>
            <template v-else>›</template>
        </HButton>

        <HButton
            v-if="showLast"
            :id="`hison_pagination_last_${id}`"
            :disable="isLastDisabled || disableAll"
            :class="[...buttonClassList]"
            :border="border"
            :background-type="backgroundType"
            :click-interval="clickInterval"
            :tabindex="tabIndex ?? undefined"
            title="Last"
            @click="(e, btn) => { goLast(); emitNav('last','click', e, btn) }"
            @mouseover="(e, btn) => emitNav('last','mouseover', e, btn)"
            @mouseout="(e, btn) => emitNav('last','mouseout', e, btn)"
        >
            <template v-if="$slots.last">
                <slot name="last" :goLast="goLast" />
            </template>
            <template v-else>»</template>
        </HButton>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { paginationProps } from './props'
import type { HPaginationMethods } from '../../types'
import { BackgroundType, BackgroundTypeValue, hisonCloser } from '../..'
import { getUUID, extractResponsiveClasses, addComponentNameToClass, toClassString, registerReloadable, reloadHisonComponent, unregisterReloadable, extractPrefixedClasses } from '../../utils'
import { useDevice } from '../../core'
import HButton from '../HButton/HButton.vue'

export default defineComponent({
    name: 'HPagination',
    components: { HButton },
    props: paginationProps,
    emits: [
        'mounted', 'responsive-change', 'update:modelValue', 'change',
        'first-click', 'first-mouseover', 'first-mouseout',
        'prev-click',  'prev-mouseover',  'prev-mouseout',
        'next-click',  'next-mouseover',  'next-mouseout',
        'last-click',  'last-mouseover',  'last-mouseout',
        'page-click', 'page-mouseover', 'page-mouseout'
    ],
    setup(props, { emit }) {
        const id = props.id ? props.id : getUUID()
        const reloadId = `hpagination:${id}`
        const apiRef = ref<HPaginationMethods | null>(null)

        const device = useDevice()
        const responsiveClassList = ref<string[]>([])
        const refreshResponsiveClassList = () => {
        responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
            addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
            addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
        }
        const buttonClassList = computed(() => {
            const classList = []
            classList.push(...extractPrefixedClasses(toClassString(props.class) || '', 'size'))
            classList.push(...extractPrefixedClasses(toClassString(props.class) || '', 'color'))
            return classList
        })

        const visible = ref(!!props.visible)
        const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')

        const normalizeGap = (v: any) => (typeof v === 'number' ? `${v}px` : (v ?? '0.25rem'))
        const gap = ref<string>(normalizeGap(props.gap))

        const containerStyle = computed(() => {
            const gapStyle = { gap: gap.value }
            const base = props.style
            if (Array.isArray(base)) return [...base, gapStyle]
            if (typeof base === 'string') return [base, gapStyle]
            return { ...(base as any), ...gapStyle }
        })

        const border = ref<boolean>(!!props.border)
        const backgroundType = ref<BackgroundTypeValue>(props.backgroundType as any)
        const clickInterval = ref<number>(Number(props.clickInterval || 0))

        const disableAll = computed(() => !!props.disable)

        const tabIndex = ref<number | null>(
            props.tabIndex !== null && props.tabIndex !== '' ? Number(props.tabIndex) : null
        )

        const currentPage = ref<number>(normalizePage(props.modelValue))
        function normalizePage(p: any) {
            const n = Number(p)
            return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1
        }

        const totalPages = computed<number>(() => {
            if (props.totalPages && props.totalPages > 0) return Math.floor(props.totalPages)
            const items = Math.max(0, Number(props.totalItems || 0))
            const size = Math.max(1, Number(props.pageSize || 10))
            return Math.max(1, Math.ceil(items / size))
        })

        const isFirstDisabled = computed(() => currentPage.value <= 1)
        const isPrevDisabled  = computed(() => currentPage.value <= 1)
        const isNextDisabled  = computed(() => currentPage.value >= totalPages.value)
        const isLastDisabled  = computed(() => currentPage.value >= totalPages.value)

        const showPrev  = ref(!!props.showPrev)
        const showNext  = ref(!!props.showNext)
        const showFirst = ref(!!props.showFirst)
        const showLast  = ref(!!props.showLast)

        const maxButtons = computed(() => Math.max(3, Number(props.maxButtons || 7)))
        const pageWindow = computed<number[]>(() => {
            const total = totalPages.value
            const cur = Math.min(Math.max(1, currentPage.value), total)
            const max = maxButtons.value

            if (total <= max) {
                return Array.from({ length: total }, (_, i) => i + 1)
            }

            const half = Math.floor(max / 2)
            let start = cur - half
            let end = start + max - 1

            if (start < 1) {
                start = 1
                end = max
            }
            if (end > total) {
                end = total
                start = total - max + 1
            }
            const arr: number[] = []
            for (let p = start; p <= end; p++) arr.push(p)
            return arr
        })

        const activeButtonClass = computed(() => 'hison-pagination-button-active')

        const emitNav = (
            type: 'first'|'prev'|'next'|'last',
            evtName: 'click'|'mouseover'|'mouseout',
            e: MouseEvent,
            btn: any
        ) => {
            emit(`${type}-${evtName}` as any, {
                event: e,
                button: btn,
                api: apiRef.value,
                currentPage: currentPage.value,
                totalPages: totalPages.value,
            })
        }
        const emitPageEvt = (
            evtName: 'click'|'mouseover'|'mouseout',
            page: number,
            e: MouseEvent,
            btn: any
        ) => {
            emit(`page-${evtName}` as any, {
                event: e,
                page,
                isActive: page === currentPage.value,
                button: btn,
                api: apiRef.value,
            })
        }

        const goPage = (p: number) => {
            const total = totalPages.value
            const target = Math.min(Math.max(1, Math.floor(p)), total)
            if (target === currentPage.value) return
            currentPage.value = target
            emit('update:modelValue', target)
            emit('change', target, apiRef.value)
        }
        const goPrev  = () => { if (!isPrevDisabled.value)  goPage(currentPage.value - 1) }
        const goNext  = () => { if (!isNextDisabled.value)  goPage(currentPage.value + 1) }
        const goFirst = () => { if (!isFirstDisabled.value) goPage(1) }
        const goLast  = () => { if (!isLastDisabled.value)  goPage(totalPages.value) }

        const tryFocus = (btnId: string): boolean => {
            const btn = hisonCloser.component.buttonList[btnId]
            if (!btn) return false
            btn.focus()
            return true
        }
        const focus = () => {
            const ids = [
                `hison_pagination_page_${currentPage.value}_${id}`,
                `hison_pagination_prev_${id}`,
                `hison_pagination_next_${id}`,
                `hison_pagination_first_${id}`,
                `hison_pagination_last_${id}`,
            ]
            for (const bid of ids) { if (tryFocus(bid)) break }
        }

        const mount = () => {
            if (hisonCloser.component.paginationList[id] && hisonCloser.component.paginationList[id].isHisonvueComponent) console.warn(`[Hisonvue] The pagination ID is at risk of being duplicated. ${id}`)

            registerReloadable(reloadId, () => {
                unmount()
                nextTick(mount)
            })

            refreshResponsiveClassList()

            apiRef.value = {
                isHisonvueComponent: true,
                getId: () => id,
                getType: () => 'pagination',
                isVisible: () => visible.value,
                setVisible: (v: boolean) => { visible.value = v },

                getGap: () => gap.value,
                setGap: (v: number | string) => { gap.value = normalizeGap(v) },

                getCurrentPage: () => currentPage.value,
                setCurrentPage: (p: number) => { goPage(p) },

                getTotalPages: () => totalPages.value,
                setTotalPages: (tp: number) => {
                const cur = Math.min(Math.max(1, currentPage.value), Math.max(1, Math.floor(tp)))
                if (cur !== currentPage.value) {
                    currentPage.value = cur
                    emit('update:modelValue', cur)
                    emit('change', cur, apiRef.value)
                }
                },

                getTotalItems: () => Number(props.totalItems || 0),
                getPageSize: () => Number(props.pageSize || 10),

                goPrev, goNext, goFirst, goLast,

                isShowPrev:   () => showPrev.value,
                setShowPrev:  (v: boolean) => { showPrev.value  = !!v },
                isShowNext:   () => showNext.value,
                setShowNext:  (v: boolean) => { showNext.value  = !!v },
                isShowFirst:  () => showFirst.value,
                setShowFirst: (v: boolean) => { showFirst.value = !!v },
                isShowLast:   () => showLast.value,
                setShowLast:  (v: boolean) => { showLast.value  = !!v },

                isBorder: () => border.value,
                setBorder: (v: boolean) => { border.value = v },
                getBackgroundType: () => backgroundType.value,
                setBackgroundType: (t: BackgroundType | BackgroundTypeValue) => { backgroundType.value = t as any },
                getClickInterval: () => clickInterval.value,
                setClickInterval: (ms: number) => { clickInterval.value = Number(ms) || 0 },

                getTabIndex: () => tabIndex.value,
                setTabIndex: (v: number | null) => { tabIndex.value = v !== null && v !== undefined ? Number(v) : null },

                focus,
                reload: () => reloadHisonComponent(reloadId),
            }

            hisonCloser.component.paginationList[id] = apiRef.value
            emit('mounted', apiRef.value)
        }

        const unmount = () => {
            unregisterReloadable(reloadId)
            delete hisonCloser.component.paginationList[id]
        }

        onMounted(mount)
        onBeforeUnmount(unmount)

        watch(device, (d) => {
            refreshResponsiveClassList()
            emit('responsive-change', d)
        })
        watch(() => props.class, refreshResponsiveClassList)
        watch(() => props.gap, v => {
            const nv = normalizeGap(v)
            if (nv !== gap.value) gap.value = nv
        })
        watch(() => props.visible, v => { const nv = !!v; if (nv !== visible.value) visible.value = nv })
        watch(() => props.border, v => { const b = !!v; if (b !== border.value) border.value = b })
        watch(() => props.backgroundType, v => {
            const nv = v as any
            if (nv !== backgroundType.value) backgroundType.value = nv
        })
        watch(() => props.clickInterval, v => {
            const n = Number(v) || 0
            if (n !== clickInterval.value) clickInterval.value = n
        })
        watch(() => props.modelValue, v => {
            const np = normalizePage(v)
            if (np !== currentPage.value) currentPage.value = np
        })
        watch([() => props.totalItems, () => props.pageSize, () => props.totalPages], () => {
            const total = totalPages.value
            if (currentPage.value > total) {
                currentPage.value = total
                emit('update:modelValue', total)
                emit('change', total, apiRef.value)
            }
        })
        watch(() => props.showPrev,  v => { const b = !!v; if (b !== showPrev.value)  showPrev.value  = b })
        watch(() => props.showNext,  v => { const b = !!v; if (b !== showNext.value)  showNext.value  = b })
        watch(() => props.showFirst, v => { const b = !!v; if (b !== showFirst.value) showFirst.value = b })
        watch(() => props.showLast,  v => { const b = !!v; if (b !== showLast.value)  showLast.value  = b })

        return {
            id,
            props,
            containerStyle,
            responsiveClassList,
            buttonClassList,
            visibleClass,
            border,
            backgroundType,
            clickInterval,
            tabIndex,
            disableAll,

            currentPage,
            totalPages,

            isFirstDisabled,
            isPrevDisabled,
            isNextDisabled,
            isLastDisabled,

            pageWindow,
            activeButtonClass,
            showPrev, showNext, showFirst, showLast,

            emitNav, emitPageEvt,
            goPrev, goNext, goFirst, goLast, goPage,
        }
    }
})
</script>

<style scoped></style>
