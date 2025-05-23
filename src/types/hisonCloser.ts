import { Vanillagrid } from "vanillagrid2"
import { Vanillanote } from "vanillanote2"
import { HButtonMethods, HLayoutMethods } from "./component"
import { ComponentStyleConfig, HisonvueEvent } from "./hisonConfig"

export interface ComponentColor {
  primary: {
    buttonColor: string | null;
    borderColor: string | null;
    shadowColor: string | null;
    hoverColor: string | null;
    activeColor: string | null;
    emptyTextColor: string | null;
    filledTextColor: string | null;
  }
  muted: {
    buttonColor: string | null;
    borderColor: string | null;
    shadowColor: string | null;
    hoverColor: string | null;
    activeColor: string | null;
    emptyTextColor: string | null;
    filledTextColor: string | null;
  }
  info: {
    buttonColor: string | null;
    borderColor: string | null;
    shadowColor: string | null;
    hoverColor: string | null;
    activeColor: string | null;
    emptyTextColor: string | null;
    filledTextColor: string | null;
  }
  success: {
    buttonColor: string | null;
    borderColor: string | null;
    shadowColor: string | null;
    hoverColor: string | null;
    activeColor: string | null;
    emptyTextColor: string | null;
    filledTextColor: string | null;
  }
  danger: {
    buttonColor: string | null;
    borderColor: string | null;
    shadowColor: string | null;
    hoverColor: string | null;
    activeColor: string | null;
    emptyTextColor: string | null;
    filledTextColor: string | null;
  }
  warning: {
    buttonColor: string | null;
    borderColor: string | null;
    shadowColor: string | null;
    hoverColor: string | null;
    activeColor: string | null;
    emptyTextColor: string | null;
    filledTextColor: string | null;
  }
}

export interface ComponentStyle extends ComponentStyleConfig{
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
        buttonList: Record<string, HButtonMethods>
        layoutList: Record<string, HLayoutMethods>
    }
    event: HisonvueEvent
    componentStyle: ComponentStyle
}
