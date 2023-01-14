<!-- Script -->
<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { NodePropSelect } from "./PropNode";

    export let prop: NodePropSelect;

    let value: any;

    onMount(() => {
        get_value();
        prop.update = get_value;
    })

    onDestroy(() => {
        delete prop.update;
    })

    function on_change(e: Event) {
        let select = e.target as HTMLSelectElement;
        prop.onValue(select.value);
        get_value();
    }

    function get_value() {
        value = prop.getValue();
    }

</script>

<!-- Elements -->
<div class="pane">
    <div class="left">
        <label for={prop.nid}>{prop.name}</label>
    </div>
    <div class="right">
        {#if value !== undefined}
        <select id={prop.nid} value={value} on:change={on_change}>
            {#each prop.options as option}
                <option value={option.value}>{option.name}</option>
            {/each}
        </select>
        {/if}
    </div>
</div>

<!-- Styles -->
<style>
    .pane {
        margin: 0;
        padding: calc(0.2 * var(--txt-size));
        width: calc(100% - 2 * 0.2 * var(--txt-size));
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .left {
        width: 45%;
        color: var(--color-txt);
        font-size: var(--txt-size);
        text-overflow: ellipsis;
        white-space: nowrap;
        width: available;
        overflow: hidden;

        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .left label {
        padding: calc(0.3 * var(--txt-size));
    }

    .right {
        width: 55%;
    }

    .right select {
        width: calc(100% - 2 * 0.3 * var(--txt-size));
        margin: 0;
        padding: calc(0.3 * var(--txt-size));
        border: 0;
        color: var(--color-txt-sel);
        background-color: var(--color-bg-sel);
        font-size: calc(0.85 * var(--txt-size));
    }
</style>
