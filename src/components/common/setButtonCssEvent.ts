import { hisonCloser } from "../../hisonCloser";

const activeTimers = new WeakMap<HTMLElement, number>();
const bound = new WeakSet<HTMLElement>();

const onFocus = (e: FocusEvent) => {
  const target = e.currentTarget as HTMLElement;
  if (hisonCloser.event.cssEvent.button_onBeforeFocus(e) === false) {
    e.stopPropagation();
    e.preventDefault();
    return;
  }
  target.classList.add("hison-button-on-focus");
  hisonCloser.event.cssEvent.button_onAfterFocus(e);
};

const onBlur = (e: FocusEvent) => {
  const target = e.currentTarget as HTMLElement;
  if (hisonCloser.event.cssEvent.button_onBeforeBlur(e) === false) {
    e.stopPropagation();
    e.preventDefault();
    return;
  }

  target.classList.remove("hison-button-on-focus");
  target.classList.remove("hison-button-on-active");

  const tid = activeTimers.get(target);
  if (tid) {
    clearTimeout(tid);
    activeTimers.delete(target);
  }

  hisonCloser.event.cssEvent.button_onAfterBlur(e);
};

const onClick = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement;
  if (hisonCloser.event.cssEvent.button_onBeforeClick(e) === false) {
    e.stopPropagation();
    e.preventDefault();
    return;
  }

  target.classList.remove("hison-button-on-mouseover", "hison-button-on-focus");
  target.classList.add("hison-button-on-active");

  const prev = activeTimers.get(target);
  if (prev) clearTimeout(prev);

  const tid = window.setTimeout(() => {
    target.classList.remove("hison-button-on-active");

    if (document.activeElement === target) {
      target.classList.add("hison-button-on-focus");
    }

    hisonCloser.event.cssEvent.button_onAfterClick(e);
    activeTimers.delete(target);
  }, 100);

  activeTimers.set(target, tid);
};

const onMouseover = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement;
  if (hisonCloser.event.cssEvent.button_onBeforeMouseover(e) === false) {
    e.stopPropagation();
    e.preventDefault();
    return;
  }
  target.classList.add("hison-button-on-mouseover");
  hisonCloser.event.cssEvent.button_onAfterMouseover(e);
};

const onMouseout = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement;
  if (hisonCloser.event.cssEvent.button_onBeforeMouseout(e) === false) {
    e.stopPropagation();
    e.preventDefault();
    return;
  }
  target.classList.remove("hison-button-on-mouseover");
  hisonCloser.event.cssEvent.button_onAfterMouseout(e);
};

const onTouchstart = (e: TouchEvent) => {
  const target = e.currentTarget as HTMLElement;
  if (hisonCloser.event.cssEvent.button_onBeforeTouchstart(e) === false) {
    e.stopPropagation();
    e.preventDefault();
    return;
  }
  target.classList.add("hison-button-on-mouseover");
  hisonCloser.event.cssEvent.button_onAfterTouchstart(e);
};

const onTouchend = (e: TouchEvent) => {
  const target = e.currentTarget as HTMLElement;
  if (hisonCloser.event.cssEvent.button_onBeforeTouchend(e) === false) {
    e.stopPropagation();
    e.preventDefault();
    return;
  }
  target.classList.remove("hison-button-on-mouseover");
  hisonCloser.event.cssEvent.button_onAfterTouchend(e);
};

export const addButtonCssEvent = (el: HTMLElement) => {
  if (bound.has(el)) return;
  bound.add(el);

  el.addEventListener("click", onClick, { capture: true });

  el.addEventListener("focus", onFocus);
  el.addEventListener("blur", onBlur);

  el.addEventListener("mouseenter", onMouseover);
  el.addEventListener("mouseleave", onMouseout);

  el.addEventListener("touchstart", onTouchstart, { passive: false, capture: true });
  el.addEventListener("touchend", onTouchend, { passive: false, capture: true });
};

export const removeButtonCssEvent = (el: HTMLElement) => {
  if (!bound.has(el)) return;
  bound.delete(el);

  el.removeEventListener("click", onClick, { capture: true });
  el.removeEventListener("focus", onFocus);
  el.removeEventListener("blur", onBlur);
  el.removeEventListener("mouseenter", onMouseover);
  el.removeEventListener("mouseleave", onMouseout);
  el.removeEventListener("touchstart", onTouchstart, { capture: true });
  el.removeEventListener("touchend", onTouchend, { capture: true });

  const tid = activeTimers.get(el);
  if (tid) {
    clearTimeout(tid);
    activeTimers.delete(el);
  }
};
