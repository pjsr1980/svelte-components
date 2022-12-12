# @pjsr/svelte-components

>
> If you like this library, if it helps you solve a problem, you have possibility, **[offer a coffee](https://donate.stripe.com/eVadQX5swdoAc12bIK "pjsr coffee")**.
>

## Components


### Icon

Icon uses [Google Material Symbols](https://fonts.google.com/icons)

```html
<script>
    import { Icon } from "@pjsr/svelte-components";
</script>

<Icon name="database" size="2em" />
```

### Splitter

```html
<script>
    import { Splitter } from "@pjsr/svelte-components";

    let size1="30%";
    let size2="70%";
    let isSwap = false;
    let isVertical = false;
</script>

<Splitter isVertical={isVertical} isSwap={isSwap} bind:size1={size1} bind:size2={size2}>
    <div slot="1">Content 1</div>
    <div slot="2">Content 2</div>
</Splitter>
```

### Markdown

Uses `markdown-it`, `markdown-it-emoji`, `markdown-it-footnote`, `highlight`, `mathjax` and the `.markdown-body` class, see the [repository's static](https://github.com/pjsr1980/svelte-components/tree/main/static) folder and the **app.html** file as an example of loading the libraries needed to use this component.

```html
<script>
    import { Markdown } from "@pjsr/svelte-components";

    let text = `
## Hello World!
\`\`\`ts
let pow = function(num: number) {
    return num * num;
}
console.log("pow(5)=", pow(5));
\`\`\`

This is an example of how to create ;) a footnote[^1] in Markdown.
[^1]: First Footnote

\`$ [ x^n + y^n = z^n ] $\`
\`$ x^2 + y^3 = z^n $\`
`;
</script>

<Markdown text={text}></Markdown>
```

### AceEditor

Uses `ace editor`, see the [repository's static](https://github.com/pjsr1980/svelte-components/tree/main/static) folder and the **app.html** file as an example of loading the librarie needed to use this component.

```html
<script>
    import { AceEditor } from "@pjsr/svelte-components";

    let code = `console.log("Hello World!");`;
</script>

<AceEditor bind:value={code} theme="chaos" />
```

### TabCtrl

```html
<script>
    import {TabCtrl, TabHeader, TabName, TabPane} from "@pjsr/svelte-components";
</script>

<TabCtrl>
    <TabHeader>
        <TabName tab=1>Tab 1</TabName>
        <TabName tab=2>Tab 2</TabName>
    </TabHeader>

    <TabPane pane=1>
        Content 1
    </TabPane>

    <TabPane pane=2>
        Content 2
    </TabPane>
</TabCtrl>
```

### TreeCtrl and PropCtrl

```html 
<script>
import { 
    Splitter, 
    TreeNode, 
    TreeCtrl, 
    PropNode, 
    PropCtrl, 
    AceThemes 
} from "@pjsr/svelte-components";

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
        {name: "Pedro",  value: "1"},
        {name: "Sandra", value: "2"}
    ]
}

PropNode.newPropSelect(g2, "Nome:", g2.data.options, 
()=> { return g2.data.nome; }, (v) => { g2.data.nome = v; })

TreeNode.newField(root, "Folder 1", "folder", [
    TreeNode.newField(null, "Folder 1.1", "folder", [], [
        TreeNode.newFile(null, "File 1.1", "txt"),
        TreeNode.newFile(null, "File 1.2", "js")    
    ])
], [
    TreeNode.newFile(null, "File 1", "txt"),
    TreeNode.newFile(null, "File 2", "js")
]);
root.getItemMenu = (item: NodeBase) => {
    let r: MenuItem[] = [
        {
            text: "Command 1",
            icon: "folder",
            cmd: "cmd-1"
        },
        { text: "" },
        {
            text: "Command 2",
            icon: "folder",
            cmd: "cmd-1"
        }
    ];
    return r;
}

let theme = AceThemes[3];
</script>

<Splitter slot="1" isVertical={true} isSwap={false} >
    <TreeCtrl slot="1" title="Test Tree" root={root}
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
```

> 
> **All the best and good luck!**
>