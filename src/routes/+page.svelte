
<script lang="ts">
    import Splitter from "$lib/SplitterLib/Splitter.svelte";
    import TabExample from "$lib/TabLib/TabExample.svelte";
    import AceEditor from "$lib/AceLib/AceEditor.svelte";
    import Icon from "$lib/IconLib/Icon.svelte";

    import { TreeNode, TreeCtrl, Markdown,
        TabCtrl, TabHeader, TabName, TabPane } from "$lib";
    import type { MenuItem, NodeBase } from "$lib/TreeLib/TreeNode";
 
    let isSwap = false;
    let isVertical = false;

    let options = {
        fontSize: 16,
        showLineNumbers: true
   }
    
    let editor : AceEditor;
    let value = `let aux = function() {
    return 5 + 25n * 3;
}
`;
    function onResize() {
        if(editor) {
            editor.getEditor().resize();
        }
    }

    function itemDoubleClick(evt: CustomEvent) {
        evt.detail.setRename(evt.detail.item);
    }

    function itemMarked(evt: CustomEvent) {
        let d = evt.detail;
        d.setMarked(!d.marked);
    }

    let root = TreeNode.newRoot();
    TreeNode.newField(root, "Folder 1", "folder", [
        TreeNode.newField(null, "Folder 1.1", "folder", [], [
            TreeNode.newFile(null, "File 1.1", "txt"),
            TreeNode.newFile(null, "File 1.2", "njs")    
        ])
    ], [
        TreeNode.newFile(null, "File 1", "txt"),
        TreeNode.newFile(null, "File 2", "njs")
    ]);
    root.getItemMenu = (item: NodeBase) => {
        let r: MenuItem[] = [
            {
                text: "Command 1",
                icon: "folder",
                cmd: "cmd-1"
            },
            {
                text: ""
            },
            {
                text: "Command 2",
                icon: "folder",
                cmd: "cmd-1"
            }

        ];
        return r;
    }

    let text = `## Olá Mundo!
\`\`\`ts
let i = function(aux: string) {
    return 5 * 5;
}

let text = "Isto é  texto!";

\`\`\`

> Isto é texto [com link](https://www.google.com) ;)

This is an example of how to create a footnote[^1] in Markdown.
[^1]: First Footnote

\`$ [ x^n + y^n = z^n ] $\`
\`$ x^2 + y^3 = z^n $\`

> bvds hg
> dgfhdfth fd
>
> gdhfsh tdhtgfr 

`;


</script>

<h1>@pjsr/svelte-components</h1>

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
    <Splitter isVertical={isVertical} isSwap={isSwap} minSize1="50px" {onResize}>
        <!-- 
            <TabExample slot="1"></TabExample>
        -->
        <TreeCtrl slot="1" title="Test Tree" root={root}
            on:itemDoubleClick={itemDoubleClick}
            on:itemMarked={itemMarked}
        />
        <TabCtrl slot="2">
            <TabHeader>
                <TabName tab=1>Markdown</TabName>
                <TabName tab=2>Ace Editor</TabName>
            </TabHeader>

            <TabPane pane=1>
                <Markdown text={text}></Markdown>
            </TabPane>

            <TabPane pane=2>
                <AceEditor bind:this={editor} bind:value={value} options={options}></AceEditor>
            </TabPane>
        </TabCtrl>
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
