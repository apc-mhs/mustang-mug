<script>
import IconButton from './IconButton.svelte';
import Icon from './Icon.svelte';
import { createEventDispatcher, onDestroy, onMount } from "svelte";

export let visible = false;

const dispatch = createEventDispatcher();

$: {
    document.body.style.overflow = visible ? 'hidden' : 'unset';
}
</script>

<div class="drawer-wrapper" class:visible>
    <div class="close-wrapper">
        <IconButton on:click={() => dispatch('close')}>
            <Icon name="close" width="25" height="25" />
        </IconButton>
    </div>
    <slot />
</div>

<style>
.drawer-wrapper {
    position: fixed;
    --height: calc(100vh - var(--header-height));
    height: var(--height);
    width: 100vw;
    top: 100vh;
    left: 0px;
    z-index: 12;
    transition: transform 300ms cubic-bezier(.66,0,1,.66);
    pointer-events: none;
}

.close-wrapper {
    position: absolute;
    top: 5px;
    right: 5px;
}

.drawer-wrapper.visible {
    transition-timing-function: cubic-bezier(.33,1,.66,1);
    transform: translateY(calc(-1 * var(--height)));
    pointer-events: all;
}
</style>
