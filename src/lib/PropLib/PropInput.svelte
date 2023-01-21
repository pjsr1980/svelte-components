<!-- Script -->
<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { NodePropInput } from "./PropNode";

    export let prop: NodePropInput;

    let value: any;

    onMount(() => {
        get_value();
        prop.update = get_value;
    })

    onDestroy(() => {
        delete prop.update;
    })

    function on_change(e: Event) {
        if(prop.onValue) {
            let target = e.target as HTMLInputElement;
            if(is_text || is_pwd || is_mail || is_color || 
            is_time || is_url) {
                prop.onValue(target.value);
            }
            else if(is_number || is_range) {
                prop.onValue(+target.value);
            }
            else if(is_check || is_radio) {
                prop.onValue(target.checked);
            }
            else if(is_date || is_month || is_week) {
                prop.onValue(target.value);
            }
            get_value();
        }
    }

    function get_value() {
        value = prop.getValue();
    }

    $: is_text      = prop.args.type === "text";
    $: is_pwd       = prop.args.type === "password";
    $: is_mail      = prop.args.type === "email";
    $: is_number    = prop.args.type === "number"; 
    $: is_color     = prop.args.type === "color";
    $: is_check     = prop.args.type === "checkbox";
    $: is_radio     = prop.args.type === "radio";
    $: is_range     = prop.args.type === "range"; 
    $: is_time      = prop.args.type === "time";
    $: is_date      = prop.args.type === "date";
    $: is_month     = prop.args.type === "month";
    $: is_week      = prop.args.type === "week";
    $: is_url       = prop.args.type === "url";
</script>

<!-- Elements -->
<div class="pane">
    <div class="left">
        <label for={prop.nid}>{prop.name}</label>
    </div>
    <div class="right">
        {#if value !== undefined}
        <input {...prop.args}
            id={prop.nid} 
            value={value}
            checked={value}
            on:change={on_change}
        />
        {/if}
    </div>
</div>

<!-- Styles -->
<style>
    .pane {
        margin: 0;
        padding: calc(0.2 * var(--txt-size));
        width: calc(100% - 2 * 0.2 * var(--txt-size));
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .left {
        width: 45%;
        color: var(--color-txt);
        font-size: var(--txt-size);
        text-overflow: ellipsis;
        white-space: nowrap;
        width: available;
        overflow: hidden;

        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .left label {
        padding: calc(0.3 * var(--txt-size));
    }

    .right {
        width: 55%;
    }

    .right input {
        width: calc(100% - 2 * 0.3 * var(--txt-size));
        margin: 0;
        padding: calc(0.3 * var(--txt-size));
        border: 0;
        color: var(--color-txt-sel);
        background-color: var(--color-bg-sel);
        font-size: calc(0.85 * var(--txt-size));
    }

    .right input[type="checkbox"] {
        width: auto;
    }

    .right input[type="radio"] {
        width: auto;
    }

    .right input[type="color"] {
        margin: 0;
        padding: 0;
        width: calc(3 * var(--txt-size));
    }

    .right input::-webkit-calendar-picker-indicator {
        filter: invert(0.5) sepia(1) saturate(5) hue-rotate(175deg);
    }

    

</style>