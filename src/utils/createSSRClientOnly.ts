// hisonvue/utils/createSSRClientOnly.ts
import { defineComponent, ref, h, onMounted, markRaw, type DefineComponent } from 'vue'

export const createSSRClientOnly = <T extends DefineComponent<any, any, any>>(importer: () => Promise<{ default: T }>, componentName: string) =>
defineComponent({
  name: `${componentName}SSRWrapper`,
  setup(_, { slots, attrs }) {
    const comp = ref<T | null>(null)

    onMounted(async () => {
      const imported = await importer()
      comp.value = markRaw(imported.default)
    })

    return () => comp.value ? h(comp.value, { ...attrs }, slots) : null
  }
})
