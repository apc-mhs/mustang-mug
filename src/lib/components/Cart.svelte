<script>
import Icon from '$lib/components/Icon.svelte';
import InfoBox from '$lib/components/InfoBox.svelte';
import { numberFormatter } from '$lib/utils';
import { createEventDispatcher } from 'svelte';
import { fade } from 'svelte/transition';
import { flip } from 'svelte/animate';
import tippy from '$lib/tippy';
import app from '$lib/firebase/firebase';
import { getDocumentsWhere } from '$lib/query';

export let items = [];
export let menuItems = [];

const dispatch = createEventDispatcher();

let outOfStockOptionsIds = [];
if (browser) {
    getDocumentsWhere('options', (queryable) => queryable.where('stock', '==', false)).get().then((data) => {
        outOfStockOptionsIds = data.docs.map((doc) => doc.id);
    });
}

$: console.log(outOfStockOptionsIds);
$: outOfStock = menuItems
    .filter((item) => !item.stock || item.options.some((option) => outOfStockOptionsIds.includes(option.id)))
    .map((item) => item.id);

const outOfStockTooltipProps = {
    content:
        'This item has been marked as <strong>out of stock</strong>, so if you proceed to checkout now it will not be available to purchase. You can either remove it from your cart or wait until it becomes available again.',
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

<div class="items">
    {#each items as item, i (i)}
        <div
            class="item"
            out:fade={{ duration: 150 }}
            animate:flip={{ duration: 150, delay: 150 }}>
            <h2>
                {#if outOfStock.includes(item.itemId)}
                    <span
                        class="out-of-stock"
                        use:tippy={outOfStock.includes(item.itemId)
                            ? outOfStockTooltipProps
                            : undefined}>Out of stock</span>
                {/if}
                {item.itemName}
            </h2>
            <h3>Options:</h3>
            <ul>
                {#each item.properties as option, i (i)}
                    <li>{option.name}</li>
                {/each}
            </ul>
            <h4>
                Item price
                <InfoBox
                    content="The item price is the cost of the item plus the cost of any of its selected options." />
                : {numberFormatter.format(item.unitPrice)}
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
    gap: 0px 15px;
}

.item {
    border-radius: 5px;
    background-color: white;
    max-width: 100%;
    width: 600px;
    height: 250px;
    padding: 10px 20px;
}

h2,
h3,
h4 {
    margin-top: 15px;
}

button {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 0px 5px;
    font-size: 16px;
    cursor: pointer;
}

span.out-of-stock {
    color: rgb(243, 101, 101);
    background-color: rgb(248, 211, 211);
    font-size: 18px;
    padding: 3px 5px;
    border-radius: 5px;
    vertical-align: middle;
}
</style>
