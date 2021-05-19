<script>
import Cart from '$lib/components/Cart.svelte';
import { browser } from '$app/env';

function checkout() {
    window.location.replace(cart.checkoutUrl);
}

let cart;
if (browser) {
    fetch('/cart.json')
        .then((res) => res.json())
        .then((json) => cart = json)
        .catch((err) => cart = null);
}

function onRemove({ detail: item }) {
    if (!cart) return;

    const index = cart.cartItems.indexOf(item);
    if (index !== -1) {
        cart.cartItems.splice(index, 1);
        cart = cart;
        // Don't post inherent data that belongs to the cart and can't be changed
        const { id, status, createdDate, lastUpdated, checkoutUrl, ...cartData } = cart;
        fetch('/cart.json', {
            method: 'PUT',
            body: JSON.stringify(cartData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
</script>

<h1>View your cart</h1>
{#if cart || cart === null}
    {#if cart !== null && cart.cartItems.length > 0}
        <Cart bind:items={cart.cartItems} on:remove={onRemove} />
    {:else}
        <h2>There is nothing in your cart. Go to the <a href="/">menu</a> and add a few items.</h2>
    {/if}
{:else}
    <h2>Loading cart...</h2>
{/if}
<button on:click={checkout} style="color: black;">Checkout</button>

<style>
* {
    color: white;
}

h1, h2 {
    text-align: center;
    margin: 10px;
}
</style>