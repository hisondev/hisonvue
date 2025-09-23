import type { 
  HAccordion,
  HBaggie,
  HButton,
  HCalendar,
  HCaption,
  HChart,
  HDrawer,
  HDropdown,
  HFileset,
  HGap,
  HGrid,
  HImagebox,
  HInput,
  HInputGroup,
  HLabel,
  HLayout,
  HList,
  HModal,
  HNote,
  HParagraph,
  HPopup,
  HSpinner,
  HTable,
} from './index'

declare module 'vue' {
  export interface GlobalComponents {

    /**
     * Hisonvue custom accordion component.
     *
     * `HAccordion`은 상단 헤더가 항상 고정되고, 본문이 열렸다/닫혔다 하는 단순·가벼운 아코디언입니다.
     * 헤더 타이틀은 `title` prop 또는 `#title` 슬롯으로 렌더링되며, 본문은 기본 슬롯을 통해 자유롭게
     * 다른 컴포넌트(예: `HLayout`, `HInput`, `HButton`, `HDropdown`)를 배치할 수 있습니다.
     * 열림/닫힘 애니메이션은 순수 CSS로 동작하며(0fr ↔ 1fr), 인스턴스별로 duration/easing을 제어할 수 있습니다.
     *
     * ---
     *
     * ### 🎯 Features
     * - Header 고정 + Body 접기/펼치기
     * - Content 슬롯으로 **임의 레이아웃/컴포넌트** 배치
     * - Header 텍스트 정렬(`left` / `center` / `right`)
     * - 순수 CSS 기반 애니메이션(기본 0.5s / `ease`) — 인스턴스별 `duration`, `easing` 제어
     * - 런타임 제어 API: `hison.component.getAccordion(id)`
     * - 기본 caret(▾) 제공, `#toggle` 슬롯으로 **토글 UI 교체 가능**
     * - `hison-*` 반응형 클래스 처리 및 색/사이즈 테마(`hison-color-*`, `hison-size-*`) 자동 suffix 부여(`-accordion`)
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HAccordion
     *   id="acc1"
     *   class="hison-col-12 hison-size-m-mb hison-size-s-pc hison-color-primary-pc"
     *   :defaultOpen="false"
     *   title="Filters"
     *   textAlign="center"
     * >
     *   <HLayout class="hison-col-12" style="height: 100px">
     *     <HInput class="hison-col-4" :modelValue="'abc'"/>
     *     <HButton class="hison-col-4" :text="'Search'"/>
     *     <HDropdown class="hison-col-4" :modelValue="{ value: null, options: [{label:'One', value:1}] }" />
     *   </HLayout>
     * </HAccordion>
     * ```
     *
     * #### Custom toggle
     * ```vue
     * <HAccordion id="acc2" title="Advanced" :defaultOpen="true">
     *   <template #toggle>
     *     <HButton class="hison-color-success" text="Toggle" />
     *   </template>
     *   <div>Any content here…</div>
     * </HAccordion>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * ```ts
     * const acc = hison.component.getAccordion('acc1')
     * acc.open()
     * acc.setTitle('Advanced Filters')
     * acc.setTextAlign('right')
     * acc.setDuration(800)
     * acc.setEasing('ease-in-out')
     * ```
     *
     * ---
     *
     * @slot title   헤더 타이틀 영역을 완전히 대체합니다. 미제공 시 `title` prop 사용.
     * @slot toggle  우측 토글 UI를 대체합니다. 미제공 시 기본 caret(▾) 렌더링(HDropdown과 동일 클래스 사용).
     * @slot default 본문 컨텐츠(slot). 임의의 컴포넌트를 배치할 수 있습니다.
     *
     * @prop {string} id - 유니크한 식별자. `hison.component.getAccordion(id)`로 런타임 접근.
     * @prop {string | string[] | Record<string, boolean>} [class] - 추가 클래스. `hison-*` 반응형 시스템 지원.
     * @prop {string | CSSProperties | CSSProperties[]} [style] - 루트 컨테이너 인라인 스타일. (여기서 내려보낸 CSS 변수 `--hacc-duration`, `--hacc-easing`가 사용됨)
     * @prop {string | CSSProperties | CSSProperties[]} [headerStyle] - 헤더 영역 인라인 스타일.
     * @prop {string | CSSProperties | CSSProperties[]} [contentStyle] - 본문 컨테이너 인라인 스타일.
     *
     * @prop {boolean} [visible=true] - 표시 여부.
     * @prop {boolean} [defaultOpen=false] - 초기 열림 상태.
     * @prop {string}  [title=''] - 헤더 타이틀(슬롯 `#title` 미사용 시 적용).
     * @prop {('left'|'center'|'right')} [textAlign='left'] - 헤더 타이틀 정렬.
     * @prop {boolean} [animate=true] - 열림/닫힘 애니메이션 활성화.
     * @prop {number}  [duration=500] - 애니메이션 시간(ms). 인스턴스별로 CSS 변수 `--hacc-duration`로 전달.
     * @prop {string}  [easing='ease'] - CSS timing function. 인스턴스별로 CSS 변수 `--hacc-easing`로 전달.
     *
     * ---
     *
     * @event mounted - 마운트 시점에 발생. `(HAccordionMethods)`
     * @event responsive-change - 디바이스 분기 변경 시 발생(`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     * @event open - 본문이 펼쳐질 때 발생. `(Event|null, HAccordionMethods)`
     * @event close - 본문이 접힐 때 발생. `(Event|null, HAccordionMethods)`
     * @event toggle - 헤더 클릭/Enter/Space로 토글될 때 발생. `(MouseEvent|KeyboardEvent, HAccordionMethods)`
     *
     * ---
     *
     * #### ♿ Accessibility
     * - Header: `role="button"`, `tabindex="0"`, `aria-expanded`
     * - Content: `role="region"`, `aria-hidden`
     */
    HAccordion: typeof HAccordion

    /** */
    HBaggie: typeof HBaggie

    /**
     * Hisonvue custom button component.
     *
     * `HButton` is a highly customizable and responsive button component that provides styling, state control,
     * and dynamic behavior via props and runtime methods. It is integrated with `hisonCloser` for global access and control.
     *
     * ---
     *
     * ### 🎯 Features
     * - Theme-aware styling via responsive class system (`hison-size-*`, `hison-color-*`, etc.)
     * - **Flexible background type control via `backgroundType` prop or methods**  
     *   (supports `"filled"` (default), `"empty"`, and `"transparent"` backgrounds, always preserving button's color scheme)
     * - **Automatic prevention of double-clicks:**  
     *   - Blocks additional clicks while the click handler is running (using pending lock).
     *   - Provides `unlock()` method for manual unlock in advanced use cases.
     * - **Physical click interval limiting:**  
     *   - `clickInterval` prop and methods let you enforce a minimum time between button clicks (e.g. 500ms).
     * - Dynamic visibility and disabled state (`visible`, `disable` props)
     * - Runtime method control (`setText`, `setDisable`, `setVisible`, etc.)
     * - Supports both slot-based and `text` prop-based content:
     *   - If default slot is present, it overrides `text`
     *   - Otherwise, `text` is rendered inside the button
     * - Optional `#icon` slot allows prepending a custom icon or element before the text
     * - Tooltip support via `title` prop and dynamic `setTitle` method
     * - Automatically emits full runtime method object on DOM events (e.g. `@click="(_, btn) => btn.setDisable(true)"`)
     * - Device-aware responsive reload (`@responsive-change`)
     * - Integrated CSS event hooks for advanced interaction logic
     * - Seamless reload via internal `registerReloadable()` support
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <!-- Text-based button with custom background and click interval -->
     * <HButton
     *   id="btn01"
     *   class="hison-col-6 hison-color-primary"
     *   text="Click Me"
     *   title="Tooltip text"
     *   background-type="empty"
     *   :click-interval="500"
     *   :disable="false"
     *   :visible="true"
     *   @click="async (_, btn) => {
     *     // Your async logic
     *     await doSomething();
     *     btn.unlock(); // (optional) manually unlock if needed
     *   }"
     * />
     *
     * <!-- Default slot content -->
     * <HButton id="btn02">
     *   <strong>Custom Slot</strong>
     * </HButton>
     *
     * <!-- With icon slot -->
     * <HButton id="btn03" text="Download">
     *   <template #icon>
     *     <i class="fa fa-download" style="margin-right: 4px" />
     *   </template>
     * </HButton>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Use `hison.component.getButton(id)` to retrieve control methods at runtime:
     *
     * ```ts
     * const btn = hison.component.getButton('btn01');
     * btn.setText('Updated');
     * btn.setDisable(true);
     * btn.setVisible(false);
     * btn.setTitle('Updated tooltip');
     * btn.setBackgroundType('transparent'); // change to transparent background
     * btn.setClickInterval(1000); // set to allow clicks every 1 second
     * btn.unlock(); // manually unlock if you want to allow another click before async handler resolves
     * ```
     *
     * ---
     *
     * @prop {string} id - Unique button identifier. Enables runtime access via `hison.component.getButton(id)`.
     * @prop {string | string[] | Record<string, boolean>} [class] - Additional class string. Supports `hison-*` responsive system.
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline CSS style.
     * @prop {boolean} [visible] - Whether the button is shown (`'true'` or `'false'`). Default: `'true'`.
     * @prop {boolean} [disable] - Whether the button is disabled. Default: `'false'`.
     * @prop {string} [text] - Fallback label text if no default slot is provided. Can be updated at runtime.
     * @prop {string} [title] - Tooltip text. Can be updated via `setTitle()`.
     * @prop {boolean} [border] - Whether to show border (box-shadow). Default: `true`.
     * @prop {('filled'|'empty'|'transparent')} [backgroundType] - Background style. `'filled'` (default), `'empty'`, or `'transparent'`. Can be changed at runtime via methods.
     * @prop {number} [clickInterval] - Minimum interval (in ms) between allowed clicks. Prevents repeated clicks within the specified time. Can be changed at runtime.
     * @prop {number|string|null} [tabIndex] - `tabindex` for element. `0` = natural focus order, `null` = not focusable.
     *
     * ---
     *
     * @slot default - Default content inside the button. Overrides `text` prop if present.
     * @slot icon - Optional icon or prefix element rendered before the button label.
     *
     * ---
     *
     * @event mounted - Emitted after mounting. Passes `HButtonMethods` instance.
     * @event click - Emitted on click. Passes `(MouseEvent, HButtonMethods)` tuple.
     * @event mousedown - Emitted on mousedown. Passes `(MouseEvent, HButtonMethods)` tuple.
     * @event mouseup - Emitted on mouseup. Passes `(MouseEvent, HButtonMethods)` tuple.
     * @event mouseover - Emitted on mouseover. Passes `(MouseEvent, HButtonMethods)` tuple.
     * @event mouseout - Emitted on mouseout. Passes `(MouseEvent, HButtonMethods)` tuple.
     * @event responsive-change - Emitted on device class change (`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     */
    HButton: typeof HButton

    /**
     * Hisonvue custom calendar component.
     *
     * ### Built with `vue-cal@^4.10.2` for full compatibility.
     * `HCalendar` is a fully-featured calendar component built on top of `vue-cal`,
     * designed for seamless integration with Hison runtime. It supports multiple views,
     * event scheduling, special time ranges, localization, and dynamic configuration.
     *
     * ---
     *
     * ### 📅 Features
     * - Multiple views supported: `'day'`, `'week'`, `'month'`, `'year'`, `'years'`
     * - Dynamic runtime control via `HCalendarMethods` (`hison.component.getCalendar(id)`)
     * - Responsive layout using `hison-col-*`, `hison-pos-*`, `hison-size-*` classes
     * - Visual customization: weekend colors, special time zones, date highlights
     * - Event data rendering with full editing options (`deletable`, `resizable`, etc.)
     * - Device-aware styling and slot passthrough support
     *
     * ---
     *
     * ### 🔄 Compatibility with vue-cal
     * `HCalendar` transparently passes any additional `props` and `events` directly to the underlying `vue-cal` instance.
     * 👉 **If a prop or event is not listed in this documentation, you can still use it exactly as defined in `vue-cal`.**
     * 📚 For full list of available options, refer to:  
     * https://antoniandre.github.io/vue-cal
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HCalendar
     *   id="calendar1"
     *   class="hison-col-12"
     *   :selectedDate="today"
     *   :events="myEvents"
     *   :specialTime="highlightedRanges"
     *   weekendColor="#f55"
     *   :weekendDays="[0, 6]"
     *   :showTodayColor="true"
     *   :hideWeekdays="[2]"
     *   :disableDays="['2025-06-30']"
     *   :visible="true"
     *   :disable="false"
     *   :startWeekOnSunday="false"
     *   :locale="'ko'"
     *   activeView="month"
     *   :disableViews="['year', 'years']"
     *   @day-click="handleDayClick"
     * />
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Use `hison.component.getCalendar(id)` to retrieve methods at runtime:
     *
     * ```ts
     * const calendar = hison.component.getCalendar('calendarId');
     * calendar.setVisible(false);
     * calendar.setDisable(true);
     * calendar.setSelectedDate('2025-07-01');
     * calendar.setEvents([{ start: '2025-07-02', end: '2025-07-02', title: 'Meeting' }]);
     * calendar.setTimeFormat('HH:mm');
     * calendar.setActiveView('week');
     * ```
     *
     * ---
     *
     * @prop {string} id - Unique calendar identifier. Enables runtime access via `hison.component.getCalendar(id)`.
     * @prop {string | string[] | Record<string, boolean>} [class] - Additional class string. Supports `hison-*` responsive system.
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline CSS style.
     * @prop {boolean} [visible='true'] - Whether the calendar is shown.
     * @prop {boolean} [disable=false] - Whether the calendar is disabled.
     * @prop {string | Date} [selectedDate] - Initially selected date.
     * @prop {HCalendarEvent[]} [events=[]] - List of events to display.
     * @prop {string} [weekendColor] - CSS color for weekend background.
     * @prop {number[]} [weekendDays] - Indexes of days (0~6) treated as weekends.
     * @prop {boolean} [showTodayColor=true] - Highlight today’s date with a background.
     * @prop {string} [selectedColor] - CSS background for selected date.
     * @prop {HCalendarSpecialTimeMap} [specialTime] - Map of special time ranges by weekday.
     * @prop {number} [dateCellMinHeight] - Minimum height of date cell in month view (px).
     * @prop {number} [dateCellMaxHeight] - Maximum height of date cell in month view (px).
     * @prop {string[]} [disableDays] - List of dates to disable selection.
     * @prop {string | boolean} [eventsOnMonthView=false] - Controls event rendering in month view.
     * @prop {number[]} [hideWeekdays] - Weekdays to hide (0 = Sun, ..., 6 = Sat).
     * @prop {boolean} [hideWeekends=false] - Whether to hide weekends.
     * @prop {string} [locale='en'] - Calendar language locale.
     * @prop {string | Date} [maxDate] - Maximum selectable date.
     * @prop {string | Date} [minDate] - Minimum selectable date.
     * @prop {boolean} [startWeekOnSunday=false] - Whether the week starts on Sunday.
     * @prop {boolean} [time=true] - Whether to show time cells in week/day views.
     * @prop {number} [timeCellHeight] - Height of each time cell (px).
     * @prop {('H' | 'HH' | 'h' | 'hh' | 'm' | 'mm' | 'H:m' | 'H:mm' | 'HH:m' | 'HH:mm' | 'h:m' | 'h:mm' | 'hh:m' | 'hh:mm' | 'H{am}' | 'HH{am}' | 'h{am}' | 'hh{am}' | 'm{am}' | 'mm{am}' | 'H:m{am}' | 'H:mm{am}' | 'HH:m{am}' | 'HH:mm{am}' | 'h:m{am}' | 'h:mm{am}' | 'hh:m{am}' | 'hh:mm{am}')} [timeFormat] - Format for displaying time cells.
     * @prop {number} [timeFrom] - Start of time range (minutes from midnight).
     * @prop {number} [timeStep] - Interval step for time slots (in minutes).
     * @prop {number} [timeTo] - End of time range (minutes from midnight).
     * @prop {boolean} [hideTitleBar=false] - Whether to hide the title bar.
     * @prop {boolean} [twelveHour=false] - Whether to show time in 12-hour format (with am/pm).
     * @prop {('day' | 'week' | 'month' | 'year' | 'years')} [activeView] - Initial view (`'day'`, `'week'`, `'month'`, etc.).
     * @prop {('day' | 'week' | 'month' | 'year' | 'years')[]} [disableViews] - Views to exclude from navigation.
     *
     * ---
     *
     * @event ready - Emitted once after initial render. Passes { view, startDate, endDate, week? }.
     * @event mounted - Emitted when the calendar is mounted.
     * @event responsive-change - Emitted when responsive device class changes.
     * @event cell-click - Emitted when an cell is clicked.
     * @event view-change - Emitted when the calendar view changes.
     * @event nav-click - Emitted when a navigation arrow is clicked. Passes { direction: 'prev' | 'next' }.
     * @event title-click - Emitted when the calendar header title is clicked. Passes { date, view }.
     * @event hour-click - Emitted when an hour slot is clicked in day/week view. Passes { date, view, hour }.
     * @event time-range-select - Emitted when selecting a time range via drag. Passes { startDate, endDate }.
     * @event event-click - Emitted when an event is clicked. Passes the event object.
     * @event event-dblclick - Emitted when an event is double-clicked. Passes the event object.
     * @event event-create - Emitted after creating a new event. Passes (event, action) where action is 'click' or 'drag'.
     * @event event-delete - Emitted when an event is deleted. Passes the deleted event object.
     * @event event-update - Emitted after an event is moved or resized. Passes (event, domEvent?).
     * @event event-drag-start - Emitted when an event drag starts. Passes the dragged event.
     * @event event-drag - Emitted continuously during event dragging. Passes the event.
     * @event event-drag-end - Emitted when dragging ends. Passes the event.
     * @event event-resize-start - Emitted when event resize starts. Passes the event.
     * @event event-resize - Emitted continuously during resize. Passes the event.
     * @event event-resize-end - Emitted when resize ends. Passes the event.
     * @event event-mouse-enter - Emitted when mouse enters an event block. Passes (event, mouseEvent).
     * @event event-mouse-leave - Emitted when mouse leaves an event block. Passes (event, mouseEvent).
     * @event cell-drag-start - Emitted when dragging on empty cell starts. Passes { startDate, endDate, view }.
     * @event cell-drag - Emitted during drag over cells. Passes { startDate, endDate, view }.
     * @event cell-drag-end - Emitted when dragging ends. Passes { startDate, endDate, view }.
     * @event cell-hover-in - Emitted when mouse enters a cell. Passes { date, view }.
     * @event cell-hover-out - Emitted when mouse leaves a cell. Passes { date, view }.
     */
    HCalendar: typeof HCalendar

    /**
     * Hisonvue custom caption (heading) component.
     *
     * `HCaption` is a semantic heading component (`<h1>`–`<h6>`) with theme-aware styling,
     * responsive behavior, and full runtime control. It is designed to replace raw `h1`–`h6`
     * tags with a consistent style system, while still preserving SEO/accessibility benefits.
     *
     * ---
     *
     * ### 🎯 Features
     * - Renders as actual heading tags (`<h1>` ~ `<h6>`) according to the `level` prop.
     * - Theme-aware styling via responsive class system (`hison-size-*`, `hison-color-*`, etc.).
     * - **Dynamic content control:**
     *   - Uses `text` prop if no slot is provided.
     *   - If default slot is *pure text nodes*, they are absorbed and controllable via `getText/setText`.
     *   - If default slot contains elements, slot content takes precedence and text control is disabled.
     * - **Font style toggles**: `fontBold`, `fontItalic`, `fontThruline`, `fontUnderline`.
     * - **Border (box-shadow) toggle**: `border` prop or runtime methods.
     * - **Background type control**: `backgroundType` prop or runtime methods (`'empty'` (default), `'filled'`, `'transparent'`).
     * - Text alignment via `textAlign` prop and runtime methods (`'left' | 'center' | 'right'`).
     * - Tooltip support via `title` prop and dynamic `setTitle` method.
     * - Emits runtime method object on interaction events (`click`, `mouseover`, etc.).
     * - Device-aware responsive reload (`@responsive-change`).
     * - Seamless reload via internal `registerReloadable()` support.
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <!-- Simple caption -->
     * <HCaption
     *   id="cp1"
     *   class="hison-col-12 hison-size-l hison-color-primary"
     *   text="Main Title"
     *   level="1"
     * />
     *
     * <!-- Slot with custom HTML (overrides text control) -->
     * <HCaption id="cp2" level="2">
     *   <strong>Highlighted</strong> Section
     * </HCaption>
     *
     * <!-- Pure text slot behaves like text prop -->
     * <HCaption id="cp3" level="3">Section Title</HCaption>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Use `hison.component.getCaption(id)` to retrieve control methods at runtime:
     *
     * ```ts
     * const cp = hison.component.getCaption('cp1');
     * cp.setLevel(2);
     * cp.setText('Updated Title');
     * cp.setTextAlign('center');
     * cp.setFontBold(true);
     * cp.setBorder(true);
     * cp.setBackgroundType('transparent');
     * ```
     *
     * ---
     *
     * @prop {string} id - Unique caption identifier. Enables runtime access via `hison.component.getCaption(id)`.
     * @prop {string | string[] | Record<string, boolean>} [class] - Additional class string. Supports `hison-*` responsive system.
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline CSS style.
     * @prop {boolean} [visible] - Whether the caption is shown. Default: `true`.
     * @prop {string} [text] - Text content if no slot is used. If slot is pure text, it is converted to internal text as well.
     * @prop {string} [title] - Tooltip text. Can be updated via `setTitle()`.
     * @prop {1|2|3|4|5|6} [level] - Heading level, determines which tag (`<h1>`~`<h6>`) is rendered. Default: `3`.
     * @prop {('left'|'center'|'right')} [textAlign] - Text alignment. Can be changed via methods.
     * @prop {boolean} [border] - Whether to show border (box-shadow). Default: `false`.
     * @prop {('filled'|'empty'|'transparent')} [backgroundType] - Background style. `'empty'` (default), `'filled'`, or `'transparent'`.
     * @prop {boolean} [fontBold] - Bold font style toggle. Default: `true`.
     * @prop {boolean} [fontItalic] - Italic font style toggle. Default: `false`.
     * @prop {boolean} [fontThruline] - Strikethrough font style toggle. Default: `false`.
     * @prop {boolean} [fontUnderline] - Underline font style toggle. Default: `false`.
     *
     * ---
     *
     * @slot default - Default content inside the caption. If only text nodes are provided, behaves like `text` prop (controllable by methods). If elements are provided, overrides text control.
     *
     * ---
     *
     * @event mounted - Emitted after mounting. Passes `HCaptionMethods` instance.
     * @event click - Emitted on click. Passes `(MouseEvent, HCaptionMethods)`.
     * @event mousedown - Emitted on mousedown. Passes `(MouseEvent, HCaptionMethods)`.
     * @event mouseup - Emitted on mouseup. Passes `(MouseEvent, HCaptionMethods)`.
     * @event mouseover - Emitted on mouseover. Passes `(MouseEvent, HCaptionMethods)`.
     * @event mouseout - Emitted on mouseout. Passes `(MouseEvent, HCaptionMethods)`.
     * @event responsive-change - Emitted on device class change (`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     */
    HCaption: typeof HCaption

    /**
     * Hisonvue chart component powered by Chart.js.
     *
     * ### Built with `chart.js@^4.5.0`
     * `HChart` is a lightweight wrapper around [Chart.js](https://www.chartjs.org/),
     * offering full compatibility with all standard chart types, configuration options, and runtime methods.
     *
     * ---
     *
     * #### ⚡️ Robust Chart Instance Lifecycle
     * - **Race-condition safe**: Internal logic guarantees Chart.js `destroy()` and re-creation never overlap,
     *   preventing plugin/DOM errors during rapid reloads, SSR hydration, or hot re-renders.
     * - **DOM-flush guaranteed**: On reload or unmount, the `<canvas>` element is physically removed from the DOM (`v-if="!isPending"`),
     *   and re-created after a flush delay. This ensures Chart.js always operates on a stable, isolated DOM context.
     * - **Configurable reload delay**: The `loadDelay` prop (default: `500ms`) can be adjusted to tune the time between destroy/re-mount.
     *   - Change at runtime via `chartInstance.setLoadDelay(ms)`.
     * - **Single source of chart creation**: The chart creation logic is encapsulated in a single internal function and reused for all lifecycle events.
     *
     * ---
     *
     * ### Features
     * - Supports all built-in Chart.js chart types (`'bar'`, `'line'`, `'pie'`, `'doughnut'`, etc.)
     * - **Full runtime access** via `HChartInstance` (`hison.component.getChart(id)`)
     * - Minimal hisonvue-only styling (`hison-col-*`, `display: none` when hidden)
     * - Automatic color string parsing (e.g., `'red.500'` → rgba format)
     * - Reactive support: Any change to `modelValue`/`options` automatically triggers chart update.
     * - **Direct control of visibility** (`visible` prop, `.setVisible()`)
     * - **Robust hot reload support**: Frequent destroy/recreate cycles are fully safe.
     *
     * ---
     *
     * ### Chart.js Compatibility
     * `HChart` passes your `modelValue` and `options` directly to the native Chart.js engine.
     * There is **no rewriting or abstraction** of Chart.js behavior.
     *
     * 👉 You may refer to the official Chart.js documentation for full API usage:
     * - [ChartData](https://www.chartjs.org/docs/4.5.0/general/data-structures.html)
     * - [ChartOptions](https://www.chartjs.org/docs/4.5.0/configuration/)
     * - [Chart Methods](https://www.chartjs.org/docs/4.5.0/developers/api.html)
     *
     * ---
     *
     * ### Usage Example
     * ```vue
     * <HChart
     *   id="myChart"
     *   type="doughnut"
     *   class="hison-col-6"
     *   :modelValue="chartData"
     *   :options="chartOptions"
     *   :loadDelay="800"
     * />
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage & Methods
     * Use `hison.component.getChart(id)` to retrieve the extended Chart.js instance:
     *
     * ```ts
     * const chart = hison.component.getChart('myChart')
     * chart.data.datasets[0].data = [10, 20, 30]
     * chart.options.plugins.legend.display = false
     * chart.update()
     * chart.setVisible(false)
     * chart.setLoadDelay(1000)  // Change reload delay at runtime
     * chart.reload()            // Safe reload (will never cause plugin/DOM errors)
     * ```
     *
     * ---
     *
     * ### Props
     * @prop {string} id - Unique chart identifier. Enables runtime access via `hison.component.getChart(id)`.
     * @prop {string | string[] | Record<string, boolean>} [class] - Additional responsive class string (e.g., `hison-col-6`).
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline CSS styles.
     * @prop {ChartType} type - Chart.js chart type (e.g., `'line'`, `'bar'`, `'pie'`).
     * @prop {ChartData} modelValue - Chart.js data object (used with `v-model`).
     * @prop {ChartOptions} [options] - Optional Chart.js configuration object.
     * @prop {boolean} [visible=true] - Whether the chart is visible.
     * @prop {number} [loadDelay=500] - (ms) Delay between destroy and re-mount on reload. Prevents plugin/DOM race-conditions.  
     *    Can be changed at runtime via `chartInstance.setLoadDelay()`.
     *
     * ---
     *
     * ### Events
     * @event mounted - Emitted when the chart instance is initialized.
     * @event responsive-change - Emitted when responsive class changes due to device detection.
     */
    HChart: typeof HChart
    
    /**
     * Hisonvue custom drawer component.
     *
     * `HDrawer` renders a fixed-position sliding panel attached to one edge of the viewport
     * (top, bottom, left, or right). It supports edge-specific animations, configurable
     * width/height, optional overlay, swipe-to-close gestures, and full runtime control via
     * `HDrawerMethods` (open/close, position, resize with animation, etc.).
     *
     * ---
     *
     * ### 🎯 Features
     * - Edge anchoring via `position` (`'top'`, `'bottom'`, `'left'`, `'right'`)
     * - Default sizing per edge:
     *   - Top/Bottom: full width (`100vw`), dynamic height
     *   - Left/Right: full height (`100vh`), dynamic width
     * - Built-in enter/leave animations depending on edge (slide-in/out from that side)
     * - Overlay/backdrop with configurable visibility and click-to-close behavior
     * - Optional close button (`closeButtonVisible`) with slot customization
     * - Swipe-to-close support (touch/pointer gestures by edge direction)
     * - Runtime registration using unique `id`, accessible via `hison.component.getDrawer(id)`
     * - Scroll lock with **reference counting** (safe for multiple drawers)
     * - Responsive class extraction (`hison-col-*`, `hison-size-*`, `hison-color-*`)
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HDrawer
     *   id="drawer01"
     *   class="hison-col-12"
     *   :visible="false"
     *   :border="true"
     *   :zIndex="1100"
     *   position="left"
     *   :width="300"
     *   :height="null"
     *   :closeButtonVisible="true"
     *   closeButtonText="X"
     *   closeButtonTitle="닫기"
     *   :swipeClose="true"
     *   :closeClickOverlay="true"
     *   :showOverlay="true"
     *   :overlayStyle="{ background: 'rgba(0,0,0,0.35)' }"
     *   :scrollLock="true"
     *   enterAnimationClass="hison-drawer-enter-left"
     *   leaveAnimationClass="hison-drawer-leave-left"
     *   @open="onOpen"
     *   @close="onClose"
     *   @responsive-change="onDevice"
     * >
     *   <template #default>
     *     drawer content...
     *   </template>
     *
     *   <!-- replace whole close button -->
     *   <template #close-button="{ onClick, text, title }">
     *     <MyCustomClose :label="text" :title="title" @click="onClick" />
     *   </template>
     *
     *   <!-- or override parts only -->
     *   <template #close-icon>❌</template>
     *   <template #close-label>닫기</template>
     * </HDrawer>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Access the drawer programmatically using `hison.component.getDrawer(id)`:
     *
     * ```ts
     * const drawer = hison.component.getDrawer('drawer01');
     * drawer.open();
     * drawer.setPosition('right');
     * drawer.setWidth(400, true);   // animate width change
     * drawer.setZIndex(1500);
     * ```
     *
     * ---
     *
     * ### ⚠️ Notes on z-index, sizing & gestures
     * - `zIndex` controls the wrapper’s stacking order; the overlay is always rendered at `zIndex - 1`.
     * - Width/Height props may be animated (`setWidth`/`setHeight`) for smooth expansion/collapse.
     * - Swipe gestures close the drawer only in the **opposite edge direction** (e.g. swipe down on top drawer).
     * - Scroll locking is **reference-counted**; closing one drawer will not unlock the page if others remain open.
     *
     * ---
     *
     * @prop {string} id - Unique drawer identifier for method registration (`hison.component.getDrawer(id)`).
     * @prop {string | string[] | Record<string, boolean>} [class] - Responsive/custom classes (`hison-col-*`, etc.).
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline style for the drawer container.
     * @prop {boolean} [visible=false] - Initial visibility (subsequent control via methods only).
     *
     * @prop {boolean} [border=true] - Whether the drawer has border (box-shadow).
     *
     * @prop {number} [zIndex=1100] - Stacking context for the drawer; overlay uses `zIndex - 1`.
     * @prop {('top'|'bottom'|'left'|'right')} [position='bottom'] - Edge position where the drawer is anchored.
     *
     * @prop {number|null} [width=null] - Drawer width in pixels (optional; defaults vary by edge).
     * @prop {number|null} [height=null] - Drawer height in pixels (optional; defaults vary by edge).
     *
     * @prop {boolean} [closeButtonVisible=true] - Close button visibility.
     * @prop {string} [closeButtonText='X'] - Close button label.
     * @prop {string} [closeButtonTitle='close'] - Close button title attribute.
     *
     * @prop {boolean} [swipeClose=true] - Whether swipe-to-close gestures are enabled.
     *
     * @prop {boolean} [closeClickOverlay=true] - Whether clicking the overlay closes the drawer.
     * @prop {boolean} [showOverlay=true] - Whether the overlay (backdrop) is shown.
     * @prop {string | CSSProperties | CSSProperties[]} [overlayStyle] - Inline style for the overlay (merged with computed `zIndex - 1`).
     *
     * @prop {boolean} [scrollLock=true] - Whether to lock page scroll while the drawer is visible (reference-counted).
     *
     * @prop {string} [enterAnimationClass] - CSS class for enter animation.
     * @prop {string} [leaveAnimationClass] - CSS class for leave animation.
     *
     * ---
     *
     * @event mounted - Emitted on mount. Returns `HDrawerMethods` instance for runtime control.
     * @event open - Emitted when the drawer opens (after entering animation starts).
     * @event close - Emitted when the drawer closes (after leaving animation finishes).
     * @event responsive-change - Emitted when device type changes (`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     */
    HDrawer: typeof HDrawer

    /**
     * Hisonvue custom dropdown component.
     *
     * `HDropdown`는 HInput 톤을 공유하는 가벼운 셀렉트/드롭다운입니다.
     * 토글(열기/닫기), 선택/옵션 제어, 트리거 모드(click/hover), 텍스트 정렬, 편집 상태에 더해
     * **아코디언과 동일한 애니메이션 시스템(0fr↔1fr Grid 전환 + caret 회전)**을 제공합니다.
     * caret UI는 슬롯으로 교체 가능하며, 애니메이션은 인스턴스별로 제어할 수 있습니다.
     *
     * ---
     *
     * ### 🎯 Features
     * - 인풋처럼 보이는 깔끔한 룩(테두리 없음; 컬러 테마 그림자 틴트)
     * - 트리거 모드: **click** or **hover**
     * - 편집 상태:
     *   - **editable**: 전체 상호작용 가능
     *   - **readonly**: 텍스트처럼 보이며(캐럿/메뉴 숨김) 열 수 없음
     *   - **disable**: 흐리게, 비활성
     * - 토글/메뉴 **텍스트 정렬** (`left` / `center` / `right`)
     * - **아코디언과 동일한 열림/닫힘 애니메이션**: CSS Grid `grid-template-rows: 0fr ↔ 1fr`
     * - **Caret 회전 애니메이션**: 열릴 때 180° 회전
     * - **애니메이션 제어**: `animate`, `duration`, `easing` (인스턴스별 CSS 변수 `--hdd-duration`, `--hdd-easing` 사용)
     * - 내부 스크롤이 있는 **maxHeight** 지원
     * - 런타임 API: `hison.component.getDropdown(id)`
     * - 커스텀 캐럿: `<slot name="caret">`
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HDropdown
     *   id="country"
     *   :modelValue="{ value: 'KR', options: [
     *     { label: 'Korea', value: 'KR' },
     *     { label: 'Japan', value: 'JP' }
     *   ]}"
     *   placeholder="Select country"
     *   trigger="click"
     *   :maxHeight="240"
     *   :animate="true"
     *   :duration="500"
     *   easing="ease"
     * />
     * ```
     *
     * #### Custom caret
     * ```vue
     * <HDropdown :modelValue="model">
     *   <template #caret>
     *     <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
     *       <path d="M7 10l5 5 5-5H7z" />
     *     </svg>
     *   </template>
     * </HDropdown>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * ```ts
     * const dd = hison.component.getDropdown('country')
     * dd.open()
     * dd.setOptions([{ label: 'Korea', value: 'KR' }])
     * dd.setValue('KR')
     * dd.setEditMode('readonly')
     * dd.setTextAlign('center')
     * dd.setCloseOnSelect(false)
     * dd.setMaxHeight(180)
     * // 애니메이션 제어 (Accordion과 동일)
     * dd.setAnimate(true)
     * dd.setDuration(500)
     * dd.setEasing('ease-in-out')
     * ```
     *
     * ---
     *
     * @slot caret Override the toggle caret. If omitted, a default ▾ is shown.
     *
     * @prop {string} id - Unique dropdown identifier. Enables runtime access via `hison.component.getDropdown(id)`.
     * @prop {string | string[] | Record<string, boolean>} [class] - Additional class string. Supports the `hison-*` responsive system.
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline style for the root container.
     * @prop {string | CSSProperties | CSSProperties[]} [toggleStyle] - Inline style for the toggle area.
     * @prop {string | CSSProperties | CSSProperties[]} [menuStyle] - Inline style for the menu container.
     * @prop {string | CSSProperties | CSSProperties[]} [itemStyle] - Inline style for each menu item.
     *
     * @prop {boolean} [visible=true] - Whether the dropdown is shown.
     * @prop {('editable' | 'disable' | 'readonly')} [editMode='editable'] - Edit state: `'editable'`, `'readonly'`, `'disable'`.
     * @prop {string} [placeholder=''] - Placeholder shown when no value is selected.
     * @prop {('click'|'hover')} [trigger='click'] - How the menu opens.
     *
     * @prop {HDropdownModel} modelValue - v-model object `{ value: any, options: HDropdownOption[] }`.
     * @prop {number} [maxHeight=240] - Max menu height (px). Overflow scrolls (applied to inner panel).
     * @prop {boolean} [closeOnSelect=true] - Close menu after selecting an option.
     * @prop {('left'|'center'|'right')} [textAlign='left'] - Text alignment for both toggle and menu.
     *
     * @prop {boolean} [animate=true] - Enable expand/collapse animation (CSS Grid 0fr↔1fr & caret rotation).
     * @prop {number}  [duration=500] - Animation duration in ms. Reflected to CSS variable `--hdd-duration`.
     * @prop {string}  [easing='ease'] - CSS timing function. Reflected to CSS variable `--hdd-easing`.
     *
     * ---
     *
     * @event mounted - Emitted on mount. `(HDropdownMethods)`
     * @event responsive-change - Emitted on device class change (`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     * @event update:modelValue - Emitted when selection changes. `(HDropdownModel)`
     *
     * @event open - Emitted when the menu opens. `(Event|null, HDropdownMethods)`
     * @event close - Emitted when the menu closes. `(Event|null, HDropdownMethods)`
     * @event toggle-click - Emitted when the toggle is clicked/Enter-pressed. `(MouseEvent|KeyboardEvent, HDropdownMethods)`
     * @event item-click - Emitted when an item is clicked. `(MouseEvent, HDropdownMethods, HDropdownOption)`
     * @event change - Emitted after selection changes. `(oldValue: any, newValue: any, HDropdownMethods)`
     *
     * ---
     *
     * #### ♿ Accessibility
     * - Toggle: `role="combobox"`, `aria-expanded`, `aria-disabled`
     * - Menu: `role="listbox"`, `aria-activedescendant`, `aria-hidden`
     */
    HDropdown: typeof HDropdown

    /**
     * Hisonvue file attachment component.
     *
     * `HFileset` is a fully reactive, feature-rich file upload and management UI for Vue 3.
     * Designed for business and enterprise projects, it supports multi-file handling, drag-and-drop,
     * advanced validation, and complete runtime API integration.
     * Provides a highly customizable interface with support for custom icons, buttons, and download logic.
     * Integrates tightly with `hison.vue.getInput(id)` for programmatic control.
     *
     * ---
     *
     * ### 🎯 Features
     * - **Multi-file upload** (or single file mode) with preview, removal, and preloaded value sync.
     * - **Drag-and-drop** support with visual feedback and restriction controls.
     * - **Per-file & total file size limits**, with rejection and event/callback notification.
     * - **Allowed/disallowed types** by MIME or extension, with callbacks and slot customization.
     * - **Customizable UI**: Add/remove button labels, placeholder, and slot-based icon/button overrides.
     * - **Responsive layout**: Fully stylable using hisonvue's responsive class utilities.
     * - **Runtime API**: Access and control everything at runtime using `HFilesetMethods`.
     * - **Custom download**: Secure and extend download via custom handler.
     * - **Integration**: Programmatic access via `hison.vue.getInput(id)`.
     * - **Add button control**: Built-in add button id is `hison_fileset_add_button_${id}` — get it via
     *   `hison.component.getButton(\`hison_fileset_add_button_${id}\`)`.
     * - **Full slot support**: Custom icons, add/remove button, even drag-drop interaction.
     *
     * ---
     *
     * ### ⚙️ Usage Example
     * ```vue
     * <HFileset
     *   id="fileset"
     *   class="hison-col-12 hison-size-l-mb hison-size-s-pc hison-pos-right hison-color-primary-mb hison-color-success-pc"
     *   v-model="files"
     *   :multiCols="true"
     *   :placeholder="'No files.'"
     *   :addButtonText="'UPLOAD'"
     *   :removeButtonText="'DELETE'"
     *   :enableDrop="true"
     *   :visible="true"
     *   :editMode="EditMode.editable"
     *   :multiple="true"
     *   :maxFileCount="3"
     *   :allowedTypes="['.pdf', '.jpg', '.png']"
     *   style="height: 200px; margin-bottom: 5px;"
     * >
     *   <template #file-icon="{ file }">
     *     <span v-if="file.extension === 'pdf'">📕</span>
     *     <span v-else-if="file.extension === 'jpg'">🖼️</span>
     *     <span v-else>📄</span>
     *   </template>
     *   <template #add-button="{ add, disable }">
     *     <span>📁 Add files</span>
     *   </template>
     * </HFileset>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime API Usage
     * ```ts
     * const fileset = hison.vue.getInput('fileset')
     * fileset.setEditMode('readonly')
     * fileset.setAllowedTypes(['.pdf'])
     * fileset.setMaxFileCount(2)
     * fileset.setValue([{ fileName: 'final.pdf', ... }])
     * fileset.focus()
     *
     * // Access the built-in add button if needed:
     * const addBtn = hison.component.getButton(`hison_fileset_add_button_${'fileset'}`)
     * addBtn.setDisable(true)
     * ```
     *
     * ---
     *
     * @prop {string} [id] Unique identifier for the file set. Enables runtime access via `hison.vue.getInput(id)`. Duplicate IDs will throw an error.
     * @prop {string | string[] | Record<string, boolean>} [class] Additional class string. Supports all hisonvue responsive, color, and size classes.
     * @prop {string | CSSProperties | CSSProperties[]} [style] Inline CSS style for the container.
     * @prop {boolean} [visible=true] Controls component visibility.
     * @prop {('editable' | 'disable' | 'readonly')} [editMode='editable'] Edit state: `'editable'`, `'readonly'`, or `'disable'`.
     * @prop {AttachedFileItem[]} [modelValue=[]] File list (preloaded or new). Controlled via `v-model`.
     * @prop {string} [attId=''] Group ID for backend file association.
     * @prop {string} [addButtonText='Add'] Label for the add/upload button (if not using the `add-button` slot).
     * @prop {string} [removeButtonText='x'] Label for the remove button (if not using the `remove-button` slot).
     * @prop {string} [placeholder='drop your files.'] Message shown when file list is empty.
     * @prop {boolean} [enableDrop=true] Enables drag-and-drop file upload area.
     * @prop {(file: AttachedFileItem) => void} [downloadHandler] Custom download handler. Overrides default download logic.
     * @prop {boolean} [multiCols=false] Display files in multiple columns (two-row layout).
     * @prop {boolean} [multiple=true] Allow multiple file selection/upload.
     * @prop {string | string[]} [allowedTypes] Allowed MIME types or extensions. Accepts array or comma-separated string.
     * @prop {string | string[]} [disallowedTypes] Disallowed MIME types or extensions. Accepts array or comma-separated string.
     * @prop {number} [maxFileSize=Infinity] Maximum file size (bytes) per file. Exceeding files are rejected.
     * @prop {number} [maxTotalFileSize=Infinity] Maximum total size (bytes) for all files combined.
     * @prop {number} [maxFileCount=0] Maximum number of files allowed (0: unlimited).
     * @prop {(file: File, allowed: string[]|null, disallowed: string[]|null) => void} [onDisallowedType] Callback when file type/extension is not allowed.
     * @prop {(file: File, size: number, max: number) => void} [onMaxFileSizeExceeded] Callback when a file is too large.
     * @prop {(file: File, total: number, max: number) => void} [onMaxTotalSizeExceeded] Callback when total file size limit is exceeded.
     *
     * ---
     *
     * @event mounted Emitted on mount. Passes `HFilesetMethods` instance.
     * @event responsive-change Emitted on device class change (mobile/tablet/pc/wide).
     * @event update:modelValue Emitted when the file list changes (add, remove, delete, etc).
     * @event add Emitted when a file is added. Arguments: `(file: AttachedFileItem, methods: HFilesetMethods)`
     * @event remove Emitted when a file is removed. Arguments: `(file: AttachedFileItem, methods: HFilesetMethods)`
     * @event change Emitted whenever the file list is changed. Arguments: `(newList: AttachedFileItem[], oldList: AttachedFileItem[], methods: HFilesetMethods)`
     * @event download Emitted when a download is triggered. Arguments: `(file: AttachedFileItem, methods: HFilesetMethods)`
     * @event focus Emitted when the add button or file input receives focus.
     * @event blur Emitted when the file input or file set loses focus.
     *
     * ---
     *
     * @slot file-icon
     * Custom icon or markup to be shown before each file name. Receives the `file` object as a scoped prop.
     *
     * @example
     * <HFileset v-model="files">
     *   <template #file-icon="{ file }">
     *     <span v-if="file.extension === 'pdf'">📕</span>
     *     <span v-else-if="file.extension === 'jpg'">🖼️</span>
     *     <span v-else>📄</span>
     *   </template>
     * </HFileset>
     *
     * @slot remove-button
     * Custom slot for rendering the remove button beside each file (overrides default).
     * Scoped props:
     *   - `file: AttachedFileItem`
     *   - `index: number`
     *   - `remove: () => void`
     *   - `disable: boolean`
     *
     * @example
     * <HFileset v-model="files">
     *   <template #remove-button="{ file, index, remove, disable }">
     *     <span class="custom-remove-btn" :disabled="disable" @click="remove" style="cursor: pointer;">❌</span>
     *   </template>
     * </HFileset>
     *
     * @slot add-button
     * Custom slot for the contents **inside** the add button (`HButton`). Only replaces the button's content, not the button itself.
     * Scoped props:
     *   - `add: () => void` (opens file dialog)
     *   - `disable: boolean`
     *
     * @example
     * <HFileset v-model="files">
     *   <template #add-button="{ add, disable }">
     *     <span>📁 Select Files</span>
     *   </template>
     * </HFileset>
     */
    HFileset: typeof HFileset

    /**
     * Hisonvue gap/spacing component.
     *
     * `HGap` is a lightweight utility component for adding vertical or horizontal spacing in layouts.
     * It supports empty space, divider lines (`horizontal` / `vertical`), and full theme integration.
     * Runtime methods let you toggle visibility, background, border, and line style dynamically.
     *
     * ---
     *
     * ### 🎯 Features
     * - Responsive height sizing via `hison-size-*` classes (`s`, `m`, `l`, `xl`)  
     *   (matches the height scale used by `HLabel` / `HButton`)
     * - Flexible width control via `hison-col-*` grid system (`1`–`12`, default: `12`)
     * - **Line rendering options:**
     *   - `line="none"` → empty space only
     *   - `line="horizontal"` → horizontal divider line
     *   - `line="vertical"` → vertical divider line
     * - **Customizable line appearance:**  
     *   - `lineStyle` (solid, dashed, dotted, double, etc.)  
     *   - `lineWidth` (number in px or string unit)  
     *   - `lineColor` (CSS color string or theme auto if omitted)
     * - Theme-aware colors via `hison-color-*` classes (`primary`, `muted`, `info`, `success`, `danger`, `warning`)
     * - Optional border (subtle box-shadow) and background (`filled`, `empty`, `transparent`)
     * - Dynamic runtime control via `hison.component.getGap(id)`
     * - Device-aware responsive reload (`@responsive-change`)
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <!-- Simple empty gap -->
     * <HGap id="gap01" class="hison-col-12 hison-size-m" />
     *
     * <!-- Horizontal divider with theme color -->
     * <HGap
     *   id="gap02"
     *   class="hison-col-12 hison-color-primary"
     *   line="horizontal"
     *   :line-width="2"
     *   line-style="dashed"
     * />
     *
     * <!-- Vertical divider inside a row -->
     * <div class="hison-layout">
     *   <HButton text="Left" />
     *   <HGap id="gap03" class="hison-col-1 hison-color-muted" line="vertical" />
     *   <HButton text="Right" />
     * </div>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Use `hison.component.getGap(id)` to retrieve control methods at runtime:
     *
     * ```ts
     * const gap = hison.component.getGap('gap02')
     * gap.setLine('vertical')          // switch to vertical divider
     * gap.setLineStyle('dotted')       // change line style
     * gap.setLineWidth(3)              // set thickness to 3px
     * gap.setLineColor('#ff0000')      // set custom color
     * gap.setBackgroundType('filled')  // apply background fill
     * gap.setBorder(true)              // enable border (box-shadow)
     * gap.setVisible(false)            // hide gap entirely
     * ```
     *
     * ---
     *
     * @prop {string} id - Unique gap identifier. Enables runtime access via `hison.component.getGap(id)`.
     * @prop {string | string[] | Record<string, boolean>} [class] - Additional class string. Supports responsive system (`hison-size-*`, `hison-color-*`, `hison-col-*`).
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline CSS style applied to root gap element.
     * @prop {boolean} [visible] - Whether the gap is shown (`true` by default).
     * @prop {boolean} [border] - Whether to show border (box-shadow). Default: `false`.
     * @prop {('filled'|'empty'|'transparent')} [backgroundType] - Background style. `'empty'` (default), `'filled'`, or `'transparent'`.
     * @prop {('none'|'horizontal'|'vertical')} [line] - Drawing rule. `'none'` (default), `'horizontal'`, `'vertical'`.
     * @prop {HGapLineStyleValue} [lineStyle] - CSS border style for the line. `'solid'` (default).
     * @prop {number|string} [lineWidth] - Thickness of the line. Number → px, String → CSS unit. Default: `1`.
     * @prop {string} [lineColor] - CSS color for the line. Empty string (`''`) uses theme auto color.
     *
     * ---
     *
     * @slot default - Not used; gap does not render slot content (reserved for future extensions).
     *
     * ---
     *
     * @event mounted - Emitted after mounting. Passes `HGapMethods` instance.
     * @event responsive-change - Emitted on device class change (`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     */
    HGap: typeof HGap

    /**
     * Hisonvue custom grid component.
     *
     * `HGrid` is a flexible and lightweight table/grid component powered by `vanillagrid2`.
     * It supports full customization of grid layout, styles, interactions, and advanced event handling.
     *
     * ---
     *
     * ### 🧩 Features
     * - Typed column definitions via `HGridColumn[]`
     * - Editable cells, sortable/filterable columns, and selection policies
     * - Support for undo/redo, fixed rows/columns, alternate row colors
     * - Detailed control over all user interactions (click, edit, copy/paste, etc.)
     * - Custom styling per region (header/body/footer/editor)
     * - SSR-safe grid mounting
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HGrid
     *   id="grid01"
     *   :columns="columns"
     *   :height="'200px'"
     *   :rownumVisible="'false'"
     *   :statusVisible="'false'"
     *   :visible="'true'"
     *   :activeRow="onActiveRow"
     *   :activeCol="onActiveCol"
     *   color="black"
     *   @mounted="onMounted"
     * />
     * ```
     *
     * ---
     *
     * ### 🛠 Data Handling
     * Unlike other components like `HNote`, `HGrid` **does not use `v-model`**.
     * To control the grid’s data, use the `hison.component.getGrid(id)` method to retrieve the `GridMethods` instance.
     *
     * You can then call methods such as `load()`, `getRowData()`, `setCellValue()` and more to control the grid programmatically.
     *
     * ```ts
     * const grid = hison.component.getGrid('grid01');
     * grid.load([
     *   { col1: 'A', col2: 'B', col3: 'C' },
     *   { col1: 'X', col2: 'Y', col3: 'Z' },
     * ]);
     * ```
     *
     * ---
     *
     * @prop {string} id - Required grid instance identifier (must be unique).
     * @prop {HGridColumn[]} columns - Column definition array. Each item defines a column’s id, type, header, and more.
     * @prop {string | string[] | Record<string, boolean>} [class] - Additional class string. Supports `hison-*` responsive system.
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline CSS style.
     *
     * @prop {string} [name] - Optional grid name. Defaults to `id` if omitted.
     * @prop {Boolean} [locked] - If true, disables editing on all cells.
     * @prop {Boolean} [lockedColor] - Show background color for locked cells.
     * @prop {Boolean} [resizable] - Whether column widths can be resized by mouse.
     * @prop {Boolean} [redoable] - Enable undo/redo functionality.
     * @prop {Number} [redoCount] - Number of undo/redo history steps to keep.
     * @prop {Boolean} [visible] - Show/hide the grid (`display: none`).
     * @prop {Boolean} [headerVisible] - Show/hide the header.
     * @prop {Boolean} [rownumVisible] - Show/hide the row number column.
     * @prop {string} [rownumSize] - Width of the row number column.
     * @prop {Boolean} [rownumLockedColor] - Show locked color on rownum column.
     * @prop {Boolean} [statusVisible] - Show/hide status column.
     * @prop {Boolean} [statusLockedColor] - Show locked color on status column.
     * @prop {('single' | 'range' | 'none')} [selectionPolicy] - User selection behavior: `range`, `single`, or `none`.
     * @prop {string} [nullValue] - Display value when cell value is `null`.
     * @prop {('yyyy-mm-dd' | 'yyyy/mm/dd' | 'yyyy. mm. dd' | 'yyyymmdd' | 'mm-dd-yyyy' | 'mm/dd/yyyy' | 'mm. dd. yyyy' | 'mmddyyyy' | 'dd-mm-yyyy' | 'dd/mm/yyyy' | 'dd. mm. yyyy' | 'ddmmyyyy')} [dateFormat] - Global date format for date-type columns.
     * @prop {('yyyymm' | 'yyyy-mm' | 'yyyy/mm' | 'yyyy. mm' | 'mmyyyy' | 'mm-yyyy' | 'mm/yyyy' | 'mm. yyyy')} [monthFormat] - Global month format for month-type columns.
     * @prop {Boolean} [alterRow] - Use alternate row background colors.
     * @prop {Number} [frozenColCount] - Number of fixed/frozen columns (including hidden ones).
     * @prop {Number} [frozenRowCount] - Number of fixed/frozen rows.
     * @prop {Boolean} [sortable] - Enable column sorting.
     * @prop {Boolean} [filterable] - Enable column filtering.
     * @prop {Boolean} [allCheckable] - Double-click header to toggle all checkboxes.
     * @prop {string} [checkedValue] - Value representing a checked checkbox.
     * @prop {string} [uncheckedValue] - Value representing an unchecked checkbox.
     *
     * @prop {string} [width] - Grid width (CSS text).
     * @prop {string} [height] - Grid height (CSS text).
     * @prop {string} [margin] - Grid margin (CSS text).
     * @prop {string} [padding] - Grid padding (CSS text).
     * @prop {Number} [sizeLevel] - Relative size of the grid (e.g. 5 is standard).
     * @prop {('top' | 'center' | 'bottom')} [verticalAlign] - Default vertical alignment: `top`, `center`, `bottom`.
     * @prop {string} [cellFontSize] - Cell font size (CSS px).
     * @prop {string} [cellMinHeight] - Cell minimum height (CSS px).
     * @prop {Number} [horizenBorderSize] - Horizontal border thickness (px).
     * @prop {Number} [verticalBorderSize] - Vertical border thickness (px).
     * @prop {string} [gridFontFamily] - Font family for cells.
     * @prop {string} [editorFontFamily] - Font family for the editor input.
     * @prop {string} [overflowWrap] - CSS overflow-wrap for cells.
     * @prop {string} [wordBreak] - CSS word-break for cells.
     * @prop {string} [whiteSpace] - CSS white-space for cells.
     * @prop {Boolean} [linkHasUnderLine] - Whether to underline link cells.
     * @prop {Boolean} [invertColor] - Enable dark mode.
     * @prop {ColorSet | string} [color] - Main theme color (e.g., `"primary"` or `"#ff0000"`).
     *
     * @prop {string} [gridBorderColor] - Grid outer border color.
     * @prop {string} [headerCellBackColor] - Header background.
     * @prop {string} [headerCellBorderColor] - Header border.
     * @prop {string} [headerCellFontColor] - Header font color.
     * @prop {string} [footerCellBackColor] - Footer background.
     * @prop {string} [footerCellBorderColor] - Footer border.
     * @prop {string} [footerCellFontColor] - Footer font color.
     * @prop {string} [bodyBackColor] - Grid body background.
     * @prop {string} [bodyCellBackColor] - Grid cell background.
     * @prop {string} [bodyCellBorderColor] - Grid cell border.
     * @prop {string} [bodyCellFontColor] - Grid cell font color.
     * @prop {string} [editorBackColor] - Editor background.
     * @prop {string} [editorFontColor] - Editor font color.
     * @prop {string} [selectCellBackColor] - Selected cell background.
     * @prop {string} [selectCellFontColor] - Selected cell font color.
     * @prop {string} [selectColBackColor] - Selected column header background.
     * @prop {string} [selectColFontColor] - Selected column header font.
     * @prop {string} [selectRowBackColor] - Selected row background.
     * @prop {string} [selectRowFontColor] - Selected row font color.
     * @prop {string} [mouseoverCellBackColor] - Hovered cell background.
     * @prop {string} [mouseoverCellFontColor] - Hovered cell font.
     * @prop {string} [lockCellBackColor] - Locked cell background.
     * @prop {string} [lockCellFontColor] - Locked cell font.
     * @prop {string} [alterRowBackColor] - Alternate row background.
     * @prop {string} [alterRowFontColor] - Alternate row font.
     * @prop {string} [buttonFontColor] - Button cell font color.
     * @prop {string} [buttonBorderColor] - Button cell border.
     * @prop {string} [buttonBackColor] - Button cell background.
     * @prop {string} [buttonHoverFontColor] - Button hover font.
     * @prop {string} [buttonHoverBackColor] - Button hover background.
     * @prop {string} [buttonActiveFontColor] - Button active font.
     * @prop {string} [buttonActiveBackColor] - Button active background.
     * @prop {string} [linkFontColor] - Link font color.
     * @prop {string} [linkHoverFontColor] - Link hover font color.
     * @prop {string} [linkActiveFontColor] - Link active font color.
     * @prop {string} [linkVisitedFontColor] - Link visited font color.
     * @prop {string} [linkFocusFontColor] - Link focus font color.
     *
     * @event {(grid: GridMethods) => void} [mounted] - Emits the grid instance after mounting.
     * @event responsive-change - Emitted on device class change (`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     * `gridEventProps` supported.
     * @prop {(row, colId) => boolean} [activeCell] - Called to determine whether a cell is active.
     * @prop {(startRow, startColId, endRow, endColId) => boolean} [activeCells] - Active range.
     * @prop {(row) => boolean} [activeRow] - Called to determine if a row is active.
     * @prop {(startRow, endRow) => boolean} [activeRows] - Active rows range.
     * @prop {(colId) => boolean} [activeCol] - Called to determine if a column is active.
     * @prop {(startColId, endColId) => boolean} [activeCols] - Active columns range.
     * @prop {(row, colId, oldValue, newValue) => boolean} [beforeChange] - Called before cell value changes.
     * @prop {(row, colId, oldValue, newValue) => void} [afterChange] - Called after cell value changes.
     * @prop {(row, colId) => boolean} [beforeClickCell] - Before a cell is clicked.
     * @prop {(row, colId) => void} [afterClickCell] - After a cell is clicked.
     * @prop {(row, colId, selectNode) => boolean} [clickSelect] - Called when a select dropdown is clicked.
     * @prop {(row, colId, checkboxNode) => boolean} [clickCheckbox] - Checkbox cell click handler.
     * @prop {(row, colId, buttonNode) => boolean} [clickButton] - Button cell click handler.
     * @prop {(row, colId, linkNode) => boolean} [clickLink] - Link cell click handler.
     * @prop {(row, colId) => boolean} [beforeDblClickCell] - Before double click on cell.
     * @prop {(row, colId) => void} [afterDblClickCell] - After double click on cell.
     * @prop {(row, colId) => boolean} [beforeClickHeader] - Before header click.
     * @prop {(row, colId) => void} [afterClickHeader] - After header click.
     * @prop {(row, colId) => boolean} [beforeDblClickHeader] - Before double click on header.
     * @prop {(row, colId) => void} [afterDblClickHeader] - After double click on header.
     * @prop {(row, colId, editorNode) => boolean} [beforeEditEnter] - Before entering cell edit.
     * @prop {(row, colId, editorNode) => void} [afterEditEnter] - After entering cell edit.
     * @prop {(row, colId, oldValue, newValue) => boolean} [editEnding] - Before edit completes.
     * @prop {(row, colId, filterNode) => boolean} [clickFilter] - Filter click handler.
     * @prop {(row, colId, oldValue, newValue) => boolean} [chooseFilter] - Filter value chosen handler.
     * @prop {(startRow, startColId, clipboardText) => boolean} [paste] - Paste event handler.
     * @prop {(startRow, startColId, endRow, endColId, copyText) => boolean} [copy] - Copy event handler.
     * @prop {(colId) => boolean} [resize] - Called during column resize.
     * @prop {(event: KeyboardEvent) => boolean} [keydownEditor] - Keydown in editor input.
     * @prop {(event: InputEvent) => boolean} [inputEditor] - Input event in editor input.
     * @prop {(event: KeyboardEvent) => boolean} [keydownGrid] - Keydown at grid level.
     */
    HGrid: typeof HGrid

    /**
     * Hisonvue single image upload & preview component.
     *
     * `HImagebox` provides a complete single-image upload solution with preview, drag-and-drop, and runtime API for business apps.
     * It supports both preloaded (server) images and newly uploaded files, with validation, placeholder, and slot customization.
     * Integrates with `hison.vue.getInput(id)` for programmatic control and fully supports dynamic runtime usage.
     *
     * ---
     *
     * ### 🎯 Features
     * - **Single image upload** with preview and deletion (both soft and hard delete supported)
     * - **Drag-and-drop** support (can be enabled/disabled via `enableDrop`)
     * - **Type/extension and file size validation** with user callbacks for errors
     * - **Fully customizable UI**: add/remove button text, placeholder, and slot-based button/empty state override
     * - **Responsive layout**: fully stylable with hisonvue’s responsive class system
     * - **Runtime API**: Access and control via `HImageboxMethods` instance
     * - **Server file (soft-delete) vs. new upload (removal)**: handles both
     * - **DataModel integration** and seamless v-model syncing
     * - **Slot support**: `empty`, `add-button`, `remove-button`
     * - **Control buttons**:
     *   - Add button id: `hison_imagebox_add_button_${id}` → access with  
     *     `hison.component.getButton(\`hison_imagebox_add_button_${id}\`)`
     *   - Remove button id: `hison_imagebox_remove_button_${id}` → access with  
     *     `hison.component.getButton(\`hison_imagebox_remove_button_${id}\`)`
     *
     * ---
     *
     * ### ⚙️ Usage Example
     * ```vue
     * <HImagebox
     *   id="profileImage"
     *   class="hison-col-6-pc hison-col-12-mb hison-size-l-mb"
     *   v-model="image"
     *   :attId="'P001'"
     *   :addButtonText="'UPLOAD'"
     *   :removeButtonText="'DELETE'"
     *   :placeholder="'Drag or upload your image.'"
     *   :enableDrop="true"
     *   :visible="true"
     *   :editMode="EditMode.editable"
     *   :allowedTypes="['.jpg', '.png', 'image/*']"
     *   :imgStyle="{ borderRadius: '12px', border: '1px solid #e0e0e0' }"
     *   style="height: 250px;"
     *   @add="onAdd"
     *   @remove="onRemove"
     * >
     *   <!-- Custom empty slot -->
     *   <template #empty>
     *     <div class="custom-empty">
     *       <span>Drag an image here or click 'Add'</span>
     *     </div>
     *   </template>
     *   <!-- Custom add button content -->
     *   <template #add-button="{ add }">
     *     <span><i class="fa fa-plus"></i> Add Image</span>
     *   </template>
     *   <!-- Custom remove button content -->
     *   <template #remove-button="{ remove }">
     *     <span><i class="fa fa-trash"></i> Delete</span>
     *   </template>
     * </HImagebox>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime API Usage
     * ```ts
     * const imagebox = hison.vue.getInput('profileImage')
     * imagebox.setEditMode('readonly')
     * imagebox.setAllowedTypes(['.jpg'])
     * imagebox.setMaxFileSize(1024 * 1024)
     * imagebox.setValue({ fileName: 'avatar.jpg', ... })
    * imagebox.focus()
    *
    * // Access control buttons if needed:
    * const addBtn = hison.component.getButton(`hison_imagebox_add_button_${'profileImage'}`)
    * const rmBtn  = hison.component.getButton(`hison_imagebox_remove_button_${'profileImage'}`)
    * addBtn.setDisable(true)
    * rmBtn.setDisable(true)
    * ```
    *
    * ---
    *
    * @prop {string} [id] Unique identifier for the image box. Enables runtime access via `hison.vue.getInput(id)`. Duplicate IDs will throw an error.
    * @prop {string | string[] | Record<string, boolean>} [class] Extra class string. Supports all hisonvue responsive, color, and size classes.
    * @prop {string | CSSProperties | CSSProperties[]} [style] Inline CSS style for the container.
    * @prop {string | CSSProperties | CSSProperties[]} [imgStyle] CSS style or string for the `<img>` element (image preview).
    * @prop {boolean} [visible=true] Controls component visibility.
    * @prop {('editable' | 'disable' | 'readonly')} [editMode='editable'] Edit mode: `'editable'`, `'readonly'`, or `'disable'`.
    * @prop {AttachedFileItem | null} [modelValue=null] The current image file object (preloaded or new). Controlled via `v-model`.
    * @prop {string} [attId=''] Group ID for backend image association.
    * @prop {string} [addButtonText='Add'] Label for the add/upload button (if not using the `add-button` slot).
    * @prop {string} [removeButtonText='Remove'] Label for the remove button (if not using the `remove-button` slot).
    * @prop {string} [placeholder='There is no image'] Message shown when no image is present (shows in the empty slot unless overridden).
    * @prop {boolean} [enableDrop=true] Enables drag-and-drop image upload area.
    * @prop {string | string[]} [allowedTypes] Allowed MIME types or extensions (array or comma-separated string).
    * @prop {string | string[]} [disallowedTypes] Disallowed MIME types or extensions (array or comma-separated string).
    * @prop {number} [maxFileSize=Infinity] Maximum file size (bytes) for the image. Files larger than this are rejected.
    * @prop {boolean} [border] - Whether to show border (box-shadow). Default: `false`.
    * @prop {(file: File, allowed: string[]|null, disallowed: string[]|null) => void} [onDisallowedType] Callback when file type/extension is not allowed.
    * @prop {(file: File, size: number, max: number) => void} [onMaxFileSizeExceeded] Callback when a file is too large.
    *
    * ---
    *
    * @event mounted Emitted on mount. Passes the `HImageboxMethods` instance.
    * @event responsive-change Emitted when device class changes (mobile/tablet/pc/wide).
    * @event update:modelValue Emitted when the image changes (add, remove, delete, etc).
    * @event add Emitted when an image is added. Arguments: `(file: AttachedFileItem, methods: HImageboxMethods)`
    * @event remove Emitted when an image is removed. Arguments: `(file: AttachedFileItem, methods: HImageboxMethods)`
    * @event change Emitted whenever the image is changed. Arguments: `(newValue: AttachedFileItem|null, methods: HImageboxMethods)`
    * @event focus Emitted when the add button or file input receives focus.
    * @event blur Emitted when the image box loses focus.
    *
    * ---
    *
    * @slot empty
    * Customizes the "no image" placeholder.  
    * Default: placeholder text.
    *
    * @example
    * <HImagebox>
    *   <template #empty>
    *     <div style="color:#ccc;">📷 No Image Selected</div>
    *   </template>
    * </HImagebox>
    *
    * @slot add-button
    * Customizes the **inside** of the add button (`HButton`). Replaces only the button's content, not the button itself.
    * Scoped props:
    *   - `add: () => void` (opens file dialog)
    *
    * @example
    * <HImagebox>
    *   <template #add-button="{ add }">
    *     <span><i class="fa fa-plus"></i> Add Image</span>
    *   </template>
    * </HImagebox>
    *
    * @slot remove-button
    * Customizes the **inside** of the remove button (`HButton`). Replaces only the button's content, not the button itself.
    * Scoped props:
    *   - `remove: () => void` (removes the current image)
    *
    * @example
    * <HImagebox>
    *   <template #remove-button="{ remove }">
    *     <span><i class="fa fa-trash"></i> Delete</span>
    *   </template>
    * </HImagebox>
    */
    HImagebox: typeof HImagebox

    /**
     * Hisonvue custom input component.
     *
     * `HInput` is a versatile and reactive input component that supports various HTML input types,
     * runtime state control, and full styling support. It features a dual-mode display (editable input or readonly span),
     * and provides complete integration with `hisonCloser` for runtime interaction.
     *
     * ---
     *
     * ### 🎯 Features
     * - Supports various `inputType` values:
     *   - **Text-based**: `'text'`, `'number'`, `'email'`, `'password'`, `'digit'`, `'mask'`
     *   - **Date/time**: `'date'`, `'month'`
     *   - **Visual/UI**: `'color'`, `'range'`, `'textarea'`
     *   - **Selection**: `'checkbox'`, `'select'`
     * - Custom formatting via `format` (e.g., `#,##0.00`, date mask)
     * - Numeric constraints with `maxNumber`, `minNumber`, `roundNumber`
     * - Input length limits via `maxLength`, `maxByte`
     * - UI control via `editMode`, `visible`, `required`, and font styles
     * - Reactive span view when not in editing mode
     * - All DOM events emit full `HInputMethods` for runtime control
     * - Integrated with `hison.component.getInput(id)` for external control
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HInput
     *   id="userStatus"
     *   inputType="select"
     *   :options="[
     *     { text: 'Active', value: 'A' },
     *     { text: 'Inactive', value: 'I' }
     *   ]"
     *   :modelValue="status"
     * />
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * ```ts
     * const input = hison.component.getInput('userStatus')
     * input.setValue('A')
     * input.setVisible(true)
     * input.setEditMode('editable')
     * ```
     *
     * ---
     *
     * @prop {string} id - Unique input identifier. Enables runtime access via `hison.component.getInput(id)`.
     * @prop {string | string[] | Record<string, boolean>} [class] - Additional class string. Supports `hison-*` responsive system.
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline CSS style.
     * @prop {boolean} [visible='true'] - Whether the input is shown (`'true'` or `'false'`).
     * @prop {any} [modelValue] - Bound value for the input. Controlled via `v-model`.
     * @prop {('text' | 'mask' | 'number' | 'digit' | 'date' | 'month' | 'time' | 'email' | 'password' | 'checkbox' | 'range' | 'color' | 'textarea' | 'select')} [inputType='text'] - Input type. Supports:
     *   `'text'`, `'number'`, `'date'`, `'month'`, `'email'`, `'password'`, `'mask'`, `'digit'`,
     *   `'checkbox'`, `'select'`, `'textarea'`, `'range'`, `'color'`
     * @prop {string} [format] - Format string for numeric, date, or masked values.
     * @prop {string} [nullText] - Text to show when value is empty in readonly mode.
     * @prop {String, Number} [maxNumber] - Maximum value for numeric input.
     * @prop {String, Number} [minNumber] - Minimum value for numeric input.
     * @prop {String, Number} [roundNumber] - Decimal rounding precision.
     * @prop {String, Number} [maxLength] - Max number of characters.
     * @prop {String, Number} [maxByte] - Max number of bytes (UTF-8).
     * @prop {string} [placeholder] - Placeholder shown in input when empty.
     * @prop {('editable' | 'disable' | 'readonly')} [editMode='editable'] - Edit state: `'editable'`, `'readonly'`, `'disable'`.
     * @prop {boolean} [required='false'] - Whether the input is required.
     * @prop {boolean} [fontBold='false'] - Whether span text is bold.
     * @prop {boolean} [fontItalic='false'] - Whether span text is italic.
     * @prop {boolean} [fontThruline='false'] - Whether span text is strikethrough.
     * @prop {boolean} [fontUnderline='false'] - Whether span text is underlined.
     * @prop {string} [title] - Tooltip text (HTML `title` attribute).
     *
     * @prop {{ text: string; value: any }[]} [options=[]] - Selectable items for `inputType='select'`.
     * @prop {boolean} [border] - Whether to show border (box-shadow). Default: `false`.
     * @prop {string} [checkedText='Y'] - Display text for `true` value in `checkbox` (readonly mode).
     * @prop {string} [uncheckedText='N'] - Display text for `false` value in `checkbox` (readonly mode).
     * @prop {(value: any) => string} [inputTextdHandler] Custom formatter function for display text (span text) of the input component.
     * 
     * ---
     *
     * @event mounted - Emitted on component mount. Passes `HInputMethods`.
     * @event responsive-change - Emitted on device class change (`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     * @event update:modelValue - Emitted when the bound value changes.
     *
     * @event input - Emitted during input. `(Event, HInputMethods, value)`
     * @event change - Emitted on blur or checkbox/select change. `(oldValue, newValue, HInputMethods)`
     * @event focus - Emitted on focus. `(FocusEvent, HInputMethods)`
     * @event blur - Emitted on blur. `(Event, HInputMethods)`
     *
     * @event click - Emitted on readonly span click. `(MouseEvent, HInputMethods)`
     * @event dblclick - Emitted on double-click. `(MouseEvent, HInputMethods)`
     * @event mousedown / mouseup / mouseenter / mouseleave / mouseover / mouseout / mousemove - Standard mouse events
     * @event pointerdown / pointerup / pointermove / pointerenter / pointerleave - Pointer events
     * @event touchstart / touchend / touchmove / touchcancel - Touchscreen events
     * @event keydown / keyup - Keyboard events
     * @event compositionstart / compositionupdate / compositionend - IME composition events
     * @event dragstart / dragend / drag / drop - Drag-and-drop events
     * @event copy / cut / paste - Clipboard interaction events
     * @event wheel - Mouse wheel scroll event
     * @event contextmenu - Right-click context menu event
     */
    HInput: typeof HInput
    
    /**
     * Hisonvue grouped input controller.
     *
     * `HInputGroup` is a lightweight component that wraps multiple `HInput` components
     * and provides batch-level runtime control, such as loading data, resetting values,
     * validating required fields, and checking modification state.
     *
     * It is especially useful when working with structured form data, such as
     * `Record<string, any>`, `DataWrapper`, or `DataModel`, and integrates with `hison.component.getInputGroup(id)`
     * to expose runtime control methods like `.load()`, `.clear()`, `.getDataObject()` and more.
     *
     * ---
     *
     * ### 🎯 Features
     * - Auto-registers all child `<HInput>` components rendered inside its `<slot />`
     * - Supports loading data from:
     *   - `Record<string, any>`
     *   - `InterfaceDataWrapper`
     *   - `InterfaceDataModel`
     * - Two-way binding with `v-model` for full-form data as `Record<string, any>`
     * - Can reset all owned inputs via `.clear()`
     * - Tracks whether any child `HInput` is modified via `.isModified()`
     * - Applies or retrieves form-wide status (`C`, `R`, `U`, `D`) via `.getStatus()` and `.setStatus()`
     * - Applies global edit mode to all child inputs (`editable`, `readonly`, `disable`)
     * - Supports required field validation via `.checkRequired()`
     * - Runtime methods available via `hison.component.getInputGroup(id)`
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HInputGroup id="group1" v-model="formData" :editMode="'editable'">
     *   <HInput id="userid" inputType="text" required />
     *   <HInput id="email" inputType="email" />
     * </HInputGroup>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Use `hison.component.getInputGroup(id)` to access and control the group:
     * ```ts
     * const group = hison.component.getInputGroup('group1');
     * group.load({ userid: 'abc', email: 'test@example.com' });
     * group.clear();
     * group.setStatus('U');
     * group.setEditMode('readonly');
     * const dataModel = group.getDataModel(); // hison.data.dataModel
     * const changed = group.isModified();
     * ```
     *
     * ---
     *
     * ### 🔒 Notes
     * - `v-model` is now fully supported and emits changes when any child `HInput` is modified.
     * - Child `HInput` components must have an `id` matching the corresponding data key.
     * - Inputs auto-sync their values from `v-model` on registration and emit changes upward.
     * - Modification tracking reflects user-triggered changes only.
     * - Grouped `HInput` instances register themselves via `provide('registerToInputGroup')`.
     *
     * ---
     *
     * @prop {string} id - Unique group identifier. Enables runtime access via `hison.component.getInputGroup(id)`.
     * @prop {('editable' | 'disable' | 'readonly')} [editMode='editable'] - Edit mode: `'editable'`, `'readonly'`, `'disable'`.
     * @prop {('C' | 'R' | 'U' | 'D')} [status='R'] - Data status: `'C'`, `'R'`, `'U'`, `'D'`. Managed via `.getStatus()` / `.setStatus()`.
     * @prop {Record<string, any>} [modelValue] - Used with `v-model` for two-way binding of grouped input values.
     *
     * @event mounted - Emitted after mount with `HInputGroupMethods` instance.
     * @event update:modelValue - Emitted when any child `HInput` changes, propagating the updated object.
     */
    HInputGroup: typeof HInputGroup

    /**
     * Hisonvue custom label component.
     *
     * `HLabel` is a flexible text/label component that supports plain text, HTML slot content,
     * or hyperlink rendering via `href`. It provides responsive styling, dynamic runtime control,
     * and integrates with `hisonCloser` for global access and management.
     *
     * ---
     *
     * ### 🎯 Features
     * - Theme-aware styling via responsive class system (`hison-size-*`, `hison-color-*`, etc.)
     * - Can render as:
     *   - `<span>` (default, with text or slot text only)
     *   - `<a>` (when `href` is provided; supports full anchor attributes via `anchorAttrs`)
     *   - `<div>` (when slot contains HTML elements)
     * - **Dynamic content control:**  
     *   - Uses `text` prop if no slot is provided.
     *   - Default slot overrides `text` unless it is *pure text nodes* (then converted into internal text).
     *   - Runtime methods (`getText`, `setText`) work when slot is not an element slot.
     * - **Hyperlink support (`href` + `anchorAttrs`):**  
     *   - Supports all anchor attributes (`target`, `rel`, `download`, etc.) via `anchorAttrs` prop and runtime setters.
     *   - Automatically adds `rel="noopener noreferrer"` when `target="_blank"`.
     *   - Keyboard accessible: pressing **Enter** or **Space** focuses and triggers click on links.
     * - **Font style toggles**: `fontBold`, `fontItalic`, `fontThruline`, `fontUnderline`.
     * - **Border (box-shadow) toggle**: `border` prop or runtime methods.
     * - **Background type control**: `backgroundType` prop or runtime methods (`'empty'` (default), `'filled'`, `'transparent'`).
     * - Tooltip support via `title` prop and dynamic `setTitle` method.
     * - Integrated CSS event hooks for hover/focus/active states (same system as `HButton`).
     * - Emits runtime method object on interaction events (`click`, `mouseover`, etc.).
     * - Device-aware responsive reload (`@responsive-change`).
     * - Seamless reload via internal `registerReloadable()` support.
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <!-- Plain text label -->
     * <HLabel
     *   id="lb1"
     *   class="hison-col-6 hison-size-m hison-color-primary"
     *   text="Hello Label"
     *   title="Tooltip text"
     * />
     *
     * <!-- Default slot with HTML overrides text -->
     * <HLabel id="lb2">
     *   <strong>Custom <i>HTML</i></strong>
     * </HLabel>
     *
     * <!-- Pure text slot behaves like text prop (controlled by getText/setText) -->
     * <HLabel id="lb3">Slot text here</HLabel>
     *
     * <!-- Link label -->
     * <HLabel
     *   id="lb4"
     *   class="hison-color-info"
     *   href="https://example.com"
     *   :anchor-attrs="{ target: '_blank' }"
     * >
     *   Visit Example
     * </HLabel>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Use `hison.component.getLabel(id)` to retrieve control methods at runtime:
     *
     * ```ts
     * const lb = hison.component.getLabel('lb1');
     * lb.setText('Updated Text');
     * lb.setTitle('New tooltip');
     * lb.setFontBold(true);
     * lb.setBorder(true);
     * lb.setBackgroundType('transparent');
     * lb.setHref('https://naver.com');
     * lb.setAnchorAttr('target', '_blank');
     * ```
     *
     * ---
     *
     * @prop {string} id - Unique label identifier. Enables runtime access via `hison.component.getLabel(id)`.
     * @prop {string | string[] | Record<string, boolean>} [class] - Additional class string. Supports `hison-*` responsive system.
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline CSS style.
     * @prop {boolean} [visible] - Whether the label is shown. Default: `true`.
     * @prop {string} [text] - Text content if no slot is used. If slot is pure text, it is converted to internal text as well.
     * @prop {string} [title] - Tooltip text. Can be updated via `setTitle()`.
     * @prop {string|null} [href] - If provided, label renders as an `<a>` link. Controlled via runtime methods.
     * @prop {Record<string, unknown>} [anchorAttrs] - Extra attributes for `<a>` (target, rel, download, etc.).
     * @prop {boolean} [fontBold] - Bold font style toggle. Adds `hison-font-bold`.
     * @prop {boolean} [fontItalic] - Italic font style toggle. Adds `hison-font-italic`.
     * @prop {boolean} [fontThruline] - Strikethrough font style toggle. Adds `hison-font-thruline`.
     * @prop {boolean} [fontUnderline] - Underline font style toggle. Adds `hison-font-underline`.
     * @prop {('left'|'center'|'right')} [textAlign] - Text alignment. Can be changed via methods.
     * @prop {boolean} [border] - Whether to show border (box-shadow). Default: `false`.
     * @prop {('filled'|'empty'|'transparent')} [backgroundType] - Background style. `'empty'` (default), `'filled'`, or `'transparent'`.
     *
     * ---
     *
     * @slot default - Default content inside the label. If only text nodes are provided, behaves like `text` prop (controllable by methods). If elements are provided, overrides text control.
     *
     * ---
     *
     * @event mounted - Emitted after mounting. Passes `HLabelMethods` instance.
     * @event click - Emitted on click (only if rendered as `<a>`). Passes `(MouseEvent, HLabelMethods)`.
     * @event mousedown - Emitted on mousedown (if `<a>`). Passes `(MouseEvent, HLabelMethods)`.
     * @event mouseup - Emitted on mouseup (if `<a>`). Passes `(MouseEvent, HLabelMethods)`.
     * @event mouseover - Emitted on mouseover (if `<a>`). Passes `(MouseEvent, HLabelMethods)`.
     * @event mouseout - Emitted on mouseout (if `<a>`). Passes `(MouseEvent, HLabelMethods)`.
     * @event responsive-change - Emitted on device class change (`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     */
    HLabel: typeof HLabel

    /**
     * Hisonvue custom layout component.
     *
     * `HLayout` is a versatile container component for responsive layout composition.
     * It provides full control over visibility, background, borders, and height — with
     * dynamic class resolution and runtime method integration via `hisonCloser`.
     *
     * ---
     *
     * ### 🎯 Features
     * - Responsive design via `hison-col-*`, `hison-pos-*`, and device-aware class extraction
     * - Runtime registration using unique `id`, accessible via `hison.component.getLayout(id)`
     * - Background image configuration (source, repeat, size, alignment)
     * - Background color supports CSS and keyword themes (e.g., `'primary'`, `'danger'`)
     * - Dynamic border configuration (color, width)
     * - Custom height with CSS values
     * - Fully controllable via `HLayoutMethods` (`setVisible`, `setBackColor`, `setHeight`, etc.)
     * - Emits device change via `@responsive-change` (`'mb'`, `'tb'`, `'pc'`, `'wd'`)
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HLayout
     *   id="mainLayout"
     *   class="hison-col-12-mb hison-col-6-pc"
     *   visible="true"
     *   backColor="muted"
     *   height="300px"
     *   backImageSrc="/images/bg.jpg"
     *   backImageStyle="no-repeat"
     *   backImageAlign="center"
     *   backImageVerticalAlign="bottom"
     *   @click="handleClick"
     *   @responsive-change="handleDeviceChange"
     * >
     *   <HButton ... />
     * </HLayout>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Access the layout programmatically using `hison.component.getLayout(id)`:
     *
     * ```ts
     * const layout = hison.component.getLayout('mainLayout');
     * layout.setVisible(false);
     * layout.setBackColor('#f0f0f0');
     * layout.setHeight('100vh');
     * layout.setBackImageSrc('/new/image.jpg');
     * ```
     *
     * ---
     *
     * @prop {string} id - Unique layout identifier for method registration (`hison.component.getLayout(id)`).
     * @prop {string | string[] | Record<string, boolean>} [class] - Responsive and custom classes (e.g., `hison-col-12-mb`, `hison-pos-center`).
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline CSS style string merged with internal background/border styles.
     * @prop {boolean} [visible] - Layout visibility as `'true'` or `'false'`. Default is visible.
     *
     * @prop {string} [backImageSrc] - Background image URL.
     * @prop {('repeat' | 'no-repeat' | 'cover' | 'contain')} [backImageRepeat] - Background repeat or size mode (`'cover'`, `'repeat'`, etc.).
     * @prop {string} [backImageWidth] - CSS size of background image (`'100%'`, `'auto'`, `'300px'`).
     * @prop {('left' | 'center' | 'right')} [backImageAlign] - Horizontal alignment (`'left'`, `'center'`, `'right'`).
     * @prop {('top' | 'center' | 'bottom')} [backImageVerticalAlign] - Vertical alignment (`'top'`, `'center'`, `'bottom'`).
     *
     * @prop {string} [backColor] - Background color (`#fff`, `rgba(0,0,0,0.1)`, or theme key like `'success'`).
     * @prop {boolean} [border] - Whether to show border (box-shadow). Default: `false`.
     * @prop {string} [height] - Layout height (`'100px'`, `'50%'`, `'100vh'`, etc.).
     *
     * ---
     *
     * @event mounted - Emitted on mount. Returns `HLayoutMethods` instance for runtime control.
     * @event click - Mouse click event.
     * @event mousedown - Mouse down event.
     * @event mouseup - Mouse up event.
     * @event mouseover - Mouse over event.
     * @event mouseout - Mouse out event.
     * @event responsive-change - Emitted when device type changes (`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     */
    HLayout: typeof HLayout

    /**
     * Hisonvue custom list component.
     *
     * `HList` provides a flexible list wrapper (`<ul>` or `<ol>`) with theme-aware styling,
     * slot-based rendering, and optional data-driven text list rendering. It supports
     * interactive states, runtime control via methods, and integrates with `hisonCloser`
     * for global access and management.
     *
     * ---
     *
     * ### 🎯 Features
     * - Theme-aware styling via responsive class system (`hison-size-*`, `hison-color-*`, etc.).
     * - Can render as:
     *   - `<ul>` or `<ol>` (controlled by `listType`).
     *   - Each `<li>` styled like `HLabel`, with optional marker (bullet or index).
     * - **Rendering modes**:
     *   - Default slot ➜ fully custom markup for each item (loop in consumer template).
     *   - `textList` prop ➜ array of strings/numbers, rendered as `<li>` automatically.
     *   - Scoped `#item` slot ➜ customize how each `textList` item is rendered (`{ item, index }`).
     * - **Marker control**:
     *   - Ordered list (`ol`) shows index numbers.
     *   - Unordered list (`ul`) shows custom bullet character (`bulletChar`).
     *   - `showMarker=false` hides marker entirely.
     * - **Styling options**:
     *   - `border` (box-shadow on container), `listBorder` (per-item).
     *   - `backgroundType` (container), `listBackgroundType` (items).
     * - **Interactivity**:
     *   - `addEvent=true` enables textbox-like CSS event hooks (`focus`, `hover`, `active`).
     *   - Emits item-level events (`click`, `mousedown`, etc.) with `HListMethods`.
     *   - `tabIndex` prop makes items keyboard-focusable; Enter/Space triggers click.
     * - Responsive class reload and hot-reload support.
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <!-- Text list rendering -->
     * <HList
     *   id="list1"
     *   class="hison-col-6 hison-size-m hison-color-primary"
     *   :text-list="['Item A', 'Item B', 'Item C']"
     *   listBorder
     *   backgroundType="empty"
     * />
     *
     * <!-- Custom slot items -->
     * <HList id="list2" listType="ul" listBorder>
     *   <template v-for="(card, i) in cards" :key="i">
     *     <div class="card">
     *       <h4>{{ card.title }}</h4>
     *       <p>{{ card.desc }}</p>
     *     </div>
     *   </template>
     * </HList>
     *
     * <!-- Scoped slot with textList -->
     * <HList id="list3" :text-list="['A', 'B', 'C']">
     *   <template #item="{ item, index }">
     *     <span>{{ index + 1 }} - {{ item }}</span>
     *   </template>
     * </HList>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Use `hison.component.getList(id)` to retrieve control methods at runtime:
     *
     * ```ts
     * const list = hison.component.getList('list1');
     * list.setListType('ol');
     * list.setTextList(['X', 'Y', 'Z']);
     * list.setBorder(true);
     * list.setListBackgroundType('filled');
     * list.setTabIndex(0);  // make items focusable
     * list.focus();         // focus first item
     * ```
     *
     * ---
     *
     * @prop {string} id - Unique list identifier. Enables runtime access via `hison.component.getList(id)`.
     * @prop {string | string[] | Record<string, boolean>} [class] - Additional class string. Supports `hison-*` responsive system.
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline style for container.
     * @prop {string | CSSProperties | CSSProperties[]} [listItemStyle] - Inline style for each `<li>`.
     * @prop {string | CSSProperties | CSSProperties[]} [listItemInnerStyle] - Inline style for inner item container.
     * @prop {boolean} [visible] - Whether the list is shown. Default: `true`.
     * @prop {boolean} [border] - Whether to show border (box-shadow) on the container.
     * @prop {boolean} [listBorder] - Whether each `<li>` shows border.
     * @prop {'filled'|'empty'|'transparent'} [backgroundType] - Background style of the container. Default: `'empty'`.
     * @prop {'filled'|'empty'|'transparent'} [listBackgroundType] - Background style of list items. Default: `'empty'`.
     * @prop {'ul'|'ol'} [listType] - Whether to render as `<ul>` or `<ol>`. Default: `'ul'`.
     * @prop {string} [bulletChar] - Bullet character when `listType='ul'`. Default: `'•'`.
     * @prop {boolean} [showMarker] - Whether to render markers (bullet or index). Default: `true`.
     * @prop {Array<string|number>} [textList] - Data-driven list items. Ignored if slot elements are provided.
     * @prop {boolean} [addEvent] - Enable textbox-like CSS events and emits. Default: `false`.
     * @prop {number|string|null} [tabIndex] - `tabindex` for each `<li>`. `0` = natural focus order, `null` = not focusable.
     *
     * ---
     *
     * @slot default - Custom list items. When elements are provided, overrides `textList`.
     * @slot item - Scoped slot for rendering `textList` entries with `{ item, index }`.
     *
     * ---
     *
     * @event mounted - Emitted after mounting. Passes `HListMethods` instance.
     * @event click - Emitted on item click. Passes `(MouseEvent, HListMethods)`.
     * @event mousedown - Emitted on item mousedown. Passes `(MouseEvent, HListMethods)`.
     * @event mouseup - Emitted on item mouseup. Passes `(MouseEvent, HListMethods)`.
     * @event mouseover - Emitted on item mouseover. Passes `(MouseEvent, HListMethods)`.
     * @event mouseout - Emitted on item mouseout. Passes `(MouseEvent, HListMethods)`.
     * @event responsive-change - Emitted on device class change (`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     */
    HList: typeof HList

    /**
     * Hisonvue custom modal component.
     *
     * `HModal` renders a fixed-position dialog with optional overlay, caption, and close button.
     * It supports precise screen positioning, sticky header/footer, responsive classes, and full
     * runtime control via `HModalMethods` (open/close, z-index, placements, etc.).
     *
     * ---
     *
     * ### 🎯 Features
     * - Fixed screen positions via `modalPosition` (e.g. `'top-left'`, `'middle-center'`, `'bottom-right'`)
     * - Sticky header/footer inside the scrollable dialog body
     * - Overlay/backdrop with configurable visibility and click-to-close behavior
     * - Caption and Close button, each placeable to header/footer and left/center/right
     * - **Close button customization via slots**:
     *   - Replace the entire button with `#close-button`
     *   - Or override only `#close-icon` / `#close-label` (✔ recommended)
     * - Runtime registration using unique `id`, accessible via `hison.component.getModal(id)`
     * - Scroll lock with **reference counting** (safe for nested modals)
     * - Responsive class extraction (`hison-col-*`, `hison-size-*`, `hison-color-*`)
     * - Animation class hooks for enter/leave transitions
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HModal
     *   id="modal01"
     *   class="hison-col-12"
     *   :visible="false"
     *   :border="true"
     *   backgroundType="empty"
     *   :zIndex="1500"
     *   position="middle-center"
     *   :headerVisible="true"
     *   :footerVisible="false"
     *   caption="Hello"
     *   captionPlacement="header-left"
     *   :closeButtonVisible="true"
     *   closeButtonPlacement="header-right"
     *   :closeClickOverlay="true"
     *   :showOverlay="true"
     *   :overlayStyle="{ background: 'rgba(0,0,0,0.35)' }"
     *   :scrollLock="true"
     *   enterAnimationClass="hison-modal-enter"
     *   leaveAnimationClass="hison-modal-leave"
     *   @open="onOpen"
     *   @close="onClose"
     *   @responsive-change="onDevice"
     * >
     *   <template #default>
     *     modal content...
     *   </template>
     * 
     *   <!-- replace whole close button -->
     *   <template #close-button="{ onClick, text, title, placement }">
     *     <MyCustomClose :label="text" @click="onClick" />
     *   </template>
     *
     *   <!-- or override parts only -->
     *   <template #close-icon>❌</template>
     *   <template #close-label>닫기</template>
     * </HModal>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Access the modal programmatically using `hison.component.getModal(id)`:
     *
     * ```ts
     * const modal = hison.component.getModal('modal01');
     * modal.open();
     * modal.setCaption('Updated title');
     * modal.setButtonPlacement('footer-right');
     * modal.setCaptionPlacement('footer-left');
     * modal.setPosition('top-right');
     * modal.setZIndex(2200);
     * ```
     *
     * ---
     *
     * ### ⚠️ Notes on z-index & Nested Modals
     * - `zIndex` controls the wrapper’s stacking order; the overlay is always rendered at `zIndex - 1`.
     * - For **nested modals**, set a higher `zIndex` on the top modal to ensure proper stacking.
     * - Scroll locking is **reference-counted**; closing one modal will not unlock the page if others remain open.
     *
     * ---
     *
     * @prop {string} id - Unique modal identifier for method registration (`hison.component.getModal(id)`).
     * @prop {string | string[] | Record<string, boolean>} [class] - Responsive/custom classes (`hison-col-*`, etc.).
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline style for the modal container.
     * @prop {boolean} [visible=false] - Initial visibility (subsequent control via methods only).
     *
     * @prop {boolean} [border=true] - Whether the modal has border (box-shadow).
     * @prop {('empty'|'filled'|'transparent')} [backgroundType='empty'] - Modal background mode.
     *
     * @prop {number} [zIndex=1300] - Stacking context for the modal; overlay uses `zIndex - 1`.
     * @prop {('top-left'|'top-center'|'top-right'|'middle-left'|'middle-center'|'middle-right'|'bottom-left'|'bottom-center'|'bottom-right')} [position='middle-center'] - Fixed screen position of the wrapper.
     *
     * @prop {boolean} [headerVisible=true] - Initial header visibility (auto-hidden if no content/targets).
     * @prop {boolean} [footerVisible=true] - Initial footer visibility (auto-hidden if no content/targets).
     *
     * @prop {string|null} [caption=null] - Caption text (falsy value hides caption).
     * @prop {boolean} [captionBorder=false] - Caption border style.
     * @prop {('empty'|'filled'|'transparent')} [captionBackgroundType='filled'] - Caption background type.
     * @prop {('header-left'|'header-center'|'header-right'|'footer-left'|'footer-center'|'footer-right')} [captionPlacement='header-center'] - Caption placement.
     *
     * @prop {boolean} [closeButtonVisible=true] - Close button visibility.
     * @prop {string} [closeButtonText='X'] - Close button label.
     * @prop {string} [closeButtonTitle='close'] - Close button title attribute.
     * @prop {boolean} [closeButtonBorder=true] - Close button border style.
     * @prop {('empty'|'filled'|'transparent')} [closeButtonBackgroundType='empty'] - Close button background type.
     * @prop {('header-left'|'header-center'|'header-right'|'footer-left'|'footer-center'|'footer-right')} [closeButtonPlacement='footer-right'] - Close button placement.
     *
     * @prop {boolean} [closeClickOverlay=true] - Whether clicking the overlay closes the modal.
     * @prop {boolean} [showOverlay=true] - Whether the overlay (backdrop) is shown.
     * @prop {string | CSSProperties | CSSProperties[]} [overlayStyle] - Inline style for the overlay (merged with computed `zIndex - 1`).
     *
     * @prop {boolean} [scrollLock=true] - Whether to lock page scroll while the modal is visible (reference-counted).
     *
     * @prop {string} [enterAnimationClass] - CSS class for enter animation.
     * @prop {string} [leaveAnimationClass] - CSS class for leave animation.
     *
     * ---
     *
     * @event mounted - Emitted on mount. Returns `HModalMethods` instance for runtime control.
     * @event open - Emitted when the modal opens (after entering animation starts).
     * @event close - Emitted when the modal closes (after leaving animation finishes).
     * @event responsive-change - Emitted when device type changes (`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     */
    HModal: typeof HModal

    /**
     * Hisonvue custom WYSIWYG editor component.
     *
     * `HNote` provides a fully-featured rich text editor based on the `vanillanote2` package.
     * Supports two-way binding via `v-model`, file/image/video attachments, undo/redo, custom styling,
     * and customizable event handling for nearly every interactive element.
     *
     * ---
     *
     * ### 🧩 Features
     * - Rich-text editing with toolbar (paragraph style, bold, underline, etc.)
     * - File/image/video attachments with type/size limits
     * - Customizable appearance (font, size, colors, placeholder, etc.)
     * - Fine-grained interaction control using before/after event props
     * - Multiple instances can be rendered on the same page
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HNote
     *   v-model="noteData"
     *   id="note1"
     *   textarea-height="300px"
     *   :onBoldBeforeClick="(e) => { return false }"
     * />
     * ```
     *
     * ---
     *
     * ### 🛠 Access Instance
     * Use `hison.component.getNote(noteId)` to get the `VanillanoteElement` instance.
     *
     * ```ts
     * const note = hison.component.getNote('note1');
     * note.setNoteData({ html: '<p>Hello World</p>' });
     * ```
     *
     * ---
     * @prop {NoteData} v-model - Binds a `NoteData` object to the editor (content + attachments).
     * 
     * `noteProps` supported.
     * @prop {string} id - Required unique identifier of the editor instance.
     * @prop {string | string[] | Record<string, boolean>} [class] - Additional class string. Supports `hison-*` responsive system.
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline CSS style.
     * @prop {Boolean} visible - Controls visibility of the editor field.
     * @prop {('editable' | 'disable' | 'readonly')} editMode - Edit mode of the editor.
     *
     * @prop {('ADAPTIVE' | 'MOBILE' | 'DESKTOP')} [noteModeByDevice] - Force mobile, desktop, or adaptive mode.
     * @prop {('TOP' | 'BOTTOM')} [toolPosition] - Toolbar position (`top` or `bottom`).
     * @prop {Number} [toolDefaultLine] - Default number of lines in the toolbar.
     * @prop {Boolean} [toolToggle] - Enable fold/unfold toolbar.
     *
     * @prop {string} [textareaWidth] - Width of the editable area (e.g., `"400px"`).
     * @prop {string} [textareaHeight] - Height of the editable area.
     * @prop {string} [textareaMaxWidth] - Maximum width of the textarea.
     * @prop {string} [textareaMaxHeight] - Maximum height of the textarea.
     * @prop {Boolean} [textareaHeightIsModify] - Whether users can resize textarea height.
     *
     * @prop {Boolean} [placeholderIsVisible] - Show placeholder or not.
     * @prop {Number} [placeholderAddTop] - Vertical offset for placeholder (e.g., `"-10px"`).
     * @prop {Number} [placeholderAddLeft] - Horizontal offset for placeholder.
     * @prop {string} [placeholderWidth] - Placeholder width.
     * @prop {string} [placeholderColor] - Placeholder text color.
     * @prop {string} [placeholderBackgroundColor] - Placeholder background color.
     * @prop {string} [placeholderTitle] - Placeholder title.
     * @prop {string} [placeholderTextContent] - Placeholder description/content.
     *
     * @prop {string} [attFilePreventTypes] - Comma-separated MIME types to block for file attachments.
     * @prop {string} [attFileAcceptTypes] - Comma-separated MIME types to allow for file attachments.
     * @prop {Number} [attFileMaxSize] - Max file size in bytes.
     *
     * @prop {string} [attImagePreventTypes] - Comma-separated MIME types to block for image attachments.
     * @prop {string} [attImageAcceptTypes] - Comma-separated MIME types to allow for image attachments.
     * @prop {Number} [attImageMaxSize] - Max image size in bytes.
     *
     * @prop {Number} [defaultFontSize] - Default font size in px.
     * @prop {Number} [defaultLineHeight] - Default line height.
     * @prop {string} [defaultFontFamily] - Default font family.
     * @prop {string} [defaultToolFontFamily] - Default toolbar font family.
     * @prop {string} [addFontFamily] - Additional font families to allow (comma-separated).
     * @prop {string} [removeFontFamily] - Font families to exclude.
     *
     * @prop {string} [language] - Language key (e.g., `"KOR"`, `"ENG"`).
     * @prop {string} [recodeLimit] - Max undo/redo stack count.
     * @prop {Number} [sizeLevelDesktop] - Editor size ratio for desktop (1–9).
     * @prop {Number} [sizeLevelMobile] - Editor size ratio for mobile (1–9).
     * @prop {Color | string} [color] - Main theme color.
     * @prop {Boolean} [invertColor] - Enable dark mode.
     *
     * @prop {Boolean} [usingParagraphStyle] - Show paragraph style options.
     * @prop {Boolean} [usingBold] - Show bold button.
     * @prop {Boolean} [usingUnderline] - Show underline button.
     * @prop {Boolean} [usingItalic] - Show italic button.
     * @prop {Boolean} [usingUl] - Show unordered list button.
     * @prop {Boolean} [usingOl] - Show ordered list button.
     * @prop {Boolean} [usingTextAlign] - Show text alignment options.
     * @prop {Boolean} [usingFontSize] - Show font size control.
     * @prop {Boolean} [usingLetterSpacing] - Show letter spacing control.
     * @prop {Boolean} [usingLineHeight] - Show line height control.
     * @prop {Boolean} [usingFontFamily] - Show font family selector.
     * @prop {Boolean} [usingColorText] - Show text color options.
     * @prop {Boolean} [usingColorBack] - Show background color options.
     * @prop {Boolean} [usingAttLink] - Show attach link button.
     * @prop {Boolean} [usingAttFile] - Show attach file button.
     * @prop {Boolean} [usingAttImage] - Show attach image button.
     * @prop {Boolean} [usingAttVideo] - Show attach video button.
     * @prop {Boolean} [usingFormatClear] - Show format clear (reset style) button.
     * @prop {Boolean} [usingUndo] - Show undo button.
     * @prop {Boolean} [usingRedo] - Show redo button.
     * @prop {Boolean} [usingHelp] - Show help/shortcut button.
     * @prop {Boolean} [usingParagraphAllStyle] - Show all paragraph style controls.
     * @prop {Boolean} [usingCharacterStyle] - Show all character style buttons.
     * @prop {Boolean} [usingCharacterSize] - Show font size and spacing controls.
     * @prop {Boolean} [usingAttachFile] - Show all attachment buttons.
     * @prop {Boolean} [usingDo] - Show both undo and redo.
     *
     * @event {(note: VanillanoteElement) => void} [mounted] - Called after editor is mounted.
     * @event responsive-change - Emitted on device class change (`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     * `noteEventProps` supported.
     * @prop {(event: Event) => boolean} [textareaBeforeClick] - Before textarea click
     * @prop {(event: Event) => void} [textareaAfterClick] - After textarea click
     * @prop {(event: Event) => boolean} [textareaBeforeFocus] - Before textarea focus
     * @prop {(event: Event) => void} [textareaAfterFocus] - After textarea focus
     * @prop {(event: Event) => boolean} [textareaBeforeBlur] - Before textarea blur
     * @prop {(event: Event) => void} [textareaAfterBlur] - After textarea blur
     * @prop {(event: Event) => boolean} [paragraphStyleSelectBeforeClick] - Before paragraph style select
     * @prop {(event: Event) => void} [paragraphStyleSelectAfterClick] - After paragraph style select
     * @prop {(event: Event) => boolean} [toolToggleBeforeClick] - Before tool toggle
     * @prop {(event: Event) => void} [toolToggleAfterClick] - After tool toggle
     * @prop {(event: Event) => boolean} [styleNomalBeforeClick] - Before style normal
     * @prop {(event: Event) => void} [styleNomalAfterClick] - After style normal
     * @prop {(event: Event) => boolean} [styleHeader1BeforeClick] - Before header1
     * @prop {(event: Event) => void} [styleHeader1AfterClick] - After header1
     * @prop {(event: Event) => boolean} [styleHeader2BeforeClick] - Before header2
     * @prop {(event: Event) => void} [styleHeader2AfterClick] - After header2
     * @prop {(event: Event) => boolean} [styleHeader3BeforeClick] - Before header3
     * @prop {(event: Event) => void} [styleHeader3AfterClick] - After header3
     * @prop {(event: Event) => boolean} [styleHeader4BeforeClick] - Before header4
     * @prop {(event: Event) => void} [styleHeader4AfterClick] - After header4
     * @prop {(event: Event) => boolean} [styleHeader5BeforeClick] - Before header5
     * @prop {(event: Event) => void} [styleHeader5AfterClick] - After header5
     * @prop {(event: Event) => boolean} [styleHeader6BeforeClick] - Before header6
     * @prop {(event: Event) => void} [styleHeader6AfterClick] - After header6
     * @prop {(event: Event) => boolean} [boldBeforeClick] - Before bold
     * @prop {(event: Event) => void} [boldAfterClick] - After bold
     * @prop {(event: Event) => boolean} [underlineBeforeClick] - Before underline
     * @prop {(event: Event) => void} [underlineAfterClick] - After underline
     * @prop {(event: Event) => boolean} [italicBeforeClick] - Before italic
     * @prop {(event: Event) => void} [italicAfterClick] - After italic
     * @prop {(event: Event) => boolean} [ulBeforeClick] - Before ul
     * @prop {(event: Event) => void} [ulAfterClick] - After ul
     * @prop {(event: Event) => boolean} [olBeforeClick] - Before ol
     * @prop {(event: Event) => void} [olAfterClick] - After ol
     * @prop {(event: Event) => boolean} [textAlignSelectBeforeClick] - Before text align select
     * @prop {(event: Event) => void} [textAlignSelectAfterClick] - After text align select
     * @prop {(event: Event) => boolean} [textAlignLeftBeforeClick] - Before text align left
     * @prop {(event: Event) => void} [textAlignLeftAfterClick] - After text align left
     * @prop {(event: Event) => boolean} [textAlignCenterBeforeClick] - Before text align center
     * @prop {(event: Event) => void} [textAlignCenterAfterClick] - After text align center
     * @prop {(event: Event) => boolean} [textAlignRightBeforeClick] - Before text align right
     * @prop {(event: Event) => void} [textAlignRightAfterClick] - After text align right
     * @prop {(event: Event) => boolean} [attLinkBeforeClick] - Before attach link
     * @prop {(event: Event) => void} [attLinkAfterClick] - After attach link
     * @prop {(event: Event) => boolean} [attFileBeforeClick] - Before attach file
     * @prop {(event: Event) => void} [attFileAfterClick] - After attach file
     * @prop {(event: Event) => boolean} [attImageBeforeClick] - Before attach image
     * @prop {(event: Event) => void} [attImageAfterClick] - After attach image
     * @prop {(event: Event) => boolean} [attVideoBeforeClick] - Before attach video
     * @prop {(event: Event) => void} [attVideoAfterClick] - After attach video
     * @prop {(event: Event) => boolean} [fontSizeBoxBeforeClick] - Before font size box
     * @prop {(event: Event) => void} [fontSizeBoxAfterClick] - After font size box
     * @prop {(event: Event) => boolean} [fontSizeBeforeClick] - Before font size
     * @prop {(event: Event) => void} [fontSizeAfterClick] - After font size
     * @prop {(event: Event) => boolean} [fontSizeBeforeInput] - Before font size input
     * @prop {(event: Event) => void} [fontSizeAfterInput] - After font size input
     * @prop {(event: Event) => boolean} [fontSizeBeforeBlur] - Before font size blur
     * @prop {(event: Event) => void} [fontSizeAfterBlur] - After font size blur
     * @prop {(event: Event) => boolean} [letterSpacingBoxBeforeClick] - Before letter spacing box
     * @prop {(event: Event) => void} [letterSpacingBoxAfterClick] - After letter spacing box
     * @prop {(event: Event) => boolean} [letterSpacingBeforeClick] - Before letter spacing
     * @prop {(event: Event) => void} [letterSpacingAfterClick] - After letter spacing
     * @prop {(event: Event) => boolean} [letterSpacingBeforeInput] - Before letter spacing input
     * @prop {(event: Event) => void} [letterSpacingAfterInput] - After letter spacing input
     * @prop {(event: Event) => boolean} [letterSpacingBeforeBlur] - Before letter spacing blur
     * @prop {(event: Event) => void} [letterSpacingAfterBlur] - After letter spacing blur
     * @prop {(event: Event) => boolean} [lineHeightBoxBeforeClick] - Before line height box
     * @prop {(event: Event) => void} [lineHeightBoxAfterClick] - After line height box
     * @prop {(event: Event) => boolean} [lineHeightBeforeClick] - Before line height
     * @prop {(event: Event) => void} [lineHeightAfterClick] - After line height
     * @prop {(event: Event) => boolean} [lineHeightBeforeInput] - Before line height input
     * @prop {(event: Event) => void} [lineHeightAfterInput] - After line height input
     * @prop {(event: Event) => boolean} [lineHeightBeforeBlur] - Before line height blur
     * @prop {(event: Event) => void} [lineHeightAfterBlur] - After line height blur
     * @prop {(event: Event) => boolean} [fontFamilySelectBeforeClick] - Before font family select
     * @prop {(event: Event) => void} [fontFamilySelectAfterClick] - After font family select
     * @prop {(event: Event) => boolean} [colorTextSelectBeforeClick] - Before text color select
     * @prop {(event: Event) => void} [colorTextSelectAfterClick] - After text color select
     * @prop {(event: Event) => boolean} [colorTextSelectBoxBeforeClick] - Before text color box
     * @prop {(event: Event) => void} [colorTextSelectBoxAfterClick] - After text color box
     * @prop {(event: Event) => boolean} [colorText0BeforeClick] - Before color text 0
     * @prop {(event: Event) => void} [colorText0AfterClick] - After color text 0
     * @prop {(event: Event) => boolean} [colorText1BeforeClick] - Before color text 1
     * @prop {(event: Event) => void} [colorText1AfterClick] - After color text 1
     * @prop {(event: Event) => boolean} [colorText2BeforeClick] - Before color text 2
     * @prop {(event: Event) => void} [colorText2AfterClick] - After color text 2
     * @prop {(event: Event) => boolean} [colorText3BeforeClick] - Before color text 3
     * @prop {(event: Event) => void} [colorText3AfterClick] - After color text 3
     * @prop {(event: Event) => boolean} [colorText4BeforeClick] - Before color text 4
     * @prop {(event: Event) => void} [colorText4AfterClick] - After color text 4
     * @prop {(event: Event) => boolean} [colorText5BeforeClick] - Before color text 5
     * @prop {(event: Event) => void} [colorText5AfterClick] - After color text 5
     * @prop {(event: Event) => boolean} [colorText6BeforeClick] - Before color text 6
     * @prop {(event: Event) => void} [colorText6AfterClick] - After color text 6
     * @prop {(event: Event) => boolean} [colorText7BeforeClick] - Before color text 7
     * @prop {(event: Event) => void} [colorText7AfterClick] - After color text 7
     * @prop {(event: Event) => boolean} [colorTextRBeforeClick] - Before R input click
     * @prop {(event: Event) => void} [colorTextRAfterClick] - After R input click
     * @prop {(event: Event) => boolean} [colorTextRBeforeInput] - Before R input
     * @prop {(event: Event) => void} [colorTextRAfterInput] - After R input
     * @prop {(event: Event) => boolean} [colorTextRBeforeBlur] - Before R blur
     * @prop {(event: Event) => void} [colorTextRAfterBlur] - After R blur
     * @prop {(event: Event) => boolean} [colorTextGBeforeClick] - Before G input click
     * @prop {(event: Event) => void} [colorTextGAfterClick] - After G input click
     * @prop {(event: Event) => boolean} [colorTextGBeforeInput] - Before G input
     * @prop {(event: Event) => void} [colorTextGAfterInput] - After G input
     * @prop {(event: Event) => boolean} [colorTextGBeforeBlur] - Before G blur
     * @prop {(event: Event) => void} [colorTextGAfterBlur] - After G blur
     * @prop {(event: Event) => boolean} [colorTextBBeforeClick] - Before B input click
     * @prop {(event: Event) => void} [colorTextBAfterClick] - After B input click
     * @prop {(event: Event) => boolean} [colorTextBBeforeInput] - Before B input
     * @prop {(event: Event) => void} [colorTextBAfterInput] - After B input
     * @prop {(event: Event) => boolean} [colorTextBBeforeBlur] - Before B blur
     * @prop {(event: Event) => void} [colorTextBAfterBlur] - After B blur
     * @prop {(event: Event) => boolean} [colorTextOpacityBeforeClick] - Before opacity click
     * @prop {(event: Event) => void} [colorTextOpacityAfterClick] - After opacity click
     * @prop {(event: Event) => boolean} [colorTextOpacityBeforeInput] - Before opacity input
     * @prop {(event: Event) => void} [colorTextOpacityAfterInput] - After opacity input
     * @prop {(event: Event) => boolean} [colorTextOpacityBeforeBlur] - Before opacity blur
     * @prop {(event: Event) => void} [colorTextOpacityAfterBlur] - After opacity blur
     * @prop {(event: Event) => boolean} [colorBackSelectBeforeClick] - Before background select
     * @prop {(event: Event) => void} [colorBackSelectAfterClick] - After background select
     * @prop {(event: Event) => boolean} [colorBackSelectBoxBeforeClick] - Before background select box
     * @prop {(event: Event) => void} [colorBackSelectBoxAfterClick] - After background select box
     * @prop {(event: Event) => boolean} [colorBack0BeforeClick] - Before color back 0
     * @prop {(event: Event) => void} [colorBack0AfterClick] - After color back 0
     * @prop {(event: Event) => boolean} [colorBack1BeforeClick] - Before color back 1
     * @prop {(event: Event) => void} [colorBack1AfterClick] - After color back 1
     * @prop {(event: Event) => boolean} [colorBack2BeforeClick] - Before color back 2
     * @prop {(event: Event) => void} [colorBack2AfterClick] - After color back 2
     * @prop {(event: Event) => boolean} [colorBack3BeforeClick] - Before color back 3
     * @prop {(event: Event) => void} [colorBack3AfterClick] - After color back 3
     * @prop {(event: Event) => boolean} [colorBack4BeforeClick] - Before color back 4
     * @prop {(event: Event) => void} [colorBack4AfterClick] - After color back 4
     * @prop {(event: Event) => boolean} [colorBack5BeforeClick] - Before color back 5
     * @prop {(event: Event) => void} [colorBack5AfterClick] - After color back 5
     * @prop {(event: Event) => boolean} [colorBack6BeforeClick] - Before color back 6
     * @prop {(event: Event) => void} [colorBack6AfterClick] - After color back 6
     * @prop {(event: Event) => boolean} [colorBack7BeforeClick] - Before color back 7
     * @prop {(event: Event) => void} [colorBack7AfterClick] - After color back 7
     * @prop {(event: Event) => boolean} [colorBackRBeforeClick] - Before background R click
     * @prop {(event: Event) => void} [colorBackRAfterClick] - After background R click
     * @prop {(event: Event) => boolean} [colorBackRBeforeInput] - Before background R input
     * @prop {(event: Event) => void} [colorBackRAfterInput] - After background R input
     * @prop {(event: Event) => boolean} [colorBackRBeforeBlur] - Before background R blur
     * @prop {(event: Event) => void} [colorBackRAfterBlur] - After background R blur
     * @prop {(event: Event) => boolean} [colorBackGBeforeClick] - Before background G click
     * @prop {(event: Event) => void} [colorBackGAfterClick] - After background G click
     * @prop {(event: Event) => boolean} [colorBackGBeforeInput] - Before background G input
     * @prop {(event: Event) => void} [colorBackGAfterInput] - After background G input
     * @prop {(event: Event) => boolean} [colorBackGBeforeBlur] - Before background G blur
     * @prop {(event: Event) => void} [colorBackGAfterBlur] - After background G blur
     * @prop {(event: Event) => boolean} [colorBackBBeforeClick] - Before background B click
     * @prop {(event: Event) => void} [colorBackBAfterClick] - After background B click
     * @prop {(event: Event) => boolean} [colorBackBBeforeInput] - Before background B input
     * @prop {(event: Event) => void} [colorBackBAfterInput] - After background B input
     * @prop {(event: Event) => boolean} [colorBackBBeforeBlur] - Before background B blur
     * @prop {(event: Event) => void} [colorBackBAfterBlur] - After background B blur
     * @prop {(event: Event) => boolean} [colorBackOpacityBeforeClick] - Before background opacity click
     * @prop {(event: Event) => void} [colorBackOpacityAfterClick] - After background opacity click
     * @prop {(event: Event) => boolean} [colorBackOpacityBeforeInput] - Before background opacity input
     * @prop {(event: Event) => void} [colorBackOpacityAfterInput] - After background opacity input
     * @prop {(event: Event) => boolean} [colorBackOpacityBeforeBlur] - Before background opacity blur
     * @prop {(event: Event) => void} [colorBackOpacityAfterBlur] - After background opacity blur
     * @prop {(event: Event) => boolean} [formatClearBeforeClick] - Before format clear
     * @prop {(event: Event) => void} [formatClearAfterClick] - After format clear
     * @prop {(event: Event) => boolean} [undoBeforeClick] - Before undo
     * @prop {(event: Event) => void} [undoAfterClick] - After undo
     * @prop {(event: Event) => boolean} [redoBeforeClick] - Before redo
     * @prop {(event: Event) => void} [redoAfterClick] - After redo
     * @prop {(event: Event) => boolean} [helpBeforeClick] - Before help
     * @prop {(event: Event) => void} [helpAfterClick] - After help
     * @prop {(event: Event) => boolean} [modalBackBeforeClick] - Before modal back
     * @prop {(event: Event) => void} [modalBackAfterClick] - After modal back
     * @prop {(event: Event) => boolean} [helpModalBeforeClick] - Before help modal
     * @prop {(event: Event) => void} [helpModalAfterClick] - After help modal
     * @prop {(event: Event) => boolean} [placeholderBeforeClick] - Before placeholder click
     * @prop {(event: Event) => void} [placeholderAfterClick] - After placeholder click
     */
    HNote: typeof HNote

    /**
     * Hisonvue custom paragraph/text component.
     *
     * `HParagraph` renders plain text (safe, non-HTML) or slot content with rich,
     * theme-aware styling. It supports whitespace policies (default: `'pre-wrap'`),
     * font toggles, alignment, and an optional one-click copy button. The component
     * integrates with `hisonCloser` for global runtime access and device-responsive
     * styling.
     *
     * ---
     *
     * ### 🎯 Features
     * - **Theme & responsive classes** (`hison-size-*`, `hison-color-*`, `hison-col-*`, …)
     * - **Whitespace control** via `whiteSpace` (`'pre-wrap'` default)
     * - **Typography toggles**: `fontBold`, `fontItalic`, `fontThruline`, `fontUnderline`
     * - **Alignment**: horizontal (`textAlign`) and vertical (`verticalAlign`)
     * - **Background & border** styling
     * - **Copy support**:
     *   - Keyboard (**Ctrl/Cmd+C**), built-in button, or native copy events
     *   - Emits `copy-click`, `copied`, `copy-error`
     *   - Button can be fully replaced or partially customized via slots
     * - **Reload & device awareness**: `@responsive-change`, `registerReloadable()` integration
     *
     * ---
     *
     * ### 🧠 Slot vs Text Behavior (important)
     * - If the **default slot contains only text nodes**, HParagraph **absorbs that text**
     *   into its internal `text` and renders it (so `getText()` / `setText()` work).
     * - If the default slot **contains any HTML elements**, the slot is rendered **as-is**;
     *   in that case **`getText()` returns `''` and `setText()` is a no-op**.
     *
     * ---
     *
     * ### 🧷 Copy Button ID & Control
     * - The built-in copy button (when shown) uses the id pattern:
     *   **`hison_paragraph_copy_button_${id}`**
     * - You can retrieve and control it via:
     *   ```ts
     *   const btn = hison.component.getButton(`hison_paragraph_copy_button_${id}`);
     *   btn.setDisable(true);
     *   ```
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <!-- 1) Plain usage: default slot (pure text is auto-absorbed) -->
     * <HParagraph id="p0" class="hison-col-12 hison-size-m hison-color-primary" :border="true">
     * Line 1
     *   Line 2
     * Line 3
     * </HParagraph>
     *
     * <!-- 2) Monospace & show copy button -->
     * <HParagraph
     *   id="p1"
     *   class="hison-col-12 hison-size-s hison-color-danger"
     *   :border="true"
     *   :copyEnabled="true"
     *   :showCopyButton="true"
     *   style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, Liberation Mono, monospace"
     * >
     * {{
     * `test1
     *     test2
     * test3`
     * }}
     * </HParagraph>
     *
     * <!-- 3) Full custom copy button -->
     * <HParagraph id="p2" :copyEnabled="true" :showCopyButton="true" copyButtonText="Copy">
     *   <template #copy-button="{ onClick }">
     *     <HButton class="hison-size-s" background-type="transparent" :border="true" @click="onClick" title="Copy content">
     *       <template #icon>📋</template>
     *       Custom Copy
     *     </HButton>
     *   </template>
     *   Some text to copy
     * </HParagraph>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * ```ts
     * const p = hison.component.getParagraph('p1');
     * p.setText('Line 1\n  Line 2\nLine 3');
     * p.setWhiteSpace('pre-wrap');   // preserve newlines & sequences of spaces
     * p.setFontBold(true);
     * p.setTextAlign('right');
     * p.setCopyEnabled(true);
     * p.setShowCopyButton(true);
     * await p.copy();                // copies rendered text to clipboard
     * ```
     *
     * ---
     *
     * @prop {string} id - Unique paragraph identifier. Access via `hison.component.getParagraph(id)`.
     * @prop {string | string[] | Record<string, boolean>} [class] - Additional classes (supports the responsive `hison-*` system).
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline styles for the root `<p>`.
     * @prop {boolean} [visible=true] - Toggle visibility.
     * @prop {string} [title] - Tooltip text (`title` attribute).
     * @prop {string} [text] - Text content when no element slot is used (pure-text slot is also absorbed here).
     * @prop {boolean} [fontBold=false] - Adds `hison-font-bold`.
     * @prop {boolean} [fontItalic=false] - Adds `hison-font-italic`.
     * @prop {boolean} [fontThruline=false] - Adds `hison-font-thruline`.
     * @prop {boolean} [fontUnderline=false] - Adds `hison-font-underline`.
     * @prop {'left'|'center'|'right'} [textAlign] - Horizontal alignment.
     * @prop {'top'|'middle'|'bottom'} [verticalAlign='top'] - Vertical alignment (effective when container has a height).
     * @prop {boolean} [border=false] - Shows subtle box-shadow border.
     * @prop {'filled'|'empty'|'transparent'} [backgroundType='empty'] - Background style.
     * @prop {'normal'|'pre'|'pre-wrap'|'pre-line'|'break-spaces'|null} [whiteSpace=null] - Whitespace policy; `null` uses component default (`'pre-wrap'`).
     * @prop {boolean} [copyEnabled=false] - Enables copy via keyboard and button.
     * @prop {boolean} [showCopyButton=false] - Shows the built-in copy button.
     * @prop {string} [copyButtonText='copy'] - Label text for the built-in copy button.
     *
     * ---
     *
     * @slot default - Main content. **Pure text only** → absorbed as `text`. **Contains elements** → rendered as slot; `getText`/`setText` disabled.
     * @slot copy-button - Replace the entire copy button. Slot props: `{ onClick, text }`.
     * @slot copy-icon - Replace the icon of the **default** copy button (forwarded to `<HButton #icon>`).
     * @slot copy-label - Replace the label of the **default** copy button.
     *
     * ---
     *
     * @event mounted - Emitted after mount with the `HParagraphMethods` instance.
     * @event copied - Emitted after a copy attempt: `(ok: boolean, api: HParagraphMethods)`.
     * @event copy-click - Emitted on copy intent: `({ src: 'button'|'keyboard'|'native', event, api })`.
     * @event copy-error - Emitted if copy throws: `(error: unknown, api: HParagraphMethods)`.
     * @event responsive-change - Emitted when device class changes (`'mb'|'tb'|'pc'|'wd'`).
     */
    HParagraph: typeof HParagraph

    /**
     * Hisonvue custom popup component.
     *
     * `HPopup` renders a fixed-position lightweight dialog with optional overlay and a draggable topbar.
     * It supports preset or absolute positioning, responsive classes, and full runtime control via
     * `HPopupMethods` (open/close, z-index, coordinates, draggability, etc.).
     *
     * ---
     *
     * ### 🎯 Features
     * - Fixed screen positions via `ScreenPosition` (e.g. `'top-left'`, `'middle-center'`, `'bottom-right'`)
     * - Absolute positioning with `left`/`top` (overrides presets) and **viewport-clamped dragging**
     * - Overlay/backdrop with configurable visibility and click-to-close behavior
     * - **Close button customization via slots**:
     *   - Replace the entire button with `#close-button`
     *   - Or override only `#close-icon` / `#close-label` (✔ recommended)
     * - Runtime registration using unique `id`, accessible via `hison.component.getPopup(id)`
     * - Scroll lock with **reference counting** (safe for nested popups)
     * - Responsive class extraction (`hison-col-*`, `hison-size-*`, `hison-color-*`)
     * - Animation class hooks for enter/leave transitions
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HPopup
     *   id="popup01"
     *   class="hison-col-6"
     *   :visible="false"
     *   :border="true"
     *   :zIndex="1200"
     *   position="middle-center"
     *   :left="null"
     *   :top="null"
     *   :width="480"
     *   :height="360"
     *   :draggable="true"
     *   :closeClickOverlay="true"
     *   :showOverlay="true"
     *   :overlayStyle="{ background: 'rgba(0,0,0,0.35)' }"
     *   :scrollLock="true"
     *   enterAnimationClass="hison-popup-enter"
     *   leaveAnimationClass="hison-popup-leave"
     *   @open="onOpen"
     *   @close="onClose"
     *   @responsive-change="onDevice"
     * >
     *   <template #default>
     *     popup content...
     *   </template>
     *
     *   <!-- replace whole close button -->
     *   <template #close-button="{ onClick, text, title }">
     *     <MyCustomClose :label="text" :title="title" @click="onClick" />
     *   </template>
     *
     *   <!-- or override parts only -->
     *   <template #close-icon>❌</template>
     *   <template #close-label>닫기</template>
     * </HPopup>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Access the popup programmatically using `hison.component.getPopup(id)`:
     *
     * ```ts
     * const popup = hison.component.getPopup('popup01');
     * popup.open();
     * popup.setDraggable(false);
     * popup.setLeft(40); popup.setTop(30);
     * popup.setPosition('top-right');
     * popup.setZIndex(1400);
     * ```
     *
     * ---
     *
     * ### ⚠️ Notes on z-index, dragging & bounds
     * - `zIndex` controls the wrapper’s stacking order; the overlay is always rendered at `zIndex - 1`.
     * - When `left`/`top` are set (manually or by dragging), preset `position` is ignored (absolute mode).
     * - Dragging is constrained to the **viewport**; the popup cannot be moved off-screen.
     * - Scroll locking is **reference-counted**; closing one popup will not unlock the page if others remain open.
     *
     * ---
     *
     * @prop {string} id - Unique popup identifier for method registration (`hison.component.getPopup(id)`).
     * @prop {string | string[] | Record<string, boolean>} [class] - Responsive/custom classes (`hison-col-*`, etc.).
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline style for the popup container.
     * @prop {boolean} [visible=false] - Initial visibility (subsequent control via methods only).
     *
     * @prop {boolean} [border=true] - Whether the popup has border (box-shadow).
     *
     * @prop {number} [zIndex=1200] - Stacking context for the popup; overlay uses `zIndex - 1`.
     * @prop {('top-left'|'top-center'|'top-right'|'middle-left'|'middle-center'|'middle-right'|'bottom-left'|'bottom-center'|'bottom-right')} [position='middle-center'] - Fixed screen position of the wrapper (ignored in absolute mode).
     * @prop {number|null} [left=null] - Absolute X position in pixels (switches to absolute mode).
     * @prop {number|null} [top=null] - Absolute Y position in pixels (switches to absolute mode).
     *
     * @prop {number|null} [width=null] - Width in pixels (optional).
     * @prop {number|null} [height=null] - Height in pixels (optional).
     *
     * @prop {boolean} [draggable=true] - Whether dragging by the topbar is enabled.
     *
     * @prop {boolean} [closeClickOverlay=true] - Whether clicking the overlay closes the popup.
     * @prop {boolean} [showOverlay=true] - Whether the overlay (backdrop) is shown.
     * @prop {string | CSSProperties | CSSProperties[]} [overlayStyle] - Inline style for the overlay (merged with computed `zIndex - 1`).
     *
     * @prop {boolean} [scrollLock=true] - Whether to lock page scroll while the popup is visible (reference-counted).
     *
     * @prop {string} [enterAnimationClass] - CSS class for enter animation.
     * @prop {string} [leaveAnimationClass] - CSS class for leave animation.
     *
     * ---
     *
     * @event mounted - Emitted on mount. Returns `HPopupMethods` instance for runtime control.
     * @event open - Emitted when the popup opens (after entering animation starts).
     * @event close - Emitted when the popup closes (after leaving animation finishes).
     * @event responsive-change - Emitted when device type changes (`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     */
    HPopup: typeof HPopup
    
    /**
     * Hisonvue custom spinner component.
     *
     * `HSpinner` renders a fixed-position blocking spinner with enforced overlay and scroll lock.
     * It supports precise screen positioning, z-index control, timeout auto-hide, responsive classes,
     * and multiple spinner styles (`ring`, `dots`, `bars`, `pulse`). Consumers can also override
     * the spinner with a custom `#spinner` slot.
     *
     * ---
     *
     * ### 🎯 Features
     * - Fixed screen positions via `position` (e.g. `'top-left'`, `'middle-center'`, `'bottom-right'`)
     * - Enforced overlay/backdrop and scroll lock (always active while visible)
     * - Built-in spinner styles: **ring**, **dots**, **bars**, **pulse**
     * - **Custom spinner slot**:
     *   - Replace with `#spinner="{ spinnerEl, spinner, type }"`
     *   - Provides access to runtime methods and refs
     * - Timeout auto-hide with `timeoutMs` (0 disables)
     * - Runtime registration using unique `id`, accessible via `hison.component.getSpinner(id)`
     * - Responsive class extraction (`hison-size-*`, `hison-color-*`, `hison-col-*`)
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HSpinner
     *   id="spinner01"
     *   class="hison-size-m hison-color-primary"
     *   :visible="false"
     *   :zIndex="1400"
     *   position="middle-center"
     *   :timeoutMs="5000"
     *   spinnerType="ring"
     *   :overlayStyle="{ background: 'rgba(0,0,0,0.4)' }"
     *   @open="onOpen"
     *   @close="onClose"
     *   @toggle="onToggle"
     *   @responsive-change="onDevice"
     * />
     * 
     * <!-- custom spinner -->
     * <HSpinner id="spinnerCustom" :visible="true">
     *   <template #spinner="{ spinnerEl, spinner, type }">
     *     <svg :ref="spinnerEl" width="40" height="40" viewBox="0 0 40 40">
     *       <circle
     *         cx="20" cy="20" r="16"
     *         fill="none" stroke="currentColor" stroke-width="4"
     *         stroke-linecap="round" stroke-dasharray="80 40"
     *       >
     *         <animateTransform
     *           attributeName="transform"
     *           type="rotate"
     *           from="0 20 20" to="360 20 20"
     *           dur="1.2s" repeatCount="indefinite"
     *         />
     *       </circle>
     *     </svg>
     *   </template>
     * </HSpinner>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Access the spinner programmatically using `hison.component.getSpinner(id)`:
     *
     * ```ts
     * const spinner = hison.component.getSpinner('spinner01');
     * spinner.open();
     * spinner.setSpinnerType('dots');
     * spinner.setPosition('bottom-right');
     * spinner.setZIndex(9999);
     * spinner.setTimeout(3000);
     * ```
     *
     * ---
     *
     * ### ⚠️ Notes
     * - `visible` prop is only an initial state. Use methods (`open/close/toggle/setVisible`) to control after mount.
     * - Overlay and scroll lock are **always enforced**; they cannot be disabled.
     * - `zIndex` controls the wrapper’s stacking order; overlay is always rendered at `zIndex - 1`.
     * - For **multiple spinners**, set distinct `zIndex` values to ensure proper stacking order.
     *
     * ---
     *
     * @prop {string} id - Unique spinner identifier for method registration (`hison.component.getSpinner(id)`).
     * @prop {string | string[] | Record<string, boolean>} [class] - Responsive/custom classes (`hison-col-*`, etc.).
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline style for the spinner container.
     * @prop {boolean} [visible=false] - Initial visibility (subsequent control via methods only).
     *
     * @prop {number} [zIndex=1500] - Stacking context for the spinner; overlay uses `zIndex - 1`.
     * @prop {('top-left'|'top-center'|'top-right'|'middle-left'|'middle-center'|'middle-right'|'bottom-left'|'bottom-center'|'bottom-right')} [position='middle-center'] - Fixed screen position of the wrapper.
     *
     * @prop {string | CSSProperties | CSSProperties[]} [overlayStyle] - Inline style for the overlay (merged with computed `zIndex - 1`).
     * @prop {number} [timeoutMs=0] - Auto-hide timeout in milliseconds. `0` disables timeout.
     * @prop {('ring'|'dots'|'bars'|'pulse')} [spinnerType='ring'] - Built-in spinner type (ignored if custom slot is provided).
     *
     * ---
     *
     * @event mounted - Emitted on mount. Returns `HSpinnerMethods` instance for runtime control.
     * @event open - Emitted when the spinner opens.
     * @event close - Emitted when the spinner closes.
     * @event toggle - Emitted when the spinner is toggled (open/close).
     * @event responsive-change - Emitted when device type changes (`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     */
    HSpinner: typeof HSpinner

    /**
     * Hisonvue custom table component.
     *
     * `HTable` provides a flexible, theme-aware table wrapper supporting
     * striped/hover states, caption handling, section-level alignment,
     * bulk cell class/style injection, and runtime programmatic control.
     * It integrates with `hisonCloser` for global runtime access and
     * device-responsive styling.
     *
     * ---
     *
     * ### 🎯 Features
     * - **Theme & responsive classes** (`hison-size-*`, `hison-color-*`, `hison-col-*`, …)
     * - **Caption** via prop or slot (`#caption`)
     * - **Borders**: global table border + per-side section borders
     *   (`header/body/footer` × `top/bottom/left/right`)
     * - **Striped / hover modes**:
     *   - Row/column striping
     *   - Row/column hover highlight (JS-assisted for col hover)
     * - **Alignment**:
     *   - Horizontal (`headerTextAlign`, `bodyTextAlign`, `footerTextAlign`)
     *   - Vertical (`headerVerticalAlign`, `bodyVerticalAlign`, `footerVerticalAlign`)
     * - **Bulk cell customization** via `headerCellClass`/`bodyCellClass`/`footerCellClass`
     *   and `headerCellStyle`/`bodyCellStyle`/`footerCellStyle`
     * - **Background & border** styling
     * - **Reload & device awareness**: `@responsive-change`, `registerReloadable()` integration
     *
     * ---
     *
     * ### 🧠 Caption vs Slot Behavior
     * - Use the **`caption` prop** to set plain caption text.
     * - Use the **`#caption` slot** for fully custom caption markup (takes precedence).
     *
     * ---
     *
     * ### 🧷 DOM Section Access
     * - Raw section refs are exposed via methods:
     *   - `getHeadElement()` → `<thead>`
     *   - `getBodyElement()` → `<tbody>`
     *   - `getFootElement()` → `<tfoot>`
     * - Row utilities:
     *   - `getRowCount()` → number of `<tr>` in body
     *   - `getRowElement(index)` → specific `<tr>` by index
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HTable
     *   id="tbl1"
     *   class="hison-col-12 hison-size-m hison-color-primary"
     *   :border="true"
     *   :striped="'row'"
     *   :hoverable="'row'"
     *   :caption="'Monthly Report'"
     *   :headerTextAlign="'center'"
     *   :bodyTextAlign="'left'"
     *   :footerTextAlign="'right'"
     * >
     *   <template #thead>
     *     <tr><th>Month</th><th>Sales</th><th>Profit</th></tr>
     *   </template>
     *   <tr><td>Jan</td><td>100</td><td>50</td></tr>
     *   <tr><td>Feb</td><td>120</td><td>60</td></tr>
     *   <template #tfoot>
     *     <tr><td>Total</td><td>220</td><td>110</td></tr>
     *   </template>
     * </HTable>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * ```ts
     * const t = hison.component.getTable('tbl1');
     * t.setCaption('Updated Report');
     * t.setBackgroundType('filled');
     * t.setStriped('col');
     * t.setHoverable('col');
     * t.setHeaderBorderBottom(true);
     * console.log('Row count:', t.getRowCount());
     * const firstRow = t.getRowElement(0);
     * if (firstRow) firstRow.classList.add('highlight');
     * ```
     *
     * ---
     *
     * @prop {string} id - Unique table identifier. Access via `hison.component.getTable(id)`.
     * @prop {string | string[] | Record<string, boolean>} [class] - Additional classes (supports the responsive `hison-*` system).
     * @prop {string | CSSProperties | CSSProperties[]} [style] - Inline styles for the `<table>`.
     * @prop {boolean} [visible=true] - Toggle visibility.
     * @prop {string} [caption] - Table caption (use `#caption` slot for custom markup).
     * @prop {'row'|'col'|'none'} [striped='row'] - Striped mode: alternate rows or columns.
     * @prop {'row'|'col'|'none'} [hoverable='row'] - Hover mode: row or column highlight.
     * @prop {boolean} [border=false] - Shows subtle box-shadow border on the table.
     *
     * @prop {boolean} [headerBorderTop=false] - Show top border on `<thead>`.
     * @prop {boolean} [headerBorderBottom=false] - Show bottom border on `<thead>`.
     * @prop {boolean} [headerBorderLeft=false] - Show left border on `<thead>`.
     * @prop {boolean} [headerBorderRight=false] - Show right border on `<thead>`.
     * @prop {boolean} [bodyBorderTop=false] - Show top border on `<tbody>`.
     * @prop {boolean} [bodyBorderBottom=false] - Show bottom border on `<tbody>`.
     * @prop {boolean} [bodyBorderLeft=false] - Show left border on `<tbody>`.
     * @prop {boolean} [bodyBorderRight=false] - Show right border on `<tbody>`.
     * @prop {boolean} [footerBorderTop=false] - Show top border on `<tfoot>`.
     * @prop {boolean} [footerBorderBottom=false] - Show bottom border on `<tfoot>`.
     * @prop {boolean} [footerBorderLeft=false] - Show left border on `<tfoot>`.
     * @prop {boolean} [footerBorderRight=false] - Show right border on `<tfoot>`.
     *
     * @prop {'left'|'center'|'right'} [headerTextAlign='center'] - Horizontal alignment of `<thead>` cells.
     * @prop {'left'|'center'|'right'} [bodyTextAlign='left'] - Horizontal alignment of `<tbody>` cells.
     * @prop {'left'|'center'|'right'} [footerTextAlign='right'] - Horizontal alignment of `<tfoot>` cells.
     *
     * @prop {'top'|'middle'|'bottom'} [headerVerticalAlign='middle'] - Vertical alignment of `<thead>` cells.
     * @prop {'top'|'middle'|'bottom'} [bodyVerticalAlign='middle'] - Vertical alignment of `<tbody>` cells.
     * @prop {'top'|'middle'|'bottom'} [footerVerticalAlign='middle'] - Vertical alignment of `<tfoot>` cells.
     *
     * @prop {'filled'|'empty'|'transparent'} [backgroundType='empty'] - Background style.
     *
     * @prop {string | string[] | Record<string, boolean>} [headerCellClass] - Extra classes applied to all `<th>` cells.
     * @prop {string | string[] | Record<string, boolean>} [bodyCellClass] - Extra classes applied to all `<td>` in `<tbody>`.
     * @prop {string | string[] | Record<string, boolean>} [footerCellClass] - Extra classes applied to all `<td>` in `<tfoot>`.
     * @prop {string | CSSProperties | CSSProperties[]} [headerCellStyle] - Inline style(s) applied to all `<th>` cells.
     * @prop {string | CSSProperties | CSSProperties[]} [bodyCellStyle] - Inline style(s) applied to all `<td>` in `<tbody>`.
     * @prop {string | CSSProperties | CSSProperties[]} [footerCellStyle] - Inline style(s) applied to all `<td>` in `<tfoot>`.
     *
     * ---
     *
     * @slot caption - Custom caption markup (overrides `caption` prop).
     * @slot colgroup - Inject a custom `<colgroup>` definition for column sizing.
     * @slot thead - Table header rows (`<tr><th>…</th></tr>`).
     * @slot default - Table body rows (`<tr><td>…</td></tr>`).
     * @slot tfoot - Table footer rows (`<tr><td>…</td></tr>`).
     *
     * ---
     *
     * @event mounted - Emitted after mount with the `HTableMethods` instance.
     * @event responsive-change - Emitted when device class changes (`'mb'|'tb'|'pc'|'wd'`).
     */
    HTable: typeof HTable


    /** 
     * HBaggie 배지, 특정 요소 좌우 또는 모서리 1000
     * 
     * HRadio 라디오 박스
     * HGallery 이미지 출력 및 넘기기
     * HProgress 진행도 표시창
     * HStepBar 진행도 스텝 표시창
     * HPagenation 페이지 선택
     * 
     * HTree => Grid로
     * HGrid, HNote 오류수정
     */

  }
}
