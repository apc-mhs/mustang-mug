import { browser } from '$app/env';
import { getDocuments } from '$lib/query';

async function query() {
    // Only run the query on the browser to support caching
    return browser ? await getDocuments('items') : [];
}

async function postCartItems(cartItems) {
    const cartData = {};
    // The cartItems array is actually an array of the length of the menuItems
    // With each element being an object of the possible cart items
    for (let menuItem in cartItems) {
        for (let cartItem of cartItems[menuItem]) {
            // If there are no cart items for this menu item continue
            if (!cartItem) continue;

            const { id } = cartItem;
            cartData[id + '-' + menuItem] = cartItem;
        }
    }

    const res = await fetch('/cart.json', {
        method: 'POST',
        body: JSON.stringify(cartData),
        headers: {
            'Content-Type': 'application/json'
        },
    });

    return res.status >= 200 && res.status < 400;
}

export {
    query,
    postCartItems
};
