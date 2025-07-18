<template>
  <div
    :class="[
      'hison-fileset',
      ...responsiveClassList,
      visibleClass,
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
      <div
        :class="['file-list', { 'multi-cols': multiCols }]"
      >
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
                  :remove="() => removeFile(index)"
                  :disable="disable"
                />
              </template>
              <template v-else>
                <button
                  class="delete-btn"
                  :class="{ 'hison-disable': disable }"
                  :disabled="disable"
                  @click="removeFile(index)"
                  >
                  <span v-html="removeButtonTextHtml"></span>
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
          @focus="$emit('focus', fileSetMethods)"
          @blur="$emit('blur', fileSetMethods)"
          :id="`hison_input_file_add_button_${id}`"
          :disable="disable"
          :class="[...buttonClassList]"
          >
          <template v-if="$slots['add-button']">
            <slot name="add-button" :add="openFileDialog" />
          </template>
          <template v-else>
            <span v-html="addButtonTextHtml"></span>
          </template>
        </HButton>
      </div>
    </template>

    <input
      :id="`hison_fileset_${id}`"
      ref="fileInputRef"
      type="file"
      :accept="accept || undefined"
      :multiple="multiple"
      hidden
      @change="onFileChange"
    />
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, computed, nextTick, onMounted, onBeforeUnmount, watch, readonly } from 'vue'
import { fileSetProps } from './props'
import { AttachedFileItem, HFileSetMethods } from '../../types'
import { addComponentNameToClass, extractPrefixedClasses, extractResponsiveClasses, getIndexSpecificClassNameFromClassList, getUUID, registerReloadable, reloadHisonComponent, unregisterReloadable } from '../../utils'
import { EditMode } from '../../enums'
import { hison, hisonCloser } from '../..'
import { useDevice } from '../../core'
import { InterfaceDataModel } from 'hisonjs'

export default defineComponent({
  name: 'HFileSet',
  props: fileSetProps,
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
    const fileSetMethods = ref<HFileSetMethods | null>(null)
    const id = props.id ? props.id : getUUID()
    const reloadId = `hbutton:${id}`
    
    const visible = ref(props.visible)
    const editMode = ref(props.editMode)
    const disable = computed(() => editMode.value === EditMode.disable)
    const readonly = computed(() => editMode.value === EditMode.readonly)
    const editModeClass = computed(() => editMode.value !== EditMode.editable ? `hison-fileset-${editMode.value}` : '')
    const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')

    const attId = ref(props.attId || '')

    const addButtonText = ref(props.addButtonText || '')
    const addButtonTextHtml = computed(() => (addButtonText.value || '').replace(/\n/g, '<br>'))
    const removeButtonText = ref(props.removeButtonText || '')
    const removeButtonTextHtml = computed(() =>(removeButtonText.value || '').replace(/\n/g, '<br>'))
    const placeholder = ref(props.placeholder ?? '')
    const isDragging = ref(false)
    const enableDrop = ref(props.enableDrop)
    const downloadHandler = ref(typeof props.downloadHandler === 'function' ? props.downloadHandler : undefined)

    const multiCols = ref(props.multiCols ?? false)
    const multiple = ref(props.multiple ?? false)

    const isModified = ref(false)

    const accept = computed(() => {
      if (allowedTypes.value.length === 0) return ''

      const disallowedSet = new Set(disallowedTypes.value.map(t => t.toLowerCase()))
      const filtered = allowedTypes.value.filter(t => !disallowedSet.has(t.toLowerCase()))

      return filtered.length > 0 ? filtered.join(',') : undefined
    })

    const allowedTypes = ref<string[]>(Array.isArray(props.allowedTypes) ? props.allowedTypes : props.allowedTypes ? props.allowedTypes.split(',') : [])
    const disallowedTypes = ref<string[]>(Array.isArray(props.disallowedTypes) ? props.disallowedTypes : props.disallowedTypes ? props.disallowedTypes.split(',') : [])
    const maxFileSize = ref<number>(props.maxFileSize ?? hison.getMaxFileSetSize())
    const maxTotalSize = ref<number>(props.maxTotalFileSize ?? hison.getMaxFileSetTotalSize())
    const maxFileCount = ref<number>(props.maxFileCount)

    const onDisallowedType = ref(typeof props.onDisallowedType === 'function' ? props.onDisallowedType : undefined)
    const onMaxFileSizeExceeded = ref(typeof props.onMaxFileSizeExceeded === 'function' ? props.onMaxFileSizeExceeded : undefined)
    const onMaxTotalSizeExceeded = ref(typeof props.onMaxTotalSizeExceeded === 'function' ? props.onMaxTotalSizeExceeded : undefined)

    const device = useDevice()
    
    const responsiveClassList = ref<string[]>([])
    const refleshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(props.class || '', device.value)
      if (getIndexSpecificClassNameFromClassList(responsiveClassList.value, 'col') === -1) responsiveClassList.value.push('hison-col-12')
      addComponentNameToClass(responsiveClassList.value, 'size', 'fileset', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'fileset', 'primary')
    }
    const buttonClassList = computed(() => {
      const classList = []
      classList.push(...extractPrefixedClasses(props.class || '', 'size'))
      classList.push(...extractPrefixedClasses(props.class || '', 'color'))
      return classList
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
        validFiles = [validFiles[0]] // 단일 선택만 허용
      }

      let filesChanged = false
      const addedItems: AttachedFileItem[] = []

      for (const file of validFiles) {
        let currentFiles = internalFiles.value.filter(f => !f.isDeleted)
        let currentCount = currentFiles.length
        let currentSize = currentFiles.reduce((sum, f) => sum + (f.fileSize ?? 0), 0)

        const projectedTotalSize = currentSize + file.size
        if (maxTotalSize.value > 0 && projectedTotalSize > maxTotalSize.value) {
          onMaxTotalSizeExceeded.value?.(file, projectedTotalSize, maxTotalSize.value)
          console.warn(`Total file size exceeds limit.`)
          break
        }

        // ❗ multiple = false → 기존 파일 무조건 제거
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

        // ❗ multiple = true + maxFileCount > 0 → 바꿔치기
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

        // 신규 파일 추가
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
        if (addedItems.length) emit('add', hison.utils.deepCopyObject(addedItems), fileSetMethods.value)
        emit('change', hison.utils.deepCopyObject(internalFiles.value), fileSetMethods.value)
      }
    }

    const removeFile = (index: number) => {
      if(editMode.value !== EditMode.editable) return
      const target = internalFiles.value[index]
      if (target.fileId) {
          target.isDeleted = true
      } else {
          internalFiles.value.splice(index, 1)
      }
      isModified.value = true
      emit('update:modelValue', [...internalFiles.value])
      emit('remove', hison.utils.deepCopyObject(target), index, fileSetMethods.value)
      emit('change', hison.utils.deepCopyObject(internalFiles.value), fileSetMethods.value)
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

    const visibleFiles = computed(() => {
      return internalFiles.value.filter(file => !file.isDeleted)
    })

    const downloadFile = (file: AttachedFileItem) => {
      emit('download', hison.utils.deepCopyObject(file), fileSetMethods.value)
      if (downloadHandler.value) {
        downloadHandler.value(file)
        return
      }

      let url = ''
      let filename = file.fileName || 'download'

      if (file.file) {
        const blob = new Blob([file.file], { type: file.file.type })
        url = URL.createObjectURL(blob)
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

    const handleDragEnter = (e: DragEvent) => {
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
      if (!dataModel || !dataModel.getIsDataModel || !dataModel.getIsDataModel()) return
      if (dataModel.getRowCount() === 0) return
      const rows = dataModel.getRows() as AttachedFileItem[]
      internalFiles.value = [...rows]
    }

    const mount = () => {
      if (hisonCloser.component.fileSetList[id]) throw new Error(`[Hisonvue] fileSet id attribute was duplicated.`)
      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })
      if (!fileInputRef.value) return
      refleshResponsiveClassList()
      fileSetMethods.value = {
        getId: () => id,
        getType : () => 'fileSet',
        isVisible : () => visible.value,
        setVisible : (val: boolean) => { visible.value = val },
        getEditMode : () => { return editMode.value },
        setEditMode : (val: EditMode) => {
          editMode.value = val
          hisonCloser.component.buttonList[`hison_input_file_add_button_${id}`]?.setDisable(disable.value)
        },
        getValue: () => hison.utils.deepCopyObject(internalFiles.value),
        setValue: (attachedFileItem: AttachedFileItem[]) => { internalFiles.value = hison.utils.deepCopyObject([...attachedFileItem]) },
        getDataModel: () => internalFiles.value.length > 0 ? new hison.data.DataModel(internalFiles.value) : null,
        setDataModel: <T extends AttachedFileItem>(dataModel: InterfaceDataModel<T>) => { applyDataModel(dataModel) },
        load : <T extends AttachedFileItem>(data: AttachedFileItem[] | Record<string, any>[] | InterfaceDataModel<T>) => {
          if (data && (data as InterfaceDataModel).getIsDataModel && (data as InterfaceDataModel).getIsDataModel()) {
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
        getPlaceholder : () => placeholder.value,
        setPlaceholder : (val: string) => { placeholder.value = val },
        getAllowedTypes: () => allowedTypes.value,
        setAllowedTypes: (val: string[]) => { allowedTypes.value = val },
        getDisallowedTypes: () => disallowedTypes.value,
        setDisallowedTypes: (val: string[]) => { disallowedTypes.value = val },
        getMaxFileSize: () => maxFileSize.value,
        setMaxFileSize: (val: number) => { maxFileSize.value = val },
        getMaxTotalFileSize: () => maxTotalSize.value,
        setMaxTotalFileSize: (val: number) => { maxTotalSize.value = val },
        getMaxFileCount: () => maxFileCount.value,
        setMaxFileCount: (val: number) => { maxFileCount.value = val },
        setOnDisallowedType: (handler) => { onDisallowedType.value = handler },
        setOnMaxFileSizeExceeded: (handler) => { onMaxFileSizeExceeded.value = handler },
        setOnMaxTotalSizeExceeded: (handler) => { onMaxTotalSizeExceeded.value = handler },
        isModified : () => { return isModified.value },
        setModified : (val: boolean) => { isModified.value = val},
        focus : () => { hisonCloser.component.buttonList[`hison_input_file_add_button_${id}`]?.focus() },
        reload: () => reloadHisonComponent(reloadId)
      }
      hisonCloser.component.fileSetList[id] = fileSetMethods.value
      emit('mounted', fileSetMethods.value)
    }

    const unmount = () => {
      unregisterReloadable(reloadId)
      delete hisonCloser.component.fileSetList[id]
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(
      () => props.modelValue,
      (newVal) => {
        if (JSON.stringify(newVal) !== JSON.stringify(internalFiles.value)) {
          internalFiles.value = [...newVal]
        }
      },
      { deep: true }
    )

    watch(device, (newDevice) => {
      refleshResponsiveClassList()
      emit('responsive-change', newDevice)
    })

    return {
      fileInputRef,
      id,
      props,
      visibleFiles,
      fileSetMethods,
      responsiveClassList,
      buttonClassList,
      visibleClass,
      editModeClass,
      disable,
      readonly,
      addButtonTextHtml,
      removeButtonTextHtml,
      placeholder,
      isDragging,
      multiCols,
      multiple,
      accept,

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

<style scoped>
</style>
