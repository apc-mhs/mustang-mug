<script>
import { createEventDispatcher } from 'svelte';

import EditableMenuItemOptions from './EditableMenuItemOptions.svelte';
import app from '$lib/firebase/firebase';
import tippy from '$lib/tippy';
import Button from '../utility/Button.svelte';

export let item;
export let options;
export let allOptions;

const dispatch = createEventDispatcher();

$: if (options) {
    item.options = options.map((option) =>
        app.firestore().doc('options/' + option.id)
    );
}

let { price, name, image, stock } = item;

function optionIdSorter(option1, option2) {
    return option1.id.localeCompare(option2.id);
}

$: options = options.sort(optionIdSorter);

$: changed =
    item.price !== price ||
    item.name !== name ||
    item.image !== image ||
    item.stock !== stock ||
    item.options.sort(optionIdSorter).some((option, i) => option.id !== options[i].id);
</script>

<div class="item" class:out-of-stock={!stock}>
    <img src="/{image}" alt="Picture of {image}" />
    <label>
        Item picture:
        <input bind:value={image} />
    </label>
    <h3>
        <label
            >Item name:
            <input bind:value={name} />
        </label>
    </h3>
    <p>
        <label>
            Item Price:
            <input bind:value={price} type="number" step="0.01" min="0" />
        </label>
    </p>
    <EditableMenuItemOptions message={'Options:'} bind:selectedOptions={options} options={allOptions} />

    <label>
        In Stock:
        <input type="checkbox" bind:checked={stock} />
    </label>

    <span use:tippy={!changed ? 'Make a change to save.' : undefined}>
        <Button
            on:click={() =>
                dispatch('save', { ...item, price, name, image, stock, options })}
            disabled={!changed}>Save</Button>
    </span>
</div>

<style>
h3 {
    margin-bottom: 0px;
}
.item {
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
