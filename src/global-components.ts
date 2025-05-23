import type { 
  HButton,
  HLayout,
  HNote,
  HGrid,
} from './index'

declare module 'vue' {
  export interface GlobalComponents {
  /**
   * Hisonvue custom button component.
   *
   * `HButton` is a highly customizable button component that provides styling, behavior, and visibility control via props.
   * It is integrated with `hisonCloser` and supports runtime control using the registered button methods.
   *
   * ---
   *
   * ### 🎯 Features
   * - Theme-aware styling (size, color, visibility, disabled state)
   * - CSS event integration (hover, active, focus)
   * - Automatic runtime method registration (`isDisable`, `setVisible`, etc.)
   * - Supports slot content or fallback to default label
   * - Reactive reloading via `key`
   *
   * ---
   *
   * ### ⚙️ Usage
   * ```vue
   * <HButton
   *   id="btn01"
   *   size="m"
   *   color="primary"
   *   visible="true"
   *   disable="false"
   *   title="Tooltip Text"
   *   @click="onClickHandler"
   *   @mounted="onMountedHandler"
   * >
   *   Click Me
   * </HButton>
   * ```
   *
   * ---
   *
   * ### 🛠 Runtime Usage
   * Use `hison.vue.getButton(id)` to retrieve runtime control methods:
   *
   * ```ts
   * const btn = hison.vue.getButton('btn01');
   * btn.setDisable(true);
   * btn.setVisible(false);
   * ```
   *
   * ---
   *
   * @prop {string} id - Required button identifier. Must be unique.
   * @prop {string} [class] - Additional CSS classes to append to the button.
   * @prop {Record<string, string>} [style] - Inline styles (CSS object format).
   * @prop {Size} [size] - Button size (default inherits from global Hison config). Options: `'s' | 'm' | 'l' | 'xl'`.
   * @prop {Color} [color] - Theme color (`primary`, `success`, `danger`, etc.) or hex string like `#ff0000`.
   * @prop {BoolString} [visible] - Whether the button is visible (`'true'` or `'false'`).
   * @prop {BoolString} [disable] - Whether the button is disabled (`'true'` or `'false'`).
   * @prop {string} [title] - Tooltip text to display on hover.
   *
   * ---
   *
   * @event mounted - Emitted when the button is mounted. Passes `HButtonMethods` instance.
   * @event click - Emitted when the button is clicked.
   * @event mousedown - Emitted when mouse button is pressed on the button.
   * @event mouseup - Emitted when mouse button is released.
   * @event mouseover - Emitted when mouse hovers over the button.
   * @event mouseout - Emitted when mouse leaves the button.
   */
    HButton: typeof HButton

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
     * Use `hison.vue.getNote(noteId)` to get the `VanillanoteElement` instance.
     *
     * ```ts
     * const note = hison.vue.getNote('note1');
     * note.setNoteData({ html: '<p>Hello World</p>' });
     * ```
     *
     * ---
     * @prop {NoteData} v-model - Binds a `NoteData` object to the editor (content + attachments).
     * 
     * `noteProps` supported.
     * @prop {string} id - Required unique identifier of the editor instance.
     *
     * @prop {NoteModeByDevice} [noteModeByDevice] - Force mobile, desktop, or adaptive mode.
     * @prop {NoteToolPosition} [toolPosition] - Toolbar position (`top` or `bottom`).
     * @prop {string} [toolDefaultLine] - Default number of lines in the toolbar.
     * @prop {BoolString} [toolToggle] - Enable fold/unfold toolbar.
     *
     * @prop {string} [textareaWidth] - Width of the editable area (e.g., `"400px"`).
     * @prop {string} [textareaHeight] - Height of the editable area.
     * @prop {string} [textareaMaxWidth] - Maximum width of the textarea.
     * @prop {string} [textareaMaxHeight] - Maximum height of the textarea.
     * @prop {BoolString} [textareaHeightIsModify] - Whether users can resize textarea height.
     *
     * @prop {BoolString} [placeholderIsVisible] - Show placeholder or not.
     * @prop {string} [placeholderAddTop] - Vertical offset for placeholder (e.g., `"-10px"`).
     * @prop {string} [placeholderAddLeft] - Horizontal offset for placeholder.
     * @prop {string} [placeholderWidth] - Placeholder width.
     * @prop {string} [placeholderColor] - Placeholder text color.
     * @prop {string} [placeholderBackgroundColor] - Placeholder background color.
     * @prop {string} [placeholderTitle] - Placeholder title.
     * @prop {string} [placeholderTextContent] - Placeholder description/content.
     *
     * @prop {string} [attFilePreventTypes] - Comma-separated MIME types to block for file attachments.
     * @prop {string} [attFileAcceptTypes] - Comma-separated MIME types to allow for file attachments.
     * @prop {string} [attFileMaxSize] - Max file size in bytes.
     *
     * @prop {string} [attImagePreventTypes] - Comma-separated MIME types to block for image attachments.
     * @prop {string} [attImageAcceptTypes] - Comma-separated MIME types to allow for image attachments.
     * @prop {string} [attImageMaxSize] - Max image size in bytes.
     *
     * @prop {string} [defaultFontSize] - Default font size in px.
     * @prop {string} [defaultLineHeight] - Default line height.
     * @prop {string} [defaultFontFamily] - Default font family.
     * @prop {string} [defaultToolFontFamily] - Default toolbar font family.
     * @prop {string} [addFontFamily] - Additional font families to allow (comma-separated).
     * @prop {string} [removeFontFamily] - Font families to exclude.
     *
     * @prop {string} [language] - Language key (e.g., `"KOR"`, `"ENG"`).
     * @prop {string} [recodeLimit] - Max undo/redo stack count.
     * @prop {string} [sizeLevelDesktop] - Editor size ratio for desktop (1–9).
     * @prop {string} [sizeLevelMobile] - Editor size ratio for mobile (1–9).
     * @prop {Color|string} [color] - Main theme color.
     * @prop {BoolString} [invertColor] - Enable dark mode.
     *
     * @prop {BoolString} [usingParagraphStyle] - Show paragraph style options.
     * @prop {BoolString} [usingBold] - Show bold button.
     * @prop {BoolString} [usingUnderline] - Show underline button.
     * @prop {BoolString} [usingItalic] - Show italic button.
     * @prop {BoolString} [usingUl] - Show unordered list button.
     * @prop {BoolString} [usingOl] - Show ordered list button.
     * @prop {BoolString} [usingTextAlign] - Show text alignment options.
     * @prop {BoolString} [usingFontSize] - Show font size control.
     * @prop {BoolString} [usingLetterSpacing] - Show letter spacing control.
     * @prop {BoolString} [usingLineHeight] - Show line height control.
     * @prop {BoolString} [usingFontFamily] - Show font family selector.
     * @prop {BoolString} [usingColorText] - Show text color options.
     * @prop {BoolString} [usingColorBack] - Show background color options.
     * @prop {BoolString} [usingAttLink] - Show attach link button.
     * @prop {BoolString} [usingAttFile] - Show attach file button.
     * @prop {BoolString} [usingAttImage] - Show attach image button.
     * @prop {BoolString} [usingAttVideo] - Show attach video button.
     * @prop {BoolString} [usingFormatClear] - Show format clear (reset style) button.
     * @prop {BoolString} [usingUndo] - Show undo button.
     * @prop {BoolString} [usingRedo] - Show redo button.
     * @prop {BoolString} [usingHelp] - Show help/shortcut button.
     * @prop {BoolString} [usingParagraphAllStyle] - Show all paragraph style controls.
     * @prop {BoolString} [usingCharacterStyle] - Show all character style buttons.
     * @prop {BoolString} [usingCharacterSize] - Show font size and spacing controls.
     * @prop {BoolString} [usingAttachFile] - Show all attachment buttons.
     * @prop {BoolString} [usingDo] - Show both undo and redo.
     *
     * @event {(note: VanillanoteElement) => void} [mounted] - Called after editor is mounted.
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
     * To control the grid’s data, use the `hison.vue.getGrid(id)` method to retrieve the `GridMethods` instance.
     *
     * You can then call methods such as `load()`, `getRowData()`, `setCellValue()` and more to control the grid programmatically.
     *
     * ```ts
     * const grid = hison.vue.getGrid('grid01');
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
     *
     * @prop {string} [name] - Optional grid name. Defaults to `id` if omitted.
     * @prop {BoolString} [locked] - If true, disables editing on all cells.
     * @prop {BoolString} [lockedColor] - Show background color for locked cells.
     * @prop {BoolString} [resizable] - Whether column widths can be resized by mouse.
     * @prop {BoolString} [redoable] - Enable undo/redo functionality.
     * @prop {string} [redoCount] - Number of undo/redo history steps to keep.
     * @prop {BoolString} [visible] - Show/hide the grid (`display: none`).
     * @prop {BoolString} [headerVisible] - Show/hide the header.
     * @prop {BoolString} [rownumVisible] - Show/hide the row number column.
     * @prop {string} [rownumSize] - Width of the row number column.
     * @prop {BoolString} [rownumLockedColor] - Show locked color on rownum column.
     * @prop {BoolString} [statusVisible] - Show/hide status column.
     * @prop {BoolString} [statusLockedColor] - Show locked color on status column.
     * @prop {SelectionPolicy} [selectionPolicy] - User selection behavior: `range`, `single`, or `none`.
     * @prop {string} [nullValue] - Display value when cell value is `null`.
     * @prop {GridDateFormat} [dateFormat] - Global date format for date-type columns.
     * @prop {GridMonthFormat} [monthFormat] - Global month format for month-type columns.
     * @prop {BoolString} [alterRow] - Use alternate row background colors.
     * @prop {string} [frozenColCount] - Number of fixed/frozen columns (including hidden ones).
     * @prop {string} [frozenRowCount] - Number of fixed/frozen rows.
     * @prop {BoolString} [sortable] - Enable column sorting.
     * @prop {BoolString} [filterable] - Enable column filtering.
     * @prop {BoolString} [allCheckable] - Double-click header to toggle all checkboxes.
     * @prop {string} [checkedValue] - Value representing a checked checkbox.
     * @prop {string} [uncheckedValue] - Value representing an unchecked checkbox.
     *
     * @prop {string} [width] - Grid width (CSS text).
     * @prop {string} [height] - Grid height (CSS text).
     * @prop {string} [margin] - Grid margin (CSS text).
     * @prop {string} [padding] - Grid padding (CSS text).
     * @prop {string} [sizeLevel] - Relative size of the grid (e.g. 5 is standard).
     * @prop {GridVerticalAlign} [verticalAlign] - Default vertical alignment: `top`, `center`, `bottom`.
     * @prop {string} [cellFontSize] - Cell font size (CSS px).
     * @prop {string} [cellMinHeight] - Cell minimum height (CSS px).
     * @prop {string} [horizenBorderSize] - Horizontal border thickness (px).
     * @prop {string} [verticalBorderSize] - Vertical border thickness (px).
     * @prop {string} [gridFontFamily] - Font family for cells.
     * @prop {string} [editorFontFamily] - Font family for the editor input.
     * @prop {string} [overflowWrap] - CSS overflow-wrap for cells.
     * @prop {string} [wordBreak] - CSS word-break for cells.
     * @prop {string} [whiteSpace] - CSS white-space for cells.
     * @prop {string} [linkHasUnderLine] - Whether to underline link cells.
     * @prop {BoolString} [invertColor] - Enable dark mode.
     * @prop {Color|string} [color] - Main theme color (e.g., `"primary"` or `"#ff0000"`).
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
     * Hisonvue custom layout component.
     *
     * `HLayout` is a flexible layout container component that supports responsive design,
     * dynamic styling, and background control via props. It is registered in `hisonCloser`
     * and can be manipulated at runtime using layout methods.
     *
     * ---
     *
     * ### 🎯 Features
     * - Responsive layout via `hison-col-*` and device-based class resolution
     * - Background customization (image, color, alignment, repeat, size)
     * - Border and height configuration
     * - Visibility control and method access via `hison.vue.getLayout(id)`
     * - Emits `responsive-change` when device type changes (`'mb'`, `'tb'`, `'pc'`, `'wd'`)
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HLayout
     *   id="layout01"
     *   class="hison-col-12-mb hison-col-6-pc"
     *   visible="true"
     *   backColor="primary"
     *   backImageSrc="/img/bg.png"
     *   borderColor="#ccc"
     *   borderWidth="1px"
     *   height="300px"
     *   @responsive-change="onDeviceChange"
     * >
     *   <HButton ... />
     * </HLayout>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Use `hison.vue.getLayout(id)` to retrieve runtime control methods:
     *
     * ```ts
     * const layout = hison.vue.getLayout('layout01');
     * layout.setVisible(false);
     * layout.setBackColor('danger');
     * layout.setHeight('500px');
     * ```
     *
     * ---
     *
     * @prop {string} id - Unique layout identifier. Must be unique if specified. Enables method lookup via `hison.vue.getLayout(id)`.
     * @prop {string} [class] - Additional responsive classes like `hison-col-*`, `hison-pos-*`, etc.
     * @prop {string} [style] - Inline style string applied to the container. Merged with computed styles.
     * @prop {BoolString} [visible] - Controls visibility. `'true'` or `'false'` as string. Defaults to `'true'`.
     *
     * @prop {string} [backImageSrc] - Background image URL (`'/img/bg.jpg'`, `'https://...jpg'`).
     * @prop {string} [backImageStyle] - Background repeat/cover/contain settings (`'repeat'`, `'no-repeat'`, `'cover'`, etc.).
     * @prop {string} [backImageWidth] - Background size (`'100%'`, `'300px'`, etc.).
     * @prop {string} [backImageAlign] - Horizontal alignment (`'left'`, `'center'`, `'right'`).
     * @prop {string} [backImageVerticalAlign] - Vertical alignment (`'top'`, `'center'`, `'bottom'`).
     *
     * @prop {string} [backColor] - Background color. Hex (`'#fff'`), `rgba()`, or theme keyword (`'primary'`, `'danger'`, etc.).
     * @prop {string} [borderColor] - Border color. Same value types as `backColor`.
     * @prop {string} [borderWidth] - Border width (`'1px'`, `'0.5rem'`, etc.).
     * @prop {string} [height] - Height of the layout (`'100px'`, `'auto'`, `'100vh'`, etc.).
     *
     * ---
     *
     * @event mounted - Emitted when the layout is mounted. Passes `HLayoutMethods` instance.
     * @event responsive-change - Emitted when device type changes (mobile/tablet/pc/wide). Payload: `'mb' | 'tb' | 'pc' | 'wd'`.
     * @event click - Emitted on click.
     * @event mousedown - Emitted on mouse button down.
     * @event mouseup - Emitted on mouse button up.
     * @event mouseover - Emitted when hovered.
     * @event mouseout - Emitted when mouse leaves.
     */
    HLayout: typeof HLayout
  }
}
