<!-- Script -->
<script lang="ts">
    import { getContext } from 'svelte';
    import { CONTEXT } from './TabCtrl.svelte';
    import type { TabContext } from './TabCtrl.svelte'
    
    const { registerTab, selectTab, selTab } = getContext<TabContext>(CONTEXT);

    export let tab : any;
    registerTab(tab);

    function on_menu() {

    }

    function on_click() {
        selectTab(tab);
    }

</script>

<!-- Elements -->
<div class="user-select-none"
    class:selected="{$selTab === tab}"
    on:click="{on_click}"
    on:keydown={(evt)=>{}}
    on:contextmenu|stopPropagation|preventDefault="{on_menu}">
    <slot></slot>
</div>

<!-- Styles -->
<style>
    div {
        margin: 4px 0 0px 4px;
        padding: calc(0.3 * var(--txt-size));
        font-size: var(--txt-size);
        font-weight: normal;
        color: var(--color-txt);
        background-color: transparent;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        scroll-snap-align: start;
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
    }

    div:hover {
        cursor: pointer;
    }

    .selected {
        color: var(--color-txt-sel);
        background-color: var(--color-bg-sel);
        border: 1px solid var(--color-txt);
        border-bottom: 0;
    }

    .user-select-none{
        -webkit-user-select:none!important;
        -moz-user-select:none!important;
        -ms-user-select:none!important;
        user-select:none!important
    }
</style>