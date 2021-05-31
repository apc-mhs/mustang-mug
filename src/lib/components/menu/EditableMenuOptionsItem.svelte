<script>
import tippy from '$lib/tippy';
import { createEventDispatcher } from 'svelte';

export let option;

const dispatch = createEventDispatcher();

let { name, price, stock } = option;

$: changed =
    item.price !== price ||
    item.name !== name ||
    item.stock !== stock;

</script>

<div class="item" class:out-of-stock={!stock}>
    <h3>
        <label>Option name:
            <input bind:value={name} />
        </label>
    </h3>
    <p>
        <label>
            Option Price:
            <input bind:value={price} type="number" step="0.01" />
        </label>
    </p>

    <label>
        In Stock:
        <input type="checkbox" bind:checked={stock} />
    </label>

    <span use:tippy={!changed ? 'Make a change to save.' : undefined}>
        <button
            on:click={() =>
                dispatch('save', {
                    ...option,
                    price,
                    name,
                    stock,
                })}
            disabled={!changed}>Save</button>
    </span>
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
    opacity: 0.75;
}
p.out-of-stock {
    color: rgb(253, 54, 54);
    font-weight: bold;
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
