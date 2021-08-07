<script>
import { slide } from 'svelte/transition';
import { fade } from 'svelte/transition';
import { flip } from 'svelte/animate';
import AutocompleteChooser from '../input/AutocompleteChooser.svelte';
import Option from './Option.svelte';

export let selectedOptions;
export let options = [];
export let popperBoundingElement;

let chooser;

function remove(optionIndex) {
    chooser.remove(optionIndex);
}
const outOfStockMessage =
    'This option is marked out of stock. It won\'t appear on the menu.';
const removeOptionMessage = 'Remove this option';
</script>

<div class="item-options" transition:slide|local>
    <AutocompleteChooser
        {popperBoundingElement}
        placeholder="Search options"
        options={options}
        bind:this={chooser}
        bind:selectedOptions
        let:option>
        <Option {option} iconName={option.stock ? 'check' : 'close'}/>
    </AutocompleteChooser>
    {#if selectedOptions.length > 0}
        <div class="options-list">
            {#each selectedOptions as option (option.id)}
                <div animate:flip={{ duration: 250 }}>
                    <Option
                        {option}
                        iconName={option.stock ? 'check' : 'close'}
                        hoverMessage={option.stock ? removeOptionMessage : outOfStockMessage}
                        on:click={() => remove(option.id)}/>
                </div>
            {/each}
        </div>
    {:else}
        <p in:fade|local={{ duration: 250, delay: 250 }}>No options selected</p>
    {/if}
</div>

<style>
.item-options {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 5px 10px;
}
.item-options > p {
    margin-right: 5px;
}
.item-options > * {
    flex: 0 0 auto;
    margin-top: 5px;
}
.options-list {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 3px 5px;
}
</style>
