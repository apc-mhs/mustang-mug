<script>
import SkeletonLayout from '$lib/components/SkeletonLayout.svelte';
import MenuItem from '$lib/components/MenuItem.svelte';

export let items;
export let skeleton = false;
</script>

<div class="flex-container">
    <div class="flex-left">
        <ul class="selection-items">
            <!-- I'm fairly certain these can be hard-coded and then do stuff with the script but I tried to set it up for scalability-->
            <h2>Refine Menu</h2>
            <li>
                <input type="checkbox" id="item1" />
                <label for="item1">Show nails</label><br />
            </li>
            <li>
                <input type="checkbox" id="item2" />
                <label for="item2">Show drinks made by orphans</label><br />
            </li>
            <li>
                <input type="checkbox" id="item2" />
                <label for="item2">Edible</label><br />
            </li>
            <li>
                <p>Level of child labor:</p>
                <input type="range" min="1" max="100" value="50" />
            </li>
        </ul>
    </div>
    <div class="flex-right">
        <div class="checkboxes">
            <h2>Menu</h2>
            <div class="items">
                {#each items as item}
                    {#if skeleton}
                        <SkeletonLayout>
                            <MenuItem {item} />
                        </SkeletonLayout>
                    {:else}
                        <MenuItem {item} />
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

.checkboxes {
    color: black;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    background: rgb(175, 175, 175);
    margin: 0.3em;
    padding: 0.3em;
    text-align: center;
}
.items {
    display: flex;
    justify-content: center;
    flex-flow: row wrap;
    gap: 30px 20px;
    width: 100%;
    height: 100%;
}

h2 {
    text-align: center;
}

.selection-items {
    list-style: none;
    margin: 0.3em;
    padding: 0.3em;
    background-color: rgb(175, 175, 175);
    text-decoration: none;
    color: black;
}

li {
    margin-bottom: 0.5em;
}
.selection-items li:hover {
    background-color: #c5c5c5;
}
</style>
