<!--
//src/components/HFileSet/HFileSet.vue
todo list
3. 속성 추가
허용 확장자(해당 확장자만 업로드 가능),
금지 확장자(허용 확장자가 있으면 허용이 우선),
단일파일 용량 제어, 전체 파일 용량 제어, 파일 개수 제어(multiple속성 false시 multiple속성이 우선),
4. HFileSetMethods
-->
<!--
나중에  global-components.ts의 HFileSet에 하단 file-icon slot에 대한 내용 추가 필요!(add button, remove button slot도!)
/**
 * @slot file-icon
 * Custom icon or markup to be shown before each file name.
 * Receives the `file` object as a scoped prop.
 * 
 * This slot is ideal for rendering file-type specific icons
 * (e.g., PDF, DOCX, image) based on file extension or MIME type.
 * 
 * @example
 * <HFileSet v-model="files">
 *   <template #file-icon="{ file }">
 *     <span v-if="file.extension === 'pdf'">📕</span>
 *     <span v-else-if="file.extension === 'jpg'">🖼️</span>
 *     <span v-else>📄</span>
 *   </template>
 * </HFileSet>
 */

 /**
 * @slot remove-button
 * Custom slot for rendering the remove button beside each file.
 * This overrides the default delete button.
 * 
 * The slot provides the following scoped props:
 * - `file: AttachedFileItem` – The file object to be removed.
 * - `index: number` – Index of the file in the list.
 * - `remove: () => void` – Call this function to remove the file.
 * - `disable: boolean` – `true` if the component is not in editable state.
 * 
 * This slot is useful when you want to replace the delete icon with a custom one.
 * 
 * @example
 * <HFileSet v-model="files">
 *   <template #remove-button="{ file, index, remove, disable }">
 *     <button
 *       class="custom-remove-btn"
 *       :disabled="disable"
 *       @click="remove"
 *     >
 *       ❌ Remove
 *     </button>
 *   </template>
 * </HFileSet>
 */

 /**
 * @slot add-button
 * Custom slot for rendering the file upload "add" button.
 * This overrides the default `HButton` used for file selection.
 * 
 * The slot provides the following scoped props:
 * - `add: () => void` – Function to open the file dialog manually.
 * - `disable: boolean` – `true` if the component is not in editable state.
 * 
 * This slot is useful for customizing button appearance and behavior.
 * 
 * @example
 * <HFileSet v-model="files">
 *   <template #add-button="{ add, disable }">
 *     <button :disabled="disable" @click="add">
 *       📁 Select Files
 *     </button>
 *   </template>
 * </HFileSet>
 */
-->
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
      :id="`hison_input_file_${id}`"
      ref="fileInputRef"
      type="file"
      :accept="accept"
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
import { addComponentNameToClass, extractPrefixedClasses, extractResponsiveClasses, getUUID, registerReloadable, reloadHisonComponent, unregisterReloadable } from '../../utils'
import { EditMode } from '../../enums'
import { hisonCloser } from '../..'
import { useDevice } from '../../core'

export default defineComponent({
  name: 'HFileSet',
  props: fileSetProps,
  emits: ['mounted', 'responsive-change', 'update:modelValue'],
  setup(props, { emit }) {
    const fileInputRef = ref<HTMLInputElement | null>(null)
    const internalFiles = ref<AttachedFileItem[]>([...props.modelValue])
    const fileSetMethods = ref<HFileSetMethods | null>(null)
    const id = props.id ? props.id : getUUID()
    const reloadId = `hbutton:${id}`
    
    const visible = ref(props.visible)
    const editMode = ref(props.editMode)
    const disable = computed(() => {
      if(editMode.value === EditMode.disable) return true
      return false
    })
    const readonly = computed(() => {
      if(editMode.value === EditMode.readonly) return true
      return false
    })
    const editModeClass = computed(() => {
      if(editMode.value !== EditMode.editable) return `hison-fileset-${editMode.value}`
      else return ''
    })
    const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')

    const addButtonText = ref(props.addButtonText || '')
    const addButtonTextHtml = computed(() =>
        (addButtonText.value || '').replace(/\n/g, '<br>')
    )
    const removeButtonText = ref(props.removeButtonText || '')
    const removeButtonTextHtml = computed(() =>
        (removeButtonText.value || '').replace(/\n/g, '<br>')
    )

    const isDragging = ref(false)
    const enableDrop = ref(props.enableDrop)
    const placeholder = ref(props.placeholder ?? '')
    const isModified = ref(false)
    const device = useDevice()
    
    const responsiveClassList = ref<string[]>([])
    const refleshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(props.class || '', device.value)
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
    }

    const onFileChange = (e: Event) => {
      if(editMode.value !== EditMode.editable) return
      const files = (e.target as HTMLInputElement).files
      if (!files) return

      const newFiles: AttachedFileItem[] = []
      for (const file of Array.from(files)) {
        newFiles.push({
          fileName: file.name,
          fileSize: file.size,
          extension: file.name.split('.').pop(),
          file,
          isNew: true,
        })
      }

      internalFiles.value.push(...newFiles)
      isModified.value = true
      emit('update:modelValue', [...internalFiles.value])

      nextTick(() => fileInputRef.value!.value = '')
    }

    const visibleFiles = computed(() => {
      return internalFiles.value.filter(file => !file.isDeleted)
    })

    const downloadFile = (file: AttachedFileItem) => {
      if (props.downloadHandler) {
        props.downloadHandler(file)
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

      const droppedFiles: AttachedFileItem[] = []
      for (const file of Array.from(e.dataTransfer.files)) {
        droppedFiles.push({
          fileName: file.name,
          fileSize: file.size,
          extension: file.name.split('.').pop(),
          file,
          isNew: true,
        })
      }

      internalFiles.value.push(...droppedFiles)
      emit('update:modelValue', [...internalFiles.value])
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

          //hisonCloser.component.buttonList[`hison_input_file_add_button_${id}`]?.reload()
        },
        getPlaceholder : () => placeholder.value,
        setPlaceholder : (val: string) => { placeholder.value = val },
        isModified : () => { return isModified.value },
        setModified : (val: boolean) => { isModified.value = val},
        focus : () => {
          hisonCloser.component.buttonList[`hison_input_file_add_button_${id}`]?.focus()
        },
        reload: () => reloadHisonComponent(reloadId)
        /*
        getText: () => hasSlot.value ? '' : internalText.value,
        getTitle: () => title.value,
        isVisible: () => visible.value,
        isDisable: () => disable.value,
        setText: (val: string) => {
        if (!hasSlot.value) internalText.value = val
        },
        setTitle: (val: string) => {
        title.value = val
        },
        setVisible: (val: boolean) => {
        visible.value = val
        },
        setDisable: (val: boolean) => {
        disable.value = val
        },
        focus: () => {
        buttonRef.value?.focus();
        }
        */
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
      responsiveClassList,
      buttonClassList,
      visibleClass,
      editModeClass,
      disable,
      readonly,
      placeholder,
      addButtonTextHtml,
      removeButtonTextHtml,
      isDragging,

      visibleFiles,
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
