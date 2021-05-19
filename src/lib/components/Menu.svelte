<script>
import SkeletonLayout from '$lib/components/SkeletonLayout.svelte';
import MenuItem from '$lib/components/MenuItem.svelte';
import { goto } from '$app/navigation';
import { fade } from 'svelte/transition';
import Icon from './Icon.svelte';
import { sleep } from '$lib/utils';

export let items;
export let skeleton = false;

$: sortedItems = items.sort((a, b) => a.name.localeCompare(b.name));

const cartData = new Array(items.length);
for (let i = 0; i < cartData.length; i++) {
    cartData[i] = {};
}

let updatingCart = false;

async function addToCart() {
    updatingCart = true;
    const formData = new FormData();
    for (let menuItem of cartData) {
        for (let cartItem in menuItem) {
            if (!menuItem[cartItem]) continue;
            const { id } = menuItem[cartItem];
            formData.set(id + '-' + cartItem, JSON.stringify(menuItem[cartItem]));
        }
    }

    const res = await fetch('/cart.json', { method: 'POST', body: formData });
    if (res.status === 200) {
        // Add some delay so the user knows what happened
        await sleep(500);
        await goto('/cart');
    } else {
        console.error(res);
    }
    updatingCart = false;
}
</script>

<div class="flex-container">
    <div class="flex-left">
        <ul class="selection-items">
            <!-- I'm fairly certain these can be hard-coded and then do stuff with the script but I tried to set it up for scalability-->
            <h2>Refine Menu</h2>
            <li>
                <input type="checkbox" id="item1" />
                <label for="item1">Selection 1</label><br />
            </li>
            <li>
                <input type="checkbox" id="item2" />
                <label for="item2">Selection 2</label><br />
            </li>
            <li>
                <input type="checkbox" id="item2" />
                <label for="item2">Selection 3</label><br />
            </li>
            <li>
                <p>Scale</p>
                <input type="range" min="1" max="100" value="100" />
            </li>
        </ul>
    </div>
    <div class="flex-right">
        <div class="checkboxes">
            <h2>Menu</h2>
            <div class="items">
                {#each sortedItems as item, i}
                    {#if skeleton}
                        <div out:fade|local={{ duration: 250 }}>
                            <SkeletonLayout>
                                <MenuItem {item} />
                            </SkeletonLayout>
                        </div>
                    {:else}
                        <div in:fade|local={{ delay: 250, duration: 250 }} >
                            <MenuItem {item} bind:cartItems={cartData[i]} />
                        </div>
                    {/if}
                {/each}
            </div>
            {#if !skeleton}
                <button class="add-to-cart"
                    on:click={addToCart} in:fade|local={{ duration: 250, delay: 250 }}
                    disabled={updatingCart}>
                    <Icon name="add-shopping-cart" width="30" height="30" />
                    Add items to cart
                </button>
            {/if}
        </div>
    </div>
</div>

<style>
.flex-container {
    display: flex;
    flex-direction: row;
}
.flex-right {
    width: 85%;
    margin: 0.3em;
    padding: 0.3em;
}
.flex-left {
    width: 15%;
    margin: 0.3em;
    padding: 0.3em;
}
h2 {
    text-align: center;
}
.checkboxes {
    position: relative;
    color: black;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    background: rgb(175, 175, 175);
    margin: 0.3em;
    padding: 0.3em;
    text-align: center;
    box-shadow: 0px 0px 3px 0px black;
}
.items {
    display: flex;
    justify-content: center;
    flex-flow: row wrap;
    gap: 30px 20px;
    width: 100%;
    height: 100%;
}
.selection-items {
    list-style: none;
    margin: 0.3em;
    padding: 0.3em;
    background-color: rgb(175, 175, 175);
    text-decoration: none;
    color: black;
    box-shadow: 0px 0px 3px 0px black;
}
.add-to-cart {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 0px 5px;
    flex-flow: row nowrap;
    right: 10px;
    bottom: 10px;
    font-size: 30px;
    margin-top: 30px;
    border-radius: 10px;
    cursor: pointer;
}
li {
    margin-bottom: 0.5em;
}
.selection-items li:hover {
    background-color: #c5c5c5;
}
</style>
