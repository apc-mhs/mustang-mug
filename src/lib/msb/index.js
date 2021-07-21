import { ApiClient } from 'msb_pay_api';

const clientId = 'CP_5101290_test';
const departmentId = 'food_services';
const storeId = 'food_services_store';
const paymentMethodId = 'food_services';
const baseURL = 'https://test.www.myschoolbucks.com/msbpay/v2';
const client = new ApiClient();
client.basePath = baseURL;

function getAuthorization() {
    return process.env['MSB_API_KEY'];
}

export {
    client,
    getAuthorization,
    clientId,
    departmentId,
    storeId,
    paymentMethodId,
    baseURL
};
