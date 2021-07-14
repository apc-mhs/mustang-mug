<script>
import { tick } from 'svelte';
import { createPopperActions } from 'svelte-popperjs';
import { clickOutside } from '$lib/actions';
import { bottom } from '@popperjs/core';

export let reference;
export let popperOptions;
export let persistScroll = false;
export let transition;
export let transitionProps = {};
export let opened = false;

if (!popperOptions) {
    popperOptions = {
        placement: bottom,
        modifiers: [
            {
                name: 'preventOverflow',
                options: {
                    altAxis: true,
                },
            },
        ],
    };
}

let popperContentElem;
let scrollPosition = { scrollTop: 0, scrollLeft: 0 };

const [popperRef, popperContent] = createPopperActions();
$: if (reference) popperRef(reference);

function updateScroll() {
    if (!popperContentElem.firstElementChild) return;

    popperContentElem.firstElementChild.scrollTop = scrollPosition.scrollTop;
    popperContentElem.firstElementChild.scrollLeft = scrollPosition.scrollLeft;
}

function saveScroll() {
    if (!popperContentElem.firstElementChild) return;

    scrollPosition = {
        scrollTop: popperContentElem.firstElementChild.scrollTop,
        scrollLeft: popperContentElem.firstElementChild.scrollLeft,
    };
}

function clickOutsideHandler(event) {
    if (reference.contains(event.target)) return;

    close();
}

export async function open() {
    opened = true;
    await tick();
    if (persistScroll) {
        updateScroll();
    }
}

export function close() {
    if (persistScroll) {
        saveScroll();
    }
    opened = false;
}

export function toggle() {
    if (opened) {
        close();
    } else {
        open();
    }
}
</script>

{#if opened}
    <div
        class="popper"
        use:popperContent={popperOptions}
        use:clickOutside={clickOutsideHandler}>
        <div
            class="popper-content"
            transition:transition|local={transitionProps}
            bind:this={popperContentElem}>
            <slot />
        </div>
    </div>
{/if}

<style>
.popper {
    position: absolute;
    z-index: 200;
    width: auto;
    height: auto;
}

.popper-content {
    box-sizing: border-box;
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
        0 2px 6px 2px rgba(60, 64, 67, 0.149);
    height: auto;
    width: auto;
}
</style>
