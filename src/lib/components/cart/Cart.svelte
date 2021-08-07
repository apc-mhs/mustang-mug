<script>
import { fly } from 'svelte/transition';
import { flip } from 'svelte/animate';
import { getDocumentsWhere } from '$lib/query';
import { browser } from '$app/env';
import { fade } from 'svelte/transition';
import CartItem from './CartItem.svelte';
import { isOutOfStock } from '$lib/cart/item';

export let cartItems = [];
export let menuItems = [];
export let validCart = false;

const menuItemsById = menuItems.reduce((object, menuItem) => ({ [menuItem.id]: menuItem, ...object }), {});

let outOfStockOptionIds = [];
if (browser) {
    getDocumentsWhere('options', (queryable) =>
        queryable.where('stock', '==', false)
    ).then((data) => {
        outOfStockOptionIds = data.map((doc) => doc.id);
    });
}

$: outOfStockItemIds = menuItems
    .filter((item) => !item.stock)
    .map((item) => item.id);
$: validCart = cartItems.some(
    (item) => !isOutOfStock(item, outOfStockItemIds, outOfStockOptionIds)
);
</script>

<!-- Necessary duplicated out:fly here to fly even when cartItems becomes empty, removing this outer div -->
{#if cartItems.length > 0}
    <div class="items" out:fly|local={{ duration: 250, x: -75 }}>
        {#each cartItems as item (item.itemId + item.reference)}
            <div animate:flip={{ duration: 250, delay: 250 }}>
                <CartItem
                    {item}
                    menuItem={menuItemsById[item.itemId]}
                    {outOfStockOptionIds}
                    outOfStock={isOutOfStock(item, outOfStockItemIds, outOfStockOptionIds)}
                    on:remove/>
            </div>
        {/each}
    </div>
{:else}
    <div>
        <h2 class="no-items" in:fade={{ delay: 250 }}>
            There is nothing in your cart. Go to the <a href="/">menu</a> and add
            a few items.
        </h2>
    </div>
{/if}

<style>
.items {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: 15px 0px;
}

h2.no-items a {
    color: white;
}

h2.no-items {
    text-align: center;
    margin-bottom: 10px;
    color: white;
}
</style>
