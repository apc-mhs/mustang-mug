<script>
import { goto } from '$app/navigation';

import Menu from '$lib/components/menu/Menu.svelte';
import MenuItem from '$lib/components/menu/MenuItem.svelte';
import FloatingActionButton from '$lib/components/input/FloatingActionButton.svelte';
import Icon from '$lib/components/utility/Icon.svelte';
import SkeletonLayout from '$lib/components/utility/SkeletonLayout.svelte';
import { query, postCartItems } from './_menu';
import { startLoading, stopLoading } from '$lib/components/loading';

let skeleton = true;
let updatingCart = false;
let items = [];
let options = [];
let cartItems = {};

query().then(([itemsData, optionsData]) => {
    items = itemsData && itemsData.sort((a, b) => a.name.localeCompare(b.name));
    options = optionsData;
    skeleton = false;
});

async function addToCart() {
    if (
        Object.values(cartItems).every((itemList) =>
            itemList.every((item) => item === null)
        )
    ) {
        alert('Select some items before adding them to your cart.');
        return;
    }

    updatingCart = true;
    startLoading();
    const success = await postCartItems(cartItems);
    stopLoading();
    if (success) {
        await goto('/cart');
    } else {
        alert('Could not add items to cart. Try again later.');
    }
    updatingCart = false;
}
</script>

<svelte:head>
    <title>Menu - Mustang Mug</title>
</svelte:head>

<section>
    <Menu title="Menu" {skeleton} {items} {options} let:item let:itemOptions>
        {#if !skeleton}
            <MenuItem
                {item}
                options={itemOptions}
                bind:cartItems={cartItems[item.id]} />
        {:else}
            <SkeletonLayout>
                <MenuItem {item} />
            </SkeletonLayout>
        {/if}
    </Menu>
    {#if !skeleton}
        <FloatingActionButton
            on:click={addToCart}
            disabled={updatingCart}
            --font-size="20px"
            --border-radius="10px"
            --right="25px"
            --bottom="25px">
            <Icon slot="icon" name="add-shopping-cart" width="30" height="30" />
            <p slot="text">Add to cart</p>
        </FloatingActionButton>
    {/if}
</section>

<style>
section {
    position: relative;
    background-color: rgb(71, 70, 70);
    color: white;
}
</style>
