<!-- Script -->
<script lang="ts">
    import Icon from "../IconLib/Icon.svelte";
    import type { MenuItem } from './TreeNode';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    
    export let item : MenuItem;

    function on_click() {
        dispatch('itemMenuClick', item.cmd);
    }
</script>

<!-- Elements -->
{#if item.text && item.text.trim().length > 0}
    <li class="item"
        on:keydown={()=>{}}
        on:click|stopPropagation="{on_click}"
        on:contextmenu|preventDefault|stopPropagation="{()=>{}}">
        <div>
            {#if item.icon}
                <Icon name="{item.icon}" size="calc(1.2 * var(--txt-size))"/>
            {/if}
        </div>
        <span>{item.text}</span>
    </li>
{:else}
    <li class="separator">
        <div></div>
    </li>
{/if}

<!-- Styles -->
<style>
    .separator {
        z-index: inherit;
        display: flex;
        align-items: center;
        padding: 0;
        margin: 1px 1px;
        color: var(--color-txt);
        background-color: var(--color-bg);

    }

    .separator div {
        margin: 0;
        padding: 0;
        height: 1px;
        width: 100%;
        background-color: var(--color-bg);
        border-bottom: 2px solid var(--color-bg-sel);
    }

    .item {
        z-index: inherit;
        display: flex;
        align-items: center;
        padding: 0;
        margin: 0;
        margin-right: 3px;
        cursor: pointer;
        color: var(--color-txt);
        background-color: var(--color-bg);
    }

    .item:hover {
        color: var(--color-hover);
        background-color: var(--color-bg);
    }

    .item span {
        margin-left: 3px;
        font-size: calc(0.95 * var(--txt-size));
    }

    .item div {
        margin: 0;
        padding: 0;
        width: calc(1.3 * var(--txt-size));
        height: calc(1.3 * var(--txt-size));
        display: inline-flex;
        align-items: center;
        /*border-right: 1px solid var(--color-txt);*/
    }
</style>