import { hisonCloser } from "../.."
const boundInputText = new WeakSet<HTMLElement>();
const boundInput = new WeakSet<HTMLElement>();

const onFocus = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    if (hisonCloser.event.cssEvent.input_onBeforeFocus(e as FocusEvent) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.add('hison-input-on-active')
    hisonCloser.event.cssEvent.input_onAfterFocus(e as FocusEvent)
}
const onBlur = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    if (hisonCloser.event.cssEvent.input_onBeforeBlur(e as FocusEvent) === false) {
        e.stopPropagation()
        e.preventDefault()
        return
    }
    target.classList.remove('hison-input-on-active')
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
    target.classList.add('hison-input-on-mouseover')
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
    target.classList.remove('hison-input-on-mouseover')
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
    target.classList.add('hison-input-on-mouseover')
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
    target.classList.remove('hison-input-on-mouseover')
    hisonCloser.event.cssEvent.input_onAfterTouchend(e)
}

export const addInputTextCssEvent = (el: HTMLInputElement) => {
    if (boundInputText.has(el)) return;
    boundInputText.add(el);
    el.addEventListener('mouseenter', onMouseover)
    el.addEventListener('mouseleave', onMouseout)
    el.addEventListener('touchstart', onTouchstart, { passive: false, capture: true })
    el.addEventListener('touchend', onTouchend, { passive: false, capture: true })
}
export const removeInputTextCssEvent = (el: HTMLInputElement) => {
    if (!boundInputText.has(el)) return;
    boundInputText.delete(el);
    el.removeEventListener('mouseenter', onMouseover)
    el.removeEventListener('mouseleave', onMouseout)
    el.removeEventListener('touchstart', onTouchstart, { capture: true })
    el.removeEventListener('touchend', onTouchend, { capture: true })
}
export const addInputCssEvent = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    if (boundInput.has(el)) return;
    boundInput.add(el);
    el.addEventListener('focus', onFocus)
    el.addEventListener('blur', onBlur)
}
export const removeInputCssEvent = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    if (!boundInput.has(el)) return;
    boundInput.delete(el);
    el.removeEventListener('focus', onFocus)
    el.removeEventListener('blur', onBlur)
}
