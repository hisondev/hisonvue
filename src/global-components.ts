import type { 
  HButton,
  HLayout,
  HNote,
  HGrid,
  HFileSet,
  HImageBox,
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
     * @prop {string} [class] - Additional class string. Supports `hison-*` responsive system.
     * @prop {string | CSSProperties} [style] - Inline CSS style.
     * @prop {boolean} [visible] - Whether the button is shown (`'true'` or `'false'`). Default: `'true'`.
     * @prop {boolean} [disable] - Whether the button is disabled. Default: `'false'`.
     * @prop {string} [text] - Fallback label text if no default slot is provided. Can be updated at runtime.
     * @prop {string} [title] - Tooltip text. Can be updated via `setTitle()`.
     * @prop {('filled'|'empty'|'transparent')} [backgroundType] - Background style. `'filled'` (default), `'empty'`, or `'transparent'`. Can be changed at runtime via methods.
     * @prop {number} [clickInterval] - Minimum interval (in ms) between allowed clicks. Prevents repeated clicks within the specified time. Can be changed at runtime.
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
     * @prop {string} [class] - Responsive and custom classes (e.g., `hison-col-12-mb`, `hison-pos-center`).
     * @prop {string} [style] - Inline CSS style string merged with internal background/border styles.
     * @prop {boolean} [visible] - Layout visibility as `'true'` or `'false'`. Default is visible.
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
     * Hisonvue single image upload & preview component.
     *
     * `HImageBox` provides a complete single-image upload solution with preview, drag-and-drop, and runtime API for business apps.
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
     * - **Runtime API**: Access and control via `HImageBoxMethods` instance
     * - **Server file (soft-delete) vs. new upload (removal)**: handles both
     * - **DataModel integration** and seamless v-model syncing
     * - **Slot support**: `empty`, `add-button`, `remove-button`
     *
     * ---
     *
     * ### ⚙️ Usage Example
     * ```vue
     * <HImageBox
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
     * </HImageBox>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime API Usage
     * ```ts
     * const imageBox = hison.vue.getInput('profileImage')
     * imageBox.setEditMode('readonly')
     * imageBox.setAllowedTypes(['.jpg'])
     * imageBox.setMaxFileSize(1024 * 1024)
     * imageBox.setValue({ fileName: 'avatar.jpg', ... })
     * imageBox.focus()
     * ```
     *
     * ---
     *
     * @prop {string} [id] Unique identifier for the image box. Enables runtime access via `hison.vue.getInput(id)`. Duplicate IDs will throw an error.
     * @prop {string} [class] Extra class string. Supports all hisonvue responsive, color, and size classes.
     * @prop {string|CSSProperties} [style] Inline CSS style for the container.
     * @prop {string|CSSProperties} [imgStyle] CSS style or string for the `<img>` element (image preview).
     * @prop {boolean} [visible=true] Controls component visibility.
     * @prop {EditMode} [editMode='editable'] Edit mode: `'editable'`, `'readonly'`, or `'disable'`.
     * @prop {AttachedFileItem|null} [modelValue=null] The current image file object (preloaded or new). Controlled via `v-model`.
     * @prop {string} [attId=''] Group ID for backend image association.
     * @prop {string} [addButtonText='Add'] Label for the add/upload button (if not using the `add-button` slot).
     * @prop {string} [removeButtonText='Remove'] Label for the remove button (if not using the `remove-button` slot).
     * @prop {string} [placeholder='There is no image'] Message shown when no image is present (shows in the empty slot unless overridden).
     * @prop {boolean} [enableDrop=true] Enables drag-and-drop image upload area.
     * @prop {string|string[]} [allowedTypes] Allowed MIME types or extensions (array or comma-separated string).
     * @prop {string|string[]} [disallowedTypes] Disallowed MIME types or extensions (array or comma-separated string).
     * @prop {number} [maxFileSize=Infinity] Maximum file size (bytes) for the image. Files larger than this are rejected.
     * @prop {(file: File, allowed: string[]|null, disallowed: string[]|null) => void} [onDisallowedType] Callback when file type/extension is not allowed.
     * @prop {(file: File, size: number, max: number) => void} [onMaxFileSizeExceeded] Callback when a file is too large.
     *
     * ---
     *
     * @event mounted Emitted on mount. Passes the `HImageBoxMethods` instance.
     * @event responsive-change Emitted when device class changes (mobile/tablet/pc/wide).
     * @event update:modelValue Emitted when the image changes (add, remove, delete, etc).
     * @event add Emitted when an image is added. Arguments: `(file: AttachedFileItem, methods: HImageBoxMethods)`
     * @event remove Emitted when an image is removed. Arguments: `(file: AttachedFileItem, methods: HImageBoxMethods)`
     * @event change Emitted whenever the image is changed. Arguments: `(newValue: AttachedFileItem|null, methods: HImageBoxMethods)`
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
     * <HImageBox>
     *   <template #empty>
     *     <div style="color:#ccc;">📷 No Image Selected</div>
     *   </template>
     * </HImageBox>
     *
     * @slot add-button
     * Customizes the **inside** of the add button (`HButton`). Replaces only the button's content, not the button itself.
     * Scoped props:
     *   - `add: () => void` (opens file dialog)
     *
     * @example
     * <HImageBox>
     *   <template #add-button="{ add }">
     *     <span><i class="fa fa-plus"></i> Add Image</span>
     *   </template>
     * </HImageBox>
     *
     * @slot remove-button
     * Customizes the **inside** of the remove button (`HButton`). Replaces only the button's content, not the button itself.
     * Scoped props:
     *   - `remove: () => void` (removes the current image)
     *
     * @example
     * <HImageBox>
     *   <template #remove-button="{ remove }">
     *     <span><i class="fa fa-trash"></i> Delete</span>
     *   </template>
     * </HImageBox>
     */
    HImageBox: typeof HImageBox

    /**
     * Hisonvue file attachment component.
     *
     * `HFileSet` is a fully reactive, feature-rich file upload and management UI for Vue 3.
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
     * - **Runtime API**: Access and control everything at runtime using `HFileSetMethods`.
     * - **Custom download**: Secure and extend download via custom handler.
     * - **Integration**: Programmatic access via `hison.vue.getInput(id)`.
     * - **Full slot support**: Custom icons, add/remove button, even drag-drop interaction.
     *
     * ---
     *
     * ### ⚙️ Usage Example
     * ```vue
     * <HFileSet
     *   id="fileSet"
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
     * </HFileSet>
     * ```
     *
     * ---
     *
     * ### 🛠 Runtime API Usage
     * ```ts
     * const fileSet = hison.vue.getInput('fileSet')
     * fileSet.setEditMode('readonly')
     * fileSet.setAllowedTypes(['.pdf'])
     * fileSet.setMaxFileCount(2)
     * fileSet.setValue([{ fileName: 'final.pdf', ... }])
     * fileSet.focus()
     * ```
     *
     * ---
     *
     * @prop {string} [id] Unique identifier for the file set. Enables runtime access via `hison.vue.getInput(id)`. Duplicate IDs will throw an error.
     * @prop {string} [class] Additional class string. Supports all hisonvue responsive, color, and size classes.
     * @prop {string|CSSProperties} [style] Inline CSS style for the container.
     * @prop {boolean} [visible=true] Controls component visibility.
     * @prop {EditMode} [editMode='editable'] Edit state: `'editable'`, `'readonly'`, or `'disable'`.
     * @prop {AttachedFileItem[]} [modelValue=[]] File list (preloaded or new). Controlled via `v-model`.
     * @prop {string} [attId=''] Group ID for backend file association.
     * @prop {string} [addButtonText='Add'] Label for the add/upload button (if not using the `add-button` slot).
     * @prop {string} [removeButtonText='x'] Label for the remove button (if not using the `remove-button` slot).
     * @prop {string} [placeholder='drop your files.'] Message shown when file list is empty.
     * @prop {boolean} [enableDrop=true] Enables drag-and-drop file upload area.
     * @prop {(file: AttachedFileItem) => void} [downloadHandler] Custom download handler. Overrides default download logic.
     * @prop {boolean} [multiCols=false] Display files in multiple columns (two-row layout).
     * @prop {boolean} [multiple=true] Allow multiple file selection/upload.
     * @prop {string|string[]} [allowedTypes] Allowed MIME types or extensions. Accepts array or comma-separated string.
     * @prop {string|string[]} [disallowedTypes] Disallowed MIME types or extensions. Accepts array or comma-separated string.
     * @prop {number} [maxFileSize=Infinity] Maximum file size (bytes) per file. Exceeding files are rejected.
     * @prop {number} [maxTotalFileSize=Infinity] Maximum total size (bytes) for all files combined.
     * @prop {number} [maxFileCount=0] Maximum number of files allowed (0: unlimited).
     * @prop {(file: File, allowed: string[]|null, disallowed: string[]|null) => void} [onDisallowedType] Callback when file type/extension is not allowed.
     * @prop {(file: File, size: number, max: number) => void} [onMaxFileSizeExceeded] Callback when a file is too large.
     * @prop {(file: File, total: number, max: number) => void} [onMaxTotalSizeExceeded] Callback when total file size limit is exceeded.
     *
     * ---
     *
     * @event mounted Emitted on mount. Passes `HFileSetMethods` instance.
     * @event responsive-change Emitted on device class change (mobile/tablet/pc/wide).
     * @event update:modelValue Emitted when the file list changes (add, remove, delete, etc).
     * @event add Emitted when a file is added. Arguments: `(file: AttachedFileItem, methods: HFileSetMethods)`
     * @event remove Emitted when a file is removed. Arguments: `(file: AttachedFileItem, methods: HFileSetMethods)`
     * @event change Emitted whenever the file list is changed. Arguments: `(newList: AttachedFileItem[], oldList: AttachedFileItem[], methods: HFileSetMethods)`
     * @event download Emitted when a download is triggered. Arguments: `(file: AttachedFileItem, methods: HFileSetMethods)`
     * @event focus Emitted when the add button or file input receives focus.
     * @event blur Emitted when the file input or file set loses focus.
     *
     * ---
     *
     * @slot file-icon
     * Custom icon or markup to be shown before each file name. Receives the `file` object as a scoped prop.
     *
     * @example
     * <HFileSet v-model="files">
     *   <template #file-icon="{ file }">
     *     <span v-if="file.extension === 'pdf'">📕</span>
     *     <span v-else-if="file.extension === 'jpg'">🖼️</span>
     *     <span v-else>📄</span>
     *   </template>
     * </HFileSet>
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
     * <HFileSet v-model="files">
     *   <template #remove-button="{ file, index, remove, disable }">
     *     <span class="custom-remove-btn" :disabled="disable" @click="remove" style="cursor: pointer;">❌</span>
     *   </template>
     * </HFileSet>
     *
     * @slot add-button
     * Custom slot for the contents **inside** the add button (`HButton`). Only replaces the button's content, not the button itself.
     * Scoped props:
     *   - `add: () => void` (opens file dialog)
     *   - `disable: boolean`
     *
     * @example
     * <HFileSet v-model="files">
     *   <template #add-button="{ add, disable }">
     *     <span>📁 Select Files</span>
     *   </template>
     * </HFileSet>
     */
    HFileSet: typeof HFileSet

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
     * @prop {string} [class] - Additional class string. Supports `hison-*` responsive system.
     * @prop {string | CSSProperties} [style] - Inline CSS style.
     * @prop {boolean} [visible='true'] - Whether the input is shown (`'true'` or `'false'`).
     * @prop {any} [modelValue] - Bound value for the input. Controlled via `v-model`.
     * @prop {string} [inputType='text'] - Input type. Supports:
     *   `'text'`, `'number'`, `'date'`, `'month'`, `'email'`, `'password'`, `'mask'`, `'digit'`,
     *   `'checkbox'`, `'select'`, `'textarea'`, `'range'`, `'color'`
     * @prop {string} [format] - Format string for numeric, date, or masked values.
     * @prop {string} [nullText] - Text to show when value is empty in readonly mode.
     * @prop {string} [maxNumber] - Maximum value for numeric input.
     * @prop {string} [minNumber] - Minimum value for numeric input.
     * @prop {string} [roundNumber] - Decimal rounding precision.
     * @prop {string} [maxLength] - Max number of characters.
     * @prop {string} [maxByte] - Max number of bytes (UTF-8).
     * @prop {string} [placeholder] - Placeholder shown in input when empty.
     * @prop {EditMode} [editMode='editable'] - Edit state: `'editable'`, `'readonly'`, `'disable'`.
     * @prop {boolean} [required='false'] - Whether the input is required.
     * @prop {boolean} [fontBold='false'] - Whether span text is bold.
     * @prop {boolean} [fontItalic='false'] - Whether span text is italic.
     * @prop {boolean} [fontThruline='false'] - Whether span text is strikethrough.
     * @prop {boolean} [fontUnderline='false'] - Whether span text is underlined.
     * @prop {string} [title] - Tooltip text (HTML `title` attribute).
     *
     * @prop {{ text: string; value: any }[]} [options=[]] - Selectable items for `inputType='select'`.
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
     * @prop {EditMode} [editMode='editable'] - Edit mode: `'editable'`, `'readonly'`, `'disable'`.
     * @prop {DataStatus} [status='R'] - Data status: `'C'`, `'R'`, `'U'`, `'D'`. Managed via `.getStatus()` / `.setStatus()`.
     * @prop {Record<string, any>} [modelValue] - Used with `v-model` for two-way binding of grouped input values.
     *
     * @event mounted - Emitted after mount with `HInputGroupMethods` instance.
     * @event update:modelValue - Emitted when any child `HInput` changes, propagating the updated object.
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
     * @prop {string} [class] - Additional class string. Supports `hison-*` responsive system.
     * @prop {string | CSSProperties} [style] - Inline CSS style.
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
     * @prop {ChartType} type - Chart.js chart type (e.g., `'line'`, `'bar'`, `'pie'`).
     * @prop {ChartData} modelValue - Chart.js data object (used with `v-model`).
     * @prop {ChartOptions} [options] - Optional Chart.js configuration object.
     * @prop {string} [class] - Additional responsive class string (e.g., `hison-col-6`).
     * @prop {string | CSSProperties} [style] - Inline CSS styles.
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
  }
}
