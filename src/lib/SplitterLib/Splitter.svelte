<!-- Script -->
<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    export let sepColor = '#ccc';
    export let sepHover = '#aaa';
    export let size1 = '50%';
    export let size2 = '50%';
    export let minSize1 = '0';
    export let minSize2 = '0';
    export let isVertical = false;
    export let isSwap = false;
    export let onUpdate = () => {}

    onMount(() => {
        ro = new ResizeObserver(entries => {
            for (let entry of entries) {
                w = entry.contentRect.width;
                h = entry.contentRect.height;
            }
        });
        ro.observe(panel);
    });

    onDestroy(() => {
        if(ro) {
            ro.disconnect();
        }
    });

    const onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        if (e.button !== 0) return;
        md = {
            e,
            firstHeight: element1.offsetHeight,
            firstWidth:  element1.offsetWidth,
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        moving = true;
    }

    const onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        if (e.button !== 0) return;
        var delta = {
            x: e.clientX - md.e.clientX,
            y: e.clientY - md.e.clientY 
        };
        let pt = 0;
        if(isVertical) {
            pt = ((md.firstHeight + delta.y) / h * 100);
        }
        else {
            pt = ((md.firstWidth + delta.x) / w * 100);
        }
        if(isSwap) {
            size2 = pt + '%';
            size1 = (100 - pt) + '%';
        }
        else {
            size1 = pt + '%';
            size2 = (100 - pt) + '%';
        }
        onUpdate();
    }

    const onMouseUp = (e : MouseEvent) => {
        if (e) {
            e.preventDefault();
            if (e.button !== 0) return;
        }
        onUpdate();
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        moving = false;
    }

    let md: any;
    let w: number;
    let h: number;
    let moving = false;
    let ro: ResizeObserver;
    let panel: HTMLDivElement;
    let element1: HTMLDivElement;
    let element2: HTMLDivElement;
</script>

<!-- Elements -->
<div bind:this="{panel}" class:panelV={isVertical} class:panelH={!isVertical} 
    style="--sep-hover: {sepHover}; --sep-color: {sepColor}; --size1: {isSwap ? size2 : size1}; --size2: {isSwap ? size1 : size2}; --min-size1: {isSwap ? minSize2 : minSize1}; --min-size2: {isSwap ? minSize1 : minSize2};">
    <div bind:this={element1} class:top={isVertical} class:left={!isVertical}>
        {#if !isSwap}
        <slot name="1">
            <div style="background-color: red;">
                {#if isVertical}
                    Top Contents goes here...
                {:else}
                    Left Contents goes here...
                {/if}
            </div>
        </slot>
        {:else}
        <slot name="2">
            <div style="background-color: yellow;">
                {#if isVertical}
                    Down Contents goes here...
                {:else}
                    Right Contents goes here...
                {/if}
            </div>
        </slot>
        {/if}
    </div>
    <div class:separatorV={isVertical} class:separatorH={!isVertical} class:moving={moving} on:mousedown={onMouseDown}>
    </div>
    <div bind:this={element2} class:down={isVertical} class:right={!isVertical}>
        {#if !isSwap}
        <slot name="2">
            <div style="background-color: yellow;">
                {#if isVertical}
                    Down Contents goes here...
                {:else}
                    Right Contents goes here...
                {/if}
            </div>
        </slot>
        {:else}
        <slot name="1">
            <div style="background-color: red;">
                {#if isVertical}
                    Top Contents goes here...
                {:else}
                    Left Contents goes here...
                {/if}
            </div>
        </slot>
        {/if}
    </div>
</div>

<!-- Styles -->
<style>
.panelV {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.panelH {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: inline-flex;
    }

.separatorV {
    cursor: row-resize;
    width: 100%;
    height: 4px;
    margin-top: -2px;
    z-index: 1;
    background-color: var(--sep-color, #aaa);
}

.separatorV:hover {
    background-color: var(--sep-hover, #ccc);
}

.separatorH {
    cursor: col-resize;
    height: 100%;
    width: 4px;
    min-width: 4px;
    padding: 0;
    margin: 0;
    z-index: 1;
    background-color: var(--sep-color, #aaa);
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='30'><path d='M2 0 v30 M5 0 v30 M8 0 v30' fill='none' stroke='black'/></svg>");
    background-repeat: no-repeat;
    background-position: center;
}

.separatorH:hover {
    background-color: var(--sep-hover, #ccc);
}

.moving {
    background-color: var(--sep-hover, #ccc);
}

.top {
    height: calc(var(--size1) - 2px);
    min-height: var(--min-size1);
    width: 100%;
    overflow: auto;
}

.down {
    height: calc(var(--size2) - 2px);
    min-height: var(--min-size2);
    width: 100%;
    overflow: auto;
}

.left {
    margin: 0;
    padding: 0;
    width: calc(var(--size1) - 2px);
    min-width: var(--min-size1);
    height: 100%;
    overflow: auto;
}

.right {
    margin: 0;
    padding: 0;
    width: calc(var(--size2) - 2px);
    min-width: var(--min-size2);
    height: 100%;
    overflow: auto;
}
</style>
