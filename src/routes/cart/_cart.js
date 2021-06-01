import { client, getAuthorization } from '$lib/msb';
import { getCartData, createCartItemsWithProperties } from '$lib/msb/cart';
import { CartApi, Cart } from 'msb_pay_api';
import app, { admin } from '$lib/firebase/firebaseAdmin';
import { dev } from '$app/env';

const cartApi = new CartApi(client);

async function getCartIdFor(user) {
    const cartSnapshot = await app
        .firestore()
        .collection('carts')
        .where(admin.firestore.FieldPath.documentId(), '==', user.uid)
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
    const cartItems = createCartItemsWithProperties(body, user);

    const cartData = {
        cartItems: cartItems,
        redirectUrl: (dev ? 'http://' : 'https://') + host + '/cart/process',
        allowDuplicatePayments: 'false',
        returnToSiteUrl: (dev ? 'http://' : 'https://') + host + '/cart',
        loginPolicy: 'required',
    };

    /** @type {Cart} */
    const msbCart = await fetch(
        'https://test.www.myschoolbucks.com/msbpay/v2/carts',
        {
            method: 'POST',
            headers: {
                Authorization: getAuthorization(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartData),
        }
    ).then((res) => res.json());

    /** @type {Cart} */
    // const msbCart = await new Promise(async (resolve, _) => {
    //     cartApi.cartsPost(getAuthorization(), cartData, resolve);
    // });

    if (msbCart.result == 'Error') {
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
    /** @type {Cart} */
    const msbCart = await fetch(
        'https://test.www.myschoolbucks.com/msbpay/v2/carts/' + cartId,
        {
            method: 'PUT',
            headers: {
                Authorization: getAuthorization(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }
    ).then((res) => res.json());

    if (msbCart.result === 'Error') {
        return false;
    }

    return true;
}

async function getCart(cartId) {
    /** @type {Cart} */
    const msbCart = await fetch(
        'https://test.www.myschoolbucks.com/msbpay/v2/carts/' + cartId,
        {
            method: 'GET',
            headers: {
                Authorization: getAuthorization(),
            },
        }
    ).then((res) => res.json());

    if (msbCart.result == 'Error') {
        return null;
    }

    return msbCart.cart;
}

export {
    getCartIdFor,
    getCartFor,
    addItemsToCart,
    createCartWithItems,
    updateCart,
    getCart,
};
