<script>
import { goto } from '$app/navigation';

import Menu from '$lib/components/menu/Menu.svelte';
import MenuItem from '$lib/components/menu/MenuItem.svelte';
import Icon from '$lib/components/utility/Icon.svelte';
import { fade } from 'svelte/transition';
import { query, postCartItems } from './_menu';

let skeleton = true;
let updatingCart = false;
let items = [];
let options = [];
let cartItems = {};

query()
    .then(([ itemsData, optionsData ]) => {
        items = itemsData;
        options = optionsData;
        skeleton = false;
    });

async function addToCart() {
    updatingCart = true;
    const success = await postCartItems(cartItems);
    if (success) {
        await goto('/cart');
    } else {
        console.error(res);
        alert('Could not add items to cart. Try again later.');
    }
    updatingCart = false;
}
</script>

<svelte:head>
    <title>Menu</title>
</svelte:head>

<section>
    <Menu {skeleton} {items} {options} let:item let:itemOptions>
        <MenuItem {item} options={itemOptions} bind:cartItems={cartItems[item.id]} />
    </Menu>
    {#if !skeleton}
        <button
            class="add-to-cart"
            on:click={addToCart}
            in:fade|local={{ duration: 250, delay: 250 }}
            disabled={updatingCart}>
            <Icon name="add-shopping-cart" width="30" height="30" />
            Add items to cart
        </button>
    {/if}
</section>

<style>
section {
    background-color: rgb(71, 70, 70);
    color: white;
}

.add-to-cart {
    position: fixed;
    bottom: 40px;
    right: 10px;
    display: flex;
    align-items: center;
    gap: 0px 5px;
    flex-flow: row nowrap;
    font-size: 30px;
    border-radius: 10px;
    cursor: pointer;
    float: right;
    clear: both;
}
</style>
