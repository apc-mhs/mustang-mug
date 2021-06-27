<script>
export let refinedItems;

function alphabetize() {
    refinedItems = refinedItems.sort((a, b) => a.name.localeCompare(b.name));
}

function sortByPrice() {
    refinedItems = refinedItems.sort((a, b) => a.price - b.price);
}

function temperatureRadioChoice(temperature) {
    let choice = temperature;
    if ((choice = 'hot')) {
        //only show hot items
    } else if ((choice = 'cold')) {
        //only show cold items
    }
}

function stateRadioChoice(state) {
    let choice = state;
    if ((choice = 'food')) {
        //only show food
    } else if ((choice = 'beverage')) {
        //only show beverages
    }
}

//When one checkbox becomes clicked, everything that DOESNT fall under that checkbox needs to be hidden

//unfortunately i never got this function to work in high school :/
function showGF() {
    //show gluten free items
}

function showLF() {
    //show lactose free items
}

function showNF() {
    //show nut free items
}

function showInStock() {
    //Only show in stock items
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
                    on:click={temperatureRadioChoice('hot')}
                    name="temperature" />
                Hot
            </label>
        </li>
        <li>
            <label>
                <input
                    type="radio"
                    on:click={temperatureRadioChoice('cold')}
                    name="temperature" />
                Cold
            </label>
        </li>
        <hr />
        <li>
            <label>
                <input
                    type="radio"
                    on:click={stateRadioChoice('food')}
                    name="consumable-type" />
                Food
            </label>
        </li>
        <li>
            <label>
                <input
                    type="radio"
                    on:click={stateRadioChoice('beverage')}
                    name="consumable-type" />
                Beverage
            </label>
        </li>
        <hr />
        <li>
            <label>
                <input type="checkbox" on:click={showGF()} />
                Gluten Free
            </label>
        </li>
        <li>
            <label>
                <input type="checkbox" on:click={showLF()} />
                Lactose Free
            </label>
        </li>
        <li>
            <label>
                <input type="checkbox" on:click={showNF()} />
                Nut Free
            </label>
        </li>
        <hr />
        <li>
            <label>
                <input type="checkbox" on:click={showInStock()} />
                In Stock
            </label>
        </li>
        <hr />
        <li>
            <p class="label">Price Filter</p>
            <input type="range" min="1" max="100" value="100" />
        </li>
    </ul>
    <h3>Sort</h3>
    <ul class="selection-items">
        <li>
            <label>
                <input type="radio" on:click={alphabetize} name="sort" />
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
