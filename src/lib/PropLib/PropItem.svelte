<!-- Script -->
<script lang="ts">
    import type { NodeProp } from "../TreeLib/TreeNode";
    import type { NodePropGroup } from "./PropNode";
    import type { NodePropInput } from "./PropNode";
    import type { NodePropSelect } from "./PropNode";

    import PropGroup from "./PropGroup.svelte";
    import PropInput from "./PropInput.svelte";
    import PropSelect from "./PropSelect.svelte";

    export let prop: NodeProp;

    $: group  = prop.kind === "group" ? (prop as NodePropGroup) : undefined;
    $: input  = prop.kind === "input" ? (prop as NodePropInput) : undefined;
    $: select = prop.kind === "select" ? (prop as NodePropSelect) : undefined;
</script>

<!-- Elemets -->
{#if prop.visible}
    {#if group}
        <PropGroup prop={group} />
    {:else if input}
        <PropInput prop={input} />
    {:else if select}
        <PropSelect prop={select} />
    {/if}
{/if}
