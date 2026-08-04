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
  HBannerClientOnly, HModalClientOnly, HDrawerClientOnly, HDropdownClientOnly,
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
// ─────────────────────────────────────────────────────────────
// 9. HDropdown scoped slots (item / toggle-label) — custom option fields
//    must pass through untouched; default rendering stays plain label text
// ─────────────────────────────────────────────────────────────
{
  const holder = document.createElement('div')
  document.body.appendChild(holder)
  const ddModel = { value: 'a', options: [
    { label: 'Alpha', value: 'a', badge: 3 },
    { label: 'Beta', value: 'b' },
  ] }
  const app3 = createApp({
    render: () => [
      h(HDropdownClientOnly, { id: 'dd1', modelValue: ddModel }, {
        item: ({ option, selected }) => h('span', { class: 'dd-slot-item' }, [
          option.label,
          option.badge ? h('span', { class: 'dd-slot-badge' }, String(option.badge)) : null,
          selected ? '*' : '',
        ]),
        'toggle-label': ({ option, label }) => h('span', { class: 'dd-slot-toggle' }, [
          label,
          option?.badge ? `(${option.badge})` : '',
        ]),
      }),
      h(HDropdownClientOnly, { id: 'dd2', modelValue: ddModel }),
    ],
  })
  app3.use(hisonvue)
  app3.mount(holder)
  await flush(6)
  const dd1 = hison.component.getDropdown('dd1')
  check('HDropdown: mounted & registered', () => assert.ok(dd1))
  if (dd1) {
    dd1.open()
    await flush(3)
    check('HDropdown: item slot renders custom option field (badge)', () => {
      const badges = holder.querySelectorAll('.dd-slot-badge')
      assert.ok(badges.length >= 1, 'badge span missing in item slot')
      assert.equal(badges[0].textContent, '3')
    })
    check('HDropdown: item slot receives selected flag', () => {
      const items = [...holder.querySelectorAll('.dd-slot-item')]
      assert.ok(items.some(el => el.textContent.includes('Alpha') && el.textContent.includes('*')))
    })
    check('HDropdown: toggle-label slot renders selected option custom field', () => {
      const t = holder.querySelector('.dd-slot-toggle')
      assert.ok(t, 'toggle-label slot missing')
      assert.equal(t.textContent, 'Alpha(3)')
    })
    check('HDropdown: default (no slot) still renders plain label text', () => {
      const dd2El = [...holder.querySelectorAll('.hison-dropdown')][1]
      const label = dd2El?.querySelector('.hison-dropdown-label')
      assert.equal(label?.textContent.trim(), 'Alpha')
      assert.equal(dd2El.querySelector('.dd-slot-badge'), null)
    })
    dd1.close()
    await flush(2)
  }
  app3.unmount()
  await flush(2)
}

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
// 8. Excel export (dependency-free XLSX writer)
//    - ZIP container: CRC32, STORE/deflate entries, central directory
//    - workbook parts, cell typing (inlineStr / number / date serial)
//    - grid → sheet conversion (built-in columns, hidden columns, footer)
// ─────────────────────────────────────────────────────────────
const {
  crc32, createZip, createExcelBlob, escapeXml, getColumnLetter, toExcelSerial,
  normalizeExcelFileName, saveExcelBlob, setExcelSaveHandler, getExcelSaveHandler,
  buildGridSheet,
} = await import('../dist/hisonvue.es.js')

/** 테스트용 최소 ZIP 리더 — 중앙 디렉터리를 걸어가며 엔트리를 뽑는다 */
function readZip(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let eocd = -1
  for (let i = bytes.length - 22; i >= 0; i--) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break }
  }
  if (eocd < 0) throw new Error('EOCD not found')
  const count = view.getUint16(eocd + 10, true)
  let pos = view.getUint32(eocd + 16, true)
  const decoder = new TextDecoder()
  const entries = {}
  for (let i = 0; i < count; i++) {
    if (view.getUint32(pos, true) !== 0x02014b50) throw new Error('bad central directory signature')
    const method = view.getUint16(pos + 10, true)
    const crc = view.getUint32(pos + 16, true)
    const csize = view.getUint32(pos + 20, true)
    const usize = view.getUint32(pos + 24, true)
    const nameLen = view.getUint16(pos + 28, true)
    const extraLen = view.getUint16(pos + 30, true)
    const commentLen = view.getUint16(pos + 32, true)
    const localOffset = view.getUint32(pos + 42, true)
    const name = decoder.decode(bytes.subarray(pos + 46, pos + 46 + nameLen))
    if (view.getUint32(localOffset, true) !== 0x04034b50) throw new Error('bad local header signature')
    const dataStart = localOffset + 30 + view.getUint16(localOffset + 26, true) + view.getUint16(localOffset + 28, true)
    entries[name] = {
      method, crc, csize, usize,
      text: method === 0 ? decoder.decode(bytes.subarray(dataStart, dataStart + csize)) : null,
    }
    pos += 46 + nameLen + extraLen + commentLen
  }
  return entries
}

const blobToBytes = async (blob) => new Uint8Array(await blob.arrayBuffer())

check('excel/zip: crc32 matches the reference value for "123456789"', () => {
  assert.equal(crc32(new TextEncoder().encode('123456789')), 0xCBF43926)
})

const storeZip = await createZip([
  { path: 'a.txt', data: new TextEncoder().encode('hello') },
  { path: 'dir/b.txt', data: new TextEncoder().encode('world!') },
], 'store')
check('excel/zip: STORE archive round-trips names, sizes and CRCs', () => {
  const entries = readZip(storeZip)
  assert.deepEqual(Object.keys(entries).sort(), ['a.txt', 'dir/b.txt'])
  assert.equal(entries['a.txt'].method, 0)
  assert.equal(entries['a.txt'].usize, 5)
  assert.equal(entries['a.txt'].text, 'hello')
  assert.equal(entries['dir/b.txt'].text, 'world!')
  assert.equal(entries['a.txt'].crc, crc32(new TextEncoder().encode('hello')))
})

check('excel: getColumnLetter maps 1/26/27/703 to A/Z/AA/AAA', () => {
  assert.equal(getColumnLetter(1), 'A')
  assert.equal(getColumnLetter(26), 'Z')
  assert.equal(getColumnLetter(27), 'AA')
  assert.equal(getColumnLetter(703), 'AAA')
})

check('excel: escapeXml strips XLSX-illegal control chars and escapes entities', () => {
  // 🔴 제어문자가 남으면 엑셀이 "파일이 손상되었습니다"를 띄운다
  assert.equal(escapeXml('a bcd'), 'abcd')
  assert.equal(escapeXml('<a & "b">'), '&lt;a &amp; &quot;b&quot;&gt;')
  // 탭/개행은 XML 1.0에서 합법이므로 보존
  assert.equal(escapeXml('a\tb\nc'), 'a\tb\nc')
})

check('excel: date serial uses the 1899-12-30 epoch and accepts grid-stored YYYYMMDD', () => {
  assert.equal(toExcelSerial('1900-01-01').serial, 2)
  assert.equal(toExcelSerial('2000-01-01').serial, 36526)
  assert.equal(toExcelSerial('20260804').serial, 46238)   // vanillagrid date 셀 저장 형태
  assert.equal(toExcelSerial('2026-08').serial, 46235)    // month 셀
  assert.equal(toExcelSerial('2026-08-04 13:30').hasTime, true)
  assert.equal(toExcelSerial('20260231'), null)           // 존재하지 않는 날짜
  assert.equal(toExcelSerial('not a date'), null)
})

const sheetBlob = await createExcelBlob({
  name: '매출/분석*2026',
  columns: [
    { header: '항목', key: 'title' },
    { header: '금액', key: 'amount', type: 'number', format: '#,##0' },
    { header: '일자', key: 'day', type: 'date' },
    { header: '비고', key: 'memo' },
  ],
  rows: [
    { title: '매출', amount: 1234567, day: '20260804', memo: 'okbell' },
    { title: '원가', amount: -1000.5, day: new Date(2026, 7, 4), memo: '' },
  ],
  footer: [['합계', 1233566.5, null, null]],
}, { compression: 'store' })
const sheetParts = readZip(await blobToBytes(sheetBlob))

check('excel: workbook contains exactly the six required parts', () => {
  assert.deepEqual(Object.keys(sheetParts).sort(), [
    '[Content_Types].xml',
    '_rels/.rels',
    'xl/_rels/workbook.xml.rels',
    'xl/styles.xml',
    'xl/workbook.xml',
    'xl/worksheets/sheet1.xml',
  ])
})

check('excel: sheet name drops characters Excel rejects', () => {
  assert.match(sheetParts['xl/workbook.xml'].text, /<sheet name="매출_분석_2026"/)
})

check('excel: text cells are inlineStr and no sharedStrings part is emitted', () => {
  const xml = sheetParts['xl/worksheets/sheet1.xml'].text
  assert.match(xml, /<c r="A2"[^>]*t="inlineStr"><is><t xml:space="preserve">매출<\/t><\/is><\/c>/)
  assert.equal(sheetParts['xl/sharedStrings.xml'], undefined)
})

check('excel: numbers stay numeric and control chars are scrubbed from text', () => {
  const xml = sheetParts['xl/worksheets/sheet1.xml'].text
  assert.match(xml, /<c r="B2"[^>]*><v>1234567<\/v><\/c>/)
  assert.match(xml, /<c r="B3"[^>]*><v>-1000\.5<\/v><\/c>/)
  assert.match(xml, /<t xml:space="preserve">okbell<\/t>/)
})

check('excel: dates are written as serials (string and Date resolve identically)', () => {
  const xml = sheetParts['xl/worksheets/sheet1.xml'].text
  assert.match(xml, /<c r="C2"[^>]*><v>46238<\/v><\/c>/)
  assert.match(xml, /<c r="C3"[^>]*><v>46238<\/v><\/c>/)
  assert.match(sheetParts['xl/styles.xml'].text, /formatCode="yyyy-mm-dd"/)
  assert.match(sheetParts['xl/styles.xml'].text, /formatCode="#,##0"/)
})

check('excel: header freeze and auto-filter are emitted in schema order', () => {
  const xml = sheetParts['xl/worksheets/sheet1.xml'].text
  assert.match(xml, /<pane ySplit="1" topLeftCell="A2"/)
  assert.match(xml, /<autoFilter ref="A1:D3"\/>/)
  // OOXML 스키마상 sheetViews < cols < sheetData < autoFilter 순서를 어기면 손상 파일이 된다
  assert.ok(xml.indexOf('<sheetViews>') < xml.indexOf('<sheetData>'))
  assert.ok(xml.indexOf('<sheetData>') < xml.indexOf('<autoFilter'))
})

check('excel: footer rows are appended below the data', () => {
  const xml = sheetParts['xl/worksheets/sheet1.xml'].text
  assert.match(xml, /<row r="4">.*합계.*<\/row>/)
  assert.match(xml, /<c r="B4"[^>]*><v>1233566\.5<\/v><\/c>/)
})

const textDateParts = readZip(await blobToBytes(await createExcelBlob({
  columns: [{ header: '일자', key: 'day', type: 'date' }],
  rows: [{ day: '20260804' }],
}, { compression: 'store', dateAsText: true })))
check('excel: dateAsText writes the raw string instead of a serial', () => {
  assert.match(textDateParts['xl/worksheets/sheet1.xml'].text, /<t xml:space="preserve">20260804<\/t>/)
})

const multiParts = readZip(await blobToBytes(await createExcelBlob([
  { name: 'Same', rows: [{ a: 1 }] },
  { name: 'Same', rows: [{ a: 2 }] },
], { compression: 'store' })))
check('excel: duplicate sheet names get a numeric suffix', () => {
  const xml = multiParts['xl/workbook.xml'].text
  assert.match(xml, /<sheet name="Same" sheetId="1"/)
  assert.match(xml, /<sheet name="Same\(2\)" sheetId="2"/)
  assert.match(multiParts['xl/_rels/workbook.xml.rels'].text, /worksheets\/sheet2\.xml/)
})

const autoParts = readZip(await blobToBytes(await createExcelBlob(
  { rows: [{ a: 'x'.repeat(400) }] },
  { compression: 'auto' },
)))
check('excel: auto compression still produces a readable archive on either path', () => {
  const entry = autoParts['xl/worksheets/sheet1.xml']
  assert.ok(entry, 'sheet part missing')
  // CompressionStream이 있으면 deflate(8), 없으면 STORE(0) — 어느 쪽이든 컨테이너는 유효해야 한다
  assert.ok(entry.method === 0 || entry.method === 8)
  assert.ok(entry.usize > entry.csize || entry.method === 0)
})

let maxRowsError = null
try {
  await createExcelBlob({ rows: [{ a: 1 }, { a: 2 }] }, { maxRows: 1 })
} catch (e) { maxRowsError = e }
check('excel: maxRows throws instead of silently truncating', () => {
  assert.ok(maxRowsError, 'expected maxRows to throw')
  assert.match(maxRowsError.message, /maxRows/)
})

check('excel: file name normalization appends .xlsx and drops path separators', () => {
  assert.equal(normalizeExcelFileName(), 'export.xlsx')
  assert.equal(normalizeExcelFileName('고객목록'), '고객목록.xlsx')
  assert.equal(normalizeExcelFileName('a/b:c.xlsx'), 'a_b_c.xlsx')
})

const handlerCalls = []
setExcelSaveHandler((blob, fileName) => { handlerCalls.push({ size: blob.size, fileName }) })
const handlerResult = await saveExcelBlob(sheetBlob, 'via-handler.xlsx')

// false를 돌려주면 기본 브라우저 다운로드(a[download] + object URL)로 폴백해야 한다
setExcelSaveHandler(() => false)
const originalCreateObjectURL = URL.createObjectURL
let objectUrlCount = 0
let downloadedName = null
URL.createObjectURL = (b) => { objectUrlCount++; return originalCreateObjectURL.call(URL, b) }
const originalCreateElement = document.createElement.bind(document)
document.createElement = (tag) => {
  const el = originalCreateElement(tag)
  if (tag === 'a') el.click = () => { downloadedName = el.download }
  return el
}
const fallbackResult = await saveExcelBlob(sheetBlob, 'fallback.xlsx')
document.createElement = originalCreateElement
URL.createObjectURL = originalCreateObjectURL
setExcelSaveHandler(null)

check('excel: save handler intercepts the download, `false` falls back to the browser path', () => {
  assert.equal(handlerResult, true)
  assert.equal(handlerCalls.length, 1)
  assert.equal(handlerCalls[0].fileName, 'via-handler.xlsx')
  assert.ok(handlerCalls[0].size > 0)
  assert.equal(fallbackResult, true)
  assert.equal(objectUrlCount, 1)
  assert.equal(downloadedName, 'fallback.xlsx')
  assert.equal(getExcelSaveHandler(), null)
})

// 그리드 → 시트 변환은 colInfo 계약만 쓰므로 스텁으로 결정적으로 검증한다
const gridStub = {
  getId: () => 'stubGrid',
  getColCount: () => 6,
  getColInfo: (i) => ([
    null,
    { colId: 'v-g-rownum', dataType: 'text', colVisible: true, originWidth: '60px' },
    { colId: 'v-g-status', dataType: 'text', colVisible: true, originWidth: '60px' },
    { colId: 'name', dataType: 'text', colVisible: true, originWidth: '124px' },
    { colId: 'amount', dataType: 'number', format: '#,##0', colVisible: true, originWidth: '96px' },
    { colId: 'secret', dataType: 'text', colVisible: false, originWidth: '80px' },
    { colId: 'grade', dataType: 'select', colVisible: true, originWidth: '80px' },
  ][i]),
  getHeaderText: (colId) => ({ name: '고객;이름', amount: '금액', grade: '등급', secret: '비밀' }[colId] ?? colId),
  getDatas: () => ([
    [
      { colId: 'v-g-rownum', value: 1, rowVisible: true },
      { colId: 'name', value: '홍길동', dataType: 'text', rowVisible: true },
      { colId: 'amount', value: 1000, dataType: 'number', rowVisible: true },
      { colId: 'secret', value: 'hidden', dataType: 'text', rowVisible: true },
      { colId: 'grade', value: 'V', text: 'VIP', dataType: 'select', rowVisible: true },
    ],
    [
      { colId: 'v-g-rownum', value: 2 },
      { colId: 'name', value: '필터로 숨겨진 행', dataType: 'text' },
    ],
  ]),
  getFooterRowCount: () => 1,
  getFooterValue: (row, colId) => (colId === 'name' ? '합계' : colId === 'amount' ? '1,000' : null),
}

const gridSheet = buildGridSheet(gridStub)
check('excel/grid: built-in and hidden columns are excluded by default', () => {
  assert.deepEqual(gridSheet.columns.map(c => c.key), ['name', 'amount', 'grade'])
  assert.equal(gridSheet.name, 'stubGrid')
})

check('excel/grid: header takes the last segment of a multi-row header', () => {
  assert.equal(gridSheet.columns[0].header, '이름')
})

check('excel/grid: column types, formats and px→character widths come from colInfo', () => {
  assert.equal(gridSheet.columns[1].type, 'number')
  assert.equal(gridSheet.columns[1].format, '#,##0')
  assert.equal(gridSheet.columns[0].type, 'text')
  assert.equal(Math.round(gridSheet.columns[0].width), 17)   // (124 - 5) / 7
})

check('excel/grid: select cells export the label, filtered-out rows are dropped', () => {
  assert.equal(gridSheet.rows.length, 1)
  assert.equal(gridSheet.rows[0].grade, 'VIP')
  assert.equal(gridSheet.rows[0].name, '홍길동')
  assert.equal(gridSheet.rows[0].secret, undefined)
})

check('excel/grid: footer rows are carried over', () => {
  assert.deepEqual(gridSheet.footer, [['합계', '1,000', null]])
})

check('excel/grid: includeHiddenColumns / columns / formatter options apply', () => {
  const withHidden = buildGridSheet(gridStub, { includeHiddenColumns: true })
  assert.deepEqual(withHidden.columns.map(c => c.key), ['name', 'amount', 'secret', 'grade'])
  const picked = buildGridSheet(gridStub, { columns: ['amount', 'name'] })
  assert.deepEqual(picked.columns.map(c => c.key), ['amount', 'name'])
  const masked = buildGridSheet(gridStub, { formatter: (v, colId) => (colId === 'name' ? '***' : undefined) })
  assert.equal(masked.rows[0].name, '***')
  assert.equal(masked.rows[0].amount, 1000)
})

// 스텁이 흉내낸 계약(내장 컬럼 id · date 저장 형태 · rowVisible · colVisible)이
// 실제 vanillagrid와 일치하는지 마운트된 그리드로 확인한다
const excelGridHolder = document.createElement('div')
document.body.appendChild(excelGridHolder)
const excelGridApp = createApp({
  render: () => h(HGridClientOnly, {
    id: 'excelGrid',
    columns: [
      { id: 'name', header: '고객;이름', dataType: 'text', width: '124px' },
      { id: 'amount', header: '금액', dataType: 'number', format: '#,##0', width: '96px' },
      { id: 'day', header: '방문일', dataType: 'date', width: '110px' },
      { id: 'secret', header: '비밀', dataType: 'text', visible: false },
    ],
  }),
})
excelGridApp.use(hisonvue)
excelGridApp.mount(excelGridHolder)
await flush(8)
const excelGrid = hison.component.getGrid('excelGrid')
excelGrid.load([
  { name: '홍길동', amount: 1000, day: '2026-08-04', secret: 'x' },
  { name: '김철수', amount: 2500, day: '2026-08-05', secret: 'y' },
])
await flush(4)
const realSheet = buildGridSheet(excelGrid)
let savedFile = null
const realDownload = await excelGrid.downloadExcel({
  fileName: '고객목록',
  save: (blob, fileName) => { savedFile = { size: blob.size, fileName } },
})
excelGridApp.unmount()
await flush(2)

check('excel/grid: a mounted grid exports only its user columns, with grid metadata', () => {
  assert.deepEqual(realSheet.columns.map(c => c.key), ['name', 'amount', 'day'])
  assert.deepEqual(realSheet.columns.map(c => c.header), ['이름', '금액', '방문일'])
  assert.deepEqual(realSheet.columns.map(c => c.type), ['text', 'number', 'date'])
  assert.equal(realSheet.columns[1].format, '#,##0')
  // vanillagrid는 date 셀 값을 구분자 없는 YYYYMMDD로 보관한다
  assert.equal(realSheet.rows[0].day, '20260804')
  assert.equal(realSheet.rows.length, 2)
})

check('excel/grid: downloadExcel is attached to the grid instance and produces a file', () => {
  assert.equal(realDownload, true)
  assert.equal(savedFile.fileName, '고객목록.xlsx')
  assert.ok(savedFile.size > 0)
})

check('excel: hison.excel facade is wired on the singleton', () => {
  assert.equal(typeof hison.excel.download, 'function')
  assert.equal(typeof hison.excel.getBlob, 'function')
  assert.equal(typeof hison.excel.save, 'function')
  assert.equal(typeof hison.excel.setSaveHandler, 'function')
})

// ─────────────────────────────────────────────────────────────
console.log('\nhisonvue smoke test')
console.log(results.join('\n'))
console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
