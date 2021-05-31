<script>
import SkeletonLayout from '$lib/components/utility/SkeletonLayout.svelte';
import Refiner from '$lib/components/menu/Refiner.svelte';
import { fade } from 'svelte/transition';

export let items;
export let options;
export let skeleton = false;
export let refine = true;

const skeletonItems = new Array(10).fill(5).map((_) => {
    return {
        name: Math.random().toString().substring(0, 5),
        price: 0,
        stock: false,
        options: [],
        image: 'menu-item-placeholder.jpg',
    };
});

function getOptions(item) {
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
        <div class="checkboxes">
            <h2>Menu</h2>
            <div class="items">
                {#each (skeleton ? skeletonItems : items) as item}
                    {#if skeleton}
                        <div out:fade|local={{ duration: 250 }}>
                            <SkeletonLayout>
                                <slot {item} />
                            </SkeletonLayout>
                        </div>
                    {:else}
                        <div in:fade|local={{ delay: 250, duration: 250 }}>
                            <slot {item} itemOptions={getOptions(item)} />
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
.flex-container {
    display: flex;
    flex-direction: row;
}
.flex-right {
    flex: 1 0 85%;
    margin: 0.3em;
    padding: 0.3em;
}
.flex-left {
    flex: 1 0 15%;
    margin: 0.3em;
    padding: 0.3em;
}
h2 {
    text-align: center;
}
.checkboxes {
    position: relative;
    color: black;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    background: rgb(175, 175, 175);
    margin: 0.3em;
    padding: 0.3em;
    text-align: center;
    box-shadow: 0px 0px 3px 0px black;
}
.items {
    display: flex;
    justify-content: center;
    flex-flow: row wrap;
    gap: 30px 20px;
    width: 100%;
    height: 100%;
}
</style>
