// Allows `tsc --noEmit` (npm run type-check) to resolve SFC imports.
// vite/vue-plugin handles real .vue typing during build.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
