import type { 
  HButton,
  HLayout,
  HNote,
  HGrid,
  HInput,
  HInputGroup,
  HCalendar,
  HChart,
} from './index'

declare module 'vue' {
  export interface GlobalComponents {
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
     * - Dynamic visibility and disabled state (`visible`, `disable` props)
     * - Runtime method control (`setText`, `setDisable`, `setVisible`, etc.)
     * - Supports both slot-based and `text` prop-based content:
     *   - If slot is present, it overrides `text`
     *   - Otherwise, `text` is rendered inside the button
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
     * <HButton
     *   id="btn01"
     *   class="hison-col-6 hison-color-primary"
     *   text="Click Me"
     *   title="Tooltip text"
     *   disable="false"
     *   visible="true"
     *   @click="(_, btn) => btn.setDisable(true)"
     *   @mounted="btn => console.log(btn.getId())"
     * />
     * ```
     * Or with slot:
     * ```vue
     * <HButton id="btn02">
     *   <strong>Custom Slot</strong>
     * </HButton>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Use `hison.vue.getButton(id)` to retrieve control methods at runtime:
     *
     * ```ts
     * const btn = hison.vue.getButton('btn01');
     * btn.setText('Updated');
     * btn.setDisable(true);
     * btn.setVisible(false);
     * btn.setTitle('Updated tooltip');
     * ```
     *
     * ---
     *
     * @prop {string} id - Unique button identifier. Enables runtime access via `hison.vue.getButton(id)`.
     * @prop {string} [class] - Additional class string. Supports `hison-*` responsive system.
     * @prop {string} [style] - Inline CSS style string.
     * @prop {BoolString} [visible] - Whether the button is shown (`'true'` or `'false'`). Default: `'true'`.
     * @prop {BoolString} [disable] - Whether the button is disabled. Default: `'false'`.
     * @prop {string} [text] - Fallback label text if no slot is provided. Can be updated at runtime.
     * @prop {string} [title] - Tooltip text. Can be updated via `setTitle()`.
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
     * @prop {Boolean} visible - Controls visibility of the editor field.
     * @prop {EditMode} editMode - Edit mode of the editor.
     *
     * @prop {NoteModeByDevice} [noteModeByDevice] - Force mobile, desktop, or adaptive mode.
     * @prop {NoteToolPosition} [toolPosition] - Toolbar position (`top` or `bottom`).
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
     * @prop {Color|string} [color] - Main theme color.
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
     * @prop {SelectionPolicy} [selectionPolicy] - User selection behavior: `range`, `single`, or `none`.
     * @prop {string} [nullValue] - Display value when cell value is `null`.
     * @prop {GridDateFormat} [dateFormat] - Global date format for date-type columns.
     * @prop {GridMonthFormat} [monthFormat] - Global month format for month-type columns.
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
     * @prop {GridVerticalAlign} [verticalAlign] - Default vertical alignment: `top`, `center`, `bottom`.
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
     * - Runtime registration using unique `id`, accessible via `hison.vue.getLayout(id)`
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
     *   borderColor="primary"
     *   borderWidth="1px"
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
     * Access the layout programmatically using `hison.vue.getLayout(id)`:
     *
     * ```ts
     * const layout = hison.vue.getLayout('mainLayout');
     * layout.setVisible(false);
     * layout.setBackColor('#f0f0f0');
     * layout.setHeight('100vh');
     * layout.setBackImageSrc('/new/image.jpg');
     * ```
     *
     * ---
     *
     * @prop {string} id - Unique layout identifier for method registration (`hison.vue.getLayout(id)`).
     * @prop {string} [class] - Responsive and custom classes (e.g., `hison-col-12-mb`, `hison-pos-center`).
     * @prop {string} [style] - Inline CSS style string merged with internal background/border styles.
     * @prop {BoolString} [visible] - Layout visibility as `'true'` or `'false'`. Default is visible.
     *
     * @prop {string} [backImageSrc] - Background image URL.
     * @prop {string} [backImageStyle] - Background repeat or size mode (`'cover'`, `'repeat'`, etc.).
     * @prop {string} [backImageWidth] - CSS size of background image (`'100%'`, `'auto'`, `'300px'`).
     * @prop {string} [backImageAlign] - Horizontal alignment (`'left'`, `'center'`, `'right'`).
     * @prop {string} [backImageVerticalAlign] - Vertical alignment (`'top'`, `'center'`, `'bottom'`).
     *
     * @prop {string} [backColor] - Background color (`#fff`, `rgba(0,0,0,0.1)`, or theme key like `'success'`).
     * @prop {string} [borderColor] - Border color. Same value rules as `backColor`.
     * @prop {string} [borderWidth] - Border width in valid CSS units (`'1px'`, `'0.5rem'`, etc.).
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
     * Hisonvue custom input component.
     *
     * `HInput` is a versatile and reactive input component that supports multiple input types,
     * rich formatting, and runtime state control. It features a dual-mode structure (editable input vs. readonly span),
     * and is integrated with `hisonCloser` for global runtime access.
     *
     * ---
     *
     * ### 🎯 Features
     * - Supports multiple input types: `'text'`, `'number'`, `'date'`, `'month'`, `'mask'`, `'digit'`, `'email'`, `'password'`
     * - Custom formatting via `format` prop (`#,##0.00`, date patterns, masks, etc.)
     * - Value truncation using `maxLength`, `maxByte`, `maxNumber`, `minNumber`, and `roundNumber`
     * - Editable or non-editable via `editMode` (`editable`, `readonly`, `disable`)
     * - Fully style-controllable via `required`, `fontBold`, `fontItalic`, `fontThruline`, `fontUnderline`
     * - Shows span text or input element depending on focus/editing state
     * - Responsive styling (`hison-col-*`, `hison-size-*`, etc.)
     * - All DOM events emit full `HInputMethods` for reactive access
     * - Runtime method control via `hison.vue.getInput(id)`
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HInput
     *   id="myInput"
     *   class="hison-col-6"
     *   inputType="number"
     *   format="#,##0.00"
     *   :modelValue="price"
     *   :maxNumber="10000"
     *   :roundNumber="0"
     *   visible="true"
     *   editMode="editable"
     *   placeholder="Enter value"
     *   @input="(_, input, value) => console.log(value)"
     *   @mounted="input => console.log(input.getId())"
     * />
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Use `hison.vue.getInput(id)` to retrieve control methods at runtime:
     *
     * ```ts
     * const input = hison.vue.getInput('myInput');
     * input.setValue('123456');
     * input.setFormat('#,##0');
     * input.setVisible(false);
     * input.setEditMode('readonly');
     * input.setFontBold(true);
     * ```
     *
     * ---
     *
     * @prop {string} id - Unique input identifier. Enables runtime access via `hison.vue.getInput(id)`.
     * @prop {string} [class] - Additional class string. Supports `hison-*` responsive system.
     * @prop {string | CSSProperties} [style] - Inline CSS style.
     * @prop {BoolString} [visible='true'] - Whether the input is shown (`'true'` or `'false'`).
     * @prop {string} [modelValue] - Bound value. Controlled via `v-model`.
     * @prop {string} [inputType='text'] - Input type (`text`, `number`, `date`, `month`, `email`, etc.).
     * @prop {string} [format] - Format string for numeric/date/mask formatting.
     * @prop {string} [nullText] - Placeholder text when value is empty in readonly mode.
     * @prop {string} [maxNumber] - Maximum numeric value. Only applies to `inputType='number'`.
     * @prop {string} [minNumber] - Minimum numeric value. Only applies to `inputType='number'`.
     * @prop {string} [roundNumber] - Rounding precision for numeric values.
     * @prop {string} [maxLength] - Maximum number of characters allowed.
     * @prop {string} [maxByte] - Maximum number of bytes (UTF-8).
     * @prop {string} [placeholder] - Placeholder string shown inside the input.
     * @prop {EditMode} [editMode='editable'] - Edit mode: `'editable'`, `'readonly'`, `'disable'`.
     * @prop {BoolString} [required='false'] - Whether the input is required.
     * @prop {BoolString} [fontBold='false'] - Whether the span text is bold.
     * @prop {BoolString} [fontItalic='false'] - Whether the span text is italic.
     * @prop {BoolString} [fontThruline='false'] - Whether the span text is strikethrough.
     * @prop {BoolString} [fontUnderline='false'] - Whether the span text is underlined.
     * @prop {string} [title] - Tooltip text. Can be updated via `setTitle()`.
     *
     * ---
     *
     * @event mounted - Emitted after mounting. Passes `HInputMethods` instance.
     * @event responsive-change - Emitted when device class changes (`'mb'`, `'tb'`, `'pc'`, `'wd'`).
     * @event update:modelValue - Emitted when the bound value changes.
     *
     * @event input - Emitted on input. Passes `(Event, HInputMethods, newValue)`.
     * @event change - Emitted on blur with `(oldValue, newValue, HInputMethods)`.
     * @event focus - Emitted on input focus. Passes `(FocusEvent, HInputMethods)`.
     * @event blur - Emitted on input blur. Passes `(Event, HInputMethods)`.
     *
     * @event click - Emitted on readonly span click. Passes `(MouseEvent, HInputMethods)`.
     * @event dblclick - Emitted on double click. Passes `(MouseEvent, HInputMethods)`.
     * @event mousedown - Emitted on mouse button press. Passes `(MouseEvent, HInputMethods)`.
     * @event mouseup - Emitted on mouse button release. Passes `(MouseEvent, HInputMethods)`.
     * @event mouseenter - Emitted when mouse enters the element. Passes `(MouseEvent, HInputMethods)`.
     * @event mouseleave - Emitted when mouse leaves the element. Passes `(MouseEvent, HInputMethods)`.
     * @event mouseover - Emitted on mouse over. Passes `(MouseEvent, HInputMethods)`.
     * @event mouseout - Emitted on mouse out. Passes `(MouseEvent, HInputMethods)`.
     * @event mousemove - Emitted on mouse move. Passes `(MouseEvent, HInputMethods)`.
     *
     * @event pointerdown - Emitted on pointer press. Passes `(PointerEvent, HInputMethods)`.
     * @event pointerup - Emitted on pointer release. Passes `(PointerEvent, HInputMethods)`.
     * @event pointermove - Emitted on pointer move. Passes `(PointerEvent, HInputMethods)`.
     * @event pointerenter - Emitted when pointer enters. Passes `(PointerEvent, HInputMethods)`.
     * @event pointerleave - Emitted when pointer leaves. Passes `(PointerEvent, HInputMethods)`.
     *
     * @event touchstart - Emitted on touch start. Passes `(TouchEvent, HInputMethods)`.
     * @event touchend - Emitted on touch end. Passes `(TouchEvent, HInputMethods)`.
     * @event touchmove - Emitted on touch move. Passes `(TouchEvent, HInputMethods)`.
     * @event touchcancel - Emitted when touch is canceled. Passes `(TouchEvent, HInputMethods)`.
     *
     * @event keydown - Emitted on key press. Passes `(KeyboardEvent, HInputMethods)`.
     * @event keyup - Emitted on key release. Passes `(KeyboardEvent, HInputMethods)`.
     * @event compositionstart - Emitted when IME composition starts. Passes `(CompositionEvent, HInputMethods)`.
     * @event compositionupdate - Emitted during IME composition. Passes `(CompositionEvent, HInputMethods)`.
     * @event compositionend - Emitted when IME composition ends. Passes `(CompositionEvent, HInputMethods)`.
     *
     * @event dragstart - Emitted when drag starts. Passes `(DragEvent, HInputMethods)`.
     * @event dragend - Emitted when drag ends. Passes `(DragEvent, HInputMethods)`.
     * @event drag - Emitted during dragging. Passes `(DragEvent, HInputMethods)`.
     * @event drop - Emitted on drop. Passes `(DragEvent, HInputMethods)`.
     * @event copy - Emitted on copy. Passes `(ClipboardEvent, HInputMethods)`.
     * @event cut - Emitted on cut. Passes `(ClipboardEvent, HInputMethods)`.
     * @event paste - Emitted on paste. Passes `(ClipboardEvent, HInputMethods)`.
     * @event wheel - Emitted on wheel scroll. Passes `(WheelEvent, HInputMethods)`.
     * @event contextmenu - Emitted on right-click context menu. Passes `(MouseEvent, HInputMethods)`.
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
     * `Record<string, any>`, `DataWrapper`, or `DataModel`, and integrates with `hison.vue.getInputGroup(id)`
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
     * - Can reset all owned inputs via `.clear()`
     * - Tracks whether any child `HInput` is modified via `.isModified()`
     * - Applies or retrieves form-wide status (`C`, `R`, `U`, `D`) via `.getStatus()` and `.setStatus()`
     * - Applies global edit mode to all child inputs (`editable`, `readonly`, `disable`)
     * - Supports required field validation via `.checkRequired()`
     * - Runtime methods available via `hison.vue.getInputGroup(id)`
     *
     * ---
     *
     * ### ⚙️ Usage
     * ```vue
     * <HInputGroup id="group1" :editMode="'editable'" @mounted="group => group.load(myData)">
     *   <HInput id="userid" inputType="text" required />
     *   <HInput id="email" inputType="email" />
     * </HInputGroup>
     * ```
     *
     * --- 
     *
     * ### 🛠 Runtime Usage
     * Use `hison.vue.getInputGroup(id)` to access and control the group:
     * ```ts
     * const group = hison.vue.getInputGroup('group1');
     * group.load({ userid: 'abc', email: 'test@example.com' });
     * group.clear();
     * group.setStatus('U');
     * group.setEditMode('readonly');
     * const data = group.getDataWrapper();
     * const changed = group.isModified();
     * ```
     *
     * ---
     *
     * ### 🔒 Notes
     * - `v-model` is not supported. You must use `.load()` to apply external data.
     * - Modification tracking is internally managed and reflects only user-triggered changes.
     * - Child `<HInput>` components must use the same `id` as the data key for mapping to work.
     * - Grouped `HInput` instances register themselves on mount via `provide('registerToInputGroup')`.
     *
     * ---
     *
     * @prop {string} id - Unique group identifier. Enables runtime access via `hison.vue.getInputGroup(id)`.
     * @prop {EditMode} [editMode='editable'] - Edit mode: `'editable'`, `'readonly'`, `'disable'`.
     * @prop {DataStatus} [status='R'] - Data status: `'C'`, `'R'`, `'U'`, `'D'`. Managed via `.getStatus()` / `.setStatus()`.
     *
     * @event mounted - Emitted after mount with `HInputGroupMethods` instance.
     */
    HInputGroup: typeof HInputGroup

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
     * - Dynamic runtime control via `HCalendarMethods` (`hison.vue.getCalendar(id)`)
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
     * Use `hison.vue.getCalendar(id)` to retrieve methods at runtime:
     *
     * ```ts
     * const calendar = hison.vue.getCalendar('calendarId');
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
     * @prop {string} id - Unique calendar identifier. Enables runtime access via `hison.vue.getCalendar(id)`.
     * @prop {string} [class] - Additional class string. Supports `hison-*` responsive system.
     * @prop {string | CSSProperties} [style] - Inline CSS style.
     * @prop {BoolString} [visible='true'] - Whether the calendar is shown.
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
     * @prop {HCalenderTimeFormat} [timeFormat] - Format for displaying time cells.
     * @prop {number} [timeFrom] - Start of time range (minutes from midnight).
     * @prop {number} [timeStep] - Interval step for time slots (in minutes).
     * @prop {number} [timeTo] - End of time range (minutes from midnight).
     * @prop {boolean} [hideTitleBar=false] - Whether to hide the title bar.
     * @prop {boolean} [twelveHour=false] - Whether to show time in 12-hour format (with am/pm).
     * @prop {HCalenderView} [activeView] - Initial view (`'day'`, `'week'`, `'month'`, etc.).
     * @prop {HCalenderView[]} [disableViews] - Views to exclude from navigation.
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
     * Hisonvue chart component powered by Chart.js.
     *
     * ### Built with `chart.js@^4.5.0`
     * `HChart` is a lightweight wrapper around [Chart.js](https://www.chartjs.org/),  
     * offering full compatibility with all standard chart types, configuration options, and runtime methods.
     *
     * Internally, the following components are pre-registered:
     *
     * - 📊 **Controllers**: `BarController`, `LineController`, `RadarController`, `PieController`,  
     *   `DoughnutController`, `BubbleController`, `ScatterController`
     * - 🧩 **Elements**: `ArcElement`, `LineElement`, `BarElement`, `PointElement`
     * - 📏 **Scales**: `CategoryScale`, `LinearScale`, `RadialLinearScale`
     * - 🧰 **Plugins**: `Tooltip`, `Legend`, `Filler`
     *
     * ---
     *
     * ### 📈 Features
     * - Supports all built-in Chart.js chart types (`'bar'`, `'line'`, `'pie'`, `'doughnut'`, etc.)
     * - Preserves all Chart.js props, config options, events, and methods
     * - Runtime access via `HChartInstance` (`hison.vue.getChart(id)`)
     * - Minimal styling applied (`hison-col-*`, `display: none` when hidden)
     * - Automatic color string parsing (e.g., `'red.500'` → rgba format)
     * - Full access to underlying `Chart` instance (`update()`, `resize()`, etc.)
     *
     * ---
     *
     * ### 📦 Chart.js Compatibility
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
     * ### ⚙️ Usage
     * ```vue
     * <HChart
     *   id="myChart"
     *   type="doughnut"
     *   class="hison-col-6"
     *   :modelValue="chartData"
     *   :options="chartOptions"
     * />
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime Usage
     * Use `hison.vue.getChart(id)` to retrieve the Chart.js instance:
     *
     * ```ts
     * const chart = hison.vue.getChart('myChart')
     * chart.data.datasets[0].data = [10, 20, 30]
     * chart.options.plugins.legend.display = false
     * chart.update()
     * chart.setVisible(false)
     * ```
     *
     * ---
     *
     * @prop {string} id - Unique chart identifier. Enables runtime access via `hison.vue.getChart(id)`.
     * @prop {ChartType} type - Chart.js chart type (e.g., `'line'`, `'bar'`, `'pie'`).
     * @prop {ChartData} modelValue - Chart.js data object (used with `v-model`).
     * @prop {ChartOptions} [options] - Optional Chart.js configuration object.
     * @prop {string} [class] - Additional responsive class string (e.g., `hison-col-6`).
     * @prop {string | CSSProperties} [style] - Inline CSS styles.
     * @prop {boolean} [visible=true] - Whether the chart is visible.
     *
     * ---
     *
     * @event mounted - Emitted when the chart instance is initialized.
     * @event responsive-change - Emitted when responsive class changes due to device detection.
     */
    HChart: typeof HChart
  }
}
