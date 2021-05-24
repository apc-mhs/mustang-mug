import {
    getCartIdFor,
    getCartFor,
    addItemsToCart,
    updateCart
} from './_cart';

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
        // Don't send the checkout url to the client
        delete cart.checkoutUrl;

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
