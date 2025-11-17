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
import { EditMode, DataStatus, hison } from '../..'
import { getUUID, registerReloadable, reloadHisonComponent, unregisterReloadable } from '../../utils'
import { inputGroupProps } from './props'
import { InterfaceDataModel } from 'hisonjs'
import { hisonCloser } from '../../hisonCloser'

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

    const radioGroups = ref<Record<string, string[]>>({})
    const radioSelection = ref<Record<string, string | null>>({})

    provide('registerToInputGroup', (inputId: string) => {
      if (!ownedInputIds.value.includes(inputId)) {
        ownedInputIds.value.push(inputId)
        ownedInputIds.value.sort((a, b) => a.localeCompare(b));

        const model = props.modelValue ?? {}
        if (model && Object.prototype.hasOwnProperty.call(model, inputId)) {
          hison.component.getInput(inputId)?.setValue?.(model[inputId])
        }

        const input = hison.component.getInput(inputId)
        if (input?.getInputType?.() === 'radio') {
          const name = (input as any).getName?.() || inputId
          if (!radioGroups.value[name]) radioGroups.value[name] = []
          if (!radioGroups.value[name].includes(inputId)) {
            radioGroups.value[name].push(inputId)
          }
          
          if (input.getValue?.()) {
            radioSelection.value[name] = inputId
          } else if (!Object.prototype.hasOwnProperty.call(radioSelection.value, name)) {
            radioSelection.value[name] = null
          }
        }
      }
    })

    provide('radioMembershipChanged', (
      inputId: string,
      oldName: string,
      newName: string,
      checked: boolean
    ) => {
      if (oldName === newName) return

      if (oldName && radioGroups.value[oldName]) {
        radioGroups.value[oldName] = radioGroups.value[oldName].filter(id => id !== inputId)
        if (radioSelection.value[oldName] === inputId) {
          radioSelection.value[oldName] = null
          const updated = { ...(props.modelValue || {}) }
          updated[oldName] = null
          emit('update:modelValue', updated, inputId)
        }
        if (radioGroups.value[oldName].length === 0) {
          delete radioGroups.value[oldName]
          delete radioSelection.value[oldName]
        }
      }

      if (!radioGroups.value[newName]) radioGroups.value[newName] = []
      if (!radioGroups.value[newName].includes(inputId)) {
        radioGroups.value[newName].push(inputId)
      }

      if (checked) {
        radioSelection.value[newName] = inputId
        for (const id of radioGroups.value[newName]) {
          hison.component.getInput(id)?.setValue?.(id === inputId)
        }
        const updated = { ...(props.modelValue || {}) }
        updated[newName] = inputId
        emit('update:modelValue', updated, inputId)
        if (status.value !== DataStatus.U) status.value = DataStatus.U
      } else {
        if (!Object.prototype.hasOwnProperty.call(radioSelection.value, newName)) {
          radioSelection.value[newName] = null
        }
      }
    })

    provide('notifyInputGroupStatus', (inputId: string, newVal: any) => {
      if (radioGroups.value[inputId]) {
        const name = inputId
        const selectedId = newVal as string | null
        radioSelection.value[name] = selectedId

        for (const id of radioGroups.value[name]) {
          hison.component.getInput(id)?.setValue?.(id === selectedId)
        }

        const updated = { ...(props.modelValue || {}) }
        updated[name] = selectedId
        emit('update:modelValue', updated, selectedId ?? undefined)

        if (status.value !== DataStatus.U) status.value = DataStatus.U
        return
      }

      if (status.value !== DataStatus.U) status.value = DataStatus.U
      const updated = {
        ...props.modelValue,
        [inputId]: newVal,
      }
      emit('update:modelValue', updated, inputId)
    })

    const _getDataObject = () => {
      const obj: Record<string, any> = {}
      if(!ownedInputIds.value) return obj
      
      ownedInputIds.value.forEach((id) => {
        const input = hison.component.getInput(id)
        if (!input) return
        if (input.getInputType?.() !== 'radio') {
          obj[id] = input.getValue?.()
        }
      })

      for (const [name, ids] of Object.entries(radioGroups.value)) {
        let selectedId: string | null = radioSelection.value[name] ?? null
        if (selectedId && !ids.includes(selectedId)) selectedId = null
        obj[name] = selectedId
      }
      return obj
    }

    const _setDataObject = (dataObject: Record<string, any>) => {
      if (!dataObject || typeof dataObject !== 'object') return

      Object.keys(dataObject).forEach((key) => {
        if (ownedInputIds.value.includes(key)) {
          const value = dataObject[key]
          hison.component.getInput(key)?.setValue?.(value)
        }
      })

      for (const [name, ids] of Object.entries(radioGroups.value)) {
        if (!Object.prototype.hasOwnProperty.call(dataObject, name)) continue
        const selectedId = dataObject[name] as string | null

        ids.forEach((id) => {
          const input = hison.component.getInput(id)
          if (!input) return
          const checked = selectedId === id
          ;(input as any).setValue?.(checked)
        })
        radioSelection.value[name] = selectedId ?? null
      }
    }

    const mount = () => {
      if (hisonCloser.component.inputGroupList[id] && hisonCloser.component.inputGroupList[id].isHisonvueComponent) console.warn(`[Hisonvue] The input group ID is at risk of being duplicated. ${id}`)
      registerReloadable(reloadId, () => {
        unmount()
        setTimeout(mount)
      })

      if (!inputGroupRef.value) return
      inputGroupMethods.value = {
        isHisonvueComponent: true,
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

    watch(() => props.modelValue, nv => { _setDataObject(nv) }, { deep: true })
    watch(() => props.editMode, v => { if (v && v !== editMode.value) { editMode.value = v as EditMode; ownedInputIds.value.forEach((inputId) => hison.component.getInput(inputId)?.setEditMode?.(editMode.value)) } })
    watch(() => props.status, v => { if (v && v !== status.value) status.value = v as DataStatus })

    return {
      inputGroupRef,
      props
    }
  }
})
</script>

<style scoped></style>
