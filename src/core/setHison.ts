import { setHisonFromHisonConfig } from "../plugins";
import type { HGridMethods, Hison, HisonConfig, HNoteElement } from "../types";
import { applyCssVariables } from "./setDocumentFromHisonCloser";
import { Size } from "../enums";
import { reloadAllHisonComponents } from "../utils/";
import { hisonCloser } from "../hisonCloser";

export const setHison = (hison: Hison, hisonConfig: HisonConfig) => {
    setHisonFromHisonConfig(hison, hisonConfig)

    hison.setMaxFilesetSize = (fileSize: number) => { hisonCloser.componentConfig.filesetSize = fileSize };
    hison.setMaxFilesetTotalSize = (fileTotalSize: number) => { hisonCloser.componentConfig.filesetTotalSize = fileTotalSize };
    hison.getMaxFilesetSize = () => { return hisonCloser.componentConfig.filesetSize };
    hison.getMaxFilesetTotalSize = () => { return hisonCloser.componentConfig.filesetTotalSize };
  
    hison.cssEvent = {
      setButtonOnBefoerFocus(func: ((e: FocusEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeFocus = func},
      setButtonOnAfterFocus(func: ((e: FocusEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterFocus = func},
      setButtonOnBefoerBlur(func: ((e: FocusEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeBlur = func},
      setButtonOnAfterBlur(func: ((e: FocusEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterBlur = func},
      setButtonOnBefoerClick(func: ((e: MouseEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeClick = func},
      setButtonOnAfterClick(func: ((e: MouseEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterClick = func},
      setButtonOnBeforeMouseover(func: ((e: MouseEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeMouseover = func},
      setButtonOnAfterMouseover(func: ((e: MouseEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterMouseover = func},
      setButtonOnBeforeMouseout(func: ((e: MouseEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeMouseout = func},
      setButtonOnAfterMouseout(func: ((e: MouseEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterMouseout = func},
      setButtonOnBeforeTouchstart(func: ((e: TouchEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeTouchstart = func},
      setButtonOnAfterTouchstart(func: ((e: TouchEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterTouchstart = func},
      setButtonOnBeforeTouchend(func: ((e: TouchEvent) => boolean)) {hisonCloser.event.cssEvent.button_onBeforeTouchend = func},
      setButtonOnAfterTouchend(func: ((e: TouchEvent) => void)) {hisonCloser.event.cssEvent.button_onAfterTouchend = func},

      setInputOnBefoerFocus(func: ((e: FocusEvent) => boolean)) {hisonCloser.event.cssEvent.input_onBeforeFocus = func},
      setInputOnAfterFocus(func: ((e: FocusEvent) => void)) {hisonCloser.event.cssEvent.input_onAfterFocus = func},
      setInputOnBefoerBlur(func: ((e: FocusEvent) => boolean)) {hisonCloser.event.cssEvent.input_onBeforeBlur = func},
      setInputOnAfterBlur(func: ((e: FocusEvent) => void)) {hisonCloser.event.cssEvent.input_onAfterBlur = func},
      setInputOnBeforeMouseover(func: ((e: MouseEvent) => boolean)) {hisonCloser.event.cssEvent.input_onBeforeMouseover = func},
      setInputOnAfterMouseover(func: ((e: MouseEvent) => void)) {hisonCloser.event.cssEvent.input_onAfterMouseover = func},
      setInputOnBeforeMouseout(func: ((e: MouseEvent) => boolean)) {hisonCloser.event.cssEvent.input_onBeforeMouseout = func},
      setInputOnAfterMouseout(func: ((e: MouseEvent) => void)) {hisonCloser.event.cssEvent.input_onAfterMouseout = func},
      setInputOnBeforeTouchstart(func: ((e: TouchEvent) => boolean)) {hisonCloser.event.cssEvent.input_onBeforeTouchstart = func},
      setInputOnAfterTouchstart(func: ((e: TouchEvent) => void)) {hisonCloser.event.cssEvent.input_onAfterTouchstart = func},
      setInputOnBeforeTouchend(func: ((e: TouchEvent) => boolean)) {hisonCloser.event.cssEvent.input_onBeforeTouchend = func},
      setInputOnAfterTouchend(func: ((e: TouchEvent) => void)) {hisonCloser.event.cssEvent.input_onAfterTouchend = func},
    };

    const reApplyCssVariables = () => {
        if (typeof window !== 'undefined') {
          applyCssVariables()
          reloadAllHisonComponents()
        }
    }

    hison.style = {
        setSize(size: Size.xs | Size.s | Size.m | Size.l | Size.xl) {
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
        setCustom1Color(custom1Color: string) {
            hisonCloser.componentStyle.custom1Color = custom1Color;
            reApplyCssVariables()
        },
        setCustom2Color(custom2Color: string) {
            hisonCloser.componentStyle.custom2Color = custom2Color;
            reApplyCssVariables()
        },
        setCustom3Color(custom3Color: string) {
            hisonCloser.componentStyle.custom3Color = custom3Color;
            reApplyCssVariables()
        },
        setCustom4Color(custom4Color: string) {
            hisonCloser.componentStyle.custom4Color = custom4Color;
            reApplyCssVariables()
        },
        setCustom5Color(custom5Color: string) {
            hisonCloser.componentStyle.custom5Color = custom5Color;
            reApplyCssVariables()
        },
        setInvertColor(invert: boolean) {
            hisonCloser.componentStyle.invertColor = invert;
            reApplyCssVariables()
        },

        getDeviceType() {
            if (typeof window === 'undefined') {
                return 'pc'
            }
            const width = window.innerWidth
            if (width < 768) return 'mb'
            if (width < 1200) return 'tb'
            if (width < 1980) return 'pc'
            return 'wd'
        },
        
        getFilledColor() { return hisonCloser.componentStyle.filledColor; },
        getEmptyColor() { return hisonCloser.componentStyle.emptyColor; },
        getFilledTextColor() { return hisonCloser.componentStyle.filledTextColor; },
        getEmptyTextColor() { return hisonCloser.componentStyle.emptyTextColor; },

        getPrimaryColor() { return hisonCloser.componentStyle.primaryColor; },
        getPrimaryButtonColor() { return hisonCloser.componentStyle.componentColor.primary.buttonColor as string; },
        getPrimaryBorderColor() { return hisonCloser.componentStyle.componentColor.primary.borderColor as string; },
        getPrimaryShadowColor() { return hisonCloser.componentStyle.componentColor.primary.shadowColor as string; },
        getPrimaryHoverColor() { return hisonCloser.componentStyle.componentColor.primary.hoverColor as string; },
        getPrimaryActiveColor() { return hisonCloser.componentStyle.componentColor.primary.activeColor as string; },
        getPrimaryRowHoverColor() { return hisonCloser.componentStyle.componentColor.primary.rowHoverColor as string; },
        getPrimaryStripeColor() { return hisonCloser.componentStyle.componentColor.primary.stripeColor as string; },

        getMutedColor() { return hisonCloser.componentStyle.mutedColor; },
        getMutedButtonColor() { return hisonCloser.componentStyle.componentColor.muted.buttonColor as string; },
        getMutedBorderColor() { return hisonCloser.componentStyle.componentColor.muted.borderColor as string; },
        getMutedShadowColor() { return hisonCloser.componentStyle.componentColor.muted.shadowColor as string; },
        getMutedHoverColor() { return hisonCloser.componentStyle.componentColor.muted.hoverColor as string; },
        getMutedActiveColor() { return hisonCloser.componentStyle.componentColor.muted.activeColor as string; },
        getMutedRowHoverColor() { return hisonCloser.componentStyle.componentColor.muted.rowHoverColor as string; },
        getMutedStripeColor() { return hisonCloser.componentStyle.componentColor.muted.stripeColor as string; },

        getInfoColor() { return hisonCloser.componentStyle.infoColor; },
        getInfoButtonColor() { return hisonCloser.componentStyle.componentColor.info.buttonColor as string; },
        getInfoBorderColor() { return hisonCloser.componentStyle.componentColor.info.borderColor as string; },
        getInfoShadowColor() { return hisonCloser.componentStyle.componentColor.info.shadowColor as string; },
        getInfoHoverColor() { return hisonCloser.componentStyle.componentColor.info.hoverColor as string; },
        getInfoActiveColor() { return hisonCloser.componentStyle.componentColor.info.activeColor as string; },
        getInfoRowHoverColor() { return hisonCloser.componentStyle.componentColor.info.rowHoverColor as string; },
        getInfoStripeColor() { return hisonCloser.componentStyle.componentColor.info.stripeColor as string; },

        getSuccessColor() { return hisonCloser.componentStyle.successColor; },
        getSuccessButtonColor() { return hisonCloser.componentStyle.componentColor.success.buttonColor as string; },
        getSuccessBorderColor() { return hisonCloser.componentStyle.componentColor.success.borderColor as string; },
        getSuccessShadowColor() { return hisonCloser.componentStyle.componentColor.success.shadowColor as string; },
        getSuccessHoverColor() { return hisonCloser.componentStyle.componentColor.success.hoverColor as string; },
        getSuccessActiveColor() { return hisonCloser.componentStyle.componentColor.success.activeColor as string; },
        getSuccessRowHoverColor() { return hisonCloser.componentStyle.componentColor.success.rowHoverColor as string; },
        getSuccessStripeColor() { return hisonCloser.componentStyle.componentColor.success.stripeColor as string; },

        getDangerColor() { return hisonCloser.componentStyle.dangerColor; },
        getDangerButtonColor() { return hisonCloser.componentStyle.componentColor.danger.buttonColor as string; },
        getDangerBorderColor() { return hisonCloser.componentStyle.componentColor.danger.borderColor as string; },
        getDangerShadowColor() { return hisonCloser.componentStyle.componentColor.danger.shadowColor as string; },
        getDangerHoverColor() { return hisonCloser.componentStyle.componentColor.danger.hoverColor as string; },
        getDangerActiveColor() { return hisonCloser.componentStyle.componentColor.danger.activeColor as string; },
        getDangerRowHoverColor() { return hisonCloser.componentStyle.componentColor.danger.rowHoverColor as string; },
        getDangerStripeColor() { return hisonCloser.componentStyle.componentColor.danger.stripeColor as string; },

        getWarningColor() { return hisonCloser.componentStyle.warningColor; },
        getWarningButtonColor() { return hisonCloser.componentStyle.componentColor.warning.buttonColor as string; },
        getWarningBorderColor() { return hisonCloser.componentStyle.componentColor.warning.borderColor as string; },
        getWarningShadowColor() { return hisonCloser.componentStyle.componentColor.warning.shadowColor as string; },
        getWarningHoverColor() { return hisonCloser.componentStyle.componentColor.warning.hoverColor as string; },
        getWarningActiveColor() { return hisonCloser.componentStyle.componentColor.warning.activeColor as string; },
        getWarningRowHoverColor() { return hisonCloser.componentStyle.componentColor.warning.rowHoverColor as string; },
        getWarningStripeColor() { return hisonCloser.componentStyle.componentColor.warning.stripeColor as string; },

        getCustom1Color() { return hisonCloser.componentStyle.custom1Color; },
        getCustom1ButtonColor() { return hisonCloser.componentStyle.componentColor.custom1.buttonColor as string; },
        getCustom1BorderColor() { return hisonCloser.componentStyle.componentColor.custom1.borderColor as string; },
        getCustom1ShadowColor() { return hisonCloser.componentStyle.componentColor.custom1.shadowColor as string; },
        getCustom1HoverColor() { return hisonCloser.componentStyle.componentColor.custom1.hoverColor as string; },
        getCustom1ActiveColor() { return hisonCloser.componentStyle.componentColor.custom1.activeColor as string; },
        getCustom1RowHoverColor() { return hisonCloser.componentStyle.componentColor.custom1.rowHoverColor as string; },
        getCustom1StripeColor() { return hisonCloser.componentStyle.componentColor.custom1.stripeColor as string; },

        getCustom2Color() { return hisonCloser.componentStyle.custom2Color; },
        getCustom2ButtonColor() { return hisonCloser.componentStyle.componentColor.custom2.buttonColor as string; },
        getCustom2BorderColor() { return hisonCloser.componentStyle.componentColor.custom2.borderColor as string; },
        getCustom2ShadowColor() { return hisonCloser.componentStyle.componentColor.custom2.shadowColor as string; },
        getCustom2HoverColor() { return hisonCloser.componentStyle.componentColor.custom2.hoverColor as string; },
        getCustom2ActiveColor() { return hisonCloser.componentStyle.componentColor.custom2.activeColor as string; },
        getCustom2RowHoverColor() { return hisonCloser.componentStyle.componentColor.custom2.rowHoverColor as string; },
        getCustom2StripeColor() { return hisonCloser.componentStyle.componentColor.custom2.stripeColor as string; },

        getCustom3Color() { return hisonCloser.componentStyle.custom3Color; },
        getCustom3ButtonColor() { return hisonCloser.componentStyle.componentColor.custom3.buttonColor as string; },
        getCustom3BorderColor() { return hisonCloser.componentStyle.componentColor.custom3.borderColor as string; },
        getCustom3ShadowColor() { return hisonCloser.componentStyle.componentColor.custom3.shadowColor as string; },
        getCustom3HoverColor() { return hisonCloser.componentStyle.componentColor.custom3.hoverColor as string; },
        getCustom3ActiveColor() { return hisonCloser.componentStyle.componentColor.custom3.activeColor as string; },
        getCustom3RowHoverColor() { return hisonCloser.componentStyle.componentColor.custom3.rowHoverColor as string; },
        getCustom3StripeColor() { return hisonCloser.componentStyle.componentColor.custom3.stripeColor as string; },

        getCustom4Color() { return hisonCloser.componentStyle.custom4Color; },
        getCustom4ButtonColor() { return hisonCloser.componentStyle.componentColor.custom4.buttonColor as string; },
        getCustom4BorderColor() { return hisonCloser.componentStyle.componentColor.custom4.borderColor as string; },
        getCustom4ShadowColor() { return hisonCloser.componentStyle.componentColor.custom4.shadowColor as string; },
        getCustom4HoverColor() { return hisonCloser.componentStyle.componentColor.custom4.hoverColor as string; },
        getCustom4ActiveColor() { return hisonCloser.componentStyle.componentColor.custom4.activeColor as string; },
        getCustom4RowHoverColor() { return hisonCloser.componentStyle.componentColor.custom4.rowHoverColor as string; },
        getCustom4StripeColor() { return hisonCloser.componentStyle.componentColor.custom4.stripeColor as string; },

        getCustom5Color() { return hisonCloser.componentStyle.custom5Color; },
        getCustom5ButtonColor() { return hisonCloser.componentStyle.componentColor.custom5.buttonColor as string; },
        getCustom5BorderColor() { return hisonCloser.componentStyle.componentColor.custom5.borderColor as string; },
        getCustom5ShadowColor() { return hisonCloser.componentStyle.componentColor.custom5.shadowColor as string; },
        getCustom5HoverColor() { return hisonCloser.componentStyle.componentColor.custom5.hoverColor as string; },
        getCustom5ActiveColor() { return hisonCloser.componentStyle.componentColor.custom5.activeColor as string; },
        getCustom5RowHoverColor() { return hisonCloser.componentStyle.componentColor.custom5.rowHoverColor as string; },
        getCustom5StripeColor() { return hisonCloser.componentStyle.componentColor.custom5.stripeColor as string; },

        isInvertColor() { return hisonCloser.componentStyle.invertColor }
    };
    
    (hison as any).component = {}
    hison.component.getAccordion = (accordionId: string) => { return hisonCloser.component.accordionList[accordionId] }
    hison.component.getBaggie = (baggieId: string) => { return hisonCloser.component.baggieList[baggieId] }
    hison.component.getBanner = (bannerId: string) => { return hisonCloser.component.bannerList[bannerId] }
    hison.component.getButton = (buttonId: string) => { return hisonCloser.component.buttonList[buttonId] }
    hison.component.getCalendar = (calendarId: string) => { return hisonCloser.component.calendarList[calendarId] }
    hison.component.getCaption = (captionId: string) => { return hisonCloser.component.captionList[captionId] }
    hison.component.getChart = (chartId: string) => { return hisonCloser.component.chartList[chartId] }
    hison.component.getDrawer = (drawerId: string) => { return hisonCloser.component.drawerList[drawerId] }
    hison.component.getDropdown = (dropdownId: string) => { return hisonCloser.component.dropdownList[dropdownId] }
    hison.component.getGap = (gapId: string) => { return hisonCloser.component.gapList[gapId] }
    hison.component.getFileset = (filesetId: string) => { return hisonCloser.component.filesetList[filesetId] }
    hison.component.getGrid = (gridId: string) => { return hisonCloser.grid.getGrid(gridId) as HGridMethods | null }
    hison.component.getImagebox = (imageboxId: string) => { return hisonCloser.component.imageboxList[imageboxId] }
    hison.component.getInput = (inputId: string) => { return hisonCloser.component.inputList[inputId] }
    hison.component.getInputGroup = (inputGroupId: string) => { return hisonCloser.component.inputGroupList[inputGroupId] }
    hison.component.getLabel = (labelId: string) => { return hisonCloser.component.labelList[labelId] }
    hison.component.getLayout = (layoutId: string) => { return hisonCloser.component.layoutList[layoutId] }
    hison.component.getList = (listId: string) => { return hisonCloser.component.listList[listId] }
    hison.component.getModal = (modalId: string) => { return hisonCloser.component.modalList[modalId] }
    hison.component.getNote = (noteId: string) => { return hisonCloser.note.getNote(noteId) as HNoteElement | null }
    hison.component.getPagination = (paginationId: string) => { return hisonCloser.component.paginationList[paginationId] }
    hison.component.getParagraph = (paragraphId: string) => { return hisonCloser.component.paragraphList[paragraphId] }
    hison.component.getPopup = (popupId: string) => { return hisonCloser.component.popupList[popupId] }
    hison.component.getSpinner = (spinnerId: string) => { return hisonCloser.component.spinnerList[spinnerId] }
    hison.component.getTable = (tableId: string) => { return hisonCloser.component.tableList[tableId] }
}
