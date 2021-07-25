<script>
import { createEventDispatcher } from 'svelte';

import tippy from '$lib/tippy';
import Button from '$lib/components/input/Button.svelte';
import Input from '../input/Input.svelte';

export let option;

const dispatch = createEventDispatcher();

let { price, name, stock } = option;

$: changed =
    option.price !== price || option.name !== name || option.stock !== stock;
</script>

<div class="option" class:out-of-stock={!stock}>
    <label>
        Option name:
        <Input bind:value={name} --font-size="16px" />
    </label>
    <label>
        Option Price:
        <Input bind:value={price} type="number" step="0.01" min="0" />
    </label>

    <label>
        In Stock:
        <input type="checkbox" bind:checked={stock} />
    </label>

    <div class="button-row">
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
        <span use:tippy={option.stock ? 'Item must be out of stock before deletion' : undefined}>
            <Button
                disabled={option.stock}
                on:click={() => dispatch('delete', option.id)}>
                Delete
            </Button>
        </span>
    </div>
</div>

<style>
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
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 5px;
    color: rgba(0, 0, 0, 0.75);
}
label:hover {
    cursor: pointer;
}
.button-row {
    display: flex;
    flex-flow: row nowrap;
    gap: 10px;
    align-self: center;
}
</style>
