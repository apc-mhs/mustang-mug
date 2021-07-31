<script>
import Icon from '$lib/components/utility/Icon.svelte';
import InfoBox from '$lib/components/utility/InfoBox.svelte';
import { numberFormatter } from '$lib/utils';
import { createEventDispatcher } from 'svelte';
import { fly } from 'svelte/transition';
import { flip } from 'svelte/animate';
import tippy from '$lib/tippy';
import { getDocumentsWhere } from '$lib/query';
import { browser } from '$app/env';
import { getOptionIdsFromProperties } from '$lib/msb/cart';
import Button from '$lib/components/input/Button.svelte';
import { fade } from 'svelte/transition';

export let cartItems = [];
export let menuItems = [];
export let validCart = false;

const dispatch = createEventDispatcher();

const outOfStockTooltipProps = {
    content:
        'If you proceed to checkout now, this item will be removed from your cart.',
    placement: 'left',
};

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
    (cartItem) => !isOutOfStock(cartItem, outOfStockOptionIds)
);

function isOutOfStock(cartItem, optionIds) {
    return (
        outOfStockItemIds.includes(cartItem.itemId) ||
        getOptionIdsFromProperties(cartItem.properties).some((optionId) =>
            optionIds.includes(optionId)
        )
    );
}
</script>

<!-- Necessary duplicated out:fly here to fly even when cartItems becomes empty, removing this outer div -->
{#if cartItems.length > 0}
    <div class="items" out:fly|local={{ duration: 250, x: -75 }}>
        {#each cartItems as item (item.itemId + item.reference)}
            <div
                class="item"
                out:fly|local={{ duration: 250, x: -75 }}
                animate:flip={{ duration: 250, delay: 250 }}>
                <h2>
                    {#if isOutOfStock(item, outOfStockOptionIds)}
                        <span
                            class="out-of-stock"
                            use:tippy={outOfStockTooltipProps}
                            >Out of stock</span>
                    {/if}
                    {item.itemName}
                </h2>
                <p>
                    Price: ({numberFormatter.format(
                        menuItems.find((menuItem) => menuItem.id == item.itemId)
                            .price
                    )})
                </p>
                {#if item.properties.length > 0}
                    <h3>Options:</h3>
                    <ul>
                        {#each item.properties as option, i (i)}
                            <li>
                                {option.name}
                                {#if outOfStockOptionIds.includes(option.value)}
                                    <span class="out-of-stock"
                                        >Out of stock</span>
                                {/if}
                            </li>
                        {/each}
                    </ul>
                {/if}
                <p class="quantity">
                    Quantity: {item.quantity}
                </p>
                <h4>
                    <InfoBox
                        content="The total is the cost of the item plus the cost of all of its selected options, all times the quantity." />
                    Total: {numberFormatter.format(item.unitPrice * item.quantity)}
                </h4>
                <Button on:click={() => dispatch('remove', item)}>
                    <Icon name="remove-shopping-cart" width="20" height="20" />
                    Remove from cart
                </Button>
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

.item {
    display: flex;
    flex-flow: column nowrap;
    border-radius: 5px;
    background-color: white;
    max-width: 100%;
    width: 600px;
    min-height: 250px;
    padding: 10px 20px;
    gap: 5px;
}

.quantity {
    margin-top: auto;
}

span.out-of-stock {
    color: rgb(243, 101, 101);
    background-color: rgb(248, 211, 211);
    font-size: 18px;
    padding: 3px 5px;
    border-radius: 5px;
    vertical-align: middle;
    cursor: default;
    white-space: nowrap;
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
