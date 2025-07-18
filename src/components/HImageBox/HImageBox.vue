<template>
  <div
    :class="[
      'hison-imagebox',
      ...responsiveClassList,
      visibleClass,
      editModeClass,
    ]"
    :style="props.style"
  >
    <div
      class="img-preview"
      :class="{ 'drag-over': isDragging }"
      @dragover.prevent
      @dragenter.prevent="handleDragEnter"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <img
        v-if="previewUrl"
        :src="previewUrl"
        class="preview-img"
        :style="[imgStyle]"
      />
      <template v-else>
        <slot name="empty">
          <div class="img-placeholder">
            {{ placeholder }}
          </div>
        </slot>
      </template>

      <div class="imgbox-btn-row" v-if="!readonly">
        <HButton
          v-if="!imageValue"
          :id="`hison_input_imagebox_add_button_${id}`"
          :disable="disable"
          :class="['hison-col-12', ...buttonClassList]"
          @click="openFileDialog"
          @focus="$emit('focus', imageBoxMethods)"
          @blur="$emit('blur', imageBoxMethods)"
        >
          <template v-if="$slots['add-button']">
            <slot name="add-button" :add="openFileDialog" />
          </template>
          <template v-else>
            <span v-html="addButtonTextHtml"></span>
          </template>
        </HButton>
        <template v-else>
          <HButton
            :id="`hison_input_imagebox_add_button_${id}`"
            :disable="disable"
            :class="['hison-col-6',...buttonClassList]"
            @click="openFileDialog"
            @focus="$emit('focus', imageBoxMethods)"
            @blur="$emit('blur', imageBoxMethods)"
          >
            <template v-if="$slots['add-button']">
              <slot name="add-button" :add="openFileDialog" />
            </template>
            <template v-else>
              <span v-html="addButtonTextHtml"></span>
            </template>
          </HButton>
          <HButton
            :id="`hison_input_imagebox_remove_button_${id}`"
            :disable="disable"
            :class="['hison-col-6',...buttonClassList]"
            @click="removeImage"
          >
            <template v-if="$slots['remove-button']">
              <slot name="remove-button" :remove="removeImage" />
            </template>
            <template v-else>
              <span v-html="removeButtonTextHtml"></span>
            </template>
          </HButton>
        </template>
      </div>
    </div>

    <input
      :id="`hison_imagebox_${id}`"
      ref="fileInputRef"
      type="file"
      :accept="accept || undefined"
      :multiple="false"
      hidden
      @change="onFileChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { imageBoxProps } from './props'
import { EditMode } from '../../enums'
import { AttachedFileItem, HImageBoxMethods, hison, hisonCloser } from '../..'
import { getUUID, extractResponsiveClasses, addComponentNameToClass, registerReloadable, extractPrefixedClasses, getIndexSpecificClassNameFromClassList, reloadHisonComponent } from '../../utils'
import { useDevice } from '../../core'
import { InterfaceDataModel } from 'hisonjs'

export default defineComponent({
  name: 'HImageBox',
  props: imageBoxProps,
  emits: [
    'mounted',
    'responsive-change',
    'update:modelValue',
    'add',
    'remove',
    'focus',
    'blur',
    'change',
  ],
  setup(props, { emit }) {
    const fileInputRef = ref<HTMLInputElement | null>(null)
    const id = props.id ? props.id : getUUID()
    const reloadId = `himagebox:${id}`
    const imageBoxMethods = ref<HImageBoxMethods | null>(null)

    const visible = ref(props.visible)
    const editMode = ref(props.editMode)
    const disable = computed(() => editMode.value === EditMode.disable)
    const readonly = computed(() => editMode.value === EditMode.readonly)
    const editModeClass = computed(() => editMode.value !== EditMode.editable ? `hison-imagebox-${editMode.value}` : '')
    const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')
    
    const attId = ref(props.attId || '')

    const isDragging = ref(false)
    const enableDrop = ref(props.enableDrop)

    const placeholder = ref(props.placeholder)
    const addButtonText = ref(props.addButtonText)
    const addButtonTextHtml = computed(() => (addButtonText.value || '').replace(/\n/g, '<br>'))
    const removeButtonText = ref(props.removeButtonText)
    const removeButtonTextHtml = computed(() => (removeButtonText.value || '').replace(/\n/g, '<br>'))
    const allowedTypes = ref<string[]>(Array.isArray(props.allowedTypes) ? props.allowedTypes : props.allowedTypes ? props.allowedTypes.split(',') : [])
    const disallowedTypes = ref<string[]>(Array.isArray(props.disallowedTypes) ? props.disallowedTypes : props.disallowedTypes ? props.disallowedTypes.split(',') : [])
    const maxFileSize = ref<number>(props.maxFileSize ?? hison.getMaxFileSetSize())
    const onDisallowedType = ref(typeof props.onDisallowedType === 'function' ? props.onDisallowedType : undefined)
    const onMaxFileSizeExceeded = ref(typeof props.onMaxFileSizeExceeded === 'function' ? props.onMaxFileSizeExceeded : undefined)

    const imageValue = ref<AttachedFileItem | null>(props.modelValue)
    const isModified = ref(false)

    // accept string for file input
    const accept = computed(() => {
      if (allowedTypes.value.length === 0) return ''

      const disallowedSet = new Set(disallowedTypes.value.map(t => t.toLowerCase()))
      const filtered = allowedTypes.value.filter(t => !disallowedSet.has(t.toLowerCase()))

      return filtered.length > 0 ? filtered.join(',') : undefined
    })

    // previewUrl: 파일은 FileReader, string은 바로 사용
    const previewUrl = ref<string | null>(null)
    const setPreviewUrl = (val: AttachedFileItem | null) => {
      if (!val || val.isDeleted) {
        previewUrl.value = null
        return
      }
      // DB 파일: filePath(또는 서버에서 내려준 URL)
      if (val.filePath) {
        previewUrl.value = val.filePath
      }
      // 새로 업로드된 파일: File 객체 → base64 변환
      else if (val.file instanceof File) {
        const reader = new FileReader()
        reader.onload = e => previewUrl.value = String(e.target?.result || '')
        reader.readAsDataURL(val.file)
      }
      // 혹시 fileName에 base64 문자열을 직접 넣는 경우 등
      else if (val.fileName && val.fileName.startsWith('data:')) {
        previewUrl.value = val.fileName
      } else {
        previewUrl.value = null
      }
    }
    setPreviewUrl(imageValue.value)

    // responsive class
    const device = useDevice()
    const responsiveClassList = ref<string[]>([])
    const refleshResponsiveClassList = () => {
      responsiveClassList.value = extractResponsiveClasses(props.class || '', device.value)
      if (getIndexSpecificClassNameFromClassList(responsiveClassList.value, 'col') === -1) responsiveClassList.value.push('hison-col-12')
      addComponentNameToClass(responsiveClassList.value, 'size', 'imagebox', hisonCloser.componentStyle.size)
      addComponentNameToClass(responsiveClassList.value, 'color', 'imagebox', 'primary')
    }
    const buttonClassList = computed(() => {
      const classList = []
      classList.push(...extractPrefixedClasses(props.class || '', 'size'))
      classList.push(...extractPrefixedClasses(props.class || '', 'color'))
      return classList
    })

    // 버튼 show/hide 상태
    const showAddButton = computed(() => editMode.value !== EditMode.readonly)
    const showRemoveButton = computed(() => !!imageValue.value && editMode.value !== EditMode.readonly)

    // 파일 type/size 체크
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

    const processFile = (file: File) => {
      if (!isFileTypeAllowed(file)) return
      if (!isFileSizeAllowed(file)) return

      const extension = file.name.split('.').pop() || ''
      const newItem: AttachedFileItem = {
        fileName: file.name,
        fileSize: file.size,
        extension,
        file,
        isNew: true,
      }
      imageValue.value = newItem
      setPreviewUrl(newItem)
      isModified.value = true
      emit('update:modelValue', newItem)
      emit('add', newItem, imageBoxMethods.value)
      emit('change', newItem, imageBoxMethods.value)
    }

    // 이미지 업로드/변경
    const onFileChange = (e: Event) => {
      if (editMode.value !== EditMode.editable) return
      const files = (e.target as HTMLInputElement).files
      if (!files || !files.length) return
      processFile(files[0])
      nextTick(() => { if (fileInputRef.value) fileInputRef.value.value = '' })
    }
    
    // 드래그 핸들러
    const handleDragEnter = (e: DragEvent) => {
      if (!enableDrop.value || editMode.value !== EditMode.editable) return
      if (readonly.value || disable.value) return
      isDragging.value = true
    }
    const handleDrop = (e: DragEvent) => {
      isDragging.value = false
      if (!enableDrop.value || editMode.value !== EditMode.editable) return
      if (readonly.value || disable.value) return
      if (!e.dataTransfer?.files || !e.dataTransfer.files.length) return
      processFile(e.dataTransfer.files[0])
    }

    // 이미지 제거
    const removeImage = () => {
      if (editMode.value !== EditMode.editable) return
      const prev = imageValue.value

      // 신규 업로드 파일인 경우 (fileId 없음, file 객체 있음)
      if (prev && prev.file && !prev.fileId) {
        imageValue.value = null
      }
      // DB 파일인 경우 (fileId 있음)
      else if (prev && prev.fileId) {
        // isDeleted 플래그만 추가
        imageValue.value = { ...prev, isDeleted: true }
      }
      setPreviewUrl(null)
      isModified.value = true
      emit('update:modelValue', imageValue.value)
      emit('remove', prev, imageBoxMethods.value)
      emit('change', imageValue.value, imageBoxMethods.value)
    }

    // 파일 선택
    const openFileDialog = () => { fileInputRef.value?.click() }

    const applyDataModel = <T extends AttachedFileItem>(dataModel: InterfaceDataModel<T>) => {
      if (!dataModel || !dataModel.getIsDataModel || !dataModel.getIsDataModel()) return
      if (dataModel.getRowCount() === 0) return
      const imageFile = dataModel.getRow(0)
      imageValue.value = imageFile
      setPreviewUrl(imageFile)
    }

    const mount = () => {
      if (hisonCloser.component.imageBoxList[id]) throw new Error(`[Hisonvue] imagebox id attribute was duplicated.`)
      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })
      if (!fileInputRef.value) return
      refleshResponsiveClassList()
      imageBoxMethods.value = {
        getId: () => id,
        getType: () => 'imageBox',
        isVisible: () => visible.value,
        setVisible: (val: boolean) => visible.value = val,
        getEditMode: () => editMode.value,
        setEditMode: (val: EditMode) => { 
          editMode.value = val
          hisonCloser.component.buttonList[`hison_input_imagebox_add_button_${id}`]?.setDisable(disable.value)
          hisonCloser.component.buttonList[`hison_input_imagebox_remove_button_${id}`]?.setDisable(disable.value)
        },
        getValue: () => hison.utils.deepCopyObject(imageValue.value),
        setValue: (val: AttachedFileItem) => {
          imageValue.value = hison.utils.deepCopyObject(val)
          setPreviewUrl(val)
        },
        getDataModel: () => imageValue.value ? new hison.data.DataModel(imageValue.value) : null,
        setDataModel: <T extends AttachedFileItem>(dataModel: InterfaceDataModel<T>) => { applyDataModel(dataModel) },
        load : <T extends AttachedFileItem>(data: AttachedFileItem | Record<string, any> | InterfaceDataModel<T>) => {
          if (data && (data as InterfaceDataModel).getIsDataModel && (data as InterfaceDataModel).getIsDataModel()) {
            applyDataModel(data as InterfaceDataModel<T>)
          } else {
            imageValue.value = hison.utils.deepCopyObject(data)
          }
        },
        getAttId: () => attId.value,
        setAttId: (val: string) => { attId.value = val },
        getAddButtonText: () => addButtonText.value,
        setAddButtonText: (val: string) => addButtonText.value = val,
        getRemoveButtonText: () => removeButtonText.value,
        setRemoveButtonText: (val: string) => removeButtonText.value = val,
        getPlaceholder: () => placeholder.value,
        setPlaceholder: (val: string) => placeholder.value = val,
        isEnableDrop: () => enableDrop.value,
        setEnableDrop: (val: boolean) => { enableDrop.value = val },
        getAllowedTypes: () => allowedTypes.value,
        setAllowedTypes: (val: string[]) => allowedTypes.value = val,
        getDisallowedTypes: () => disallowedTypes.value,
        setDisallowedTypes: (val: string[]) => { disallowedTypes.value = val },
        getMaxFileSize: () => maxFileSize.value,
        setMaxFileSize: (val: number) => maxFileSize.value = val,
        setOnDisallowedType: (handler) => { onDisallowedType.value = handler },
        setOnMaxFileSizeExceeded: (handler) => { onMaxFileSizeExceeded.value = handler },
        isModified: () => isModified.value,
        setModified: (val: boolean) => isModified.value = val,
        focus: () => { hisonCloser.component.buttonList[`hison_input_imagebox_add_button_${id}`]?.focus() },
        reload: () => reloadHisonComponent(reloadId)
      }
      hisonCloser.component.imageBoxList[id] = imageBoxMethods.value
      emit('mounted', imageBoxMethods.value)
    }
    const unmount = () => {
      if (hisonCloser.component.imageBoxList && hisonCloser.component.imageBoxList[id]) {
        delete hisonCloser.component.imageBoxList[id]
      }
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    // prop/modelValue → 내부 반영
    watch(() => props.modelValue, (val) => {
      if (val !== imageValue.value) {
        imageValue.value = val
        setPreviewUrl(val)
      }
    })
    // device prop 변경 대응
    watch(device, (newDevice) => {
      refleshResponsiveClassList()
      emit('responsive-change', newDevice)
    })

    return {
      fileInputRef,
      id,
      props,
      imgStyle: computed(() => props.imgStyle || {}),
      imageValue,
      imageBoxMethods,
      visibleClass,
      editModeClass,
      responsiveClassList,
      buttonClassList,
      disable,
      readonly,
      addButtonTextHtml,
      removeButtonTextHtml,
      placeholder,
      isDragging,
      previewUrl,
      showAddButton,
      showRemoveButton,
      accept,

      handleDragEnter,
      handleDrop,
      openFileDialog,
      removeImage,
      onFileChange,
    }
  },
})
</script>

<style scoped>
</style>
