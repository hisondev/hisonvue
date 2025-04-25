import { PropType } from "vue";
import { NoteModeByDevice, NoteToolPosition } from "../../enums";
import { NoteData } from "vanillanote2";

export const noteProps = {
    modelValue: Object as () => NoteData,
    dataId: { type: String, required: true },
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
    toolToggle: { type: String, required: false },
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
    textareaHeightIsModify: { type: String, required: false },
    /**
     * - Values related to placeholders. The attribute placeholder- can be used, but using these variables allows dynamic control of placeholders.
     * - `true` : Uses a placeholder.
     * - `false` : Default value. Does not use a placeholder.
     */
    placeholderIsVisible: { type: String, required: false },
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
    mainColor: { type: String, required: false },
    /** 
     * Predefined color set name
     */
    colorSet: { type: String, required: false },
    /** 
     * Whether to use inverted (dark mode) colors
     */
    invertColor: { type: String, required: false },
    /** 
     * Whether to use paragraph style buttons (normal, heading, etc.)
     */
    usingParagraphStyle: { type: String, required: false },
    /** 
     * Whether to use bold button
     */
    usingBold: { type: String, required: false },
    /** 
     * Whether to use underline button
     */
    usingUnderline: { type: String, required: false },
    /** 
     * Whether to use italic button
     */
    usingItalic: { type: String, required: false },
    /** 
     * Whether to use unordered list (ul) button
     */
    usingUl: { type: String, required: false },
    /** 
     * Whether to use ordered list (ol) button
     */
    usingOl: { type: String, required: false },
    /** 
     * Whether to use text align buttons (left, center, right)
     */
    usingTextAlign: { type: String, required: false },
    /** 
     * Whether to use attach link button
     */
    usingAttLink: { type: String, required: false },
    /** 
     * Whether to use attach file button
     */
    usingAttFile: { type: String, required: false },
    /** 
     * Whether to use attach image button
     */
    usingAttImage: { type: String, required: false },
    /** 
     * Whether to use attach video button
     */
    usingAttVideo: { type: String, required: false },
    /** 
     * Whether to allow font size adjustment
     */
    usingFontSize: { type: String, required: false },
    /** 
     * Whether to allow letter spacing adjustment
     */
    usingLetterSpacing: { type: String, required: false },
    /** 
     * Whether to allow line height adjustment
     */
    usingLineHeight: { type: String, required: false },
    /** 
     * Whether to allow font family change
     */
    usingFontFamily: { type: String, required: false },
    /** 
     * Whether to allow text color change
     */
    usingColorText: { type: String, required: false },
    /** 
     * Whether to allow background color change
     */
    usingColorBack: { type: String, required: false },
    /** 
     * Whether to use format clear (remove styles) button
     */
    usingFormatClear: { type: String, required: false },
    /** 
     * Whether to use undo button
     */
    usingUndo: { type: String, required: false },
    /** 
     * Whether to use redo button
     */
    usingRedo: { type: String, required: false },
    /** 
     * Whether to use help (shortcut guide) button
     */
    usingHelp: { type: String, required: false },
    /**
     * Whether to use paragraph style all buttons
     */
    usingParagraphAllStyle: { type: String, required: false },
    /**
     * Whether to use character style all buttons
     */
    usingCharacterStyle: { type: String, required: false },
    /**
     * Whether to use character size all buttons
     */
    usingCharacterSize: { type: String, required: false },
    /**
     * Whether to use attachment all buttons
     */
    usingAttachFile: { type: String, required: false },
    /**
     * Whether to use redo and undo buttons
     */
    usingDo: { type: String, required: false },
}
