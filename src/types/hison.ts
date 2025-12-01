import type { Hison as Hisonjs } from "hisonjs";
import { HButtonMethods, HInputGroupMethods, HGridMethods, HInputMethods, HLayoutMethods, HNoteElement, HCalendarMethods, HChartInstance, HFilesetMethods, HImageboxMethods, HDropdownMethods, HAccordionMethods, HLabelMethods, HParagraphMethods, HCaptionMethods, HGapMethods, HListMethods, HTableMethods, HModalMethods, HPopupMethods, HDrawerMethods, HSpinnerMethods, HBaggieMethods, HBannerMethods, HPaginationMethods, DeviceType } from "./component";
import { Size } from "../enums";

/**
 * Global runtime facade for the `hisonvue` ecosystem.
 *
 * The `Hison` object in `hisonvue` acts as the **frontend counterpart** to the core `Hison` from `hisonjs`.  
 * While `hisonjs` focuses on configuration, data handling, and communication logic,
 * `hisonvue` extends this foundation into the **UI runtime layer**—managing
 * event hooks, component lifecycles, and theme styling in real time.
 *
 * ---
 * ### Relation to `hisonjs`
 * This object extends {@link Hisonjs}, inheriting:
 * - **Configuration and Utility Layers**: Formatting, type conversion, validation, and constants.
 * - **Security Controls (`hison.shield`)**: Access, freezing, and developer tool restrictions.
 * - **Data Models (`hison.data`)**: `DataWrapper`, `DataModel`, and related data transformation tools.
 * - **API Communication (`hison.link`)**: Promise-based REST and WebSocket interfaces.
 *
 * On top of these, `hisonvue` introduces **UI-centric runtime systems**:
 *
 * - **Global Event Hooks (`cssEvent`)**
 *   Intercept and modify component interactions (click, focus, blur, mouse/touch events)
 *   across the entire app, before or after they occur.
 *
 * - **Component Registry (`component`)**
 *   Provides runtime access to all mounted hisonvue components via `id`.
 *   Developers can programmatically control or query components even outside Vue scopes,
 *   enabling reactive orchestration between views and data.
 *
 * - **Dynamic Theming & Size Control (`style`)**
 *   Manages global CSS variable states for colors, text, and layout sizes.
 *   Changing these values automatically updates all mounted components without reloading the page.
 *
 * ---
 * ### Internal Architecture
 * The entire hisonvue runtime is built around a **shared internal state container** known as `hison`.
 * This closure encapsulates mutable runtime data and exposes only safe API methods through this public interface.
 *
 * - **Public Setters/Getters** → update the internal `hison` fields.
 * - **CSS Variable Management** → uses `applyCssVariables()` to re-apply computed styles to the document root.
 * - **Component Reload** → triggers `reloadAllHisonComponents()` to refresh visual themes non-destructively.
 * - **SSR-Safe Operation** → browser-only side effects are guarded by runtime environment checks.
 *
 * This separation ensures:
 * - Consistent theme and event propagation across all components.
 * - Isolation of mutable UI state from the immutable base hisonjs core.
 * - Full TypeScript typing and IntelliSense coverage for both logic and UI.
 *
 * ---
 * ### Runtime Flow Example
 * ```typescript
 * // Customize global button behavior
 * hison.cssEvent.setButtonOnBefoerClick((e) => {
 *   console.log("Before click:", e.target);
 *   return true; // returning false cancels the event
 * });
 *
 * // Dynamically recolor the theme
 * hison.style.setPrimaryColor("#4E79FF");
 * hison.style.setInvertColor(true);
 *
 * // Access and control a mounted component by id
 * const modal = hison.component.getModal("userInfoModal");
 * modal?.open();
 * ```
 *
 * ---
 * ### Design Philosophy
 * - **Unified Runtime Bridge** — Integrates logic (hisonjs) and UI (hisonvue) through a single global object.
 * - **Declarative yet Controllable** — All Vue components are reactive but remain controllable imperatively.
 * - **Theme Reactivity** — Any visual property (color, size, typography) can be updated at runtime.
 * - **Extensible Hooks** — Developers can globally override or extend behavior without touching component internals.
 * - **SSR Compatibility** — Designed to be safe for use with Nuxt 3 or Vue SSR environments.
 *
 * ---
 * ### Usage Scenarios
 * - Injecting custom UX logic globally (e.g., analytics before button clicks).
 * - Building dynamic dashboards that manipulate component layouts in runtime.
 * - Re-theming enterprise applications without recompilation.
 * - Providing consistent interaction feedback across all hisonvue elements.
 *
 * ---
 * ### Notes
 * - **SSR-Safe**: CSS variable application runs only in client environments (`typeof window !== 'undefined'`).
 * - **Component Safety**: Each `getXxx(id)` returns `null` if no component is registered under that id—no runtime throw.
 * - **Naming Consistency**: Certain method names contain legacy typos (e.g., `Befoer` instead of `Before`);
 *   they are preserved for backward compatibility but may be formally deprecated in a future release.
 *
 * ---
 * ### Summary
 * The `Hison` object in `hisonvue` represents the **bridge between data-driven logic and UI runtime control**.  
 * It inherits all configuration, data, and communication capabilities from `hisonjs`,
 * while providing unified control over visual, behavioral, and interactive elements in Vue-based applications.
 *
 * By consolidating configuration, runtime state, and UI event orchestration into a single
 * globally accessible object, it ensures both **developer productivity** and **runtime consistency**
 * across large-scale, enterprise-grade applications built with the hisondev ecosystem.
 */
export interface Hison extends Hisonjs {

  /**
   * Sets the **maximum total upload size (bytes)** allowed across an entire HFileSet component.
   * This guards the *sum* of all selected files in a single widget.
   *
   * @param fileSize - Maximum total size in bytes. Use `Infinity` for no global limit.
   * @example
   * hison.setMaxFilesetTotalSize(20 * 1024 * 1024) // 20 MB across all files
   */
  setMaxFilesetTotalSize(fileSize: number): void

  /**
   * Sets the **maximum per-file upload size (bytes)** for HFileSet.
   * This guards the size of **each individual** file that a user selects.
   *
   * @param fileTotalSize - Maximum bytes allowed per file. Use `Infinity` to remove this cap.
   * @example
   * hison.setMaxFilesetSize(5 * 1024 * 1024) // 5 MB per file
   */
  setMaxFilesetSize(fileTotalSize: number): void

  /**
   * Returns the currently effective **maximum total upload size** (bytes) across the entire HFileSet.
   * @returns The configured limit in bytes (or `Infinity` if unlimited).
   */
  getMaxFilesetTotalSize(): number

  /**
   * Returns the currently effective **maximum per-file upload size** (bytes) for HFileSet.
   * @returns The configured limit in bytes (or `Infinity` if unlimited).
   */
  getMaxFilesetSize(): number

  /**
   * Global UI interaction hooks for hisonvue components.
   *
   * Each setter replaces the active handler for the given event “slot”.
   * - **Button** series targets `<HButton>` UI events.
   * - **Input** series targets text-input-like components (e.g., `<HInput>`, `<HInputGroup>`).
   *
   * @remarks
   * - “Before” handlers (`...OnBefore...`) may return `false` to cancel the action.
   * - “After” handlers (`...OnAfter...`) run after the component processes the event.
   * - Handlers are invoked by components that integrate with the hisonvue event system.
   * - Method names include a typo (`Befoer` → *Before*). Kept for compatibility.
   * - If you need **multiple** handlers per event, compose them manually in your setter or
   *   consider introducing an internal add/remove pipeline in a future version.
   *
   * @example
   * // Cancel every HButton click unless a condition passes
   * hison.cssEvent.setButtonOnBefoerClick((e) => {
   *   const allow = someGuard();
   *   if (!allow) e.preventDefault();
   *   return allow;
   * });
   *
   * @example
   * // Add a visual cue after any HInput focus
   * hison.cssEvent.setInputOnAfterFocus(() => highlightInputs());
   */
  cssEvent: {
    /** Registers a global BEFORE-focus handler for HButton (return `false` to cancel). (typo: Befoer) */
    setButtonOnBefoerFocus(func: (e: FocusEvent) => boolean): void
    /** Registers a global AFTER-focus handler for HButton. */
    setButtonOnAfterFocus(func: (e: FocusEvent) => void): void
    /** Registers a global BEFORE-blur handler for HButton (return `false` to cancel). (typo: Befoer) */
    setButtonOnBefoerBlur(func: (e: FocusEvent) => boolean): void
    /** Registers a global AFTER-blur handler for HButton. */
    setButtonOnAfterBlur(func: (e: FocusEvent) => void): void
    /** Registers a global BEFORE-click handler for HButton (return `false` to cancel). (typo: Befoer) */
    setButtonOnBefoerClick(func: (e: MouseEvent) => boolean): void
    /** Registers a global AFTER-click handler for HButton. */
    setButtonOnAfterClick(func: (e: MouseEvent) => void): void
    /** Registers a global BEFORE-mouseover handler for HButton (return `false` to cancel). */
    setButtonOnBeforeMouseover(func: (e: MouseEvent) => boolean): void
    /** Registers a global AFTER-mouseover handler for HButton. */
    setButtonOnAfterMouseover(func: (e: MouseEvent) => void): void
    /** Registers a global BEFORE-mouseout handler for HButton (return `false` to cancel). */
    setButtonOnBeforeMouseout(func: (e: MouseEvent) => boolean): void
    /** Registers a global AFTER-mouseout handler for HButton. */
    setButtonOnAfterMouseout(func: (e: MouseEvent) => void): void
    /** Registers a global BEFORE-touchstart handler for HButton (return `false` to cancel). */
    setButtonOnBeforeTouchstart(func: (e: TouchEvent) => boolean): void
    /** Registers a global AFTER-touchstart handler for HButton. */
    setButtonOnAfterTouchstart(func: (e: TouchEvent) => void): void
    /** Registers a global BEFORE-touchend handler for HButton (return `false` to cancel). */
    setButtonOnBeforeTouchend(func: (e: TouchEvent) => boolean): void
    /** Registers a global AFTER-touchend handler for HButton. */
    setButtonOnAfterTouchend(func: (e: TouchEvent) => void): void

    /** Registers a global BEFORE-focus handler for Input-like components (return `false` to cancel). (typo: Befoer) */
    setInputOnBefoerFocus(func: (e: FocusEvent) => boolean): void
    /** Registers a global AFTER-focus handler for Input-like components. */
    setInputOnAfterFocus(func: (e: FocusEvent) => void): void
    /** Registers a global BEFORE-blur handler for Input-like components (return `false` to cancel). (typo: Befoer) */
    setInputOnBefoerBlur(func: (e: FocusEvent) => boolean): void
    /** Registers a global AFTER-blur handler for Input-like components. */
    setInputOnAfterBlur(func: (e: FocusEvent) => void): void
    /** Registers a global BEFORE-mouseover handler for Input-like components (return `false` to cancel). */
    setInputOnBeforeMouseover(func: (e: MouseEvent) => boolean): void
    /** Registers a global AFTER-mouseover handler for Input-like components. */
    setInputOnAfterMouseover(func: (e: MouseEvent) => void): void
    /** Registers a global BEFORE-mouseout handler for Input-like components (return `false` to cancel). */
    setInputOnBeforeMouseout(func: (e: MouseEvent) => boolean): void
    /** Registers a global AFTER-mouseout handler for Input-like components. */
    setInputOnAfterMouseout(func: (e: MouseEvent) => void): void
    /** Registers a global BEFORE-touchstart handler for Input-like components (return `false` to cancel). */
    setInputOnBeforeTouchstart(func: (e: TouchEvent) => boolean): void
    /** Registers a global AFTER-touchstart handler for Input-like components. */
    setInputOnAfterTouchstart(func: (e: TouchEvent) => void): void
    /** Registers a global BEFORE-touchend handler for Input-like components (return `false` to cancel). */
    setInputOnBeforeTouchend(func: (e: TouchEvent) => boolean): void
    /** Registers a global AFTER-touchend handler for Input-like components. */
    setInputOnAfterTouchend(func: (e: TouchEvent) => void): void
  }

  /**
   * Runtime accessors for **mounted component instances** by their `id`.
   *
   * Components register/unregister themselves to an internal registry during mount/unmount.
   * Each getter returns the type-specific method interface for imperative control,
   * or `null` if no component is registered under that id.
   *
   * @remarks
   * - Use these accessors to orchestrate UI from outside component scopes (e.g., from services or stores).
   * - Prefer stable, unique `id` assignments to avoid collisions.
   * - If you need strict behavior, wrap calls with your own `requireXxx(id)` helper that throws on `null`.
   *
   * @example
   * const btn = hison.component.getButton('primarySubmit');
   * btn?.setLoading(true);
   * btn?.setDisabled(true);
   */
  component: {
    /** Returns the runtime methods for an HAccordion, or `null` if not found. */
    getAccordion(accordionId: string): HAccordionMethods | null
    /** Returns the runtime methods for an HBaggie, or `null` if not found. */
    getBaggie(baggieId: string): HBaggieMethods | null
    /** Returns the runtime methods for an HBanner, or `null` if not found. */
    getBanner(bannerId: string): HBannerMethods | null
    /** Returns the runtime methods for an HButton, or `null` if not found. */
    getButton(buttonId: string): HButtonMethods | null
    /** Returns the runtime methods for an HCalendar, or `null` if not found. */
    getCalendar(calendarId: string): HCalendarMethods | null
    /** Returns the runtime methods for an HCaption, or `null` if not found. */
    getCaption(calendarId: string): HCaptionMethods | null
    /** Returns the chart instance handle, or `null` if not found. */
    getChart(chartId: string): HChartInstance | null
    /** Returns the runtime methods for an HDrawer, or `null` if not found. */
    getDrawer(drawerId: string): HDrawerMethods | null
    /** Returns the runtime methods for an HDropdown, or `null` if not found. */
    getDropdown(dropdownId: string): HDropdownMethods | null
    /** Returns the runtime methods for an HFileSet, or `null` if not found. */
    getFileset(filesetId: string): HFilesetMethods | null
    /** Returns the runtime methods for an HGap, or `null` if not found. */
    getGap(gapId: string): HGapMethods | null
    /** Returns the runtime methods for an HGrid, or `null` if not found. */
    getGrid(gridId: string): HGridMethods | null
    /** Returns the runtime methods for an HImageBox, or `null` if not found. */
    getImagebox(imageboxId: string): HImageboxMethods | null
    /** Returns the runtime methods for an HInput, or `null` if not found. */
    getInput(inputId: string): HInputMethods | null
    /** Returns the runtime methods for an HInputGroup, or `null` if not found. */
    getInputGroup(inputGroupId: string): HInputGroupMethods | null
    /** Returns the runtime methods for an HLabel, or `null` if not found. */
    getLabel(labelId: string): HLabelMethods | null
    /** Returns the runtime methods for an HLayout, or `null` if not found. */
    getLayout(layoutId: string): HLayoutMethods | null
    /** Returns the runtime methods for an HList, or `null` if not found. (param name has a typo: listtId) */
    getList(listtId: string): HListMethods | null
    /** Returns the runtime methods for an HModal, or `null` if not found. (param name has a typo: listtId) */
    getModal(listtId: string): HModalMethods | null
    /** Returns the DOM-like note element handle, or `null` if not found. */
    getNote(noteId: string): HNoteElement | null
    /** Returns the runtime methods for an HPagination, or `null` if not found. */
    getPagination(paginationId: string): HPaginationMethods | null
    /** Returns the runtime methods for an HParagraph, or `null` if not found. */
    getParagraph(paragraphId: string): HParagraphMethods | null
    /** Returns the runtime methods for an HPopup, or `null` if not found. */
    getPopup(popupId: string): HPopupMethods | null
    /** Returns the runtime methods for an HSpinner, or `null` if not found. */
    getSpinner(spinnerId: string): HSpinnerMethods | null
    /** Returns the runtime methods for an HTable, or `null` if not found. */
    getTable(tableId: string): HTableMethods | null
  }

  /**
   * Global theme & sizing controller. Mutators update the runtime theme state and
   * re-apply CSS variables to the document, then softly reload mounted components
   * so visual changes take effect immediately.
   *
   * Colors accept any valid CSS color string (hex, rgb(a), hsl(a), named colors).
   * Size uses the predefined scale from {@link Size}.
   *
   * @remarks
   * - Some “derived” getters (e.g., button/border/hover colors) return computed values
   *   from the base palette; implementations typically cache or derive them from the
   *   current theme and inversion state.
   * - `invertColor` flips foreground/background contrast for dark/light schemes.
   *
   * @example
   * // Switch to a medium size scale and update the primary palette:
   * hison.style.setSize(Size.m);
   * hison.style.setPrimaryColor('#4e79ff');
   * hison.style.setInvertColor(true);
   */
  style: {
    /** Sets the global size scale. Affects paddings, radii, and control heights. */
    setSize(size: Size.xs | Size.s | Size.m | Size.l | Size.xl): void
    /** Sets the base “filled” surface color used by components. */
    setFilledColor(filledColor: string): void
    /** Sets the base “empty/outline” surface color used by components. */
    setEmptyColor(emptyColor: string): void
    /** Sets the default text color on filled surfaces. */
    setFilledTextColor(filledTextColor: string): void
    /** Sets the default text color on empty/outline surfaces. */
    setEmptyTextColor(emptyTextColor: string): void
    /** Sets the primary accent color (brand color). */
    setPrimaryColor(primaryColor: string): void
    /** Sets the muted/neutral color. */
    setMutedColor(mutedColor: string): void
    /** Sets the informational color (status). */
    setInfoColor(infoColor: string): void
    /** Sets the success color (status). */
    setSuccessColor(successColor: string): void
    /** Sets the danger color (status). */
    setDangerColor(dangerColor: string): void
    /** Sets the warning color (status). */
    setWarningColor(warningColor: string): void
    /** Sets the custom1 color (status). */
    setCustom1Color(custom1Color: string): void
    /** Sets the custom2 color (status). */
    setCustom2Color(custom2Color: string): void
    /** Sets the custom3 color (status). */
    setCustom3Color(custom3Color: string): void
    /** Sets the custom4 color (status). */
    setCustom4Color(custom4Color: string): void
    /** Sets the custom5 color (status). */
    setCustom5Color(custom5Color: string): void
    /**
     * Enables or disables **color inversion** (dark/light intent).
     * When enabled, derived text/background pairs flip to preserve contrast.
     */
    setInvertColor(invert: boolean): void
    /**
     * Returns the current device type based on the client viewport width.
     * - SSR-safe: returns `'pc'` by default when executed on the server.
     *
     * @returns {'mb' | 'tb' | 'pc' | 'wd'} - Device type:
     *   - 'mb': mobile (<768px)
     *   - 'tb': tablet (<1200px)
     *   - 'pc': desktop (<1980px)
     *   - 'wd': wide (≥1980px)
     */
    getDeviceType(): DeviceType
    /** Returns the base filled surface color. */
    getFilledColor(): string
    /** Returns the base empty/outline surface color. */
    getEmptyColor(): string
    /** Returns the default text color on filled surfaces. */
    getFilledTextColor(): string
    /** Returns the default text color on empty/outline surfaces. */
    getEmptyTextColor(): string

    /** Returns the primary base color. */
    getPrimaryColor(): string
    /** Returns the computed button color for the primary palette. */
    getPrimaryButtonColor(): string
    /** Returns the computed border color for the primary palette. */
    getPrimaryBorderColor(): string
    /** Returns the computed shadow color for the primary palette. */
    getPrimaryShadowColor(): string
    /** Returns the computed hover color for the primary palette. */
    getPrimaryHoverColor(): string
    /** Returns the computed active color for the primary palette. */
    getPrimaryActiveColor(): string
    /** Returns the computed row hover color for the primary palette (e.g., tables). */
    getPrimaryRowHoverColor(): string
    /** Returns the computed stripe color for the primary palette (e.g., zebra rows). */
    getPrimaryStripeColor(): string

    /** Returns the muted base color. */
    getMutedColor(): string
    /** Returns the computed button color for the muted palette. */
    getMutedButtonColor(): string
    /** Returns the computed border color for the muted palette. */
    getMutedBorderColor(): string
    /** Returns the computed shadow color for the muted palette. */
    getMutedShadowColor(): string
    /** Returns the computed hover color for the muted palette. */
    getMutedHoverColor(): string
    /** Returns the computed active color for the muted palette. */
    getMutedActiveColor(): string
    /** Returns the computed row hover color for the muted palette. */
    getMutedRowHoverColor(): string
    /** Returns the computed stripe color for the muted palette. */
    getMutedStripeColor(): string

    /** Returns the info base color. */
    getInfoColor(): string
    /** Returns the computed button color for the info palette. */
    getInfoButtonColor(): string
    /** Returns the computed border color for the info palette. */
    getInfoBorderColor(): string
    /** Returns the computed shadow color for the info palette. */
    getInfoShadowColor(): string
    /** Returns the computed hover color for the info palette. */
    getInfoHoverColor(): string
    /** Returns the computed active color for the info palette. */
    getInfoActiveColor(): string
    /** Returns the computed row hover color for the info palette. */
    getInfoRowHoverColor(): string
    /** Returns the computed stripe color for the info palette. */
    getInfoStripeColor(): string

    /** Returns the success base color. */
    getSuccessColor(): string
    /** Returns the computed button color for the success palette. */
    getSuccessButtonColor(): string
    /** Returns the computed border color for the success palette. */
    getSuccessBorderColor(): string
    /** Returns the computed shadow color for the success palette. */
    getSuccessShadowColor(): string
    /** Returns the computed hover color for the success palette. */
    getSuccessHoverColor(): string
    /** Returns the computed active color for the success palette. */
    getSuccessActiveColor(): string
    /** Returns the computed row hover color for the success palette. */
    getSuccessRowHoverColor(): string
    /** Returns the computed stripe color for the success palette. */
    getSuccessStripeColor(): string

    /** Returns the danger base color. */
    getDangerColor(): string
    /** Returns the computed button color for the danger palette. */
    getDangerButtonColor(): string
    /** Returns the computed border color for the danger palette. */
    getDangerBorderColor(): string
    /** Returns the computed shadow color for the danger palette. */
    getDangerShadowColor(): string
    /** Returns the computed hover color for the danger palette. */
    getDangerHoverColor(): string
    /** Returns the computed active color for the danger palette. */
    getDangerActiveColor(): string
    /** Returns the computed row hover color for the danger palette. */
    getDangerRowHoverColor(): string
    /** Returns the computed stripe color for the danger palette. */
    getDangerStripeColor(): string

    /** Returns the warning base color. */
    getWarningColor(): string
    /** Returns the computed button color for the warning palette. */
    getWarningButtonColor(): string
    /** Returns the computed border color for the warning palette. */
    getWarningBorderColor(): string
    /** Returns the computed shadow color for the warning palette. */
    getWarningShadowColor(): string
    /** Returns the computed hover color for the warning palette. */
    getWarningHoverColor(): string
    /** Returns the computed active color for the warning palette. */
    getWarningActiveColor(): string
    /** Returns the computed row hover color for the warning palette. */
    getWarningRowHoverColor(): string
    /** Returns the computed stripe color for the warning palette. */
    getWarningStripeColor(): string

    /** Returns the custom1 base color. */
    getCustom1Color(): string
    /** Returns the computed button color for the custom1 palette. */
    getCustom1ButtonColor(): string
    /** Returns the computed border color for the custom1 palette. */
    getCustom1BorderColor(): string
    /** Returns the computed shadow color for the custom1 palette. */
    getCustom1ShadowColor(): string
    /** Returns the computed hover color for the custom1 palette. */
    getCustom1HoverColor(): string
    /** Returns the computed active color for the custom1 palette. */
    getCustom1ActiveColor(): string
    /** Returns the computed row hover color for the custom1 palette. */
    getCustom1RowHoverColor(): string
    /** Returns the computed stripe color for the custom1 palette. */
    getCustom1StripeColor(): string

    /** Returns the custom2 base color. */
    getCustom2Color(): string
    /** Returns the computed button color for the custom2 palette. */
    getCustom2ButtonColor(): string
    /** Returns the computed border color for the custom2 palette. */
    getCustom2BorderColor(): string
    /** Returns the computed shadow color for the custom2 palette. */
    getCustom2ShadowColor(): string
    /** Returns the computed hover color for the custom2 palette. */
    getCustom2HoverColor(): string
    /** Returns the computed active color for the custom2 palette. */
    getCustom2ActiveColor(): string
    /** Returns the computed row hover color for the custom2 palette. */
    getCustom2RowHoverColor(): string
    /** Returns the computed stripe color for the custom2 palette. */
    getCustom2StripeColor(): string

    /** Returns the custom3 base color. */
    getCustom3Color(): string
    /** Returns the computed button color for the custom3 palette. */
    getCustom3ButtonColor(): string
    /** Returns the computed border color for the custom3 palette. */
    getCustom3BorderColor(): string
    /** Returns the computed shadow color for the custom3 palette. */
    getCustom3ShadowColor(): string
    /** Returns the computed hover color for the custom3 palette. */
    getCustom3HoverColor(): string
    /** Returns the computed active color for the custom3 palette. */
    getCustom3ActiveColor(): string
    /** Returns the computed row hover color for the custom3 palette. */
    getCustom3RowHoverColor(): string
    /** Returns the computed stripe color for the custom3 palette. */
    getCustom3StripeColor(): string

    /** Returns the custom4 base color. */
    getCustom4Color(): string
    /** Returns the computed button color for the custom4 palette. */
    getCustom4ButtonColor(): string
    /** Returns the computed border color for the custom4 palette. */
    getCustom4BorderColor(): string
    /** Returns the computed shadow color for the custom4 palette. */
    getCustom4ShadowColor(): string
    /** Returns the computed hover color for the custom4 palette. */
    getCustom4HoverColor(): string
    /** Returns the computed active color for the custom4 palette. */
    getCustom4ActiveColor(): string
    /** Returns the computed row hover color for the custom4 palette. */
    getCustom4RowHoverColor(): string
    /** Returns the computed stripe color for the custom4 palette. */
    getCustom4StripeColor(): string

    /** Returns the custom5 base color. */
    getCustom5Color(): string
    /** Returns the computed button color for the custom5 palette. */
    getCustom5ButtonColor(): string
    /** Returns the computed border color for the custom5 palette. */
    getCustom5BorderColor(): string
    /** Returns the computed shadow color for the custom5 palette. */
    getCustom5ShadowColor(): string
    /** Returns the computed hover color for the custom5 palette. */
    getCustom5HoverColor(): string
    /** Returns the computed active color for the custom5 palette. */
    getCustom5ActiveColor(): string
    /** Returns the computed row hover color for the custom5 palette. */
    getCustom5RowHoverColor(): string
    /** Returns the computed stripe color for the custom5 palette. */
    getCustom5StripeColor(): string

    /** Returns whether theme inversion (dark/light intent) is currently enabled. */
    isInvertColor(): boolean
  }
}