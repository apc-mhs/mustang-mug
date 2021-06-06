<script>
import EditableMenuItem from '$lib/components/menu/EditableMenuItem.svelte';
import EditableMenuOptionsItem from '$lib/components/menu/EditableMenuOptionsItem.svelte';
import Menu from '$lib/components/menu/Menu.svelte';
import SkeletonLayout from '$lib/components/utility/SkeletonLayout.svelte';
import { query } from '../_menu';

let items = [];
let options = [];

query().then(([itemsData, optionsData]) => {
    items = itemsData;
    options = optionsData;
});

async function save(itemData) {
    const { app, firebase } = await getFirebase();
    itemData.lastModified = firebase.firestore.Timestamp.now();

    // Update the menu item in the main menuItems array
    items = [...items.filter((i) => itemData.id !== i.id), itemData];
    // Update the menu item + options in firestore

    await app
        .firestore()
        .collection('items')
        .doc(itemData.id)
        .set(itemData, { merge: true });
    // TODO: Post a notification on save
}

async function saveOption(optionData) {
    optionData.lastModified = firebase.firestore.Timestamp.now();

    // Update the menu item in the main menuItems array
    options.splice(options.indexOf(options.find((option) => optionData.id === option.id)), 1, optionData);
    options = options;
    // Update the menu item + options in firestore
    const { app } = await getFirebase();

    await app
        .firestore()
        .collection('options')
        .doc(optionData.id)
        .set(optionData, { merge: true });
    // TODO: Post a notification on save
}
</script>

<Menu
    title="Menu Items"
    refine={false}
    {items}
    {options}
    skeleton={items.length < 1}
    let:item
    let:itemOptions>
    {#if !items.length < 1}
        <EditableMenuItem
            {item}
            options={itemOptions}
            on:save={(e) => save(e.detail)}
            allOptions={options} />
    {:else}
        <SkeletonLayout>
            <EditableMenuItem {item} />
        </SkeletonLayout>
    {/if}
</Menu>

<Menu
    title="Menu Options"
    refine={false}
    items={options}
    options={[]}
    skeleton={options.length < 1}
    let:item>
    {#if !options.length < 1}
        <EditableMenuOptionsItem
            option={item}
            on:save={(e) => saveOption(e.detail)} />
    {/if}
</Menu>

<style>
</style>
