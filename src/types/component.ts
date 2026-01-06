import { GridMethods } from "vanillagrid2"
import { GridAlign, GridVerticalAlign, EditMode, InputType, DataStatus, DayOfWeek, HCalendarView, HCalendarTimeFormat, BackgroundType, DropdownTrigger, TextAlign, EditModeValue, BackgroundTypeValue, HCalendarViewValue, HCalendarTimeFormatValue, TextAlignValue, DataStatusValue, BackImageAlignValue, BackImageAlign, BackImageVerticalAlignValue, BackImageVerticalAlign, HGapLineStyleValue, HGapLineStyle, HGapLine, HGapLineValue, VerticalAlignValue, ModalPlacementValue, ModalPlacement, ScreenPositionValue, ScreenPosition, SpinnerTypeValue, SpinnerType, InputTypeValue, GridVerticalAlignValue, GridAlignValue } from "../enums"
import { NoteData, VanillanoteElement } from "vanillanote2"
import { InterfaceDataModel } from "hisonjs"
import { Chart } from "chart.js"

export type DeviceType = 'mb' | 'tb' | 'pc' | 'wd'

/**
 * Represents a file item attached to the HFileset component.
 * 
 * This interface is used to describe both server-provided files (already uploaded)
 * and new files selected via input or drag-and-drop.
 */
export interface AttachedFileItem {
  /**
   * Unique identifier of the file from the server.
   * Used to distinguish pre-existing files stored in the DB.
   */
  fileId?: string;
  /**
   * Display name of the file (including extension).
   */
  fileName: string;
  /**
   * Size of the file in bytes.
   * This may be undefined for server-loaded files unless provided.
   */
  fileSize?: number;
  /**
   * Path or URL to download the file from the server.
   */
  filePath?: string;
  /**
   * File extension, such as `pdf`, `jpg`, `docx`.
   * This is automatically extracted from `fileName` if not provided.
   */
  extension?: string;
  /**
   * Native File object (from input or drag-and-drop).
   * Exists only for newly uploaded files.
   */
  file?: File;
  /**
   * Indicates whether this file was newly added by the user.
   */
  isNew?: boolean;
  /**
   * Indicates whether this file has been marked for deletion.
   * Deleted files will not appear in the visible file list.
   */
  isDeleted?: boolean;
}

/**
 * Defines a special time block on a specific day.
 * This can be used to highlight time ranges (e.g., lunch breaks, maintenance periods)
 * with a custom background color or class.
 *
 * - Time units are in **minutes** from midnight (0–1440).
 * - Use `className` to apply specific CSS styling to that time range.
 *
 * @example
 * {
 *   from: 12 * 60,     // 12:00 PM
 *   to: 13 * 60,       // 1:00 PM
 *   className: 'lunch-time'
 * }
 */
export type HCalendarSpecialTime = {
  from: number
  to: number
  className?: string
}

/**
 * Maps days of the week to arrays of special time blocks.
 * Allows you to specify custom time ranges (with styles) for each day.
 *
 * - Keys are 0 (Sunday) through 6 (Saturday).
 * - Values are arrays of `HCalendarSpecialTime` entries.
 *
 * @example
 * {
 *   1: [ { from: 720, to: 780, className: 'meeting-block' } ],  // Monday 12:00–13:00
 *   5: [ { from: 1080, to: 1140 } ]                             // Friday 18:00–19:00
 * }
 */
export type HCalendarSpecialTimeMap =  { [key in DayOfWeek]?: HCalendarSpecialTime[] }

/**
 * Defines a calendar event shown on the calendar.
 *
 * Supports both formatted date strings (e.g., '2025-06-16 10:00')
 * and JavaScript `Date` objects for `start` and `end` fields.
 *
 * Optional fields can control how the event is rendered or interacted with.
 * These map directly to `vue-cal` behavior.
 *
 * @example
 * {
 *   start: '2025-07-01 09:00',
 *   end: '2025-07-01 10:30',
 *   title: 'Team Meeting',
 *   background: true,
 *   deletable: true,
 *   class: 'event-blue'
 * }
 */
export type HCalendarEvent = {
  start: Date | string;
  end: Date | string;
  title?: string;
  content?: string;
  class?: string;
  /**
   * If true, the event is treated as a background highlight.
   * Does not display as a block, but colors the background area.
   */
  background?: boolean;
  /**
   * Optional `vue-cal` property to group events or apply external schedule logic.
   */
  schedule?: number;
  /**
   * If true, the event spans the whole day without a specific time.
   */
  allDay?: boolean;
  /**
   * If true, the user can delete this event.
   */
  deletable?: boolean;
  /**
   * If true, the user cannot resize this event.
   */
  resizable?: boolean;
}

/**
 * This is config about the column.
 */
export interface HGridColumn {
  /**
   * Required value. It is the id of the column.
   */
  id: string
  /**
   * The name of the column. If null, the grid Id is inserted.
   */
  name?: string
  /**
   * Header text value. Use ';' as the delimiter. Empty values are automatically merged.
   */
  header?: string
  /**
   * Insert the footer using ';' as the delimiter. General text: Insert the string as text in the footer.
   * $$MAX: Calculate and display the maximum value in the footer.
   * $$MIN: Calculate and display the minimum value in the footer.
   * $$SUM: Calculate and display the sum in the footer.
   * $$AVG: Calculate and display the average in the footer (excluding null).
   */
  footer?: string
  /**
   * Sets the type of the column.
   * text: Text input type. A textarea input box is created on double click.
   * number: Number input type. An input number type is created on double click.
   * date: Date input type. An input date type is created on double click.
   * month: Month input type. An input month type is created on double click.
   * mask: Text input type that matches the format. An input text type is created on double click. Controlled by the format attribute.
   * select: Input select type. Options are received when inserting values. Ex) [{value:"val1", text:"text1", selected:true},{value:"val2", text:"text2"}..]
   * checkbox: Input checkbox type. Checked if it matches the checkedValue of the grid info, unchecked otherwise.
   * button: Button type. The inserted value is displayed as the innerText of the button. If there is no value, the button is not created.
   * link: a tag. Insert the value as an object in the form {text:"text", value:"https://..", target:"_blank"}. The text is set as innerText, the value as href, and the target as target.
   * code: A type that cannot have or display values other than the specified codes. If nullValue is not in the codes, it is not allowed. Empty values are stored as default-code.
   */
  dataType?: string
  /**
   * If untarget is true, the cells in this column cannot be selected.
   */
  untarget?: boolean
  /**
   * If rowMerge is true, this column merges rows based on the cell above if the value, data-type, and format are the same.
   */
  rowMerge?: boolean
  /**
   * If colMerge is true, this column merges columns based on the cell in front if the value, data-type, and format are the same.
   */
  colMerge?: boolean
  /**
   * If visible is false, this column's width becomes 0 and size cannot be changed (hidden).
   */
  visible?: boolean
  /**
   * If required is true, this column can be checked for input using the checkRequired() method.
   */
  required?: boolean
  /**
   * If resizable is false, the user cannot change the width size of this column.
   */
  resizable?: boolean
  /**
   * Indicates whether the user can use the sorting feature for this column.
   */
  sortable?: boolean
  /**
   * Indicates whether the user can use the filtering feature for this column.
   */
  filterable?: boolean
  /**
   * The width of the column. Insert cssText. If only a number is entered, the unit is 'px'.
   */
  width?: string
  /**
   * Sets the select width size for this column. Insert cssText. The unit can only be px or %.
   */
  selectSize?: string
  /**
   * If locked is true, the cells in this column cannot be changed.
   */
  locked?: boolean
  /**
   * If lockedColor is true, the cells in this column will display a background color indicating the locked state when locked.
   */
  lockedColor?: boolean
  /**
   * Sets the format for data-type mask, number.
   * Mask format: A: Uppercase letter, a: Lowercase letter, 9: Number, others: Matching character.
   * Ex) format: "AAA-991", value: "ABC-123456" => result: "ABC-12"
   * 
   * Number format:
   * Integer part:
   * "#,###": Display with thousand separators, 0 is displayed as null, "#,##0": Display with thousand separators,
   * 0 is displayed as 0, "#": Display as is, 0 is displayed as null, "0": Display as is, 0 is displayed as 0.
   * Decimal part: "#": Display if present, "0": Display as 0 if not present.
   * Others: Characters before and after are displayed as is, and if the last character is "%", it is displayed as a percentage.
   * Ex1) format: "#,##0.## $", number: 1234.1234 => result: "1,234.12 $"
   * Ex2) format: "0%", number: 0.12 => result: "12%"
   */
  format?: string
  /**
   * Valid only for columns with data-type code. Sets codes separated by ";". This column can only have the specified code values.
   * Ex) "US;KR;JP" => Can only have the values "US", "KR", "JP"
   */
  codes?: string
  /**
   * Valid only for columns with data-type code. If a column with data-type code has no value, the default-code is used as the value instead of grid.info's nullValue.
   */
  defaultCode?: string
  /**
   * Valid only for columns with data-type text. Sets the maximum string length that can be inserted into the value. Enter only positive integers.
   */
  maxLength?: number
  /**
   * Valid only for columns with data-type text. Sets the maximum byte size of the string that can be inserted into the value. Enter only positive integers.
   * Byte size criteria are set with vg.lessoreq0x7ffByte, vg.lessoreq0xffffByte, vg.greater0xffffByte.
   * lessoreq0x7ffByte: Characters with charCode less than or equal to 0x7FF, default value is 2 (common symbols or English alphabet based on UTF-8).
   * lessoreq0xffffByte: Characters with charCode less than or equal to 0xFFFF, default value is 3 (additional alphabets such as Latin based on UTF-8).
   * greater0xffffByte: Characters with charCode greater than 0xFFFF, default value is 4 (emoji, Korean, Chinese, Japanese, etc. based on UTF-8).
   */
  maxByte?: number
  /**
   * Valid only for columns with data-type number. Sets the maximum value. If a value exceeding this is entered, it is stored as the maximum value. Enter only numbers.
   */
  maxNumber?: number
  /**
   * Valid only for columns with data-type number. Sets the minimum value. If a value below this is entered, it is stored as the minimum value. Enter only numbers.
   */
  minNumber?: number
  /**
   * Valid only for columns with data-type number. Specifies the rounding place.
   * roundNumber positive integer: Specifies the decimal place to round.
   * roundNumber negative integer: Specifies the integer place to round.
   * Ex) roundNumber: 2, number: 1234.1234 => result: 1234.12
   * Ex) roundNumber: -2, number: 1234.1234 => result: 1200
   */
  roundNumber?: number
  /**
   * Sets the align of the column. Choose from 'left', 'center', 'right'. If no value is specified, the default align follows the data-type.
   * text, mask: left, number: right, date, month, code, select, checkbox, button, link: center.
   */
  align?: GridAlign | GridAlignValue
  /**
   * Sets the default vertical-align of the column. Choose from 'top', 'center', 'bottom'. If no value is specified, it defaults to center.
   */
  verticalAlign?: GridVerticalAlign | GridVerticalAlignValue
  /**
   * Sets the default overflow-wrap of the column. Enter the overflow-wrap in cssText.
   */
  overflowWrap?: string
  /**
   * Sets the default word-break of the column. Enter the word-break in cssText.
   */
  wordBreak?: string
  /**
   * Sets the default white-space of the column. Enter the white-space in cssText.
   */
  whiteSpace?: string
  /**
   * Sets the background color of the column. Insert the 16-digit color code in cssText. Ex) "#ffffff"
   */
  backColor?: string
  /**
   * Sets the font color of the column. Insert the 16-digit color code in cssText. Ex) "#ffffff"
   */
  fontColor?: string
  /**
   * If fontBold is true, the innerText of the column's cells will be bold.
   */
  fontBold?: boolean
  /**
   * If fontItalic is true, the innerText of the column's cells will be italic.
   */
  fontItalic?: boolean
  /**
   * If fontThruline is true, the innerText of the column's cells will have a strikethrough.
   */
  fontThruline?: boolean
  /**
   * If fontUnderline is true, the innerText of the column's cells will be underlined.
   */
  fontUnderline?: boolean
}

/**
 * Defines a selectable option in `HDropdown`.
 *
 * Each option has a `label` (shown to user) and `value` (programmatic).
 * Optional `disabled` makes the item visible but not selectable.
 *
 * @example
 * { label: 'Korea', value: 'KR' }
 */
export interface HDropdownOption {
  /** Display text shown in the dropdown menu */
  label: string
  /** Programmatic value associated with this option */
  value: any
  /** If true, option is visible but cannot be selected */
  disabled?: boolean
}

/**
 * v-model payload for `HDropdown`.
 *
 * Contains the current `value` and the list of `options`.
 * Used for two-way binding and runtime updates.
 *
 * @example
 * {
 *   value: 'KR',
 *   options: [
 *     { label: 'Korea', value: 'KR' },
 *     { label: 'Japan', value: 'JP' }
 *   ]
 * }
 */
export interface HDropdownModel {
  /** Currently selected option value */
  value: any
  /** Full list of selectable options */
  options: HDropdownOption[]
}

/**
 * Defines additional attributes that can be bound to an `<a>` element in `HLabel`.
 *
 * These map directly to standard HTML anchor attributes plus ARIA support.
 * Provides flexibility for accessibility and advanced link behavior.
 *
 * @example
 * {
 *   target: '_blank',
 *   rel: 'noopener noreferrer',
 *   download: true,
 *   hreflang: 'en',
 *   'aria-label': 'External link'
 * }
 */
export interface HLabelAnchorAttrs {
  /** Where to display the linked URL (`_self`, `_blank`, `_parent`, `_top`, etc.) */
  target?: '_self' | '_blank' | '_parent' | '_top' | (string & {});
  /** Relationship of the target object (e.g., `"noopener noreferrer"`) */
  rel?: string;
  /** Marks link for download; may specify filename */
  download?: boolean | string;
  /** Language of the linked resource (e.g., `"en"`, `"ko"`) */
  hreflang?: string;
  /** Referrer policy for the request */
  referrerpolicy?:
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url';
  /** MIME type of the linked resource */
  type?: string;
  /** Space-separated URLs to notify when link is clicked */
  ping?: string;
  /** ARIA role for accessibility */
  role?: string;
  /** Tab order index for keyboard navigation */
  tabindex?: number;
  /** Accessible label text */
  'aria-label'?: string;
  /** Indicates the current item within a set of related links */
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean;
  /** Any additional custom attribute */
  [key: string]: unknown;
}

/**
 * Basic methods in all components
 */
export interface ComponentMethods {
  isHisonvueComponent: true
  /**
   * Returns the unique ID of the component.
   * This is the same as the `id` prop (or auto-generated if not set).
   */
  getId(): string
  /**
   * Returns the type of the component.
   */
  getType(): string
  /**
   * Returns whether this component is currently visible.
   * - `false` means `display: none` is applied.
   */
  isVisible(): boolean;
  /**
   * Shows or hides this component.
   * - `true` makes this component visible.
   * - `false` applies `display: none`.
   */
  setVisible(visible: boolean): void;
  /**
   * Forces this component to re-render by unmounting and remounting internally.
   * 
   * This is useful when you want to apply dynamic style or class changes
   * (such as responsive styles or visibility) that are not automatically reflected
   * through reactive props alone.
   */
  reload(): void;
}

/**
 * Runtime control methods for `HAccordion` component.
 *
 * This interface defines methods accessible via `hison.component.getAccordion(id)`.
 * It allows you to programmatically open/close/toggle the accordion, update its title,
 * adjust header text alignment, and control expand/collapse animation behavior.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const acc = hison.component.getAccordion('filters');
 *
 * // Open/close programmatically
 * acc.open();
 * acc.close();
 *
 * // Update header title dynamically
 * acc.setTitle('Advanced Filters');
 *
 * // Adjust alignment at runtime
 * acc.setTextAlign('center');
 *
 * // Customize animation
 * acc.setDuration(800);
 * acc.setEasing('ease-in-out');
 *
 * // Move focus to the header (keyboard accessible)
 * acc.focus();
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - Accordions are **display/output-only**; no editMode or value binding is supported.
 * - Title slot (`#title`) visually overrides the `title` prop.  
 *   When slot content is used, `setTitle()` still updates the internal state but will not affect the rendered header.
 * - Animation (`animate`, `duration`, `easing`) is applied per instance and reflected immediately.
 */
export interface HAccordionMethods extends ComponentMethods {
  /**
   * Returns the component type literal.
   */
  getType(): 'accordion'
  /**
   * Whether the accordion body is currently expanded.
   */
  isOpen(): boolean
  /**
   * Expands the accordion body with animation (if enabled).
   */
  open(e?: Event | null): void
  /**
   * Collapses the accordion body with animation (if enabled).
   */
  close(e?: Event | null): void
  /**
   * Toggles the accordion body between expanded and collapsed.
   */
  toggle(e?: Event | null): void
  /**
   * Returns the current header title (from `title` prop/state).
   */
  getTitle(): string
  /**
   * Updates the header title text.
   * - ⚠️ If a `#title` slot is provided, this will not change the visible header.
   */
  setTitle(text: string): void
  /**
   * Returns the current header text alignment.
   */
  getTextAlign(): 'left' | 'center' | 'right'
  /**
   * Sets the header text alignment.
   * - Accepted values: `'left' | 'center' | 'right'`
   */
  setTextAlign(v: 'left' | 'center' | 'right'): void
  /**
   * Whether expand/collapse animation is enabled.
   */
  getAnimate(): boolean
  /**
   * Enables/disables expand/collapse animation.
   */
  setAnimate(v: boolean): void
  /**
   * Returns the current animation duration (in ms).
   */
  getDuration(): number
  /**
   * Sets the animation duration (in ms).
   */
  setDuration(ms: number): void
  /**
   * Returns the CSS timing function used for animation.
   */
  getEasing(): string
  /**
   * Sets the CSS timing function for animation (e.g., `'ease'`, `'linear'`, `'cubic-bezier(...)'`).
   */
  setEasing(fn: string): void
  /**
   * Gets the current `tabIndex` applied to element.
   * - `null`: no `tabindex` attribute (items not focusable).
   * - `0` or positive number: items can be focused via keyboard navigation.
   */
  getTabIndex(): number | null
  /**
   * Sets `tabIndex` for element.
   * @param v - `null` to remove, or number to make focusable.
   */
  setTabIndex(v: number | null): void
  /**
   * Moves focus to the accordion header (for accessibility/keyboard usage).
   */
  focus(): void
}

/**
 * Runtime control methods for `HBaggie` component.
 *
 * This interface defines programmatic access to a baggie’s visibility,
 * badge-only visibility, z-index layering, position, text content, shape,
 * background, border, tabindex, and interactive state.
 * You can retrieve an instance using `hison.component.getBaggie(id)`.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const baggie = hison.component.getBaggie('bag01');
 * baggie.setText('9+');
 * baggie.setPosition('bottom-left');
 * baggie.setButtonEnabled(true);
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - The `visible` prop hides both the target and badge; `baggieVisible` hides **only the badge**.
 * - `zIndex` applies to the anchor; the badge itself is rendered at `zIndex + 1`.
 * - For custom content, the `#badge` slot overrides the `text` prop entirely.
 */
export interface HBaggieMethods extends ComponentMethods {
  /**
   * Returns the type of the component.
   * Always `'baggie'`.
   */
  getType(): 'baggie'
  /**
   * Returns whether the entire baggie anchor (target + badge) is visible.
   */
  isVisible(): boolean
  /**
   * Sets whether the entire baggie anchor (target + badge) is visible.
   */
  setVisible(v: boolean): void
  /**
   * Returns whether the badge itself is visible.
   * (Target element stays visible regardless.)
   */
  isBaggieVisible(): boolean
  /**
   * Sets whether the badge itself is visible.
   */
  setBaggieVisible(v: boolean): void
  /**
   * Gets the current base z-index (applied to the anchor).
   * The badge uses `zIndex + 1`.
   */
  getZIndex(): number
  /**
   * Sets the base z-index (applied to the anchor).
   * The badge will automatically render at `zIndex + 1`.
   */
  setZIndex(v: number): void
  /**
   * Gets the current badge position relative to its target.
   */
  getPosition(): ScreenPositionValue
  /**
   * Sets the badge position relative to its target.
   * Accepts any `ScreenPosition` value (e.g. `'top-right'`, `'bottom-center'`).
   */
  setPosition(v: ScreenPosition | ScreenPositionValue): void
  /**
   * Gets the current text content of the badge.
   * Returns empty string if no text is set.
   */
  getText(): string
  /**
   * Sets the text content of the badge.
   * Ignored if slot `#badge` is used.
   */
  setText(t: string): void
  /**
   * Returns whether the badge has border/shadow styling.
   */
  isBorder(): boolean
  /**
   * Sets whether the badge shows border/shadow styling.
   */
  setBorder(v: boolean): void
  /**
   * Gets the current background type of the badge.
   */
  getBackgroundType(): BackgroundTypeValue
  /**
   * Sets the background type of the badge.
   * One of: `'empty' | 'transparent' | 'filled'`
   */
  setBackgroundType(t: BackgroundType | BackgroundTypeValue): void
  /**
   * Gets the shape of the badge.
   * One of: `'square' | 'rounded' | 'circle'`
   */
  getShape(): 'square' | 'rounded' | 'circle'
  /**
   * Sets the shape of the badge.
   */
  setShape(s: 'square' | 'rounded' | 'circle'): void
  /**
   * Gets the tabindex value of the badge (or `null` if not focusable).
   */
  getTabIndex(): number | null
  /**
   * Sets the tabindex value of the badge.
   * Use `null` to remove focusability.
   */
  setTabIndex(v: number | null): void
  /**
   * Returns whether the badge is enabled for button-like interaction.
   */
  isButtonEnabled(): boolean
  /**
   * Enables or disables button-like interaction styling/behavior.
   */
  setButtonEnabled(v: boolean): void
  /**
   * Reloads the component instance (re-applies props and state).
   * Typically used internally for hot-reload or style updates.
   */
  reload(): void
}

/**
 * Runtime control methods for `HBanner` component.
 *
 * This interface defines programmatic access to a banner’s visibility,
 * frame styling (background/border), slide index navigation, navigation UI
 * (prev/next buttons, indicators, indicators’ position), autoplay behavior,
 * and transition timing. You can retrieve an instance using
 * `hison.component.getBanner(id)`.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const banner = hison.component.getBanner('bn1');
 * banner.next();
 * banner.setAutoInterval(3000);
 * banner.startAuto();
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - `initialIndex` is applied on mount; calling `setInitialIndex()` will navigate immediately.
 * - When `loop` is `false`, navigation at the first/last slide is disabled and buttons may be disabled.
 * - Setting `autoInterval` to a value < 100 disables autoplay.
 * - If `pauseOnHover` is `true`, hovering the banner pauses autoplay.
 * - `indicatorClickable = false` renders dots as non-interactive.
 * - `indicatorsPosition: 'overlay'` draws dots inside the banner near the bottom edge; `'bottom'` places them below.
 */
export interface HBannerMethods extends ComponentMethods {
  /**
   * Returns the type of the component.
   * Always `'banner'`.
   */
  getType(): 'banner'
  /**
   * Returns whether the entire banner frame is visible.
   */
  isVisible(): boolean
  /**
   * Sets whether the entire banner frame is visible.
   */
  setVisible(v: boolean): void
  /**
   * Returns whether the banner shows border/shadow styling.
   */
  isBorder(): boolean
  /**
   * Sets whether the banner shows border/shadow styling.
   */
  setBorder(v: boolean): void
  /**
   * Gets the current background type of the banner.
   */
  getBackgroundType(): BackgroundTypeValue
  /**
   * Sets the background type of the banner.
   * One of: `'empty' | 'transparent' | 'filled'`
   */
  setBackgroundType(t: BackgroundType | BackgroundTypeValue): void
  /**
   * Gets the current zero-based slide index.
   */
  getCurrentIndex(): number
  /**
   * Navigates to the given zero-based slide index.
   * Clamped to bounds; when `loop` is true, wraps around.
   */
  setCurrentIndex(i: number): void
  /**
   * Gets the initial zero-based slide index used on mount.
   */
  getInitialIndex(): number
  /**
   * Sets the initial slide index and navigates immediately.
   */
  setInitialIndex(i: number): void
  /**
   * Returns the total number of slides (default slot children).
   */
  getSlideCount(): number
  /**
   * Navigates to the next slide (respecting `loop`).
   */
  next(): void
  /**
   * Navigates to the previous slide (respecting `loop`).
   */
  prev(): void
  /**
   * Navigates to the specified zero-based slide index.
   */
  goTo(i: number): void
  /**
   * Gets the current navigation button style.
   * One of: `'chevron' | 'triangle'`
   */
  getNavButtonStyle(): 'chevron' | 'triangle'
  /**
   * Sets the navigation button style.
   */
  setNavButtonStyle(s: 'chevron' | 'triangle'): void
  /**
   * Returns whether prev/next navigation buttons are shown.
   */
  isShowNavButtons(): boolean
  /**
   * Sets whether prev/next navigation buttons are shown.
   */
  setShowNavButtons(v: boolean): void
  /**
   * Returns whether page indicators (dots) are shown.
   */
  isShowIndicators(): boolean
  /**
   * Sets whether page indicators (dots) are shown.
   */
  setShowIndicators(v: boolean): void
  /**
   * Gets the indicators’ position.
   * One of: `'bottom' | 'overlay'`
   */
  getIndicatorsPosition(): 'bottom' | 'overlay'
  /**
   * Sets the indicators’ position.
   */
  setIndicatorsPosition(p: 'bottom' | 'overlay'): void
  /**
   * Returns whether page indicators are clickable.
   */
  isIndicatorClickable(): boolean
  /**
   * Sets whether page indicators are clickable.
   */
  setIndicatorClickable(v: boolean): void
  /**
   * Gets the autoplay interval in milliseconds.
   * Values < 100 disable autoplay.
   */
  getAutoInterval(): number
  /**
   * Sets the autoplay interval in milliseconds.
   * If autoplay is running, the timer is restarted.
   */
  setAutoInterval(ms: number): void
  /**
   * Gets the autoplay direction.
   * One of: `'next' | 'prev'`
   */
  getAutoDirection(): 'next' | 'prev'
  /**
   * Sets the autoplay direction.
   */
  setAutoDirection(d: 'next' | 'prev'): void
  /**
   * Returns whether edge navigation wraps around.
   */
  isLoop(): boolean
  /**
   * Sets whether edge navigation wraps around.
   */
  setLoop(v: boolean): void
  /**
   * Returns whether hovering the banner pauses autoplay.
   */
  isPauseOnHover(): boolean
  /**
   * Sets whether hovering the banner pauses autoplay.
   */
  setPauseOnHover(v: boolean): void
  /**
   * Starts autoplay (if interval ≥ 100 ms).
   */
  startAuto(): void
  /**
   * Stops autoplay.
   */
  stopAuto(): void
  /**
   * Gets the slide transition duration in milliseconds.
   */
  getTransitionMs(): number
  /**
   * Sets the slide transition duration in milliseconds.
   */
  setTransitionMs(ms: number): void
  /**
   * Reloads the component instance (re-applies props and state).
   * Typically used for hot-reload or style updates.
   */
  reload(): void
}

/**
 * Runtime control methods for `HButton` component.
 *
 * This interface defines methods that can be accessed via `hison.component.getButton(id)`.
 * Use these methods to manipulate button state programmatically at runtime.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const btn = hison.component.getButton('btn01');
 * btn.setVisible(false);
 * btn.setDisable(true);
 * btn.setText('Loading...');
 * btn.setTitle('Please wait');
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - `setText` and `getText` only work if the button **does not use a slot**.
 * - All changes are reactive and immediately reflected in the DOM.
 */
export interface HButtonMethods extends ComponentMethods {
  /**
   * Returns the type of the button.
   */
  getType(): 'button'
  /**
   * Gets the current button text.
   * - Returns `''` if the button uses a `<slot>`.
   * - Returns the internally managed `text` otherwise.
   */
  getText(): string;
  /**
   * Gets the current tooltip (title) of the button.
   * - Reflects the current `title` attribute shown on hover.
   */
  getTitle(): string;
  /**
   * Returns whether the button is currently disabled.
   * - `true` means the button cannot be clicked.
   */
  isDisable(): boolean;
  /**
   * Sets the button text (only if no slot is used).
   * - If a slot is used, this has no effect.
   * - Updates internal reactive `text` state.
   */
  setText(text: string): void;
  /**
   * Sets the button tooltip (title) text.
   * - Affects what appears on hover.
   */
  setTitle(title: string): void;
  /**
   * Enables or disables the button.
   * - When disabled, button is grayed out and not clickable.
   */
  setDisable(disable: boolean): void;
  /**
   * Returns whether the current element displays a border.
   */
  isBorder(): boolean
  /**
   * ESets whether the current element displays a border.
   * 
   * @param border - `true` to display border, `false` to none display border
   */
  setBorder(border: boolean): void
  /**
   * Gets the current background type of the button.
   * Returns 'filled', 'empty', or 'transparent' according to the applied style.
   * See BackgroundType enum for all possible values.
   */
  getBackgroundType(): BackgroundTypeValue
  /**
   * Changes the button's background type at runtime.
   * Accepts 'filled', 'empty', or 'transparent' (see BackgroundType).
   * Triggers re-render and updates the button's CSS class immediately.
   * @param type - New background type to apply.
   */
  setBackgroundType(type: BackgroundType | BackgroundTypeValue): void
  /**
   * Unlocks the button, allowing it to be clicked again after a manual lock.
   *
   * This method is used to release the "pending" (locked) state of the button,
   * which is automatically enabled to prevent double submission while the `click` handler is running.
   *
   * - If your `@click` handler performs asynchronous logic (such as API requests or timeouts)
   *   and you want to allow another click only after a certain condition or callback, use this method.
   *
   * ---
   *
   * ### 🛠 Usage Example
   * ```vue
   * <HButton
   *   @click="async (e, btn) => {
   *     btn.setDisable(true)
   *     await apiRequest()
   *     btn.setDisable(false)
   *     btn.unlock() // unlocks the button for the next click
   *   }"
   * />
   *
   * <HButton
   *   @click="(e, btn) => {
   *     btn.setDisable(true)
   *     setTimeout(() => {
   *       btn.setDisable(false)
   *       btn.unlock() // unlocks after timeout
   *     }, 2000)
   *   }"
   * />
   * ```
   */
  unlock(): void
  /**
   * Returns the current minimum interval (in milliseconds) required between button clicks.
   * - When set, the button cannot be clicked again until the specified time has passed since the last accepted click.
   *
   * @returns {number} The interval in milliseconds. `0` means no interval limit.
   *
   * ---
   *
   * ### 🛠 Usage Example
   * ```ts
   * const btn = hison.component.getButton('myBtn')
   * const interval = btn.getClickInterval()
   * // e.g., interval === 500 (for a 0.5s interval)
   * ```
   */
  getClickInterval(): number
  /**
   * Sets the minimum interval (in milliseconds) between button clicks.
   * - When set, any clicks that occur before the interval has passed since the last click will be ignored.
   * - This is independent of the isPending (pending/locked) state.
   *
   * @param {number} ms - The interval in milliseconds (e.g., `500` for 0.5 seconds).
   *
   * ---
   *
   * ### 🛠 Usage Example
   * ```ts
   * const btn = hison.component.getButton('myBtn')
   * btn.setClickInterval(1500) // Now only one click is allowed every 1.5 seconds.
   * ```
   */
  setClickInterval(ms: number): void
  /**
   * Gets the current `tabIndex` applied to element.
   * - `null`: no `tabindex` attribute (items not focusable).
   * - `0` or positive number: items can be focused via keyboard navigation.
   */
  getTabIndex(): number | null
  /**
   * Sets `tabIndex` for element.
   * @param v - `null` to remove, or number to make focusable.
   */
  setTabIndex(v: number | null): void
  /**
   * Focus on the button.
   */
  focus(): void
}

/**
 * Runtime control methods for `HCalendar` component.
 *
 * This interface defines the available methods on `HCalendar`,
 * accessible via `hison.component.getCalendar(id)`, to programmatically control
 * calendar state, selected date, events, and display configuration.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const calendar = hison.component.getCalendar('cal1');
 * calendar.setSelectedDate('2025-07-01');
 * calendar.setDisable(true);
 * calendar.setVisible(false);
 *
 * const events = calendar.getEvents();
 * calendar.setEvents([...events, { start: '2025-07-02 10:00', end: '2025-07-02 11:00', title: 'Meeting' }]);
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - Each `HCalendar` instance is automatically registered by `id` via `hison.component.getCalendar(id)`.
 * - Style-related changes (e.g. `weekendColor`, `selectedColor`) are applied via dynamic CSS variables.
 * - Date/time options use minutes (0~1440) where applicable (e.g. `timeFrom`, `timeTo`).
 * - Some properties like view mode (`setActiveView`) or locale (`setLocale`) can be changed live without re-render.
 * - `HCalendar` supports both `v-model:selected-date` and `v-model:events`, but changes via method calls will override both.
 */
export interface HCalendarMethods extends ComponentMethods {
  /**
   * Returns the type identifier for the component.
   * Always returns `'calendar'`.
   */
  getType(): 'calendar';
  /**
   * Returns whether the calendar is currently disabled.
   * - `true` means the calendar cannot be clicked.
   */
  isDisable(): boolean;
  /**
   * Enables or disables the calendar.
   * - When disabled, calendar is grayed out and not clickable.
   * @param disable
   */
  setDisable(disable: boolean): void;
  /**
   * Returns the currently selected date.
   * @param getDateType If `true`, returns a `Date` object; otherwise returns a formatted string.
   * @param format Optional format string. Defaults to global hison datetime format.
   */
  getSelectedDate(getDateType?: boolean, format?: string): string | Date;
  /**
   * Sets the selected date in the calendar.
   * @param selectedDate A string or Date object.
   */
  setSelectedDate(selectedDate: string | Date): void;
  /**
   * Returns the array of events currently displayed in the calendar.
   */
  getEvents(): HCalendarEvent[];
  /**
   * Updates the calendar events array.
   * @param events List of events to set.
   */
  setEvents(events: HCalendarEvent[]): void;
  /**
   * Returns the map of special time highlights.
   */
  getSpecialTime(): HCalendarSpecialTimeMap;
  /**
   * Sets special time ranges for specific days of the week.
   * @param specialTimeMap Object mapping day index to time ranges.
   */
  setSpecialTime(specialTimeMap: HCalendarSpecialTimeMap): void;
  /**
   * Returns the background color for weekend header cells.
   */
  getWeekendColor(): string | undefined;
  /**
   * Sets the weekend header background color.
   * @param cssText CSS color value (e.g., `#ff0000`, `rgba(...)`).
   */
  setWeekendColor(cssText: string): void;
    /**
   * Returns which weekday indices are considered weekends.
   */
  getWeekendDays(): number[] | undefined;
  /**
   * Sets which weekday indices are treated as weekends.
   * @param weekendDays Array of day indices (0 = Sunday).
   */
  setWeekendDays(weekendDays: number[]): void;
  /**
   * Returns whether today is highlighted with background color.
   */
  isShowTodayColor(): boolean;
  /**
   * Enables or disables special background highlight for today's date.
   * @param showTodayColor Boolean
   */
  setShowTodayColor(showTodayColor: boolean): void;
  /**
   * Returns the background color for the selected date.
   */
  getSelectedColor(): string | undefined;
  /**
   * Sets the background color for the selected date cell.
   * @param cssText (e.g., '#ff0000' or 'rgba(255,0,0,0.2)')
   */
  setSelectedColor(cssText: string): void;
  /**
   * Returns the minimum height (in px) for date cells in month view.
   */
  getDateCellMinHeight(): number | undefined;
  /**
   * Sets the minimum height (in px) for date cells in month view.
   * @param minHeight number of px
   */
  setDateCellMinHeight(minHeight: number): void;
  /**
   * Returns the maximum height (in px) for date cells in month view.
   */
  getDateCellMaxHeight(): number | undefined;
  /**
   * Sets the maximum height (in px) for date cells in month view.
   * @param maxHeight number of px
   */
  setDateCellMaxHeight(maxHeight: number): void;
  /**
   * Returns the list of disabled dates.
   * - These are dates that users cannot select in the calendar.
   */
  getDisableDays(): string[] | undefined;
  /**
   * Sets the list of disabled dates.
   * @param disableDays array of string dates (e.g., ['2025-06-26', '2025-06-27'])
   */
  setDisableDays(disableDays: string[]): void;
  /**
   * Returns the current setting for month view event display.
   * - Can be `false`, `'short'`, or other strings for full event text.
   */
  getEventsOnMonthView(): string | boolean | undefined;
  /**
   * Sets how events are displayed in the month view.
   * @param eventsOnMonthView
   * - `false`: shows event count only
   * - `'short'`: shows only titles
   * - others: shows full event contents
   */
  setEventsOnMonthView(eventsOnMonthView: string | boolean): void;
  /**
   * Returns which weekdays are currently hidden.
   * - Array of weekday indexes: 0 = Sunday, 6 = Saturday
   */
  getHideWeekdays(): number[] | undefined;
  /**
   * Hides or shows specific weekdays.
   * @param hideWeekdays Array of weekday indexes to hide (e.g., [2,3] to hide Tue/Wed)
   */
  setHideWeekdays(hideWeekdays: number[]): void;
  /**
   * Returns whether weekends (Saturday and Sunday) are currently hidden.
   */
  getHideWeekends(): boolean;
  /**
   * Hides or shows weekends in the calendar.
   * @param hideWeekends
   */
  setHideWeekends(hideWeekends: boolean): void;
  /**
   * Returns the current locale (language code).
   * - Example: 'en', 'ko'
   */
  getLocale(): string;
  /**
   * Sets the calendar language (locale).
   * - Example: 'fr', 'zh-cn'
   * @param locale See vue-cal docs for full list of locales
   */
  setLocale(locale: string): void;
  /**
   * Returns the maximum selectable date.
   * @param getDateType If `true`, returns a Date object; otherwise returns a string.
  */
  getMaxDate(getDateType?: boolean): string | Date | undefined | null;
  /**
   * Sets the maximum date users can select.
   * @param maxDate A string or Date object.
   */
  setMaxDate(maxDate: string | Date): void;
  /**
   * Returns the minimum selectable date.
   * @param getDateType If `true`, returns a Date object; otherwise returns a string.
   */
  getMinDate(getDateType?: boolean): string | Date | undefined | null;
  /**
   * Sets the minimum date users can select.
   * @param minDate A string or Date object.
   */
  setMinDate(minDate: string | Date): void;
  /**
   * Returns whether the week starts on Sunday.
   * - `true`: Sunday, `false`: Monday
   */
  isStartWeekOnSunday(): boolean;
  /**
   * Sets the start day of the week.
   * @param startWeekOnSunday `true` for Sunday, `false` for Monday
   */
  setStartWeekOnSunday(startWeekOnSunday: boolean): void;
  /**
   * Returns whether time cells are currently shown in 'day' or 'week' views.
   * - Equivalent to the `time` prop.
   */
  isShowTimeCell(): boolean;
  /**
   * Enables or disables display of time cells.
   * @param showTimeCell `true` to show time column, `false` to hide
   */
  setShowTimeCell(showTimeCell: boolean): void;
  /**
   * Returns the height (in pixels) of each time cell.
   */
  getTimeCellHeight(): number | undefined;
  /**
   * Sets the height (in pixels) of each time cell.
   * @param timeCellHeight A positive number (e.g., `40`)
   */
  setTimeCellHeight(timeCellHeight: number): void;
  /**
   * Returns the current time format used in the time column.
   */
  getTimeFormat(): HCalendarTimeFormat | HCalendarTimeFormatValue | undefined;
  /**
   * Sets the time format used for displaying time cells.
   * @param timeFormat Format string from `HCalendarTimeFormat` enum
   */
  setTimeFormat(timeFormat: HCalendarTimeFormat): void;
  /**
   * Returns the start time of the time axis (in minutes).
   */
  getTimeFrom(): number | undefined;
  /**
   * Sets the start time of the time axis (in minutes).
   * @param timeFrom A number between 0 and 1440 (e.g., `9 * 60` = 9:00 AM)
   */
  setTimeFrom(timeFrom: number): void;
  /**
   * Returns the time step between time cells (in minutes).
   */
  getTimeStep(): number | undefined;
  /**
   * Sets the time step interval for time cells.
   * @param timeStep A number between 1 and 60 (e.g., `30` for half-hour blocks)
   */
  setTimeStep(timeStep: number): void;
  /**
   * Returns the end time of the time axis (in minutes).
   */
  getTimeTo(): number | undefined;
  /**
   * Sets the end time of the time axis (in minutes).
   * @param timeTo A number between 0 and 1440 (e.g., `18 * 60` = 6:00 PM)
   */
  setTimeTo(timeTo: number): void;
  /**
   * Returns whether the title bar (month/year label & arrows) is hidden.
   */
  isHideTitleBar(): boolean;
  /**
   * Shows or hides the title bar at the top of the calendar.
   * @param hideTitleBar `true` to hide, `false` to show
   */
  setHideTitleBar(hideTitleBar: boolean): void;
  /**
   * Returns whether the calendar is using 12-hour AM/PM format.
   */
  isTwelveHour(): boolean;
  /**
   * Enables or disables 12-hour format display.
   * @param twelveHour `true` for AM/PM display, `false` for 24-hour
   */
  setTwelveHour(twelveHour: boolean): void;
  /**
   * Returns the currently active view mode.
   * - One of `'day'`, `'week'`, `'month'`, `'year'`, `'years'`
   */
  getActiveView(): HCalendarViewValue;
  /**
   * Changes the active calendar view.
   * @param view New view mode from `HCalendarView` enum
   */
  setActiveView(view: HCalendarView | HCalendarViewValue): void;
  /**
   * Returns the list of views that are currently disabled.
   */
  getDisableViews(): HCalendarView[] | HCalendarViewValue[] | undefined;
  /**
   * Disables specific view modes to restrict user navigation.
   * @param disableViews Array of view modes to disable
   */
  setDisableViews(disableViews: HCalendarView[]): void;
}

/**
 * Runtime control methods for `HCaption` component.
 *
 * This interface defines methods that can be accessed via `hison.component.getCaption(id)`.
 * Use these methods to manipulate caption (heading) state programmatically at runtime.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const cp = hison.component.getCaption('title01');
 * cp.setLevel(2);                 // <h2>
 * cp.setText('Section Title');    // when not rendering an element-slot
 * cp.setTextAlign('center');
 * cp.setFontBold(true);
 * cp.setBorder(true);
 * cp.setBackgroundType('transparent');
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - If the default slot contains **any element vnode**, `getText()` returns `''` and `setText()` has no effect.
 *   - If the default slot is **pure text nodes**, that text is absorbed and becomes controllable by `getText/setText`.
 * - Changes are reactive and reflected immediately in the DOM.
 * - Heading level is constrained to **1 ~ 6** and maps to actual `<h1> ~ <h6>` tags at render time.
 */
export interface HCaptionMethods extends ComponentMethods {
  /**
   * Returns the type of the component.
   * - Always `'caption'` for this component.
   */
  getType(): 'caption'
  /**
   * Returns whether the caption is visible.
   * - `true`: rendered normally.
   * - `false`: hidden via `hison-display-none` on wrapper.
   */
  isVisible(): boolean
  /**
   * Sets caption visibility.
   * @param visible - `true` to show, `false` to hide.
   */
  setVisible(visible: boolean): void
  /**
   * Gets the current tooltip (title attribute) text shown on hover.
   */
  getTitle(): string
  /**
   * Sets the tooltip (title attribute) text shown on hover.
   * @param title - Tooltip text.
   */
  setTitle(title: string): void
  /**
   * Gets the caption text when controllable:
   * - Returns `''` if the default slot renders **any element vnode**.
   * - Otherwise, returns the internally managed text (including text-only slot absorption).
   */
  getText(): string
  /**
   * Sets the caption text when controllable:
   * - No effect if the default slot renders **any element vnode**.
   * - Updates internal reactive text rendered inside the heading element.
   * @param text - New caption text.
   */
  setText(text: string): void
  /**
   * Gets the current heading level (1~6).
   * - Maps to `<h1>` ~ `<h6>` at render time.
   */
  getLevel(): number
  /**
   * Sets the heading level.
   * - Values outside 1~6 are clamped to the nearest bound.
   * @param level - Target heading level (1~6).
   */
  setLevel(level: number): void
  /**
   * Gets current text alignment (`'left' | 'center' | 'right'`).
   */
  getTextAlign(): TextAlignValue
  /**
   * Sets text alignment.
   * - Accepts enum `TextAlign` or its string literal values.
   * @param textAlign - `'left' | 'center' | 'right'`.
   */
  setTextAlign(textAlign: TextAlign | TextAlignValue): void
  /**
   * Returns whether bold style is applied.
   */
  isFontBold(): boolean
  /**
   * Applies or removes bold style.
   * @param bold - `true` to apply, `false` to remove.
   */
  setFontBold(bold: boolean): void
  /**
   * Returns whether italic style is applied.
   */
  isFontItalic(): boolean
  /**
   * Applies or removes italic style.
   * @param italic - `true` to apply, `false` to remove.
   */
  setFontItalic(italic: boolean): void
  /**
   * Returns whether strikethrough is applied.
   */
  isFontThruline(): boolean
  /**
   * Applies or removes strikethrough style.
   * @param thruline - `true` to apply, `false` to remove.
   */
  setFontThruline(thruline: boolean): void
  /**
   * Returns whether underline is applied.
   */
  isFontUnderline(): boolean
  /**
   * Applies or removes underline style.
   * @param underline - `true` to apply, `false` to remove.
   */
  setFontUnderline(underline: boolean): void
  /**
   * Returns whether the caption shows border (box-shadow).
   */
  isBorder(): boolean
  /**
   * Sets whether border (box-shadow) is shown.
   * @param border - `true` to show, `false` to hide.
   */
  setBorder(border: boolean): void
  /**
   * Gets current background type of the caption.
   * - One of `'filled' | 'empty' | 'transparent'`.
   */
  getBackgroundType(): BackgroundTypeValue
  /**
   * Sets background type of the caption.
   * - Accepts `'filled' | 'empty' | 'transparent'` (see `BackgroundType` enum).
   * @param type - New background type to apply.
   */
  setBackgroundType(type: BackgroundType | BackgroundTypeValue): void
}

/**
 * Runtime control interface for the `HChart` component.
 *
 * This interface is returned by `hison.component.getChart(id)` and allows full programmatic control of the chart.
 *
 * ---
 *
 * ### 📊 Example Usage
 * ```ts
 * const chart = hison.component.getChart('salesChart')
 * if (chart) {
 *   chart.setVisible(true)
 *   chart.data.labels = ['Jan', 'Feb', 'Mar']
 *   chart.data.datasets[0].data = [10, 20, 30]
 *   chart.update()
 * }
 * ```
 *
 * ---
 *
 * ### ⚙️ Chart.js Integration
 * - `HChartInstance` extends [`Chart`](https://www.chartjs.org/docs/latest/api/chart) from Chart.js.
 * - This means **you can directly use all Chart.js instance methods**, such as:
 *   - `.update()`
 *   - `.resize()`
 *   - `.destroy()`
 *   - `.reset()`
 *   - `.render()`
 *   - `.stop()`
 *   - `.toBase64Image()`
 *   - `.getElementsAtEventForMode()`
 * - You also have full access to mutable properties like:
 *   - `chart.data`
 *   - `chart.options`
 *   - `chart.canvas`
 *   - `chart.config`
 *   - `chart.scales`, etc.
 *
 * ---
 *
 * ### ⚠️ Notes
 * - `getChartInstance()` is no longer needed; the entire Chart instance is exposed directly.
 * - `setData()` and `setOptions()` helpers are unnecessary—just mutate `data` or `options` and call `.update()`.
 */
export interface HChartInstance extends ComponentMethods, Chart {
  /**
   * Returns the type identifier.
   * Always returns `'chart'`.
   */
  getType(): 'chart';
  /**
   * Get the current reload delay (ms) used for re-creating the chart after unmount.
   *
   * @returns {number} The delay in milliseconds.
   *
   * @example
   * const chart = hison.component.getChart('chart1');
   * const delay = chart.getLoadDelay();
   * console.log('Current delay:', delay);
   */
  getLoadDelay(): number;
  /**
   * Set the reload delay (ms) to wait before re-creating the chart after unmount.
   * Useful for adjusting the debounce period for rapid reloads.
   *
   * @param {number} ms - The delay in milliseconds to use for subsequent reloads.
   *
   * @example
   * const chart = hison.component.getChart('chart1');
   * chart.setLoadDelay(1000); // Sets delay to 1 second for reloads
   */
  setLoadDelay(ms: number): void;
}

/**
 * Runtime control methods for `HDrawer` component.
 *
 * This interface defines programmatic access to a drawer’s visibility,
 * edge position, dimensions, swipe-close gestures, overlay, scroll lock,
 * border, and animation settings. You can retrieve an instance
 * using `hison.component.getDrawer(id)`.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const drawer = hison.component.getDrawer('drawer01');
 * drawer.open();
 * drawer.setPosition('left');
 * drawer.setWidth(300, true);   // animate width change
 * drawer.setZIndex(1400);
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - Visibility (`visible`) is **only** controlled by these methods. The `visible` prop is an initial state.
 * - `scrollLock` is reference-counted across multiple drawers; closing one does not unlock if others are still open.
 * - `zIndex` applies to the wrapper; the overlay is always rendered at `zIndex - 1`.
 * - Size changes (`setWidth` / `setHeight`) can be animated when supported by the current edge position.
 */
export interface HDrawerMethods extends ComponentMethods {
  /**
   * Returns the type of the component.
   * Always `'drawer'`.
   */
  getType(): 'drawer'
  /**
   * Returns whether the drawer is currently visible.
   */
  isVisible(): boolean
  /**
   * Sets drawer visibility.
   * @param v `true` → open, `false` → close
   */
  setVisible(v: boolean): void | Promise<void>
  /**
   * Whether the menu is currently open.
   */
  isOpen(): boolean
  /**
   * Opens the drawer (with animation and scroll lock).
   */
  open(): void | Promise<void>
  /**
   * Closes the drawer (with animation and scroll unlock).
   */
  close(): void | Promise<void>
  /**
   * Toggles drawer open/close state.
   */
  toggle(): void | Promise<void>
  /**
   * Gets the current z-index of the drawer wrapper.
   */
  getZIndex(): number
  /**
   * Sets the z-index of the drawer wrapper (overlay will use `zIndex - 1`).
   */
  setZIndex(v: number): void
  /**
   * Gets the current screen edge position of the drawer.
   */
  getPosition(): 'top' | 'bottom' | 'left' | 'right'
  /**
   * Sets the drawer position to a screen edge.
   * Also updates default animations if none were provided via props.
   */
  setPosition(p: 'top' | 'bottom' | 'left' | 'right'): void
  /**
   * Gets the current width of the drawer in pixels.
   * Returns `null` if not explicitly set (auto).
   */
  getWidth(): number | null
  /**
   * Sets the drawer width in pixels.
   * @param v width in px (`null` for auto)
   * @param animate whether to animate the resize (default: `false`)
   */
  setWidth(v: number | null, animate: boolean): Promise<void> | void
  /**
   * Gets the current height of the drawer in pixels.
   * Returns `null` if not explicitly set (auto).
   */
  getHeight(): number | null
  /**
   * Sets the drawer height in pixels.
   * @param v height in px (`null` for auto)
   * @param animate whether to animate the resize (default: `false`)
   */
  setHeight(v: number | null, animate: boolean): Promise<void> | void
  /**
   * Returns whether swipe-to-close is enabled.
   */
  isSwipeCloseEnabled(): boolean
  /**
   * Enables or disables swipe-to-close gestures.
   */
  setSwipeCloseEnabled(v: boolean): void
  /**
   * Returns whether a close button is visible inside the drawer.
   */
  isCloseButtonVisible(): boolean
  /**
   * Shows or hides the close button.
   */
  setCloseButtonVisible(v: boolean): void
  /**
   * Returns whether the overlay (backdrop) is shown.
   */
  isOverlayShown(): boolean
  /**
   * Sets whether the overlay (backdrop) is shown.
   */
  setOverlayShown(v: boolean): void
  /**
   * Returns whether clicking the overlay closes the drawer.
   */
  isCloseClickOverlay(): boolean
  /**
   * Sets whether clicking the overlay closes the drawer.
   */
  setCloseClickOverlay(v: boolean): void
  /**
   * Returns whether scroll lock is enabled for this drawer.
   */
  isScrollLocked(): boolean
  /**
   * Enables or disables scroll lock.
   * If enabled while visible, locks immediately.
   * If disabled while visible, unlocks immediately.
   */
  setScrollLock(v: boolean): void
  /**
   * Returns whether border styling is enabled.
   */
  isBorder(): boolean
  /**
   * Enables or disables border styling.
   */
  setBorder(v: boolean): void
  /**
   * Gets the CSS class names for enter/leave animations.
   */
  getAnimationClasses(): { enter: string, leave: string }
  /**
   * Sets one or both CSS animation classes for drawer enter/leave.
   * Example: `{ enter: 'slide-in', leave: 'slide-out' }`
   */
  setAnimationClasses(opt: Partial<{ enter: string, leave: string }>): void
  /**
   * Forces a full component reload (rebuild internals).
   */
  reload(): void
}

/**
 * Runtime control methods for `HDropdown` component.
 *
 * This interface defines methods accessible via `hison.component.getDropdown(id)`.
 * It lets you open/close the menu, change selection/options, adjust behavior (trigger, close-on-select),
 * and tweak appearance (edit mode, text alignment) at runtime.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const dd = hison.component.getDropdown('country');
 * dd.open();
 * dd.setOptions([{ label: 'Korea', value: 'KR' }]);
 * dd.setValue('KR');
 * dd.setEditMode('readonly');
 * dd.setTextAlign('center');
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - All changes are reactive and reflected immediately.
 * - Edit modes: `editable`, `readonly`, `disable` (readonly hides the caret & removes box-shadow).
 * - `getText()` returns the label of the currently selected option.
 */
export interface HDropdownMethods extends ComponentMethods {
  /**
   * Returns the component type literal.
   */
  getType(): 'dropdown'
  /**
   * Whether the menu is currently open.
   */
  isOpen(): boolean
  /**
   * Opens the menu.
   */
  open(): void
  /**
   * Closes the menu.
   */
  close(): void
  /**
   * Toggles the menu open/closed.
   */
  toggle(): void
  /**
   * Gets the current edit mode (`editable` | `readonly` | `disable`).
   */
  getEditMode(): EditModeValue
  /**
   * Sets the edit mode.
   */
  setEditMode(v: EditMode | EditModeValue): void
  /**
   * Gets the current selected value.
   */
  getValue(): any
  /**
   * Sets the selected value (does not emit user events).
   */
  setValue(val: any): void
  /**
   * Returns the label (text) of the current selection.
   */
  getText(): string
  /**
   * Returns the current option list.
   */
  getOptions(): HDropdownOption[]
  /**
   * Replaces the option list at runtime.
   */
  setOptions(options: HDropdownOption[]): void
  /**
   * Sets how the menu opens: `'click'` or `'hover'`.
   */
  setTriggerType(trigger: DropdownTrigger): void
  /**
   * Gets the max menu height in pixels.
   */
  getMaxHeight(): number
  /**
   * Sets the max menu height in pixels.
   */
  setMaxHeight(maxHeightPx: number): void
  /**
   * Whether the menu closes automatically after selecting an item.
   */
  isCloseOnSelect(): boolean
  /**
   * Enables/disables close-on-select behavior.
   */
  setCloseOnSelect(closeOn: boolean): void
  /**
   * Returns current text alignment (`left` | `center` | `right`).
   */
  getTextAlign(): TextAlignValue
  /**
   * Sets text alignment for both the toggle and the menu.
   */
  setTextAlign(textAlign: TextAlign | TextAlignValue): void
  /** 
   * Whether animation is enabled.
   */
  getAnimate(): boolean
  /** 
   * Enables/disables animation (caret + menu).
   */
  setAnimate(v: boolean): void
  /** 
   * Returns animation duration in ms.
   */
  getDuration(): number
  /** 
   * Sets animation duration in ms.
   */
  setDuration(ms: number): void
  /** 
   * Returns CSS timing function used by transitions.
   */
  getEasing(): string
  /** 
   * Sets CSS timing function (e.g., 'ease-in-out', 'cubic-bezier(...)').
   */
  setEasing(fn: string): void
  /**
   * Gets the current `tabIndex` applied to element.
   * - `null`: no `tabindex` attribute (items not focusable).
   * - `0` or positive number: items can be focused via keyboard navigation.
   */
  getTabIndex(): number | null
  /**
   * Sets `tabIndex` for element.
   * @param v - `null` to remove, or number to make focusable.
   */
  setTabIndex(v: number | null): void
  /**
   * Gets the current z-index of the dropdwon wrapper.
   */
  getZIndex(): number
  /**
   * Sets the z-index of the dropdwon wrapper
   */
  setZIndex(v: number): void
  /**
   * Moves focus to the toggle element.
   */
  focus(): void
}

/**
 * Interface for runtime control of `<HFileset>` component.
 *
 * This interface exposes a full set of methods for dynamically controlling and querying the state
 * of an HFileset instance registered with hisonvue. All methods are available via `hison.vue.getInput(id)` or
 * on the instance exposed in the `mounted` event.
 *
 * **Typical use cases include:**
 * - Programmatically changing edit mode, file upload rules, button labels, and placeholders
 * - Updating allowed/disallowed file types, file size/count limits, and drag-and-drop settings at runtime
 * - Assigning custom file download logic (e.g., S3, access control)
 * - Replacing or reading the list of attached files (including marking deletions or restoring files)
 * - Integrating with server or parent logic to control the file set from outside the component
 *
 * :::example
 * ```ts
 * // Get runtime methods from hison.vue
 * const fileset = hison.vue.getInput('myFileset') as HFilesetMethods
 * 
 * // Change edit mode to readonly
 * fileset.setEditMode('readonly')
 * 
 * // Limit to only 2 files and only PDFs
 * fileset.setMaxFileCount(2)
 * fileset.setAllowedTypes(['.pdf'])
 * 
 * // Change add button label dynamically
 * fileset.setAddButtonText('ADD FILE')
 * 
 * // Replace all files with new ones
 * fileset.setValue([
 *   { fileName: 'newfile.pdf', fileSize: 100000, extension: 'pdf', isNew: true, file: someFileObj }
 * ])
 *
 * // Focus add button programmatically
 * fileset.focus()
 * ```
 * :::
 *
 * **Method groups:**
 * - **Edit Mode & Visibility**: Control when/how the user can add/delete files
 * - **File List**: Get/set all attached files, reflecting deletion or restoration
 * - **File Upload Options**: Allowed/disallowed types, size, count, drag-and-drop, multi-column
 * - **UI Labels & Placeholders**: Set button texts and empty message dynamically
 * - **Custom Handlers**: Assign custom download or validation error logic
 * - **State Query**: Check for modification, get attachment group ID, etc.
 *
 * All setters immediately update the internal state and UI.
 */
export interface HFilesetMethods extends ComponentMethods {
  /**
   * Returns the type of this component instance.
   * Always returns `'fileset'` for `<HFileset>`.
   */
  getType(): 'fileset'
  /**
   * Gets the current edit mode of the file set.
   * 
   * - `'editable'`: Full editing (add/delete) enabled
   * - `'readonly'`: View only, file actions hidden
   * - `'disable'`: Completely disabled, grayed out
   */
  getEditMode(): EditModeValue;
  /**
   * Sets the edit mode of the file set.
   * 
   * - `'editable'`: Allows adding/removing files
   * - `'readonly'`: Disables all file operations but keeps UI visible
   * - `'disable'`: Fully disables the UI (input, buttons)
   * 
   * @param mode - The new edit mode
   */
  setEditMode(mode: EditMode | EditModeValue): void;
  /**
   * Returns the current (visible, not deleted) file list.
   * 
   * Each file is an object conforming to `AttachedFileItem`.
   * Files marked `isDeleted: true` are excluded.
   * 
   * @returns The current list of files.
   */
  getValue(): AttachedFileItem[] | null;
  /**
   * Sets the internal file list to the provided value.
   * 
   * - The list will be displayed immediately and emitted via `update:modelValue`.
   * - Use this to reset, replace, or synchronize the files with backend data.
   * 
   * @param attachedFileItem - The new file list.
   */
  setValue(attachedFileItem: AttachedFileItem[]): void;
  /**
   * Converts the current editor content into a `DataModel` instance.
   *
   * - Returns a new `DataModel` where each property of `AttachedFileItem` (like `html`, `links`, `files`, etc.)
   *   becomes a column, and a single row represents the editor state.
   *
   * @returns A `DataModel<AttachedFileItem>` containing the editor's current data.
   */
  getDataModel(): InterfaceDataModel<AttachedFileItem> | null;
  /**
   * Populates the editor using a `DataModel` instance.
   *
   * - Extracts values from the first row of the `DataModel`, if available.
   * - Uses the values from columns like `html`, `plainText`, `links`, etc. to restore editor content.
   *
   * @param dataModel A `DataModel` whose first row maps to `AttachedFileItem` structure.
   */
  setDataModel<T extends AttachedFileItem>(dataModel: InterfaceDataModel<T>): void;
  /**
   * Loads editor content from either a `AttachedFileItem` object or a compatible `DataModel`.
   *
   * - Accepts plain `AttachedFileItem`, raw object, or `DataModel`.
   * - Automatically determines how to process the input and restores the editor accordingly.
   *
   * @param data Editor content to load, in `AttachedFileItem` or `DataModel` form.
   */
  load<T extends Record<string, any>>(data: AttachedFileItem | Record<string, any> | InterfaceDataModel<T>): void;
  /**
   * Returns the current `attId` (attachment group ID).
   * 
   * Used to group files logically, often for backend APIs.
   */
  getAttId(): string;
  /**
   * Sets the `attId` (attachment group ID).
   * 
   * - Use to associate this file set with a different group in your backend.
   * - Has no effect on UI, but is included in emitted file info.
   * 
   * @param attId - The new attachment group ID.
   */
  setAttId(attId: string): void;
  /**
   * Gets the text content currently shown on the add/upload button.
   * 
   * - Corresponds to `addButtonText` prop.
   */
  getAddButtonText(): string;
  /**
   * Sets the text shown on the add/upload button.
   * 
   * - Supports multiline via `\n` (rendered as `<br>`).
   * - If an `add-button` slot is used, this will have no effect.
   * 
   * @param addButtonText - New button text
   */
  setAddButtonText(addButtonText: string): void;
  /**
   * Gets the text content currently shown on the remove/delete button.
   * 
   * - Corresponds to `removeButtonText` prop.
   */
  getRemoveButtonText(): string;
  /**
   * Sets the text shown on the remove/delete button.
   * 
   * - Supports multiline via `\n` (rendered as `<br>`).
   * - If a `remove-button` slot is used, this will have no effect.
   * 
   * @param removeButtonText - New button text
   */
  setRemoveButtonText(removeButtonText: string): void;
  /**
   * Gets the current placeholder text (empty state message).
   * 
   * - Shown when there are no files in the file set.
   * - Corresponds to the `placeholder` prop.
   */
  getPlaceholder(): string;
  /**
   * Sets the placeholder text (empty state message).
   * 
   * - Updates UI immediately.
   * 
   * @param placeholder - New placeholder text
   */
  setPlaceholder(placeholder: string): void;
  /**
   * Returns whether drag-and-drop uploading is currently enabled.
   * 
   * - Controlled by the `enableDrop` prop.
   */
  isEnableDrop(): boolean;
  /**
   * Enables or disables drag-and-drop file uploading.
   * 
   * @param enableDrop - `true` to allow drag-and-drop, `false` to block it.
   */
  setEnableDrop(enableDrop: boolean): void;
  /**
   * Sets a custom download handler function for files.
   * 
   * - If set, this function is called when a file is downloaded (clicked).
   * - Use for custom logic, e.g. auth, S3, signed URL, access logging, etc.
   * - Overrides default file download behavior.
   * 
   * @param downloadHandler - Function called with the file to download
   */
  setDownloadHandler(downloadHandler: (file: AttachedFileItem) => void): void;
  /**
   * Returns whether the file list is currently displayed in multiple columns.
   * 
   * - Controlled by the `multiCols` prop.
   */
  isMultiCols(): boolean;
  /**
   * Enables or disables multi-column display of the file list.
   * 
   * - When enabled, files wrap into multiple rows/columns for easier viewing.
   * 
   * @param multiCols - `true` to enable, `false` to disable.
   */
  setMultiCols(multiCols: boolean): void;
  /**
   * Returns whether multiple file selection is currently allowed.
   * 
   * - Controlled by the `multiple` prop.
   * - If false, only one file can be uploaded at a time (new files replace previous).
   */
  isMultiple(): boolean;
  /**
   * Enables or disables multiple file selection.
   * 
   * - If set to `false`, adding new files replaces the existing one.
   * - If set to `true`, users can add up to `maxFileCount` files.
   * 
   * @param multiple - `true` to allow multiple, `false` for single file only.
   */
  setMultiple(multiple: boolean): void;
  /**
   * Gets the current list of allowed file types/extensions.
   * 
   * - Controlled by the `allowedTypes` prop.
   * - MIME types or extensions (e.g. `.pdf`, `image/png`).
   */
  getAllowedTypes(): string[];
  /**
   * Sets the allowed file types/extensions.
   * 
   * - Accepts an array of MIME types or file extensions.
   * - Updates the file input's accept filter and internal validation.
   * 
   * @param allowedTypes - Array of allowed types/extensions.
   */
  setAllowedTypes(allowedTypes: string[]): void;
  /**
   * Gets the current list of disallowed file types/extensions.
   * 
   * - Controlled by the `disallowedTypes` prop.
   * - MIME types or extensions (e.g. `.exe`, `application/x-msdownload`).
   */
  getDisallowedTypes(): string[];
  /**
   * Sets the disallowed file types/extensions.
   * 
   * - Accepts an array of MIME types or file extensions.
   * - Any file matching these types/extensions will be rejected.
   * 
   * @param disallowedTypes - Array of disallowed types/extensions.
   */
  setDisallowedTypes(disallowedTypes: string[]): void;
  /**
   * Gets the current maximum allowed file size (per file, bytes).
   * 
   * - Controlled by the `maxFileSize` prop.
   */
  getMaxFileSize(): number;
  /**
   * Sets the maximum allowed file size (per file, bytes).
   * 
   * - Files exceeding this size are rejected on upload.
   * 
   * @param maxFileSize - Maximum size in bytes
   */
  setMaxFileSize(maxFileSize: number): void;
  /**
   * Gets the current maximum allowed total file size (all files, bytes).
   * 
   * - Controlled by the `maxTotalFileSize` prop.
   */
  getMaxTotalFileSize(): number;
  /**
   * Sets the maximum allowed total file size (all files, bytes).
   * 
   * - The sum of all attached files (including new and existing).
   * - Files causing the total to exceed this value will be rejected.
   * 
   * @param maxTotalFileSize - Maximum combined size in bytes
   */
  setMaxTotalFileSize(maxTotalFileSize: number): void;
  /**
   * Gets the current maximum number of files that can be uploaded.
   * 
   * - Controlled by the `maxFileCount` prop.
   * - `0` means unlimited.
   */
  getMaxFileCount(): number;
  /**
   * Sets the maximum number of files that can be uploaded.
   * 
   * - When exceeded, older files are removed/replaced automatically.
   * 
   * @param maxFileCount - Maximum file count (0 for unlimited)
   */
  setMaxFileCount(maxFileCount: number): void;
  /**
   * Sets a custom callback when a file has a disallowed type/extension.
   * 
   * - Called during file selection/drag if a file fails allowed/disallowed check.
   * - Use for custom alerts, validation UI, logging, etc.
   * 
   * @param onDisallowedType - Callback with the file, allowedTypes, disallowedTypes.
   */
  setOnDisallowedType(
    onDisallowedType: (
      currentCheckFile: File,
      allowedTypes: string[] | null,
      disallowedTypes: string[] | null
    ) => void
  ): void;
  /**
   * Sets a custom callback when a file exceeds the maximum file size.
   * 
   * - Use to alert the user or log the event.
   * 
   * @param onMaxFileSizeExceeded - Callback with file, file size, and limit.
   */
  setOnMaxFileSizeExceeded(
    onMaxFileSizeExceeded: (
      currentCheckFile: File,
      currentFileSize: number,
      maxFileSizeAllowed: number
    ) => void
  ): void;
  /**
   * Sets a custom callback when the total file size exceeds the maximum allowed.
   * 
   * - Called before adding a file that would overflow the total allowed size.
   * 
   * @param onMaxTotalSizeExceeded - Callback with file, projected total, and limit.
   */
  setOnMaxTotalSizeExceeded(
    onMaxTotalSizeExceeded: (
      currentCheckFile: File,
      currentTotalFileSize: number,
      maxTotalFileSizeAllowed: number
    ) => void
  ): void;
  /**
   * Returns whether the file list has been modified since the last set/reset.
   * 
   * - Adding or removing files, or changing file info, sets this to true.
   */
  isModified(): boolean;
  /**
   * Sets the "modified" state of the file set.
   * 
   * - Use to manually reset the modified flag (e.g., after save).
   * 
   * @param modified - `true` to mark as modified, `false` to reset.
   */
  setModified(modified: boolean): void;
  /**
   * Gets the current `tabIndex` applied to element.
   * - `null`: no `tabindex` attribute (items not focusable).
   * - `0` or positive number: items can be focused via keyboard navigation.
   */
  getTabIndex(): number | null
  /**
   * Sets `tabIndex` for element.
   * @param v - `null` to remove, or number to make focusable.
   */
  setTabIndex(v: number | null): void
  /**
   * Focuses the add file button.
   * 
   * - Useful for accessibility or guiding user attention programmatically.
   */
  focus(): void;
}

/**
 * Runtime control methods for `HGap` component.
 *
 * This interface defines methods that can be accessed via `hison.component.getGap(id)`.
 * Use these methods to programmatically control spacing behavior and optional divider line rendering.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const gap = hison.component.getGap('gap01')
 *
 * // Show a horizontal divider with dashed line
 * gap.setVisible(true)
 * gap.setLine('horizontal')
 * gap.setLineStyle('dashed')
 * gap.setLineWidth(2)             // number => px
 *
 * // Theme-driven color (from hison-color-* class)
 * gap.setLineColor('')
 *
 * // Switch to vertical divider with transparent background
 * gap.setBackgroundType('transparent')
 * gap.setLine('vertical')
 *
 * // Hide again
 * gap.setVisible(false)
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - `lineColor`:
 *   - `''` (empty) → auto color from wrapper’s `hison-color-*` class or fallback muted color.
 *   - Any valid CSS color (hex, rgb, var) is accepted.
 * - `lineWidth` accepts a `number` (treated as `px`) or a CSS length string (e.g. `'0.5rem'`, `'2px'`).
 * - All changes are reactive and reflected immediately in the DOM.
 */
export interface HGapMethods extends ComponentMethods {
  /** 
   * Returns the type of the component (always `'gap'`).
   */
  getType(): 'gap'
  /** 
   * Returns whether the gap is visible.
   */
  isVisible(): boolean
  /** 
   * Sets visibility of the gap.
   */
  setVisible(visible: boolean): void
  /** 
   * Returns whether the gap shows border (box-shadow).
   */
  isBorder(): boolean
  /** 
   * Sets whether the gap shows border (box-shadow).
   */
  setBorder(border: boolean): void
  /** 
   * Gets the current background type ('filled' | 'empty' | 'transparent').
   */
  getBackgroundType(): BackgroundTypeValue
  /** 
   * Sets the background type of the gap.
   */
  setBackgroundType(type: BackgroundType | BackgroundTypeValue): void
  /** 
   * Gets the current line mode ('none' | 'horizontal' | 'vertical').
   */
  getLine(): 'none' | 'horizontal' | 'vertical'
  /** 
   * Sets the line mode ('none' | 'horizontal' | 'vertical').
   */
  setLine(line: HGapLine | HGapLineValue): void
  /** 
   * Gets the current line style ('solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset').
   */
  getLineStyle(): HGapLineStyleValue
  /** 
   * Sets the line style.
   */
  setLineStyle(style: HGapLineStyle | HGapLineStyleValue): void
  /** 
   * Gets the current line width (number in px or CSS length string).
   */
  getLineWidth(): number | string
  /** 
   * Sets the line width (number → px, or CSS length string).
   */
  setLineWidth(width: number | string): void
  /** 
   * Gets the current line color (CSS value or empty string for auto).
   */
  getLineColor(): string
  /** 
   * Sets the line color (CSS value, or '' to auto resolve from theme).
   */
  setLineColor(color?: string): void
}

/**
 * Provides various methods to manipulate and manage a Vanillagrid instance.
 *
 * - This interface includes over 200 methods for handling grid structure, data,
 *   filtering, sorting, appearance, and user interactions.
 * - A `GridMethods` instance can be retrieved using `vg.getGrid({gridId})`.
 * - It allows users to dynamically modify grid properties, update cell values,
 *   and customize the grid's behavior through predefined methods.
 *
 * ### Key Features:
 * - Manage grid headers, footers, rows, and columns.
 * - Load and retrieve data as JSON.
 * - Apply filters, sorting, and styling dynamically.
 * - Control grid visibility, locking, and resizing.
 * - Undo and redo changes within the grid.
 *
 * ### Example usage:
 * ```typescript
 * const grid = vg.getGrid('gridId');
 * grid.setHeaderText('col1', 'New Header');
 * grid.setCellValue(1, 'col1', 'Updated Value');
 * ```
 */
export interface HGridMethods extends ComponentMethods, Omit<GridMethods, 'isGridVisible' | 'setGridVisible'>{
  /**
   * Returns the type of the grid.
   */
  getType(): 'grid'
  /**
   * Extracts the current grid content as a `DataModel` instance.
   *
   * - Converts all current grid rows into a `DataModel`.
   * - Each row becomes a record in the `DataModel`.
   * - Columns are inferred automatically from the grid's structure or cell values.
   *
   * @returns A `DataModel` instance representing the current grid content.
   */
  getDataModel(): InterfaceDataModel<Record<string, any>>;
  /**
   * Loads data into the grid using a `DataModel` instance.
   *
   * - Converts the first `getRowCount()` rows of the provided `DataModel` into key-value records.
   * - These records are then inserted into the grid.
   * - Grid is cleared before new data is loaded.
   *
   * @param dataModel A `DataModel` object representing the rows to load into the grid.
   */
  setDataModel<T extends Record<string, any>>(dataModel: InterfaceDataModel<T>): void;
  /**
   * Loads data into the grid.
   *
   * - Supports three different data formats:
   *   1. **Key-Value Format**: An array of objects where each object represents a row with column-value pairs.
   *   2. **Datas Format**: A 2D array of cell objects, each containing `{ colId, value }`.
   *   3. **DataModel Format**: A `DataModel` instance whose rows are inserted into the grid.
   * - Before loading, the grid is automatically cleared.
   *
   * ### Example Usage:
   * ```ts
   * // 1. Key-Value Format
   * grid.load([
   *   { col1: 'value1-1', col2: 'value1-2' },
   *   { col1: 'value2-1', col2: 'value2-2' }
   * ]);
   *
   * // 2. Datas Format
   * grid.load([
   *   [{ colId: 'col1', value: 'value1-1' }, { colId: 'col2', value: 'value1-2' }],
   *   [{ colId: 'col1', value: 'value2-1' }, { colId: 'col2', value: 'value2-2' }]
   * ]);
   *
   * // 3. DataModel Format
   * const model = new hison.data.DataModel();
   * model.setColumns(['col1', 'col2']);
   * model.addRow({ col1: 'value1-1', col2: 'value1-2' });
   * grid.load(model);
   * ```
   *
   * @param keyValueOrDatas The data to load into the grid.
   * @returns `true` if the data was successfully loaded.
   */
  load<T extends Record<string, any>>(keyValueOrDatas: Record<string, any> | Record<string, any>[] | InterfaceDataModel<T>): boolean;
}

/**
 * Interface for runtime control of `<HImagebox>` component.
 *
 * This interface provides a complete set of methods for dynamically controlling and querying the state
 * of an HImagebox instance in hisonvue. All methods are accessible via `hison.vue.getInput(id)` or
 * on the instance emitted via the `mounted` event.
 *
 * **Typical use cases include:**
 * - Changing edit mode, button text, allowed file types, or drag-and-drop support at runtime
 * - Setting the image programmatically (e.g., for editing or resetting forms)
 * - Integrating with backend logic to preload, update, or clear the image state
 * - Customizing validation or error handling logic for file type or file size checks
 * - Dynamically updating UI text such as placeholder or button labels in response to user actions
 * - Managing attachment group IDs for file association with backend records
 *
 * :::example
 * ```ts
 * // Get runtime methods from hison.vue
 * const imagebox = hison.vue.getInput('avatarBox') as HImageboxMethods
 *
 * // Make the component readonly
 * imagebox.setEditMode('readonly')
 *
 * // Set allowed file types to PNG only
 * imagebox.setAllowedTypes(['image/png'])
 *
 * // Change add button label at runtime
 * imagebox.setAddButtonText('Upload Photo')
 *
 * // Replace the image with a new uploaded file
 * imagebox.setValue({
 *   fileName: 'profile.png',
 *   file: someFileObj,
 *   fileSize: someFileObj.size,
 *   extension: 'png',
 *   isNew: true
 * })
 *
 * // Attach a custom handler for max file size exceeded
 * imagebox.setOnMaxFileSizeExceeded((file, size, max) => {
 *   alert(`File too large! Max allowed: ${max} bytes`)
 * })
 *
 * // Programmatically focus the add button
 * imagebox.focus()
 * ```
 * :::
 *
 * **Method groups:**
 * - **Edit Mode & Visibility**: Control user interaction and UI state
 * - **Image Value**: Get or set the attached image file (including clearing or preloading)
 * - **File Upload Options**: Allowed/disallowed types, file size, drag-and-drop, validation handlers
 * - **UI Labels & Placeholders**: Set button labels or placeholder dynamically
 * - **Attachment Grouping**: Manage `attId` for backend association
 * - **State Query**: Check if the image box has been modified
 *
 * All setters update the internal state and UI instantly.
 */
export interface HImageboxMethods extends ComponentMethods {
  /**
   * Returns the type of this component instance.
   * Always returns `'imagebox'` for `<HImagebox>`.
   */
  getType(): 'imagebox'
  /**
   * Gets the current edit mode of the image box.
   * 
   * - `'editable'`: Full editing (add/delete) enabled
   * - `'readonly'`: View only, image file actions hidden
   * - `'disable'`: Completely disabled, grayed out
   */
  getEditMode(): EditModeValue;
  /**
   * Sets the edit mode of the image box.
   * 
   * - `'editable'`: Allows adding/removing image file
   * - `'readonly'`: Disables all image file operations but keeps UI visible
   * - `'disable'`: Fully disables the UI (input, buttons)
   * 
   * @param mode - The new edit mode
   */
  setEditMode(mode: EditMode | EditModeValue): void;
  /**
   * Returns the current (visible, not deleted) image file.
   * 
   * file is an object conforming to `AttachedFileItem`.
   * Files marked `isDeleted: true` are excluded.
   * 
   * @returns The current list of image file.
   */
  getValue(): AttachedFileItem | null;
  /**
   * Sets the internal image file to the provided value.
   * 
   * - The list will be displayed immediately and emitted via `update:modelValue`.
   * - Use this to reset, replace, or synchronize the image file with backend data.
   * 
   * @param attachedFileItem - The new image file.
   */
  setValue(attachedFileItem: AttachedFileItem): void;
  /**
   * Converts the current editor content into a `DataModel` instance.
   *
   * - Returns a new `DataModel` where each property of `AttachedFileItem`
   *   becomes a column, and a single row represents the editor state.
   *
   * @returns A `DataModel<AttachedFileItem>` containing the editor's current data.
   */
  getDataModel(): InterfaceDataModel<AttachedFileItem> | null;
  /**
   * Populates the editor using a `DataModel` instance.
   *
   * - Extracts values from the first row of the `DataModel`, if available.
   * - Uses the values from columns like `html`, `plainText`, `links`, etc. to restore editor content.
   *
   * @param dataModel A `DataModel` whose first row maps to `AttachedFileItem` structure.
   */
  setDataModel<T extends AttachedFileItem>(dataModel: InterfaceDataModel<T>): void;
  /**
   * Loads editor content from either a `AttachedFileItem` object or a compatible `DataModel`.
   *
   * - Accepts plain `AttachedFileItem`, raw object, or `DataModel`.
   * - Automatically determines how to process the input and restores the editor accordingly.
   *
   * @param data Editor content to load, in `AttachedFileItem` or `DataModel` form.
   */
  load<T extends Record<string, any>>(data: AttachedFileItem | Record<string, any> | InterfaceDataModel<T>): void;
  /**
   * Returns the current `attId` (attachment group ID).
   * 
   * Used to group image file logically, often for backend APIs.
   */
  getAttId(): string;
  /**
   * Sets the `attId` (attachment group ID).
   * 
   * - Use to associate this image box with a different group in your backend.
   * - Has no effect on UI, but is included in emitted file info.
   * 
   * @param attId - The new attachment group ID.
   */
  setAttId(attId: string): void;
  /**
   * Gets the text content currently shown on the add/upload button.
   * 
   * - Corresponds to `addButtonText` prop.
   */
  getAddButtonText(): string;
  /**
   * Sets the text shown on the add/upload button.
   * 
   * - Supports multiline via `\n` (rendered as `<br>`).
   * - If an `add-button` slot is used, this will have no effect.
   * 
   * @param addButtonText - New button text
   */
  setAddButtonText(addButtonText: string): void;
  /**
   * Gets the text content currently shown on the remove/delete button.
   * 
   * - Corresponds to `removeButtonText` prop.
   */
  getRemoveButtonText(): string;
  /**
   * Sets the text shown on the remove/delete button.
   * 
   * - Supports multiline via `\n` (rendered as `<br>`).
   * - If a `remove-button` slot is used, this will have no effect.
   * 
   * @param removeButtonText - New button text
   */
  setRemoveButtonText(removeButtonText: string): void;
  /**
   * Gets the current placeholder text (empty state message).
   * 
   * - Shown when there is no image in the image box.
   * - Corresponds to the `placeholder` prop.
   */
  getPlaceholder(): string;
  /**
   * Sets the placeholder text (empty state message).
   * 
   * - Updates UI immediately.
   * 
   * @param placeholder - New placeholder text
   */
  setPlaceholder(placeholder: string): void;
  /**
   * Returns whether drag-and-drop uploading is currently enabled.
   * 
   * - Controlled by the `enableDrop` prop.
   */
  isEnableDrop(): boolean;
  /**
   * Enables or disables drag-and-drop image file uploading.
   * 
   * @param enableDrop - `true` to allow drag-and-drop, `false` to block it.
   */
  setEnableDrop(enableDrop: boolean): void;
  /**
   * Gets the current list of allowed image file types/extensions.
   * 
   * - Controlled by the `allowedTypes` prop.
   * - MIME types or extensions (e.g. `.pdf`, `image/png`).
   */
  getAllowedTypes(): string[];
  /**
   * Sets the allowed file types/extensions.
   * 
   * - Accepts an array of MIME types or file extensions.
   * - Updates the file input's accept filter and internal validation.
   * 
   * @param allowedTypes - Array of allowed types/extensions.
   */
  setAllowedTypes(allowedTypes: string[]): void;
  /**
   * Gets the current list of disallowed file types/extensions.
   * 
   * - Controlled by the `disallowedTypes` prop.
   * - MIME types or extensions (e.g. `.exe`, `application/x-msdownload`).
   */
  getDisallowedTypes(): string[];
  /**
   * Sets the disallowed file types/extensions.
   * 
   * - Accepts an array of MIME types or file extensions.
   * - Any file matching these types/extensions will be rejected.
   * 
   * @param disallowedTypes - Array of disallowed types/extensions.
   */
  setDisallowedTypes(disallowedTypes: string[]): void;
  /**
   * Gets the current maximum allowed file size (per file, bytes).
   * 
   * - Controlled by the `maxFileSize` prop.
   */
  getMaxFileSize(): number;
  /**
   * Sets the maximum allowed file size (per file, bytes).
   * 
   * - Files exceeding this size are rejected on upload.
   * 
   * @param maxFileSize - Maximum size in bytes
   */
  setMaxFileSize(maxFileSize: number): void;
  /**
   * Returns whether the current element displays a border.
   */
  isBorder(): boolean
  /**
   * ESets whether the current element displays a border.
   * 
   * @param border - `true` to display border, `false` to none display border
   */
  setBorder(border: boolean): void
  /**
   * Sets a custom callback when a file has a disallowed type/extension.
   * 
   * - Called during file selection/drag if a file fails allowed/disallowed check.
   * - Use for custom alerts, validation UI, logging, etc.
   * 
   * @param onDisallowedType - Callback with the file, allowedTypes, disallowedTypes.
   */
  setOnDisallowedType(
    onDisallowedType: (
      currentCheckFile: File,
      allowedTypes: string[] | null,
      disallowedTypes: string[] | null
    ) => void
  ): void;
  /**
   * Sets a custom callback when a file exceeds the maximum file size.
   * 
   * - Use to alert the user or log the event.
   * 
   * @param onMaxFileSizeExceeded - Callback with file, file size, and limit.
   */
  setOnMaxFileSizeExceeded(
    onMaxFileSizeExceeded: (
      currentCheckFile: File,
      currentFileSize: number,
      maxFileSizeAllowed: number
    ) => void
  ): void;
  /**
   * Returns whether the file list has been modified since the last set/reset.
   * 
   * - Adding or removing files, or changing file info, sets this to true.
   */
  isModified(): boolean;
  /**
   * Sets the "modified" state of the image box.
   * 
   * - Use to manually reset the modified flag (e.g., after save).
   * 
   * @param modified - `true` to mark as modified, `false` to reset.
   */
  setModified(modified: boolean): void;
  /**
   * Gets the current `tabIndex` applied to element.
   * - `null`: no `tabindex` attribute (items not focusable).
   * - `0` or positive number: items can be focused via keyboard navigation.
   */
  getTabIndex(): number | null
  /**
   * Sets `tabIndex` for element.
   * @param v - `null` to remove, or number to make focusable.
   */
  setTabIndex(v: number | null): void
  /**
   * Focuses the add image file button.
   * 
   * - Useful for accessibility or guiding user attention programmatically.
   */
  focus(): void;
}

/**
 * Runtime control methods for `HInput` component.
 *
 * This interface defines methods accessible via `hison.component.getInput(id)`.
 * It enables full runtime control over the input’s value, style, state, and formatting.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const input = hison.component.getInput('input01');
 * input.setValue('123456');
 * input.setVisible(true);
 * input.setFormat('###-###');
 * input.setEditMode('readonly');
 * input.setFontUnderline(true);
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - All changes are reactive and immediately reflected in the DOM.
 * - Formatting is internally handled via `hison.utils` functions.
 * - Input can operate in `editable`, `readonly`, or `disable` mode.
 */
export interface HInputMethods extends ComponentMethods {
  /**
   * Returns the type of the input.
   */
  getType(): 'input'
  /**
   * Gets the current HTML `name` of this input.
   * - For radio inputs, this is the **group key** used by `HInputGroup` to aggregate
   *   selection as `{ [name]: selectedRadioId | null }`.
   * - For non-radio inputs, it’s just the underlying HTML attribute.
   */
  getName(): string;
  /**
   * Sets the HTML `name` of this input.
   * - Safe to call at runtime.
   * - **Radio inputs:** re-registers group membership with `HInputGroup`
   *   (moves this radio from the old group to the new one). The current `checked`
   *   state is preserved and the group’s `{ [name]: id | null }` mapping updates.
   * - **Non-radio inputs:** only updates the HTML attribute; no grouping behavior.
   * - Does **not** toggle the radio’s checked state by itself.
   */
  setName(name: string): void;
  /**
   * Gets the data extraction key for `HInputGroup`.
   * - Used as the key when `HInputGroup` extracts data.
   * - If empty, `HInput` falls back to `id`.
   */
  getDataKey(): string
  /**
   * Sets the data extraction key for `HInputGroup`.
   * - If empty, it falls back to `id`.
   * - This does not change the runtime identifier (`id`).
   */
  setDataKey(dataKey: string): void
  /**
   * Returns the formatted display text shown in the span layer.
   * - Applies `format`, `nullText`, and masking logic based on `type`.
   */
  getText(): string;
  /**
   * Gets the current raw input value (after internal processing).
   * - For example, digit-only inputs are stripped via `getDigitsOnly`.
   */
  getValue(): any;
  /**
   * Sets the current input value.
   * - Automatically re-applies formatting and validation.
   */
  setValue(value: any): void;
  /**
   * Gets the current input type.
   * - Matches the `InputType` enum (e.g., `'text'`, `'date'`, `'number'`, etc.)
   */
  getInputType(): InputTypeValue;
  /**
   * Sets the input type.
   * - Automatically adjusts formatting/rendering logic.
   */
  setInputType(type: InputType | InputTypeValue): void;
  /**
   * Gets the format string used to format the value.
   * - Affects `'number'`, `'mask'`, `'date'`, `'month'` types.
   */
  getFormat(): string;
  /**
   * Sets the input format.
   * - Uses `hison.utils.getDateWithFormat`, `getNumberFormat`, etc.
   */
  setFormat(format: string): void;
  /**
   * Gets the tooltip (title attribute) of the input.
   */
  getTitle(): string;
  /**
   * Sets the tooltip (title attribute) of the input.
   * - Appears on hover.
   */
  setTitle(title: string): void;
  /**
   * Gets the current `nullText` string used when value is empty.
   */
  getNullText(): string;
  /**
   * Sets the `nullText` to display when the value is empty or null.
   */
  setNullText(nullText: string): void;
  /**
   * Gets the current edit mode.
   * - Possible values: `'editable'`, `'readonly'`, `'disable'`
   */
  getEditMode(): EditModeValue;
  /**
   * Sets the edit mode of the input.
   * - `'readonly'` and `'disable'` both prevent editing but differ in style.
   */
  setEditMode(mode: EditMode | EditModeValue): void;
  /**
   * Gets the maximum allowed numeric value (if applicable).
   * - Only applies when `type === 'number'`
   */
  getMaxNumber(): number | null;
  /**
   * Sets the maximum numeric value.
   * - Enforced on input and formatting.
   */
  setMaxNumber(maxNumber: number): void;
  /**
   * Gets the minimum allowed numeric value.
   */
  getMinNumber(): number | null;
  /**
   * Sets the minimum numeric value.
   * - Enforced during input.
   */
  setMinNumber(minNumber: number): void;
  /**
   * Gets the rounding precision for numeric values.
   * - Applies only to `type === 'number'`
   */
  getRoundNumber(): number | null;
  /**
   * Sets the rounding precision.
   * - Accepts positive/negative integers or `0`.
   */
  setRoundNumber(roundNumber: number): void;
  /**
   * Gets the current maximum character length allowed.
   * - Input is truncated if exceeded.
   */
  getMaxLength(): number | null;
  /**
   * Sets the maximum allowed character length.
   */
  setMaxLength(maxLength: number): void;
  /**
   * Gets the maximum allowed byte size.
   * - Uses UTF-8 encoding logic via `hison.utils.getCutByteLength()`.
   */
  getMaxByte(): number | null;
  /**
   * Sets the maximum allowed byte size.
   * - Truncates input based on encoded byte length.
   */
  setMaxByte(maxByte: number): void;
  /**
   * Gets whether the input is currently required.
   * - If `true`, the input will show a visual required style.
   */
  getRequired(): boolean;
  /**
   * Sets the required state of the input.
   */
  setRequired(required: boolean): void;
  /**
   * Gets the current placeholder text.
   */
  getPlaceholder(): string;
  /**
   * Sets the placeholder text.
   * - Maps to the native `placeholder` attribute.
   */
  setPlaceholder(placeholder: string): void;
  /**
   * Gets the current placeholder text color.
   * - Returns semantic token (e.g. 'primary') or raw CSS color string.
   */
  getPlaceholderColor(): string;
  /**
   * Sets the placeholder text color.
   * - Accepts semantic tokens: 'primary' | 'muted' | 'info' | 'success' | 'danger' | 'warning'
   *   or any valid CSS color string (e.g. '#fff', '#ffffff', 'rgb(...)', 'rgba(...)').
   */
  setPlaceholderColor(color: string): void;
  /**
   * Returns whether bold font is applied to the span text.
   */
  isFontBold(): boolean;
  /**
   * Applies or removes bold style from the span text.
   */
  setFontBold(bold: boolean): void;
  /**
   * Returns whether italic font is applied to the span text.
   */
  isFontItalic(): boolean;
  /**
   * Applies or removes italic style from the span text.
   */
  setFontItalic(italic: boolean): void;
  /**
   * Returns whether strikethrough is applied to the span text.
   */
  isFontThruline(): boolean;
  /**
   * Applies or removes strikethrough style from the span text.
   */
  setFontThruline(thruline: boolean): void;
  /**
   * Returns whether underline is applied to the span text.
   */
  isFontUnderline(): boolean;
  /**
   * Applies or removes underline style from the span text.
   */
  setFontUnderline(underline: boolean): void;
  /**
   * Returns current text alignment ('left' | 'center' | 'right').
   */
  getTextAlign(): TextAlignValue
  /**
   * Sets text alignment for the input.
   */
  setTextAlign(textAlign: TextAlign | TextAlignValue): void
  /**
   * Returns whether the label shows border (box-shadow).
   */
  isBorder(): boolean
  /**
   * Sets whether border (box-shadow) is shown.
   * @param border - `true` to show, `false` to hide.
   */
  setBorder(border: boolean): void
  /**
   * Returns whether the input value has been modified since initial load or last reset.
   * - Modification is only tracked via user interactions (`onInput`, `onBlur`, `onChange`).
   * - This is used by parent components like `HInputGroup` to determine group-level state.
   */
  isModified(): boolean;
  /**
   * Sets the modified state of the input manually.
   * - Typically used by container components (e.g., `HInputGroup`) to reset modification tracking.
   * @param modified A boolean indicating whether the input should be marked as modified.
   */
  setModified(modified: boolean): void;
  /**
   * Returns the current toggle style of the input (`checkbox` or `radio`).
   * @returns `'default'` for standard style, or `'switch'` for switch-type toggle.
   */
  getToggleStyle(): 'default' | 'switch'
  /**
   * Sets the toggle style for the input (`checkbox` or `radio`).
   * @param style - `'default'` for standard style, or `'switch'` for switch-type toggle.
   */
  setToggleStyle(style: 'default' | 'switch'): void
  /**
   * Gets the current `tabIndex` applied to element.
   * - `null`: no `tabindex` attribute (items not focusable).
   * - `0` or positive number: items can be focused via keyboard navigation.
   */
  getTabIndex(): number | null
  /**
   * Sets `tabIndex` for element.
   * @param v - `null` to remove, or number to make focusable.
   */
  setTabIndex(v: number | null): void
  /**
   * Focus on the input.
   */
  focus(): void;
}

/**
 * Runtime control methods for `HInputGroup` component.
 *
 * This interface defines the available methods on `HInputGroup`,
 * accessible via `hison.component.getInputGroup(id)`, to programmatically control
 * input group behaviors, state tracking, and data retrieval.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const group = hison.component.getInputGroup('inputGroup1');
 * group.load({ userid: 'hison', email: 'a@b.com' });
 * group.setStatus('U');
 * if (group.isModified()) {
 *   const updated = group.getDataWrapper();
 *   saveToServer(updated);
 * }
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - `HInputGroup` tracks internal status (`R`, `C`, `U`, `D`) to reflect data lifecycle.
 * - Modification is automatically tracked when any child input emits a user-driven change.
 * - Supports runtime edit mode toggle and required-field validation.
 */
export interface HInputGroupMethods extends Omit<ComponentMethods, 'isVisible' | 'setVisible'> {
  /**
   * Returns the type identifier for the component.
   * Always returns `'inputGroup'`.
   */
  getType(): 'inputGroup';
  /**
   * Clears all values inside the group’s child inputs.
   * 
   * @param autoSetStatus If `true`, resets status to `'C'` (created) and clears modification state.
   */
  clear(autoSetStatus?: boolean): void;
  /**
   * Retrieves the current input values as a `DataModel` instance.
   * 
   * @returns A `DataModel` object representing the group data as a table (1 row).
   */
  getDataModel<T extends Record<string, any>>(): InterfaceDataModel<T>;
  /**
   * Applies a `DataModel` instance to the input group.
   * 
   * This will populate each child input using the first row of the provided `DataModel`.
   * Keys in the row must match input `id`s within the group.
   * 
   * ---
   * 
   * ### ⚠️ Notes
   * - Only the **first row** of the `DataModel` is used.
   * - If a key is not registered as an input `id`, its value is ignored.
   * - Automatically sets `status` to `'R'` unless suppressed using `load(..., false)`
   *
   * @template T - The shape of the row object in the `DataModel`.
   * @param dataModel A `DataModel` instance containing one or more rows.
   */
  setDataModel<T extends Record<string, any>>(dataModel: InterfaceDataModel<T>): void;
  /**
   * Retrieves the current input values as a plain JavaScript object.
   * 
   * @returns An object with keys matching input IDs and values as their current values.
   */
  getDataObject(): Record<string, any>;
  /**
   * Populates the input group with values from a plain JavaScript object.
   * 
   * This is equivalent to assigning values directly to each input.
   * Keys in the object must match input `id`s in the group.
   * 
   * ---
   * 
   * ### ✅ Example
   * ```ts
   * inputGroup.setDataObject({
   *   userId: 'hison',
   *   email: 'a@b.com',
   *   age: 30,
   * });
   * ```
   * 
   * @param dataObject An object with keys matching input IDs and values to apply.
   */
  setDataObject(dataObject: Record<string, any>): void;
  /**
   * Loads data into the group’s inputs.
   * 
   * Supports `Record<string, any>`, `DataModel`, or `DataWrapper` as source.
   *
   * @param data The data source to apply to the group inputs.
   */
  load<T extends Record<string, any>>(data: Record<string, any> | InterfaceDataModel<T>): void;
  /**
   * Returns the current status of the input group.
   *
   * - `R`: Read
   * - `C`: Created
   * - `U`: Updated
   * - `D`: Deleted
   */
  getStatus(): DataStatusValue;
  /**
   * Sets the status of the input group.
   *
   * Used to manually change the internal data lifecycle state.
   * 
   * @param status A valid `DataStatus` value (`R`, `C`, `U`, `D`).
   */
  setStatus(status: DataStatus | DataStatusValue): void;
  /**
   * Returns whether any input inside the group has been modified by user interaction.
   * 
   * @returns `true` if at least one input is marked as modified.
   */
  isModified(): boolean;
  /**
   * Resets the modification status of all inputs in the group.
   * 
   * Typically called after saving or loading new data.
   */
  initModified(): void;
  /**
   * Validates required fields in the group.
   * 
   * Checks all child `HInput` and `HNote` components with `required=true`.
   *
   * @returns The first invalid component’s method instance, or `null` if all pass.
   */
  checkRequired(): HInputMethods | null;
  /**
   * Gets the current edit mode of the group.
   *
   * Possible values:
   * - `'editable'`: Inputs are editable
   * - `'readonly'`: Inputs are readonly (visually different)
   * - `'disable'`: Inputs are disabled (fully blocked)
   */
  getEditMode(): EditModeValue;
  /**
   * Sets the edit mode for all inputs in the group.
   *
   * @param mode One of: `'editable'`, `'readonly'`, `'disable'`
   */
  setEditMode(mode: EditMode | EditModeValue): void;
  /**
   * Focus on the first input that is editable, or a specific input if `inputId` is provided.
   *
   * - If `inputId` is specified, it directly focuses on the corresponding input component within the group (if found).
   * - If `inputId` is omitted, the method will iterate over all registered input IDs in alphabetical order
   *   and focus on the first one whose edit mode is `'editable'`.
   * - The sorting ensures consistent focus behavior regardless of DOM render timing or Vue's mount order.
   *
   * @param inputId - Optional ID of the specific input to focus. If omitted, the first editable input is focused.
   */
  focus(inputId?: string): void;
}

/**
 * Runtime control methods for `HLabel` component.
 *
 * This interface defines methods that can be accessed via `hison.component.getLabel(id)`.
 * Use these methods to manipulate label state programmatically at runtime.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const lb = hison.component.getLabel('lb1');
 * lb.setVisible(true);
 * lb.setTitle('Go to naver');
 * lb.setHref('https://www.naver.com/');
 * lb.setText('Open Naver'); // works when the label doesn't render an element-slot
 * lb.mergeAnchorAttrs({ target: '_blank' });
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - `setText` / `getText` are effective when the label **does not render an element-slot**:
 *   - If the default slot is **text-only**, the text is absorbed into internal state ➜ controllable by `getText/setText`.
 *   - If the default slot contains **any element vnode**, the slot is rendered as-is ➜ `getText()` returns `''` and `setText()` has no effect.
 * - When `href` is a non-empty string, the label renders as an `<a>` and button-like CSS events are attached to the root.
 * - All changes are reactive and reflected immediately in the DOM.
 */
export interface HLabelMethods extends ComponentMethods {
  /**
   * Returns the type of the component.
   */
  getType(): 'label'
  /**
   * Returns whether the label is visible.
   * - `true`: rendered normally.
   * - `false`: hidden via `hison-display-none` on wrapper.
   */
  isVisible(): boolean
  /**
   * Sets label visibility.
   * @param visible - `true` to show, `false` to hide.
   */
  setVisible(visible: boolean): void
  /**
   * Gets the current tooltip (title) text shown on hover.
   */
  getTitle(): string
  /**
   * Sets the tooltip (title) text shown on hover.
   */
  setTitle(title: string): void
  /**
   * Gets the label text when controllable:
   * - Returns `''` if the default slot renders **any element vnode**.
   * - Otherwise returns the internally managed text (including text-only slot absorption).
   */
  getText(): string
  /**
   * Sets the label text when controllable:
   * - No effect if the default slot renders **any element vnode**.
   * - Updates internal reactive text which is rendered either inside `<a>` (when `href` exists) or `<span>`.
   */
  setText(text: string): void
  /**
   * Gets the current `href`.
   * - Empty string means "no link" (label renders as `<span>` or `<div>` depending on slot).
   */
  getHref(): string
  /**
   * Sets the `href`.
   * - `null` or empty string disables link mode (label becomes non-anchor).
   * - Non-empty string enables link mode (label renders as `<a>`).
   */
  setHref(href?: string | null): void
  /**
   * Reads the full `anchorAttrs` (shallow-copied) object used for `<a v-bind="...">`.
   * - Typical keys: `target`, `rel`, `download`, `referrerPolicy`, `hreflang`, etc.
   */
  getAnchorAttrs(): Record<string, unknown>
  /**
   * Replaces the entire `anchorAttrs` object.
   * - Use to reset all attributes at once.
   */
  replaceAnchorAttrs(next: Record<string, unknown>): void
  /**
   * Shallow-merges given patch into current `anchorAttrs`.
   * - Use to update a subset of attributes without losing others.
   */
  mergeAnchorAttrs(patch: Record<string, unknown>): void
  /**
   * Sets a single anchor attribute by key.
   * - Example: `setAnchorAttr('target', '_blank')`
   */
  setAnchorAttr(key: string, val: unknown): void
  /**
   * Removes a single anchor attribute by key.
   * - Example: `removeAnchorAttr('download')`
   */
  removeAnchorAttr(key: string): void
  /**
   * Returns whether bold style is applied.
   */
  isFontBold(): boolean
  /**
   * Applies or removes bold style.
   */
  setFontBold(bold: boolean): void
  /**
   * Returns whether italic style is applied.
   */
  isFontItalic(): boolean
  /**
   * Applies or removes italic style.
   */
  setFontItalic(italic: boolean): void
  /**
   * Returns whether strikethrough is applied.
   */
  isFontThruline(): boolean
  /**
   * Applies or removes strikethrough style.
   */
  setFontThruline(thruline: boolean): void
  /**
   * Returns whether underline is applied.
   */
  isFontUnderline(): boolean
  /**
   * Applies or removes underline style.
   */
  setFontUnderline(underline: boolean): void
  /**
   * Gets current text alignment ('left' | 'center' | 'right').
   */
  getTextAlign(): TextAlignValue
  /**
   * Sets text alignment.
   */
  setTextAlign(textAlign: TextAlign | TextAlignValue): void
  /**
   * Returns whether the label shows border (box-shadow).
   */
  isBorder(): boolean
  /**
   * Sets whether border (box-shadow) is shown.
   * @param border - `true` to show, `false` to hide.
   */
  setBorder(border: boolean): void
  /**
   * Gets current background type of the label.
   * - One of 'filled' | 'empty' | 'transparent'.
   */
  getBackgroundType(): BackgroundTypeValue
  /**
   * Sets background type of the label.
   * - Accepts 'filled' | 'empty' | 'transparent'.
   */
  setBackgroundType(type: BackgroundType | BackgroundTypeValue): void
  /**
   * Gets the current toggle target id.
   * - Returns the id of the `HInput` (checkbox/radio) linked to this label, or `null` if none.
   */
  getToggleTarget(): string | null
  /**
   * Sets or changes the toggle target id.
   * - When assigned, clicking the label (or pressing Enter/Space) will toggle the specified `HInput`.
   * - Accepts `null` to remove toggle linkage.
   */
  setToggleTarget(id: string | null): void
  /**
   * Returns whether translation is currently enabled.
   * - When `false`, the label has `translate="no"` and `.notranslate` class.
   */
  isTranslate(): boolean
  /**
   * Enables or disables browser translation prevention.
   * - `true`  → nothing (translation allowed)
   * - `false` → adds `translate="no"` + `.notranslate`
   */
  setTranslate(translate: boolean): void
  /**
   * Gets the current `tabIndex` applied to element.
   * - `null`: no `tabindex` attribute (items not focusable).
   * - `0` or positive number: items can be focused via keyboard navigation.
   */
  getTabIndex(): number | null
  /**
   * Sets `tabIndex` for element.
   * @param v - `null` to remove, or number to make focusable.
   */
  setTabIndex(v: number | null): void
  /**
   * Focuses the label when applicable.
   * - If the label renders as `<a>`, focus moves to the anchor element.
   * - Otherwise (non-anchor), no-op.
   */
  focus(): void
}

/**
 * Runtime control methods for `HLayout` component.
 *
 * This interface defines programmatic access to a layout's visibility,
 * background, border, and layout styling. You can retrieve an instance
 * using `hison.component.getLayout(id)`.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const layout = hison.component.getLayout('layout01');
 * layout.setVisible(true);
 * layout.setBackColor('primary');
 * layout.setBackImageSrc('/assets/bg.jpg');
 * layout.setHeight('300px');
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - All methods are reactive and immediately affect the DOM.
 * - Background-related methods directly modify the `style` attribute of the layout.
 */
export interface HLayoutMethods extends ComponentMethods {
  /**
   * Returns the type of the layout.
   */
  getType(): 'layout'
  /**
   * Gets the current background image URL (`background-image`).
   */
  getBackImageSrc(): string;
  /**
   * Sets the background image URL.
   * Applies to `background-image` via `url(...)`.
   */
  setBackImageSrc(src: string): void;
  /**
   * Gets the background repeat or scaling mode.
   * Corresponds to `background-repeat` or `background-size`.
   */
  getBackImageRepeat(): string | BackImageAlignValue;
  /**
   * Sets the background repeat or scale style.
   * Examples: `'no-repeat'`, `'repeat'`, `'cover'`, `'contain'`
   */
  setBackImageRepeat(cssText: string | BackImageAlign | BackImageAlignValue): void;
  /**
   * Gets the background image width setting (`background-size`).
   * Examples: `'100%'`, `'300px'`
   */
  getBackImageWidth(): string;
  /**
   * Sets the background image width (`background-size`).
   */
  setBackImageWidth(cssText: string): void;
  /**
   * Gets the horizontal alignment of the background image.
   * Values: `'left'`, `'center'`, `'right'`
   */
  getBackImageAlign(): string | BackImageAlignValue;
  /**
   * Sets the horizontal alignment of the background image.
   */
  setBackImageAlign(cssText: BackImageAlign | BackImageAlignValue): void;
  /**
   * Gets the vertical alignment of the background image.
   * Values: `'top'`, `'center'`, `'bottom'`
   */
  getBackImageVerticalAlign(): string | BackImageVerticalAlignValue;
  /**
   * Sets the vertical alignment of the background image.
   */
  setBackImageVerticalAlign(cssText: BackImageVerticalAlign | BackImageVerticalAlignValue): void;
  /**
   * Gets the background color of the layout.
   * May be a hex color, rgba string, or keyword (e.g. `'primary'`).
   */
  getBackColor(): string;
  /**
   * Sets the background color.
   * Accepts hex, rgba, or `hison` keyword values (`'primary'`, `'danger'`, etc.).
   */
  setBackColor(cssText: string): void;
  /**
   * Returns whether the label shows border (box-shadow).
   */
  isBorder(): boolean
  /**
   * Sets whether border (box-shadow) is shown.
   * @param border - `true` to show, `false` to hide.
   */
  setBorder(border: boolean): void
  /**
   * Gets the current height of the layout container.
   * Examples: `'100px'`, `'50%'`, `'auto'`, `'100vh'`
   */
  getHeight(): string;
  /**
   * Sets the height of the layout container.
   */
  setHeight(cssText: string): void;
}

/**
 * Runtime control methods for `HList` component.
 *
 * This interface defines methods that can be accessed via `hison.component.getList(id)`.
 * Use these methods to manipulate list state, appearance, and items programmatically at runtime.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const list = hison.component.getList('list1');
 * list.setVisible(true);
 * list.setListType('ol');
 * list.setShowMarker(true);
 * list.setBulletChar('★');
 * list.setTextList(['Alpha', 'Beta', 'Gamma']);
 * list.setTabIndex(0); // make items focusable
 * list.focus(); // focuses the first item
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - **Slots vs textList**:
 *   - If the default slot contains element vnodes, items render directly from the slot ➜ `getTextList/setTextList` do not affect them.
 *   - If slot is absent or text-only, items are driven by `textList`.
 * - **Keyboard navigation**:
 *   - `tabIndex` applies to all `<li>` items. When set (e.g., `0`), items become focusable and respond to keyboard `Enter` / `Space` as click.
 * - **Event model**:
 *   - When `addEvent = true`, items attach textbox-like CSS states and emit `click/mousedown/mouseup/mouseover/mouseout`.
 *   - Events are `.stop`-scoped internally to avoid propagating into consumer code unexpectedly.
 * - All changes are reactive and reflected immediately in the DOM.
 */
export interface HListMethods extends ComponentMethods {
  /**
   * Returns the type of the component.
   */
  getType(): 'list'
  /**
   * Returns whether the list is visible.
   * - `true`: rendered normally.
   * - `false`: hidden via `hison-display-none` on wrapper.
   */
  isVisible(): boolean
  /**
   * Sets list visibility.
   * @param visible - `true` to show, `false` to hide.
   */
  setVisible(visible: boolean): void
  /**
   * Gets the current list tag type.
   * - `'ul'` → unordered list.
   * - `'ol'` → ordered list.
   */
  getListType(): 'ul' | 'ol'
  /**
   * Sets the list tag type.
   * - Switches rendering between `<ul>` and `<ol>`.
   */
  setListType(type: 'ul' | 'ol'): void
  /**
   * Returns whether markers are shown.
   * - `true`: show bullet or number depending on listType.
   * - `false`: hide all markers.
   */
  isShowMarker(): boolean
  /**
   * Toggles marker visibility.
   */
  setShowMarker(v: boolean): void
  /**
   * Gets the current bullet character (for `ul` type).
   */
  getBulletChar(): string
  /**
   * Sets the bullet character (used only for `ul` when `showMarker=true`).
   */
  setBulletChar(ch: string): void
  /**
   * Returns whether the outer list container shows border (box-shadow).
   */
  isBorder(): boolean
  /**
   * Sets border state for the outer list container.
   */
  setBorder(v: boolean): void
  /**
   * Returns whether each list item (`li`) shows border (box-shadow).
   */
  isListBorder(): boolean
  /**
   * Sets border state for each list item (`li`).
   */
  setListBorder(v: boolean): void
  /**
   * Gets background type of the list container.
   * - One of 'filled' | 'empty' | 'transparent'.
   */
  getBackgroundType(): BackgroundTypeValue
  /**
   * Sets background type of the list container.
   */
  setBackgroundType(t: BackgroundTypeValue): void
  /**
   * Gets background type of each list item (`li`).
   * - One of 'filled' | 'empty' | 'transparent'.
   */
  getListBackgroundType(): BackgroundTypeValue
  /**
   * Sets background type of each list item (`li`).
   */
  setListBackgroundType(t: BackgroundTypeValue): void
  /**
   * Gets the current text list (shallow-copied).
   * - Effective only when items are driven by `textList` (not slot elements).
   */
  getTextList(): Array<string | number>
  /**
   * Replaces the text list (for data-driven rendering).
   * - No effect if slot elements are provided.
   */
  setTextList(list: Array<string | number>): void
  /**
   * Returns whether textbox-like CSS event binding is active.
   * - `true`: list items emit events & apply interactive CSS states.
   * - `false`: static rendering only.
   */
  isAddEvent(): boolean
  /**
   * Enables or disables textbox-like CSS event binding on list items.
   */
  setAddEvent(v: boolean): void
  /**
   * Gets the current `tabIndex` applied to each list item.
   * - `null`: no `tabindex` attribute (items not focusable).
   * - `0` or positive number: items can be focused via keyboard navigation.
   */
  getTabIndex(): number | null
  /**
   * Sets `tabIndex` for each list item.
   * @param v - `null` to remove, or number to make focusable.
   */
  setTabIndex(v: number | null): void
  /**
   * Returns the total number of list items (`<li>` elements).
   */
  getListRowCount(): number
  /**
   * Returns the raw `<li>` element at the given index (0-based).
   * - Returns `null` if index is out of bounds.
   */
  getListItem(index: number): HTMLElement | null
  /**
   * Gets the current number of columns used for item layout.
   * - 1: single column
   * - >=2: multi-column grid-like layout.
   */
  getColumns(): number
  /**
   * Sets the number of columns used for item layout.
   * - Values <= 1 are clamped to 1.
   */
  setColumns(columns: number): void
  /**
   * Gets the current horizontal gap between columns.
   * - Number → interpreted as pixels.
   * - String → raw CSS length (e.g. '0.5rem', '8px').
   */
  getColumnGap(): number | string
  /**
   * Sets the horizontal gap between columns.
   * @param gap - number (px) or CSS length string.
   */
  setColumnGap(gap: number | string): void
  /**
   * Focuses the list item at `index` (0-based).
   * - Works only when `addEvent` is enabled AND `tabIndex` is neither `null/undefined` nor `-1`.
   * - If `index` is out of bounds or conditions are not met, it's a no-op.
   */
  focus(index?: number): void
}

/**
 * Runtime control methods for `HModal` component.
 *
 * This interface defines programmatic access to a modal’s visibility,
 * header/footer sections, caption, close button, overlay, scroll lock,
 * styling, and animation settings. You can retrieve an instance
 * using `hison.component.getModal(id)`.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const modal = hison.component.getModal('modal01');
 * modal.open();
 * modal.setCaption('Hello world');
 * modal.setPosition('top-right');
 * modal.setZIndex(2000);
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - Visibility (`visible`) is **only** controlled by these methods. The `visible` prop is an initial state.
 * - `scrollLock` is reference-counted across multiple modals; closing one does not unlock if others are still open.
 * - `zIndex` applies to the wrapper; the overlay is always rendered at `zIndex - 1`.
 */
export interface HModalMethods extends ComponentMethods {
  /**
   * Returns the type of the component.
   * Always `'modal'`.
   */
  getType(): 'modal'
  /**
   * Returns whether the modal is currently visible.
   */
  isVisible(): boolean
  /**
   * Opens the modal (with animation and scroll lock).
   */
  open(): void | Promise<void>
  /**
   * Closes the modal (with animation and scroll unlock).
   */
  close(): void | Promise<void>
  /**
   * Toggles modal open/close state.
   */
  toggle(): void | Promise<void>
  /**
   * Sets modal visibility.
   * @param v `true` → open, `false` → close
   */
  setVisible(v: boolean): void | Promise<void>
  /**
   * Gets the current z-index of the modal wrapper.
   */
  getZIndex(): number
  /**
   * Sets the z-index of the modal wrapper (overlay will use `zIndex - 1`).
   */
  setZIndex(v: number): void
  /**
   * Gets the current fixed screen position of the modal wrapper.
   */
  getPosition(): ScreenPositionValue
  /**
   * Sets the modal wrapper position on screen.
   * Accepts any `ScreenPosition` value (e.g. `'top-left'`, `'middle-center'`).
   */
  setPosition(v: ScreenPosition | ScreenPositionValue): void
  /**
   * Returns whether the header section is visible.
   */
  isHeaderVisible(): boolean
  /**
   * Sets whether the header section is visible.
   */
  setHeaderVisible(v: boolean): void
  /**
   * Returns whether the footer section is visible.
   */
  isFooterVisible(): boolean
  /**
   * Sets whether the footer section is visible.
   */
  setFooterVisible(v: boolean): void
  /**
   * Gets the current caption text (empty string if none).
   */
  getCaption(): string
  /**
   * Sets the caption text (null or empty hides caption).
   */
  setCaption(text: string | null): void
  /**
   * Returns whether the caption has border styling.
   */
  isCaptionBorder(): boolean
  /**
   * Sets whether the caption shows border styling.
   */
  setCaptionBorder(v: boolean): void
  /**
   * Gets the background type of the caption.
   */
  getCaptionBackgroundType(): BackgroundTypeValue
  /**
   * Sets the background type of the caption.
   */
  setCaptionBackgroundType(t: BackgroundType | BackgroundTypeValue): void
  /**
   * Gets the caption placement (header/footer + side).
   */
  getCaptionPlacement(): ModalPlacementValue
  /**
   * Sets the caption placement (header/footer + side).
   */
  setCaptionPlacement(p: ModalPlacement | ModalPlacementValue): void
  /**
   * Returns whether the close button is visible.
   */
  isCloseButtonVisible(): boolean
  /**
   * Sets whether the close button is visible.
   */
  setCloseButtonVisible(v: boolean): void
  /**
   * Returns whether the close button has border styling.
   */
  isCloseButtonBorder(): boolean
  /**
   * Sets whether the close button shows border styling.
   */
  setCloseButtonBorder(v: boolean): void
  /**
   * Gets the background type of the close button.
   */
  getCloseButtonBackgroundType(): BackgroundTypeValue
  /**
   * Sets the background type of the close button.
   */
  setCloseButtonBackgroundType(t: BackgroundType | BackgroundTypeValue): void
  /**
   * Gets the close button placement (header/footer + side).
   */
  getButtonPlacement(): ModalPlacementValue
  /**
   * Sets the close button placement (header/footer + side).
   */
  setButtonPlacement(p: ModalPlacement | ModalPlacementValue): void
  /**
   * Returns whether clicking the overlay closes the modal.
   */
  isCloseClickOverlay(): boolean
  /**
   * Sets whether clicking the overlay closes the modal.
   */
  setCloseClickOverlay(v: boolean): void
  /**
   * Returns whether the overlay (backdrop) is shown.
   */
  isOverlayShown(): boolean
  /**
   * Sets whether the overlay (backdrop) is shown.
   */
  setOverlayShown(v: boolean): void
  /**
   * Returns whether scroll lock is enabled for this modal.
   */
  isScrollLocked(): boolean
  /**
   * Enables or disables scroll lock.
   * If enabled while visible, locks immediately.
   * If disabled while visible, unlocks immediately.
   */
  setScrollLock(v: boolean): void
  /**
   * Returns whether the modal has border styling.
   */
  isBorder(): boolean
  /**
   * Sets whether the modal shows border styling.
   */
  setBorder(v: boolean): void
  /**
   * Gets the background type of the modal.
   */
  getBackgroundType(): BackgroundTypeValue
  /**
   * Sets the background type of the modal.
   */
  setBackgroundType(t: BackgroundType | BackgroundTypeValue): void
  /**
   * Gets the CSS class names for enter/leave animations.
   */
  getAnimationClasses(): { enter: string, leave: string }
  /**
   * Sets one or both CSS animation classes for modal enter/leave.
   * Example: `{ enter: 'fade-in', leave: 'fade-out' }`
   */
  setAnimationClasses(opt: Partial<{ enter: string, leave: string }>): void
}

/**
 * Represents a single editable Vanillanote instance within the DOM.
 *
 * - Each Vanillanote editor on the page is mounted into a `VanillanoteElement`,
 *   which extends `HTMLDivElement` and adds additional internal properties and methods.
 * - All editors are dynamically generated based on a `<div data-vanillanote>` element.
 * - Editors are automatically assigned a unique `_id`, based on creation order or a custom `data-id`.
 * - Each `VanillanoteElement` manages its own selection state, styling, events, attachment data, and DOM references.
 *
 * ### Key Features:
 * - Manages internal selections, styles, file attachments, and UI states independently per editor.
 * - Provides API methods like `getNoteData()` to export editor content and `setNoteData()` to restore editor state.
 * - Supports rich text editing features including text styling, file/image/video attachment, undo/redo history, placeholders, and more.
 * - Integrates before/after event hooks to customize interaction behaviors.
 *
 * ### Internal Structure:
 * - `_selection`: Tracks selection state like current selection range, start/end nodes, and drag selections.
 * - `_attributes`: Stores editor behavior settings like device mode, language, and size constraints.
 * - `_status`: Stores current toggled states (e.g., bold active, selected color).
 * - `_elements`: References to important DOM elements (textarea, toolbar buttons, modals, etc.).
 * - `_cssEvents`: Low-level event handlers (click, touch) for custom interaction logic.
 * - `_elementEvents`: High-level hooks for specific UI elements.
 * - `_attFiles`, `_attImages`: Manage attached files/images.
 * - `_recodes`: Manage undo/redo history for editing actions.
 *
 * ### Usage Example:
 * ```ts
 * const note = Vanillanote.getNote('my-editor-id');
 * const data = note.getNoteData();
 *
 * console.log(data.html); // Editor HTML content
 * editor.setNoteData(data); // Restore content
 * ```
 *
 * @remarks
 * - `VanillanoteElement` is automatically created when calling `vn.mountNote()`.
 * - It should not be manually instantiated by developers.
 * - Each `VanillanoteElement` belongs to a shared singleton `Vanillanote` object.
 * - Supports multiple editors per page.
 *
 * @see Vanillanote
 * @see getNoteData
 * @see setNoteData
 */
export interface HNoteElement extends ComponentMethods, VanillanoteElement {
  /**
   * Returns the type of the note.
   */
  getType(): 'note'
  /**
   * Gets whether the note is currently required.
   * - If `true`, the note will show a visual required style.
   */
  getRequired(): boolean;
  /**
   * Sets the required state of the note.
   */
  setRequired(required: boolean): void;
  /**
   * Gets the current edit mode.
   * - Possible values: `'editable'`, `'readonly'`, `'disable'`
   */
  getEditMode(): EditModeValue;
  /**
   * Sets the edit mode of the note.
   * - `'readonly'` and `'disable'` both prevent editing but differ in style.
   */
  setEditMode(mode: EditMode | EditModeValue): void;
  /**
   * Returns whether any note inside the group has been modified by user interaction.
   * 
   * @returns `true` if at least one note is marked as modified.
   */
  isModified(): boolean;
  /**
   * Resets the modification status of all notes in the group.
   * 
   * Typically called after saving or loading new data.
   */
  initModified(): void;
  /**
   * Gets the current `tabIndex` applied to element.
   * - `null`: no `tabindex` attribute (items not focusable).
   * - `0` or positive number: items can be focused via keyboard navigation.
   */
  getTabIndex(): number | null
  /**
   * Sets `tabIndex` for element.
   * @param v - `null` to remove, or number to make focusable.
   */
  setTabIndex(v: number | null): void
  /**
   * Focus on the note.
   */
  focus(): void;
  /**
   * Converts the current editor content into a `DataModel` instance.
   *
   * - Returns a new `DataModel` where each property of `NoteData` (like `html`, `links`, `files`, etc.)
   *   becomes a column, and a single row represents the editor state.
   *
   * @returns A `DataModel<NoteData>` containing the editor's current data.
   */
  getDataModel(): InterfaceDataModel<NoteData>;
  /**
   * Populates the editor using a `DataModel` instance.
   *
   * - Extracts values from the first row of the `DataModel`, if available.
   * - Uses the values from columns like `html`, `plainText`, `links`, etc. to restore editor content.
   *
   * @param dataModel A `DataModel` whose first row maps to `NoteData` structure.
   */
  setDataModel<T extends NoteData>(dataModel: InterfaceDataModel<T>): void;
  /**
   * Loads editor content from either a `NoteData` object or a compatible `DataModel`.
   *
   * - Accepts plain `NoteData`, raw object, or `DataModel`.
   * - Automatically determines how to process the input and restores the editor accordingly.
   *
   * @param data Editor content to load, in `NoteData` or `DataModel` form.
   */
  load<T extends NoteData>(data: NoteData | Record<string, any> | InterfaceDataModel<T>): void;
}

/**
 * Runtime control methods for `HPagination` component.
 *
 * This interface defines methods that can be accessed via `hison.component.getPagination(id)`.
 * Use these methods to manipulate pagination state programmatically at runtime.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const pg = hison.component.getPagination('pg1');
 * pg.setCurrentPage(3);       // Jump to page 3
 * pg.goNext();                // Move to the next page
 * pg.setShowFirst(false);     // Hide the "First" button
 * pg.setGap('1rem');          // Change spacing between buttons
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - `modelValue` (v-model) is automatically updated when using `setCurrentPage` or navigation methods.
 * - All changes are reactive and immediately reflected in the DOM.
 * - If `totalPages` is explicitly set via props, it overrides `totalItems/pageSize` calculation.
 */
export interface HPaginationMethods extends ComponentMethods {
  /**
   * Returns the component type identifier.
   * - Always `'pagination'`
   */
  getType(): 'pagination'
  /**
   * Returns whether the pagination component is currently visible.
   */
  isVisible(): boolean
  /**
   * Sets the visibility of the entire pagination component.
   * @param v - `true` to show, `false` to hide
   */
  setVisible(v: boolean): void
  /**
   * Returns the current spacing (gap) between buttons.
   * - Value is normalized into a CSS unit string (e.g., `"8px"`, `"0.5rem"`).
   */
  getGap(): string
  /**
   * Sets the spacing (gap) between buttons.
   * @param v - Number (treated as px) or CSS size string
   */
  setGap(v: number | string): void
  /**
   * Gets the current active page number (1-based).
   */
  getCurrentPage(): number
  /**
   * Sets the current active page number.
   * - Automatically clamps to `[1 .. totalPages]`.
   * - Emits both `update:modelValue` and `change` events if page changes.
   */
  setCurrentPage(page: number): void
  /**
   * Returns the total number of pages.
   * - Computed from `totalItems/pageSize` unless `totalPages` prop is explicitly set.
   */
  getTotalPages(): number
  /**
   * Sets the total number of pages.
   * - If current page is out of range, it will be clamped.
   */
  setTotalPages(totalPages: number): void
  /**
   * Returns the total number of items (from `totalItems` prop).
   */
  getTotalItems(): number
  /**
   * Returns the page size (from `pageSize` prop).
   */
  getPageSize(): number
  /**
   * Moves to the previous page (if not on the first).
   */
  goPrev(): void
  /**
   * Moves to the next page (if not on the last).
   */
  goNext(): void
  /**
   * Moves to the first page.
   */
  goFirst(): void
  /**
   * Moves to the last page.
   */
  goLast(): void
  /**
   * Returns whether the "Prev" button is currently visible.
   */
  isShowPrev(): boolean
  /**
   * Shows or hides the "Prev" button.
   */
  setShowPrev(v: boolean): void
  /**
   * Returns whether the "Next" button is currently visible.
   */
  isShowNext(): boolean
  /**
   * Shows or hides the "Next" button.
   */
  setShowNext(v: boolean): void
  /**
   * Returns whether the "First" button is currently visible.
   */
  isShowFirst(): boolean
  /**
   * Shows or hides the "First" button.
   */
  setShowFirst(v: boolean): void
  /**
   * Returns whether the "Last" button is currently visible.
   */
  isShowLast(): boolean
  /**
   * Shows or hides the "Last" button.
   */
  setShowLast(v: boolean): void
  /**
   * Returns whether buttons currently display a border.
   */
  isBorder(): boolean
  /**
   * Sets whether buttons display a border.
   * @param border - `true` to show, `false` to hide
   */
  setBorder(border: boolean): void
  /**
   * Gets the current background type of the buttons.
   * - 'filled' | 'empty' | 'transparent'
   */
  getBackgroundType(): BackgroundTypeValue
  /**
   * Sets the background type of the buttons.
   * @param type - New background type to apply
   */
  setBackgroundType(type: BackgroundType | BackgroundTypeValue): void
  /**
   * Returns the current click interval (in ms) applied to navigation buttons.
   */
  getClickInterval(): number
  /**
   * Sets the minimum interval (in ms) between button clicks.
   */
  setClickInterval(ms: number): void
  /**
   * Gets the current `tabIndex` for pagination buttons.
   * - `null`: no `tabindex` (not focusable)
   * - `0` or positive: focusable in tab order
   */
  getTabIndex(): number | null
  /**
   * Sets the `tabIndex` for pagination buttons.
   * @param v - `null` to remove, or number to set
   */
  setTabIndex(v: number | null): void
  /**
   * Focuses on the most relevant pagination button.
   * - Priority: current page → prev → next → first → last
   */
  focus(): void
  /**
   * Forces a full reload of the pagination component.
   * - Useful if props or slots have changed dynamically.
   */
  reload(): void
}

/**
 * Runtime control methods for `HParagraph` component.
 *
 * This interface exposes programmatic access to a paragraph’s visibility, text,
 * typography toggles, alignment, background/border, whitespace policy, and the
 * built-in copy behavior. You can retrieve an instance via
 * `hison.component.getParagraph(id)`.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const p = hison.component.getParagraph('p1');
 * p.setText('Line 1\n  Line 2\nLine 3');
 * p.setWhiteSpace('pre-wrap');         // preserve newlines + sequences of spaces
 * p.setFontBold(true);
 * p.setTextAlign('right');
 * p.setCopyEnabled(true);
 * p.setShowCopyButton(true);
 * await p.copy();                      // copy rendered text to clipboard
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - All methods are reactive and immediately affect the DOM.
 * - `getText()`/`setText()` control the internal text **only when there is no
 *   element content in the default slot**. If the default slot contains any
 *   elements, `getText()` returns `''` and `setText()` is a no-op.
 * - `setWhiteSpace(null)` uses the component default (currently `'pre-wrap'`).
 * - `copy()` copies the **rendered** text (mirrors what a user would select),
 *   respecting the current whitespace policy.
 */
export interface HParagraphMethods extends ComponentMethods {
  /**
   * Returns the component type identifier.
   */
  getType(): 'paragraph'
  /**
   * Returns whether the paragraph is currently visible.
   */
  isVisible(): boolean
  /**
   * Shows or hides the paragraph.
   */
  setVisible(visible: boolean): void
  /**
   * Gets the current tooltip text (`title` attribute).
   */
  getTitle(): string
  /**
   * Sets the tooltip text (`title` attribute).
   */
  setTitle(title: string): void
  /**
   * Gets the internal text value.
   * - Returns `''` when the default slot contains elements (non-text).
   */
  getText(): string
  /**
   * Sets the internal text value.
   * - Ignored when the default slot contains elements (non-text).
   */
  setText(text: string): void
  /**
   * Gets the horizontal text alignment.
   * - One of `'left' | 'center' | 'right'`.
   */
  getTextAlign(): TextAlignValue
  /**
   * Sets the horizontal text alignment.
   * - Accepts enum `TextAlign` or a string literal.
   */
  setTextAlign(textAlign: TextAlign | TextAlignValue): void
  /**
   * Gets the vertical alignment mode.
   * - One of `'top' | 'middle' | 'bottom'` (applies when container has height).
   */
  getVerticalAlign(): 'top' | 'middle' | 'bottom'
  /**
   * Sets the vertical alignment mode.
   */
  setVerticalAlign(align: 'top' | 'middle' | 'bottom'): void
  /**
   * Returns whether bold style is enabled.
   */
  isFontBold(): boolean
  /**
   * Toggles bold style.
   */
  setFontBold(bold: boolean): void
  /**
   * Returns whether italic style is enabled.
   */
  isFontItalic(): boolean
  /**
   * Toggles italic style.
   */
  setFontItalic(italic: boolean): void
  /**
   * Returns whether strikethrough is enabled.
   */
  isFontThruline(): boolean
  /**
   * Toggles strikethrough.
   */
  setFontThruline(thruline: boolean): void
  /**
   * Returns whether underline is enabled.
   */
  isFontUnderline(): boolean
  /**
   * Toggles underline.
   */
  setFontUnderline(underline: boolean): void
  /**
   * Returns whether the border (subtle box shadow) is shown.
   */
  isBorder(): boolean
  /**
   * Shows or hides the border (subtle box shadow).
   */
  setBorder(border: boolean): void
  /**
   * Gets the current background type.
   * - `'filled' | 'empty' | 'transparent'`
   */
  getBackgroundType(): BackgroundTypeValue
  /**
   * Sets the background type.
   */
  setBackgroundType(type: BackgroundType | BackgroundTypeValue): void
  /**
   * Gets the current CSS `white-space` policy, or `null` for component default.
   * - `'normal' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces' | null`
   */
  getWhiteSpace(): 'normal' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces' | null
  /**
   * Sets the CSS `white-space` policy.
   * - Pass `null` to use the component default (currently `'pre-wrap'`).
   */
  setWhiteSpace(ws: 'normal' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces' | null): void
  /**
   * Gets the text shown on the built-in copy button.
   */
  getCopyButtonText(): string
  /**
   * Sets the text shown on the built-in copy button.
   */
  setCopyButtonText(buttonText: string): void
  /**
   * Returns whether copy actions are enabled (Ctrl/Cmd+C and copy button).
   */
  isCopyEnabled(): boolean
  /**
   * Enables or disables copy actions.
   */
  setCopyEnabled(copyEnabled: boolean): void
  /**
   * Returns whether the built-in copy button is visible.
   */
  isShowCopyButton(): boolean
  /**
   * Shows or hides the built-in copy button.
   */
  setShowCopyButton(v: boolean): void
  /**
   * Copies the rendered text content to the clipboard.
   * - Resolves to `true` on success, `false` if copying is blocked or fails.
   */
  copy(): Promise<boolean>
  /**
   * Returns whether translation is currently enabled.
   * - When `false`, the paragraph has `translate="no"` and `.notranslate` class.
   */
  isTranslate(): boolean
  /**
   * Enables or disables browser translation prevention.
   * - `true` → nothing
   * - `false` → adds `translate="no"` + `.notranslate`
   */
  setTranslate(translate: boolean): void
}

/**
 * Runtime control methods for `HPopup` component.
 *
 * This interface defines programmatic access to a popup’s visibility,
 * positioning, size, draggability, overlay, scroll lock, border, and animation settings.
 * You can retrieve an instance using `hison.component.getPopup(id)`.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const popup = hison.component.getPopup('popup01');
 * popup.open();
 * popup.setDraggable(false);
 * popup.setPopupPosition('top-right');
 * popup.setZIndex(1300);
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - Visibility (`visible`) is **only** controlled by these methods. The `visible` prop is an initial state.
 * - `scrollLock` is reference-counted across multiple popups; closing one does not unlock if others are still open.
 * - `zIndex` applies to the wrapper; the overlay is always rendered at `zIndex - 1`.
 * - Dragging is enabled/disabled via `isDraggable` / `setDraggable`.
 */
export interface HPopupMethods extends ComponentMethods {
  /**
   * Returns the type of the component.
   * Always `'popup'`.
   */
  getType(): 'popup'
  /**
   * Returns whether the popup is currently visible.
   */
  isVisible(): boolean
  /**
   * Opens the popup (with animation and scroll lock).
   */
  open(): void | Promise<void>
  /**
   * Closes the popup (with animation and scroll unlock).
   */
  close(): void | Promise<void>
  /**
   * Toggles popup open/close state.
   */
  toggle(): void | Promise<void>
  /**
   * Sets popup visibility.
   * @param v `true` → open, `false` → close
   */
  setVisible(v: boolean): void | Promise<void>
  /**
   * Gets the current z-index of the popup wrapper.
   */
  getZIndex(): number
  /**
   * Sets the z-index of the popup wrapper (overlay will use `zIndex - 1`).
   */
  setZIndex(v: number): void
  /**
   * Gets the current fixed screen position of the popup wrapper.
   */
  getPosition(): ScreenPositionValue
  /**
   * Sets the popup wrapper position on screen.
   * Accepts any `ScreenPosition` value (e.g. `'top-left'`, `'middle-center'`).
   */
  setPosition(v: ScreenPosition | ScreenPositionValue): void
  /**
   * Gets the current absolute left (X) position in pixels.
   * Returns `null` if not in absolute mode.
   */
  getLeft(): number | null
  /**
   * Sets the absolute left (X) position in pixels.
   * Setting this switches the popup into absolute mode.
   */
  setLeft(v: number | null): void
  /**
   * Gets the current absolute top (Y) position in pixels.
   * Returns `null` if not in absolute mode.
   */
  getTop(): number | null
  /**
   * Sets the absolute top (Y) position in pixels.
   * Setting this switches the popup into absolute mode.
   */
  setTop(v: number | null): void
  /**
   * Gets the current width of the popup in pixels.
   * Returns `null` if not explicitly set.
   */
  getWidth(): number | null
  /**
   * Sets the width of the popup in pixels.
   */
  setWidth(v: number | null): void
  /**
   * Gets the current height of the popup in pixels.
   * Returns `null` if not explicitly set.
   */
  getHeight(): number | null
  /**
   * Sets the height of the popup in pixels.
   */
  setHeight(v: number | null): void
  /**
   * Returns whether dragging by the topbar is enabled.
   */
  isDraggable(): boolean
  /**
   * Enables or disables dragging by the topbar.
   * @param v `true` → allow dragging, `false` → disable dragging
   */
  setDraggable(v: boolean): void
  /**
   * Returns whether the overlay (backdrop) is shown.
   */
  isOverlayShown(): boolean
  /**
   * Sets whether the overlay (backdrop) is shown.
   */
  setOverlayShown(v: boolean): void
  /**
   * Returns whether clicking the overlay closes the popup.
   */
  isCloseClickOverlay(): boolean
  /**
   * Sets whether clicking the overlay closes the popup.
   */
  setCloseClickOverlay(v: boolean): void
  /**
   * Returns whether scroll lock is enabled for this popup.
   */
  isScrollLocked(): boolean
  /**
   * Enables or disables scroll lock.
   * If enabled while visible, locks immediately.
   * If disabled while visible, unlocks immediately.
   */
  setScrollLock(v: boolean): void
  /**
   * Returns whether the popup has border styling.
   */
  isBorder(): boolean
  /**
   * Sets whether the popup shows border styling.
   */
  setBorder(v: boolean): void
  /**
   * Gets the CSS class names for enter/leave animations.
   */
  getAnimationClasses(): { enter: string, leave: string }
  /**
   * Sets one or both CSS animation classes for popup enter/leave.
   * Example: `{ enter: 'fade-in', leave: 'fade-out' }`
   */
  setAnimationClasses(opt: Partial<{ enter: string, leave: string }>): void
}

/**
 * Runtime control methods for `HSpinner` component.
 *
 * This interface defines programmatic access to a spinner’s visibility,
 * position, z-index, timeout auto-hide, spinner type, and overlay style.
 * You can retrieve an instance using `hison.component.getSpinner(id)`.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const spinner = hison.component.getSpinner('spinner01');
 * spinner.open();
 * spinner.setSpinnerType('dots');
 * spinner.setPosition('bottom-right');
 * spinner.setTimeout(5000);
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - Visibility (`visible`) is **only** controlled by these methods. The `visible` prop is an initial state.
 * - Overlay and scroll lock are always enforced while the spinner is open (cannot be disabled).
 * - `zIndex` applies to the wrapper; the overlay is always rendered at `zIndex - 1`.
 * - When a custom `#spinner` slot is provided, `spinnerType` is ignored.
 */
export interface HSpinnerMethods extends ComponentMethods {
  /**
   * Returns the type of the component.
   * Always `'spinner'`.
   */
  getType(): 'spinner'
  /**
   * Returns whether the spinner is currently visible.
   */
  isVisible(): boolean
  /**
   * Opens the spinner (with enforced overlay and scroll lock).
   */
  open(): void | Promise<void>
  /**
   * Closes the spinner (removes overlay and releases scroll lock).
   */
  close(): void | Promise<void>
  /**
   * Toggles spinner open/close state.
   */
  toggle(): void | Promise<void>
  /**
   * Sets spinner visibility.
   * @param v `true` → open, `false` → close
   */
  setVisible(v: boolean): void | Promise<void>
  /**
   * Gets the current z-index of the spinner wrapper.
   */
  getZIndex(): number
  /**
   * Sets the z-index of the spinner wrapper (overlay will use `zIndex - 1`).
   */
  setZIndex(v: number): void
  /**
   * Gets the current fixed screen position of the spinner wrapper.
   */
  getPosition(): ScreenPositionValue
  /**
   * Sets the spinner wrapper position on screen.
   * Accepts any `ScreenPosition` value (e.g. `'top-left'`, `'middle-center'`).
   */
  setPosition(v: ScreenPosition | ScreenPositionValue): void
  /**
   * Gets the current timeout in milliseconds.
   * `0` means no auto-hide.
   */
  getTimeout(): number
  /**
   * Sets the auto-hide timeout in milliseconds.
   * `0` disables timeout (spinner stays open until closed programmatically).
   */
  setTimeout(ms: number): void
  /**
   * Gets the current built-in spinner type.
   * One of `'ring' | 'dots' | 'bars' | 'pulse'`.
   */
  getSpinnerType(): SpinnerTypeValue
  /**
   * Sets the spinner type.
   * One of `'ring' | 'dots' | 'bars' | 'pulse'`.
   * Ignored when using a custom `#spinner` slot.
   */
  setSpinnerType(t: SpinnerType | SpinnerTypeValue): void
  /**
   * Gets the current overlay style object/string/array.
   */
  getOverlayStyle(): any
  /**
   * Sets the overlay style.
   * Merged with an internal `{ zIndex: (zIndex - 1) }`.
   */
  setOverlayStyle(s: any): void
  /**
   * Reloads the spinner instance
   */
  reload(): void
}

/**
 * Runtime control methods for `HTable` component.
 *
 * This interface exposes programmatic access to a table’s visibility, borders,
 * striping/hover modes, caption, section-level alignment (text/vertical), and
 * raw DOM section elements. You can retrieve an instance via
 * `hison.component.getTable(id)`.
 *
 * ---
 *
 * ### 🔧 Example Usage
 * ```ts
 * const t = hison.component.getTable('tbl1');
 * 
 * // Visibility and borders
 * t.setVisible(true);
 * t.setBorder(true);
 * t.setHeaderBorderBottom(true);
 *
 * // Caption and background
 * t.setCaption('Monthly Report');
 * t.setBackgroundType('filled');
 *
 * // Striping and hover highlight
 * t.setStriped('row');
 * t.setHoverable('col');
 * ```
 *
 * ---
 *
 * ### ⚠️ Notes
 * - All methods are reactive and immediately affect the DOM.
 * - Border toggles are section-specific (`header`, `body`, `footer`) and apply
 *   per side (`top`, `bottom`, `left`, `right`).
 * - Text and vertical alignment are applied at the section level and affect all
 *   contained cells.
 * - `getRowElement(index)` uses **0-based indexing** and returns `null` if
 *   out of range.
 * - Use slots (`#caption`, `#thead`, default, `#tfoot`) for full markup
 *   customization; `setCaption()` only affects plain text captions.
 */
export interface HTableMethods extends ComponentMethods {
  /**
   * Returns the component type identifier.
   */
  getType(): 'table'
  /**
   * Returns whether the table is currently visible.
   * - `true`: rendered normally
   * - `false`: wrapper has `hison-display-none`
   */
  isVisible(): boolean
  /**
   * Shows or hides the table.
   */
  setVisible(visible: boolean): void
  /**
   * Returns whether the border (subtle box shadow) is shown.
   */
  isBorder(): boolean
  /**
   * Shows or hides the border (subtle box shadow).
   */
  setBorder(v: boolean): void
  /**
   * Returns whether the header top border is shown.
   */
  isHeaderBorderTop(): boolean
  /**
   * Shows or hides the header top border.
   */
  setHeaderBorderTop(v: boolean): void
  /**
   * Returns whether the header bottom border is shown.
   */
  isHeaderBorderBottom(): boolean
  /**
   * Shows or hides the header bottom border.
   */
  setHeaderBorderBottom(v: boolean): void
  /**
   * Returns whether the header left border is shown.
   */
  isHeaderBorderLeft(): boolean
  /**
   * Shows or hides the header left border.
   */
  setHeaderBorderLeft(v: boolean): void
  /**
   * Returns whether the header right border is shown.
   */
  isHeaderBorderRight(): boolean
  /**
   * Shows or hides the header right border.
   */
  setHeaderBorderRight(v: boolean): void
  /**
   * Returns whether the body top border is shown.
   */
  isBodyBorderTop(): boolean
  /**
   * Shows or hides the body top border.
   */
  setBodyBorderTop(v: boolean): void
  /**
   * Returns whether the body bottom border is shown.
   */
  isBodyBorderBottom(): boolean
  /**
   * Shows or hides the body bottom border.
   */
  setBodyBorderBottom(v: boolean): void
  /**
   * Returns whether the body left border is shown.
   */
  isBodyBorderLeft(): boolean
  /**
   * Shows or hides the body left border.
   */
  setBodyBorderLeft(v: boolean): void
  /**
   * Returns whether the body right border is shown.
   */
  isBodyBorderRight(): boolean
  /**
   * Shows or hides the body right border.
   */
  setBodyBorderRight(v: boolean): void
  /**
   * Returns whether the footer top border is shown.
   */
  isFooterBorderTop(): boolean
  /**
   * Shows or hides the footer top border.
   */
  setFooterBorderTop(v: boolean): void
  /**
   * Returns whether the footer bottom border is shown.
   */
  isFooterBorderBottom(): boolean
  /**
   * Shows or hides the footer bottom border.
   */
  setFooterBorderBottom(v: boolean): void
  /**
   * Returns whether the footer left border is shown.
   */
  isFooterBorderLeft(): boolean
  /**
   * Shows or hides the footer left border.
   */
  setFooterBorderLeft(v: boolean): void
  /**
   * Returns whether the footer right border is shown.
   */
  isFooterBorderRight(): boolean
  /**
   * Shows or hides the footer right border.
   */
  setFooterBorderRight(v: boolean): void
  /**
   * Gets the current striping mode.
   * - `'row' | 'col' | 'none'`
   */
  getStriped(): 'row' | 'col' | 'none'
  /**
   * Sets the striping mode.
   */
  setStriped(v: 'row' | 'col' | 'none'): void
  /**
   * Gets the current hover highlight mode.
   * - `'row' | 'col' | 'none'`
   */
  getHoverable(): 'row' | 'col' | 'none'
  /**
   * Sets the hover highlight mode.
   */
  setHoverable(v: 'row' | 'col' | 'none'): void
  /**
   * Gets the caption text (use `#caption` slot for custom content).
   */
  getCaption(): string
  /**
   * Sets the caption text.
   */
  setCaption(text: string): void
  /**
   * Gets the current background type.
   * - `'filled' | 'empty' | 'transparent'`
   */
  getBackgroundType(): BackgroundTypeValue
  /**
   * Sets the background type.
   */
  setBackgroundType(t: BackgroundTypeValue): void
  /**
   * Gets the horizontal text alignment for header cells.
   * - `'left' | 'center' | 'right'`
   */
  getHeaderTextAlign(): TextAlignValue
  /**
   * Sets the horizontal text alignment for header cells.
   */
  setHeaderTextAlign(v: TextAlignValue): void
  /**
   * Gets the horizontal text alignment for body cells.
   * - `'left' | 'center' | 'right'`
   */
  getBodyTextAlign(): TextAlignValue
  /**
   * Sets the horizontal text alignment for body cells.
   */
  setBodyTextAlign(v: TextAlignValue): void
  /**
   * Gets the horizontal text alignment for footer cells.
   * - `'left' | 'center' | 'right'`
   */
  getFooterTextAlign(): TextAlignValue
  /**
   * Sets the horizontal text alignment for footer cells.
   */
  setFooterTextAlign(v: TextAlignValue): void
  /**
   * Gets the vertical alignment for header cells.
   * - `'top' | 'middle' | 'bottom'`
   */
  getHeaderVerticalAlign(): VerticalAlignValue
  /**
   * Sets the vertical alignment for header cells.
   */
  setHeaderVerticalAlign(v: VerticalAlignValue): void
  /**
   * Gets the vertical alignment for body cells.
   * - `'top' | 'middle' | 'bottom'`
   */
  getBodyVerticalAlign(): VerticalAlignValue
  /**
   * Sets the vertical alignment for body cells.
   */
  setBodyVerticalAlign(v: VerticalAlignValue): void
  /**
   * Gets the vertical alignment for footer cells.
   * - `'top' | 'middle' | 'bottom'`
   */
  getFooterVerticalAlign(): VerticalAlignValue
  /**
   * Sets the vertical alignment for footer cells.
   */
  setFooterVerticalAlign(v: VerticalAlignValue): void
  /**
   * Returns the number of body rows (`tbody > tr`).
   */
  getRowCount(): number
  /**
   * Returns the `<tr>` element at the given 0-based index, or `null` if out of range.
   */
  getRowElement(index: number): HTMLTableRowElement | null
  /**
   * Returns the raw `<thead>` element, if present.
   */
  getHeadElement(): HTMLTableSectionElement | null
  /**
   * Returns the raw `<tbody>` element.
   */
  getBodyElement(): HTMLTableSectionElement | null
  /**
   * Returns the raw `<tfoot>` element, if present.
   */
  getFootElement(): HTMLTableSectionElement | null
}
