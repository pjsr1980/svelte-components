
<script>
    import AceEditor from "$lib/AceLib/AceEditor.svelte";
    import Example from "$lib/TabLib/Example.svelte";
    import Splitter from "$lib/SplitterLib/Splitter.svelte";
    import Icon from "$lib/IconLib/Icon.svelte";

    let isSwap = false;
    let isVertical = false;

    let options = {
        fontSize: 16,
   }
    

    let value = `let aux = function() {
    return 5 + 25n * 3;
}
`;
    

</script>

<h1>Welcome @pjsr/svelte-components</h1>

<div>

    <div class="icon">
        <Icon name="thumb_up_off" />
    </div>

    <label for="id1">Vertical</label>
    <input id="id1" type="checkbox" bind:checked={isVertical}>

    <label for="id2">Swap</label>
    <input id="id2" type="checkbox" bind:checked={isSwap}>
</div>

<div class="pane">
    <Splitter isVertical={isVertical} isSwap={isSwap} minSize1="50px">
        <AceEditor slot="1" bind:value={value} options={options}></AceEditor>
        <Example slot="2"></Example>
    </Splitter>
</div>

<style>
    .pane {
        width: 100%;
        height: 600px;
    }

    .icon {
        margin: 0;
        padding: 0;
        font-size: 1.5rem;
        display: inline-block;
        color: rgb(156, 89, 72);
    }
    
</style>
