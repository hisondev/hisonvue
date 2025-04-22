import type { Hison as HisonBase } from "hisonjs";
import type { Vanillagrid } from "vanillagrid2";
import type { Vanillanote } from "vanillanote2";

/**
 * Extended `Hison` interface for `hisonvue`.
 * 
 * This interface expands the base `Hison` object provided by `hisonjs`
 * by adding the `vue` namespace, which contains frontend-specific modules
 * such as editors, grids, and other UI-related components.
 * 
 * ---
 * 
 * ### Core Structure
 * 
 * - Inherits all core functionalities from `hisonjs`, including:
 *   - **Configuration Management** (date formats, character encoding, API settings)
 *   - **Security Features** (shield module for devtool blocking, IP restrictions)
 *   - **Utility Functions** (string, number, date manipulation)
 *   - **Structured Data Handling** (DataWrapper, DataModel)
 *   - **API Communication** (promise-based API modules, WebSocket caching)
 * 
 * - Adds a new `vue` namespace for managing **frontend UI components**.
 * 
 * ---
 * 
 * ### `vue` Namespace
 * 
 * The `vue` property groups together client-side objects
 * tightly coupled with DOM-based operations in Vue/Nuxt applications.
 * 
 * | Key | Type | Description |
 * |:----|:-----|:-------------|
 * | `note` | `Vanillanote` | Singleton object for handling rich-text editors (Vanillanote). |
 * | `grid` | `Vanillagrid` | Singleton object for managing lightweight, customizable grids (Vanillagrid). |
 * 
 * 
 * #### `vue.note: Vanillanote`
 * - Manages the lifecycle of WYSIWYG editor instances.
 * - Provides methods like `init()`, `mountNote()`, `getNote()`, `unmountNote()`, and `destroy()`.
 * - Ensures consistent styling, event binding, and editor state management across SPA environments.
 * 
 * Example:
 * ```typescript
 * const editor = hison.vue.note.getNote("editor-id");
 * editor.setNoteData({ html: "<p>Hello</p>" });
 * ```
 * 
 * 
 * #### `vue.grid: Vanillagrid`
 * - Provides a flexible, dependency-free table/grid system.
 * - Supports features like sorting, filtering, undo/redo, customizable headers and footers.
 * 
 * Example:
 * ```typescript
 * const grid = hison.vue.grid.getGrid("grid-id");
 * grid.load([{ id: "001", name: "Alice" }]);
 * ```
 * 
 * 
 * ---
 * 
 * ### Encapsulation and Usage
 * 
 * - The `hison` object is a **singleton** created internally by `hisonvue`.
 * - It is globally available after installing `HisonVue` into your Vue application.
 * - It consolidates backend communication, frontend rendering, and utility logic into a unified, type-safe API.
 * 
 * 
 * ### Example Usage
 * 
 * ```typescript
 * import { hison } from "hisonvue";
 * 
 * // Using core utilities
 * const isAlpha = hison.utils.isAlpha("Hello");
 * 
 * // Accessing Vanillanote editor
 * const note = hison.vue.note.getNote("note1");
 * note.setNoteData({ html: "<p>World</p>" });
 * 
 * // Accessing Vanillagrid
 * const grid = hison.vue.grid.getGrid("grid1");
 * grid.load([{ id: "001", name: "Alice" }]);
 * ```
 * 
 * 
 * ---
 * 
 * ### Future Expansion
 * 
 * The `vue` namespace is designed to be **modular and extensible**.
 * 
 * Planned or possible additions under `vue` may include:
 * 
 * - `form`: Form validation and input components
 * - `chart`: Chart rendering components (e.g., Chart.js integration)
 * - `modal`, `toast`, `notification`, etc.
 * 
 * 
 * ---
 * 
 * ### Summary
 * 
 * The extended `Hison` for `hisonvue` provides a **fullstack bridge**:
 * 
 * - Core system management via `hisonjs`
 * - Frontend visual components via `hisonvue.vue`
 * 
 * allowing you to develop robust, scalable, and highly modular applications.
 */
export interface HisonVue extends HisonBase {
  vue: {
    note: Vanillanote;
    grid: Vanillagrid;
  }
}
