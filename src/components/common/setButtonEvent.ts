import { hisonCloser } from "../../core"

const onClickForCss = (e: MouseEvent) => {
    let target = e.currentTarget as HTMLElement
    if (hisonCloser.event.cssEvent.button_onBeforeClick(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    // Add active CSS
    target.classList.add("hison-on-active")
    // Remove active CSS after 0.1 seconds
    setTimeout(() => {
        target.classList.remove("hison-on-active")
        hisonCloser.event.cssEvent.button_onAfterClick(e);
    }, 100)
}
const onMouseoverForCss = (e: MouseEvent) => {
    if(hisonCloser.event.cssEvent.button_onBeforeMouseover(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    let target = e.currentTarget as HTMLElement
    target.classList.add("hison-on-mouseover")
    hisonCloser.event.cssEvent.button_onAfterMouseover(e);
}
const onMouseoutForCss = (e: MouseEvent) => {
    if(hisonCloser.event.cssEvent.button_onBeforeMouseout(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    let target = e.currentTarget as HTMLElement
    target.classList.remove("hison-on-mouseover")
    hisonCloser.event.cssEvent.button_onAfterMouseout(e)
}
const onTouchstartForCss = (e: TouchEvent) => {
    if(hisonCloser.event.cssEvent.button_onBeforeTouchstart(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    let target = e.currentTarget as HTMLElement
    target.classList.add("hison-on-mouseover")
    target.classList.remove("hison-on-mouseout")
    hisonCloser.event.cssEvent.button_onAfterTouchstart(e)
}
const onTouchendForCss = (e: TouchEvent) => {
    if(hisonCloser.event.cssEvent.button_onBeforeTouchend(e) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    let target = e.currentTarget as HTMLElement
    target.classList.add("hison-on-mouseout")
    target.classList.remove("hison-on-mouseover")
    hisonCloser.event.cssEvent.button_onAfterTouchend(e)
}

export const addButtonCssEvent = (el: HTMLElement) => {
    el.addEventListener('click', onClickForCss, { capture: true })
    el.addEventListener('mouseover', onMouseoverForCss)
    el.addEventListener('mouseout', onMouseoutForCss)
    el.addEventListener('touchstart', onTouchstartForCss, { capture: true })
    el.addEventListener('touchend', onTouchendForCss, { capture: true })
}
export const removeButtonCssEvent = (el: HTMLElement) => {
    el.removeEventListener('click', onClickForCss)
    el.removeEventListener('mouseover', onMouseoverForCss)
    el.removeEventListener('mouseout', onMouseoutForCss)
    el.removeEventListener('touchstart', onTouchstartForCss)
    el.removeEventListener('touchend', onTouchendForCss)
}
