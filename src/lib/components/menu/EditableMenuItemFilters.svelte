<script>
import { slide } from 'svelte/transition';
import { fade } from 'svelte/transition';
import { flip } from 'svelte/animate';
import AutocompleteChooser from '../input/AutocompleteChooser.svelte';
import Option from './Option.svelte';

export let selectedFilters;
export let filters = {};
export let popperBoundingElement;

let chooser;
let selectedOptions = filtersToOptions(filters).filter(({id}) => filters[id]);

$: filterObjects = filtersToOptions(filters);
const getFilters = () => filters;
$: {
    // unselectedFilters is a duplicate of filters with all filters set to false
    const unselectedFilters = {};
    Object.keys(getFilters()).forEach((k) => unselectedFilters[k] = false);
    selectedFilters = {...unselectedFilters, ...optionsToFilters(selectedOptions)};
}

function filtersToOptions(filters) {
    return Object.keys(filters).map((filterName) => { return {id: filterName, name: filterName}; });
}

function optionsToFilters(options) {
    const filters = {};
    for (let option of options) {
        filters[option.name] = true;
    }
    return filters;
}

function remove(optionIndex) {
    chooser.remove(optionIndex);
}

const removeOptionMessage = 'Remove this filter';
</script>

<div class="item-options" transition:slide|local>
    <AutocompleteChooser
        {popperBoundingElement}
        placeholder="Search filters"
        options={filterObjects}
        bind:this={chooser}
        bind:selectedOptions
        let:option>
        <Option {option}/>
    </AutocompleteChooser>
    {#if selectedOptions.length > 0}
        <div class="options-list">
            {#each selectedOptions as option (option.id)}
                <div animate:flip={{ duration: 250 }}>
                    <Option
                        {option}
                        hoverMessage={removeOptionMessage}
                        on:click={() => remove(option.id)}/>
                </div>
            {/each}
        </div>
    {:else}
        <p in:fade|local={{ duration: 250, delay: 250 }}>No filters selected</p>
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
