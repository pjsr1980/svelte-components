<!-- Script -->
<script lang="ts">
    import { createEventDispatcher, getContext } from "svelte";
    import { slide } from "svelte/transition";
    import TreeRename from "./TreeRename.svelte";
    import IconSvg from "../IconLib/IconSvg.svelte";
    import Icon from "../IconLib/Icon.svelte";

    import type { NodeField, NodeFile } from "./TreeNode";
    import type { TreeContext } from "./TreeCtrl.svelte";
    import { CONTEXT } from "./TreeCtrl.svelte";
    import { NodeType } from "./TreeNode";

    const dispatch = createEventDispatcher();
    const {
        root,
        treeMenu,
        renameItem,
        markedItems,
        selectedItem,
        setRenameItem,
        setSelectedItem,
    } =  getContext<TreeContext>(CONTEXT);

    export let item : NodeField | NodeFile;

    $: icon = root.getItemIcon(item);
    $: isRename = $renameItem === item;
    $: isSelected = $selectedItem === item;
    $: isMarked = $markedItems.indexOf(item) >= 0;

    function on_select(e: MouseEvent) {
        $treeMenu.visible = false;
        setSelectedItem(item);
        if(e.ctrlKey) {
            let idx = $markedItems.indexOf(item);
            dispatch("itemMarked", {
                item,
                marked: (idx >= 0),
                setMarked: function(marked: boolean) {
                    markedItems.update(obj => {
                        if(!marked && idx >= 0) { obj.splice(idx, 1); } 
                        else if(marked && idx < 0) { obj.push(item); }
                        return obj;
                    })
                }
            })
        }
    }

    function on_right_click(e: MouseEvent) {
        on_select(e);
        $treeMenu.posX = e.pageX;
        $treeMenu.posY = e.pageY;
        dispatch('itemRightClick');
    }

    function on_icon_click(e: MouseEvent) {
        on_select(e);
        if(item.type === NodeType.FIELD) {
            item.expanded = !item.expanded;
        }
        dispatch('itemIconClick', {item});
    }

    function on_dbl_click(e: MouseEvent) {
        dispatch('itemDoubleClick', {
            item,
            setRename: setRenameItem
        });
    }

</script>

{#if item.visible === true}
    <div class="tree-item"
        class:tree-item-sel = {isSelected}
        class:tree-item-marked = {isMarked}
        on:click|stopPropagation={on_select}
        on:contextmenu|preventDefault|stopPropagation={on_right_click}
        on:keydown={()=>{}}
    >
        <div on:click|stopPropagation={on_icon_click} on:keydown={()=>{}}>
            {#if typeof icon === "string"}
                <Icon name={icon} size="calc(1.2 * var(--txt-size))" />
            {:else}
                <IconSvg 
                    data={icon.data} 
                    size={icon.size}
                    color="currentColor"
                    fill={icon.color ? icon.color : "transparent"}
                />
            {/if}
        </div>

        {#if isRename}
            <TreeRename on:itemRename />
        {:else}
            <span class:is-changed={item.type === NodeType.FILE && item?.edit?.modified} 
                class:is-field={item.type === NodeType.FIELD}
                on:dblclick="{on_dbl_click}">
                {item.name}{#if item.type === NodeType.FILE && item.kind}.{item.kind}{/if}
            </span>
        {/if}
    </div>

    {#if item.type === NodeType.FIELD && item.expanded}
    <ul transition:slide|local={{delay: 0, duration: 150}} >
        {#each item.childs as child (child.nid)}
            {#if child.visible}
                <li>
                    <svelte:self item={child} 
                        on:itemMarked
                        on:itemRename
                        on:itemIconClick
                        on:itemRightClick
                        on:itemDoubleClick
                    />
                </li>
            {/if}
        {/each}

        {#each item.files as file (file.nid)}
            {#if file.visible}
                <li>
                    <svelte:self item={file}
                        on:itemMarked
                        on:itemRename
                        on:itemIconClick
                        on:itemRightClick
                        on:itemDoubleClick
                    />
                </li>
            {/if}
        {/each}
    </ul>
    {/if}
{:else if item.visible === "childs"}
    {#if item.type === NodeType.FIELD && item.expanded}
        {#each item.childs as child (child.nid)}
            {#if child.visible}
                <li>
                    <svelte:self item={child} 
                        on:itemMarked
                        on:itemRename
                        on:itemIconClick
                        on:itemRightClick
                        on:itemDoubleClick
                    />
                </li>
            {/if}
        {/each}

        {#each item.files as file (file.nid)}
            {#if file.visible}
                <li>
                    <svelte:self item={file}
                        on:itemMarked
                        on:itemRename
                        on:itemIconClick
                        on:itemRightClick
                        on:itemDoubleClick
                    />
                </li>
            {/if}
        {/each}
    {/if}
{/if}

<!-- Styles -->
<style>
    .tree-item {
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        cursor: default;
        color: var(--color-txt);

        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .tree-item div {
        display: inline-flex;
        vertical-align: middle;
        cursor: pointer;
        padding: 0 3px;
        margin: 0;
    }

    .tree-item div:hover {
        color: var(--color-hover);
    }

    .tree-item span {
        font-size: var(--txt-size);
        text-overflow: ellipsis;
        white-space: nowrap;
        width: available;
        overflow: hidden;
    }

    .is-field {
        font-weight: bold;
    }

    .is-changed {
        text-decoration: underline;
        text-decoration-color: var(--color-hover);
    }

    .tree-item-sel {
        color: var(--color-txt-sel);
        background-color: var(--color-bg-sel);
    }

    .tree-item-marked {
        color: var(--color-txt-marked);
        background-color: var(--color-bg-marked);
        filter: invert(0.05);
    }

    ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }

    ul li {
        margin-left: 15px;
        position: relative;
        padding-left: 0px; /* 5px */
    }

    ul li::before {
        content: " ";
        position: absolute;
        width: 1px;
        background-color: var(--color-hover);
        top: 5px;
        bottom: -12px;
        left: -10px;
    }

    ul li:not(:first-child):last-child::before {display: none;}

    ul li:only-child::before {
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
    
    ul li::after {
        content: " ";
        position: absolute;
        left: -10px;
        width: 10px;
        height: 1px;
        background-color: var(--color-hover);
        top: 12px;
    }
</style>