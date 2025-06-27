<template>
  <div
    ref="inputGroupRef"
    class="hison-data-group"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch, provide } from 'vue'
import type { HInputGroupMethods, HInputMethods } from '../../types'
import { hisonCloser, EditMode, DataStatus, hison, InputType } from '../..'
import { getUUID, registerReloadable, unregisterReloadable } from '../../utils'
import { inputGroupProps } from './props'
import { InterfaceDataModel, InterfaceDataWrapper } from 'hisonjs'

export default defineComponent({
  name: 'HInputGroup',
  props: inputGroupProps,
  emits: [
    'update:modelValue',
    'mounted',
  ],
  setup(props, { emit }) {
    const inputGroupRef = ref<HTMLFormElement | null>(null)
    const inputGroupMethods = ref<HInputGroupMethods | null>(null)
    const id = props.id ?? getUUID()
    const reloadId = `hinputGroup:${id}`
    const editMode = ref(props.editMode ?? EditMode.editable)
    const status = ref(props.status ?? DataStatus.R)

    const ownedInputIds = ref<string[]>([])

    provide('registerToInputGroup', (inputId: string) => {
      if (!ownedInputIds.value.includes(inputId)) {
        ownedInputIds.value.push(inputId)
      }
    })
    provide('notifyInputGroupStatus', () => {
      if (status.value !== DataStatus.U) status.value = DataStatus.U
    })

    const _getDataObject = () => {
      const obj: Record<string, any> = {}
      if(!ownedInputIds.value) return obj
      ownedInputIds.value.forEach((key)=>{
        const input = hison.vue.getInput(key)
        if(input )obj[key] = input.getValue()
      })
      return obj
    }

    const mount = () => {
      if (hisonCloser.component.inputGroupList[id]) throw new Error(`[Hisonvue] button id attribute was duplicated.`)
      registerReloadable(reloadId, () => {
        unmount()
        setTimeout(mount)
      })

      if (!inputGroupRef.value) return
      inputGroupMethods.value = {
        getId : () => id,
        getType : () => 'inputGroup',
        clear : (autoSetStatus = true) => {
          ownedInputIds.value.forEach((inputId) => {
            const input = hison.vue.getInput(inputId)
            if(input) input.setValue(null)
          })
          if (autoSetStatus) {
            status.value = DataStatus.C
          }
        },
        getDataModel : () => { return new hison.data.DataModel(_getDataObject()) },
        getDataWrapper : () => { return new hison.data.DataWrapper(_getDataObject()) },
        getDataObject : () => {
          return _getDataObject()
        },
        load : (data: Record<string, any> | InterfaceDataModel | InterfaceDataWrapper, autoSetStatus = true) => {
          if (data && (data as InterfaceDataModel).getIsDataModel && (data as InterfaceDataModel).getIsDataModel()) {
            const dataModel: InterfaceDataModel = data as InterfaceDataModel
            if(dataModel.getColumnCount() === 0 || dataModel.getRowCount() === 0) return
            const keySet = dataModel.getColumns()
            keySet.forEach((key: string) => {
              if(ownedInputIds.value.includes(key)) {
                const value = dataModel.getValue(0, key)
                const input = hison.vue.getInput(key)
                if(input) input.setValue(value)
              }
            })
          } else if (data && (data as InterfaceDataWrapper).getIsDataWrapper && (data as InterfaceDataWrapper).getIsDataWrapper()) {
            const dataWrapper: InterfaceDataWrapper = data as InterfaceDataWrapper
            const keySet = dataWrapper.keys()
            keySet.forEach((key: string) => {
              if(ownedInputIds.value.includes(key)) {
                const value = dataWrapper.get(key)
                const input = hison.vue.getInput(key)
                if(input) input.setValue(value)
              }
            })
          } else if (data && typeof data === 'object') {
            const dataObject: Record<string, any> = data
            const keySet = Object.keys(data)
            keySet.forEach((key) => {
              if(ownedInputIds.value.includes(key)) {
                const value = dataObject[key]
                const input = hison.vue.getInput(key)
                if(input) input.setValue(value)
              }
            })
          }
          if (autoSetStatus) {
            status.value = DataStatus.R
          }
        },
        getStatus : () => { return status.value },
        setStatus : (val: keyof typeof DataStatus) => { status.value = DataStatus[val] },
        isModified : () => {
          for (const inputId of ownedInputIds.value) {
            const input = hison.vue.getInput(inputId)
            if(input && input.isModified()) return true
          }
          return false
        },
        initModified : () => {
          ownedInputIds.value.forEach((inputId) => {
            const input = hison.vue.getInput(inputId)
            if(input) input.setModified(false)
          })
        },
        checkRequired: () => {
          for (const inputId of ownedInputIds.value) {
            const input = hison.vue.getInput(inputId)
            if (input?.getRequired?.() && !input.getValue?.()) {
              return input
            }
          }
          return null
        },
        getEditMode : () => { return editMode.value },
        setEditMode : (val: keyof typeof EditMode) => {
          editMode.value = EditMode[val]
          ownedInputIds.value.forEach((inputId) => {
            const input = hison.vue.getInput(inputId)
            if(input) input.setEditMode(val)
          })
        },
      }
      hisonCloser.component.inputGroupList[id] = inputGroupMethods.value
      emit('mounted', inputGroupMethods.value)
    }
    const unmount = () => {
      unregisterReloadable(reloadId)
      delete hisonCloser.component.inputGroupList[id]
      ownedInputIds.value = []
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    return {
      inputGroupRef,
      props
    }
  }
})
</script>

<style scoped>
</style>
