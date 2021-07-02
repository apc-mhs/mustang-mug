<script>
import Cart from '$lib/components/cart/Cart.svelte';
import { browser } from '$app/env';
import { getCartData } from '$lib/msb/cart';
import { query } from '../_menu';
import tippy from '$lib/tippy';
import SubmitButton from '$lib/components/input/SubmitButton.svelte';
import { startLoading, stopLoading } from '$lib/components/loading';
import Input from '$lib/components/input/Input.svelte';
import AutocompleteInput from '$lib/components/input/AutocompleteInput.svelte';
import LinkButton from '$lib/components/utility/LinkButton.svelte';

let validCart = false;
let studentName = '';
let pickUpTimes = ['10:00am', '12:00pm'];
let selectedPickUpTime = [];

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
    }
}

const invalidCartCheckoutTooltipProps = {
    content: 'Your cart has no in-stock items and can not be checked out.',
    allowHTML: true,
};

let menuItems = [];
query().then(([items, _]) => {
    menuItems = items;
});
</script>

<svelte:head>
    <title>Cart - Mustang Mug</title>
</svelte:head>

<div class="cart-view">
    <div class="cart">
        <h1>View your cart</h1>
        {#if (cart || cart === null) && menuItems.length > 0}
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
        <label for="pick-up-input">
            Pick-up time:
            <AutocompleteInput
                placeholder={'Choose time'}
                options={pickUpTimes}
                required
                bind:selectedOption={selectedPickUpTime}
                let:option>
                <div>{option}</div>
            </AutocompleteInput>
        </label>
        <label for="student-name-input">
            Student name:
            <Input
                bind:value={studentName}
                required
                pattern="[a-zA-Z ]+"
                maxlength="10"
                --font-size="16px" />
        </label>
        <div use:tippy={!validCart ? invalidCartCheckoutTooltipProps : null}>
            <SubmitButton
                value={'Proceed to checkout'}
                disabled={!validCart || checkingOut} />
        </div>
        <LinkButton href="/">Return to menu</LinkButton>
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
    gap: 5px;
}
</style>
