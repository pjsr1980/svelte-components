<!-- Script -->
<script lang="ts">
    import { getContext, createEventDispatcher } from 'svelte';
    import type { TreeContext } from "./TreeCtrl.svelte";
    import TreeMenuItem from './TreeMenuItem.svelte';
    import { CONTEXT } from "./TreeCtrl.svelte";

    const dispatch = createEventDispatcher();
    const { treeMenu, selectedItem } = getContext<TreeContext>(CONTEXT);

    function on_menu_item(e: CustomEvent) {
        $treeMenu.visible = false;
        dispatch('itemMenuClick', {
            item: $selectedItem,
            cmd: e.detail
        });
    }
</script>

<!-- Elements -->
{#if $treeMenu.visible}
    <div style="top: {$treeMenu.posY}px; left: {$treeMenu.posX}px;">
        <ul>
            {#each $treeMenu.items as item}
                <TreeMenuItem {item} on:itemMenuClick={on_menu_item} />
            {/each}
        </ul>
    </div>
{/if}

<!-- Styles -->
<style>
    div {
        margin: 0;
        padding: 1px;
        z-index: 100;
        position: absolute;
        width: fit-content;
        background-color: var(--color-bg-sel);
        border: 2px solid var(--color-txt-sel);
    }

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
        z-index: inherit;
    }
</style>

