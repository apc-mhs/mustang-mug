<script>
import { browser } from "$app/env";

import EditableMenuItem from '$lib/components/menu/EditableMenuItem.svelte';
import Menu from "$lib/components/menu/Menu.svelte";
import { getDocuments } from "$lib/query";


let menuItems = [];
if (browser) {
    getDocuments('items').then((items) => menuItems = items);
}

function save(item) {
    // TODO: Implement item saving
    // Update the menu item + options in firestore 
    // And update the menu item in the main menuItems array
}
</script>

<Menu items={menuItems} skeleton={menuItems.length < 1} let:item>
    <EditableMenuItem {item} on:save={() => save(item)} />
</Menu>

<style>

</style>
