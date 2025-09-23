import { Vanillagrid } from "vanillagrid2"
import { Vanillanote } from "vanillanote2"
import { HAccordionMethods, HBaggieMethods, HButtonMethods, HCalendarMethods, HCaptionMethods, HChartInstance, HDrawerMethods, HDropdownMethods, HFilesetMethods, HGapMethods, HImageboxMethods, HInputGroupMethods, HInputMethods, HLabelMethods, HLayoutMethods, HListMethods, HModalMethods, HParagraphMethods, HPopupMethods, HSpinnerMethods, HTableMethods } from "./component"
import { ComponentConfig, ComponentStyleConfig, HisonvueEvent } from "./hisonConfig"

export interface ComponentColor {
  primary: {
    buttonColor: string | null;
    borderColor: string | null;
    shadowColor: string | null;
    hoverColor: string | null;
    activeColor: string | null;
    rowHoverColor: string | null;
    stripeColor: string | null;
    emptyTextColor: string | null;
    filledTextColor: string | null;
  }
  muted: {
    buttonColor: string | null;
    borderColor: string | null;
    shadowColor: string | null;
    hoverColor: string | null;
    activeColor: string | null;
    rowHoverColor: string | null;
    stripeColor: string | null;
    emptyTextColor: string | null;
    filledTextColor: string | null;
  }
  info: {
    buttonColor: string | null;
    borderColor: string | null;
    shadowColor: string | null;
    hoverColor: string | null;
    activeColor: string | null;
    rowHoverColor: string | null;
    stripeColor: string | null;
    emptyTextColor: string | null;
    filledTextColor: string | null;
  }
  success: {
    buttonColor: string | null;
    borderColor: string | null;
    shadowColor: string | null;
    hoverColor: string | null;
    activeColor: string | null;
    rowHoverColor: string | null;
    stripeColor: string | null;
    emptyTextColor: string | null;
    filledTextColor: string | null;
  }
  danger: {
    buttonColor: string | null;
    borderColor: string | null;
    shadowColor: string | null;
    hoverColor: string | null;
    activeColor: string | null;
    rowHoverColor: string | null;
    stripeColor: string | null;
    emptyTextColor: string | null;
    filledTextColor: string | null;
  }
  warning: {
    buttonColor: string | null;
    borderColor: string | null;
    shadowColor: string | null;
    hoverColor: string | null;
    activeColor: string | null;
    rowHoverColor: string | null;
    stripeColor: string | null;
    emptyTextColor: string | null;
    filledTextColor: string | null;
  }
}

export interface ComponentStyle extends ComponentStyleConfig {
  componentColor: ComponentColor
  primaryInvertColor: string;
  mutedInvertColor: string;
  infoInvertColor: string;
  successInvertColor: string;
  dangerInvertColor: string;
  warningInvertColor: string;
  filledInvertColor: string;
  emptyInvertColor: string;
  filledTextInvertColor: string;
  emptyTextInvertColor: string;
}

export interface HisonCloser {
    note: Vanillanote
    grid: Vanillagrid
    component: {
      accordionList: Record<string, HAccordionMethods>
      baggieList: Record<string, HBaggieMethods>
      buttonList: Record<string, HButtonMethods>
      calendarList: Record<string, HCalendarMethods>
      captionList: Record<string, HCaptionMethods>
      chartList: Record<string, HChartInstance>
      drawerList: Record<string, HDrawerMethods>
      dropdownList: Record<string, HDropdownMethods>
      filesetList: Record<string, HFilesetMethods>
      gapList: Record<string, HGapMethods>
      imageboxList: Record<string, HImageboxMethods>
      inputList: Record<string, HInputMethods>
      inputGroupList: Record<string, HInputGroupMethods>
      labelList: Record<string, HLabelMethods>
      layoutList: Record<string, HLayoutMethods>
      listList: Record<string, HListMethods>
      modalList: Record<string, HModalMethods>
      paragraphList: Record<string, HParagraphMethods>
      popupList: Record<string, HPopupMethods>
      spinnerList: Record<string, HSpinnerMethods>
      tableList: Record<string, HTableMethods>
    }
    event: HisonvueEvent
    componentStyle: ComponentStyle
    componentConfig: Omit<ComponentConfig, 'note' | 'grid' | 'chart'>
}
