import menuQuery from '../_menuQuery';
import { getCartData } from '$lib/msb';
import {
    getCartIdFor,
    getCartFor,
    addItemsToCart,
    updateCart
} from './_cart';
import app from 'firebase-admin';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
 export async function get({ locals }) {
    const user = locals.user;
    if (!user) {
        return {
            status: 400,
            body: 'Can\'t manipulate a cart before signing in'
        }
    }

    const cart = await getCartFor(user);
    if (!cart) {
        return {
            status: 400,
            body: 'User does not have a cart'
        }
    }

    const outOfStockOptions = (await app.firestore()
        .collection('options')
        .where('stock', '==', false)
        .get()
    ).map((option) => option.id);
    const outOfStock = (await app.firestore()
        .collection('items')
        .where('stock', '==', false)
        .where('options', 'array-contains-any', outOfStockOptions)
        .get()
    ).map((item) => item.id);
    // const outOfStock = menuItems
    //     .filter((item) => !item.stock || item.options.some((option) => !option.stock))
    //     .map((item) => item.id);

    cart.cartItems = cart.cartItems.filter((cartItem) => !outOfStock.includes(cartItem.itemId));
    cart = await updateCart(getCartData(cart), cart.cartId);
    return {
        status: 302,
        headers: {
            Location: cart.checkoutUrl
        }
    }
}