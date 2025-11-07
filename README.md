# HisonVue

More detailed information can be found on the this.
[Homepage](https://hisondev.github.io/)

A **Vue 3 UI component library** designed for enterprise-grade apps.
Built on top of [**hisonjs**](https://github.com/hisondev/hisonjs), it bridges **frontend components** and **backend-ready data utilities** into one unified ecosystem.

## ✨ About

**HisonVue** provides a comprehensive set of UI components with **runtime APIs**, **global theming**, and **SSR compatibility**. It extends the capabilities of [hisonjs](https://www.npmjs.com/package/hisonjs), meaning you not only get visual components but also access to data modeling, API-link communication, utilities, and security features.

* Written in **TypeScript** with full IntelliSense support
* Works with **Vue CLI, Vite, Nuxt 3 (SSR)** out of the box
* Tree-shakable and modular imports
* CSS variables & responsive class system (`hison-col-*`, `hison-size-*`, `hison-color-*`)
* Runtime control for every component via `hison.component.getXxx(id)`
* Extends `hisonjs` → brings **utils, data models, API-link, shield security**

---

## 📦 Installation

```bash
npm install hisonvue
```

Import the global CSS once:

```ts
import 'hisonvue/style.css'
```

---

## 🚀 Usage

### 1️⃣ Global registration (Vue 3 / Vite / Vue CLI)

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { hisonvue, getDefaultHisonConfig, Size, type HisonConfig } from 'hisonvue'
import 'hisonvue/style.css'

const app = createApp(App)

// Customize global configuration
const hisonConfig: HisonConfig = getDefaultHisonConfig()
hisonConfig.componentStyle.primaryColor = '#123456'
hisonConfig.componentStyle.size = Size.s

app.use(hisonvue, hisonConfig)
app.mount('#app')
```

✅ Once registered globally, you can use any component:

```vue
<HButton id="b1" text="Click" class="hison-color-primary" />
<HLayout class="hison-col-12">
  <HLabel text="Hello World" />
</HLayout>
```

---

### 2️⃣ Nuxt 3 integration (SSR-ready)

HisonVue ships with an SSR-safe wrapper (`createSSRClientOnly`). For Nuxt, register via plugin:

**`/plugins/hisonvue.client.ts`**

```ts
import { defineNuxtPlugin } from '#app'
import { hisonvue, getDefaultHisonConfig, Size, type HisonConfig } from 'hisonvue'
import 'hisonvue/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  const config: HisonConfig = getDefaultHisonConfig()
  config.componentStyle.primaryColor = '#165DFF'
  config.componentStyle.size = Size.m
  config.componentStyle.invertColor = false

  nuxtApp.vueApp.use(hisonvue, config)
})
```

✅ Components are globally available in SSR without hydration errors.

Add the module in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: [
    'hisonvue/nuxt',        // ✅ Registers HisonVue (SSR-safe)
  ],
```

---

### 3️⃣ Runtime control with `hison.component`

Every component is registered with a unique `id`. Use that to access methods:

```vue
<HButton id="b1" text="Left" class="hison-color-primary" />
<HButton id="b2" text="Right" class="hison-color-warning" />
```

```ts
import { hison } from 'hisonvue'

// Toggle border
const b1 = hison.component.getButton('b1')!
b1.setBorder(!b1.isBorder())

// Open a modal
const modal = hison.component.getModal('modal01')
modal?.open()
modal?.setCaption('Hello Modal')
```

---

### 4️⃣ Global theming with `hison.style`

Change theme dynamically at runtime:

```ts
hison.style.setPrimaryColor('#009688')
hison.style.setSize(Size.l)
hison.style.setInvertColor(true)

console.log(hison.style.getPrimaryHoverColor())
```

---

### 5️⃣ CSS Event Hooks (`hison.cssEvent`)

Attach global before/after hooks for Button/Input/Textbox events:

```ts
hison.cssEvent.setButtonOnBefoerClick((e) => {
  console.log('before click', e)
  return true // false cancels the click
})

hison.cssEvent.setButtonOnAfterClick((e) => {
  console.log('after click', e)
})
```

⚠️ Note: `Befoer` is intentionally spelled this way in the API — use as-is.

---

## 📚 Available Components

HisonVue provides **20+ UI components**:

* **Layout**: `HLayout`, `HGap`, `HModal`, `HPopup`, `HBanner`, `HAccordion`
* **Form**: `HInput`, `HInputGroup`, `HFileset`, `HImagebox`, `HDropdown`
* **UI Elements**: `HButton`, `HLabel`, `HList`, `HParagraph`, `HBaggie`, `HCaption`
* **Data Views**: `HGrid` (via vanillagrid2), `HTable`, `HNote` (via vanillanote2), `HChart` (via Chart.js), `HCalendar` (via vue-cal)
* **Feedback**: `HSpinner`, `HPagination`, `HDrawer`

Each component exposes a **typed methods object** via `hison.component.getXxx(id)`.

---

## ⚙️ Global Configuration (`HisonConfig`)

`getDefaultHisonConfig()` returns a fully typed configuration object you can customize.

* **UtilsConfig** → date/time/number formatting defaults
* **ShieldConfig** → security: block devtools, restrict IPs, freeze objects
* **DataConfig** → control how values are copied into `DataModel`
* **LinkConfig** → API-link defaults, before/after hooks
* **ComponentStyle** → global theme (colors, sizes, fonts)
* **Component** → external libs (vanillanote2, vanillagrid2, chart.js)
* **Event.cssEvent** → global CSS hooks

Example:

```ts
const cfg = getDefaultHisonConfig()
cfg.componentStyle.primaryColor = '#222'
cfg.componentStyle.size = Size.s
cfg.link.timeout = 15000
cfg.shield.isPossibleOpenDevTool = false
```

---

## 🔗 Extended Hison Interface

HisonVue exports a singleton `hison` that **extends** `hisonjs.Hison`:

✅ All **hisonjs** features:

* `utils` (string/date/number helpers)
* `data` (DataWrapper, DataModel)
* `link` (API communication with Spring backend)
* `shield` (security: devtool blocking, freeze, URL/IP restrictions)

➕ Additional Vue features:

* `component.getXxx(id)` → runtime control of every Vue component
* `style.setXxx/getXxx` → global theming API
* `cssEvent.setXxx` → global before/after hooks for UI events
* File upload defaults: `setMaxFilesetSize`, `setMaxFilesetTotalSize`

This makes **hisonvue** a **fullstack bridge** between Vue frontend and Spring backend.

---

## ✅ Example Fullstack Flow

```ts
import { hison } from 'hisonvue'

// Build request
define const req = new hison.data.DataWrapper({ userId: 1 })

// Send to Spring backend via api-link
const api = new hison.link.ApiPost("UserService.getUser")
const resp = await api.call(req)

// Update UI
const btn = hison.component.getButton('saveBtn')
btn?.setDisable(true)

const note = hison.component.getNote('editor')
note?.setNoteData(resp.data)
```

---

## 🛠 Build & Test (Contributors)

```bash
git clone https://github.com/hisondev/hisonvue.git
cd hisonvue
npm install

# Build library
npm run build

# Run playgrounds
cd playground && npm run dev
cd ../playground-nuxt && npm run dev
```

---

## 📄 License

MIT © hisondev
