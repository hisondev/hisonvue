import { hisonCloser } from "../.."
import { getColorClass } from "../../utils"

const onFocus = (e: FocusEvent) => {
    const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.button_onBeforeFocus(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.add(getColorClass(target, 'button', 'on-focus'))
    hisonCloser.event.cssEvent.button_onAfterFocus(e)
}
const onBlur = (e: FocusEvent) => {
    const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.button_onBeforeBlur(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.remove(getColorClass(target, 'button', 'on-focus'))
    hisonCloser.event.cssEvent.button_onAfterBlur(e)
}
const onClick = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.button_onBeforeClick(e) === false) {
      e.stopPropagation()
      e.preventDefault()
      return
    }
    target.classList.add(getColorClass(target, 'button', 'on-active'))
    setTimeout(() => {
      target.classList.remove(getColorClass(target, 'button', 'on-active'))
      hisonCloser.event.cssEvent.button_onAfterClick(e)
    }, 100)
}
const onMouseover = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.button_onBeforeMouseover(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.add(getColorClass(target, 'button', 'on-mouseover'))
    hisonCloser.event.cssEvent.button_onAfterMouseover(e)
}
const onMouseout = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.button_onBeforeMouseout(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.remove(getColorClass(target, 'button', 'on-mouseover'))
    hisonCloser.event.cssEvent.button_onAfterMouseout(e)
}
const onTouchstart = (e: TouchEvent) => {
    const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.button_onBeforeTouchstart(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.add(getColorClass(target, 'button', 'on-mouseover'))
    hisonCloser.event.cssEvent.button_onAfterTouchstart(e)
}
const onTouchend = (e: TouchEvent) => {
const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.button_onBeforeTouchend(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.remove(getColorClass(target, 'button', 'on-mouseover'))
    hisonCloser.event.cssEvent.button_onAfterTouchend(e)
}

export const addButtonCssEvent = (el: HTMLElement) => {
    el.addEventListener('click', onClick, { capture: true })
    el.addEventListener('focus', onFocus)
    el.addEventListener('blur', onBlur)
    el.addEventListener('mouseover', onMouseover)
    el.addEventListener('mouseout', onMouseout)
    el.addEventListener('touchstart', onTouchstart, { passive: false, capture: true })
    el.addEventListener('touchend', onTouchend, { passive: false, capture: true })
}
export const removeButtonCssEvent = (el: HTMLElement) => {
    el.removeEventListener('click', onClick)
    el.removeEventListener('focus', onFocus)
    el.removeEventListener('blur', onBlur)
    el.removeEventListener('mouseover', onMouseover)
    el.removeEventListener('mouseout', onMouseout)
    el.removeEventListener('touchstart', onTouchstart)
    el.removeEventListener('touchend', onTouchend)
}
