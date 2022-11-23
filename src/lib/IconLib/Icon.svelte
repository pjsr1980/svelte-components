
<!-- https://fonts.google.com/icons?icon.style=Outlined -->
<svelte:head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</svelte:head>

<!-- Script -->
<script lang="ts">
    export let name: string = "";
    export let fill: boolean = false;
    export let size: string = "inherit";
    export let color: string = "inherit";
</script>

<!-- Elements -->
<span class="icon material-symbols-outlined" 
    style="--color:{color}; --size:{size}; --fill:{fill?1:0}">
    {name}
</span>

<!-- Styles -->
<style>
    .icon {
        color: var(--color);
        font-size: var(--size);
        vertical-align: bottom;

        -webkit-user-select:none!important;
        -moz-user-select:none!important;
        -ms-user-select:none!important;
        user-select:none!important;
    }

    .material-symbols-outlined {
      font-variation-settings:
      'FILL' var(--fill),
      'wght' 300,
      'GRAD' 0,
      'opsz' 48
    }
</style>