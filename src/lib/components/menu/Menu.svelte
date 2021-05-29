<script>
import SkeletonLayout from '$lib/components/utility/SkeletonLayout.svelte';
import { fade } from 'svelte/transition';

export let items;
export let skeleton = false;

$: sortedItems = sortByRefinements(items);

function sortByRefinements(items) {
    return items.sort((a, b) => a.name.localeCompare(b.name));
}
</script>

<div class="flex-container">
    <div class="flex-left">
        <ul class="selection-items">
            <!-- I'm fairly certain these can be hard-coded and then do stuff with the script but I tried to set it up for scalability-->
            <h2>Refine Menu</h2>
            <li>
                <input type="checkbox" id="item1" />
                <label for="item1">Selection 1</label>
            </li>
            <li>
                <input type="checkbox" id="item2" />
                <label for="item2">Selection 2</label>
            </li>
            <li>
                <input type="checkbox" id="item2" />
                <label for="item2">Selection 3</label>
            </li>
            <li>
                <p>Scale</p>
                <input type="range" min="1" max="100" value="100" />
            </li>
        </ul>
    </div>
    <div class="flex-right">
        <div class="checkboxes">
            <h2>Menu</h2>
            <div class="items">
                {#each sortedItems as item, i}
                    {#if skeleton}
                        <div out:fade|local={{ duration: 250 }}>
                            <SkeletonLayout>
                                <slot {item} />
                            </SkeletonLayout>
                        </div>
                    {:else}
                        <div in:fade|local={{ delay: 250, duration: 250 }}>
                            <slot {item} />
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
    width: 85%;
    margin: 0.3em;
    padding: 0.3em;
}
.flex-left {
    width: 15%;
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
.selection-items {
    position: sticky;
    top: calc(0.6em + var(--header-height));
    list-style: none;
    margin: 0.3em;
    padding: 0.3em;
    background-color: rgb(175, 175, 175);
    text-decoration: none;
    color: black;
    box-shadow: 0px 0px 3px 0px black;
}
li {
    margin-bottom: 0.5em;
}
.selection-items li:hover {
    background-color: #c5c5c5;
}
</style>
