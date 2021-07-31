import { dev } from '$app/env';
import { isAdmin } from '$lib/auth';
import getFirebase from '$lib/firebase';
import { deleteCollection } from '$lib/firebase/firestore';
import { getAuthorization } from '$lib/msb';
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function del({ locals }) {
    const user = locals.user;

    if (!user || !(user.email || dev)) {
        return {
            status: 400,
            body: "Can't manipulate a cart before signing in",
        };
    }

    if (!isAdmin(user)) {
        return {
            status: 400,
            body: 'Insufficient permissions',
        }
    }

    // TODO: Check if the user's email is the mustang mug address
    if (!dev && !acceptedEmails.includes(user.email)) {
        return {
            status: 403,
            body: 'Insufficient persmissions',
        };
    }

    // Create a utility function to accumulate the data from this endpoint's paged responses
    const carts = (
        await fetch('https://test.www.myschoolbucks.com/msbpay/v2/carts', {
            headers: {
                Authorization: getAuthorization(),
            },
        }).then((res) => res.json())
    ).carts;

    await Promise.all(
        carts.map((cart) => {
            return fetch(
                'https://test.www.myschoolbucks.com/msbpay/v2/carts/' + cart.id,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: getAuthorization(),
                    },
                }
            );
        })
    );

    const { app } = await getFirebase();
    await deleteCollection(app.firestore(), 'carts', 200);

    return {
        status: 200,
        body: 'Success',
    };
}
