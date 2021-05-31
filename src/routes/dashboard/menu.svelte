<script>
import EditableMenuItem from '$lib/components/menu/EditableMenuItem.svelte';
import Menu from "$lib/components/menu/Menu.svelte";
import app, { firebase } from '$lib/firebase/firebase';
import { query } from '../_menu';


let items = [];
let options = [];

query()
    .then(([ itemsData, optionsData ]) => {
        items = itemsData;
        options = optionsData;
    });

async function save(itemData) {
    itemData.lastModified = firebase.firestore.Timestamp.now();

    // Update the menu item in the main menuItems array
    items = [...items.filter((i) => itemData.id !== i.id), itemData];
    // Update the menu item + options in firestore
    await app.firestore().collection('items').doc(itemData.id).set(itemData, { merge: true });
    // TODO: Post a notification on save
}
</script>

<Menu refine={false} {items} {options} skeleton={items.length < 1} let:item let:itemOptions>
    <EditableMenuItem {item} options={itemOptions} on:save={(e) => save(e.detail)} />
</Menu>



<style>

</style>
