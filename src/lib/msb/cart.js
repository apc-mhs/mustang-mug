import { clientId, departmentId, storeId, paymentMethodId } from '$lib/msb';
import { numberFormatter } from '$lib/utils';

/**
 * Turn a cart object received from the MSB Pay API
 * into a cart object that can be used for updating
 * a cart's data. Essentially removes all metadata.
 */
 function getCartData(cart) {
    const { id, status, createdDate, lastUpdated, checkoutUrl, ...cartData } = cart;
    return cartData;
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
            properties: constructPropertiesFromOptions(cartItem.options)
        });
    }
    return cartItems;
}

function constructPropertiesFromOptions(options) {
    return options.map((option) => {
        return {
            name: 'With ' + option.name + ' (' + numberFormatter.format(option.price) + ')',
            value: option.id,
            displayResponse: 'visible'
        };
    });
}

function getOptionIdsFromProperties(properties) {
    return properties.map((property) => property.value);
}

export {
    getCartData,
    createCartItemsWithProperties,
    constructPropertiesFromOptions,
    getOptionIdsFromProperties
}
