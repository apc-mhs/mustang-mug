<script>
export let refinedItems;

function alphabetize() {
    refinedItems = refinedItems.sort((a, b) => a.name.localeCompare(b.name));
}
</script>

<div class="refiner">
    <h2>Refine Menu</h2>
    <ul class="selection-items">
        <!-- I'm fairly certain these can be hard-coded and then do stuff with the script but I tried to set it up for scalability-->
        <li>
            <input type="radio" id="hot" name="temperature" />
            <label for="hot">Hot</label><br />
            <input type="radio" id="cold" name="temperature" />
            <label for="cold">Cold</label><br />
        </li>
        <hr />
        <li>
            <input type="radio" id="food" name="consumable-type" />
            <label for="food">Food</label><br />
            <input type="radio" id="beverage" name="consumable-type" />
            <label for="beverage">Beverage</label><br />
        </li>
        <hr />
        <li>
            <input type="checkbox" id="gluten" />
            <label for="gluten">Gluten Free</label>
        </li>
        <li>
            <input type="checkbox" id="lactose" />
            <label for="lactose">Lactose Free</label>
        </li>
        <li>
            <input type="checkbox" id="nut" />
            <label for="nut">Nut Free</label>
        </li>
        <hr />
        <li>
            <p>Price Filter</p>
            <input type="range" min="1" max="100" value="100" />
        </li>
        <hr />
        <li>
            <input type="checkbox" id="item1" on:click={alphabetize} />
            <label for="item1">Alphabetize</label>
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
}
.selection-items {
    list-style: none;
    padding: 0px;
    text-decoration: none;
}
li {
    margin-bottom: 0.5em;
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
</style>
