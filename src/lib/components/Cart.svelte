<script>
import Icon from '$lib/components/Icon.svelte';
import InfoBox from '$lib/components/InfoBox.svelte';
import { numberFormatter } from '$lib/utils';
import { createEventDispatcher } from 'svelte';
import { fly } from 'svelte/transition';
import { flip } from 'svelte/animate';
import tippy from '$lib/tippy';
import { getDocumentsWhere } from '$lib/query';
import { browser } from '$app/env';
import { getOptionIdsFromProperties } from '$lib/msb/cart';

export let cartItems = [];
export let menuItems = [];
export let validCart = false;

const dispatch = createEventDispatcher();

let outOfStockOptionIds = [];
if (browser) {
    getDocumentsWhere('options', (queryable) => queryable.where('stock', '==', false)).then((data) => {
        outOfStockOptionIds = data.map((doc) => doc.id);
    });
}

$: outOfStockItemIds = menuItems
    .filter((item) => !item.stock)
    .map((item) => item.id);
function isOutOfStock(cartItem, optionIds) {
    return outOfStockItemIds.includes(cartItem.itemId)
            || getOptionIdsFromProperties(cartItem.properties)
                .some((optionId) => optionIds.includes(optionId));
}

$: validCart = cartItems.some((cartItem) => !isOutOfStock(cartItem, outOfStockOptionIds));

const outOfStockTooltipProps = {
    content:
        'This item has been marked as <strong>out of stock</strong>, so if you proceed to checkout now it will be removed from your cart. You can either remove it from your cart yourself or wait until it becomes available again.',
    placement: 'left',
    arrow: true,
    duration: [100, 100],
    animation: 'shift-away-subtle',
    touch: ['hold', 450],
    trigger: 'mouseenter',
    maxWidth: 250,
    allowHTML: true,
};
</script>

<!-- Necessary duplicated out:fly here to fly even when cartItems becomes empty, removing this outer div -->
<div class="items" out:fly|local={{ duration: 250, x: -75 }}>
    {#each cartItems as item, i (i)}
        <div
            class="item"
            out:fly|local={{ duration: 250, x: -75 }}
            animate:flip={{ duration: 250, delay: 250 }}>
            <h2>
                {#if isOutOfStock(item, outOfStockOptionIds)}
                    <span
                        class="out-of-stock"
                        use:tippy={outOfStockTooltipProps}>Out of stock</span>
                {/if}
                {item.itemName}
            </h2>
            <h4>Price: ({numberFormatter.format(menuItems.find((menuItem) => menuItem.id == item.itemId).price)})</h4>
            {#if item.properties.length > 0}
                <h3>Options:</h3>
                <ul>
                    {#each item.properties as option, i (i)}
                        <li>
                            {option.name}
                            {#if outOfStockOptionIds.includes(option.value)}
                                <span
                                    class="out-of-stock">Out of stock</span>
                            {/if}
                        </li>
                    {/each}
                </ul>
            {/if}
            <h4 class="item-price">
                <InfoBox
                    content="The item price is the cost of the item plus the cost of any of its selected options." />
                Total Item Price: {numberFormatter.format(item.unitPrice)}
            </h4>
            <button on:click={() => dispatch('remove', item)}>
                <Icon name="remove-shopping-cart" width="16" height="16" />
                Remove from cart
            </button>
        </div>
    {/each}
</div>

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
}

h2,
h3,
h4 {
    margin-top: 15px;
}

.item-price {
    margin-top: auto;
}

button {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 0px 5px;
    font-size: 16px;
    cursor: pointer;
}

button:disabled {
    cursor: default;
}

span.out-of-stock {
    color: rgb(243, 101, 101);
    background-color: rgb(248, 211, 211);
    font-size: 18px;
    padding: 3px 5px;
    border-radius: 5px;
    vertical-align: middle;
    cursor: default;
}
</style>
