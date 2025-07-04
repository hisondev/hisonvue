import { hisonCloser } from "../.."
import { getColorClass } from "../../utils"

const onFocus = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    if (hisonCloser.event.cssEvent.input_onBeforeFocus(e as FocusEvent) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.add(getColorClass(target, 'input', 'on-active'))
    hisonCloser.event.cssEvent.input_onAfterFocus(e as FocusEvent)
}
const onBlur = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    if (hisonCloser.event.cssEvent.input_onBeforeBlur(e as FocusEvent) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.remove(getColorClass(target, 'input', 'on-active'))
    hisonCloser.event.cssEvent.input_onAfterBlur(e as FocusEvent)
}
const onMouseover = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLInputElement
    if(target.readOnly) return
    if (hisonCloser.event.cssEvent.input_onBeforeMouseover(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.add(getColorClass(target, 'input', 'on-mouseover'))
    hisonCloser.event.cssEvent.input_onAfterMouseover(e)
}
const onMouseout = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLInputElement
    if(target.readOnly) return
    if (hisonCloser.event.cssEvent.input_onBeforeMouseout(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.remove(getColorClass(target, 'input', 'on-mouseover'))
    hisonCloser.event.cssEvent.input_onAfterMouseout(e)
}
const onTouchstart = (e: TouchEvent) => {
    const target = e.currentTarget as HTMLInputElement
    if(target.readOnly) return
    if (hisonCloser.event.cssEvent.input_onBeforeTouchstart(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.add(getColorClass(target, 'input', 'on-mouseover'))
    hisonCloser.event.cssEvent.input_onAfterTouchstart(e)
}
const onTouchend = (e: TouchEvent) => {
    const target = e.currentTarget as HTMLInputElement
    if(target.readOnly) return
    if (hisonCloser.event.cssEvent.input_onBeforeTouchend(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.remove(getColorClass(target, 'input', 'on-mouseover'))
    hisonCloser.event.cssEvent.input_onAfterTouchend(e)
}

export const addInputTextCssEvent = (el: HTMLInputElement) => {
    el.addEventListener('mouseover', onMouseover)
    el.addEventListener('mouseout', onMouseout)
    el.addEventListener('touchstart', onTouchstart, { passive: false, capture: true })
    el.addEventListener('touchend', onTouchend, { passive: false, capture: true })
}
export const removeInputTextCssEvent = (el: HTMLInputElement) => {
    el.removeEventListener('mouseover', onMouseover)
    el.removeEventListener('mouseout', onMouseout)
    el.removeEventListener('touchstart', onTouchstart)
    el.removeEventListener('touchend', onTouchend)
}
export const addInputCssEvent = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    el.addEventListener('focus', onFocus)
    el.addEventListener('blur', onBlur)
}
export const removeInputCssEvent = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    el.removeEventListener('focus', onFocus)
    el.removeEventListener('blur', onBlur)
}
