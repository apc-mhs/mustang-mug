<script>
import Button from '../input/Button.svelte';
import { slide } from 'svelte/transition';

export let refinedItems;
export let items;

let filters = [];

const noFilter = (_) => true;
let temperatureFilter = noFilter;
let itemTypeFilter = noFilter;
let priceFilter = noFilter;
let groupedFilters = [];

$: filters = [
    temperatureFilter,
    itemTypeFilter,
    priceFilter,
    ...groupedFilters,
];
$: refinedItems = sortFunction(filter(items, filters));

let sortFunction = alphabetize;

function alphabetize(items) {
    return items.sort((a, b) => a.name.localeCompare(b.name));
}

function filter(items, filters) {
    for (let filter of filters) {
        items = items.filter(filter);
    }
    return items;
}
</script>

<div class="refiner">
    <h2>Refine Menu</h2>
    <h3>Filter</h3>
    <ul class="selection-items">
        <li>
            <label>
                <input
                    type="radio"
                    name="temperature"
                    value={(item) => item.filters.hot}
                    bind:group={temperatureFilter} />
                Hot
            </label>
        </li>
        <li>
            <label>
                <input
                    type="radio"
                    name="temperature"
                    value={(item) => item.filters.cold}
                    bind:group={temperatureFilter} />
                Cold
            </label>
        </li>
        {#if temperatureFilter !== noFilter}
            <div transition:slide style="margin: 5px;">
                <Button on:click={() => (temperatureFilter = noFilter)}
                    >Clear selection</Button>
            </div>
        {/if}
        <hr />
        <li>
            <label>
                <input
                    type="radio"
                    name="item-type"
                    value={(item) => item.filters.food}
                    bind:group={itemTypeFilter} />
                Food
            </label>
        </li>
        <li>
            <label>
                <input
                    type="radio"
                    unselectable="true"
                    name="item-type"
                    value={(item) => item.filters.drink}
                    bind:group={itemTypeFilter} />
                Beverage
            </label>
        </li>
        {#if itemTypeFilter !== noFilter}
            <div transition:slide style="margin: 5px;">
                <Button on:click={() => (itemTypeFilter = noFilter)}
                    >Clear selection</Button>
            </div>
        {/if}
        <hr />
        <li>
            <label>
                <input
                    type="checkbox"
                    value={(item) => item.filters.gluten_free}
                    bind:group={groupedFilters} />
                Gluten Free
            </label>
        </li>
        <li>
            <label>
                <input
                    type="checkbox"
                    value={(item) => item.filters.lactose_free}
                    bind:group={groupedFilters} />
                Lactose Free
            </label>
        </li>
        <li>
            <label>
                <input
                    type="checkbox"
                    value={(item) => item.filters.nut_free}
                    bind:group={groupedFilters} />
                Nut Free
            </label>
        </li>
        <hr />
        <li>
            <label>
                <input
                    type="checkbox"
                    value={(item) => item.stock}
                    bind:group={groupedFilters} />
                In Stock
            </label>
        </li>
        <hr />
        <li>
            <p class="label">Price Filter</p>
            <input
                type="range"
                min="1"
                max="9"
                value="9"
                list="prices"
                style="width: 100%;"
                on:change={(e) =>
                    (priceFilter = (item) =>
                        (item.price <= e.target.value) ||
                        e.target.value === 9)} />
            <datalist
                id="prices"
                style="display: flex; flex-flow: row nowrap; justify-content: space-between;">
                {#each new Array(8).fill(null) as _, i (i)}
                    <option value={i + 1} label={'$' + (i + 1)} />
                {/each}
                <option value={9} label="$9+" />
            </datalist>
        </li>
    </ul>
    <h3>Sort</h3>
    <ul class="selection-items">
        <li>
            <label>
                <input
                    type="radio"
                    checked
                    value={alphabetize}
                    bind:group={sortFunction} />
                Alphabetical
            </label>
        </li>
        <li>
            <label>
                <input
                    type="radio"
                    value={(items) => items.sort((a, b) => a.price - b.price)}
                    bind:group={sortFunction} />
                Price
            </label>
        </li>
    </ul>
</div>

<style>
.refiner {
    background-color: rgb(175, 175, 175);
    text-decoration: none;
    color: black;
    box-shadow: 0px 0px 3px 0px black;
    padding: 5px;
    min-height: 100%;
}
.selection-items {
    list-style: none;
    padding: 0px;
    text-decoration: none;
}
h3 {
    margin-bottom: 5px;
}
li {
    margin-bottom: 2px;
}
hr {
    border: 0;
    height: 1px;
    background-image: linear-gradient(
        to right,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.75),
        rgba(0, 0, 0, 0)
    );
    margin-bottom: 5px;
}
.selection-items li:hover {
    background-color: #c5c5c5;
}
label,
.label {
    display: inline-block;
    width: 100%;
    cursor: pointer;
    padding: 3px 5px;
}
</style>
