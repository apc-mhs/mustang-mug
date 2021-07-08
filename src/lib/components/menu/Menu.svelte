<script>
import FloatingActionButton from '$lib/components/input/FloatingActionButton.svelte';
import Refiner from '$lib/components/menu/Refiner.svelte';
import Drawer from '$lib/components/utility/Drawer.svelte';
import Icon from '$lib/components/utility/Icon.svelte';
import { useMediaQuery } from '$lib/utils';
import { createEventDispatcher } from 'svelte';
import { flip } from 'svelte/animate';
import { fade } from 'svelte/transition';
import Button from '../input/Button.svelte';


export let title;
export let items;
export let options;
export let skeleton = false;
export let refine = true;
export let modify = false;

const mobile = useMediaQuery('(max-width: 650px)');
const dispatch = createEventDispatcher();
const skeletonItems = new Array(10).fill(5).map((_, i) => {
    return {
        id: i,
        name: Math.random().toString().substring(0, 5),
        price: 0,
        stock: false,
        options: [],
        image: 'menu-item-placeholder.jpg',
    };
});

$: menuItems = skeleton ? skeletonItems : items;

let mobileRefinerShown = false;

function getOptions(item) {
    if (!item.options) return [];

    const itemOptionIds = new Set(item.options.map((option) => option.id));
    return options.filter((option) => itemOptionIds.has(option.id));
}
</script>

<div class="flex-container">
    {#if refine}
        <div class="flex-left">
            {#if $mobile}
                {#if !mobileRefinerShown}
                    <FloatingActionButton
                        --top="125px"
                        --left="-10px"
                        on:click={() =>
                            (mobileRefinerShown = !mobileRefinerShown)}>
                        <Icon
                            slot="icon"
                            name="filter"
                            width="30"
                            height="30" />
                    </FloatingActionButton>
                {/if}
                <Drawer
                    visible={mobileRefinerShown}
                    on:close={() => (mobileRefinerShown = false)}>
                    <Refiner bind:refinedItems={items} />
                </Drawer>
            {:else}
                <Refiner bind:refinedItems={items} />
            {/if}
        </div>
    {/if}
    <div class="flex-right">
        <div class="menu">
            <h2>{title}</h2>
            <div class="items">
                {#each menuItems as item (item.id)}
                    <div
                        transition:fade|local={{ duration: 250 }}
                        animate:flip={{ duration: 600 }}>
                        <slot {item} itemOptions={getOptions(item)} />
                    </div>
                {/each}
                {#if modify}
                    <div style="align-self: center;">
                        <Button
                            on:click={() => dispatch('addItem')}
                            --padding="15px"
                            --border-radius="200px">
                            <Icon name="plus" width="40" height="40" />
                        </Button>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
.flex-container {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    gap: 15px;
    padding: 15px;
}
.flex-right {
    flex: auto;
}
.flex-left {
    flex: 0 0 auto;
    position: sticky;
    top: calc(15px + var(--header-height));
}
h2 {
    text-align: center;
    margin-bottom: 10px;
}
.menu {
    position: relative;
    color: black;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    background: rgb(175, 175, 175);
    text-align: center;
    box-shadow: 0px 0px 3px 0px black;
    padding: 10px 0px;
}
.items {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    gap: 30px 20px;
}
@media (max-width: 650px) {
    .flex-left {
        position: absolute;
    }
}
</style>
