<script>
import { fade } from 'svelte/transition';
export let simple = false;
</script>

{#if simple}
    <slot name="simple" />
{:else}
    <div class="wrapper" in:fade={{ duration: 200 }}>
        <slot>
            <!-- Default skeleton layout is a single bar -->
            <div />
        </slot>
    </div>
{/if}

<style>
.wrapper {
    display: contents;
    width: 100%;
    height: 100%;
    margin: 0px;
}
.wrapper :global(svg) {
    visibility: hidden;
}
.wrapper :global(input),
.wrapper :global(p),
.wrapper :global(h1),
.wrapper :global(h2),
.wrapper :global(h3),
.wrapper :global(legend),
.wrapper :global(div:empty),
.wrapper :global(label),
.wrapper :global(span),
.wrapper :global(svg),
:global(.skeleton-bar) {
    /* Color transparent hides text, but allows the text to define the width and height */
    max-height: 20px;
    color: transparent !important;
    opacity: 1;
    border-radius: 3px;
    border: none;
    overflow: hidden;
    transform: none;
    background-repeat: no-repeat;
    background-image: linear-gradient(
        to right,
        var(--skeleton-gradient-stop-1, rgba(190, 190, 190, 0.4)),
        var(--skeleton-gradient-stop-2, rgba(206, 206, 206, 0.2)),
        var(--skeleton-gradient-stop-1, rgba(190, 190, 190, 0.4))
    );
    background-size: 200% 100%;
    animation: loading 1s infinite ease;
}
.wrapper :global(select) {
    display: none;
}
.wrapper :global(::placeholder) {
    color: transparent;
}
@keyframes -global-loading {
    50% {
        background-position: 100% 0px;
    }
    100% {
        background-position: 0px 0px;
    }
}
</style>
