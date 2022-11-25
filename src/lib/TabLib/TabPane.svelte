<!-- Script -->
<script lang="ts">
    import { getContext } from 'svelte';
    import { CONTEXT } from './TabCtrl.svelte';
    import type { TabContext } from './TabCtrl.svelte';
    const { registerPane, selPane } = getContext<TabContext>(CONTEXT);

    export let pane: any;
    registerPane(pane);
</script>

<!-- Elements -->
{#if $selPane === pane}
<div>
    <slot></slot>
</div>
{/if}

<!-- Styles -->
<style>
    div {
        position: relative;
        margin: 0;
        padding: 0;
        height: 100%;
        max-height: 100%;
        overflow: hidden;
        white-space: nowrap;
        background-color: transparent;
    }
</style>