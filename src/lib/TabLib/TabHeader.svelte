
<!--====================================================-->
<nav class="tab-header">
    <slot></slot>
</nav>

<!--====================================================-->
<style>
    .tab-header {
        display: flex;
        flex-direction: row;
        flex-shrink: 0;
        min-block-size: fit-content;
        border-bottom: 1px solid var(--color-text);
        background-color: transparent;
        
        white-space: nowrap;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        -ms-overflow-style: -ms-autohiding-scrollbar;
    }

    .tab-header::-webkit-scrollbar {
        display: none;
    }
</style>

<!--====================================================-->