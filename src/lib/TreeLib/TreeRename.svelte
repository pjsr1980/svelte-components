<!-- Script -->
<script lang="ts">
    import { createEventDispatcher, onMount, getContext, tick } from "svelte";
    import type { TreeContext } from "./TreeCtrl.svelte";
    import { CONTEXT } from "./TreeCtrl.svelte";
    import { NodeType } from "./TreeNode";

    const dispatch = createEventDispatcher();

    const { 
        renameItem, 
        setRenameItem 
    } = getContext<TreeContext>(CONTEXT);

    let element: HTMLInputElement;
    let value = "";

    onMount(() => {
        if($renameItem) {
            if($renameItem.type === NodeType.FILE) {
                value = $renameItem.name + '.' + $renameItem.kind;
            } else if($renameItem.type === NodeType.FIELD) {
                value = $renameItem.name;
            }
            element.focus();
            element.select();
        }
    });

    function on_keyup(e: KeyboardEvent) {
        if(e.key === 'Escape') {
            e.stopPropagation();
            setRenameItem(null);
            return;
        }
        if(e.key === 'Enter') {
            e.stopPropagation();
            value = value.trim();
            if(value === '') {
                setRenameItem(null);
                return;
            }
            dispatch('itemRename', {
                item: $renameItem,
                value: value
            });
            tick();
            setRenameItem(null);
            return;
        }
    }

</script>

<!-- Elements -->
<input type="text"
    bind:this="{element}"
    bind:value="{value}"
    on:keyup="{on_keyup}"
    on:focusout="{()=>{ setRenameItem(null); }}"
/>

<!-- Styles -->
<style>
    input {
        width: 100%;
        color: var(--color-txt-selected);
        background-color: var(--color-bg-selected);
        font-size: calc(0.85 * var(--text-size));
    }
</style>