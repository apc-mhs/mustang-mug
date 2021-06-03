<script>
import Button from '$lib/components/utility/Button.svelte';
import { horizontalSlide } from '$lib/transition';
import { useMediaQuery } from '$lib/utils';
import { fade } from 'svelte/transition';

export let disabled = false;

const minDirectionalScrollSpeed = 8;

const mobile = useMediaQuery('(max-width: 650px)');
let movingUp = true;
let lastScroll = null;

function onScroll() {
    const currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;

    if (lastScroll === null) {
        lastScroll = currentScroll;
    }

    const scrollDifference = Math.abs(currentScroll - lastScroll);

    if (scrollDifference > minDirectionalScrollSpeed) {
        movingUp = currentScroll < lastScroll;
    }

    lastScroll = Math.max(0, currentScroll);
}
</script>

<svelte:window on:scroll={onScroll} />

<div class="fab-wrapper" transition:fade|local={{ duration: 250 }}>
    <div class="styles" style="--padding: {(!movingUp && $mobile) || !$$slots.text ? '9px' : '9px 26px'};">
        <Button
        on:click
        --font-size="20px"
        {disabled}>
        <slot name="icon" />
        {#if $$slots.text}
            {#if movingUp || !$mobile}
                <span transition:horizontalSlide|local class="text-wrapper">
                    <slot name="text"></slot>
                </span>
            {/if}
        {/if}
    </Button>
    </div>
</div>

<style>
.fab-wrapper {
    position: fixed;
    right: var(--right, unset);
    bottom: var(--bottom, unset);
    top: var(--top, unset);
    left: var(--left, unset);
    border-radius: 200px;
    box-shadow: 0px 0px 5px 1px rgb(0 0 0 / 50%);
    z-index: 10;
}

.text-wrapper {
    white-space: nowrap;
    margin-left: 5px;
}

.styles {
    display: contents;
    --font-size: 20px;
    --border-radius: 200px;
    --box-shadow: none;
    --gap: 0px;
}
</style>
