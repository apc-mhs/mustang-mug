<script>
import { createEventDispatcher } from 'svelte';

import EditableMenuItemOptions from './EditableMenuItemOptions.svelte';
import tippy from '$lib/tippy';
import Button from '$lib/components/input/Button.svelte';
import Input from '../input/Input.svelte';

export let item;
export let options = [];
export let allOptions;

const dispatch = createEventDispatcher();

let itemElement;
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
    item.options.length !== options.length ||
    !item.options
        .sort(optionIdSorter)
        .every((option, i) => option.id === (options[i] && options[i].id));

function beforeUnload(e) {
    if (!changed) return;

    e.returnValue = 'Unsaved';
    return e.returnValue;
}
</script>

<svelte:window on:beforeunload={beforeUnload}/>

<div class="item" class:out-of-stock={!stock} bind:this={itemElement}>
    <img src="/menuItems/{image}" alt="Picture of {image}" />
    <label>
        Picture:
        <Input bind:value={image} --font-size="16px" />
    </label>
    <label>
        Name:
        <Input bind:value={name} --font-size="16px" />
    </label>
    <label>
        Price:
        <input bind:value={price} type="number" step="0.01" min="0" />
    </label>
    <EditableMenuItemOptions
        popperBoundingElement={itemElement}
        message={'Options:'}
        bind:selectedOptions={options}
        options={allOptions} />

    <label class="in-stock-label">
        In Stock:
        <input type="checkbox" bind:checked={stock} />
    </label>

    <div class="button-row">
        <span use:tippy={!changed ? 'Make a change to save' : undefined}>
            <Button
                on:click={() =>
                    dispatch('save', {
                        ...item,
                        price,
                        name,
                        image,
                        stock,
                        options,
                    })}
                disabled={!changed}>Save</Button>
        </span>
        <span use:tippy={item.stock ? 'Item must be out of stock before deletion' : undefined}>
            <Button
                disabled={item.stock}
                on:click={() => dispatch('delete', item.id)}>
                Delete
            </Button>
        </span>
    </div>
</div>

<style>
h3 {
    margin-bottom: 0px;
}
.item {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
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
    display: flex;
    width: 100%;
    flex-flow: row nowrap;
    align-items: center;
    gap: 5px;
    color: rgba(0, 0, 0, 0.75);
}
label:hover {
    cursor: pointer;
}
.in-stock-label {
    align-self: center;
    width: auto;
}
.button-row {
    display: flex;
    flex-flow: row nowrap;
    gap: 10px;
    align-self: center;
}
</style>
