<script>
import Cart from '$lib/components/cart/Cart.svelte';
import { browser } from '$app/env';
import { getCartData } from '$lib/msb/cart';
import { query } from '$lib/menu';
import tippy from '$lib/tippy';
import SubmitButton from '$lib/components/input/SubmitButton.svelte';
import { startLoading, stopLoading } from '$lib/components/loading';
import Input from '$lib/components/input/Input.svelte';
import LinkButton from '$lib/components/utility/LinkButton.svelte';
import { getCurrentPurchaseWindow } from '$lib/purchase';
import { currentUser } from '$lib/auth';

let validCart = false;
let studentName = '';
let selectedPickUpTime = [];

/** @type {import("$lib/purchase/window").CurrentPurchaseWindow} */
let purchaseWindow;
getCurrentPurchaseWindow().then((currentPurchaseWindow) => {
    purchaseWindow = currentPurchaseWindow;
});
$: checkoutUnavailableMessage = !purchaseWindow
    ? 'Checkout is not available at this time. Check back later.'
    : purchaseWindow.exhausted
    ? "You can't checkout now because too many orders have been placed. Check back later."
    : undefined;

let cart;
if (browser) {
    fetch('/cart.json')
        .then((res) => res.json())
        .then((json) => (cart = json))
        .catch(() => (cart = { cartItems: [] }));
}

function onRemove({ detail: item }) {
    if (!cart) return;

    const index = cart.cartItems.indexOf(item);
    if (index !== -1) {
        cart.cartItems.splice(index, 1);
        cart.cartItems = cart.cartItems;
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

let checkingOut = false;

async function checkout(e) {
    if (e) e.preventDefault();

    checkingOut = true;
    try {
        startLoading();
        const json = await fetch('/cart/checkout', {
            method: 'POST',
            body: JSON.stringify({
                studentName,
                pickUpTime: selectedPickUpTime,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json());
        stopLoading();
        if (json) {
            window.location.href = json.url;
        } else {
            throw new Error('Got invalid json from checkout request');
        }
    } catch (err) {
        console.error(err);
        checkingOut = false;
        stopLoading();
    }
}

let menuItems = [];
$: if ($currentUser && menuItems.length === 0) {
    query().then(([items, _]) => {
        menuItems = items;
    });
}
</script>

<svelte:head>
    <title>Cart - Mustang Mug</title>
    <meta property="og:title" content="Cart - Mustang Mug" />
    <meta
        property="og:description"
        content="View, remove and checkout items in your cart." />
</svelte:head>

<div class="cart-view">
    <div class="cart">
        <h1>View your cart</h1>
        {#if cart !== undefined && menuItems.length > 0}
            <Cart
                bind:cartItems={cart.cartItems}
                bind:validCart
                on:remove={onRemove}
                {menuItems} />
        {:else}
            <h2>Loading cart...</h2>
        {/if}
    </div>
    <form class="checkout" on:submit={checkout}>
        <h1>Checkout</h1>
        <label for="student-name-input">
            Name:
            <Input
                bind:value={studentName}
                required
                pattern="[a-zA-Z ]+"
                maxlength="10"
                --flex="none"
                --font-size="16px" />
        </label>
        <div class="button-column">
            <div
                use:tippy={checkoutUnavailableMessage ||
                    (!validCart
                        ? 'Your cart has no in-stock items and can not be checked out.'
                        : null)}>
                <SubmitButton
                    value={'Proceed to checkout'}
                    disabled={!validCart ||
                        checkingOut ||
                        checkoutUnavailableMessage} />
            </div>
            <LinkButton href="/">Return to menu</LinkButton>
        </div>
    </form>
</div>

<style>
.cart-view {
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
    gap: 15px 0px;
    padding: 10px;
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

label {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 10px;
    color: white;
}

.cart {
    flex: auto;
    width: 75%;
    margin: 0px auto;
}

.checkout {
    position: sticky;
    top: calc(var(--header-height) + 20px);
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    flex: 1 0 auto;
    min-width: 250px;
    gap: 10px;
    padding: 0px 10px;
}

.button-column {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: 10px;
    padding: 15px 0px;
}
</style>
