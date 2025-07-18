<template>
  <div
    ref="inputGroupRef"
    class="hison-data-group"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, provide, watch } from 'vue'
import type { HInputGroupMethods } from '../../types'
import { hisonCloser, EditMode, DataStatus, hison } from '../..'
import { getUUID, registerReloadable, reloadHisonComponent, unregisterReloadable } from '../../utils'
import { inputGroupProps } from './props'
import { InterfaceDataModel } from 'hisonjs'

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
        ownedInputIds.value.sort((a, b) => a.localeCompare(b));

        const model = props.modelValue ?? {}
        if (model && Object.prototype.hasOwnProperty.call(model, inputId)) {
          hison.component.getInput(inputId)?.setValue?.(model[inputId])
        }
      }
    })
    provide('notifyInputGroupStatus', (inputId: string, newVal: any) => {
      if (status.value !== DataStatus.U) status.value = DataStatus.U
      const updated = {
        ...props.modelValue,
        [inputId]: newVal,
      }
      emit('update:modelValue', updated)
    })

    const _getDataObject = () => {
      const obj: Record<string, any> = {}
      if(!ownedInputIds.value) return obj
      ownedInputIds.value.forEach((key)=>{
        const input = hison.component.getInput(key)
        if(input )obj[key] = input.getValue()
      })
      return obj
    }
    const _setDataObject = (dataObject: Record<string, any>) => {
      if (!dataObject || typeof dataObject !== 'object') return
      Object.keys(dataObject).forEach((key) => {
        if (ownedInputIds.value.includes(key)) {
          const value = dataObject[key]
          const input = hison.component.getInput(key)
          if (input) input.setValue(value)
        }
      })
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
            const input = hison.component.getInput(inputId)
            if(input) input.setValue(null)
          })
          if (autoSetStatus) {
            status.value = DataStatus.C
          }
        },
        getDataModel : () => { return new hison.data.DataModel(_getDataObject()) },
        setDataModel : <T extends Record<string, any>>(dataModel: InterfaceDataModel<T>) => {
          if(dataModel.getRowCount() > 0) return _setDataObject(dataModel.getRow(0))
        },
        getDataObject : () => {
          return _getDataObject()
        },
        setDataObject : (dataObject: Record<string, any>) => {
          return _setDataObject(dataObject)
        },
        load : <T extends Record<string, any>>(data: Record<string, any> | InterfaceDataModel<T>) => {
          if (data && (data as InterfaceDataModel).getIsDataModel && (data as InterfaceDataModel).getIsDataModel()) {
            const dataModel: InterfaceDataModel = data as InterfaceDataModel
            if(dataModel.getColumnCount() === 0 || dataModel.getRowCount() === 0) return
            _setDataObject(dataModel.getRow(0))
          } else if (data && typeof data === 'object') {
            const dataObject: Record<string, any> = data
            _setDataObject(dataObject)
          }
        },
        getStatus : () => { return status.value },
        setStatus : (val: keyof typeof DataStatus) => { status.value = DataStatus[val] },
        isModified : () => {
          for (const inputId of ownedInputIds.value) {
            const input = hison.component.getInput(inputId)
            if(input && input.isModified()) return true
          }
          return false
        },
        initModified : () => {
          ownedInputIds.value.forEach((inputId) => {
            const input = hison.component.getInput(inputId)
            if(input) input.setModified(false)
          })
        },
        checkRequired: () => {
          for (const inputId of ownedInputIds.value) {
            const input = hison.component.getInput(inputId)
            if (input?.getRequired?.() && !input.getValue?.()) {
              return input
            }
          }
          return null
        },
        getEditMode : () => { return editMode.value },
        setEditMode : (val: EditMode) => {
          editMode.value = val
          ownedInputIds.value.forEach((inputId) => {
            const input = hison.component.getInput(inputId)
            if(input) input.setEditMode(val)
          })
        },
        focus : (inputId?: string) => {
          if (inputId) return hison.component.getInput(inputId)?.focus()
          for (const inputId of ownedInputIds.value) {
            const input = hison.component.getInput(inputId)
            if(input && input.getEditMode() === EditMode.editable) {
              return input.focus()
            }
          }
        },
        reload: () => reloadHisonComponent(reloadId)
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

    watch(() => props.modelValue, (newVal) => {
      _setDataObject(newVal)
    }, { deep: true })

    return {
      inputGroupRef,
      props
    }
  }
})
</script>

<style scoped>
</style>
