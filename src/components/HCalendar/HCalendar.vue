<template>
  <div
    :class="[
      'hison-calendar',
      ...responsiveClassList,
      visibleClass,
      disableClass
    ]"
    :style="props.style"
  >
    <component
      :is="VueCal"
      ref="calendarRef"
      v-bind="calendarAttrs"
      :selected-date="selectedDate"
      :dblclick-to-create="false"
      :editable-events="false"
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
import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch, computed, unref, useSlots } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import {
  getUUID,
  registerReloadable,
  extractResponsiveClasses,
  addComponentNameToClass,
  getSpecificClassValueFromClassList,
  getIndexSpecificClassNameFromClassList,
  applyOpacityToRgba,
  normalizeToRgba,
  getRGBAFromColorText,
  getInvertColor
} from '../../utils'
import { useDevice } from '../../core'
import { hisonCloser, Size } from '../..'
import { calendarProps } from './props'

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
    const device = useDevice()
    const slots = useSlots()
    const slotNames = computed(() => Object.keys(slots))

    const visible = ref(props.visible !== false)
    const disable = ref(props.disable === true)

    const selectedDate = ref(attrs['selected-date'] instanceof Date ? attrs['selected-date'] : new Date())
    const initDate = attrs['selected-date'] instanceof Date ? attrs['selected-date'] : new Date()

    const weekendColor = ref(props.weekendColor ? normalizeToRgba(props.weekendColor) : undefined)
    const todayColor = ref(props.todayColor ? normalizeToRgba(props.todayColor) : undefined)
    const selectedColor = ref(props.selectedColor ? normalizeToRgba(props.selectedColor) : undefined)

    const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')
    const disableClass = computed(() => disable.value ? 'hison-disable-calendar' : '')
    const calendarAttrs = computed(() => {
      const userMaxDate = attrs['max-date']
      return {
        ...attrs,
        'max-date': disable.value
          ? '100-01-01'
          : userMaxDate ?? undefined
      }
    })

    const responsiveClassList = ref<string[]>([])
    const refreshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(props.class || '', device.value)

      if (getIndexSpecificClassNameFromClassList(responsiveClassList.value, 'col') === -1) {
        responsiveClassList.value.push('hison-col-12')
      }

      addComponentNameToClass(responsiveClassList.value, 'size', 'calender', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'calender', 'primary')

      if (calendarRef.value?.$el) {
        const el = calendarRef.value.$el as HTMLElement
        let color = getSpecificClassValueFromClassList(responsiveClassList.value, 'color')
        const size = getSpecificClassValueFromClassList(responsiveClassList.value, 'size')

        if(!color || !getRGBAFromColorText(color)) color = 'primary'
        el.style.setProperty('--vuecal-filled-back-color', (hisonCloser.componentStyle.componentColor as any)[`${color}`].buttonColor)
        el.style.setProperty('--vuecal-filled-font-color', (hisonCloser.componentStyle.componentColor as any)[`${color}`].filledTextColor)
        el.style.setProperty('--vuecal-empty-back-color', (hisonCloser.componentStyle.emptyColor))
        el.style.setProperty('--vuecal-empty-font-color', (hisonCloser.componentStyle.emptyTextColor))

        todayColor.value = applyOpacityToRgba((hisonCloser.componentStyle.componentColor as any)[`${color}`].buttonColor, 0.7)
        selectedColor.value = applyOpacityToRgba((hisonCloser.componentStyle.componentColor as any)[`${color}`].buttonColor, 0.4)
        el.style.setProperty('--vuecal-selected-back-color', todayColor.value)
        el.style.setProperty('--vuecal-today-back-color', selectedColor.value)

        if(weekendColor.value) el.style.setProperty('--calendar-weekend-color', weekendColor.value)

        if(hisonCloser.componentStyle.invertColor) {
          el.style.setProperty('--vuecal-empty-back-color', (hisonCloser.componentStyle.emptyInvertColor))
          el.style.setProperty('--vuecal-empty-font-color', (hisonCloser.componentStyle.emptyTextInvertColor))
          el.style.setProperty('--vuecal-selected-back-color', getInvertColor(todayColor.value))
          el.style.setProperty('--vuecal-today-back-color', getInvertColor(selectedColor.value))
          if(weekendColor.value) el.style.setProperty('--calendar-weekend-color', getInvertColor(weekendColor.value))
        }

        switch (size) {
          case Size.xl:
            el.style.setProperty('--vuecal-header-font-size', '0.9em')
            el.style.setProperty('--vuecal-title-button-font-size', '0.9em')
            el.style.setProperty('--vuecal-body-font-size', '0.9em')
            el.style.setProperty('--vuecal-no-event-font-size', '0.8em')
            break
          case Size.l:
            el.style.setProperty('--vuecal-header-font-size', '0.75em')
            el.style.setProperty('--vuecal-title-button-font-size', '0.75em')
            el.style.setProperty('--vuecal-body-font-size', '0.9em')
            el.style.setProperty('--vuecal-no-event-font-size', '0.8em')
            break
          case Size.m:
            el.style.setProperty('--vuecal-header-font-size', '0.6em')
            el.style.setProperty('--vuecal-title-button-font-size', '0.6em')
            el.style.setProperty('--vuecal-body-font-size', '0.8em')
            el.style.setProperty('--vuecal-no-event-font-size', '0.7em')
            break
          case Size.s:
            el.style.setProperty('--vuecal-header-font-size', '0.5em')
            el.style.setProperty('--vuecal-title-button-font-size', '0.5em')
            el.style.setProperty('--vuecal-body-font-size', '0.8em')
            el.style.setProperty('--vuecal-no-event-font-size', '0.7em')
            break
        }

        if(disable.value) el.style.setProperty('--calendar-clickable-cursor', 'not-allowed')
      }
    }

    const adjustStyleFromAttr = (view?: string) => {
      console.log('### adjustStyleFromAttr ###')
      const activeView = view ?? calendarRef.value.activeView
      if(!calendarRef.value) return
      if(weekendColor.value) {
        nextTick(() => {
          //.vuecal__heading
          if(activeView === 'month' || activeView === 'week') {
            const weekendNumber = attrs['start-week-on-sunday'] ? [0, 6] : [5, 6]
            const headingEl = calendarRef.value.$el.querySelectorAll('.vuecal__heading') as HTMLDivElement[]
            if(headingEl.length > 0) {
              weekendNumber.forEach((i) => {
                if(headingEl[i] && headingEl[i].classList) headingEl[i].classList.add('weekend')
              })
            }
          }
        })
      }
    }

    const onViewChange = (event: any) => {
      adjustStyleFromAttr(event.view)
      emit('view-change', event)
    }

    const onCellClick = (_date: any) => {
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
      if (hisonCloser.component.calendarList[id]) {
        throw new Error(`[Hisonvue] calendar id "${id}" is duplicated.`)
      }
      refreshResponsiveClassList()
      adjustStyleFromAttr()
      hisonCloser.component.calendarList[id] = calendarRef.value as any
      emit('mounted', calendarRef.value)
    }

    const unmount = () => {
      delete hisonCloser.component.calendarList[id]
    }

    registerReloadable(reloadId, () => {
      unmount()
      nextTick(mount)
    })

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(device, (newDevice) => {
      refreshResponsiveClassList()
      emit('responsive-change', newDevice)
    })

    return {
      VueCal,
      props,
      calendarRef,
      visibleClass,
      disableClass,
      calendarAttrs,
      responsiveClassList,
      slotNames,
      selectedDate,
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
::v-deep(.vuecal__body) {
  font-size: var(--vuecal-body-font-size);
}
::v-deep(.vuecal__arrow) {
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
  background-color: var(--vuecal-empty-back-color);
  color: var(--vuecal-empty-font-color);
}
::v-deep(.vuecal__time-cell) {
  background-color: var(--vuecal-empty-back-color);
  color: var(--vuecal-empty-font-color);
}
::v-deep(.vuecal__cell--selected) {
  background-color: var(--vuecal-selected-back-color) !important;
}
::v-deep(.vuecal__cell--today) {
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
  color: var(--calendar-weekend-color);
}
/*
::v-deep(.vuecal__event-title--edit) {
  margin-top: 20px;
}
*/
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
