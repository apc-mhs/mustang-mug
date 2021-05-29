<script>
import { createEventDispatcher } from 'svelte';

import EditableMenuItemOptions from './EditableMenuItemOptions.svelte';

export let item;

const dispatch = createEventDispatcher();

</script>

<div class="item" class:out-of-stock={!item.stock}>
    <img src='/{item.image}' alt="Picture of {item.name}" />
    <label>
        Item picture:
        <input bind:value={item.image}>
    </label>
    <h3>
        <label>Item name: 
            <input bind:value={item.name}>
        </label>
    </h3>
    <p>
        <label>
            Item Price:
            <input bind:value={item.price} type="number" step="0.01">
        </label>
    </p>
    <EditableMenuItemOptions
        message={'Options:'}
        options={item.options || []} />
    
    <label>
        In Stock:
        <input type="checkbox" bind:checked={item.stock}>
    </label>

    <button on:click={() => dispatch('save')}>Save</button>
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
