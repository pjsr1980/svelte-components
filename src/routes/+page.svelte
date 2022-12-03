
<script lang="ts">
    import Splitter from "$lib/SplitterLib/Splitter.svelte";
    import TabExample from "$lib/TabLib/TabExample.svelte";
    import AceEditor from "$lib/AceLib/AceEditor.svelte";
    import Icon from "$lib/IconLib/Icon.svelte";

    import { TreeNode, TreeCtrl, Markdown,
        TabCtrl, TabHeader, TabName, TabPane,
        PropNode, PropCtrl } from "$lib";

    import type { MenuItem, NodeBase, NodeProp } from "$lib/TreeLib/TreeNode";
 
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
    function itemSelected(evt: CustomEvent) {
        if(evt.detail.newItem) {
            prop = evt.detail.newItem.prop;
        }
        else {
            prop = root.prop;
        }
    }
    let root = TreeNode.newRoot();
    let prop : NodeProp = root.prop;
    prop.data = {
        "text": "texto",
        "password": "123",
        "email": "pjsr1980@gmail.com",
        "number": 23, 
        "color": "#aabbcc",
        "checkbox": false,
        "radio": true,
        "range": 27, 
        "time": "10:23",
        "date": "1980-04-24",
        "month": "1980-04",
        "week": "1980-W17",
        "url": "www.pjsr.com"
    };

    let g1 = PropNode.newPropGroup(prop, "Group 1");
    let g2 = PropNode.newPropGroup(prop, "Group 2");

    PropNode.newPropInput(g1, "text", {type: "text"},
        () => root.prop.data.text, 
        (v) => { root.prop.data.text = v; }
    );
    PropNode.newPropInput(g1, "password", {type: "password"},
        () => root.prop.data.password, 
        (v) => { root.prop.data.password = v; }
    );
    PropNode.newPropInput(g1, "email", {type: "email"},
        () => root.prop.data.email, 
        (v) => { root.prop.data.email = v; }
    );
    PropNode.newPropInput(g1, "number", {type: "number"},
        () => root.prop.data.number, 
        (v) => { root.prop.data.number = v; }
    );
    PropNode.newPropInput(g1, "color", {type: "color"},
        () => root.prop.data.color, 
        (v) => { root.prop.data.color = v; }
    );
    PropNode.newPropInput(g1, "checkbox", {type: "checkbox"},
        () => root.prop.data.checkbox, 
        (v) => { root.prop.data.checkbox = v; }
    );
    PropNode.newPropInput(g1, "radio", {type: "radio"},
        () => root.prop.data.radio, 
        (v) => { root.prop.data.radio = v; }
    );
    PropNode.newPropInput(g1, "range", {type: "range"},
        () => root.prop.data.range, 
        (v) => { root.prop.data.range = v; }
    );
    PropNode.newPropInput(g1, "time", {type: "time"},
        () => root.prop.data.time, 
        (v) => { root.prop.data.time = v; }
    );
    PropNode.newPropInput(g1, "date", {type: "date"},
        () => root.prop.data.date, 
        (v) => { root.prop.data.date = v; }
    );
    PropNode.newPropInput(g1, "month", {type: "month"},
        () => root.prop.data.month, 
        (v) => { root.prop.data.month = v; }
    );
    PropNode.newPropInput(g1, "week", {type: "week"},
        () => root.prop.data.week, 
        (v) => { root.prop.data.week = v; }
    );
    PropNode.newPropInput(g1, "url", {type: "url"},
        () => root.prop.data.url, 
        (v) => { root.prop.data.url = v; }
    );

    g2.data = {
        nome: "1",
        options: [
            {name: "Pedro",     value: "1"},
            {name: "Joaquim",   value: "2"},
            {name: "Santos",    value: "3"},
            {name: "Ribeiro",   value: "4"},
        ]
    }

    PropNode.newPropSelect(g2, "Nome:", g2.data.options, 
    ()=> { return g2.data.nome; }, (v) => { g2.data.nome = v; })

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



`;

    import { AceThemes } from "$lib/AceLib/AceThemes";
    let theme = AceThemes[3];
    function onTheme(e: Event) {
        const target = e.target as HTMLSelectElement;
        let themeName = target.value;
        let idx = AceThemes.findIndex((v) => v.name === themeName);
        if(idx >= 0) { theme = AceThemes[idx]; }
    }

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

    <label for="theme">Theme</label>
    <select name="theme" id="theme" on:change={onTheme} value={theme.name}>
        {#each AceThemes as Theme}
            <option value={Theme.name}>{Theme.text}</option>
        {/each}
    </select>
</div>

<div class="pane">
    <Splitter isVertical={isVertical} isSwap={isSwap} minSize1="50px" {onResize}
        sepColor={theme.colorBgSel}
        sepHover={theme.colorHover}
    >
        <Splitter slot="1" isVertical={!isVertical} isSwap={false}
            sepColor={theme.colorBgSel}
            sepHover={theme.colorHover}
        >
            <TreeCtrl slot="1" title="Test Tree" root={root}
                on:itemDoubleClick={itemDoubleClick}
                on:itemMarked={itemMarked}
                on:itemSelected={itemSelected}
                colorBg={theme.colorBg}
                colorHover={theme.colorHover}
                colorTxt={theme.colorTxt}   
                colorTxtSel={theme.colorTxtSel}
                colorBgSel={theme.colorBgSel}
            />
            <PropCtrl slot="2" prop={prop} 
                colorBg={theme.colorBg}
                colorHover={theme.colorHover}
                colorTxt={theme.colorTxt}   
                colorTxtSel={theme.colorTxtSel}
                colorBgSel={theme.colorBgSel}
            />
        </Splitter>

        <TabCtrl slot="2"
            colorBg={theme.colorBg}
            colorHover={theme.colorHover}
            colorTxt={theme.colorTxt}   
            colorTxtSel={theme.colorTxtSel}
            colorBgSel={theme.colorBgSel}
        >
            <TabHeader>
                <TabName tab=1>Markdown</TabName>
                <TabName tab=2>Ace Editor</TabName>
            </TabHeader>

            <TabPane pane=1>
                <Markdown text={text}></Markdown>
            </TabPane>

            <TabPane pane=2>
                <AceEditor 
                    bind:this={editor}
                    bind:value={value} 
                    options={options}
                    theme={theme.name} 
                />
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
