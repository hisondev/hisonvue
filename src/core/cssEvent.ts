const onClick = (e: MouseEvent) => {
    let target = e.currentTarget as HTMLElement
    // Add active CSS
    target.classList.add("hison-on-active")
    // Remove active CSS after 0.1 seconds
    setTimeout(() => {
        target.classList.remove("hison-on-active")
    }, 100)
}
const onMouseover = (e: MouseEvent) => {
    let target = e.currentTarget as HTMLElement
    target.classList.add("hison-on-mouseover")
}
const onMouseout = (e: MouseEvent) => {
    let target = e.currentTarget as HTMLElement
    target.classList.remove("hison-on-mouseover")
}
const onTouchstart = (e: TouchEvent) => {
    let target = e.currentTarget as HTMLElement
    target.classList.add("hison-on-mouseover")
    target.classList.remove("hison-on-mouseout")
}
const onTouchend = (e: TouchEvent) => {
    let target = e.currentTarget as HTMLElement
    target.classList.add("hison-on-mouseout")
    target.classList.remove("hison-on-mouseover")
}

export const addButtonEvent = (el: HTMLElement) => {
    el.addEventListener('click', onClick)
    el.addEventListener('mouseover', onMouseover)
    el.addEventListener('mouseout', onMouseout)
    el.addEventListener('touchstart', onTouchstart)
    el.addEventListener('touchend', onTouchend)
}
export const removeButtonEvent = (el: HTMLElement) => {
    el.removeEventListener('click', onClick)
    el.removeEventListener('mouseover', onMouseover)
    el.removeEventListener('mouseout', onMouseout)
    el.removeEventListener('touchstart', onTouchstart)
    el.removeEventListener('touchend', onTouchend)
}
