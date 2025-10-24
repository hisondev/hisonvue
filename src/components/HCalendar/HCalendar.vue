<template>
  <div
    :class="[
      'hison-calendar',
      'hison-wrapper',
      ...responsiveClassList,
      visibleClass,
      disableClass
    ]"
    :style="props.style"
  >
    <component
      :is="VueCal"
      ref="calendarRef"
      v-bind="attrs"
      :selected-date="selectedDate"
      :events="events"
      :dblclick-to-create="false"
      :editable-events="false"
      :disable-days="disableDays"
      :events-on-month-view="eventsOnMonthView"
      :hide-weekdays="hideWeekdays"
      :hide-weekends="hideWeekends"
      :locale="locale"
      :max-date="maxDate"
      :min-date="minDate"
      :start-week-on-sunday="startWeekOnSunday"
      :time="time"
      :time-cell-height="timeCellHeight"
      :time-format="timeFormat"
      :time-from="timeFrom"
      :time-step="timeStep"
      :time-to="timeTo"
      :hide-title-bar="hideTitleBar"
      :twelve-hour="twelveHour"
      :active-view="activeView"
      :disable-views="disableViews"
      @view-change="onViewChange"
      @cell-click="onCellClick"
    >
      <template v-for="name in slotNames" :key="name" v-slot:[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
    </component>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch, computed, useSlots } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import {
  getUUID,
  registerReloadable,
  extractResponsiveClasses,
  getSpecificClassValueFromClassList,
  getIndexSpecificClassNameFromClassList,
  applyOpacityToRgba,
  normalizeToRgba,
  getRGBAFromColorText,
  getInvertColor,
  unregisterReloadable,
  reloadHisonComponent,
  toClassString,
  addComponentNameToClass,
} from '../../utils'
import { useDevice } from '../../core'
import { HCalendarView, hison, hisonCloser, Size } from '../..'
import { calendarProps } from './props'
import { HCalendarEvent, HCalendarMethods, HCalendarSpecialTimeMap } from '../../types'
import { HCalendarTimeFormat } from '../../enums/props'

export default defineComponent({
  name: 'HCalendar',
  components: { VueCal },
  props: calendarProps,
  emits: [
    'responsive-change',
    'cell-click',
    'view-change',
    'mounted',
  ],
  setup(props, { emit, attrs }) {
    const id = props.id || getUUID()
    const reloadId = `hcalendar:${id}`
    const calendarRef = ref<InstanceType<typeof VueCal> | null>(null)
    const calendarMethods = ref<HCalendarMethods | null>(null)
    const device = useDevice()
    const slots = useSlots()
    const slotNames = computed(() => Object.keys(slots))

    const visible = ref(props.visible)
    const disable = ref(props.disable)
    const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')
    const disableClass = computed(() => disable.value ? 'hison-disable-calendar' : '')

    const selectedDate = ref(hison.utils.getJSDateObject(props.selectedDate) ?? new Date())
    const initDate = selectedDate.value
    const events = ref(props.events ?? [])

    const weekendColor = ref(props.weekendColor ? normalizeToRgba(props.weekendColor) : undefined)
    const weekendDays = ref(props.weekendDays)
    const selectedColor = ref(props.selectedColor ? normalizeToRgba(props.selectedColor) : undefined)
    const showTodayColor = ref(props.showTodayColor)

    const specialTime = ref<HCalendarSpecialTimeMap>(props.specialTime ?? {})

    const dateCellMinHeight = ref(props.dateCellMinHeight)
    const dateCellMaxHeight = ref(props.dateCellMaxHeight)
    
    const disableDays = ref(props.disableDays)
    const eventsOnMonthView = ref(props.eventsOnMonthView)
    const hideWeekdays = ref(props.hideWeekdays)
    const hideWeekends = ref(props.hideWeekends)
    const locale = ref(props.locale)
    const maxDate = ref<string | Date | undefined>(
      disable.value ? '100-01-01' : props.maxDate
    )
    const minDate = ref(props.minDate)
    const startWeekOnSunday = ref(props.startWeekOnSunday)
    const time = ref(props.time)
    const timeCellHeight = ref(props.timeCellHeight)
    const timeFormat = ref(props.timeFormat)
    const timeFrom = ref(props.timeFrom)
    const timeStep = ref(props.timeStep)
    const timeTo = ref(props.timeTo)
    const hideTitleBar = ref(props.hideTitleBar)
    const twelveHour = ref(props.twelveHour)
    const activeView = ref(props.activeView)
    const disableViews = ref(props.disableViews)
    
    const responsiveClassList = ref<string[]>([])
    const isAlive = ref(true)
    const isUnmounting = ref(false)
    const destroyed = ref(false)

    const refreshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)

      if (getIndexSpecificClassNameFromClassList(responsiveClassList.value, 'col') === -1) {
        responsiveClassList.value.push('hison-col-12')
      }

      addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'primary')

      if (calendarRef.value?.$el) {
        const el = calendarRef.value.$el as HTMLElement
        let color = getSpecificClassValueFromClassList(responsiveClassList.value, 'color')
        const size = getSpecificClassValueFromClassList(responsiveClassList.value, 'size')
        
        if(!color || !getRGBAFromColorText(color)) color = 'primary'
        el.style.setProperty('--vuecal-filled-back-color', (hisonCloser.componentStyle.componentColor as any)[`${color}`].buttonColor)
        el.style.setProperty('--vuecal-filled-font-color', (hisonCloser.componentStyle.componentColor as any)[`${color}`].filledTextColor)
        if(!hisonCloser.componentStyle.invertColor) {
          el.style.setProperty('--vuecal-empty-back-color', hisonCloser.componentStyle.emptyColor)
          el.style.setProperty('--vuecal-empty-font-color', hisonCloser.componentStyle.emptyTextColor)
          el.style.setProperty('--vuecal-empty-disabled-color', applyOpacityToRgba(hisonCloser.componentStyle.emptyTextColor, 0.3))
          el.style.setProperty('--vuecal-empty-out-of-scope-font-color', applyOpacityToRgba(hisonCloser.componentStyle.emptyTextColor, 0.5))
          el.style.setProperty('--vuecal-selected-back-color', selectedColor.value ? selectedColor.value : applyOpacityToRgba((hisonCloser.componentStyle.componentColor as any)[`${color}`].buttonColor, 0.5))
          el.style.setProperty('--vuecal-weekend-back-color', weekendColor.value ? weekendColor.value : null)
          el.style.setProperty('--vuecal-today-back-color', showTodayColor.value ? applyOpacityToRgba((hisonCloser.componentStyle.componentColor as any)[`${color}`].buttonColor, 0.3) : hisonCloser.componentStyle.emptyColor)
        } else {
          el.style.setProperty('--vuecal-empty-back-color', hisonCloser.componentStyle.emptyInvertColor)
          el.style.setProperty('--vuecal-empty-font-color', hisonCloser.componentStyle.emptyTextInvertColor)
          el.style.setProperty('--vuecal-empty-disabled-color', applyOpacityToRgba(hisonCloser.componentStyle.emptyTextInvertColor, 0.3))
          el.style.setProperty('--vuecal-empty-out-of-scope-font-color', applyOpacityToRgba(hisonCloser.componentStyle.emptyTextInvertColor, 0.5))
          el.style.setProperty('--vuecal-selected-back-color', selectedColor.value ? getInvertColor(selectedColor.value) : applyOpacityToRgba((hisonCloser.componentStyle.componentColor as any)[`${color}`].buttonColor, 0.5))
          el.style.setProperty('--vuecal-weekend-back-color', weekendColor.value ? getInvertColor(weekendColor.value) : null)
          el.style.setProperty('--vuecal-today-back-color', showTodayColor.value ? applyOpacityToRgba((hisonCloser.componentStyle.componentColor as any)[`${color}`].buttonColor, 0.3) : hisonCloser.componentStyle.emptyInvertColor)
        }

        switch (size) {
          case Size.xl:
            el.style.setProperty('--vuecal-header-font-size', '0.9em')
            el.style.setProperty('--vuecal-title-button-font-size', '1em')
            el.style.setProperty('--vuecal-body-font-size', '0.9em')
            el.style.setProperty('--vuecal-no-event-font-size', '0.8em')
            break
          case Size.l:
            el.style.setProperty('--vuecal-header-font-size', '0.75em')
            el.style.setProperty('--vuecal-title-button-font-size', '1em')
            el.style.setProperty('--vuecal-body-font-size', '0.9em')
            el.style.setProperty('--vuecal-no-event-font-size', '0.8em')
            break
          case Size.m:
            el.style.setProperty('--vuecal-header-font-size', '0.7em')
            el.style.setProperty('--vuecal-title-button-font-size', '0.6em')
            el.style.setProperty('--vuecal-body-font-size', '0.8em')
            el.style.setProperty('--vuecal-no-event-font-size', '0.7em')
            break
          case Size.s:
            el.style.setProperty('--vuecal-header-font-size', '0.6em')
            el.style.setProperty('--vuecal-title-button-font-size', '0.5em')
            el.style.setProperty('--vuecal-body-font-size', '0.8em')
            el.style.setProperty('--vuecal-no-event-font-size', '0.7em')
            break
        }
        el.style.setProperty('--calendar-clickable-cursor', disable.value ? 'not-allowed' : null)
      }
    }
    
    const parseTimeTextToMinutes = (timeStr: string) => {
      const isPM = /pm/i.test(timeStr)
      const isAM = /am/i.test(timeStr)

      const cleaned = timeStr.replace(/[^\d:]/g, '').trim()
      let hour = 0, minute = 0

      if (cleaned.includes(':')) {
        const [h, m] = cleaned.split(':')
        hour = parseInt(h, 10)
        minute = parseInt(m, 10)
      } else {
        const num = parseInt(cleaned, 10)
        if (num <= 12 && (isAM || isPM)) hour = num
        else if (num <= 23) hour = num
        else minute = num
      }

      if (isPM && hour < 12) hour += 12
      if (isAM && hour === 12) hour = 0

      return hour * 60 + minute
    }

    const adjustStyleChangedDate = (viewDate?: Date) => {
      if(!calendarRef.value || destroyed.value) return
      const calendarEl = calendarRef.value.$el
      const showDate = viewDate ?? hison.utils.getJSDateObject(selectedDate.value)
      if(specialTime.value && showDate) {
        const selectedDay = showDate.getDay()
        const specialHours = (specialTime.value as any)[selectedDay] as HCalendarSpecialTimeMap
        const timeEls = calendarEl.querySelectorAll('.vuecal__time-cell') as HTMLDivElement[]

        if(timeEls.length > 0 && specialHours && Array.isArray(specialHours)) {
          timeEls.forEach((timeEl)=>{
            const timeLabelEl = timeEl.querySelector('.vuecal__time-cell-label') as HTMLSpanElement | null
            if(timeLabelEl) {
              const timeStr = timeLabelEl.textContent
              const time = parseTimeTextToMinutes(timeStr!)
              let _className = ''
              const isValidTime = specialHours.some(({ from, to, className }) => {
                const inRange = from <= time && time <= to
                if (inRange) _className = className ?? ''
                return inRange
              })
              if(isValidTime) {
                timeEl.classList.add(_className ? _className : 'special_time')
              }
            }
          })
        } else {
          timeEls.forEach((timeEl)=>{
            timeEl.classList.forEach(cls => {
              if (cls !== 'vuecal__time-cell') {
                timeEl.classList.remove(cls)
              }
            })
          })
        }
      }

    }

    const adjustStyleWeekendColor = (activeView: string) => {
      if(destroyed.value) return
      if(activeView === HCalendarView.month || activeView === HCalendarView.week) {
        const calendarEl = calendarRef.value.$el
        const weekendNumber = weekendDays.value ? weekendDays.value : (startWeekOnSunday.value ? [0, 6] : [5, 6])
        const headingEls = calendarEl.querySelectorAll('.vuecal__heading') as HTMLDivElement[]
        if(headingEls.length > 0) {
          headingEls.forEach((el, i) => {
            if(weekendNumber.includes(i)) el.classList.add('weekend')
            else el.classList.remove('weekend')
          })
        }
      }
    }

    const adjustStyleCellContent = (activeView: string) => {
      if(!calendarRef.value || destroyed.value) return
      const calendarEl = calendarRef.value.$el
      calendarEl.style.setProperty('--vuecal-cell-content-min_heihgt', activeView === 'month' && dateCellMinHeight.value ? dateCellMinHeight.value + 'px' : null)
      calendarEl.style.setProperty('--vuecal-cell-content-max_heihgt', activeView === 'month' && dateCellMaxHeight.value ? dateCellMaxHeight.value + 'px' : null)
      calendarEl.style.setProperty('--vuecal-cell-content-overflow', activeView === 'month' && dateCellMaxHeight.value ? 'auto' : null)
    }

    const adjustStyleChangedView = (view?: string) => {
      if(!calendarRef.value || destroyed.value) return
      const activeView = view ?? calendarRef.value.view.id
      if(weekendColor.value) {
        nextTick(() => adjustStyleWeekendColor(activeView))
      }
      adjustStyleCellContent(activeView)
    }

    const onViewChange = (event: any) => {
      if (destroyed.value) return
      adjustStyleChangedView(event.view)
      if(event.view === HCalendarView.day) {
        adjustStyleChangedDate(event.startDate)
      } else if(event.view === HCalendarView.week) {
        adjustStyleChangedDate()
      }
      activeView.value = event.view
      emit('view-change', event)
    }

    const onCellClick = (_date: any) => {
      if (destroyed.value) return
      const date = _date instanceof Date ? _date : _date.date
      if(!disable.value) {
        selectedDate.value = date
        emit('cell-click', date)
      }
      else {
        selectedDate.value = initDate
        calendarRef.value?.updateSelectedDate(initDate)
      }
    }

    const mount = () => {
      if (!isAlive.value || isUnmounting.value || destroyed.value) return
      if (hisonCloser.component.calendarList[id] && hisonCloser.component.calendarList[id].isHisonvueComponent) console.warn(`[Hisonvue] The calendar ID is at risk of being duplicated. ${id}`)
      unregisterReloadable(reloadId)
      registerReloadable(reloadId, () => {
        if (!isAlive.value) return
        unregisterReloadable(reloadId)
        unmount()
        nextTick(() => {
          if (!isAlive.value) return
          mount()
        })
      })

      if (!calendarRef.value) return
      refreshResponsiveClassList()
      adjustStyleChangedDate()
      adjustStyleChangedView()
      calendarMethods.value = {
        isHisonvueComponent: true,
        getId : () => id,
        getType : () => 'calendar',
        isDisable : () => disable.value,
        setDisable : (val: boolean) => {
          disable.value = val
          if(disable.value) maxDate.value = '100-01-01'
          else maxDate.value = props.maxDate
        },
        isVisible : () => visible.value,
        setVisible : (val: boolean) => { visible.value = val },

        getSelectedDate : (getDateType?: boolean, format?: string) => {
          if(getDateType) return selectedDate.value
          return hison.utils.getDateWithFormat(selectedDate.value, format ?? hison.getDatetimeFormat())
        },
        setSelectedDate : (val: string | Date) => {
          const newSelectedDate = hison.utils.getJSDateObject(val)
          if(newSelectedDate) selectedDate.value = newSelectedDate
        },
        getEvents : () => events.value,
        setEvents : (val: HCalendarEvent[]) => { events.value = val },
        getSpecialTime : () => specialTime.value,
        setSpecialTime : (val: HCalendarSpecialTimeMap) => { specialTime.value = val },

        getWeekendColor : () => weekendColor.value,
        setWeekendColor : (val: string) => {
          weekendColor.value = normalizeToRgba(val)
          if(!calendarRef.value) return
          const el = calendarRef.value.$el as HTMLElement
          if(!el) return
          if(hisonCloser.componentStyle.invertColor) {
            el.style.setProperty('--vuecal-weekend-back-color', weekendColor.value ? getInvertColor(weekendColor.value) : null)
          } else {
            el.style.setProperty('--vuecal-weekend-back-color', weekendColor.value ? weekendColor.value : null)
          }
          adjustStyleWeekendColor(calendarRef.value.view.id)
        },
        getWeekendDays : () => weekendDays.value,
        setWeekendDays : (val: number[]) => {
          weekendDays.value = val
          adjustStyleWeekendColor(calendarRef.value.view.id)
        },
        isShowTodayColor : () => showTodayColor.value,
        setShowTodayColor : (val: boolean) => {
          showTodayColor.value = val
          if(!calendarRef.value) return
          const el = calendarRef.value.$el as HTMLElement
          if(!el) return
          let color = getSpecificClassValueFromClassList(responsiveClassList.value, 'color')
          if(!color || !getRGBAFromColorText(color)) color = 'primary'
          if(!hisonCloser.componentStyle.invertColor) {
            el.style.setProperty('--vuecal-today-back-color', showTodayColor.value ? applyOpacityToRgba((hisonCloser.componentStyle.componentColor as any)[`${color}`].buttonColor, 0.3) : hisonCloser.componentStyle.emptyColor)
          } else {
            el.style.setProperty('--vuecal-today-back-color', showTodayColor.value ? applyOpacityToRgba((hisonCloser.componentStyle.componentColor as any)[`${color}`].buttonColor, 0.3) : hisonCloser.componentStyle.emptyInvertColor)
          }
        },
        getSelectedColor : () => selectedColor.value,
        setSelectedColor : (val: string) => {
          selectedColor.value = normalizeToRgba(val)
          if(!calendarRef.value) return
          const el = calendarRef.value.$el as HTMLElement
          if(!el) return
          let color = getSpecificClassValueFromClassList(responsiveClassList.value, 'color')
          if(!hisonCloser.componentStyle.invertColor) {
            el.style.setProperty('--vuecal-selected-back-color', selectedColor.value ? selectedColor.value : applyOpacityToRgba((hisonCloser.componentStyle.componentColor as any)[`${color}`].buttonColor, 0.5))
          } else {
            el.style.setProperty('--vuecal-selected-back-color', selectedColor.value ? getInvertColor(selectedColor.value) : applyOpacityToRgba((hisonCloser.componentStyle.componentColor as any)[`${color}`].buttonColor, 0.5))
          }
        },

        getDateCellMinHeight : () => dateCellMinHeight.value,
        setDateCellMinHeight : (minHeight: number) => {
          dateCellMinHeight.value = minHeight
          adjustStyleCellContent(calendarRef.value.view.id)
        },
        getDateCellMaxHeight : () => dateCellMaxHeight.value,
        setDateCellMaxHeight : (minHeight: number) => {
          dateCellMaxHeight.value = minHeight
          adjustStyleCellContent(calendarRef.value.view.id)
        },

        getDisableDays : () => disableDays.value,
        setDisableDays : (val: string[]) => { disableDays.value = val},

        getEventsOnMonthView : () => eventsOnMonthView.value,
        setEventsOnMonthView : (val: string | boolean) => { eventsOnMonthView.value = val },

        getHideWeekdays : () => hideWeekdays.value,
        setHideWeekdays : (val: number[]) => { hideWeekdays.value = val },
        getHideWeekends : () => hideWeekends.value,
        setHideWeekends : (val: boolean) => { hideWeekends.value = val },

        getLocale : () => locale.value,
        setLocale : (val: string) => { locale.value = val },

        getMaxDate : (getDateType?: boolean) => {
          if(!maxDate.value) return undefined
          if(getDateType) {
            if(disable.value) return new Date(100, 0, 1)
            else return hison.utils.getJSDateObject(maxDate.value)
          }
          else {
            if(disable.value) return '100-01-01'
            return hison.utils.getDateWithFormat(maxDate.value, hison.getDateFormat())
          }
        },
        setMaxDate : (val: string | Date) => { maxDate.value = val },
        getMinDate : (getDateType?: boolean) => {
          if(!minDate.value) return undefined
          if(getDateType) return hison.utils.getJSDateObject(minDate.value)
          else return hison.utils.getDateWithFormat(minDate.value, hison.getDateFormat())
        },
        setMinDate : (val: string | Date) => { minDate.value = val },

        isStartWeekOnSunday : () => startWeekOnSunday.value,
        setStartWeekOnSunday : (val: boolean) => {
          startWeekOnSunday.value = val
          adjustStyleWeekendColor(calendarRef.value.view.id)
        },

        isShowTimeCell : () => time.value,
        setShowTimeCell : (val: boolean) => { time.value = val },
        getTimeCellHeight : () => timeCellHeight.value,
        setTimeCellHeight : (val: number) => { timeCellHeight.value = val },
        getTimeFormat : () => timeFormat.value,
        setTimeFormat : (val: HCalendarTimeFormat) => { timeFormat.value = val },
        getTimeFrom : () => timeFrom.value,
        setTimeFrom : (val: number) => { timeFrom.value = val },
        getTimeStep : () => timeStep.value,
        setTimeStep : (val: number) => { timeStep.value = val },
        getTimeTo : () => timeTo.value,
        setTimeTo : (val: number) => { timeTo.value = val },

        isHideTitleBar : () => hideTitleBar.value,
        setHideTitleBar : (val: boolean) => { hideTitleBar.value = val },
        isTwelveHour : () => twelveHour.value,
        setTwelveHour : (val: boolean) => { twelveHour.value = val },

        getActiveView : () => calendarRef.value.view.id,
        setActiveView : (val: HCalendarView) => {
          calendarRef.value.switchView(val)
        },
        getDisableViews : () => disableViews.value,
        setDisableViews : (val: HCalendarView[]) => {
          disableViews.value = val
          if(val.includes(calendarRef.value.view.id)) {
            const filtered = ['years', 'year', 'month', 'week', 'day'].filter(view => !val.includes(view as HCalendarView))
            calendarRef.value.switchView(filtered[0])
          }
        },
        reload: () => reloadHisonComponent(reloadId)
      }
      hisonCloser.component.calendarList[id] = calendarMethods.value
      destroyed.value = false
      emit('mounted', calendarMethods.value)
    }

    const unmount = () => {
      if (isUnmounting.value || destroyed.value) {
        unregisterReloadable(reloadId)
        delete hisonCloser.component.calendarList[id]
        return
      }
      isUnmounting.value = true
      unregisterReloadable(reloadId)
      delete hisonCloser.component.calendarList[id]
      destroyed.value = true
    }

    onMounted(mount)
    onBeforeUnmount(() => {
      isAlive.value = false
      unmount()
    })

    watch(device, (newDevice) => {
      if (isUnmounting.value || destroyed.value) return
      refreshResponsiveClassList()
      emit('responsive-change', newDevice)
    })

    watch(() => selectedDate.value, () => {
      if (destroyed.value) return
      adjustStyleChangedDate()
    })
    watch(() => props.selectedDate, (newVal) => {
      if (destroyed.value) return
      selectedDate.value = hison.utils.getJSDateObject(newVal) ?? new Date()
      adjustStyleChangedDate()
    })
    watch(() => props.events, (newVal) => {
      if (destroyed.value) return
      events.value = newVal
    })

    watch(() => props.visible, v => { if (v !== visible.value) visible.value = !!v })
    watch(() => props.disable, v => { const nv = !!v; if (nv !== disable.value) { disable.value = nv; maxDate.value = nv ? '100-01-01' : props.maxDate; refreshResponsiveClassList() } })
    watch(() => selectedDate.value, () => adjustStyleChangedDate())
    watch(() => props.selectedDate, v => { const d = hison.utils.getJSDateObject(v) ?? new Date(); if (+d !== +selectedDate.value) { selectedDate.value = d; adjustStyleChangedDate() } })
    watch(() => props.events, v => { if (v !== events.value) events.value = v ?? [] })
    watch(() => props.weekendColor, v => { const c = v ? normalizeToRgba(v) : undefined; if (c !== weekendColor.value) { weekendColor.value = c; refreshResponsiveClassList(); if (calendarRef.value?.view?.id) adjustStyleWeekendColor(calendarRef.value.view.id) } })
    watch(() => props.weekendDays, v => { if (v && v !== weekendDays.value) { weekendDays.value = v; if (calendarRef.value?.view?.id) adjustStyleWeekendColor(calendarRef.value.view.id) } })
    watch(() => props.selectedColor, v => { const c = v ? normalizeToRgba(v) : undefined; if (c !== selectedColor.value) { selectedColor.value = c; refreshResponsiveClassList() } })
    watch(() => props.showTodayColor, v => { const nv = !!v; if (nv !== showTodayColor.value) { showTodayColor.value = nv; refreshResponsiveClassList() } })
    watch(() => props.specialTime, v => { if (v !== specialTime.value) { specialTime.value = v ?? {}; adjustStyleChangedDate() } })
    watch(() => props.dateCellMinHeight, v => { if (v !== dateCellMinHeight.value) { dateCellMinHeight.value = v; adjustStyleCellContent(calendarRef.value?.view?.id || HCalendarView.month) } })
    watch(() => props.dateCellMaxHeight, v => { if (v !== dateCellMaxHeight.value) { dateCellMaxHeight.value = v; adjustStyleCellContent(calendarRef.value?.view?.id || HCalendarView.month) } })
    watch(() => props.disableDays, v => { if (v !== disableDays.value) disableDays.value = v })
    watch(() => props.eventsOnMonthView, v => { if (v !== eventsOnMonthView.value) eventsOnMonthView.value = v as any })
    watch(() => props.hideWeekdays, v => { if (v !== hideWeekdays.value) hideWeekdays.value = v })
    watch(() => props.hideWeekends, v => { const nv = !!v; if (nv !== hideWeekends.value) hideWeekends.value = nv })
    watch(() => props.locale, v => { if (v && v !== locale.value) locale.value = v })
    watch(() => props.maxDate, v => { if (!disable.value && v !== maxDate.value) maxDate.value = v })
    watch(() => props.minDate, v => { if (v !== minDate.value) minDate.value = v })
    watch(() => props.startWeekOnSunday, v => { const nv = !!v; if (nv !== startWeekOnSunday.value) { startWeekOnSunday.value = nv; if (calendarRef.value?.view?.id) adjustStyleWeekendColor(calendarRef.value.view.id) } })
    watch(() => props.time, v => { const nv = !!v; if (nv !== time.value) time.value = nv })
    watch(() => props.timeCellHeight, v => { if (v !== timeCellHeight.value) timeCellHeight.value = v })
    watch(() => props.timeFormat, v => { if (v && v !== timeFormat.value) timeFormat.value = v as any })
    watch(() => props.timeFrom, v => { const n = Number(v); if ((v == null || (Number.isFinite(n) && n >= 0 && n <= 1440)) && v !== timeFrom.value) timeFrom.value = v as any })
    watch(() => props.timeStep, v => { const n = Number(v); if ((v == null || (Number.isFinite(n) && n > 0 && n <= 1440)) && v !== timeStep.value) timeStep.value = v as any })
    watch(() => props.timeTo, v => { const n = Number(v); if ((v == null || (Number.isFinite(n) && n >= 0 && n <= 1440)) && v !== timeTo.value) timeTo.value = v as any })
    watch(() => props.hideTitleBar, v => { const nv = !!v; if (nv !== hideTitleBar.value) hideTitleBar.value = nv })
    watch(() => props.twelveHour, v => { const nv = !!v; if (nv !== twelveHour.value) twelveHour.value = nv })
    watch(() => props.activeView, v => { if (v && v !== calendarRef.value?.view?.id) { activeView.value = v as any; calendarRef.value?.switchView(v as any) } })
    watch(() => props.disableViews, v => { if (v !== disableViews.value) { disableViews.value = v as any; if (calendarRef.value && Array.isArray(v) && v.includes(calendarRef.value.view.id)) { const fb = ['years','year','month','week','day'].find(x => !v.includes(x as any)); if (fb) calendarRef.value.switchView(fb as any) } } })
    watch(() => props.class, () => refreshResponsiveClassList())

    return {
      VueCal,
      attrs,
      props,
      calendarRef,
      visibleClass,
      disableClass,
      responsiveClassList,
      slotNames,
      selectedDate,
      events,
      disableDays,
      eventsOnMonthView,
      hideWeekdays,
      hideWeekends,
      locale,
      maxDate,
      minDate,
      startWeekOnSunday,
      time,
      timeCellHeight,
      timeFormat,
      timeFrom,
      timeStep,
      timeTo,
      hideTitleBar,
      twelveHour,
      activeView,
      disableViews,
      onViewChange,
      onCellClick,
    }
  }
})
</script>

<style scoped>
::v-deep(.vuecal__header) {
  background-color: var(--vuecal-filled-back-color);
  font-size: var(--vuecal-header-font-size);
  color: var(--vuecal-filled-font-color);
}
::v-deep(.vuecal__title-bar) {
  font-size: var(--vuecal-title-button-font-size);
  color: var(--vuecal-filled-font-color);
}
::v-deep(.vuecal__title button) {
  font-size: var(--vuecal-title-button-font-size);
  color: var(--vuecal-filled-font-color);
}
::v-deep(.vuecal__arrow) {
  font-size: var(--vuecal-title-button-font-size);
  color: var(--vuecal-filled-font-color);
}
::v-deep(.vuecal__body) {
  font-size: var(--vuecal-body-font-size);
}
::v-deep(.vuecal__no-event) {
  font-size: var(--vuecal-no-event-font-size);
}
::v-deep(.vuecal__event) {
  background-color: var(--vuecal-filled-back-color);
  font-size: var(--vuecal-body-font-size);
  color: var(--vuecal-filled-font-color);
}
::v-deep(.vuecal__cell) {
  z-index: 1;
  background-color: var(--vuecal-empty-back-color);
  color: var(--vuecal-empty-font-color);
}
::v-deep(.vuecal__cell--disabled) {
  color: var(--vuecal-empty-disabled-color) !important;;
}
::v-deep(.vuecal__cell--out-of-scope) {
  color: var(--vuecal-empty-out-of-scope-font-color);
}
::v-deep(.vuecal__cell-content) {
  min-height: var(--vuecal-cell-content-min_heihgt);
  overflow: var(--vuecal-cell-content-overflow);
  max-height: var(--vuecal-cell-content-max_heihgt);
}
::v-deep(.vuecal__time-cell) {
  background-color: var(--vuecal-empty-back-color);
  color: var(--vuecal-empty-font-color);
}
::v-deep(.vuecal__cell--selected) {
  z-index: 5;
  background-color: var(--vuecal-selected-back-color) !important;
}
::v-deep(.vuecal__cell--today) {
  z-index: 3;
  background-color: var(--vuecal-today-back-color);
}
::v-deep(.vuecal__event-content) {
  display: flex;
  align-items: center;
  height: 80%;
}
::v-deep(.vuecal__weekdays-headings .clickable) {
  cursor: var(--calendar-clickable-cursor);
}
::v-deep(.vuecal__weekdays-headings .weekend) {
  color: var(--vuecal-weekend-back-color);
}
::v-deep(.vuecal__time-column .vuecal__time-cell-line:before) {
  border-top: 1px solid rgba(196, 196, 196, .2);
  z-index: 10;
}
::v-deep(.vuecal__time-column .special_time) {
  color: rgba(221, 85, 85, 1);
}

@media (hover: hover) and (pointer: fine) {
  ::v-deep(.vuecal__event .vuecal__event-delete) {
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
  }
  ::v-deep(.vuecal__event:hover .vuecal__event-delete) {
    opacity: 1;
    pointer-events: auto;
  }
}
::v-deep(.vuecal__event-delete) {
  top: 1.4em;
  width: 1.5em;
  color: transparent;

  &::before {
    content: 'X';
    color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    text-align: center;
    pointer-events: none;
  }
}
</style>