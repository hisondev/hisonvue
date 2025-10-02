import { defineComponent, ref, h, onMounted, markRaw, type Component } from 'vue'

export function createSSRClientOnly(
  importer: () => Promise<{ default: Component }>,
  componentName: string
): Component {
  return defineComponent({
    name: `${componentName}SSRWrapper`,
    setup(_, { slots, attrs }) {
      const comp = ref<Component | null>(null)
      onMounted(async () => {
        const mod = await importer()
        comp.value = markRaw(mod.default)
      })
      return () => (comp.value ? h(comp.value as any, { ...attrs }, slots) : null)
    }
  })
}
