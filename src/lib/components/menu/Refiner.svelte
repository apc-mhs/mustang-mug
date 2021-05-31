<script>
export let refinedItems;

function alphabetize() {
    refinedItems = refinedItems.sort((a, b) => a.name.localeCompare(b.name));
}
</script>

<ul class="selection-items">
    <!-- I'm fairly certain these can be hard-coded and then do stuff with the script but I tried to set it up for scalability-->
    <h2>Refine Menu</h2>
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

<style>
.selection-items {
    position: sticky;
    top: calc(0.6em + var(--header-height));
    list-style: none;
    margin: 0.3em;
    padding: 0.3em;
    background-color: rgb(175, 175, 175);
    text-decoration: none;
    color: black;
    box-shadow: 0px 0px 3px 0px black;
}
li {
    margin-bottom: 0.5em;
}
.selection-items li:hover {
    background-color: #c5c5c5;
}
</style>
