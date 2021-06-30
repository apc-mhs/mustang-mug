<script>
import { createEventDispatcher } from 'svelte';

import tippy from '$lib/tippy';
import Button from '$lib/components/input/Button.svelte';

export let option;

const dispatch = createEventDispatcher();

let { price, name, stock } = option;

$: changed =
    option.price !== price || option.name !== name || option.stock !== stock;
</script>

<div class="option" class:out-of-stock={!stock}>
    <h3>
        <label
            >Option name:
            <input bind:value={name} />
        </label>
    </h3>
    <p>
        <label>
            Option Price:
            <input bind:value={price} type="number" step="0.01" min="0" />
        </label>
    </p>

    <label>
        In Stock:
        <input type="checkbox" bind:checked={stock} />
    </label>

    <span use:tippy={!changed ? 'Make a change to save.' : undefined}>
        <Button
            on:click={() =>
                dispatch('save', {
                    ...option,
                    price,
                    name,
                    stock,
                })}
            disabled={!changed}>Save</Button>
    </span>
</div>

<style>
h3 {
    margin-bottom: 0px;
}
.option {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    width: 250px;
    height: auto;
    border: 1px solid rgb(71, 70, 70);
    background-color: white;
    border-radius: 5px;
    overflow: hidden;
    font-size: 16px;
    padding-bottom: 10px;
}
.option.out-of-stock > :not(.out-of-stock) {
    opacity: 0.75;
}
p.out-of-stock {
    color: rgb(253, 54, 54);
    font-weight: bold;
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
