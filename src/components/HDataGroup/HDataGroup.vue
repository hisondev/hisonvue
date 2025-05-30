<template>
  <div
    ref="dataGroupRef"
    class="hison-data-group"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import type { HDataGroupMethods } from '../../types'
import { hisonCloser, EditMode, DataStatus, hison } from '../..'
import { getUUID, registerReloadable } from '../../utils'
import { dataGroupProps } from './props'
import { InterfaceDataModel } from 'hisonjs'

export default defineComponent({
  name: 'HDataGroup',
  props: dataGroupProps,
  emits: [
    'update:modelValue',
    'mounted',
    'responsive-change'
  ],
  setup(props, { emit }) {
    const dataGroupRef = ref<HTMLFormElement | null>(null)
    const dataGroupMethods = ref<HDataGroupMethods | null>(null)
    const id = props.id ?? getUUID()
    const modelValue = ref(props.modelValue)
    const editMode = ref(props.editMode ?? EditMode.editable)
    const status = ref(props.status ?? DataStatus.R)

    const isModified = ref(false)

    const mount = () => {
      if (!dataGroupRef.value) return
      dataGroupMethods.value = {
        getId : () => id,
        getType : () => 'dataGroup',
        clear : (autoSetStatus = true) => {

        },
        getDataModel : () => { return new hison.data.DataModel() },
        getDataObject : () => { return {} },
        load : (data: Record<string, any> | InterfaceDataModel, autoSetStatus?: boolean) => {

        },
        getStatus : () => { return status.value },
        setStatus : (val: keyof typeof DataStatus) => { status.value = DataStatus[val] },
        isModified : () => { return isModified.value},
        initModified : () => { isModified.value = true },
        checkRequired : () => {
          return null
        },
        getEditMode : () => { return editMode.value },
        setEditMode : (val: keyof typeof EditMode) => { editMode.value = EditMode[val] },
      }
      
      hisonCloser.component.dataGroupList[id] = dataGroupMethods.value
      emit('mounted', dataGroupMethods.value)
    }

    const unmount = () => {
        delete hisonCloser.component.dataGroupList[id]
    }

    const reloadId = `hdataGroup:${id}`
    registerReloadable(reloadId, () => {
      unmount()
      setTimeout(mount)
    })

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(() => props.modelValue, (newVal) => {
    })

    return {
      dataGroupRef,
      props
    }
  }
})
</script>

<style scoped>
</style>
