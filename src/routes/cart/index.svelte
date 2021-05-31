<script>
import Cart from '$lib/components/cart/Cart.svelte';
import { browser } from '$app/env';
import { getCartData } from '$lib/msb/cart';
import menuQuery from '../_menuQuery';
import tippy from '$lib/tippy';
import Button from '$lib/components/utility/Button.svelte';

let validCart = false;
let studentName = '';

let cart;
if (browser) {
    fetch('/cart.json')
        .then((res) => res.json())
        .then((json) => (cart = json))
        .catch((err) => (cart = null));
}

function onRemove({ detail: item }) {
    if (!cart) return;

    const index = cart.cartItems.indexOf(item);
    if (index !== -1) {
        cart.cartItems.splice(index, 1);
        cart = cart;
        // Don't post inherent data that belongs to the cart and can't be changed
        fetch('/cart.json', {
            method: 'PUT',
            body: JSON.stringify(getCartData(cart)),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

function checkout() {
    if (!studentName) {
        alert('Please enter a student name to checkout.');
        return;
    }

    fetch('/cart/checkout', {
        method: 'POST',
        body: JSON.stringify({
            studentName,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((json) => {
            if (json) {
                window.location.href = json.url;
            }
        });
}

const invalidCartCheckoutTooltipProps = {
    content: 'Your cart has no in-stock items and can not be checked out.',
    placement: 'top',
    arrow: true,
    duration: [100, 100],
    animation: 'shift-away-subtle',
    touch: ['hold', 450],
    trigger: 'mouseenter',
    maxWidth: 150,
    allowHTML: true,
};

let menuItems = [];
menuQuery().then((data) => (menuItems = data));
</script>

<svelte:head>
    <title>Cart</title>
</svelte:head>

<div class="cart-view">
    <div class="cart">
        <h1>View your cart</h1>
        {#if (cart || cart === null) && menuItems.length > 0}
            {#if cart !== null && cart.cartItems.length > 0}
                <Cart
                    bind:cartItems={cart.cartItems}
                    bind:validCart
                    on:remove={onRemove}
                    {menuItems} />
            {:else}
                <h2>
                    There is nothing in your cart. Go to the <a href="/"
                        >menu</a> and add a few items.
                </h2>
            {/if}
        {:else}
            <h2>Loading cart...</h2>
        {/if}
    </div>
    <div class="checkout">
        <h1>Checkout</h1>
        <label for="pick-up-input">
            Pick-up time:
            <select id="pick-up-input">
                <option>1</option>
            </select>
        </label>
        <label for="student-name-input">
            Student name:
            <input
                id="student-name-input"
                bind:value={studentName}
                type="text" />
        </label>
        <div use:tippy={!validCart ? invalidCartCheckoutTooltipProps : null}>
            <Button on:click={checkout} disabled={!validCart}
                >Proceed to checkout</Button>
        </div>
    </div>
</div>

<style>
.cart-view {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
}

.cart-view > div {
    margin-top: 10px;
}

h1,
h2 {
    text-align: center;
    margin-bottom: 10px;
    color: white;
}

a,
label {
    color: white;
}

.cart {
    flex: 0 0 auto;
    width: 75%;
}

.checkout {
    position: sticky;
    top: var(--header-height);
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    flex: 0 0 auto;
    width: 25%;
}
</style>
