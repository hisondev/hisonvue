<template>
  <div class="hison-calendar-wrapper">
    <VueCal
      ref="calendarRef"
      :events="internalEvents"
      :view="currentView"
      :selected-date="currentSelectedDate"
      :hide-title-bar="props.hideTitleBar"
      :time="false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { calendarProps } from './props'

export default defineComponent({
  name: 'HCalendar',
  components: {
    VueCal
  },
  props: calendarProps,
  setup(props) {
    const calendarRef = ref<InstanceType<typeof VueCal> | null>(null)

    const internalEvents = ref(props.modelValue || [])
    const currentView = ref(props.view)
    const currentSelectedDate = ref(props.selectedDate || '')

    watch(
      () => props.modelValue,
      (newVal) => {
        internalEvents.value = newVal || []
      },
      { deep: true }
    )

    watch(
      () => props.view,
      (newView) => {
        currentView.value = newView
      }
    )

    watch(
      () => props.selectedDate,
      (newDate) => {
        currentSelectedDate.value = newDate || ''
      }
    )

    return {
      props,
      calendarRef,
      internalEvents,
      currentView,
      currentSelectedDate
    }
  }
})
</script>

<style scoped>
.hison-calendar-wrapper {
  width: 100%;
  font-family: var(--hison-font-family, sans-serif);
  font-size: calc(var(--hison-size-rate, 1) * 1rem);
}
</style>
