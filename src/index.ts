import { App } from 'vue'
import type { Hison, HisonCloser, HisonConfig } from './types'
import { createHison } from 'hisonjs'
import {
  createSSRClientOnly,
  getDefaultHisonConfig,
  createHisonCloser,
  setHison,
  applyCssVariables,
  initializeDeviceListener
} from './core'
import './styles/hisonvue.scss'

const HAccordionClientOnly = createSSRClientOnly(() => import('./components/HAccordion/HAccordion.vue'), 'HAccordion')
const HBaggieClientOnly = createSSRClientOnly(() => import('./components/HBaggie/HBaggie.vue'), 'HBaggie')
const HBannerClientOnly = createSSRClientOnly(() => import('./components/HBanner/HBanner.vue'), 'HBanner')
const HButtonClientOnly = createSSRClientOnly(() => import('./components/HButton/HButton.vue'), 'HButton')
const HCalendarClientOnly = createSSRClientOnly(() => import('./components/HCalendar/HCalendar.vue'), 'HCalendar')
const HCaptionClientOnly = createSSRClientOnly(() => import('./components/HCaption/HCaption.vue'), 'HCaption')
const HChartClientOnly = createSSRClientOnly(() => import('./components/HChart/HChart.vue'), 'HChart')
const HDrawerClientOnly = createSSRClientOnly(() => import('./components/HDrawer/HDrawer.vue'), 'HDrawer')
const HDropdownClientOnly = createSSRClientOnly(() => import('./components/HDropdown/HDropdown.vue'), 'HDropdown')
const HFilesetClientOnly = createSSRClientOnly(() => import('./components/HFileset/HFileset.vue'), 'HFileset')
const HGapClientOnly = createSSRClientOnly(() => import('./components/HGap/HGap.vue'), 'HGap')
const HGridClientOnly = createSSRClientOnly(() => import('./components/HGrid/HGrid.vue'), 'HGrid')
const HImageboxClientOnly = createSSRClientOnly(() => import('./components/HImagebox/HImagebox.vue'), 'HImagebox')
const HInputClientOnly = createSSRClientOnly(() => import('./components/HInput/HInput.vue'), 'HInput')
const HInputGroupClientOnly = createSSRClientOnly(() => import('./components/HInputGroup/HInputGroup.vue'), 'HInputGroup')
const HLabelClientOnly = createSSRClientOnly(() => import('./components/HLabel/HLabel.vue'), 'HLabel')
const HLayoutClientOnly = createSSRClientOnly(() => import('./components/HLayout/HLayout.vue'), 'HLayout')
const HListClientOnly = createSSRClientOnly(() => import('./components/HList/HList.vue'), 'HList')
const HModalClientOnly = createSSRClientOnly(() => import('./components/HModal/HModal.vue'), 'HModal')
const HNoteClientOnly = createSSRClientOnly(() => import('./components/HNote/HNote.vue'), 'HNote')
const HPaginationClientOnly = createSSRClientOnly(() => import('./components/HPagination/HPagination.vue'), 'HPagination')
const HParagraphClientOnly = createSSRClientOnly(() => import('./components/HParagraph/HParagraph.vue'), 'HParagraph')
const HPopupClientOnly = createSSRClientOnly(() => import('./components/HPopup/HPopup.vue'), 'HPopup')
const HSpinnerClientOnly = createSSRClientOnly(() => import('./components/HSpinner/HSpinner.vue'), 'HSpinner')
const HTableClientOnly = createSSRClientOnly(() => import('./components/HTable/HTable.vue'), 'HTable')

export const hisonCloser = {
  event: { cssEvent: {} }
} as HisonCloser
export const hison = createHison() as Hison
export const hisonvue = {
  install(app: App, hisonConfig?: HisonConfig) {
    const defaultHisonConfig = getDefaultHisonConfig()
    if (hisonConfig) {
      Object.keys(defaultHisonConfig).forEach((key) => {
        if (!(key in hisonConfig!)) {
          (hisonConfig as any)[key] = defaultHisonConfig[key as keyof HisonConfig]
        }
      })
    } else {
      hisonConfig = getDefaultHisonConfig()
    }
    createHisonCloser(hisonConfig)
    setHison(hison, hisonConfig)

    if (typeof window !== 'undefined') {
      applyCssVariables()
    }
    initializeDeviceListener()
    app.provide('hison', hison)
    app.component('HAccordion', HAccordionClientOnly)
    app.component('HBaggie', HBaggieClientOnly)
    app.component('HBanner', HBannerClientOnly)
    app.component('HButton', HButtonClientOnly)
    app.component('HCalendar', HCalendarClientOnly)
    app.component('HCaption', HCaptionClientOnly)
    app.component('HChart', HChartClientOnly)
    app.component('HDrawer', HDrawerClientOnly)
    app.component('HDropdown', HDropdownClientOnly)
    app.component('HFileset', HFilesetClientOnly)
    app.component('HGap', HGapClientOnly)
    app.component('HGrid', HGridClientOnly)
    app.component('HImagebox', HImageboxClientOnly)
    app.component('HInput', HInputClientOnly)
    app.component('HInputGroup', HInputGroupClientOnly)
    app.component('HLabel', HLabelClientOnly)
    app.component('HLayout', HLayoutClientOnly)
    app.component('HList', HListClientOnly)
    app.component('HModal', HModalClientOnly)
    app.component('HNote', HNoteClientOnly)
    app.component('HPagination', HPaginationClientOnly)
    app.component('HParagraph', HParagraphClientOnly)
    app.component('HPopup', HPopupClientOnly)
    app.component('HSpinner', HSpinnerClientOnly)
    app.component('HTable', HTableClientOnly)
  }
}

export type { default as HAccordion } from './components/HAccordion/HAccordion.vue'
export type { default as HBaggie } from './components/HBaggie/HBaggie.vue'
export type { default as HBanner } from './components/HBanner/HBanner.vue'
export type { default as HButton } from './components/HButton/HButton.vue'
export type { default as HCalendar } from './components/HCalendar/HCalendar.vue'
export type { default as HCaption } from './components/HCaption/HCaption.vue'
export type { default as HChart } from './components/HChart/HChart.vue'
export type { default as HDrawer } from './components/HDrawer/HDrawer.vue'
export type { default as HDropdown } from './components/HDropdown/HDropdown.vue'
export type { default as HFileset } from './components/HFileset/HFileset.vue'
export type { default as HGap } from './components/HGap/HGap.vue'
export type { default as HGrid } from './components/HGrid/HGrid.vue'
export type { default as HImagebox } from './components/HImagebox/HImagebox.vue'
export type { default as HInput } from './components/HInput/HInput.vue'
export type { default as HInputGroup } from './components/HInputGroup/HInputGroup.vue'
export type { default as HLabel } from './components/HLabel/HLabel.vue'
export type { default as HLayout } from './components/HLayout/HLayout.vue'
export type { default as HList } from './components/HList/HList.vue'
export type { default as HModal } from './components/HModal/HModal.vue'
export type { default as HNote } from './components/HNote/HNote.vue'
export type { default as HPagination } from './components/HPagination/HPagination.vue'
export type { default as HParagraph } from './components/HParagraph/HParagraph.vue'
export type { default as HPopup } from './components/HPopup/HPopup.vue'
export type { default as HSpinner } from './components/HSpinner/HSpinner.vue'
export type { default as HTable } from './components/HTable/HTable.vue'
export {
  HAccordionClientOnly,
  HBaggieClientOnly,
  HBannerClientOnly,
  HButtonClientOnly,
  HCalendarClientOnly,
  HCaptionClientOnly,
  HChartClientOnly,
  HDrawerClientOnly,
  HDropdownClientOnly,
  HFilesetClientOnly,
  HGapClientOnly,
  HGridClientOnly,
  HImageboxClientOnly,
  HInputClientOnly,
  HInputGroupClientOnly,
  HLabelClientOnly,
  HLayoutClientOnly,
  HListClientOnly,
  HModalClientOnly,
  HNoteClientOnly,
  HPaginationClientOnly,
  HParagraphClientOnly,
  HPopupClientOnly,
  HSpinnerClientOnly,
  HTableClientOnly,
}
export { getDefaultHisonConfig } from './core'
export type {
  Hison,
  HisonConfig,

  DeviceType,
  AttachedFileItem,
  HCalendarSpecialTime,
  HCalendarSpecialTimeMap,
  HCalendarEvent,
  HGridColumn,
  HDropdownOption,
  HDropdownModel,
  HLabelAnchorAttrs,

  ComponentMethods,
  HAccordionMethods,
  HBaggieMethods,
  HBannerMethods,
  HButtonMethods,
  HCalendarMethods,
  HCaptionMethods,
  HChartInstance,
  HDrawerMethods,
  HDropdownMethods,
  HFilesetMethods,
  HGapMethods,
  HGridMethods,
  HImageboxMethods,
  HInputMethods,
  HInputGroupMethods,
  HLabelMethods,
  HLayoutMethods,
  HListMethods,
  HModalMethods,
  HNoteElement,
  HPaginationMethods,
  HParagraphMethods,
  HPopupMethods,
  HSpinnerMethods,
  HTableMethods,
} from './types'
export * from './enums'