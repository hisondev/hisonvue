<template>
  <div
    :class="[
        'hison-wrapper',
        ...responsiveClassList,
        visibleClass,
    ]"
  >
    <component
        :is="renderTag"
        ref="labelRef"
        :class="[
            'hison-label',
            hasHref ? 'hison-label-link' : null,
            hasToggleTarget ? 'hison-label-has-toggle-target' : null,
            fontBoldClass,
            fontItalicClass,
            fontThrulineClass,
            fontUnderlineClass,
            borderClass,
            backgroundTypeClass,
            translateClass
        ]"
        :style="[textAlignStyle, props.style]"
        :title="title || undefined"
        :tabindex="tabIndex ?? undefined"
        :translate="translateAttr"
        v-bind="renderTag === 'a' ? computedAnchorAttrs : undefined"
        @click="onClick"
        @mousedown="$emit('mousedown', $event, labelMethods)"
        @mouseup="$emit('mouseup', $event, labelMethods)"
        @mouseover="$emit('mouseover', $event, labelMethods)"
        @mouseout="$emit('mouseout', $event, labelMethods)"
        @keydown.enter.prevent="onKeyActivate"
        @keydown.space.prevent="onKeyActivate"
    >
        <template v-if="hasElementSlot">
            <slot />
        </template>

        <template v-else-if="hasHref">
            {{ internalText }}
        </template>

        <template v-else>
            <span class="hison-label-text">{{ internalText }}</span>
        </template>
    </component>
  </div>
</template>

<script lang="ts">
import {
    defineComponent, computed, ref, onMounted, onBeforeUnmount, nextTick, useSlots, unref, watch, Text
} from 'vue'
import { labelProps } from './props'
import { BackgroundType, TextAlign, TextAlignValue } from '../..'
import {
    extractResponsiveClasses,
    getUUID,
    addComponentNameToClass,
    registerReloadable,
    reloadHisonComponent,
    toClassString,
    unregisterReloadable
} from '../../utils'
import { useDevice } from '../../core'
import { addButtonCssEvent, removeButtonCssEvent } from '../common/setButtonCssEvent'
import { HLabelMethods } from '../../types'
import { hisonCloser } from '../../hisonCloser'

export default defineComponent({
    name: 'HLabel',
    props: labelProps,
    inheritAttrs: false,
    emits: ['mounted', 'responsive-change', 'click', 'mousedown', 'mouseup', 'mouseover', 'mouseout'],
    setup(props, { emit, slots: _slots }) {
        const labelRef = ref<HTMLElement | null>(null)
        const labelMethods = ref<HLabelMethods | null>(null)
        const id = props.id ? props.id : getUUID()
        const reloadId = `hlabel:${id}`
        const device = useDevice()
        const slots = useSlots()

        const visible = ref<boolean>(props.visible)
        const title = ref<string>(props.title || '')
        const textAlign = ref<TextAlignValue>(props.textAlign ?? TextAlign.left)
        const textAlignStyle = computed(() => ({ textAlign: textAlign.value }))

        const href = ref<string | null | undefined>(props.href ?? null)
        const rawAnchorAttrs = ref<Record<string, unknown>>({ ...(props.anchorAttrs || {}) })
        const hasHref = computed(() => !!(href.value && String(href.value).trim()))

        const computedAnchorAttrs = computed<Record<string, unknown>>(() => {
            const out: Record<string, unknown> = { ...rawAnchorAttrs.value }
            if (title.value && out.title == null) out.title = title.value
            out.href = href.value || undefined
            if (out.download === true) out.download = ''
            const target = String(out.target || '')
            if (target === '_blank' && (out.rel == null || String(out.rel).trim() === '')) {
                out.rel = 'noopener noreferrer'
            }
            return out
        })
        const slotNodes = computed(() => (slots.default ? slots.default() : []))
        const isTextOnlySlot = computed(() =>
            slotNodes.value.length > 0 && slotNodes.value.every(v => v.type === Text)
        )
        const hasElementSlot = computed(() =>
            !!slots.default && !isTextOnlySlot.value
        )

        const renderTag = computed<'div' | 'a' | 'span'>(() => {
            if (hasElementSlot.value) return 'div'
            if (hasHref.value) return 'a'
            return 'span'
        })

        const fontBold = ref(props.fontBold)
        const fontBoldClass = computed(()=>{ if (fontBold.value) return 'hison-font-bold' })
        const fontItalic = ref(props.fontItalic)
        const fontItalicClass = computed(()=>{ if (fontItalic.value) return 'hison-font-italic' })
        const fontThruline = ref(props.fontThruline)
        const fontThrulineClass = computed(()=>{ if (fontThruline.value) return 'hison-font-thruline-important' })
        const fontUnderline = ref(props.fontUnderline)
        const fontUnderlineClass = computed(()=>{ if (fontUnderline.value) return 'hison-font-underline-important' })
        const border = ref<boolean>(props.border ?? false)
        const backgroundType = ref(props.backgroundType || BackgroundType.empty)

        const visibleClass = computed(() => (visible.value ? '' : 'hison-display-none'))
        const borderClass = computed(() => (border.value ? 'hison-border' : ''))
        const backgroundTypeClass = computed(() => {
        switch (backgroundType.value) {
            case BackgroundType.empty: return 'hison-bg-empty'
            case BackgroundType.transparent: return 'hison-bg-transparent'
            default: return 'hison-bg-filled'
        }
        })

        const internalText = ref<string>(props.text || '')
        onMounted(() => {
            if (isTextOnlySlot.value) {
                const text = slotNodes.value.map(v => String(v.children ?? '')).join('')
                internalText.value = text
            }
        })

        const toggleTarget = ref<string | null>(props.toggleTarget ?? null)
        const hasToggleTarget = computed(() => !!(toggleTarget.value && String(toggleTarget.value).trim()))

        const translateGuard = ref<boolean>(props.translate)
        const translateClass = computed(() => (translateGuard.value === false ? 'notranslate' : ''))
        const translateAttr  = computed<undefined | 'no'>(() => (translateGuard.value === false ? 'no' : undefined))
        
        const tabIndex = ref<number | null>(
            props.tabIndex !== null && props.tabIndex !== '' ? Number(props.tabIndex) : null
        )

        const responsiveClassList = ref<string[]>([])
        const refreshResponsiveClassList = () => {
            responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
            addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
            addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
        }

        const toggleTargetInput = () => {
            if (!hasToggleTarget.value) return

            const tgtId = String(toggleTarget.value)
            const api = (hisonCloser.component.inputList as any)?.[tgtId]
            if (!api || !api.isHisonvueComponent) return

            const t = api.getInputType?.()
            const em = api.getEditMode?.()
            if ((t !== 'checkbox' && t !== 'radio') || em !== 'editable') return

            const cur = !!api.getValue?.()
            if (t === 'checkbox') {
                api.setValue?.(!cur)
            } else {
                api.setValue?.(true)
            }
        }

        const onClick = (e: MouseEvent) => {
            if (hasToggleTarget.value) toggleTargetInput()
            emit('click', e, labelMethods.value!)
        }

        const onKeyActivate = (e: KeyboardEvent) => {
            if (hasToggleTarget.value) toggleTargetInput()
            if (!hasHref.value) return
            const el = labelRef.value as HTMLAnchorElement | null
            if (el && el.tagName === 'A') {
                el.click()
            }
        }

        const attachButtonCssEvent = (add = true) => {
            const el = labelRef.value
            if (!el) return
            removeButtonCssEvent(el)
            if (hasToggleTarget.value) {
                addButtonCssEvent(el)
                return
            }
            if (add && hasHref.value && el.tagName === 'A') addButtonCssEvent(el)
        }

        const mount = () => {
            if (hisonCloser.component.labelList[id] && hisonCloser.component.labelList[id].isHisonvueComponent) console.warn(`[Hisonvue] The label ID is at risk of being duplicated. ${id}`)
            registerReloadable(reloadId, () => {
                unmount()
                nextTick(mount)
            })
            refreshResponsiveClassList()
            nextTick(() => attachButtonCssEvent(true))

            labelMethods.value = {
                isHisonvueComponent: true,
                getId: () => id,
                getType: () => 'label',
                isVisible: () => visible.value,
                setVisible: (val: boolean) => { visible.value = val },
                getTitle: () => title.value,
                setTitle: (val: string) => { title.value = val },
                getText: () => (hasElementSlot.value ? '' : internalText.value),
                setText: (val: string) => { if (!hasElementSlot.value) internalText.value = val },
                getHref: () => href.value ?? '',
                setHref: (val?: string | null) => { href.value = val ?? null },
                getAnchorAttrs: () => ({ ...rawAnchorAttrs.value }),
                replaceAnchorAttrs: (next: Record<string, unknown>) => { rawAnchorAttrs.value = { ...next } },
                mergeAnchorAttrs: (patch: Record<string, unknown>) => { rawAnchorAttrs.value = { ...rawAnchorAttrs.value, ...patch } },
                setAnchorAttr: (key: string, val: unknown) => { rawAnchorAttrs.value = { ...rawAnchorAttrs.value, [key]: val } },
                removeAnchorAttr: (key: string) => { const c = { ...rawAnchorAttrs.value }; delete c[key]; rawAnchorAttrs.value = c },
                isFontBold : () => { return fontBold.value },
                setFontBold : (val: boolean) => { fontBold.value = val },
                isFontItalic : () => { return fontItalic.value },
                setFontItalic : (val: boolean) => { fontItalic.value = val },
                isFontThruline : () => { return fontThruline.value },
                setFontThruline : (val: boolean) => { fontThruline.value = val },
                isFontUnderline : () => { return fontUnderline.value },
                setFontUnderline : (val: boolean) => { fontUnderline.value = val },
                getTextAlign: () => textAlign.value,
                setTextAlign: (v: TextAlign) => {
                    if (v === TextAlign.left || v === TextAlign.center || v === TextAlign.right) {
                        textAlign.value = v
                    }
                },
                isBorder: () => border.value,
                setBorder: (val: boolean) => { border.value = val },
                getBackgroundType: () => backgroundType.value,
                setBackgroundType: (type) => { backgroundType.value = type as any },
                getToggleTarget: () => toggleTarget.value,
                setToggleTarget: (id: string | null) => { toggleTarget.value = id },
                isTranslate: () => translateGuard.value,
                setTranslate: (v: boolean) => { translateGuard.value = v },
                reload: () => reloadHisonComponent(reloadId),
                getTabIndex: () => tabIndex.value,
                setTabIndex: (v: number | null) => {
                    tabIndex.value = v !== null && v !== undefined ? Number(v) : null
                },
                focus: () => {
                    const el = labelRef.value
                    if (!el) return
                    if (hasHref.value && el.tagName === 'A') (el as HTMLAnchorElement).focus()
                },
            }

            hisonCloser.component.labelList[id] = labelMethods.value
            emit('mounted', labelMethods.value)
        }

        const unmount = () => {
            unregisterReloadable(reloadId)
            const el = labelRef.value
            if (el) removeButtonCssEvent(el)
            delete hisonCloser.component.labelList[id]
        }

        onMounted(mount)
        onBeforeUnmount(unmount)

        watch(device, (newDevice) => {
            refreshResponsiveClassList()
            emit('responsive-change', newDevice)
        })

        watch(hasHref, (isLink) => {
            nextTick(() => attachButtonCssEvent(isLink))
        }, { flush: 'post' })
        watch(hasToggleTarget, (on) => {
            nextTick(() => attachButtonCssEvent(on))
        }, { flush: 'post' })

        watch(() => props.visible, v => { const nv = !!v; if (nv !== visible.value) visible.value = nv })
        watch(() => props.title, v => { const s = v ?? ''; if (s !== title.value) title.value = s })
        watch(() => props.text, v => { if (!hasElementSlot.value) { const s = v ?? ''; if (s !== internalText.value) internalText.value = s } })
        watch(slotNodes, nv => { if (isTextOnlySlot.value) { const text = nv.map(v => String(v.children ?? '')).join(''); if (text !== internalText.value) internalText.value = text } })
        watch(() => props.href, v => { const s = v ?? null; if (s !== href.value) href.value = s })
        watch(() => props.anchorAttrs, v => { const next = { ...(v || {}) }; if (JSON.stringify(next) !== JSON.stringify(rawAnchorAttrs.value)) rawAnchorAttrs.value = next })
        watch(() => props.fontBold, v => { const b = !!v; if (b !== fontBold.value) fontBold.value = b })
        watch(() => props.fontItalic, v => { const b = !!v; if (b !== fontItalic.value) fontItalic.value = b })
        watch(() => props.fontThruline, v => { const b = !!v; if (b !== fontThruline.value) fontThruline.value = b })
        watch(() => props.fontUnderline, v => { const b = !!v; if (b !== fontUnderline.value) fontUnderline.value = b })
        watch(() => props.textAlign, v => { if (v && v !== textAlign.value && (v === TextAlign.left || v === TextAlign.center || v === TextAlign.right)) textAlign.value = v })
        watch(() => props.border, v => { const b = !!v; if (b !== border.value) border.value = b })
        watch(() => props.backgroundType, v => { if (v && v !== backgroundType.value) backgroundType.value = v as any })
        watch(() => props.toggleTarget, v => { const nv = v ?? null; if (nv !== toggleTarget.value) toggleTarget.value = nv })
        watch(() => props.translate, v => { const b = !!v; if (b !== translateGuard.value) translateGuard.value = b })
        watch(() => props.tabIndex, v => { const nv = (v === null || v === '') ? null : Number(v); if (nv !== tabIndex.value) tabIndex.value = nv })
        watch(() => props.class, () => { refreshResponsiveClassList() })

        return {
            labelRef,
            labelMethods: computed(() => unref(labelMethods)),
            props,
            title,
            hasHref,
            hasToggleTarget,
            hasElementSlot,
            renderTag,
            internalText,
            computedAnchorAttrs,
            visibleClass,
            fontBoldClass,
            fontItalicClass,
            fontThrulineClass,
            fontUnderlineClass,
            textAlignStyle,
            translateAttr,
            translateClass,
            borderClass,
            backgroundTypeClass,
            responsiveClassList,
            tabIndex,
            onClick,
            onKeyActivate,
        }
    }
})
</script>

<style scoped></style>
