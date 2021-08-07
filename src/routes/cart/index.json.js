import { getCartIdFor, getCartFor, addItemsToCart, updateCart } from '$lib/cart';
import { getCartData } from '$lib/msb/cart';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post({ locals, body, host }) {
    const user = locals.user;

    if (!user) {
        return {
            status: 400,
            body: "Can't manipulate a cart before signing in",
        };
    }

    const success = await addItemsToCart(body, user, host);
    return {
        status: success ? 200 : 500,
        body: success ? 'Added items to cart' : 'Failed',
    };
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function put({ locals, body }) {
    const user = locals.user;

    if (!user) {
        return {
            status: 400,
            body: "Can't manipulate a cart before signing in",
        };
    }

    const cartId = await getCartIdFor(user);

    if (cartId) {
        const success = await updateCart(body, cartId);
        return {
            status: success ? 200 : 500,
            body: success ? 'Cart updated' : 'Failed',
        };
    }

    return {
        status: 400,
        body: 'User does not have a cart',
    };
}

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ locals }) {
    const user = locals.user;

    if (!user) {
        return {
            status: 400,
            body: "Can't manipulate a cart before signing in",
        };
    }

    const cart = await getCartFor(user);

    if (cart) {
        return {
            status: 200,
            body: getCartData(cart),
        };
    }

    return {
        status: 400,
        body: 'User does not have a cart',
    };
}
