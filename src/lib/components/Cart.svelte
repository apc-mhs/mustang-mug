<script>
import Icon from '$lib/components/Icon.svelte';
import InfoBox from '$lib/components/InfoBox.svelte';
import { numberFormatter } from '$lib/utils';
import { createEventDispatcher } from 'svelte';
import { fade } from 'svelte/transition';
import { flip } from 'svelte/animate';

export let items = [];

const dispatch = createEventDispatcher();
</script>

<div class="items">
    {#each items as item, i (i)}
        <div class="item" out:fade={{ duration: 150 }} animate:flip={{ duration: 150, delay: 150 }}>
            <h2>{item.itemName}</h2>
            <h3>Options:</h3>
            <ul>
                {#each item.properties as option, i (i)}
                    <li>{option.name}</li>
                {/each}
            </ul>
            <h4>
                Item price
                <InfoBox>The item price is the cost of the item plus the cost of any of its selected options.</InfoBox>
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

h2, h3, h4 {
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
</style>