import {
    getCartData,
    createCartItemsWithProperties,
    getOptionIdsFromProperties,
} from '$lib/msb/cart';
import { dev } from '$app/env';
import getFirebase from '$lib/firebase';
import api from '$lib/msb/api';

async function getCartIdFor(user) {
    const { app, firebase } = await getFirebase();

    const cartSnapshot = await app
        .firestore()
        .collection('carts')
        .where(firebase.firestore.FieldPath.documentId(), '==', user.uid)
        .get();

    if (cartSnapshot.empty || !cartSnapshot.docs[0].data().cartId) return null;

    return cartSnapshot.docs[0].data().cartId;
}

async function getCartFor(user) {
    return getCart(await getCartIdFor(user));
}

// Somehow replace this implementation which uses 2 queries (getCartFor and updateCart)
// With one query (https://www.myschoolbucks.com/ver2/developer/swagger/getdocs?apiDocs=msbpayapi#/Cart/post_carts__cartId__addItems)
// An addItems call with the user's cart id.
/** @returns {Promise<boolean>} */
async function addItemsToCart(body, user, host) {
    const cart = await getCartFor(user);

    // If the user doesn't have a cart yet
    if (!cart) {
        return await createCartWithItems(body, user, host);
    }

    const newCartItems = createCartItemsWithProperties(body, user);
    cart.cartItems = cart.cartItems.concat(newCartItems);

    return await updateCart(getCartData(cart), cart.id);
}

/** @returns {Promise<boolean>} */
async function createCartWithItems(body, user, host) {
    const { app } = await getFirebase();
    const cartItems = createCartItemsWithProperties(body, user);

    /* 
    API docs for the cart are available here: 
    https://www.myschoolbucks.com/ver2/developer/swagger/getdocs?apiDocs=msbpayapi#/Cart/post_carts
    
    loginPolicy	- string
    When set to "optional", allows the user to use guest checkout. If set to "required", user must 
    log into an account. If set to "none", user is not prompted to log in and immediately starts 
    checkout. If set to null, use district defaults.
   
    Unfortunately, this doesn't actually work. loginPolicies of both optional, and required result 
    in the user being forced to sign in. Only by setting the following values, can authless 
    checkout be achieved.  
    
    loginPolicy: 'none', 
    checkoutStyle: 'express',
    paymentPreauthPolicy: none,
    */

    const cartData = {
        cartItems: cartItems,
        redirectUrl: (dev ? 'http://' : 'https://') + host + '/cart/process',
        allowDuplicatePayments: 'false',
        loginPolicy: 'required',
        checkoutStyle: 'express',
        paymentPreauthPolicy: null,
        returnToSiteUrl: (dev ? 'http://' : 'https://') + host + '/cart',
    };

    const msbCart = await api.post('/carts', cartData);

    if (!msbCart || msbCart.result == 'Error') {
        console.error(msbCart);
        return false;
    }

    app.firestore().collection('carts').doc(user.uid).set(
        {
            cartId: msbCart.cartId,
        },
        {
            merge: true,
        }
    );

    return true;
}

/** @returns {Promise<boolean>} */
async function updateCart(body, cartId) {
    const msbCart = await api.put(`/carts/${cartId}`, body);
    if (!msbCart || msbCart.result === 'Error') {
        return false;
    }

    return true;
}

async function getCart(cartId) {
    if (!cartId) return null;

    const msbCart = await api.get(`/carts/${cartId}`, true);
    if (!msbCart || msbCart.result === 'Error') {
        return null;
    }

    return msbCart.cart;
}

async function removeDeletedItems(cart) {
    const { app } = await getFirebase();
    const menuItems = await Promise.all(
        cart.cartItems.map((cartItem) => {
            return app
                .firestore()
                .collection('items')
                .doc(cartItem.itemId)
                .get();
        })
    );

    cart.cartItems = cart.cartItems.filter((_, i) => {
        return menuItems[i].exists;
    });
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

export {
    getCartIdFor,
    getCartFor,
    addItemsToCart,
    createCartWithItems,
    updateCart,
    getCart,
    removeDeletedItems,
    removeOutOfStockItems,
};
