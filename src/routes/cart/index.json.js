import { client, getAuthorization, clientId, departmentId, storeId, paymentMethodId } from '$lib/msb';
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

    return await createCart(body, user, host);
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

    const cartDocumentSnapshot = await app.firestore()
        .collection('carts')
        .where(admin.firestore.FieldPath.documentId(), '==', user.uid)
        .get();

    if (cartDocumentSnapshot.empty) {
        return {
            status: 400,
            body: 'Cart does not exist'
        }
    } else {
        return await updateCart(body, cartDocumentSnapshot.docs[0].data().cartId);
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
            body: 'A user that isn\'t signed in has no cart'
        }
    }

    const cartDocumentSnapshot = await app.firestore()
        .collection('carts')
        .where(admin.firestore.FieldPath.documentId(), '==', user.uid)
        .get();

    if (!cartDocumentSnapshot.empty) {
        return await getCart(cartDocumentSnapshot.docs[0].data().cartId);
    }
    return {
        status: 400,
        body: 'User does not have a cart'
    }
}

async function createCart(body, user, host) {
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
        return {
            status: 500,
            body: 'Failed'
        }
    }

    return {
        status: 200,
        body: JSON.stringify(msbCart.cart)
    }
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
                    name: 'With ' + option.name,
                    value: numberFormatter.format(option.price),
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
