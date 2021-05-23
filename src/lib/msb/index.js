import { ApiClient } from 'msb_pay_api';

const clientId = 'CP_5101290_test';
const departmentId = 'msbpay_api_dept';
const storeId = 'msbpay_api_store';
const paymentMethodId = 'msbpay_api';
const baseURL = 'https://test.www.myschoolbucks.com/msbpay/v2';
const client = new ApiClient();
client.basePath = baseURL;

function getAuthorization() {
    return process.env['MSB_API_KEY'];
}

/**
 * Turn a cart object received from the MSB Pay API
 * into a cart object that can be used for updating
 * a cart's data. Essentially removes all metadata.
 */
function getCartData(cart) {
    const { id, status, createdDate, lastUpdated, checkoutUrl, ...cartData } = cart;
    return cartData;
}

export {
    client,
    getAuthorization,
    clientId,
    departmentId,
    storeId,
    paymentMethodId,
    getCartData
}
