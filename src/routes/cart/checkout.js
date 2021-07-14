import getFirebase from '$lib/firebase';
import { getCartData, getOptionIdsFromProperties } from '$lib/msb/cart';
import { getCurrentPurchaseWindow } from '$lib/purchase';
import { updateCart, getCart, getCartIdFor } from './_cart';

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
            body: "You can't checkout right now because too many orders have been placed"
        }
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
    await Promise.all([
        removeOutOfStockItems(cart),
        removeDeletedItems(cart)
    ]);

    const { studentName } = body;
    for (let cartItem of cart.cartItems) {
        cartItem.studentName = studentName || 'Unspecified';
    }

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

async function removeOutOfStockItems(cart) {
    const { app } = await getFirebase();

    const [outOfStockItemIds, outOfStockOptionIds] = await Promise.all([
        app
            .firestore()
            .collection('items')
            .where('stock', '==', false)
            .get()
            .then((snapshot) => snapshot.docs.map((doc) => doc.id)),
        app
            .firestore()
            .collection('options')
            .where('stock', '==', false)
            .get()
            .then((snapshot) => snapshot.docs.map((doc) => doc.id)),
    ]);

    cart.cartItems = cart.cartItems.filter((cartItem) => {
        return (
            !outOfStockItemIds.includes(cartItem.itemId) &&
            !getOptionIdsFromProperties(cartItem.properties).some((optionId) =>
                outOfStockOptionIds.includes(optionId)
            )
        );
    });
}

async function removeDeletedItems(cart) {
    const { app } = await getFirebase();
    const menuItems = await Promise.all(cart.cartItems.map((cartItem) => {
        return app.firestore()
            .collection('items')
            .doc(cartItem.itemId)
            .get()
    }));

    cart.cartItems = cart.cartItems.filter((_, i) => {
        return menuItems[i].exists;
    });
}
