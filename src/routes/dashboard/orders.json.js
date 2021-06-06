/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ query }) {
    const id = query.get('id');
    if (id) {
        const paymentData = await fetch(`https://test.www.myschoolbucks.com/msbpay/v2/carts/${id}/payments`, {
            headers: {
                Authorization: getAuthorization(),
            },
        }).then((res) => res.json());
        const success = paymentData.errors.length === 0;

        return {
            status: success ? 200 : 500,
            body: success ? paymentData.cartPayments : paymentData.errors,
        }
    }

    return {
        status: 400,
        body: 'No payment id specified',
    }
}
