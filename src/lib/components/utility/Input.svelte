<script>
import { createEventDispatcher } from "svelte";


export let value = '';
export let disabled = false;
export let type = 'text';
export let placeholder = '';
export let label = '';
export let pattern = undefined;
export let input;

const dispatch = createEventDispatcher();

function handleInput(e) {
    value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
    dispatch('input', e);
}
</script>

{#if label}
    <label>
        {label}
        <input
            {type}
            {placeholder}
            {disabled}
            {value}
            {pattern}
            bind:this={input}
            on:input={handleInput}
            on:focus
            on:keydown />
    </label>
{:else}
    <input
        {type}
        {placeholder}
        {disabled}
        {value}
        {pattern}
        bind:this={input}
        on:input={handleInput}
        on:focus
        on:keydown />
{/if}

<style>
input {
    font-size: 18px;
    padding: 5px 10px;
    border-radius: 3px;
    border: none;
    outline: none;
    width: var(--width, 150px);
    --input-status-color: gray;
    box-shadow: 0px 0px 0px 1px var(--input-status-color, gray);
}

input:focus {
    --input-status-color: blue;
}

input:invalid {
    --input-status-color: red;
}
</style>
