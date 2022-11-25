
<!-- Script module -->
<script context="module" lang="ts">
    import type { Writable } from 'svelte/store';
    export type TabContext = {
        registerTab: (tab: any) => void;
        registerPane: (pane: any) => void;
        selectTab: (tab: any) => void;
        selTab: Writable<null>;
        selPane: Writable<null>;
    };

    export const CONTEXT = {};
</script>

<!-- Script -->
<script lang="ts">
    import { writable } from 'svelte/store';
    import { setContext, onDestroy } from 'svelte';

    export let colorSel = "rgb(100, 100, 240)";
    export let colorText = "rgb(100, 100, 100)";

    export let onTabSel = (tab: any) => {};
    export const tabs: any[] = [];
    export const panes: any[] = [];
    export const selTab = writable(null);
    export const selPane = writable(null);
    export const select = (tab: any) => {
        const i = tabs.indexOf(tab);
        if(i >= 0) {
            selTab.set(tab);
            selPane.set(panes[i]);
            onTabSel(tab);
        }
    }
    export const getSelect = () : any => { return $selTab; }

    setContext<TabContext>(CONTEXT, {
        registerTab: (tab: any) => {
            tabs.push(tab);
            selTab.update(current => current || tab);
            if($selTab === tab) { 
                onTabSel(tab);
            }
            onDestroy(() => {
                const i = tabs.indexOf(tab);
                tabs.splice(i, 1);
                let aux = $selTab;
                selTab.update(current => current === tab ?
                    (tabs[i] || tabs[tabs.length -1]) : current);
                if(aux !== $selTab) {
                    onTabSel($selTab);
                }
            });
        },
        registerPane: (pane: any) => {
            panes.push(pane);
            selPane.update(current => current || pane);
            onDestroy(() => {
                const i = panes.indexOf(pane);
                panes.splice(i, 1);
                selPane.update(current => current == pane ? 
                    (panes[i] || panes[panes.length - 1]) : current );
            });
        },
        selectTab: (tab: any) => {
            const i = tabs.indexOf(tab);
            if(i >= 0) {
                selTab.set(tab);
                selPane.set(panes[i]);
                onTabSel(tab);
            }
        },
        selTab,
        selPane
    });

</script>

<!-- Elements -->
<div class="tab-content"
    style="--color-sel: {colorSel}; --color-text: {colorText};">
    <slot></slot>
</div>

<!-- Styles -->
<style>
    .tab-content {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
    }
</style>
