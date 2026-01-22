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
  emits: ['update:modelValue', 'mounted'],
  setup(props, { emit }) {
    const inputGroupRef = ref<HTMLDivElement | null>(null)
    const inputGroupMethods = ref<HInputGroupMethods | null>(null)

    const id = props.id ?? getUUID()
    const reloadId = `hinputGroup:${id}`

    const editMode = ref(props.editMode ?? EditMode.editable)
    const status = ref(props.status ?? DataStatus.R)

    const ownedInputIds = ref<string[]>([])
    const radioGroups = ref<Record<string, string[]>>({})
    const radioSelection = ref<Record<string, string | null>>({})
    const inputDataKeyMap = ref<Record<string, string>>({})

    // programmatic setValue 중 notifyInputGroupStatus 루프/중복 emit 방지 플래그
    const applying = ref(false)

    const hasOwn = (obj: any, key: string) => Object.prototype.hasOwnProperty.call(obj, key)
    const getInput = (inputId: string) => hison.component.getInput(inputId)

    // dataKey는 "현재값"을 매번 읽어서 캐시에 최신화한다(런타임 변경 stale 방지)
    const readDataKey = (inputId: string) => {
      const input = getInput(inputId)
      const dk = ((input as any)?.getDataKey?.() ?? '').toString().trim()
      const key = dk ? dk : inputId
      inputDataKeyMap.value[inputId] = key
      return key
    }

    const isRadio = (inputId: string) => {
      const input = getInput(inputId)
      return input?.getInputType?.() === 'radio'
    }

    // dataKey 중복 + (radio group name vs dataKey) 충돌 경고
    const warnKeyIssues = () => {
      const used: Record<string, string[]> = {}

      ownedInputIds.value.forEach((inputId) => {
        const dk = readDataKey(inputId)
        if (!used[dk]) used[dk] = []
        used[dk].push(inputId)
      })

      Object.entries(used).forEach(([dk, ids]) => {
        if (ids.length > 1) {
          console.warn(
            `[Hisonvue] Duplicate dataKey detected in HInputGroup(${id}). dataKey=${dk} inputIds=${ids.join(',')}`
          )
        }
      })

      const nonRadioKeys: Record<string, string[]> = {}
      ownedInputIds.value.forEach((inputId) => {
        if (isRadio(inputId)) return
        const dk = readDataKey(inputId)
        if (!nonRadioKeys[dk]) nonRadioKeys[dk] = []
        nonRadioKeys[dk].push(inputId)
      })

      Object.keys(radioGroups.value).forEach((name) => {
        const hit = nonRadioKeys[name]
        if (hit && hit.length > 0) {
          console.warn(
            `[Hisonvue] Key collision detected in HInputGroup(${id}). radioGroupName=${name} conflictsWithInputDataKeyOf=${hit.join(',')}`
          )
        }
      })
    }

    // radio group value는 inputId(레거시) 또는 dataKey(신규)로 들어올 수 있으므로 dataKey로 정규화
    const resolveRadioSelectedDataKey = (name: string, selected: any) => {
      if (selected == null) return null
      if (typeof selected !== 'string') return null
      const raw = selected.trim()
      if (!raw) return null

      const ids = radioGroups.value[name] || []

      // 1) inputId로 들어온 경우
      if (ids.includes(raw)) {
        return readDataKey(raw)
      }

      // 2) dataKey로 들어온 경우
      for (const inputId of ids) {
        const dk = readDataKey(inputId)
        if (dk === raw) return raw
      }

      return null
    }

    const syncRadioGroupBySelectedDataKey = (name: string, selectedDataKey: string | null) => {
      const ids = radioGroups.value[name] || []
      ids.forEach((rid) => {
        const input = getInput(rid)
        if (!input) return
        const dk = readDataKey(rid)
        input.setValue?.(selectedDataKey != null && dk === selectedDataKey)
      })
      radioSelection.value[name] = selectedDataKey
    }

    // patch 반영 (있는 키만) + (옵션) 부모 modelValue도 patch emit
    const applyPatchCore = (dataObject: Record<string, any>, syncModel: boolean) => {
      if (!dataObject || typeof dataObject !== 'object') return
      if (!ownedInputIds.value || ownedInputIds.value.length === 0) return

      const patch: Record<string, any> = {}

      applying.value = true
      try {
        // 1) non-radio patch
        ownedInputIds.value.forEach((inputId) => {
          const input = getInput(inputId)
          if (!input) return
          if (input.getInputType?.() === 'radio') return

          const dk = readDataKey(inputId)

          if (hasOwn(dataObject, dk)) {
            const v = dataObject[dk]
            input.setValue?.(v)
            patch[dk] = v
          } else if (hasOwn(dataObject, inputId)) {
            // backward-compat: id 기반 입력을 dk로 정규화해 반영
            const v = dataObject[inputId]
            input.setValue?.(v)
            patch[dk] = v
          }
        })

        // 2) radio patch (group name 키가 들어온 경우만)
        for (const [name] of Object.entries(radioGroups.value)) {
          if (!hasOwn(dataObject, name)) continue

          const selectedDataKey = resolveRadioSelectedDataKey(name, dataObject[name])
          syncRadioGroupBySelectedDataKey(name, selectedDataKey)
          patch[name] = selectedDataKey
        }
      } finally {
        applying.value = false
      }

      if (!syncModel) return
      const keys = Object.keys(patch)
      if (keys.length === 0) return

      const updated = { ...(props.modelValue || {}) }
      keys.forEach((k) => {
        updated[k] = patch[k]
      })
      emit('update:modelValue', updated)
    }

    const applyPatchToInputs = (dataObject: Record<string, any>) => applyPatchCore(dataObject, false)
    const applyPatchAndSyncModel = (dataObject: Record<string, any>) => applyPatchCore(dataObject, true)

    provide('registerToInputGroup', (inputId: string) => {
      if (ownedInputIds.value.includes(inputId)) return

      ownedInputIds.value.push(inputId)
      ownedInputIds.value.sort((a, b) => a.localeCompare(b))

      // dataKey 최신화
      readDataKey(inputId)

      const input = getInput(inputId)
      const model = (props.modelValue || {}) as Record<string, any>

      // non-radio: modelValue 기반 초기 주입 (키가 있을 때만 = patch)
      if (input && input.getInputType?.() !== 'radio') {
        const dk = readDataKey(inputId)
        if (hasOwn(model, dk)) {
          applying.value = true
          try {
            input.setValue?.(model[dk])
          } finally {
            applying.value = false
          }
        } else if (hasOwn(model, inputId)) {
          applying.value = true
          try {
            input.setValue?.(model[inputId])
          } finally {
            applying.value = false
          }
        }
        warnKeyIssues()
        return
      }

      // radio: 그룹(name) 키(modelValue[name]) 우선 반영(늦게 등록되어도 동기화되도록)
      if (input && input.getInputType?.() === 'radio') {
        const name = (input as any).getName?.() || inputId

        if (!radioGroups.value[name]) radioGroups.value[name] = []
        if (!radioGroups.value[name].includes(inputId)) radioGroups.value[name].push(inputId)

        if (hasOwn(model, name)) {
          const selectedDataKey = resolveRadioSelectedDataKey(name, model[name])
          applying.value = true
          try {
            syncRadioGroupBySelectedDataKey(name, selectedDataKey)
          } finally {
            applying.value = false
          }
        } else {
          // modelValue에 없으면 현재 체크 상태 존중
          const dk = readDataKey(inputId)
          if (input.getValue?.()) {
            applying.value = true
            try {
              syncRadioGroupBySelectedDataKey(name, dk)
            } finally {
              applying.value = false
            }
          } else if (!hasOwn(radioSelection.value, name)) {
            radioSelection.value[name] = null
          }
        }

        warnKeyIssues()
      }
    })

    provide('radioMembershipChanged', (inputId: string, oldName: string, newName: string, checked: boolean) => {
      if (oldName === newName) return

      const dk = readDataKey(inputId)

      if (oldName && radioGroups.value[oldName]) {
        radioGroups.value[oldName] = radioGroups.value[oldName].filter((x) => x !== inputId)

        if (radioSelection.value[oldName] === dk) {
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
      if (!radioGroups.value[newName].includes(inputId)) radioGroups.value[newName].push(inputId)

      if (checked) {
        applying.value = true
        try {
          syncRadioGroupBySelectedDataKey(newName, dk)
        } finally {
          applying.value = false
        }

        const updated = { ...(props.modelValue || {}) }
        updated[newName] = dk
        emit('update:modelValue', updated, inputId)

        if (status.value !== DataStatus.U) status.value = DataStatus.U
      } else {
        if (!hasOwn(radioSelection.value, newName)) radioSelection.value[newName] = null
      }

      warnKeyIssues()
    })

    provide('notifyInputGroupStatus', (inputId: string, newVal: any) => {
      // programmatic setValue 중에는 notify 무시 (루프/중복 emit 방지)
      if (applying.value) return

      // radio 그룹 notify (inputId === group name)
      if (radioGroups.value[inputId]) {
        const name = inputId
        const selected = typeof newVal === 'string' ? newVal : null
        const selectedDataKey = resolveRadioSelectedDataKey(name, selected)

        applying.value = true
        try {
          syncRadioGroupBySelectedDataKey(name, selectedDataKey)
        } finally {
          applying.value = false
        }

        const updated = { ...(props.modelValue || {}) }
        updated[name] = selectedDataKey
        emit('update:modelValue', updated, selectedDataKey ?? undefined)

        if (status.value !== DataStatus.U) status.value = DataStatus.U
        return
      }

      if (status.value !== DataStatus.U) status.value = DataStatus.U

      const dk = readDataKey(inputId)
      const updated = { ...(props.modelValue || {}) }
      updated[dk] = newVal
      emit('update:modelValue', updated, inputId)
    })

    const _getDataObject = () => {
      const obj: Record<string, any> = {}
      if (!ownedInputIds.value) return obj

      ownedInputIds.value.forEach((inputId) => {
        const input = getInput(inputId)
        if (!input) return
        if (input.getInputType?.() === 'radio') return

        const dk = readDataKey(inputId)
        obj[dk] = input.getValue?.()
      })

      for (const [name, ids] of Object.entries(radioGroups.value)) {
        let selectedDataKey: string | null = radioSelection.value[name] ?? null

        if (selectedDataKey) {
          let exists = false
          for (const rid of ids) {
            const dk = readDataKey(rid)
            if (dk === selectedDataKey) {
              exists = true
              break
            }
          }
          if (!exists) selectedDataKey = null
        }

        obj[name] = selectedDataKey
      }

      return obj
    }

    const _setDataObject = (dataObject: Record<string, any>) => {
      // patch 반영: 있는 키만 input에 적용 (emit 없음)
      applyPatchToInputs(dataObject)
    }

    const mount = () => {
      if (hisonCloser.component.inputGroupList[id] && hisonCloser.component.inputGroupList[id].isHisonvueComponent) {
        console.warn(`[Hisonvue] The input group ID is at risk of being duplicated. ${id}`)
      }

      registerReloadable(reloadId, () => {
        unmount()
        setTimeout(mount)
      })

      if (!inputGroupRef.value) return

      inputGroupMethods.value = {
        isHisonvueComponent: true,
        getId: () => id,
        getType: () => 'inputGroup',

        clear: (autoSetStatus = true) => {
          applying.value = true
          try {
            ownedInputIds.value.forEach((inputId) => {
              const input = getInput(inputId)
              if (input) input.setValue(null)
            })
          } finally {
            applying.value = false
          }

          if (autoSetStatus) status.value = DataStatus.C
        },

        getDataModel: () => new hison.data.DataModel(_getDataObject()),

        setDataModel: <T extends Record<string, any>>(dataModel: InterfaceDataModel<T>) => {
          if (dataModel.getRowCount() > 0) {
            // load/setDataObject 후 :model-value가 "안 바뀌는" 문제 해결 포인트
            // -> patch를 부모 modelValue에도 반영(emit)
            applyPatchAndSyncModel(dataModel.getRow(0))
          }
        },

        getDataObject: () => _getDataObject(),

        setDataObject: (dataObject: Record<string, any>) => {
          // patch + 부모 modelValue patch emit
          applyPatchAndSyncModel(dataObject)
        },

        load: <T extends Record<string, any>>(data: Record<string, any> | InterfaceDataModel<T>) => {
          if (data && (data as any).getIsDataModel && (data as any).getIsDataModel()) {
            const dataModel: InterfaceDataModel = data as InterfaceDataModel
            if (dataModel.getColumnCount() === 0 || dataModel.getRowCount() === 0) return
            applyPatchAndSyncModel(dataModel.getRow(0))
          } else if (data && typeof data === 'object') {
            applyPatchAndSyncModel(data as Record<string, any>)
          }
        },

        getStatus: () => status.value,
        setStatus: (val: keyof typeof DataStatus) => {
          status.value = DataStatus[val]
        },

        isModified: () => {
          for (const inputId of ownedInputIds.value) {
            const input = getInput(inputId)
            if (input && input.isModified()) return true
          }
          return false
        },

        initModified: () => {
          ownedInputIds.value.forEach((inputId) => {
            const input = getInput(inputId)
            if (input) input.setModified(false)
          })
        },

        checkRequired: () => {
          for (const inputId of ownedInputIds.value) {
            const input = getInput(inputId)
            if (!input?.getRequired?.()) continue

            // required 체크는 "null/undefined"만 실패로 처리 (0/false는 허용)
            const v = input.getValue?.()
            if (v === null || v === undefined) return input
            if (typeof v === 'string' && v.trim() === '') return input
          }
          return null
        },

        getEditMode: () => editMode.value,
        setEditMode: (val: EditMode) => {
          editMode.value = val
          ownedInputIds.value.forEach((inputId) => {
            const input = getInput(inputId)
            if (input) input.setEditMode(val)
          })
        },

        focus: (inputId?: string) => {
          if (inputId) return getInput(inputId)?.focus()
          for (const iid of ownedInputIds.value) {
            const input = getInput(iid)
            if (input && input.getEditMode() === EditMode.editable) {
              return input.focus()
            }
          }
        },

        reload: () => reloadHisonComponent(reloadId),
      }

      hisonCloser.component.inputGroupList[id] = inputGroupMethods.value
      emit('mounted', inputGroupMethods.value)
    }

    const unmount = () => {
      unregisterReloadable(reloadId)
      delete hisonCloser.component.inputGroupList[id]

      ownedInputIds.value = []
      radioGroups.value = {}
      radioSelection.value = {}
      inputDataKeyMap.value = {}
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    // modelValue 변경 시: patch 반영(있는 키만)으로 input만 갱신 (emit 없음)
    watch(
      () => props.modelValue,
      (nv) => {
        if (!nv || typeof nv !== 'object') return
        _setDataObject(nv as any)
      },
      { deep: true }
    )

    watch(() => props.editMode, (v) => {
      if (v && v !== editMode.value) {
        editMode.value = v as EditMode
        ownedInputIds.value.forEach((inputId) => getInput(inputId)?.setEditMode?.(editMode.value))
      }
    })

    watch(() => props.status, (v) => {
      if (v && v !== status.value) status.value = v as DataStatus
    })

    return {
      inputGroupRef,
      props,
    }
  },
})
</script>

<style scoped></style>