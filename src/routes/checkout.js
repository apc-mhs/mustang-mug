import { client, getAuthorization } from '$lib/msb';
import { CartApi, Cart } from 'msb_pay_api';

const cartApi = new CartApi(client);

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ locals }) {
    const { user } = locals;

    
    const cartData = {
        cartItems: [
            // TODO: Fetch cart items from firestore
        ],
        redirectUrl: import.meta.env.BASE_URL + '/processCart',
        allowDuplicatePayments: 'false',
        returnToSiteUrl: import.meta.env.BASE_URL + '/cart',
        loginPolicy: 'required',
    }

    /** @type {Cart} */
    const msbCart = await new Promise(async (resolve, _) => {
        cartApi.cartsPost(await getAuthorization(), cartData, resolve);
    });

    return {
        status: msbCart ? 200 : 500,
        body: JSON.stringify(msbCart ? 'Success' : 'Failure')
    }
}