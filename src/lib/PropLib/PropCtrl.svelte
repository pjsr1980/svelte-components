<!-- Script -->
<script lang="ts">
    import type { NodeProp } from "$lib/TreeLib/TreeNode";
    import PropItem from "./PropItem.svelte";

    export let prop: NodeProp|null  = null;
    export let txtSize              = "12pt";
    export let colorBg              = "transparent";
    export let colorHover           = "rgb(50, 100, 240)";
    export let colorTxt             = "rgb(100, 100, 100)"; 
    export let colorTxtSel          = "rgb(170, 130, 100)";
    export let colorBgSel           = "rgb(240, 240, 240)";

    $: css_variables = watchVariables(txtSize, colorBg, colorHover, colorTxt, colorTxtSel, colorBgSel);
    function watchVariables(st: string, cb:string, ch:string, ct:string, cs:string, bs:string) {
        let r = "--txt-size:" + st + ";";
        r += "--color-bg:" + cb + ";";
        r += "--color-hover:" + ch + ";";
        r += "--color-txt:" + ct + ";";
        r += "--color-txt-sel:" + cs + ";";
        r += "--color-bg-sel:" + bs + ";";
        return r;
    }
</script>

<!-- Elemets -->
<div class="pane" style={css_variables}>
    {#if prop && prop.visible}
        {#each prop.props as item (item.nid) }
            <PropItem prop={item} />
        {/each}
    {/if}
</div>

<!-- Styles -->
<style>
    .pane {
        margin: 0;
        padding: calc(0.1 * var(--txt-size));
        padding-right: 0;
        width: calc(100% - 2 * 0.1 * var(--txt-size));
        height: calc(100% - 2 * 0.1 * var(--txt-size));
        overflow: auto;
        background-color: var(--color-bg);
    }
</style>