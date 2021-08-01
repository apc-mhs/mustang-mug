<script>
import EditableMenuItem from '$lib/components/menu/EditableMenuItem.svelte';
import EditableMenuOptionsItem from '$lib/components/menu/EditableMenuOptionsItem.svelte';
import Menu from '$lib/components/menu/Menu.svelte';
import SkeletonLayout from '$lib/components/utility/SkeletonLayout.svelte';
import getFirebase from '$lib/firebase';
import { query } from '$lib/menu';

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
    const index = items.findIndex((item) => item.id === itemData.id);
    if (index !== -1) {
        items.splice(index, 1, itemData);
    } else {
        items.push(itemData);
    }
    items = items;
    // Update the menu item in firestore
    const { id, ...strippedItemData } = itemData;
    // Change list of options into list of references to options
    strippedItemData.options = strippedItemData.options.map((option) => {
        return app.firestore().collection('options').doc(option.id);
    });
    await app
        .firestore()
        .collection('items')
        .doc(itemData.id)
        .set(strippedItemData, { merge: true });
    // TODO: Post a notification on save
}

async function saveOption(optionData) {
    const { app, firebase } = await getFirebase();

    optionData.lastModified = firebase.firestore.Timestamp.now();

    // Update the menu item in the main menuItems array
    options.splice(
        options.indexOf(options.find((option) => optionData.id === option.id)),
        1,
        optionData
    );
    options = options;
    // Update the option in firestore
    const { id, ...strippedOptionData } = optionData;
    await app
        .firestore()
        .collection('options')
        .doc(optionData.id)
        .set(strippedOptionData, { merge: true });
    // TODO: Post a notification on save
}

async function itemsMenuItemAddHandler() {
    const { app, firebase } = await getFirebase();
    const { id } = app.firestore().collection('items').doc();
    items = [
        ...items,
        {
            id,
            name: 'New Item',
            image: 'missing.png',
            options: [],
            filters: [
                ["cold", false],
                ["drink", false],
                ["food", false],
                ["gluten_free", false],
                ["hot", false],
                ["lactose_free", false],
                ["nut_free", false],
            ],
            stock: true,
            price: 0,
            lastModified: firebase.firestore.Timestamp.now(),
        },
    ];
}

async function optionsMenuItemAddHandler() {
    const { app, firebase } = await getFirebase();
    const { id } = app.firestore().collection('options').doc();
    options = [
        ...options,
        {
            id,
            name: 'New Option',
            stock: true,
            price: 0,
            lastModified: firebase.firestore.Timestamp.now(),
        },
    ];
}

async function itemsMenuItemDeleteHandler(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { app } = await getFirebase();
    items = items.filter((item) => item.id !== itemId);
    app.firestore().collection('items').doc(itemId).delete();
}

async function optionsMenuItemDeleteHandler(optionId) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { app } = await getFirebase();
    options = options.filter((option) => option.id !== optionId);
    app.firestore().collection('options').doc(optionId).delete();
}
</script>

<Menu
    title="Menu Items"
    refine={false}
    {items}
    {options}
    skeleton={items.length < 1}
    modify={true}
    on:addItem={itemsMenuItemAddHandler}
    let:item
    let:itemOptions>
    {#if !items.length < 1}
        <EditableMenuItem
            {item}
            options={itemOptions}
            allOptions={options}
            on:save={(e) => save(e.detail)}
            on:delete={({ detail }) => itemsMenuItemDeleteHandler(detail)} />
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
    modify={true}
    on:addItem={optionsMenuItemAddHandler}
    let:item>
    {#if !options.length < 1}
        <EditableMenuOptionsItem
            option={item}
            on:save={(e) => saveOption(e.detail)}
            on:delete={({ detail }) => optionsMenuItemDeleteHandler(detail)} />
    {/if}
</Menu>

<style>
</style>
