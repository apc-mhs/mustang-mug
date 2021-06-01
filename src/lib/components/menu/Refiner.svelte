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
            <input type="checkbox" id="item1" on:click={alphabetize} />
            <label for="item1">Alphabetize</label>
        </li>
        <li>
            <input type="checkbox" id="item2" />
            <label for="item2">Selection 2</label>
        </li>
        <li>
            <input type="checkbox" id="item2" />
            <label for="item2">Selection 3</label>
        </li>
        <li>
            <p>Scale</p>
            <input type="range" min="1" max="100" value="100" />
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
.selection-items li:hover {
    background-color: #c5c5c5;
}
</style>
