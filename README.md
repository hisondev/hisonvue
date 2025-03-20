# HisonVue

A simple, reusable UI component library for Vue 3.

## ✨ About

**HisonVue** is a lightweight Vue 3 component library created to provide simple, reusable UI and layout components for any Vue-based project.  
It supports all Vue 3 environments, including **Vue CLI**, **Vite**, and **Nuxt 3 (SSR)**, without unnecessary dependencies.

- Written in TypeScript  
- Fully tree-shakable  
- Scoped styles for easy integration  
- Minimal and clean API  
- CSS can be easily imported from the package

---

## 📦 Installation

```bash
npm install hisonvue
```

---

## 🚀 Usage

### 1️⃣ **Global registration**
Import and register all components globally:
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

### 2️⃣ **Individual component import**
If you want to import only specific components:
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

## 📚 Components

| Component   | Description                |
|-------------|----------------------------|
| `<HButton>` | A simple customizable button component |

More components coming soon!

---

## 🛠 Build Setup (for contributors)

```bash
# Clone the repository
git clone https://github.com/hisondev/hisonvue.git
cd hisonvue

# Install dependencies
npm install

# Build the library
npm run build

# Test in playground
cd playground
npm install
npm run dev
```

---

## 🔎 Roadmap
- Add more layout and form components
- Provide custom theme support
- Add automatic dark mode detection

---

## 📄 License
MIT
