<script>
import { fade } from 'svelte/transition';

export let item;
export let quantity;
export let selected;

const maxPurchaseQuantity = 3;
</script>

<div class="item" class:out-of-stock={!item.stock} transition:fade={{ duration: 250 }}>
    <img src="{item.image}" alt="Picture of {item.name}">
    <label>
        <input
            id={item.id}
            type="checkbox"
            bind:checked={selected}
            disabled={!item.stock}
        />
        {item.name}
    </label>
    {#if selected}
        <label for={item.id + '-quantity'}>Quantity:</label>
        <select id={item.id + '-quantity'}>
            {#each new Array(maxPurchaseQuantity).fill(0) as _, i (i)}
                <option>{i + 1}</option>
            {/each}
        </select>
    {/if}
    {#if !item.stock}
        <p style="display: inline;">Out of stock</p>
    {/if}
</div>

<style>
.item {
    width: 150px;
    height: 200px;
    border: 1px solid rgb(71, 70, 70);
    border-radius: 5px;
    overflow: hidden;
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
input {
    margin-right: 5px;
}
</style>
