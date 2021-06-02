<script>
import Button from '$lib/components/utility/Button.svelte';
import { horizontalSlide } from '$lib/transition';
import { useMediaQuery } from '$lib/utils';
import { fade } from 'svelte/transition';

export let disabled;

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

    if (scrollDifference > 12) {
        movingUp = currentScroll < lastScroll;
    }

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
        --box-shadow="none"
        --padding={!movingUp && $mobile ? '9px' : '9px 26px'}
        --gap="0px">
        <slot name="icon" />
        {#if movingUp || !$mobile}
            <span transition:horizontalSlide|local class="text-wrapper">
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
    border-radius: 200px;
    box-shadow: 0px 0px 5px 1px rgb(0 0 0 / 50%);
}

.text-wrapper {
    white-space: nowrap;
    margin-left: 5px;
}
</style>
