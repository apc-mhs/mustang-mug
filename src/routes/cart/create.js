import { client, getAuthorization } from '$lib/msb';
import { CartApi, Cart } from 'msb_pay_api';
import app from '$lib/firebase/firebaseAdmin';

const cartApi = new CartApi(client);

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post({ locals, body }) {
    const user = locals.user;

    const cartItems = [];
    // TODO: Turn request body (FormData) into cartItems

    // Let's not let the MSB api request go through yet...
    return {
        status: 200,
        body: 'Success'
    }

    const cartData = {
        cartItems: cartItems,
        redirectUrl: import.meta.env.BASE_URL + '/processCart',
        allowDuplicatePayments: 'false',
        returnToSiteUrl: import.meta.env.BASE_URL + '/cart',
        loginPolicy: 'required',
    }

    /** @type {Cart} */
    const msbCart = await new Promise(async (resolve, _) => {
        cartApi.cartsPost(getAuthorization(), cartData, resolve);
    });

    app.firestore().collection('carts').doc(user.uid).set({
        cartId: msbCart.id
    })

    return {
        status: 200,
        body: 'Success'
    }
}
