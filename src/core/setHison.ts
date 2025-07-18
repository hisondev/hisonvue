import { setHisonFromHisonConfig } from "../plugins";
import type { HGridMethods, Hison, HisonConfig, HNoteElement } from "../types";
import { applyCssVariables } from "./setDocumentFromHisonCloser";
import { Size } from "../enums";
import { reloadAllHisonComponents } from "../utils/";
import { hisonCloser } from "..";

export const setHison = (hison: Hison, hisonConfig: HisonConfig) => {
    setHisonFromHisonConfig(hison, hisonConfig)

    hison.setMaxFileSetSize = (fileSize: number) => { hisonCloser.componentConfig.fileSetSize = fileSize };
    hison.setMaxFileSetTotalSize = (fileTotalSize: number) => { hisonCloser.componentConfig.fileSetTotalSize = fileTotalSize };
    hison.getMaxFileSetSize = () => { return hisonCloser.componentConfig.fileSetSize };
    hison.getMaxFileSetTotalSize = () => { return hisonCloser.componentConfig.fileSetTotalSize };
  
    hison.cssEvent = {
      setButtonOnBefoerClick(func: ((e: MouseEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeClick = func},
      setButtonOnAfterClick(func: ((e: MouseEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterClick = func},
      setButtonOnBeforeMouseover(func: ((e: MouseEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeMouseover = func},
      setButtonOnAfterMouseover(func: ((e: MouseEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterMouseover = func},
      setButtonOnBeforeMouseout(func: ((e: MouseEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeMouseout = func},
      setButtonOnAfterMouseout(func: ((e: MouseEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterMouseout = func},
      setButtonOnBeforeTouchstart(func: ((e: TouchEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeTouchstart = func},
      setButtonOnAfterTouchstart(func: ((e: TouchEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterTouchstart = func},
      setButtonOnBeforeTouchend(func: ((e: TouchEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeTouchend = func},
      setButtonOnAfterTouchend(func: ((e: TouchEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterTouchend = func}
    };

    const reApplyCssVariables = () => {
        if (typeof window !== 'undefined') {
          applyCssVariables()
          reloadAllHisonComponents()
        }
    }

    hison.style = {
        setSize(size: Size.s | Size.m | Size.l | Size.xl) {
            hisonCloser.componentStyle.size = size;
            reApplyCssVariables()
        },
        setFilledColor(filledColor: string) {
            hisonCloser.componentStyle.filledColor = filledColor;
            reApplyCssVariables()
        },
        setEmptyColor(emptyColor: string) {
            hisonCloser.componentStyle.emptyColor = emptyColor;
            reApplyCssVariables()
        },
        setFilledTextColor(filledTextColor: string) {
            hisonCloser.componentStyle.filledTextColor = filledTextColor;
            reApplyCssVariables()
        },
        setEmptyTextColor(emptyTextColor: string) {
            hisonCloser.componentStyle.emptyTextColor = emptyTextColor;
            reApplyCssVariables()
        },
        setPrimaryColor(primaryColor: string) {
            hisonCloser.componentStyle.primaryColor = primaryColor;
            reApplyCssVariables()
        },
        setMutedColor(mutedColor: string) {
            hisonCloser.componentStyle.mutedColor = mutedColor;
            reApplyCssVariables()
        },
        setInfoColor(infoColor: string) {
            hisonCloser.componentStyle.infoColor = infoColor;
            reApplyCssVariables()
        },
        setSuccessColor(successColor: string) {
            hisonCloser.componentStyle.successColor = successColor;
            reApplyCssVariables()
        },
        setDangerColor(dangerColor: string) {
            hisonCloser.componentStyle.dangerColor = dangerColor;
            reApplyCssVariables()
        },
        setWarningColor(warningColor: string) {
            hisonCloser.componentStyle.warningColor = warningColor;
            reApplyCssVariables()
        },
        setInvertColor(invert: boolean) {
            hisonCloser.componentStyle.invertColor = invert;
            reApplyCssVariables()
        },
    };
    
    (hison as any).component = {}
    hison.component.getNote = (noteId: string) => { return hisonCloser.note.getNote(noteId) as HNoteElement | null }
    hison.component.getGrid = (gridId: string) => { return hisonCloser.grid.getGrid(gridId) as HGridMethods | null }
    hison.component.getButton = (buttonId: string) => { return hisonCloser.component.buttonList[buttonId] }
    hison.component.getLayout = (layoutId: string) => { return hisonCloser.component.layoutList[layoutId] }
    hison.component.getFileSet = (fileSetId: string) => { return hisonCloser.component.fileSetList[fileSetId] }
    hison.component.getImageBox = (imageBoxId: string) => { return hisonCloser.component.imageBoxList[imageBoxId] }
    hison.component.getInput = (inputId: string) => { return hisonCloser.component.inputList[inputId] }
    hison.component.getInputGroup = (inputGroupId: string) => { return hisonCloser.component.inputGroupList[inputGroupId] }
    hison.component.getCalendar = (calendarId: string) => { return hisonCloser.component.calendarList[calendarId] }
    hison.component.getChart = (chartId: string) => { return hisonCloser.component.chartList[chartId] }
}
