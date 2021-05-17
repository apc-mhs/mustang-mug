<script>
import SkeletonLayout from '$lib/components/SkeletonLayout.svelte';
import MenuItem from '$lib/components/MenuItem.svelte';

export let items;
export let skeleton = false;
</script>

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

<style>
.checkboxes {
    color: black;
    padding: 20px;
    background: rgb(175, 175, 175);
    max-width: 80vw;
    margin: 20px auto;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    font-size: 12px;
    text-align: center;
}
.items {
    display: flex;
    flex-flow: row wrap;
    gap: 30px 20px;
    width: 100%;
    height: 100%;
}
</style>
