<!-- Script -->
<script lang="ts">
    import AceStatusbar from "./AceStatusbar.svelte";
    import { createEventDispatcher, tick, onMount, onDestroy } from "svelte";
    
    const EDITOR_ID = `ace-editor-div:${Math.floor(Math.random() * 10000000000)}`;
    const dispatch = createEventDispatcher();

    let cursor: AceAjax.Position;
    let editor : AceAjax.Editor;
    let contentBackup  = "";
    
    export let value = "";
    export let lang = "javascript";
    export let theme = "textmate"; //chrome"; // one_dark
    export let height = "100%";
    export let width = "100%";
    export let options = {
        /*
        // editor options
        selectionStyle: 'line',// "line"|"text"
        highlightActiveLine: true, // boolean
        highlightSelectedWord: true, // boolean
        readOnly: false, // boolean: true if read only
        cursorStyle: 'ace', // "ace"|"slim"|"smooth"|"wide"
        mergeUndoDeltas: true, // false|true|"always"
        behavioursEnabled: true, // boolean: true if enable custom behaviours
        wrapBehavioursEnabled: true, // boolean
        autoScrollEditorIntoView: undefined, // boolean: this is needed if editor is inside scrollable page
        keyboardHandler: null, // function: handle custom keyboard events

        // renderer options
        animatedScroll: false, // boolean: true if scroll should be animated
        displayIndentGuides: false, // boolean: true if the indent should be shown. See 'showInvisibles'
        showInvisibles: false, // boolean -> displayIndentGuides: true if show the invisible tabs/spaces in indents
        showPrintMargin: true, // boolean: true if show the vertical print margin
        printMarginColumn: 80, // number: number of columns for vertical print margin
        printMargin: undefined, // boolean | number: showPrintMargin | printMarginColumn
        showGutter: true, // boolean: true if show line gutter
        fadeFoldWidgets: false, // boolean: true if the fold lines should be faded
        showFoldWidgets: true, // boolean: true if the fold lines should be shown ?
        showLineNumbers: true,
        highlightGutterLine: false, // boolean: true if the gutter line should be highlighted
        hScrollBarAlwaysVisible: false, // boolean: true if the horizontal scroll bar should be shown regardless
        vScrollBarAlwaysVisible: false, // boolean: true if the vertical scroll bar should be shown regardless
        fontSize: 12, // number | string: set the font size to this many pixels
        fontFamily: undefined, // string: set the font-family css value
        maxLines: undefined, // number: set the maximum lines possible. This will make the editor height changes
        minLines: undefined, // number: set the minimum lines possible. This will make the editor height changes
        maxPixelHeight: 0, // number -> maxLines: set the maximum height in pixel, when 'maxLines' is defined. 
        scrollPastEnd: 0, // number -> !maxLines: if positive, user can scroll pass the last line and go n * editorHeight more distance 
        fixedWidthGutter: false, // boolean: true if the gutter should be fixed width
        theme: 'ace/theme/textmate', // theme string from ace/theme or custom?

        // mouseHandler options
        scrollSpeed: 2, // number: the scroll speed index
        dragDelay: 0, // number: the drag delay before drag starts. it's 150ms for mac by default 
        dragEnabled: true, // boolean: enable dragging
        focusTimout: 0, // number: the focus delay before focus starts.
        tooltipFollowsMouse: true, // boolean: true if the gutter tooltip should follow mouse

        // session options
        firstLineNumber: 1, // number: the line number in first line
        overwrite: false, // boolean
        newLineMode: 'auto', // "auto" | "unix" | "windows"
        useWorker: true, // boolean: true if use web worker for loading scripts
        useSoftTabs: false, // boolean: true if we want to use spaces than tabs
        tabSize: 2, // number
        wrap: false, // boolean | string | number: true/'free' means wrap instead of horizontal scroll, false/'off' means horizontal scroll instead of wrap, and number means number of column before wrap. -1 means wrap at print margin
        indentedSoftWrap: true, // boolean
        foldStyle: 'markbegin', // enum: 'manual'/'markbegin'/'markbeginend'.
        mode: 'ace/mode/html' // string: path to language mode
        */
    };
    export let readonly = false;
    export let sbHeight = "20px";
    export let sbVisible = true;

    export function onResize() {
        if(editor) { editor.resize(); }
    }

    export function getEditor() {
         return editor;
    }
    export function setFocus()
    { 
        if(editor && !editor.isFocused()) { 
            editor.focus();
        } 
    }

    onDestroy(() => {
        if (editor) {
            dispatch('closed', editor.getCursorPosition());
            editor.destroy();
            editor.container.remove();
        }
    });

    onMount(function () {
        if(window.ace) {
            lang = lang || "text";
            theme = theme || "chrome";
            editor = ace.edit(EDITOR_ID);
            dispatch("init", editor);
            editor.$blockScrolling = Infinity;
            editor.getSession().setMode("ace/mode/" + lang);
            editor.setTheme("ace/theme/" + theme);
            editor.setValue(value, 1);
            editor.setReadOnly(readonly);
            contentBackup = value;
            cursor = editor.getCursorPosition();
            
            setEventCallBacks();
            if (options) {
                editor.setOptions(options);
            }

            editor.commands.addCommand({
                name: 'saveFile',
                bindKey: {
                    win: 'Ctrl-S',
                    mac: 'Command-S'
                },
                exec: (env , args) => { dispatch('save'); }
            });
            editor.commands.addCommand({
                name: 'runFile',
                bindKey: {
                    win: 'Ctrl-R',
                    mac: 'Command-R'
                },
                exec: (env, args) => { dispatch('run'); }
            });
            dispatch("created");
        }
    });

    $: watchValue(value);
    function watchValue(val: string) {
        if (contentBackup !== val && editor && typeof val === "string") {
            editor.session.setValue(val);
            contentBackup = val;
        }
    }
    
    $: watchTheme(theme);
    function watchTheme(newTheme: string) {
        if (editor) {
            editor.setTheme("ace/theme/" + newTheme);
        }
    }

    $: watchMode(lang);
    function watchMode(newOption: string) {
        if (editor) {
            editor.getSession().setMode("ace/mode/" + newOption);
        }
    }

    $: watchOptions(options);
    function watchOptions(newOption: object) {
        if (editor) {
            editor.setOptions(newOption);
        }
    }

    $: watchReadOnlyFlag(readonly);
    function watchReadOnlyFlag(flag: boolean) {
        if (editor) {
            editor.setReadOnly(flag);
        }
    }

    const resizeOnNextTick = () =>
        tick().then(() => {
        if (editor) {
            editor.resize();
        }
        });

    $: if (height !== null && width !== null) {
        resizeOnNextTick();
    }

    function setEventCallBacks() {
        
        editor.onChangeMode = (obj) => {
            dispatch("changeMode", obj);
        }
        editor.onCommandKey = (err, hashId, keyCode) => {
            dispatch("commandKey", { err, hashId, keyCode });
        }
        editor.onCut = () => {
            const copyText = editor.getCopyText();
            editor.insert("");
            dispatch("cut", copyText);
        };
        
        editor.onDocumentChange = (obj) => {
            dispatch("documentChange", obj);
        }

        editor.on("focus", function() {
            dispatch("focus");
        });

        editor.on("copy", function(evt) {
            dispatch("copy", evt);
        });

        editor.on("paste", function(evt) {
            dispatch("paste", evt);
            console.log("paste", evt);
        });

        editor.on("blur", function(e) { 
            dispatch("blur", e); 
        });

        editor.on("change", function () {
            const content = editor.getValue();
            value = content;
            dispatch("input", content);
            contentBackup = content;
        });

        editor.on("changeSelection", function() {
            dispatch("changeSelection");
        });
    }
</script>

<!-- Elements -->
<div class="panel" style="width:{width}; height:{height}">
    <div id={EDITOR_ID} style="width:{width}; height: calc({height} - {sbVisible ? sbHeight : "0px"})" />
    <AceStatusbar
        theme={theme}
        width={width}
        editor={editor}
        height={sbHeight}
        visible={sbVisible}
    />
</div>

<!-- Styles -->
<style>
    .panel {
        margin: 0;
        padding: 0;
    }
</style>