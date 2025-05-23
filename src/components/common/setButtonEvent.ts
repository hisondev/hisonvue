import { hisonCloser } from "../.."
import { getSpecificClassNameFromClassList } from "../../utils"

const getColorClass = (el: HTMLElement, suffix: string) => {
    const color = getSpecificClassNameFromClassList(el.classList, 'color')
    if(color) return `hison-color-${color}-${suffix}`

    return `hison-color-primary-${suffix}`
}

const onClickForCss = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.button_onBeforeClick(e) === false) {
      e.stopPropagation()
      e.preventDefault()
      return
    }
    target.classList.add(getColorClass(target, 'on-active'))
    setTimeout(() => {
      target.classList.remove(getColorClass(target, 'on-active'))
      hisonCloser.event.cssEvent.button_onAfterClick(e)
    }, 100)
}
const onMouseoverForCss = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.button_onBeforeMouseover(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.add(getColorClass(target, 'on-mouseover'))
    hisonCloser.event.cssEvent.button_onAfterMouseover(e)
}
const onMouseoutForCss = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.button_onBeforeMouseout(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.remove(getColorClass(target, 'on-mouseover'))
    hisonCloser.event.cssEvent.button_onAfterMouseout(e)
}
const onTouchstartForCss = (e: TouchEvent) => {
    const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.button_onBeforeTouchstart(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.add(getColorClass(target, 'on-mouseover'))
    hisonCloser.event.cssEvent.button_onAfterTouchstart(e)
}
const onTouchendForCss = (e: TouchEvent) => {
const target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.button_onBeforeTouchend(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.remove(getColorClass(target, 'on-mouseover'))
    hisonCloser.event.cssEvent.button_onAfterTouchend(e)
}

export const addButtonCssEvent = (el: HTMLElement) => {
    el.addEventListener('click', onClickForCss, { capture: true })
    el.addEventListener('mouseover', onMouseoverForCss)
    el.addEventListener('mouseout', onMouseoutForCss)
    el.addEventListener('touchstart', onTouchstartForCss, { passive: false, capture: true })
    el.addEventListener('touchend', onTouchendForCss, { passive: false, capture: true })
}
export const removeButtonCssEvent = (el: HTMLElement) => {
    el.removeEventListener('click', onClickForCss)
    el.removeEventListener('mouseover', onMouseoverForCss)
    el.removeEventListener('mouseout', onMouseoutForCss)
    el.removeEventListener('touchstart', onTouchstartForCss)
    el.removeEventListener('touchend', onTouchendForCss)
}
