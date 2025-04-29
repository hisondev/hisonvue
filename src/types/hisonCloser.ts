import { Vanillagrid } from "vanillagrid2"
import { Vanillanote } from "vanillanote2"
import { HButton } from "./component"

export interface CssEvent {
    button_onBeforeClick: (e: MouseEvent) => boolean
    button_onAfterClick: (e: MouseEvent) => void
    button_onBeforeMouseover: (e: MouseEvent) => boolean
    button_onAfterMouseover: (e: MouseEvent) => void
    button_onBeforeMouseout: (e: MouseEvent) => boolean
    button_onAfterMouseout: (e: MouseEvent) => void
    button_onBeforeTouchstart: (e: TouchEvent) => boolean
    button_onAfterTouchstart: (e: TouchEvent) => void
    button_onBeforeTouchend: (e: TouchEvent) => boolean
    button_onAfterTouchend: (e: TouchEvent) => void
}

export interface HisonvueEvent {
    cssEvent: CssEvent
}

export interface HisonCloser {
    note: Vanillanote
    grid: Vanillagrid
    element: {
        buttonList: Record<string, HButton>
    }
    event: HisonvueEvent
}
