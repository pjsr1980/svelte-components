
<script>
    import TabCtrl from "./TabCtrl.svelte";
    import TabHeader from "./TabHeader.svelte";
    import TabName from "./TabName.svelte";
    import TabPane from "./TabPane.svelte";

    let tabs = [
        {
            name: "Tab 1",
            text: "Text 1"
        },
        {
            name: "Tab 2",
            text: "Text 2"
        },
        {
            name: "Tab 3",
            text: "Text 3"
        },
    ]
</script>

<TabCtrl>
    <TabHeader>
        {#each tabs as tab}
            <TabName tab={tab}>
                {tab.name}
            </TabName>
        {/each}
    </TabHeader>

    {#each tabs as tab}
        <TabPane pane={tab}>
            {tab.text}
        </TabPane>
    {/each}
</TabCtrl>