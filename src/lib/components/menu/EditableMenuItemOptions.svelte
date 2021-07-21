<script>
import { slide } from 'svelte/transition';
import Icon from '$lib/components/utility/Icon.svelte';
import tippy from '$lib/tippy';
import { fade } from 'svelte/transition';
import { flip } from 'svelte/animate';
import AutocompleteChooser from '../input/AutocompleteChooser.svelte';

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
        <div class="option" class:out-of-stock={!option.stock}>
            {#if option.stock}
                <Icon name="check" width="16" height="16" />
            {:else}
                <Icon name="close" width="16" height="16" />
            {/if}
            <p>{option.name}</p>
        </div>
    </AutocompleteChooser>
    {#if selectedOptions.length > 0}
        <div class="options-list">
            {#each selectedOptions as option (option.id)}
                <div
                    class="option"
                    on:click={() => remove(option.id)}
                    transition:fade|local={{ duration: 250 }}
                    animate:flip={{ duration: 250 }}
                    use:tippy={!option.stock
                        ? outOfStockMessage
                        : removeOptionMessage}
                    class:out-of-stock={!option.stock}>
                    {#if option.stock}
                        <Icon name="check" width="16" height="16" />
                    {:else}
                        <Icon name="close" width="16" height="16" />
                    {/if}
                    <p>{option.name}</p>
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
.option {
    box-sizing: content-box;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    gap: 0px 2px;
    border: 2px solid currentColor;
    border-radius: 20px;
    height: 16px;
    color: white;
    font-size: 13px;
    padding: 5px 16px;
    color: gray;
    cursor: pointer; /* Transition function equal to cubicOut (in horizontalSlide) */
    transition: padding 400ms cubic-bezier(0.215, 0.61, 0.355, 1);
    color: skyblue; /* Set padding left-right to take off 16 (width of checkmark) total pixels */
    padding: 5px 8px;
}
.option.out-of-stock {
    color: red;
}
</style>
