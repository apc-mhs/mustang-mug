import { dev } from '$app/env';
import { getAuthorization, client } from '$lib/msb';
import { CartApi, Cart } from 'msb_pay_api';
import app, { deleteCollection } from '$lib/firebase/firebaseAdmin';

const cartApi = new CartApi(client);

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function del({ locals }) {
    const user = locals.user;

    if (!user || !(user.email || dev)) {
        return {
            status: 400,
            body: 'Can\'t manipulate a cart before signing in'
        };
    }

    // TODO: Check if the user's email is the mustang mug address
    if (!dev && !acceptedEmails.includes(user.email)) {
        return {
            status: 403,
            body: 'Insufficient persmissions'
        };
    }

    // Create a utility function to accumulate the data from this endpoint's paged responses
    const carts = (await fetch('https://test.www.myschoolbucks.com/msbpay/v2/carts', {
        headers: {
            Authorization: getAuthorization()
        }
    }).then((res) => res.json())).carts;
    
    await Promise.all(carts.map((cart) => {
        return fetch('https://test.www.myschoolbucks.com/msbpay/v2/carts/' + cart.id, {
            method: 'DELETE',
            headers: {
                Authorization: getAuthorization()
            }
        })
    }));

    await deleteCollection(app.firestore(), 'carts', 200);

    return {
        status: 200,
        body: 'Success'
    };
}