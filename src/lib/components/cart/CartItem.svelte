<script>
import tippy from '$lib/tippy';
import { numberFormatter } from '$lib/utils';
import { createEventDispatcher } from 'svelte';

import { fly } from 'svelte/transition';
import Button from '../input/Button.svelte';
import Icon from '../utility/Icon.svelte';
import InfoBox from '../utility/InfoBox.svelte';

export let item;
export let menuItem;
export let outOfStock = false;
export let outOfStockOptionIds = [];

const dispatch = createEventDispatcher();

const outOfStockTooltipProps = {
    content: 'This item will be removed from your cart upon checkout',
    placement: 'left',
};
</script>

<div class="item" out:fly|local={{ duration: 250, x: -75 }}>
    <h2>
        {#if outOfStock}
            <span class="out-of-stock" use:tippy={outOfStockTooltipProps}
                >Out of stock</span>
        {/if}
        {item.itemName}
    </h2>
    <p>
        Price: ({numberFormatter.format(menuItem.price)})
    </p>
    {#if item.properties.length > 0}
        <h3>Options:</h3>
        <ul>
            {#each item.properties as option, i (i)}
                <li>
                    {option.name}
                    {#if outOfStockOptionIds.includes(option.value)}
                        <span class="out-of-stock">Out of stock</span>
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
            content="The cost of the item and all its options times the selected quantity" />
        Total: {numberFormatter.format(item.unitPrice * item.quantity)}
    </h4>
    <Button on:click={() => dispatch('remove', item)}>
        <Icon name="remove-shopping-cart" width="20" height="20" />
        Remove from cart
    </Button>
</div>

<style>
.item {
    display: flex;
    flex-flow: column nowrap;
    border-radius: 5px;
    background-color: white;
    max-width: 100%;
    width: 500px;
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
</style>
