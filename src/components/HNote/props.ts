import { CSSProperties, PropType } from "vue";
import { Color, NoteModeByDevice, NoteToolPosition, BoolString } from "../../enums";
import { NoteData } from "vanillanote2";

export const noteProps = {
    id: { type: String, required: false },
    modelValue: Object as () => NoteData,
    class: {type: String, required: false },
    style: { type: [String, Object] as PropType<string | CSSProperties>, required: false },
    /**
     * ADAPTIVE : The composition of notes varies depending on whether the device is a desktop or mobile device.
     * MOBILE : Always recognize as mobile.
     * DESKTOP : Always recognize as desktop.
     */
    noteModeByDevice: { type: String as PropType<NoteModeByDevice>, required: false },
    /**
    * Position of the toolbar
    */
    toolPosition: { type: String as PropType<NoteToolPosition>, required: false },
    /**
    * Toolbar Line Count
    */
    toolDefaultLine: { type: String, required: false },
    /**
    * Whether to use the toolbar fold/unfold function
    */
    toolToggle: { type: String as PropType<BoolString>, required: false },
    /**
     * - Variables for dynamically setting the size of the textarea
     * - Default width of the textarea. If not set, the value of textarea-width is inserted. Used for dynamically changing the width.
     */
    textareaWidth: { type: String, required: false },
    /**
     * - Variables for dynamically setting the size of the textarea
     * - Default height of the textarea. If not set, the value of textarea-height is inserted. Used for dynamically changing the height. Only insert css style in px units.(ex. 400px)
     */
    textareaHeight: { type: String, required: false },
    /**
     * - Variables for dynamically setting the max size of the textarea
     * - Default max-width of the textarea. If not set, the value of textarea-max-width is inserted. Used for dynamically changing the width.
     */
    textareaMaxWidth: { type: String, required: false },
    /**
     * - Variables for dynamically setting the max size of the textarea
     * - Default max-height of the textarea. If not set, the value of textarea-max-height is inserted. Used for dynamically changing the height. Only insert css style in px units.(ex. 900px)
     */
    textareaMaxHeight: { type: String, required: false },
    /**
     * Whether the user can change the height of the textarea. If true, it can be changed.
     */
    textareaHeightIsModify: { type: String as PropType<BoolString>, required: false },
    /**
     * - Values related to placeholders. The attribute placeholder- can be used, but using these variables allows dynamic control of placeholders.
     * - `true` : Uses a placeholder.
     * - `false` : Default value. Does not use a placeholder.
     */
    placeholderIsVisible: { type: String as PropType<BoolString>, required: false },
    /**
     * - Values related to placeholders. The attribute placeholder- can be used, but using these variables allows dynamic control of placeholders.
     * - Adjusts the vertical position of the placeholder. Negative values are possible. The unit is px. Default value is 0.
     */
    placeholderAddTop: { type: String, required: false },
    /**
     * - Values related to placeholders. The attribute placeholder- can be used, but using these variables allows dynamic control of placeholders.
     * - Adjusts the horizontal position of the placeholder. Negative values are possible. The unit is px. Default value is 0.
     */
    placeholderAddLeft: { type: String, required: false },
    /**
     * - Values related to placeholders. The attribute placeholder- can be used, but using these variables allows dynamic control of placeholders.
     * - Sets the width of the placeholder. The default value is the size of the flexible textarea.
     */
    placeholderWidth: { type: String, required: false },
    /** 
     * Placeholder text color
     */
    placeholderColor: { type: String, required: false },
    /** 
     * Placeholder background color
     */
    placeholderBackgroundColor: { type: String, required: false },
    /** 
     * Placeholder title text
     */
    placeholderTitle: { type: String, required: false },
    /** 
     * Placeholder body text
     */
    placeholderTextContent: { type: String, required: false },
    /**
     * - Variables controlling file attachments.
     * - Data obtained from note.getNoteData() does not include files deleted by the user from the screen, but .attFiles[idx] contains all files attached by the user.
     * - File types to block for file attachment. Written in MIME type (ex image/png). Default is [].
     */
    attFilePreventTypes: { type: String, required: false },
    /**
     * - Variables controlling file attachments.
     * - Data obtained from note.getNoteData() does not include files deleted by the user from the screen, but .attFiles[idx] contains all files attached by the user.
     * - File types to allow for file attachment. Written in MIME type (ex image/png). Default is []. If present, only those files can be attached.
     */
    attFileAcceptTypes: { type: String, required: false },
    /**
     * - Variables controlling file attachments.
     * - Data obtained from note.getNoteData() does not include files deleted by the user from the screen, but .attFiles[idx] contains all files attached by the user.
     * - Maximum size allowed for file attachment. Default is 20MB.
     * 
     * ```typescript
     * vn.variables.attFileMaxSize[0] = 50 * 1024 * 1024;
     * ```
     */
    attFileMaxSize: { type: String, required: false },
    /**
     * - Variables controlling image file attachments.
     * - Data obtained from note.getNoteData() does not include files deleted by the user from the screen, but .attImages[idx] contains all image files attached by the user.
     * - File types to block for image attachment. Written in MIME type (ex image/png). Default is [].
     */
    attImagePreventTypes: { type: String, required: false },
    /**
     * - Variables controlling image file attachments.
     * - Data obtained from note.getNoteData() does not include files deleted by the user from the screen, but .attImages[idx] contains all image files attached by the user.
     * - File types to allow for image attachment. Written in MIME type (ex image/png). Default is []. If present, only those files can be attached.
     */
    attImageAcceptTypes: { type: String, required: false },
    /**
     * - Variables controlling image file attachments.
     * - Data obtained from note.getNoteData() does not include files deleted by the user from the screen, but .attImages[idx] contains all image files attached by the user.
     * - Maximum size allowed for image attachment. Default is 20MB.
     * 
     * ```typescript
     * vn.variables.attImageMaxSize[0] = 50 * 1024 * 1024;
     * ```
     */
    attImageMaxSize: { type: String, required: false },
    /**
     * default textarea font-size
     */
    defaultFontSize: { type: String, required: false },
    /**
     * default textarea line-height
     */
    defaultLineHeight: { type: String, required: false },
    /**
     * default textarea font-family
     */
    defaultFontFamily: { type: String, required: false },
    /**
     * default tool box font-family
     */
    defaultToolFontFamily: { type: String, required: false },
    /**
     * font-family to add
     */
    addFontFamily: { type: String, required: false },
        /**
     * font-family to remove
     */
    removeFontFamily: { type: String, required: false },
    /**
     * - Sets the language of the editor. Used in conjunction with .languageSet. An error occurs if a key not in .languageSet is entered.
     * - `'ENG'` : Default value. Sets the language of the note to English.
     * - `'KOR'` : Sets the language of the note to Korean.
     * - `'...'` : Can be used after being defined in .languageSet.
     */
    language: { type: String, required: false },
    /** 
     * Maximum undo/redo record count
     */
    recodeLimit: { type: String, required: false },
    /**
     * Size (ratio) of note elements on desktop
     */
    sizeLevelDesktop: { type: String, required: false },
    /**
     * Size (ratio) of note elements on mobile
     */
    sizeLevelMobile: { type: String, required: false },
    /** 
     * Main theme color for the editor
     */
    color: { type: String as PropType<Color> || String, required: false },
    /** 
     * Whether to use inverted (dark mode) colors
     */
    invertColor: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to use paragraph style buttons (normal, heading, etc.)
     */
    usingParagraphStyle: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to use bold button
     */
    usingBold: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to use underline button
     */
    usingUnderline: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to use italic button
     */
    usingItalic: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to use unordered list (ul) button
     */
    usingUl: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to use ordered list (ol) button
     */
    usingOl: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to use text align buttons (left, center, right)
     */
    usingTextAlign: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to use attach link button
     */
    usingAttLink: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to use attach file button
     */
    usingAttFile: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to use attach image button
     */
    usingAttImage: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to use attach video button
     */
    usingAttVideo: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to allow font size adjustment
     */
    usingFontSize: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to allow letter spacing adjustment
     */
    usingLetterSpacing: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to allow line height adjustment
     */
    usingLineHeight: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to allow font family change
     */
    usingFontFamily: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to allow text color change
     */
    usingColorText: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to allow background color change
     */
    usingColorBack: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to use format clear (remove styles) button
     */
    usingFormatClear: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to use undo button
     */
    usingUndo: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to use redo button
     */
    usingRedo: { type: String as PropType<BoolString>, required: false },
    /** 
     * Whether to use help (shortcut guide) button
     */
    usingHelp: { type: String as PropType<BoolString>, required: false },
    /**
     * Whether to use paragraph style all buttons
     */
    usingParagraphAllStyle: { type: String as PropType<BoolString>, required: false },
    /**
     * Whether to use character style all buttons
     */
    usingCharacterStyle: { type: String as PropType<BoolString>, required: false },
    /**
     * Whether to use character size all buttons
     */
    usingCharacterSize: { type: String as PropType<BoolString>, required: false },
    /**
     * Whether to use attachment all buttons
     */
    usingAttachFile: { type: String as PropType<BoolString>, required: false },
    /**
     * Whether to use redo and undo buttons
     */
    usingDo: { type: String as PropType<BoolString>, required: false },
    /**
     * Whether the note is required.
     * - Accepts `'true'` or `'false'`
     * - Adds `hison-note-required` class when `'true'`
     */
    required: { type: String as PropType<BoolString>, required: false },
}

export const noteEventProps = {
    //textarea event
    textareaBeforeClick : Function as PropType<(event: Event) => boolean>,
    textareaAfterClick : Function as PropType<(event: Event) => void>,
    textareaBeforeFocus : Function as PropType<(event: Event) => boolean>,
    textareaAfterFocus : Function as PropType<(event: Event) => void>,
    textareaBeforeBlur : Function as PropType<(event: Event) => boolean>,
    textareaAfterBlur : Function as PropType<(event: Event) => void>,
    //paragraphStyleSelect event
    paragraphStyleSelectBeforeClick : Function as PropType<(event: Event) => boolean>,
    paragraphStyleSelectAfterClick : Function as PropType<(event: Event) => void>,
    //toolToggle event
    toolToggleBeforeClick : Function as PropType<(event: Event) => boolean>,
    toolToggleAfterClick : Function as PropType<(event: Event) => void>,
    //styleNomal event
    styleNomalBeforeClick : Function as PropType<(event: Event) => boolean>,
    styleNomalAfterClick : Function as PropType<(event: Event) => void>,
    //styleHeader1 event
    styleHeader1BeforeClick : Function as PropType<(event: Event) => boolean>,
    styleHeader1AfterClick : Function as PropType<(event: Event) => void>,
    //styleHeader2 event
    styleHeader2BeforeClick : Function as PropType<(event: Event) => boolean>,
    styleHeader2AfterClick : Function as PropType<(event: Event) => void>,
    //styleHeader3 event
    styleHeader3BeforeClick : Function as PropType<(event: Event) => boolean>,
    styleHeader3AfterClick : Function as PropType<(event: Event) => void>,
    //styleHeader4 event
    styleHeader4BeforeClick : Function as PropType<(event: Event) => boolean>,
    styleHeader4AfterClick : Function as PropType<(event: Event) => void>,
    //styleHeader5 event
    styleHeader5BeforeClick : Function as PropType<(event: Event) => boolean>,
    styleHeader5AfterClick : Function as PropType<(event: Event) => void>,
    //styleHeader6 event
    styleHeader6BeforeClick : Function as PropType<(event: Event) => boolean>,
    styleHeader6AfterClick : Function as PropType<(event: Event) => void>,
    //bold event
    boldBeforeClick : Function as PropType<(event: Event) => boolean>,
    boldAfterClick : Function as PropType<(event: Event) => void>,
    //underline event
    underlineBeforeClick : Function as PropType<(event: Event) => boolean>,
    underlineAfterClick : Function as PropType<(event: Event) => void>,
    //italic event
    italicBeforeClick : Function as PropType<(event: Event) => boolean>,
    italicAfterClick : Function as PropType<(event: Event) => void>,
    //ul event
    ulBeforeClick : Function as PropType<(event: Event) => boolean>,
    ulAfterClick : Function as PropType<(event: Event) => void>,
    //ol event
    olBeforeClick : Function as PropType<(event: Event) => boolean>,
    olAfterClick : Function as PropType<(event: Event) => void>,
    //textAlignSelect event
    textAlignSelectBeforeClick : Function as PropType<(event: Event) => boolean>,
    textAlignSelectAfterClick : Function as PropType<(event: Event) => void>,
    //textAlignLeft event
    textAlignLeftBeforeClick : Function as PropType<(event: Event) => boolean>,
    textAlignLeftAfterClick : Function as PropType<(event: Event) => void>,
    //textAlignCenter event
    textAlignCenterBeforeClick : Function as PropType<(event: Event) => boolean>,
    textAlignCenterAfterClick : Function as PropType<(event: Event) => void>,
    //textAlignRight event
    textAlignRightBeforeClick : Function as PropType<(event: Event) => boolean>,
    textAlignRightAfterClick : Function as PropType<(event: Event) => void>,
    //attLink event
    attLinkBeforeClick : Function as PropType<(event: Event) => boolean>,
    attLinkAfterClick : Function as PropType<(event: Event) => void>,
    //attFile event
    attFileBeforeClick : Function as PropType<(event: Event) => boolean>,
    attFileAfterClick : Function as PropType<(event: Event) => void>,
    //attImage event
    attImageBeforeClick : Function as PropType<(event: Event) => boolean>,
    attImageAfterClick : Function as PropType<(event: Event) => void>,
    //attVideo event
    attVideoBeforeClick : Function as PropType<(event: Event) => boolean>,
    attVideoAfterClick : Function as PropType<(event: Event) => void>,
    //fontSizeBox event
    fontSizeBoxBeforeClick : Function as PropType<(event: Event) => boolean>,
    fontSizeBoxAfterClick : Function as PropType<(event: Event) => void>,
    //fontSize event
    fontSizeBeforeClick : Function as PropType<(event: Event) => boolean>,
    fontSizeAfterClick : Function as PropType<(event: Event) => void>,
    fontSizeBeforeInput : Function as PropType<(event: Event) => boolean>,
    fontSizeAfterInput : Function as PropType<(event: Event) => void>,
    fontSizeBeforeBlur : Function as PropType<(event: Event) => boolean>,
    fontSizeAfterBlur : Function as PropType<(event: Event) => void>,
    //letterSpacingBox event
    letterSpacingBoxBeforeClick : Function as PropType<(event: Event) => boolean>,
    letterSpacingBoxAfterClick : Function as PropType<(event: Event) => void>,
    //letterSpacing event
    letterSpacingBeforeClick : Function as PropType<(event: Event) => boolean>,
    letterSpacingAfterClick : Function as PropType<(event: Event) => void>,
    letterSpacingBeforeInput : Function as PropType<(event: Event) => boolean>,
    letterSpacingAfterInput : Function as PropType<(event: Event) => void>,
    letterSpacingBeforeBlur : Function as PropType<(event: Event) => boolean>,
    letterSpacingAfterBlur : Function as PropType<(event: Event) => void>,
    //lineHeightBox event
    lineHeightBoxBeforeClick : Function as PropType<(event: Event) => boolean>,
    lineHeightBoxAfterClick : Function as PropType<(event: Event) => void>,
    //lineHeight event
    lineHeightBeforeClick : Function as PropType<(event: Event) => boolean>,
    lineHeightAfterClick : Function as PropType<(event: Event) => void>,
    lineHeightBeforeInput : Function as PropType<(event: Event) => boolean>,
    lineHeightAfterInput : Function as PropType<(event: Event) => void>,
    lineHeightBeforeBlur : Function as PropType<(event: Event) => boolean>,
    lineHeightAfterBlur : Function as PropType<(event: Event) => void>,
    //fontFamilySelect event
    fontFamilySelectBeforeClick : Function as PropType<(event: Event) => boolean>,
    fontFamilySelectAfterClick : Function as PropType<(event: Event) => void>,
    //color text select
    colorTextSelectBeforeClick : Function as PropType<(event: Event) => boolean>,
    colorTextSelectAfterClick : Function as PropType<(event: Event) => void>,
    //color text select box
    colorTextSelectBoxBeforeClick : Function as PropType<(event: Event) => boolean>,
    colorTextSelectBoxAfterClick : Function as PropType<(event: Event) => void>,
    //colorText0 
    colorText0BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorText0AfterClick : Function as PropType<(event: Event) => void>,
    //colorText1 
    colorText1BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorText1AfterClick : Function as PropType<(event: Event) => void>,
    //colorText2 
    colorText2BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorText2AfterClick : Function as PropType<(event: Event) => void>,
    //colorText3 
    colorText3BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorText3AfterClick : Function as PropType<(event: Event) => void>,
    //colorText4 
    colorText4BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorText4AfterClick : Function as PropType<(event: Event) => void>,
    //colorText5 
    colorText5BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorText5AfterClick : Function as PropType<(event: Event) => void>,
    //colorText6 
    colorText6BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorText6AfterClick : Function as PropType<(event: Event) => void>,
    //colorText7 
    colorText7BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorText7AfterClick : Function as PropType<(event: Event) => void>,
    //colorText R event
    colorTextRBeforeClick : Function as PropType<(event: Event) => boolean>,
    colorTextRAfterClick : Function as PropType<(event: Event) => void>,
    colorTextRBeforeInput : Function as PropType<(event: Event) => boolean>,
    colorTextRAfterInput : Function as PropType<(event: Event) => void>,
    colorTextRBeforeBlur : Function as PropType<(event: Event) => boolean>,
    colorTextRAfterBlur : Function as PropType<(event: Event) => void>,
    //colorText G event
    colorTextGBeforeClick : Function as PropType<(event: Event) => boolean>,
    colorTextGAfterClick : Function as PropType<(event: Event) => void>,
    colorTextGBeforeInput : Function as PropType<(event: Event) => boolean>,
    colorTextGAfterInput : Function as PropType<(event: Event) => void>,
    colorTextGBeforeBlur : Function as PropType<(event: Event) => boolean>,
    colorTextGAfterBlur : Function as PropType<(event: Event) => void>,
    //colorText B event
    colorTextBBeforeClick : Function as PropType<(event: Event) => boolean>,
    colorTextBAfterClick : Function as PropType<(event: Event) => void>,
    colorTextBBeforeInput : Function as PropType<(event: Event) => boolean>,
    colorTextBAfterInput : Function as PropType<(event: Event) => void>,
    colorTextBBeforeBlur : Function as PropType<(event: Event) => boolean>,
    colorTextBAfterBlur : Function as PropType<(event: Event) => void>,
    //colorText Opacity event
    colorTextOpacityBeforeClick : Function as PropType<(event: Event) => boolean>,
    colorTextOpacityAfterClick : Function as PropType<(event: Event) => void>,
    colorTextOpacityBeforeInput : Function as PropType<(event: Event) => boolean>,
    colorTextOpacityAfterInput : Function as PropType<(event: Event) => void>,
    colorTextOpacityBeforeBlur : Function as PropType<(event: Event) => boolean>,
    colorTextOpacityAfterBlur : Function as PropType<(event: Event) => void>,
    //color background select
    colorBackSelectBeforeClick : Function as PropType<(event: Event) => boolean>,
    colorBackSelectAfterClick : Function as PropType<(event: Event) => void>,
    //color back select box
    colorBackSelectBoxBeforeClick : Function as PropType<(event: Event) => boolean>,
    colorBackSelectBoxAfterClick : Function as PropType<(event: Event) => void>,
    //colorBack0 
    colorBack0BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorBack0AfterClick : Function as PropType<(event: Event) => void>,
    //colorBack1 
    colorBack1BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorBack1AfterClick : Function as PropType<(event: Event) => void>,
    //colorBack2 
    colorBack2BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorBack2AfterClick : Function as PropType<(event: Event) => void>,
    //colorBack3 
    colorBack3BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorBack3AfterClick : Function as PropType<(event: Event) => void>,
    //colorBack4 
    colorBack4BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorBack4AfterClick : Function as PropType<(event: Event) => void>,
    //colorBack5 
    colorBack5BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorBack5AfterClick : Function as PropType<(event: Event) => void>,
    //colorBack6 
    colorBack6BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorBack6AfterClick : Function as PropType<(event: Event) => void>,
    //colorBack7 
    colorBack7BeforeClick : Function as PropType<(event: Event) => boolean>,
    colorBack7AfterClick : Function as PropType<(event: Event) => void>,
    //colorBack R event
    colorBackRBeforeClick : Function as PropType<(event: Event) => boolean>,
    colorBackRAfterClick : Function as PropType<(event: Event) => void>,
    colorBackRBeforeInput : Function as PropType<(event: Event) => boolean>,
    colorBackRAfterInput : Function as PropType<(event: Event) => void>,
    colorBackRBeforeBlur : Function as PropType<(event: Event) => boolean>,
    colorBackRAfterBlur : Function as PropType<(event: Event) => void>,
    //colorBack G event
    colorBackGBeforeClick : Function as PropType<(event: Event) => boolean>,
    colorBackGAfterClick : Function as PropType<(event: Event) => void>,
    colorBackGBeforeInput : Function as PropType<(event: Event) => boolean>,
    colorBackGAfterInput : Function as PropType<(event: Event) => void>,
    colorBackGBeforeBlur : Function as PropType<(event: Event) => boolean>,
    colorBackGAfterBlur : Function as PropType<(event: Event) => void>,
    //colorBack B event
    colorBackBBeforeClick : Function as PropType<(event: Event) => boolean>,
    colorBackBAfterClick : Function as PropType<(event: Event) => void>,
    colorBackBBeforeInput : Function as PropType<(event: Event) => boolean>,
    colorBackBAfterInput : Function as PropType<(event: Event) => void>,
    colorBackBBeforeBlur : Function as PropType<(event: Event) => boolean>,
    colorBackBAfterBlur : Function as PropType<(event: Event) => void>,
    //colorBack Opacity event
    colorBackOpacityBeforeClick : Function as PropType<(event: Event) => boolean>,
    colorBackOpacityAfterClick : Function as PropType<(event: Event) => void>,
    colorBackOpacityBeforeInput : Function as PropType<(event: Event) => boolean>,
    colorBackOpacityAfterInput : Function as PropType<(event: Event) => void>,
    colorBackOpacityBeforeBlur : Function as PropType<(event: Event) => boolean>,
    colorBackOpacityAfterBlur : Function as PropType<(event: Event) => void>,
    //formatClear event
    formatClearBeforeClick : Function as PropType<(event: Event) => boolean>,
    formatClearAfterClick : Function as PropType<(event: Event) => void>,
    //undo event
    undoBeforeClick : Function as PropType<(event: Event) => boolean>,
    undoAfterClick : Function as PropType<(event: Event) => void>,
    //redo event
    redoBeforeClick : Function as PropType<(event: Event) => boolean>,
    redoAfterClick : Function as PropType<(event: Event) => void>,
    //help event
    helpBeforeClick : Function as PropType<(event: Event) => boolean>,
    helpAfterClick : Function as PropType<(event: Event) => void>,
    //modal back event
    modalBackBeforeClick : Function as PropType<(event: Event) => boolean>,
    modalBackAfterClick : Function as PropType<(event: Event) => void>,
    //modal att link event
    attLinkModalBeforeClick : Function as PropType<(event: Event) => boolean>,
    attLinkModalAfterClick : Function as PropType<(event: Event) => void>,
    //modal att link text input event
    attLinkTextBeforeInput : Function as PropType<(event: Event) => boolean>,
    attLinkTextAfterInput : Function as PropType<(event: Event) => void>,
    attLinkTextBeforeBlur : Function as PropType<(event: Event) => boolean>,
    attLinkTextAfterBlur : Function as PropType<(event: Event) => void>,
    //modal att link href input event
    attLinkHrefBeforeInput : Function as PropType<(event: Event) => boolean>,
    attLinkHrefAfterInput : Function as PropType<(event: Event) => void>,
    attLinkHrefBeforeBlur : Function as PropType<(event: Event) => boolean>,
    attLinkHrefAfterBlur : Function as PropType<(event: Event) => void>,
    //modal att link insert  event
    attLinkInsertBeforeClick : Function as PropType<(event: Event) => boolean>,
    attLinkInsertAfterClick : Function as PropType<(event: Event) => void>,
    //modal att file event
    attFileModalBeforeClick : Function as PropType<(event: Event) => boolean>,
    attFileModalAfterClick : Function as PropType<(event: Event) => void>,
    //modal att file upload  event
    attFileUploadBeforeClick : Function as PropType<(event: Event) => boolean>,
    attFileUploadAfterClick : Function as PropType<(event: Event) => void>,
    //modal att file upload div event
    attFileUploadDivBeforeDragover : Function as PropType<(event: Event) => boolean>,
    attFileUploadDivAfterDragover : Function as PropType<(event: Event) => void>,
    attFileUploadDivBeforeDrop : Function as PropType<(event: Event) => boolean>,
    attFileUploadDivAfterDrop : Function as PropType<(event: Event) => void>,
    attFileUploadDivBeforeClick : Function as PropType<(event: Event) => boolean>,
    attFileUploadDivAfterClick : Function as PropType<(event: Event) => void>,
    //modal att file upload input event
    attFileUploadBeforeInput : Function as PropType<(event: Event) => boolean>,
    attFileUploadAfterInput : Function as PropType<(event: Event) => void>,
    attFileUploadBeforeBlur : Function as PropType<(event: Event) => boolean>,
    attFileUploadAfterBlur : Function as PropType<(event: Event) => void>,
    //modal att file insert  event
    attFileInsertBeforeClick : Function as PropType<(event: Event) => boolean>,
    attFileInsertAfterClick : Function as PropType<(event: Event) => void>,
    //att link tooltip edit  event
    attLinkTooltipEditBeforeClick : Function as PropType<(event: Event) => boolean>,
    attLinkTooltipEditAfterClick : Function as PropType<(event: Event) => void>,
    //att link tooltip unlink  event
    attLinkTooltipUnlinkBeforeClick : Function as PropType<(event: Event) => boolean>,
    attLinkTooltipUnlinkAfterClick : Function as PropType<(event: Event) => void>,
    //modal att image event
    attImageModalBeforeClick : Function as PropType<(event: Event) => boolean>,
    attImageModalAfterClick : Function as PropType<(event: Event) => void>,
    //modal att image upload  and view event
    attImageUploadViewBeforeDragover : Function as PropType<(event: Event) => boolean>,
    attImageUploadViewAfterDragover : Function as PropType<(event: Event) => void>,
    attImageUploadViewBeforeDrop : Function as PropType<(event: Event) => boolean>,
    attImageUploadViewAfterDrop : Function as PropType<(event: Event) => void>,
    attImageUploadViewBeforeClick : Function as PropType<(event: Event) => boolean>,
    attImageUploadViewAfterClick : Function as PropType<(event: Event) => void>,
    //modal att image view pre  event
    attImageViewPreBeforeClick : Function as PropType<(event: Event) => boolean>,
    attImageViewPreAfterClick : Function as PropType<(event: Event) => void>,
    //modal att image view next  event
    attImageViewNextBeforeClick : Function as PropType<(event: Event) => boolean>,
    attImageViewNextAfterClick : Function as PropType<(event: Event) => void>,
    //modal att image upload input event
    attImageUploadBeforeInput : Function as PropType<(event: Event) => boolean>,
    attImageUploadAfterInput : Function as PropType<(event: Event) => void>,
    attImageUploadBeforeBlur : Function as PropType<(event: Event) => boolean>,
    attImageUploadAfterBlur : Function as PropType<(event: Event) => void>,
    //modal att image url input event
    attImageURLBeforeInput : Function as PropType<(event: Event) => boolean>,
    attImageURLAfterInput : Function as PropType<(event: Event) => void>,
    attImageURLBeforeBlur : Function as PropType<(event: Event) => boolean>,
    attImageURLAfterBlur : Function as PropType<(event: Event) => void>,
    //modal att image insert  event
    attImageInsertBeforeClick : Function as PropType<(event: Event) => boolean>,
    attImageInsertAfterClick : Function as PropType<(event: Event) => void>,
    //modal att video event
    attVideoModalBeforeClick : Function as PropType<(event: Event) => boolean>,
    attVideoModalAfterClick : Function as PropType<(event: Event) => void>,
    //modal att video embed id input event
    attVideoEmbedIdBeforeInput : Function as PropType<(event: Event) => boolean>,
    attVideoEmbedIdAfterInput : Function as PropType<(event: Event) => void>,
    attVideoEmbedIdBeforeBlur : Function as PropType<(event: Event) => boolean>,
    attVideoEmbedIdAfterBlur : Function as PropType<(event: Event) => void>,
    //modal att video width input event
    attVideoWidthBeforeInput : Function as PropType<(event: Event) => boolean>,
    attVideoWidthAfterInput : Function as PropType<(event: Event) => void>,
    attVideoWidthBeforeBlur : Function as PropType<(event: Event) => boolean>,
    attVideoWidthAfterBlur : Function as PropType<(event: Event) => void>,
    //modal att video height input event
    attVideoHeightBeforeInput : Function as PropType<(event: Event) => boolean>,
    attVideoHeightAfterInput : Function as PropType<(event: Event) => void>,
    attVideoHeightBeforeBlur : Function as PropType<(event: Event) => boolean>,
    attVideoHeightAfterBlur : Function as PropType<(event: Event) => void>,
    //modal att video insert  event
    attVideoInsertBeforeClick : Function as PropType<(event: Event) => boolean>,
    attVideoInsertAfterClick : Function as PropType<(event: Event) => void>,
    //att image tooltip width event
    attImageAndVideoTooltipWidthBeforeInput : Function as PropType<(event: Event) => boolean>,
    attImageAndVideoTooltipWidthAfterInput : Function as PropType<(event: Event) => void>,
    attImageAndVideoTooltipWidthBeforeBlur : Function as PropType<(event: Event) => boolean>,
    attImageAndVideoTooltipWidthAfterBlur : Function as PropType<(event: Event) => void>,
    attImageAndVideoTooltipWidthBeforeKeyup : Function as PropType<(event: Event) => boolean>,
    attImageAndVideoTooltipWidthAfterKeyup : Function as PropType<(event: Event) => void>,
    //att image tooltip float none radio input event
    attImageAndVideoTooltipFloatRadioNoneBeforeClick : Function as PropType<(event: Event) => boolean>,
    attImageAndVideoTooltipFloatRadioNoneAfterClick : Function as PropType<(event: Event) => void>,
    //att image tooltip float left radio input event
    attImageAndVideoTooltipFloatRadioLeftBeforeClick : Function as PropType<(event: Event) => boolean>,
    attImageAndVideoTooltipFloatRadioLeftAfterClick : Function as PropType<(event: Event) => void>,
    //att image tooltip float right radio input event
    attImageAndVideoTooltipFloatRadioRightBeforeClick : Function as PropType<(event: Event) => boolean>,
    attImageAndVideoTooltipFloatRadioRightAfterClick : Function as PropType<(event: Event) => void>,
    //att image tooltip shape square radio input event
    attImageAndVideoTooltipShapeRadioSquareBeforeClick : Function as PropType<(event: Event) => boolean>,
    attImageAndVideoTooltipShapeRadioSquareAfterClick : Function as PropType<(event: Event) => void>,
    //att image tooltip shape radius radio input event
    attImageAndVideoTooltipShapeRadioRadiusBeforeClick : Function as PropType<(event: Event) => boolean>,
    attImageAndVideoTooltipShapeRadioRadiusAfterClick : Function as PropType<(event: Event) => void>,
    //att image tooltip shape circle radio input event
    attImageAndVideoTooltipShapeRadioCircleBeforeClick : Function as PropType<(event: Event) => boolean>,
    attImageAndVideoTooltipShapeRadioCircleAfterClick : Function as PropType<(event: Event) => void>,
    //modal help event
    helpModalBeforeClick : Function as PropType<(event: Event) => boolean>,
    helpModalAfterClick : Function as PropType<(event: Event) => void>,
    //placeholder event
    placeholderBeforeClick : Function as PropType<(event: Event) => boolean>,
    placeholderAfterClick : Function as PropType<(event: Event) => void>,
}
