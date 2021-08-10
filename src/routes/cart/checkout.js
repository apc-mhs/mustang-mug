import getFirebase from '$lib/firebase';
import { getCartData, getOptionIdsFromProperties } from '$lib/msb/cart';
import { getCurrentPurchaseWindow } from '$lib/purchase';
import {
    updateCart,
    getCart,
    getCartIdFor,
    removeOutOfStockItems,
    removeDeletedItems,
} from '$lib/cart';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post({ locals, body }) {
    const { user } = locals;
    if (!user) {
        return {
            status: 400,
            body: "Can't manipulate a cart before signing in",
        };
    }

    const currentPurchaseWindow = await getCurrentPurchaseWindow();
    if (!currentPurchaseWindow || currentPurchaseWindow.exhausted) {
        return {
            status: 400,
            body: "You can't checkout right now because too many orders have been placed",
        };
    }

    const cartId = await getCartIdFor(user);
    let cart = await getCart(cartId);
    if (!cart) {
        return {
            status: 400,
            body: 'User does not have a cart',
        };
    }

    // Process cart data
    await Promise.all([removeOutOfStockItems(cart), removeDeletedItems(cart)]);

    const { studentName } = body;
    for (let cartItem of cart.cartItems) {
        cartItem.studentName = studentName || 'Unspecified';
    }

    const { guestCheckout } = body;

    /* If guestCheckout is set to 'true,' the loginPolicy will be set
    to none, resulting in no sign in. If it's false, a login will still
    be required.
    
    The paymentPreauthPolicy is set to null be default, which defers 
    to district defaults, which must be overridden to achieve an authless
    checkout.

    The checkoutStyle attribute remains express between both auth, and 
    authless checkout and thus does not need to be modified. */

    if (guestCheckout) {
        cart.loginPolicy = 'none';
        cart.paymentPreauthPolicy = 'none';
    } else {
        /*This is technically redunant as the loginPolicy is 'required' 
        by default */
        cart.loginPolicy = 'required';
    }
    
    /* getCartData removes properties from the cart object that can't 
    be sent through an update request, and subsequently break checkout. */
    const success = await updateCart(getCartData(cart), cartId);
    if (!success || cart.cartItems.length < 1) {
        return {
            status: 400,
            body: 'Your cart was left in an incomplete state after processing. (Your items may have been marked out of stock)',
        };
    }

    return {
        status: 200,
        body: {
            url: cart.checkoutUrl,
        },
    };
}
