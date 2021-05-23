import { client, getAuthorization, clientId, departmentId, storeId, paymentMethodId, getCartData } from '$lib/msb';
import { CartApi, Cart } from 'msb_pay_api';
import app, { admin } from '$lib/firebase/firebaseAdmin';
import { numberFormatter } from '$lib/utils';

const cartApi = new CartApi(client);

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post({ locals, body, host }) {
    const user = locals.user;

    if (!user) {
        return {
            status: 400,
            body: 'Can\'t manipulate a cart before signing in'
        }
    }

    return await addItemsToCart(body, user, host);
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function put({ locals, body }) {
    const user = locals.user;

    if (!user) {
        return {
            status: 400,
            body: 'Can\'t manipulate a cart before signing in'
        }
    }

    const cartId = await getCartIdFor(user);

    if (cartId) {
        return await updateCart(body, cartId);    
    }

    return {
        status: 400,
        body: 'User does not have a cart'
    }
}

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

    if (cart) {
        return {
            status: 200,
            body: cart
        }
    }

    return {
        status: 400,
        body: 'User does not have a cart'
    }
}

async function getCartIdFor(user) {
    const cartSnapshot = await app.firestore()
        .collection('carts')
        .where(admin.firestore.FieldPath.documentId(), '==', user.uid)
        .get();

    if (cartSnapshot.empty) return null;

    return cartSnapshot.docs[0].data().cartId;
}

async function getCartFor(user) {
    return getCart(await getCartIdFor(user));
}

// Somehow replace this implementation which uses 2 queries (getCartFor and updateCart)
// With one query (https://www.myschoolbucks.com/ver2/developer/swagger/getdocs?apiDocs=msbpayapi#/Cart/post_carts__cartId__addItems)
// An addItems call with the user's cart id.
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

async function createCartWithItems(body, user, host) {
    const cartItems = createCartItemsWithProperties(body, user);

    const cartData = {
        cartItems: cartItems,
        redirectUrl: 'https://' + host + '/processCart',
        allowDuplicatePayments: 'false',
        returnToSiteUrl: 'https://' + host + '/cart',
        loginPolicy: 'required',
    }

    /** @type {Cart} */
    const msbCart = JSON.parse(await fetch('https://test.www.myschoolbucks.com/msbpay/v2/carts', {
        method: 'POST',
        headers: {
            'Authorization': getAuthorization(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartData)
    }).then((res) => res.text()));

    /** @type {Cart} */
    // const msbCart = await new Promise(async (resolve, _) => {
    //     cartApi.cartsPost(getAuthorization(), cartData, resolve);
    // });

    if (msbCart.result == 'Error') {
        return {
            status: 500,
            body: 'Failure'
        }
    }

    app.firestore().collection('carts').doc(user.uid).set({
        cartId: msbCart.cartId
    });

    return {
        status: 200,
        body: 'Success'
    }
}

async function updateCart(body, cartId) {
    /** @type {Cart} */
    const msbCart = await fetch('https://test.www.myschoolbucks.com/msbpay/v2/carts/' + cartId, {
        method: 'PUT',
        headers: {
            'Authorization': getAuthorization(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then((res) => res.json());

    if (msbCart.result === 'Error') {
        return {
            status: 500,
            body: 'MSB Pay API error'
        }
    }

    return {
        status: 200,
        body: 'Success'
    }
}

async function getCart(cartId) {
    /** @type {Cart} */
    const msbCart = JSON.parse(await fetch('https://test.www.myschoolbucks.com/msbpay/v2/carts/' + cartId, {
        method: 'GET',
        headers: {
            'Authorization': getAuthorization(),
        }
    }).then((res) => res.text()));

    if (msbCart.result == 'Error') {
        return null;
    }

    return msbCart.cart;
}


function createCartItemsWithProperties(formData, user) {
    const cartItems = [];
    for (let cartItem of Object.values(formData)) {
        const itemPrice = cartItem.price + cartItem.options.reduce((cumPrice, cur) => cumPrice + cur.price, 0);
        cartItems.push({
            clientId,
            departmentId,
            storeId,
            paymentMethodId,
            itemId: cartItem.id,
            itemName: cartItem.name,
            unitPrice: itemPrice.toString(),
            salesTaxAmount: 0,
            displaySalesTaxRate: 0,
            studentName: 'Test',
            reference: user.uid + ':' + cartItem.id,
            properties: cartItem.options.map((option) => {
                return {
                    name: 'With ' + option.name + ' (' + numberFormatter.format(option.price) + ')',
                    value: '',
                    displayResponse: 'visible'
                }
            })
        });
    }
    return cartItems;
}

function createCartItems(formData, user) {
    const cartItems = [];
    for (let cartItem of formData.values()) {
        const itemId = [cartItem.id, ...cartItem.options.map((option) => option.id)].join(' + ');
        const itemName = [cartItem.name, ...cartItem.options.map((option) => option.name)].join(' + ');
        const itemPrice = cartItem.price + cartItem.options.reduce((cumPrice, cur) => cumPrice + cur.price, 0);
        cartItems.push({
            clientId,
            departmentId,
            storeId,
            paymentMethodId,
            itemId: itemId,
            itemName: itemName,
            unitPrice: itemPrice.toString(),
            salesTaxAmount: 0,
            displaySalesTaxRate: 0,
            studentName: 'Test',
            reference: user.uid + ':' + itemId
        });
    }
    return cartItems;
}
