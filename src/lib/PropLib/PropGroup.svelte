<!-- Script -->
<script lang="ts">
    import type { NodePropGroup } from "./PropNode";

    import { onDestroy, onMount } from "svelte";
    import { slide } from "svelte/transition";
    import Icon from "../IconLib/Icon.svelte";
    import PropItem from "./PropItem.svelte";

    export let prop: NodePropGroup;

    onMount(() => {
        prop.update = () => {
            prop.props.forEach((p) => {
                if(typeof p.update === "function") {
                    p.update();
                }
            });
        }
    })

    onDestroy(() => {
        delete prop.update;
    })

    function on_click() { prop.expanded = !prop.expanded; }
    $: icon = prop.expanded ? "expand_less" : "expand_more";
</script>

<!-- Elemets -->
<div class="pane">
    <div class="header">
        <div class="title">{prop.name}</div>
        <div class="icon" on:click="{on_click}" on:keydown={()=>{}}>
            <Icon name={icon} />
        </div>
    </div>

    {#if prop.expanded}
        <div class="content" transition:slide|local={{delay: 0, duration: 150}}>
            {#each prop.props as item (item.nid) }
                <PropItem prop={item} />
            {/each}
        </div>
    {/if}
</div>

<!-- Styles -->
<style>
    .pane {
        margin: 0;
        padding: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .header {
        margin: 0;
        padding: calc(0.1 * var(--txt-size));
        padding-right: 0;
        width: calc(100% - 0.1 * var(--txt-size));
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: var(--color-bg-sel);
        
        -webkit-user-select:none!important;
        -moz-user-select:none!important;
        -ms-user-select:none!important;
        user-select:none!important;
    }

    .title {
        font-weight: bold;
        font-size: var(--txt-size);
        padding: 0;
        color: var(--color-txt-sel);
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .icon {
        padding: 0;
        font-size: var(--txt-size);
        color: var(--color-txt-sel);
        cursor: pointer;
    }

    .icon:hover {
        color: var(--color-hover);
    }

    .content {
        margin: 0;
        background-color: var(--color-bg);
        padding: calc(0.1 * var(--txt-size));
        padding-left: calc(0.5 * var(--txt-size));
        padding-right: 0;
    }
</style>