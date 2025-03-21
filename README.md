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
import { HisonVue } from 'hisonvue'
import 'hisonvue/style.css'

const app = createApp(App)
app.use(HisonVue)
app.mount('#app')
```

> ✅ Once registered globally, you can directly use components like:
```html
<HButton>Click me!</HButton>
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

---

### 3️⃣ **Individual component import**
If you want to import only specific components manually:
```ts
import { HButton } from 'hisonvue'
import 'hisonvue/style.css'

export default {
  components: {
    HButton
  }
}
```

---

## 📚 Available Components

| Component   | Description                                          |
|-------------|------------------------------------------------------|
| `<HButton>` | A simple customizable button with text color prop and click event |

### HButton Props

| Prop       | Type          | Description                                         |
|------------|---------------|-----------------------------------------------------|
| `textColor`| `#RRGGBB`     | Button text color in hex RGB format (e.g., `#ffffff`) |

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
