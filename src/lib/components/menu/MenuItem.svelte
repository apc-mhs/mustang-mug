<script>
import { numberFormatter } from '$lib/utils';

import MenuItemOptions from './MenuItemOptions.svelte';

export let item;
export let options = [];
export let quantity = 0;
export let cartItems = [];

const maxPurchaseQuantity = 3;

$: availableOptions = options.filter((option) => option.stock);

$: if (cartItems) {
    for (let i = 0; i < maxPurchaseQuantity; i++) {
        if (!cartItems[i] && i < quantity) {
            cartItems[i] = Object.assign({}, item);
            // Must manually set options to [] after copying because its reference is copied
            cartItems[i].options = [];
        } else if (i >= quantity) {
            cartItems[i] = null;
        }
    }
}
</script>

<div class="item" class:out-of-stock={!item.stock}>
    {#if !item.stock}
        <div class="parent">
            <img src="/menuItems/{item.image}" alt="Picture of {item.name}" />
            <div class="child">
                <img src="OOS.png" alt="out of stock X" />
            </div>
        </div>
    {:else}
        <img src="/menuItems/{item.image}" alt="Picture of {item.name}" />
    {/if}
    <h3>{item.name}</h3>
    <p>{numberFormatter.format(item.price)}</p>
    <label>
        Quantity:
        <select bind:value={quantity} disabled={!item.stock}>
            {#each new Array(maxPurchaseQuantity + 1).fill(0) as _, i (i)}
                <option value={i}>{i}</option>
            {/each}
        </select>
    </label>
    {#if availableOptions.length > 0}
        {#each new Array(quantity).fill(0) as _, i (i)}
            <MenuItemOptions
                optionsMessage={'Item ' + (i + 1) + ' options:'}
                options={availableOptions}
                bind:selectedOptions={cartItems[i].options} />
        {/each}
    {/if}
    {#if !item.stock}
        <p class="out-of-stock">Out of stock</p>
    {/if}
</div>

<style>
h3 {
    margin-bottom: 0px;
}
.item {
    width: 250px;
    height: auto;
    border: 1px solid rgb(71, 70, 70);
    background-color: white;
    border-radius: 5px;
    overflow: hidden;
    font-size: 16px;
    padding-bottom: 10px;
}
.item.out-of-stock > :not(.out-of-stock) {
    -webkit-filter: grayscale(50%); /* Safari 6.0 - 9.0 */
    filter: grayscale(50%);
    position: relative;
    top: 0;
    left: 0;
}
p.out-of-stock {
    color: rgb(253, 54, 54);
    font-weight: bold;
}
.item > div > img {
    top: 0;
    left: 0;
    width: 100%;
}
.item > img {
    top: 0;
    left: 0;
    width: 100%;
}

.item > div > div > img {
    top: 0;
    left: 0;
    width: 100%;
}

label {
    padding: 10px;
    /* background-color: rgba(253, 253, 253, 0.5); */
    display: block;
    color: rgba(0, 0, 0, 0.75);
}
label:hover {
    cursor: pointer;
}

.parent {
    position: relative;
}

.child {
    position: absolute;
    left: 0;
    top: 0;
}
</style>
