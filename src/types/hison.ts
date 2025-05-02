import type { Hison as Hisonjs } from "hisonjs";
import { GridMethods } from "vanillagrid2";
import { VanillanoteElement } from "vanillanote2";
import { HButtonMethods } from "./component";
import { Size } from "../enums";

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
 * const editor = hison.note.getNote("editor-id");
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
 * const grid = hison.grid.getGrid("grid-id");
 * grid.load([{ id: "001", name: "Alice" }]);
 * ```
 * 
 * 
 * ---
 * 
 * ### Encapsulation and Usage
 * 
 * - The `hison` object is a **singleton** created internally by `hisonvue`.
 * - It is globally available after installing `Hisonvue` into your Vue application.
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
 * const note = hison.note.getNote("note1");
 * note.setNoteData({ html: "<p>World</p>" });
 * 
 * // Accessing Vanillagrid
 * const grid = hison.grid.getGrid("grid1");
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
 * - Frontend visual components via `hison .note .grid .button ..`
 * 
 * allowing you to develop robust, scalable, and highly modular applications.
 */
export interface Hison extends Hisonjs {
  cssEvent: {
    setButtonOnBefoerClick(func: ((e: MouseEvent) => boolean)): void
    setButtonOnAfterClick(func: ((e: MouseEvent) => void)): void
    setButtonOnBeforeMouseover(func: ((e: MouseEvent) => boolean)): void
    setButtonOnAfterMouseover(func: ((e: MouseEvent) => void)): void
    setButtonOnBeforeMouseout(func: ((e: MouseEvent) => boolean)): void
    setButtonOnAfterMouseout(func: ((e: MouseEvent) => void)): void
    setButtonOnBeforeTouchstart(func: ((e: TouchEvent) => boolean)): void
    setButtonOnAfterTouchstart(func: ((e: TouchEvent) => void)): void
    setButtonOnBeforeTouchend(func: ((e: TouchEvent) => boolean)): void
    setButtonOnAfterTouchend(func: ((e: TouchEvent) => void)): void
  }
  vue: {
    getNote(noteId: string): VanillanoteElement | null
    getGrid(gridId: string): GridMethods | null
    getButton(buttonId: string): HButtonMethods | null
  }
  style: {
    setSize(size: Size.s | Size.m | Size.l | Size.xl): void
    setFilledColor(filledColor: string): void
    setEmptyColor(emptyColor: string): void
    setFilledTextColor(filledTextColor: string): void
    setEmptyTextColor(emptyTextColor: string): void
    setPrimaryColor(primaryColor: string): void
    setMutedColor(mutedColor: string): void
    setInfoColor(infoColor: string): void
    setSuccessColor(successColor: string): void
    setDangerColor(dangerColor: string): void
    setWarningColor(warningColor: string): void
    setInvertColor(invert: boolean): void
  }
}
