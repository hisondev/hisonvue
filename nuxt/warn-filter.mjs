// nuxt/warn-filter.mjs
import { defineNuxtPlugin } from '#app'

const HISON_TAGS = new Set([
  'HAccordion','HBaggie','HBanner','HButton','HCalendar','HCaption','HChart','HDrawer',
  'HDropdown','HFileset','HGap','HGrid','HImagebox','HInput','HInputGroup','HLabel',
  'HLayout','HList','HModal','HNote','HPagination','HParagraph','HPopup','HSpinner','HTable',
])

// [Vue warn]: ...   또는   (Nuxt 축약)  Failed to resolve component: ...
const RESOLVE_RE = /^(?:\[Vue warn\]:\s*)?Failed to resolve component:\s+([A-Za-z][\w-]*)/

const WRAP_KEY = '__hisonvue_warn_wrapped__'

export default defineNuxtPlugin((nuxtApp) => {
  const app = nuxtApp.vueApp
  if (app.config.globalProperties[WRAP_KEY]) return
  app.config.globalProperties[WRAP_KEY] = true

  const prev = app.config.warnHandler

  const forward = (msg, instance, trace) => {
    if (typeof prev === 'function') return prev(msg, instance, trace)
    try {
      // vue 기본 로거 대체
      if (trace) console.warn(msg, trace)
      else console.warn(msg)
    } catch {}
  }

  app.config.warnHandler = (msg, instance, trace) => {
    if (typeof msg === 'string') {
      const m = msg.match(RESOLVE_RE)
      if (m && HISON_TAGS.has(m[1])) {
        // 우리 컴포넌트 미해결 경고만 억제
        return
      }
    }
    // 나머지는 그대로 출력
    forward(msg, instance, trace)
  }
})