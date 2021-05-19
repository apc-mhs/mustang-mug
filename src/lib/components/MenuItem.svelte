<script>
import { sleep } from "$lib/utils";

import MenuItemOptions from "./MenuItemOptions.svelte";

export let item;
export let quantity = 0;
export let cartItems = [];

const maxPurchaseQuantity = 3;
const numberFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

let itemElem;
$: {
    for (let i = 0; i < quantity; i++) {
        if (!cartItems[i]) {

            cartItems[i] = Object.assign({}, item);
            // Must manually set options to {} after copying because its reference is copied
            cartItems[i].options = [];
        }
    }
}

$: if (itemElem && quantity !== null) {
    sleep(50).then(() => {
        if (!itemElem) return;
        itemElem.style.maxHeight = itemElem.scrollHeight + 'px';
    });
}
</script>

<div class="item" class:out-of-stock={!item.stock} bind:this={itemElem}>
    <img src="{item.image}" alt="Picture of {item.name}">
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
    {#each new Array(quantity).fill(0) as _, i (i)}
        <MenuItemOptions
            message={'Item ' + (i + 1) + ' options:'}
            options={item.options || []}
            bind:selectedOptions={cartItems[i].options} />
    {/each}
    {#if !item.stock}
        <p style="display: inline;">Out of stock</p>
    {/if}
</div>

<style>
h3 {
    margin-bottom: 0px;
}
.item {
    width: 200px;
    height: auto;
    border: 1px solid rgb(71, 70, 70);
    background-color: white;
    border-radius: 5px;
    overflow: hidden;
    font-size: 16px;
    max-height: 275px;
    padding-bottom: 10px;
    transition: max-height 250ms ease;
}
.item.out-of-stock {
    filter: grayscale(0.5);
}
.item > img {
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
</style>
