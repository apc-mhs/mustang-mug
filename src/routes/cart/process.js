import getFirebase from '$lib/firebase';
import { getAuthorization } from '$lib/msb';
import { getCart } from './_cart';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ query }) {
    const cartId = query.get('cartID');
    if (cartId) {
        const [cart, cartSnapshot] = await Promise.all([
            getCart(cartId),
            app.firestore()
                .collection('carts')
                .where('cartId', '==', cartId)
                .get()
        ]);

        if (!cartSnapshot.empty) {
            const cartDocument = cartSnapshot.docs[0];

            // TODO: Get cart items and make sure they are all in stock
            // And confirm that their checkout time is still available

            if (true) {
                const res = await fetch(
                    `https://test.www.myschoolbucks.com/msbpay/v2/carts/${cartId}/process`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: getAuthorization(),
                        },
                    }
                ).then((res) => res.json());

                await app
                    .firestore()
                    .collection('carts')
                    .where('cartId', '==', cartId)
                    .get();

                if (!cartSnapshot.empty) {
                    const { app } = await getFirebase();
                    const cartDocument = cartSnapshot.docs[0];
                    await app
                        .firestore()
                        .collection('carts')
                        .doc(cartDocument.id)
                        .set({
                            cartId: '',
                            resultCodes: res.resultCodes || [],
                            resultStatus: 'processing_success'
                        });
                }

                // Make sure every result code has a confirmation code. This is deemed "successful"
                // https://www.myschoolbucks.com/ver2/developer/msbpayapi
                // "How will I know if a payment is successful after it is processed?"
                if (res.resultCodes.every((code) => /confirmation code/.test(code))) {
                    await app
                        .firestore()
                        .collection('payments')
                        .doc(res.cartId)
                        .set({
                            pickUpTime: admin.firestore.Timestamp.fromDate(new Date(2021, 8, 31, 7, 30))
                        });
                    
                    return {
                        status: 302,
                        headers: {
                            Location: '/confirmation',
                        },
                    };
                }
            } else {
                await app
                    .firestore()
                    .collection('carts')
                    .doc(cartDocument.id)
                    .set({
                        cartId: '',
                        resultStatus: 'processing_failure',
                    });
            }
        }
    }

    return {
        status: 302,
        headers: {
            Location: '/failure',
        },
    };
}
