# HisonVue

A simple, reusable UI component library for Vue 3.

## ✨ About

**HisonVue** is a lightweight Vue 3 component library created to provide simple, reusable UI and layout components for any Vue-based project.  
It supports all Vue 3 environments, including **Vue CLI**, **Vite**, and **Nuxt 3 (SSR)**, without unnecessary dependencies.

- Written in TypeScript  
- Fully tree-shakable  
- Scoped styles for easy integration  
- Minimal and clean API  
- Automatic global type support for Nuxt and Vite projects  
- CSS can be easily imported from the package

---

## 📦 Installation

```bash
npm install hisonvue
```

---

## 🚀 Usage

### 1️⃣ **Global registration (Vue CLI / Vite)**

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { HisonVue, type HisonVueConfig } from 'hisonvue'
import 'hisonvue/style.css'

const hisonVueConfig: HisonVueConfig = {
    primaryColor: '#00aa00',
    size: 'm'
}

const app = createApp(App)
app.use(HisonVue, hisonVueConfig)
app.mount('#app')
```
> ✅ Once registered globally, you can directly use components like:
```html
<HButton>Click me!</HButton>
<HEditor />
```

---

### 2️⃣ **Nuxt 3 integration (SSR ready)**

Add `hisonvue` to your `nuxt.config.ts`:
```ts
export default defineNuxtConfig({
  modules: ['hisonvue/nuxt'],
  components: true
})
```
> ✅ No manual type registration needed.  
> Global components and type IntelliSense are automatically injected into your Nuxt project.  
> ⚠️ Note: In SSR environments like Nuxt, the `.nuxt` directory and type declarations are generated dynamically when you run `npm run dev`. For newly added components or updated JSDoc comments, make sure to restart `npm run dev` to refresh type hints and documentation.  
> ❗ **Important:** When using Nuxt, you only need to declare `modules: ['hisonvue/nuxt']` in your `nuxt.config.ts`. Do not manually import components like `import { HButton } from '#build/types/hisonvue-components';` — this will cause runtime errors.

Additionally, in Nuxt projects, you can configure global HisonVue settings by creating a plugin file:

**`/plugins/hisonvue.client.ts`**
```ts
import { defineNuxtPlugin } from '#app'
import { HisonVue, type HisonVueConfig } from 'hisonvue'
import 'hisonvue/style.css'

const hisonVueConfig: HisonVueConfig = {
  primaryColor: '#00aa00',
  size: 's'
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(HisonVue, hisonVueConfig)
})
```

---

### 3️⃣ **Individual component import**
If you want to import only specific components manually:
```ts
import { HButton, HEditor } from 'hisonvue'
import 'hisonvue/style.css'

export default {
  components: {
    HButton,
    HEditor
  }
}
```

---

## 📚 Available Components

| Component   | Description                                          |
|-------------|------------------------------------------------------|
| `<HButton>` | A simple customizable button with text color prop and click event |
| `<HEditor>` | A rich text editor component using Vanillanote, customizable via `editorConfig` |

### Global Config Options (`HisonVueConfig`)

| Option         | Type                           | Description                                                                 |
|----------------|--------------------------------|-----------------------------------------------------------------------------|
| `primaryColor` | `#RRGGBB`                      | Main color applied to all components (e.g., `#00aa00`)                      |
| `size`         | `'s' \| 'm' \| 'l' \| 'xl'` | Default size applied across components                                      |

---

## 🛠 Build & Test Setup (for contributors)

```bash
# Clone the repository
git clone https://github.com/hisondev/hisonvue.git
cd hisonvue

# Install dependencies
npm install

# Build the library (includes dts bundle generation)
npm run build

# Playground (Vue CLI / Vite test)
cd playground
npm install
npm run dev

# Playground (Nuxt test)
cd ../playground-nuxt
npm install
npm run dev
```

---

## ✅ Internals & Type Management
- HisonVue uses `dts-bundle-generator` to bundle all type declarations into a single `hisonvue.d.ts`.
- For Nuxt, type templates are automatically injected via `addTypeTemplate()` and `prepare:types` hook.
- Consumers do **not** need to manually reference global types — they're auto-injected.

---

## 🔎 Roadmap
- Add more layout and form components
- Provide custom theme support (light/dark mode toggle)
- Add accessibility enhancements (ARIA attributes)
- Improved documentation site (coming soon)

---

## 📄 License
MIT
