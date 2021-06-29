<script>
import { slide } from 'svelte/transition';
import Icon from '$lib/components/utility/Icon.svelte';
import tippy from '$lib/tippy';
import AutocompleteInput from '$lib/components/input/AutocompleteInput.svelte';
import { fade } from 'svelte/transition';

export let selectedOptions;
export let options = [];

$: unselectedOptions = options.filter(
    (option) => !selectedOptions.includes(option)
);

function remove(optionIndex) {
    selectedOptions.splice(optionIndex, 1);
    selectedOptions = selectedOptions;
}
const outOfStockMessage =
    'This option is marked out of stock. Click to remove it.';
const removeOptionMessage = 'Remove this option';
</script>

<div class="item-options" transition:slide|local>
    <AutocompleteInput
        options={unselectedOptions}
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
    </AutocompleteInput>
    {#if selectedOptions.length > 0}
        <div class="options-list">
            {#each selectedOptions as option, i (i)}
                <div
                    class="option"
                    on:click={() => remove(i)}
                    transition:fade|local={{ duration: 250 }}
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
        <p transition:fade|local={{ duration: 250, delay: 250 }}>No options selected</p>
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
