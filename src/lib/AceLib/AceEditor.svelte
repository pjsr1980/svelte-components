<!-- Script -->
<script lang="ts">
    import { createEventDispatcher, tick, onMount, onDestroy } from "svelte";
    
    const EDITOR_ID = `ace-editor-div:${Math.floor(Math.random() * 10000000000)}`;
    const dispatch = createEventDispatcher();

    let editor : AceAjax.Editor;
    let contentBackup  = "";

    export let value = "";
    export let lang = "javascript";
    export let theme = "chrome";
    export let height = "100%";
    export let width = "100%";
    export let options = {};
    export let readonly = false;


    export function onResize() {
        if(editor) {
            editor.resize();
        }
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
    export function getPosition() { 
        if(editor) { 
            let pos = editor.getCursorPosition(); 
            pos.row += 1; 
        }
    }
    export function setPosition(row: number, column: number) {
        if(editor) { 
            editor.gotoLine(row, column);
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

    const ValidPxDigitsRegEx = /^\d*$/;
    function px(n : string) {
        if (ValidPxDigitsRegEx.test(n)) {
            return n + "px";
        }
        return n;
    }

    function setEventCallBacks() {
        editor.onBlur = () => { 
            dispatch("blur");
        }
        editor.onChangeMode = (obj) => {
            dispatch("changeMode", obj);
        }
        editor.onCommandKey = (err, hashId, keyCode) => {
            dispatch("commandKey", { err, hashId, keyCode });
        }
        editor.onCopy = () => {
            dispatch("copy");
        }
        editor.onCursorChange = () => {
            dispatch("cursorChange");
        }
        editor.onCut = () => {
            const copyText = editor.getCopyText();
            editor.insert("");
            dispatch("cut", copyText);
        };
        editor.onDocumentChange = (obj) => {
            dispatch("documentChange", obj);
        }
        editor.onFocus = () => {
            dispatch("focus");
        }
        editor.onPaste = (text) => { 
            editor.insert(text);
            dispatch("paste", text);
        };
        editor.onSelectionChange = (obj) => {
            dispatch("selectionChange", obj);
        }
        editor.on("change", function () {
            const content = editor.getValue();
            value = content;
            dispatch("input", content);
            contentBackup = content;
        });
    }
</script>

<!-- Elements -->
<div style="width:{px(width)};height:{px(height)}">
    <div id={EDITOR_ID} style="width:{px(width)};height:{px(height)}" />
    <div></div>
</div>

<!-- Styles -->
<style>
    
</style>