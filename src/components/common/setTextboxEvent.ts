import { hisonCloser } from "../.."
import { getColorClass } from "../../utils"

const onMouseoverForCss = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.textbox_onBeforeMouseover(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.add(getColorClass(target, 'on-mouseover'))
    hisonCloser.event.cssEvent.textbox_onAfterMouseover(e)
}
const onMouseoutForCss = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.textbox_onBeforeMouseout(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.remove(getColorClass(target, 'on-mouseover'))
    hisonCloser.event.cssEvent.textbox_onAfterMouseout(e)
}
const onTouchstartForCss = (e: TouchEvent) => {
    const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.textbox_onBeforeTouchstart(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.add(getColorClass(target, 'on-mouseover'))
    hisonCloser.event.cssEvent.textbox_onAfterTouchstart(e)
}
const onTouchendForCss = (e: TouchEvent) => {
const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.textbox_onBeforeTouchend(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.remove(getColorClass(target, 'on-mouseover'))
    hisonCloser.event.cssEvent.textbox_onAfterTouchend(e)
}

export const addTextboxCssEvent = (el: HTMLElement) => {
    el.addEventListener('mouseover', onMouseoverForCss)
    el.addEventListener('mouseout', onMouseoutForCss)
    el.addEventListener('touchstart', onTouchstartForCss, { passive: false, capture: true })
    el.addEventListener('touchend', onTouchendForCss, { passive: false, capture: true })
}
export const removeTextboxCssEvent = (el: HTMLElement) => {
    el.removeEventListener('mouseover', onMouseoverForCss)
    el.removeEventListener('mouseout', onMouseoutForCss)
    el.removeEventListener('touchstart', onTouchstartForCss)
    el.removeEventListener('touchend', onTouchendForCss)
}
