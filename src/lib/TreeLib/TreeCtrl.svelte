<!-- Script module -->
<script context="module" lang="ts">
/*=====================================================
events:
    on:itemSelected     e.detail -> { oldItem, newItem }
    on:itemMenuClick    e.detail -> { item, cmd }
    on:itemIconClick    e.detail -> { item }
    on:itemDoubleClick  e.detail -> { item }
    on:itemRename       e.detail -> { item, value }
=====================================================*/
    import type { MenuItem, NodeBase, NodeField, NodeFile, NodeRoot } from "./TreeNode";
    import type { Writable } from 'svelte/store';
    export type TreeContext = {
        root: NodeRoot;
        setRenameItem: (item: NodeField | NodeFile | null) => void;
        setSelectedItem: (item: NodeBase | null) => void;
        selectedItem: Writable<NodeBase | null>;
        markedItems: Writable<NodeBase[]>;
        renameItem: Writable<NodeField | NodeFile | null>;
        treeMenu: Writable<{
            posX: number;
            posY: number;
            items: MenuItem[];
            visible: boolean;
        }>
    };
    export const CONTEXT = {};
</script>

<!-- Script -->
<script lang="ts">
    import { createEventDispatcher, setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import TreeItem from "./TreeItem.svelte";
    import TreeMenu from "./TreeMenu.svelte";
    import Icon from '../IconLib/Icon.svelte';

    const dispatch = createEventDispatcher();

    export const getRoot         = function() { return root; }
    export const getSelectedItem = function() { return _selectedItem; }
    export const getMarkedItems  = function() { return _markedItems; }
    export const getRenameItem   = function() { return _renameItem; }
    export const getVariables    = function() { return _variables; }
    export const getTreeMenu     = function() { return _treeMenu; }
    export const updateTree      = function() {
        if(root) {
            root.childs = root.childs; 
            root.files = root.files;
        }
    }
    export const setSelectedItem = function(item: NodeBase|null) {
        if($_selectedItem !== item) {
            let event = {
                oldItem: $_selectedItem,
                newItem: item
            };
            $_selectedItem = item;
            dispatch('itemSelected', event);
        }
    }
    export const setRenameItem = function(item: NodeField | NodeFile | null) {
        $_renameItem = item;
    }

    export let root: NodeRoot;
    export let title: string = '';

    let _renameItem = writable<NodeField|NodeFile|null>(null);
    let _selectedItem = writable<NodeBase|null>(null);
    let _markedItems = writable<NodeBase[]>([]);
    let _treeMenu = writable<{
        posX: number;
        posY: number;
        items: MenuItem[];
        visible: boolean;
    }>({ 
        posX: 0, 
        posY: 0, 
        items: [], 
        visible: false 
    });
    let _variables = writable({
        "text-size":        '12pt',
        "color-bg":         'transparent',
        "color-hover":      'rgb(50, 50, 240)',

        "color-txt":        'rgb(100, 100, 100)',
        "color-txt-bg":     'rgb(255, 255, 255)',

        "color-txt-sel":    'rgb(200, 180, 100)',
        "color-bg-sel":     'rgb(240, 240, 240)',
        
        "color-txt-marked": 'rgb(255, 130, 130)',
        "color-bg-marked":  'rgb(240, 240, 240)',
    });

    setContext(CONTEXT, {
        root: root,
        setRenameItem: setRenameItem,
        setSelectedItem: setSelectedItem,
        selectedItem: _selectedItem,
        markedItems: _markedItems,
        renameItem: _renameItem,
        treeMenu: _treeMenu,
    });

    function on_right_click() {
        if(root && typeof root.getItemMenu === "function") {
            let items = root.getItemMenu($_selectedItem);
            if(items) {
                $_treeMenu.items = items;
                $_treeMenu.visible = true;
            }
        }
    }

    function on_click() {
        $_treeMenu.visible = false;
        setSelectedItem(null);
    }

    function on_contextmenu(e: MouseEvent) {
        on_click();
        $_treeMenu.posX = e.pageX;
        $_treeMenu.posY = e.pageY;
        on_right_click();
    }

    $: css_variables = Object.entries($_variables).map(
        ([key,val]) => `--${key}:${val}`
    ).join(';');

    $: has_title = title.trim().length > 0;
</script>

<!-- Elements -->
<div class="tree" 
    on:contextmenu|stopPropagation|preventDefault="{on_contextmenu}"
    on:click|stopPropagation="{on_click}"
    on:keydown={()=>{}}
    on:keyup={()=>{}}
    style={css_variables}
>
    {#if has_title}
        <div class="title user-select-none">
            <slot name="title">
                <Icon name="database" size="calc(1.15 * var(--text-size))"/>
                <span class="title-text">{title}</span>
            </slot>
        </div>
    {/if}
    <ul class:tlst={has_title}>
        {#if root}
            {#each root.childs as child (child.nid)}
                {#if child.visible}
                    <li>
                        <TreeItem item={child}
                            on:itemMarked
                            on:itemRename
                            on:itemIconClick
                            on:itemDoubleClick
                            on:itemRightClick={on_right_click}
                        />
                    </li>
                {/if}
            {/each}
            {#each root.files as file (file.nid)}
                {#if file.visible}
                    <li>
                        <TreeItem item={file}
                            on:itemMarked
                            on:itemRename
                            on:itemIconClick
                            on:itemDoubleClick
                            on:itemRightClick={on_right_click}
                        />
                    </li>
                {/if}
            {/each}
        {/if}
    </ul>

    {#if $_treeMenu.visible}
        <TreeMenu on:itemMenuClick />
    {/if}
</div>

<!-- Styles -->
<style>
    .tree {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: var(--color-bg);
    }

    .title {
        margin: 0;
        padding: calc(0.2 * var(--text-size));
        width: 100%;
        font-size: var(--text-size);
        color: var(--color-hover);
        background-color: var(--color-bg-sel);

        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        text-overflow: ellipsis;
        white-space: nowrap;
        width: available;
        overflow: hidden;
    }

    .title-text {
        font-weight: bold;
        font-size: var(--txt-size);
        color: var(--color-txt);
        background-color: var(--color-bg-sel);
    }

    ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    .tlst {
        margin-left: 0px;
    }

    .tlst li {
        margin-left: 15px;
        position: relative;
        padding-left: 0px;
    }

    .tlst li::before {
        content: " ";
        position: absolute;
        width: 1px;
        background-color: var(--color-hover);
        top: 5px;
        bottom: -12px;
        left: -10px;
    }

    .tlst li:not(:first-child):last-child::before {display: none;}

    .tlst li:only-child::before {
        display: list-item;
        position: absolute;
        content: " ";
        width: 1px;
        background-color: var(--color-hover);
        top: 5px;
        bottom: 7px;
        height: 7px;
        left: -10px;
    }
    
    .tlst li::after {
        content: " ";
        position: absolute;
        left: -10px;
        width: 10px;
        height: 1px;
        background-color: var(--color-hover);
        top: 12px;
    }
</style>



