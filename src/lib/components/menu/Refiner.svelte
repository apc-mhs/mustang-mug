<script>
export let refinedItems;

function alphabetize() {
    refinedItems = refinedItems.sort((a, b) => a.name.localeCompare(b.name));
}

function sortByPrice() {
    refinedItems = refinedItems.sort((a, b) => a.price - b.price);
}
</script>

<div class="refiner">
    <h2>Refine Menu</h2>
    <h4>Filter</h4>
    <ul class="selection-items">
        <li>
            <label>
                <input type="radio" name="temperature" />
                Hot
            </label>
        </li>
        <li>
            <label>
                <input type="radio" name="temperature" />
                Cold
            </label>
        </li>
        <hr />
        <li>
            <label>
                <input type="radio" name="consumable-type" />
                Food
            </label>
        </li>
        <li>
            <label>
                <input type="radio" name="consumable-type" />
                Beverage
            </label>
        </li>
        <hr />
        <li>
            <label>
                <input type="checkbox" />
                Gluten Free
            </label>
        </li>
        <li>
            <label>
                <input type="checkbox" />
                Lactose Free
            </label>
        </li>
        <li>
            <label>
                <input type="checkbox" />
                Nut Free
            </label>
        </li>
        <hr />
        <li>
            <label>
                <input type="checkbox" />
                In Stock
            </label>
        </li>
        <hr />
        <li>
            <p class="label">Price Filter</p>
            <input type="range" min="1" max="100" value="100" />
        </li>
    </ul>
    <h4>Sort</h4>
    <ul class="selection-items">
        <li>
            <label>
                <input
                    type="radio"
                    on:click={alphabetize}
                    checked
                    name="sort" />
                Alphabetical
            </label>
        </li>
        <li>
            <label>
                <input type="radio" on:click={sortByPrice} name="sort" />
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
h4 {
    text-align: center;
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
