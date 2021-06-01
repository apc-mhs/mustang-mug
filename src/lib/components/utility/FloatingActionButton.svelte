<script>
import Button from '$lib/components/utility/Button.svelte';
import { horizontalSlide } from '$lib/transition';
import { fade } from 'svelte/transition';

export let disabled;

let movingUp = true;
let lastScroll = 0;

function onScroll() {
    const currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;
    movingUp = currentScroll < lastScroll;
    lastScroll = Math.max(0, currentScroll);
}
</script>

<svelte:window on:scroll={onScroll} />

<div class="fab-wrapper" in:fade|local={{ duration: 250, delay: 250 }}>
    <Button
        on:click
        {disabled}
        --font-size="20px"
        --border-radius="200px"
        --padding={!movingUp ? '9px' : '9px 26px'}
        --gap="0px">
        <slot name="icon" />
        {#if movingUp}
            <span transition:horizontalSlide class="text-wrapper">
                <slot name="text" />
            </span>
        {/if}
    </Button>
</div>

<style>
.fab-wrapper {
    position: fixed;
    right: 25px;
    bottom: 25px;
}

.text-wrapper {
    white-space: nowrap;
    margin-left: 5px;
}
</style>
