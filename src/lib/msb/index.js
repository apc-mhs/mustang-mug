import { ApiClient } from 'msb_pay_api';

const baseURL = 'https://test.www.myschoolbucks.com/msbpay/v2';
const client = new ApiClient();
client.basePath = baseURL;

async function getAuthorization() {
    return process.env['MSB_API_KEY'];
}

export {
    client,
    getAuthorization
}
