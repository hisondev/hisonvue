import { defineComponent, ref, h, onMounted, markRaw } from 'vue'

export const createSSRClientOnly = (importer: () => Promise<any>, componentName: string) =>
defineComponent({
  name: `${componentName}SSRWrapper`,
  setup(_, { slots, attrs }) {
    const comp = ref<any>(null)

    onMounted(async () => {
      const imported = await importer()
      comp.value = markRaw(imported.default)
    })

    return () => comp.value ? h(comp.value, { ...attrs }, slots) : null
  }
})
