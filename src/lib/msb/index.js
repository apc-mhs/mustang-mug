import { ApiClient } from 'msb_pay_api';

const clientId = 'CP_5101290_test';
const departmentId = 'msbpay_api_dept';
const storeId = 'food_services_store';
const paymentMethodId = 'msbpay_api';
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
};
