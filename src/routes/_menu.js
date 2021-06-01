import { browser } from '$app/env';
import { getDocuments } from '$lib/query';

async function query() {
    // Only run the query on the browser to support caching
    if (!browser) return [];

    return await Promise.all([getDocuments('items'), getDocuments('options')]);
}

async function postCartItems(cartItems) {
    const cartData = {};
    // The cartItems array is actually an array of the length of the menuItems
    // With each element being an object of the possible cart items
    for (let menuItem in cartItems) {
        for (let i = 0; i < cartItems[menuItem].length; i++) {
            const cartItem = cartItems[menuItem][i];
            // If there are no cart items for this menu item continue
            if (!cartItem) continue;

            cartData[menuItem + '-' + i] = cartItem;
        }
    }

    let res;
    try {
        res = await fetch('/cart.json', {
            method: 'POST',
            body: JSON.stringify(cartData),
            headers: {
                'Content-Type': 'application/json'
            },
        });
    } catch (err) {
        // Probably no internet connection
        res = { status: 500 };
    }

    return res.status >= 200 && res.status < 400;
}

export {
    query,
    postCartItems
};
