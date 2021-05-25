import {
    getCartData,
    getOptionIdsFromProperties,
} from '$lib/msb/cart';
import { updateCart, getCart, getCartIdFor } from './_cart';
import app from '$lib/firebase/firebaseAdmin';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post({ locals }) {
    const user = locals.user;
    if (!user) {
        return {
            status: 400,
            body: 'Can\'t manipulate a cart before signing in'
        }
    }

    const cartId = await getCartIdFor(user);
    const cart = await getCart(cartId);
    if (!cart) {
        return {
            status: 400,
            body: 'User does not have a cart'
        };
    }

    await removeOutOfStockItems(cart);
    // TODO: Process the cart and set each cart item's "Student name" field to
    // the student name given in the request body

    const success = await updateCart(getCartData(cart), cartId);
    if (!success || cart.cartItems.length < 1) {
        return {
            status: 400,
            body: 'Your cart was left in an incomplete state after processing'
        }
    }

    return {
        status: 200,
        body: {
            url: cart.checkoutUrl
        }
    };
}

async function removeOutOfStockItems(cart) {
    const [outOfStockItemIds, outOfStockOptionIds] = await Promise.all([
        app.firestore()
            .collection('items')
            .where('stock', '==', false)
            .get()
            .then((snapshot) => snapshot.docs.map((doc) => doc.id)),
        app.firestore()
            .collection('options')
            .where('stock', '==', false)
            .get()
            .then((snapshot) => snapshot.docs.map((doc) => doc.id))
    ]);

    cart.cartItems = cart.cartItems.filter((cartItem) => {
        return !outOfStockItemIds.includes(cartItem.itemId)
            && !getOptionIdsFromProperties(cartItem.properties)
                .some((optionId) => outOfStockOptionIds.includes(optionId))
    });
}
