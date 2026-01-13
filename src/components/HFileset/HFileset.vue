<template>
  <!-- ✅ Button-only mode: wrapper/fileset 없이 버튼만 렌더 -->
  <template v-if="buttonOnly">
    <template v-if="!readonly">
      <HButton
        @click="openFileDialog"
        @focus="$emit('focus', filesetMethods)"
        @blur="$emit('blur', filesetMethods)"
        :id="`hison_fileset_add_button_${id}`"
        :disable="disable"
        :class="buttonOnlyClass"
        :style="props.style"
        :tabIndex="tabIndex ?? undefined"
      >
        <template v-if="$slots['add-button']">
          <slot name="add-button" :add="openFileDialog" :disable="disable" />
        </template>
        <template v-else>
          <span class="hison-fileset-add-text">{{ addButtonText }}</span>
        </template>
      </HButton>
    </template>
  </template>

  <!-- ✅ Normal mode: 기존 UI 그대로 -->
  <template v-else>
    <div
      :class="[
        'hison-wrapper',
        ...responsiveClassList,
        visibleClass,
      ]"
    >
      <div
        :class="[
          'hison-fileset',
          editModeClass,
        ]"
        :style="props.style"
      >
        <div
          class="file-list-wrapper"
          :class="{ 'drag-over': isDragging }"
          @dragover.prevent
          @dragenter.prevent="handleDragEnter"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <div :class="['file-list', { 'multi-cols': multiCols }]">
            <template v-if="visibleFiles.length === 0 && placeholder">
              <div class="file-placeholder">{{ placeholder }}</div>
            </template>

            <template v-else>
              <div
                v-for="(file, index) in visibleFiles"
                :key="index"
                class="file-item"
              >
                <slot name="file-icon" :file="file" />
                <span
                  class="file-name"
                  @click="downloadFile(file)"
                  :class="{ clickable: file.file || file.filePath }"
                >
                  {{ file.fileName }}
                </span>

                <template v-if="!readonly">
                  <template v-if="$slots['remove-button']">
                    <slot
                      name="remove-button"
                      :file="file"
                      :index="index"
                      :remove="() => removeFile(file)"
                      :disable="disable"
                    />
                  </template>
                  <template v-else>
                    <button
                      class="delete-btn"
                      :class="{ 'hison-disable': disable }"
                      :disabled="disable"
                      @click="removeFile(file)"
                    >
                      <span class="hison-fileset-remove-text">{{ removeButtonText }}</span>
                    </button>
                  </template>
                </template>
              </div>
            </template>
          </div>
        </div>

        <template v-if="!readonly">
          <div class="add-btn-container">
            <HButton
              @click="openFileDialog"
              @focus="$emit('focus', filesetMethods)"
              @blur="$emit('blur', filesetMethods)"
              :id="`hison_fileset_add_button_${id}`"
              :disable="disable"
              :class="[...buttonClassList]"
              :tabIndex="tabIndex ?? undefined"
            >
              <template v-if="$slots['add-button']">
                <slot name="add-button" :add="openFileDialog" :disable="disable" />
              </template>
              <template v-else>
                <span class="hison-fileset-add-text">{{ addButtonText }}</span>
              </template>
            </HButton>
          </div>
        </template>
      </div>
    </div>
  </template>

  <!-- ✅ input은 공용 (buttonOnly에서도 openFileDialog가 이걸 click) -->
  <input
    :id="`hison_fileset_${id}`"
    ref="fileInputRef"
    type="file"
    :accept="accept || undefined"
    :multiple="multiple"
    hidden
    @change="onFileChange"
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { filesetProps } from './props'
import { AttachedFileItem, HFilesetMethods } from '../../types'
import {
  addComponentNameToClass,
  extractPrefixedClasses,
  extractResponsiveClasses,
  getIndexSpecificClassNameFromClassList,
  getUUID,
  registerReloadable,
  reloadHisonComponent,
  toClassString,
  unregisterReloadable
} from '../../utils'
import { EditMode } from '../../enums'
import { hison } from '../..'
import { useDevice } from '../../core'
import { InterfaceDataModel } from 'hisonjs'
import { hisonCloser } from '../../hisonCloser'

export default defineComponent({
  name: 'HFileset',
  props: filesetProps,
  emits: [
    'mounted',
    'responsive-change',
    'update:modelValue',
    'add',
    'remove',
    'focus',
    'blur',
    'download',
    'change'
  ],
  setup(props, { emit }) {
    const fileInputRef = ref<HTMLInputElement | null>(null)
    const internalFiles = ref<AttachedFileItem[]>([...props.modelValue])
    const filesetMethods = ref<HFilesetMethods | null>(null)
    const id = props.id ? props.id : getUUID()
    const reloadId = `hfileset:${id}`

    const visible = ref(props.visible)
    const editMode = ref(props.editMode)
    const disable = computed(() => editMode.value === EditMode.disable)
    const readonly = computed(() => editMode.value === EditMode.readonly)
    const editModeClass = computed(() => editMode.value !== EditMode.editable ? `hison-fileset-${editMode.value}` : '')
    const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')

    const attId = ref(props.attId || '')

    const addButtonText = ref(props.addButtonText || '')
    const removeButtonText = ref(props.removeButtonText || '')
    const placeholder = ref(props.placeholder ?? '')
    const isDragging = ref(false)
    const enableDrop = ref(props.enableDrop)
    const downloadHandler = ref(typeof props.downloadHandler === 'function' ? props.downloadHandler : undefined)

    const multiCols = ref(props.multiCols ?? false)
    const multiple = ref(props.multiple ?? false)

    // ✅ buttonOnly only (fileListVisible 제거)
    const buttonOnly = ref(!!props.buttonOnly)

    const isModified = ref(false)

    const allowedTypes = ref<string[]>(
      Array.isArray(props.allowedTypes)
        ? props.allowedTypes
        : props.allowedTypes
          ? props.allowedTypes.split(',')
          : []
    )
    const disallowedTypes = ref<string[]>(
      Array.isArray(props.disallowedTypes)
        ? props.disallowedTypes
        : props.disallowedTypes
          ? props.disallowedTypes.split(',')
          : []
    )
    const maxFileSize = ref<number>(props.maxFileSize ?? hison.getMaxFilesetSize())
    const maxTotalSize = ref<number>(props.maxTotalFileSize ?? hison.getMaxFilesetTotalSize())
    const maxFileCount = ref<number>(props.maxFileCount)

    const onDisallowedType = ref(typeof props.onDisallowedType === 'function' ? props.onDisallowedType : undefined)
    const onMaxFileSizeExceeded = ref(typeof props.onMaxFileSizeExceeded === 'function' ? props.onMaxFileSizeExceeded : undefined)
    const onMaxTotalSizeExceeded = ref(typeof props.onMaxTotalSizeExceeded === 'function' ? props.onMaxTotalSizeExceeded : undefined)

    const tabIndex = ref<number | null>(
      props.tabIndex !== null && props.tabIndex !== '' ? Number(props.tabIndex) : null
    )

    const device = useDevice()

    const responsiveClassList = ref<string[]>([])
    const refreshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(toClassString(props.class) || '', device.value)
      if (getIndexSpecificClassNameFromClassList(responsiveClassList.value, 'col') === -1) responsiveClassList.value.push('hison-col-12')
      addComponentNameToClass(responsiveClassList.value, 'size', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'primary')
    }

    const buttonClassList = computed(() => {
      const classList: string[] = []
      classList.push(...extractPrefixedClasses(toClassString(props.class) || '', 'size'))
      classList.push(...extractPrefixedClasses(toClassString(props.class) || '', 'color'))
      return classList
    })

    // ✅ 타입 에러 방지: buttonOnly 모드 class는 "string"으로 합쳐서 전달
    const buttonOnlyClass = computed(() => {
      const cls = toClassString(props.class) || ''
      return ['fileset-add-btn', cls, visibleClass.value].filter(Boolean).join(' ')
    })

    const accept = computed(() => {
      if (allowedTypes.value.length === 0) return ''
      const disallowedSet = new Set(disallowedTypes.value.map(t => t.toLowerCase()))
      const filtered = allowedTypes.value.filter(t => !disallowedSet.has(t.toLowerCase()))
      return filtered.length > 0 ? filtered.join(',') : undefined
    })

    const openFileDialog = () => {
      fileInputRef.value?.click()
    }

    const isFileTypeAllowed = (file: File): boolean => {
      const type = file.type
      const ext = '.' + file.name.split('.').pop()?.toLowerCase()

      if (allowedTypes.value.length > 0) {
        const allowed = allowedTypes.value.some(t => t === type || t === ext)
        if (!allowed) {
          console.warn(`File type not in allowedTypes: ${type} / ${ext}`)
          onDisallowedType.value?.(file, allowedTypes.value, null)
          return false
        }
      }

      // ✅ implementation-first: allowedTypes 있어도 disallowedTypes 적용
      if (disallowedTypes.value.length > 0) {
        const blocked = disallowedTypes.value.some(t => t === type || t === ext)
        if (blocked) {
          console.warn(`File type is in disallowedTypes: ${type} / ${ext}`)
          onDisallowedType.value?.(file, null, disallowedTypes.value)
          return false
        }
      }

      return true
    }

    const isFileSizeAllowed = (file: File) => {
      if (
        typeof maxFileSize.value === 'number' &&
        Number.isFinite(maxFileSize.value) &&
        file.size > maxFileSize.value
      ) {
        console.warn(`File too large: ${file.name}\nMax size: ${maxFileSize.value} Byte`)
        onMaxFileSizeExceeded.value?.(file, file.size, maxFileSize.value)
        return false
      }
      return true
    }

    const processFiles = (fileArray: File[]) => {
      let validFiles = fileArray.filter(file =>
        isFileSizeAllowed(file) && isFileTypeAllowed(file)
      )

      if (!multiple.value && validFiles.length > 1) {
        validFiles = [validFiles[0]]
      }

      let filesChanged = false
      const addedItems: AttachedFileItem[] = []

      for (const file of validFiles) {
        const currentFiles = internalFiles.value.filter(f => !f.isDeleted)
        const currentCount = currentFiles.length
        const currentSize = currentFiles.reduce((sum, f) => sum + (f.fileSize ?? 0), 0)

        const projectedTotalSize = currentSize + file.size
        if (maxTotalSize.value > 0 && projectedTotalSize > maxTotalSize.value) {
          onMaxTotalSizeExceeded.value?.(file, projectedTotalSize, maxTotalSize.value)
          console.warn(`Total file size exceeds limit.`)
          break
        }

        if (!multiple.value) {
          for (const f of currentFiles) {
            if (f.isNew) {
              const idx = internalFiles.value.indexOf(f)
              if (idx !== -1) internalFiles.value.splice(idx, 1)
            } else {
              f.isDeleted = true
            }
          }
          filesChanged = true
        }

        if (multiple.value && maxFileCount.value > 0 && currentCount >= maxFileCount.value) {
          const replaceIndex = internalFiles.value.findIndex(f => !f.isDeleted)
          if (replaceIndex !== -1) {
            const toReplace = internalFiles.value[replaceIndex]
            if (toReplace.isNew) {
              internalFiles.value.splice(replaceIndex, 1)
            } else {
              toReplace.isDeleted = true
            }
            filesChanged = true
          } else {
            console.warn(`No replaceable file found for maxFileCount overflow.`)
            break
          }
        }

        const newItem: AttachedFileItem = {
          fileName: file.name,
          fileSize: file.size,
          extension: file.name.split('.').pop(),
          file,
          isNew: true,
        }

        internalFiles.value.push(newItem)
        filesChanged = true
        addedItems.push(newItem)
      }

      if (filesChanged) {
        isModified.value = true
        emit('update:modelValue', [...internalFiles.value])
        if (addedItems.length) emit('add', hison.utils.deepCopyObject(addedItems), filesetMethods.value)
        emit('change', hison.utils.deepCopyObject(internalFiles.value), filesetMethods.value)
      }
    }

    const findInternalIndex = (file: AttachedFileItem) => {
      const byRef = internalFiles.value.indexOf(file)
      if (byRef !== -1) return byRef

      if (file.fileId) {
        const idx = internalFiles.value.findIndex(f => f.fileId === file.fileId)
        if (idx !== -1) return idx
      }
      if (file.file) {
        const idx = internalFiles.value.findIndex(f => f.file === file.file)
        if (idx !== -1) return idx
      }
      if (file.filePath) {
        const idx = internalFiles.value.findIndex(f => f.filePath === file.filePath)
        if (idx !== -1) return idx
      }
      return -1
    }

    // ✅ removeFile 인덱스 버그 방지: "visibleFiles index"가 아니라 "실제 internalFiles index"로 제거
    const removeFile = (file: AttachedFileItem) => {
      if (editMode.value !== EditMode.editable) return

      const idx = findInternalIndex(file)
      if (idx === -1) return

      const target = internalFiles.value[idx]
      if (target.fileId) {
        target.isDeleted = true
      } else {
        internalFiles.value.splice(idx, 1)
      }

      isModified.value = true
      emit('update:modelValue', [...internalFiles.value])
      emit('remove', hison.utils.deepCopyObject(target), idx, filesetMethods.value)
      emit('change', hison.utils.deepCopyObject(internalFiles.value), filesetMethods.value)
    }

    const onFileChange = (e: Event) => {
      if (editMode.value !== EditMode.editable) return

      const files = (e.target as HTMLInputElement).files
      if (!files || files.length === 0) return

      processFiles(Array.from(files))
      nextTick(() => {
        if (fileInputRef.value) fileInputRef.value.value = ''
      })
    }

    const visibleFiles = computed(() => internalFiles.value.filter(file => !file.isDeleted))

    // ✅ downloadFile Blob 생성 제거: File은 그대로 createObjectURL 사용
    const downloadFile = (file: AttachedFileItem) => {
      emit('download', hison.utils.deepCopyObject(file), filesetMethods.value)

      if (downloadHandler.value) {
        downloadHandler.value(file)
        return
      }

      let url = ''
      const filename = file.fileName || 'download'

      if (file.file) {
        url = URL.createObjectURL(file.file)
      } else if (file.filePath) {
        url = file.filePath
      } else {
        console.warn('Download failed: no filePath or file object.')
        return
      }

      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()

      if (file.file) {
        URL.revokeObjectURL(url)
      }
    }

    const handleDragEnter = () => {
      if (!enableDrop.value || editMode.value !== EditMode.editable) return
      isDragging.value = true
    }
    const handleDrop = (e: DragEvent) => {
      isDragging.value = false
      if (!enableDrop.value || editMode.value !== EditMode.editable) return
      if (!e.dataTransfer?.files) return
      processFiles(Array.from(e.dataTransfer.files))
    }

    const applyDataModel = <T extends AttachedFileItem>(dataModel: InterfaceDataModel<T>) => {
      if (!dataModel || !(dataModel as any).getIsDataModel || !(dataModel as any).getIsDataModel()) return
      if ((dataModel as any).getRowCount && (dataModel as any).getRowCount() === 0) return
      const rows = (dataModel as any).getRows() as AttachedFileItem[]
      internalFiles.value = [...rows]
    }

    // ✅ modelValue sync: stringify 대신 안정적인 스냅샷 비교
    const normalizeSnapshot = (list: AttachedFileItem[]) => {
      return (list || []).map(f => ({
        fileId: f.fileId ?? '',
        fileName: f.fileName ?? '',
        fileSize: Number(f.fileSize ?? 0),
        filePath: f.filePath ?? '',
        isDeleted: !!f.isDeleted,
        isNew: !!f.isNew,
        fileMeta: f.file ? `${f.file.name}|${f.file.size}|${f.file.type}` : ''
      }))
    }
    const isSameModelValue = (a: AttachedFileItem[], b: AttachedFileItem[]) => {
      const aa = normalizeSnapshot(a)
      const bb = normalizeSnapshot(b)
      if (aa.length !== bb.length) return false
      for (let i = 0; i < aa.length; i++) {
        const x = aa[i]
        const y = bb[i]
        if (
          x.fileId !== y.fileId ||
          x.fileName !== y.fileName ||
          x.fileSize !== y.fileSize ||
          x.filePath !== y.filePath ||
          x.isDeleted !== y.isDeleted ||
          x.isNew !== y.isNew ||
          x.fileMeta !== y.fileMeta
        ) return false
      }
      return true
    }

    const mount = () => {
      if (hisonCloser.component.filesetList[id] && (hisonCloser.component.filesetList[id] as any).isHisonvueComponent) {
        console.warn(`[Hisonvue] The fileset ID is at risk of being duplicated. ${id}`)
      }

      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })

      if (!fileInputRef.value) return

      refreshResponsiveClassList()

      filesetMethods.value = {
        isHisonvueComponent: true,
        getId: () => id,
        getType: () => 'fileset',

        isVisible: () => visible.value,
        setVisible: (val: boolean) => { visible.value = val },

        getEditMode: () => editMode.value,
        setEditMode: (val: EditMode) => {
          editMode.value = val
          hisonCloser.component.buttonList[`hison_fileset_add_button_${id}`]?.setDisable(disable.value)
        },

        getValue: () => hison.utils.deepCopyObject(internalFiles.value),
        setValue: (attachedFileItem: AttachedFileItem[]) => {
          internalFiles.value = hison.utils.deepCopyObject([...(attachedFileItem ?? [])])
        },

        getDataModel: () => internalFiles.value.length > 0 ? new hison.data.DataModel(internalFiles.value) : null,
        setDataModel: <T extends AttachedFileItem>(dataModel: InterfaceDataModel<T>) => { applyDataModel(dataModel) },
        load: <T extends AttachedFileItem>(data: AttachedFileItem[] | Record<string, any>[] | InterfaceDataModel<T>) => {
          if (data && (data as any).getIsDataModel && (data as any).getIsDataModel()) {
            applyDataModel(data as InterfaceDataModel<T>)
          } else {
            internalFiles.value = hison.utils.deepCopyObject([...(data as AttachedFileItem[])])
          }
        },

        getAttId: () => attId.value,
        setAttId: (val: string) => { attId.value = val },

        getAddButtonText: () => addButtonText.value,
        setAddButtonText: (val: string) => { addButtonText.value = val },

        getRemoveButtonText: () => removeButtonText.value,
        setRemoveButtonText: (val: string) => { removeButtonText.value = val },

        isEnableDrop: () => enableDrop.value,
        setEnableDrop: (val: boolean) => { enableDrop.value = val },

        setDownloadHandler: (handler: (file: AttachedFileItem) => void) => { downloadHandler.value = handler },

        isMultiCols: () => multiCols.value,
        setMultiCols: (val: boolean) => { multiCols.value = val },

        isMultiple: () => multiple.value,
        setMultiple: (val: boolean) => { multiple.value = val },

        getPlaceholder: () => placeholder.value,
        setPlaceholder: (val: string) => { placeholder.value = val },

        getAllowedTypes: () => allowedTypes.value,
        setAllowedTypes: (val: string[]) => { allowedTypes.value = val ?? [] },

        getDisallowedTypes: () => disallowedTypes.value,
        setDisallowedTypes: (val: string[]) => { disallowedTypes.value = val ?? [] },

        getMaxFileSize: () => maxFileSize.value,
        setMaxFileSize: (val: number) => { maxFileSize.value = val },

        getMaxTotalFileSize: () => maxTotalSize.value,
        setMaxTotalFileSize: (val: number) => { maxTotalSize.value = val },

        getMaxFileCount: () => maxFileCount.value,
        setMaxFileCount: (val: number) => { maxFileCount.value = val },

        setOnDisallowedType: (handler) => { onDisallowedType.value = handler },
        setOnMaxFileSizeExceeded: (handler) => { onMaxFileSizeExceeded.value = handler },
        setOnMaxTotalSizeExceeded: (handler) => { onMaxTotalSizeExceeded.value = handler },

        isModified: () => isModified.value,
        setModified: (val: boolean) => { isModified.value = val },

        getTabIndex: () => tabIndex.value,
        setTabIndex: (v: number | null) => { tabIndex.value = v !== null && v !== undefined ? Number(v) : null },

        // ✅ new: buttonOnly runtime
        isButtonOnly: () => buttonOnly.value,
        setButtonOnly: (v: boolean) => { buttonOnly.value = !!v },

        focus: () => { hisonCloser.component.buttonList[`hison_fileset_add_button_${id}`]?.focus() },
        reload: () => reloadHisonComponent(reloadId)
      }

      hisonCloser.component.filesetList[id] = filesetMethods.value
      emit('mounted', filesetMethods.value)
    }

    const unmount = () => {
      unregisterReloadable(reloadId)
      delete hisonCloser.component.filesetList[id]
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(
      () => props.modelValue,
      (newVal) => {
        const next = Array.isArray(newVal) ? newVal : []
        if (!isSameModelValue(next, internalFiles.value)) {
          internalFiles.value = [...next]
        }
      },
      { deep: true }
    )

    watch(device, (newDevice) => {
      refreshResponsiveClassList()
      emit('responsive-change', newDevice)
    })

    watch(() => props.visible, v => { const nv = !!v; if (nv !== visible.value) visible.value = nv })
    watch(() => props.editMode, v => {
      if (v && v !== editMode.value) {
        editMode.value = v as any
        nextTick(() => hisonCloser.component.buttonList[`hison_fileset_add_button_${id}`]?.setDisable(disable.value))
      }
    })
    watch(() => props.attId, v => { const s = v ?? ''; if (s !== attId.value) attId.value = s })
    watch(() => props.addButtonText, v => { const s = v ?? ''; if (s !== addButtonText.value) addButtonText.value = s })
    watch(() => props.removeButtonText, v => { const s = v ?? ''; if (s !== removeButtonText.value) removeButtonText.value = s })
    watch(() => props.placeholder, v => { const s = v ?? ''; if (s !== placeholder.value) placeholder.value = s })
    watch(() => props.enableDrop, v => { const nv = !!v; if (nv !== enableDrop.value) enableDrop.value = nv })
    watch(() => props.downloadHandler, v => { const fn = typeof v === 'function' ? v : undefined; if (fn !== downloadHandler.value) downloadHandler.value = fn })
    watch(() => props.multiCols, v => { const nv = !!v; if (nv !== multiCols.value) multiCols.value = nv })
    watch(() => props.multiple, v => { const nv = !!v; if (nv !== multiple.value) multiple.value = nv })

    // ✅ buttonOnly prop sync
    watch(() => props.buttonOnly, v => {
      const nv = !!v
      if (nv !== buttonOnly.value) buttonOnly.value = nv
    })

    watch(() => props.allowedTypes, v => {
      const arr = Array.isArray(v) ? v : (typeof v === 'string' ? v.split(',') : [])
      const norm = arr.map(s => String(s).trim()).filter(Boolean)
      if (JSON.stringify(norm) !== JSON.stringify(allowedTypes.value)) allowedTypes.value = norm
    })
    watch(() => props.disallowedTypes, v => {
      const arr = Array.isArray(v) ? v : (typeof v === 'string' ? v.split(',') : [])
      const norm = arr.map(s => String(s).trim()).filter(Boolean)
      if (JSON.stringify(norm) !== JSON.stringify(disallowedTypes.value)) disallowedTypes.value = norm
    })

    watch(() => props.maxFileSize, v => {
      const n = v === Infinity ? Infinity : Number(v)
      if ((Number.isFinite(n) || n === Infinity) && n !== maxFileSize.value) maxFileSize.value = n as number
    })
    watch(() => props.maxTotalFileSize, v => {
      const n = v === Infinity ? Infinity : Number(v)
      if ((Number.isFinite(n) || n === Infinity) && n !== maxTotalSize.value) maxTotalSize.value = n as number
    })
    watch(() => props.maxFileCount, v => {
      const n = Number(v)
      if (Number.isInteger(n) && n >= 0 && n !== maxFileCount.value) maxFileCount.value = n
    })
    watch(() => props.onDisallowedType, v => { const fn = typeof v === 'function' ? v : undefined; if (fn !== onDisallowedType.value) onDisallowedType.value = fn })
    watch(() => props.onMaxFileSizeExceeded, v => { const fn = typeof v === 'function' ? v : undefined; if (fn !== onMaxFileSizeExceeded.value) onMaxFileSizeExceeded.value = fn })
    watch(() => props.onMaxTotalSizeExceeded, v => { const fn = typeof v === 'function' ? v : undefined; if (fn !== onMaxTotalSizeExceeded.value) onMaxTotalSizeExceeded.value = fn })
    watch(() => props.tabIndex, v => { const nv = (v === null || v === '') ? null : Number(v); if (nv !== tabIndex.value) tabIndex.value = nv })
    watch(() => props.class, () => { refreshResponsiveClassList() })

    return {
      fileInputRef,
      id,
      props,
      visibleFiles,
      filesetMethods,
      responsiveClassList,
      buttonClassList,
      visibleClass,
      editModeClass,
      disable,
      readonly,
      addButtonText,
      removeButtonText,
      placeholder,
      isDragging,
      multiCols,
      multiple,
      accept,
      tabIndex,

      buttonOnly,
      buttonOnlyClass,

      openFileDialog,
      removeFile,
      onFileChange,
      downloadFile,
      handleDragEnter,
      handleDrop,
    }
  },
})
</script>

<style scoped></style>