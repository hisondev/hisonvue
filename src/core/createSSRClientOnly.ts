// src/core/createSSRClientOnly.ts
import { defineComponent, ref, h, onMounted, markRaw, Component } from 'vue'

export const createSSRClientOnly = <T extends Component>(
  importer: () => Promise<{ default: T }>,
  componentName: string
) =>
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
