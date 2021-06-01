<script>
import SkeletonLayout from '$lib/components/utility/SkeletonLayout.svelte';
import Refiner from '$lib/components/menu/Refiner.svelte';
import { fade } from 'svelte/transition';

export let title;
export let items;
export let options;
export let skeleton = false;
export let refine = true;

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

function getOptions(item) {
    if (!item.options) return [];

    const itemOptionIds = new Set(item.options.map((option) => option.id));
    return options.filter((option) => itemOptionIds.has(option.id));
}
</script>

<div class="flex-container">
    {#if refine}
        <div class="flex-left">
            <Refiner bind:refinedItems={items} />
        </div>
    {/if}
    <div class="flex-right">
        <div class="menu">
            <h2>{title}</h2>
            <div class="items">
                {#each skeleton ? skeletonItems : items as item (item.id)}
                    <div transition:fade|local={{ duration: 250 }}>
                        {#if skeleton}
                            <SkeletonLayout>
                                <slot {item} />
                            </SkeletonLayout>
                        {:else}
                            <slot {item} itemOptions={getOptions(item)} />
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
.flex-container {
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
    justify-content: center;
    flex-flow: row wrap;
    gap: 30px 20px;
}
</style>
