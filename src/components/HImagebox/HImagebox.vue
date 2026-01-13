<!-- src/components/HImagebox/HImagebox.vue -->
<template>
  <div
    :class="[
      'hison-imagebox',
      ...responsiveClassList,
      visibleClass,
      borderClass,
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
        @click="onPreviewClick"
        @dblclick="onPreviewDblClick"
        @contextmenu="onPreviewContextMenu"
        @pointerenter="onPreviewPointerEnter"
        @pointerleave="onPreviewPointerLeave"
        @pointerdown="onPreviewPointerDown"
        @pointerup="onPreviewPointerUp"
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
          :id="`hison_imagebox_add_button_${id}`"
          :disable="disable"
          :class="['hison-col-12', 'imgbox-add-btn', ...buttonClassList]"
          :tabindex="tabIndex ?? undefined"
          @click="openFileDialog"
          @focus="$emit('focus', imageboxMethods)"
          @blur="$emit('blur', imageboxMethods)"
        >
          <template v-if="$slots['add-button']">
            <slot name="add-button" :add="openFileDialog" />
          </template>
          <template v-else>
            <span class="hison-imagebox-add-text">{{ addButtonText }}</span>
          </template>
        </HButton>

        <template v-else>
          <HButton
            :id="`hison_imagebox_add_button_${id}`"
            :disable="disable"
            :class="['hison-col-6', 'imgbox-modify-btn', ...buttonClassList]"
            @click="openFileDialog"
            @focus="$emit('focus', imageboxMethods)"
            @blur="$emit('blur', imageboxMethods)"
          >
            <template v-if="$slots['modify-button']">
              <slot name="modify-button" :modify="openFileDialog" />
            </template>
            <template v-else>
              <!-- ✅ 변경: 이미지가 있을 때는 "수정" 텍스트 노출 -->
              <span class="hison-imagebox-modify-text">{{ modifyButtonText }}</span>
            </template>
          </HButton>

          <HButton
            :id="`hison_imagebox_remove_button_${id}`"
            :disable="disable"
            :class="['hison-col-6', 'imgbox-remove-btn', ...buttonClassList]"
            @click="removeImage"
          >
            <template v-if="$slots['remove-button']">
              <slot name="remove-button" :remove="removeImage" />
            </template>
            <template v-else>
              <span class="hison-imagebox-remove-text">{{ removeButtonText }}</span>
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
import { imageboxProps } from './props'
import { EditMode } from '../../enums'
import { AttachedFileItem, HImageboxMethods, hison } from '../..'
import { getUUID, extractResponsiveClasses, registerReloadable, extractPrefixedClasses, getIndexSpecificClassNameFromClassList, reloadHisonComponent, toClassString, addComponentNameToClass } from '../../utils'
import { useDevice } from '../../core'
import { InterfaceDataModel } from 'hisonjs'
import { hisonCloser } from '../../hisonCloser'

export default defineComponent({
  name: 'HImagebox',
  props: imageboxProps,
  emits: [
    'mounted',
    'responsive-change',
    'update:modelValue',
    'add',
    'remove',
    'focus',
    'blur',
    'change',
    'preview-click',
    'preview-dblclick',
    'preview-contextmenu',
    'preview-pointerenter',
    'preview-pointerleave',
    'preview-pointerdown',
    'preview-pointerup',
  ],
  setup(props, { emit }) {
    const fileInputRef = ref<HTMLInputElement | null>(null)
    const id = props.id ? props.id : getUUID()
    const reloadId = `himagebox:${id}`
    const imageboxMethods = ref<HImageboxMethods | null>(null)

    const visible = ref(props.visible)
    const editMode = ref(props.editMode)
    const disable = computed(() => editMode.value === EditMode.disable)
    const readonly = computed(() => editMode.value === EditMode.readonly)
    const border = ref<boolean>(props.border ?? false)
    const editModeClass = computed(() => editMode.value !== EditMode.editable ? `hison-imagebox-${editMode.value}` : '')
    const visibleClass = computed(() => visible.value ? '' : 'hison-display-none')
    const borderClass = computed(() => (border.value ? 'hison-border' : ''))
    
    const attId = ref(props.attId || '')

    const isDragging = ref(false)
    const enableDrop = ref(props.enableDrop)

    const placeholder = ref(props.placeholder)
    const addButtonText = ref(props.addButtonText)
    const modifyButtonText = ref(props.modifyButtonText)
    const removeButtonText = ref(props.removeButtonText)

    const allowedTypes = ref<string[]>(Array.isArray(props.allowedTypes) ? props.allowedTypes : props.allowedTypes ? props.allowedTypes.split(',') : [])
    const disallowedTypes = ref<string[]>(Array.isArray(props.disallowedTypes) ? props.disallowedTypes : props.disallowedTypes ? props.disallowedTypes.split(',') : [])
    const maxFileSize = ref<number>(props.maxFileSize ?? hison.getMaxFilesetSize())
    const onDisallowedType = ref(typeof props.onDisallowedType === 'function' ? props.onDisallowedType : undefined)
    const onMaxFileSizeExceeded = ref(typeof props.onMaxFileSizeExceeded === 'function' ? props.onMaxFileSizeExceeded : undefined)

    const imageValue = ref<AttachedFileItem | null>(props.modelValue)
    const isModified = ref(false)

    const accept = computed(() => {
      if (allowedTypes.value.length === 0) return ''
      const disallowedSet = new Set(disallowedTypes.value.map(t => t.toLowerCase()))
      const filtered = allowedTypes.value.filter(t => !disallowedSet.has(t.toLowerCase()))
      return filtered.length > 0 ? filtered.join(',') : undefined
    })

    const previewUrl = ref<string | null>(null)
    const setPreviewUrl = (val: AttachedFileItem | null) => {
      if (!val || val.isDeleted) {
        previewUrl.value = null
        return
      }
      if (val.filePath) {
        previewUrl.value = val.filePath
      } else if (val.file instanceof File) {
        const reader = new FileReader()
        reader.onload = e => previewUrl.value = String(e.target?.result || '')
        reader.readAsDataURL(val.file)
      } else if (val.fileName && val.fileName.startsWith('data:')) {
        previewUrl.value = val.fileName
      } else {
        previewUrl.value = null
      }
    }
    setPreviewUrl(imageValue.value)

    const emitPreview = (name: string, ev: Event) => {
      emit(name as any, { event: ev, api: imageboxMethods.value! })
    }

    const onPreviewClick = (e: MouseEvent) => emitPreview('preview-click', e)
    const onPreviewDblClick = (e: MouseEvent) => emitPreview('preview-dblclick', e)
    const onPreviewContextMenu = (e: MouseEvent) => emitPreview('preview-contextmenu', e)

    const onPreviewPointerEnter = (e: PointerEvent) => emitPreview('preview-pointerenter', e)
    const onPreviewPointerLeave = (e: PointerEvent) => emitPreview('preview-pointerleave', e)
    const onPreviewPointerDown  = (e: PointerEvent) => emitPreview('preview-pointerdown', e)
    const onPreviewPointerUp    = (e: PointerEvent) => emitPreview('preview-pointerup', e)

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
      const classList = []
      classList.push(...extractPrefixedClasses(toClassString(props.class) || '', 'size'))
      classList.push(...extractPrefixedClasses(toClassString(props.class) || '', 'color'))
      return classList
    })

    const showAddButton = computed(() => editMode.value !== EditMode.readonly)
    const showRemoveButton = computed(() => !!imageValue.value && editMode.value !== EditMode.readonly)

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
      emit('add', newItem, imageboxMethods.value)
      emit('change', newItem, imageboxMethods.value)
    }

    const onFileChange = (e: Event) => {
      if (editMode.value !== EditMode.editable) return
      const files = (e.target as HTMLInputElement).files
      if (!files || !files.length) return
      processFile(files[0])
      nextTick(() => { if (fileInputRef.value) fileInputRef.value.value = '' })
    }
    
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

    const removeImage = () => {
      if (editMode.value !== EditMode.editable) return
      const prev = imageValue.value
      if (prev && prev.file && !prev.fileId) {
        imageValue.value = null
      }
      else if (prev && prev.fileId) {
        imageValue.value = { ...prev, isDeleted: true }
      }
      setPreviewUrl(null)
      isModified.value = true
      emit('update:modelValue', imageValue.value)
      emit('remove', prev, imageboxMethods.value)
      emit('change', imageValue.value, imageboxMethods.value)
    }

    const openFileDialog = () => { fileInputRef.value?.click() }

    const applyDataModel = <T extends AttachedFileItem>(dataModel: InterfaceDataModel<T>) => {
      if (!dataModel || !dataModel.getIsDataModel || !dataModel.getIsDataModel()) return
      if (dataModel.getRowCount() === 0) return
      const imageFile = dataModel.getRow(0)
      imageValue.value = imageFile
      setPreviewUrl(imageFile)
    }

    const mount = () => {
      if (hisonCloser.component.imageboxList[id] && hisonCloser.component.imageboxList[id].isHisonvueComponent) console.warn(`[Hisonvue] The imagebox ID is at risk of being duplicated. ${id}`)
      registerReloadable(reloadId, () => {
        unmount()
        nextTick(mount)
      })
      if (!fileInputRef.value) return
      refreshResponsiveClassList()
      imageboxMethods.value = {
        isHisonvueComponent: true,
        getId: () => id,
        getType: () => 'imagebox',
        isVisible: () => visible.value,
        setVisible: (val: boolean) => visible.value = val,
        getEditMode: () => editMode.value,
        setEditMode: (val: EditMode) => { 
          editMode.value = val
          hisonCloser.component.buttonList[`hison_imagebox_add_button_${id}`]?.setDisable(disable.value)
          hisonCloser.component.buttonList[`hison_imagebox_remove_button_${id}`]?.setDisable(disable.value)
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

        // ✅ new: modify button text runtime
        getModifyButtonText: () => modifyButtonText.value,
        setModifyButtonText: (val: string) => { modifyButtonText.value = val },

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
        isBorder: () => border.value,
        setBorder: (val: boolean) => { border.value = val },
        getTabIndex: () => tabIndex.value,
        setTabIndex: (v: number | null) => {
          tabIndex.value = v !== null && v !== undefined ? Number(v) : null
        },
        focus: () => { hisonCloser.component.buttonList[`hison_imagebox_add_button_${id}`]?.focus() },
        reload: () => reloadHisonComponent(reloadId)
      }
      hisonCloser.component.imageboxList[id] = imageboxMethods.value
      emit('mounted', imageboxMethods.value)
    }
    const unmount = () => {
      delete hisonCloser.component.imageboxList[id]
    }

    onMounted(mount)
    onBeforeUnmount(unmount)

    watch(device, (newDevice) => {
      refreshResponsiveClassList()
      emit('responsive-change', newDevice)
    })

    watch(() => props.visible, v => { const nv = !!v; if (nv !== visible.value) visible.value = nv })
    watch(() => props.editMode, v => { if (v && v !== editMode.value) { editMode.value = v as any; nextTick(() => { hisonCloser.component.buttonList[`hison_imagebox_add_button_${id}`]?.setDisable(disable.value); hisonCloser.component.buttonList[`hison_imagebox_remove_button_${id}`]?.setDisable(disable.value) }) } })
    watch(() => props.border, v => { const b = !!v; if (b !== border.value) border.value = b })
    watch(() => props.attId, v => { const s = v || ''; if (s !== attId.value) attId.value = s })
    watch(() => props.allowedTypes, v => { const nv = Array.isArray(v) ? v : v ? String(v).split(',') : []; if (nv.toString() !== allowedTypes.value.toString()) allowedTypes.value = nv })
    watch(() => props.disallowedTypes, v => { const nv = Array.isArray(v) ? v : v ? String(v).split(',') : []; if (nv.toString() !== disallowedTypes.value.toString()) disallowedTypes.value = nv })
    watch(() => props.maxFileSize, v => { const n = Number(v); if ((Number.isFinite(n) || n === Infinity) && n !== maxFileSize.value) maxFileSize.value = n })
    watch(() => props.onDisallowedType, v => { const fn = typeof v === 'function' ? v : undefined; if (fn !== onDisallowedType.value) onDisallowedType.value = fn })
    watch(() => props.onMaxFileSizeExceeded, v => { const fn = typeof v === 'function' ? v : undefined; if (fn !== onMaxFileSizeExceeded.value) onMaxFileSizeExceeded.value = fn })
    watch(() => props.placeholder, v => { const s = v ?? ''; if (s !== placeholder.value) placeholder.value = s })
    watch(() => props.addButtonText, v => { const s = v ?? ''; if (s !== addButtonText.value) addButtonText.value = s })

    watch(() => props.modifyButtonText, v => {
      const s = v ?? ''
      if (s !== modifyButtonText.value) modifyButtonText.value = s
    })

    watch(() => props.removeButtonText, v => { const s = v ?? ''; if (s !== removeButtonText.value) removeButtonText.value = s })
    watch(() => props.enableDrop, v => { const b = !!v; if (b !== enableDrop.value) enableDrop.value = b })
    watch(() => props.modelValue, v => { if (v !== imageValue.value) { imageValue.value = v; setPreviewUrl(v) } })
    watch(() => props.tabIndex, v => { const nv = (v === null || v === '') ? null : Number(v); if (nv !== tabIndex.value) tabIndex.value = nv })
    watch(() => props.class, () => { refreshResponsiveClassList() })

    return {
      fileInputRef,
      id,
      props,
      imgStyle: computed(() => props.imgStyle || {}),
      imageValue,
      imageboxMethods,
      visibleClass,
      editModeClass,
      borderClass,
      responsiveClassList,
      buttonClassList,
      disable,
      readonly,
      addButtonText,
      modifyButtonText,
      removeButtonText,
      placeholder,
      isDragging,
      previewUrl,
      showAddButton,
      showRemoveButton,
      accept,
      tabIndex,

      handleDragEnter,
      handleDrop,
      openFileDialog,
      removeImage,
      onFileChange,

      onPreviewClick,
      onPreviewDblClick,
      onPreviewContextMenu,
      onPreviewPointerEnter,
      onPreviewPointerLeave,
      onPreviewPointerDown,
      onPreviewPointerUp,
    }
  },
})
</script>

<style scoped></style>