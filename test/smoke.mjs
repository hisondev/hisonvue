// hisonvue smoke test (jsdom)
// Run: npm test  (requires `npm run build` first — tests run against dist/)
// Covers: install(deep-merge config) → component mount(SSR wrapper) →
// global restyle/reload semantics → HInput value boundaries → overlay/scroll →
// mobile gesture guards.
import { strict as assert } from 'node:assert'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><head></head><body><div id="app"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
})
const { window } = dom

globalThis.window = window
globalThis.document = window.document
try { Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true }) } catch {}
globalThis.HTMLElement = window.HTMLElement
globalThis.HTMLInputElement = window.HTMLInputElement
globalThis.SVGElement = window.SVGElement
globalThis.MathMLElement = window.MathMLElement ?? class MathMLElement {}
globalThis.Element = window.Element
globalThis.Node = window.Node
globalThis.Text = window.Text
globalThis.Comment = window.Comment
globalThis.DOMTokenList = window.DOMTokenList
globalThis.MutationObserver = window.MutationObserver
globalThis.getComputedStyle = window.getComputedStyle.bind(window)
globalThis.CustomEvent = window.CustomEvent
globalThis.Event = window.Event
globalThis.KeyboardEvent = window.KeyboardEvent
globalThis.MouseEvent = window.MouseEvent
globalThis.FocusEvent = window.FocusEvent
globalThis.requestAnimationFrame = window.requestAnimationFrame ?? ((cb) => setTimeout(() => cb(Date.now()), 0))
globalThis.cancelAnimationFrame = window.cancelAnimationFrame ?? clearTimeout
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = globalThis.requestAnimationFrame
  window.cancelAnimationFrame = globalThis.cancelAnimationFrame
}
if (!window.PointerEvent) {
  window.PointerEvent = window.MouseEvent
  globalThis.PointerEvent = window.MouseEvent
}
if (!window.matchMedia) {
  window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} })
}
if (!window.ResizeObserver) {
  window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
  globalThis.ResizeObserver = window.ResizeObserver
}

const { createApp, h, nextTick } = await import('vue')
const {
  hison, hisonvue, getDefaultHisonConfig,
  HInputClientOnly, HGridClientOnly, HNoteClientOnly, HButtonClientOnly,
  HBannerClientOnly, HModalClientOnly, HDrawerClientOnly,
} = await import('../dist/hisonvue.es.js')

let passed = 0
let failed = 0
const results = []
function check(name, fn) {
  try {
    fn()
    passed++
    results.push(`  ✓ ${name}`)
  } catch (e) {
    failed++
    results.push(`  ✗ ${name}\n      ${e.message}`)
  }
}
async function flush(times = 6) {
  for (let i = 0; i < times; i++) {
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
  }
}

// ─────────────────────────────────────────────────────────────
// 1. install with a PARTIAL config (deep-merge regression test)
//    - componentStyle only sets primaryColor → every other key must fall
//      back to defaults instead of becoming undefined
//    - event: {} must not crash install (used to TypeError on cssEvent)
// ─────────────────────────────────────────────────────────────
let timeoutApplied = null
const originalSetTimeout = hison.setTimeout.bind(hison)
hison.setTimeout = (ms) => { timeoutApplied = ms; return originalSetTimeout(ms) }

const partialConfig = {
  componentStyle: { primaryColor: 'rgba(10,20,30,1)' },
  event: {},
  timeout: 0, // falsy — must still be applied (0 = unlimited in hisonjs 1.2.12)
}

const holderChildren = { inputs: [], mounted: false }
const root = createApp({
  render() {
    return h('div', [
      h(HInputClientOnly, { id: 'num1', inputType: 'number', maxNumber: 0, minNumber: -10, roundNumber: 0, modelValue: 5.7 }),
      h(HInputClientOnly, { id: 'sel1', inputType: 'select', editMode: 'readonly', options: [{ value: 'a', text: 'A' }, { value: 'b', text: 'B' }], modelValue: 'a' }),
      h(HGridClientOnly, { id: 'g1', columns: [{ id: 'c1', header: 'C1', dataType: 'text' }, { id: 'c2', header: 'C2', dataType: 'text' }] }),
      h(HNoteClientOnly, { id: 'n1' }),
      h(HButtonClientOnly, { id: 'b1', text: 'btn' }),
      h(HModalClientOnly, { id: 'm1', caption: 'modal' }),
      h(HDrawerClientOnly, { id: 'd1', position: 'bottom', swipeClose: true, visible: true, scrollLock: false }),
    ])
  },
})
root.use(hisonvue, partialConfig)
root.mount(document.getElementById('app'))
await flush(10)

check('install: partial config does not crash (deep-merge, event:{})', () => {
  assert.ok(document.getElementById('hisonvue-css-variables'), 'css variable style tag missing')
})
check('install: nested defaults survive partial componentStyle (no "undefined" css vars)', () => {
  const css = document.getElementById('hisonvue-css-variables').textContent
  assert.ok(!css.includes('undefined'), 'css variables contain "undefined"')
  assert.ok(css.includes('--hison-m-min-height: 2'), 'minHeight default lost')
})
check('install: primaryColor from partial config is applied', () => {
  assert.equal(hison.style.getPrimaryColor(), 'rgba(10,20,30,1)')
})
check('plugins: falsy config value (timeout: 0) reaches hisonjs setter', () => {
  assert.equal(timeoutApplied, 0)
})

// ─────────────────────────────────────────────────────────────
// 2. HInput boundaries
// ─────────────────────────────────────────────────────────────
const num1 = hison.component.getInput('num1')
check('HInput: mounted & registered', () => assert.ok(num1))
check('HInput: maxNumber 0 clamps (falsy boundary regression)', () => {
  assert.equal(num1.getValue(), 0) // 5.7 clamped to max 0
})
check('HInput: roundNumber 0 rounds to integer', () => {
  num1.setMaxNumber(100)
  num1.setValue(3.7)
  assert.equal(num1.getValue(), 4)
})
check('HInput: minNumber clamps below', () => {
  num1.setValue(-999)
  assert.equal(num1.getValue(), -10)
})
check('HInput: cleared number input becomes null, not 0', () => {
  num1.setValue('')
  assert.equal(num1.getValue(), null)
})
check('HInput: readonly select blocks arrow-key value change', () => {
  const sel = document.getElementById('sel1')
  assert.ok(sel, 'select element missing')
  const ev = new window.KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true, bubbles: true })
  sel.dispatchEvent(ev)
  assert.equal(ev.defaultPrevented, true, 'ArrowDown was not blocked in readonly select')
})

// ─────────────────────────────────────────────────────────────
// 3. HGrid: color-only theme change must NOT wipe grid data (restyle path)
// ─────────────────────────────────────────────────────────────
const g1 = hison.component.getGrid('g1')
check('HGrid: mounted & registered', () => assert.ok(g1))
if (g1) {
  g1.load([{ c1: 'a', c2: 'b' }, { c1: 'x', c2: 'y' }])
  hison.style.setPrimaryColor('#336699')
  await flush(4)
  check('HGrid: data survives hison.style.setPrimaryColor (in-place restyle)', () => {
    const g = hison.component.getGrid('g1')
    assert.ok(g, 'grid gone after color change')
    const values = g.getValues()
    assert.equal(values.length, 2, `row count ${values.length}`)
    assert.equal(values[0].c1, 'a')
  })
  check('HGrid: function props are not serialized into DOM attributes', () => {
    const el = document.querySelector('[data-id="g1"]')
    if (el) {
      for (const attr of el.attributes) {
        assert.ok(!String(attr.value).includes('=>'), `function source leaked into attribute ${attr.name}`)
      }
    }
  })
}

// ─────────────────────────────────────────────────────────────
// 4. HNote: content survives a color-only theme change (snapshot restore)
//    (no v-model bound on purpose — this is the previously-lossy case)
// ─────────────────────────────────────────────────────────────
const n1 = hison.component.getNote('n1')
check('HNote: mounted & registered', () => assert.ok(n1))
if (n1) {
  const textarea = n1._elements?.textarea
  if (textarea) {
    textarea.innerHTML = '<p>hello-note</p>'
  }
  hison.style.setSuccessColor('#225533')
  await flush(6)
  check('HNote: typed content survives theme color change (snapshot restore)', () => {
    const n = hison.component.getNote('n1')
    assert.ok(n, 'note gone after color change')
    const data = n.getNoteData()
    assert.ok(String(data.html).includes('hello-note'), `note content lost: ${data.html}`)
  })
}

// ─────────────────────────────────────────────────────────────
// 5. Structural reload (setSize) keeps every component registered
//    (HChart/HCalendar zombie regression — same registry mechanics)
// ─────────────────────────────────────────────────────────────
hison.style.setSize('s')
await flush(6)
check('reload: components stay registered after hison.style.setSize', () => {
  assert.ok(hison.component.getInput('num1'), 'HInput lost after setSize')
  assert.ok(hison.component.getButton('b1'), 'HButton lost after setSize')
  assert.ok(hison.component.getGrid('g1'), 'HGrid lost after setSize')
  assert.ok(hison.component.getNote('n1'), 'HNote lost after setSize')
  assert.ok(hison.component.getModal('m1'), 'HModal lost after setSize')
})
// components re-register on nextTick after each reload — give each cycle a tick
for (let i = 0; i < 5; i++) {
  hison.style.setPrimaryColor(i % 2 ? '#111111' : '#222222')
  hison.style.setSize(i % 2 ? 'm' : 's')
  await flush(2)
}
check('reload: repeated restyle+reload cycles keep working (no 3-cycle limit)', () => {
  assert.ok(hison.component.getInput('num1'))
  assert.ok(hison.component.getButton('b1'))
})
await flush(6)

// ─────────────────────────────────────────────────────────────
// 6. HModal scroll lock: html AND body locked, restored on close
// ─────────────────────────────────────────────────────────────
const m1 = hison.component.getModal('m1')
if (m1) {
  await m1.open()
  await flush(2)
  check('HModal: scroll lock applies to html and body (iOS reinforcement)', () => {
    assert.equal(document.documentElement.style.overflow, 'hidden')
    assert.equal(document.body.style.overflow, 'hidden')
  })
  await m1.close()
  await flush(2)
  check('HModal: scroll lock released on close', () => {
    assert.notEqual(document.documentElement.style.overflow, 'hidden')
    assert.notEqual(document.body.style.overflow, 'hidden')
  })
}

// ─────────────────────────────────────────────────────────────
// 7. HDrawer swipe: pointercancel must disarm the swipe so the NEXT tap
//    anywhere doesn't close the drawer (mobile scroll regression)
// ─────────────────────────────────────────────────────────────
const d1 = hison.component.getDrawer('d1')
check('HDrawer: mounted & registered', () => assert.ok(d1))
if (d1) {
  await flush(2)
  const drawerEl = document.querySelector('.hison-drawer')
  assert.ok(drawerEl, 'drawer element missing')
  drawerEl.dispatchEvent(new window.MouseEvent('pointerdown', { bubbles: true, clientX: 100, clientY: 500 }))
  window.dispatchEvent(new window.MouseEvent('pointercancel', { clientX: 100, clientY: 480 }))
  // next unrelated tap far away — would have looked like a big upward swipe
  window.dispatchEvent(new window.MouseEvent('pointerup', { clientX: 100, clientY: 100 }))
  await flush(3)
  check('HDrawer: aborted swipe (pointercancel) does not close on next tap', () => {
    assert.equal(hison.component.getDrawer('d1').isOpen(), true)
  })
}

// ─────────────────────────────────────────────────────────────
// 8. Unmounted component must NOT resurrect on later reload (zombie check)
// ─────────────────────────────────────────────────────────────
{
  const holder = document.createElement('div')
  document.body.appendChild(holder)
  const app2 = createApp({
    render: () => h(HBannerClientOnly, { id: 'ban1', autoIntervalMs: 200 }, { default: () => [h('div', 'slide1'), h('div', 'slide2')] }),
  })
  app2.use(hisonvue)
  app2.mount(holder)
  await flush(6)
  check('HBanner: mounted & registered', () => assert.ok(hison.component.getBanner('ban1')))
  app2.unmount()
  await flush(2)
  hison.style.setSize('m')
  await flush(6)
  check('HBanner: destroyed banner does not resurrect on global reload (no zombie autoplay)', () => {
    assert.equal(hison.component.getBanner('ban1'), undefined)
  })
}

// ─────────────────────────────────────────────────────────────
// 9. install with a FULL config (nonoshow pattern) —
//    getDefaultHisonConfig()의 chart 기본값은 chart.js defaults에서 온
//    null-prototype 객체(hasOwnProperty 없음) → deepMerge가 죽으면 안 된다
//    ⚠️ 재설치가 전역 레지스트리를 리셋하므로 반드시 마지막 섹션에 둘 것
// ─────────────────────────────────────────────────────────────
check('install: full default config (null-prototype chart defaults) does not crash deep-merge', () => {
  const fullConfig = getDefaultHisonConfig()
  fullConfig.componentStyle.primaryColor = 'rgba(1,2,3,1)'
  const fullHolder = document.createElement('div')
  document.body.appendChild(fullHolder)
  const appFull = createApp({ render: () => h('div') })
  appFull.use(hisonvue, fullConfig)
  appFull.mount(fullHolder)
  appFull.unmount()
})

// ─────────────────────────────────────────────────────────────
console.log('\nhisonvue smoke test')
console.log(results.join('\n'))
console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
