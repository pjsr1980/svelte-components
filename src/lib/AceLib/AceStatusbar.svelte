<!-- Script -->
<script lang="ts">
    import { onMount } from "svelte";
    import { AceThemes } from "./AceThemes";
    import type { AceTheme } from "./AceThemes";

    export let theme: string = "chrome";
    export let width: string = "100%";
    export let height: string = "20px";
    export let visible: boolean = true;
    export let editor : AceAjax.Editor;
    
    let acePos: number = 0;
    let aceRange: AceAjax.Range;
    let aceTheme : AceTheme = AceThemes[0]; 
    let aceCursor: AceAjax.Position = {row: 0, column: 0};

    onMount(()=>{
        let idx = AceThemes.findIndex((value) => {
            return value.name === theme;
        });
        if(idx >= 0) {
            aceTheme = AceThemes[idx];
        }
    })

    $: watchTheme(theme);
    function watchTheme(name: string) {
        let idx = AceThemes.findIndex((value) => {
            return value.name === name;
        });
        if(idx >= 0) {
            aceTheme = AceThemes[idx];
        }
    }

    $: watchEditor(editor);
    function watchEditor(edit: AceAjax.Editor) {
        if(edit) {
            aceRange = edit.getSelectionRange();
            aceCursor = edit.getCursorPosition();
            acePos = edit.session.doc.positionToIndex(aceCursor);
            edit.on("changeSelection", ()=>{
                aceRange = edit.getSelectionRange();
                aceCursor = edit.getCursorPosition();
                acePos = edit.session.doc.positionToIndex(aceCursor);
            });
        }
    }
</script>

<!-- Elements -->
<div class="panel" class:panel-hide={!visible} style="width: {width}; heigth: {height}; --ch: {aceTheme.colorHover}; --cb: {aceTheme.colorBg}; --cbs: {aceTheme.colorBgSel}; --ct: {aceTheme.colorTxt}; --cts: {aceTheme.colorTxtSel};">
    <div class="right">
        <span class="title">Ln: </span><span class="value">{aceCursor.row + 1}</span> 
        <span class="title">Col: </span><span class="value">{aceCursor.column}</span>
        <span class="title">Pos: </span><span class="value">{acePos}</span>
        {#if aceRange && !aceRange.isEmpty()}
            <span class="title">Sel: </span>
            <span class="value">[{aceRange.start.row+1}/{aceRange.start.column}]:[{aceRange.end.row+1}/{aceRange.end.column}]</span>
        {/if}
    </div>
</div>

<!-- Styles -->
<style>
    .panel {
        margin: 0px;
        padding: 2px;
        display: flex;
        visibility: visible;
        background-color: var(--cbs);
    }

    .panel-hide {
        margin: 0;
        padding: 0;
        display: none;
        visibility: hidden;
    }

    .right {
        padding: 0;
        margin: 0;
        margin-left: auto;
    }

    .title {
        margin: 0;
        padding: 0;
        color: var(--ch);
        font-size: 14px;
    }

    .value {
        margin: 0 5px 0 0;
        padding: 0;
        color: var(--ct);
        font-size: 14px;;
    }
</style>