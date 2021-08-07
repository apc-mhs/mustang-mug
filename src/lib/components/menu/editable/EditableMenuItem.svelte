<script>
import { createEventDispatcher, onMount, tick } from 'svelte';

import EditableMenuItemOptions from './EditableMenuItemOptions.svelte';
import tippy from '$lib/tippy';
import Button from '$lib/components/input/Button.svelte';
import Input from '$lib/components/input/Input.svelte';
import EditableMenuItemFilters from './EditableMenuItemFilters.svelte';

export let item;
export let options = [];
export let allOptions = [];

const allFilters = item && item.filters;
const dispatch = createEventDispatcher();

let itemElement;
let { price, name, image, stock, filters } = item;

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
        .every((option, i) => option.id === (options[i] && options[i].id)) ||
    !Object.keys(item.filters).every(
        (key) => item.filters[key] === filters[key]
    );

$: removeDeletedOptions(allOptions);

async function removeDeletedOptions(allOptions) {
    const allOptionIds = allOptions.map((option) => option.id);
    // Wait for other state updates, specifically those in the autocomplete chooser which will update "options"
    await tick();
    if (item.options.some((option) => !allOptionIds.includes(option.id))) {
        save();
    }
}

function save() {
    dispatch('save', {
        ...item,
        price,
        name,
        image,
        stock,
        options,
        filters,
    });
}

function beforeUnload(e) {
    if (!changed) return;

    e.returnValue = 'Unsaved';
    return e.returnValue;
}
</script>

<svelte:window on:beforeunload={beforeUnload} />

<div class="item" class:out-of-stock={!stock} bind:this={itemElement}>
    <img src="/menuItems/{image}" alt="Picture of {image}" />
    <section class="inputs">
        <span>
            <Input label="Picture:" bind:value={image} --font-size="16px" />
        </span>
        <span>
            <Input label="Name:" bind:value={name} --font-size="16px" />
        </span>
        <span>
            <Input label="Price:" bind:value={price} type="number" step="0.01" min="0" />
        </span>
    </section>
    <section>
        <EditableMenuItemOptions
            popperBoundingElement={itemElement}
            bind:selectedOptions={options}
            options={allOptions} />
        <EditableMenuItemFilters
            popperBoundingElement={itemElement}
            bind:selectedFilters={filters}
            filters={allFilters} />
    </section>
    <section>
        <span class="in-stock-label">
            In Stock:
            <input type="checkbox" bind:checked={stock} />
        </span>
    </section>
    <section>
        <div class="button-row">
            <span use:tippy={!changed ? 'Make a change to save' : undefined}>
                <Button on:click={save} disabled={!changed}>Save</Button>
            </span>
            <span
                use:tippy={item.stock
                    ? 'Item must be out of stock before deletion'
                    : undefined}>
                <Button
                    disabled={item.stock}
                    on:click={() => dispatch('delete', item.id)}>
                    Delete
                </Button>
            </span>
        </div>
    </section>
</div>

<style>
.item {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    width: 250px;
    height: auto;
    border: 1px solid rgb(71, 70, 70);
    background-color: white;
    border-radius: 5px;
    font-size: 16px;
    padding-bottom: 10px;
}
.item.out-of-stock > :not(.out-of-stock) {
    opacity: 0.75;
}
.item > img {
    width: 100%;
}
section {
    margin: 5px 0px;
    width: 100%;
}
section.inputs > span {
    padding: 10px;
    /* background-color: rgba(253, 253, 253, 0.5); */
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 5px;
    color: rgba(0, 0, 0, 0.75);
    align-self: center;
}
.in-stock-label {
    align-self: center;
    width: auto;
    padding: 5px;
}
.button-row {
    display: flex;
    flex-flow: row nowrap;
    gap: 10px;
    align-items: center;
    justify-content: center;
}
</style>
