import { getAuthorization } from '$lib/msb';
import app from '$lib/firebase/firebaseAdmin';
import { getCart } from './_cart';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ query }) {
    const cartId = query.get('cartID');
    if (cartId) {
        // TODO: Get cart items and make sure they are all in stock
        // And confirm that their checkout time is still available

        const cart = await getCart(cartId);

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

            // Make sure every result code has a confirmation code. This is deemed "successful"
            // https://www.myschoolbucks.com/ver2/developer/msbpayapi
            // "How will I know if a payment is successful after it is processed?"
            if (
                res.resultCodes.every((code) => /confirmation code/.test(code))
            ) {
                const cartSnapshot = await app
                    .firestore()
                    .collection('carts')
                    .where('cartId', '==', cartId)
                    .get();

                if (!cartSnapshot.empty) {
                    const cartDocument = cartSnapshot.docs[0];
                    await app
                        .firestore()
                        .collection('carts')
                        .doc(cartDocument.id)
                        .set(
                            {
                                cartId: '',
                                resultCodes: res.resultCodes,
                            },
                            {
                                merge: true,
                            }
                        );

                    await app
                        .firestore()
                        .collection('payments')
                        .doc(cartDocument.id)
                        .set({
                            paymentIds: res.paymentIds,
                        });

                    return {
                        status: 302,
                        headers: {
                            Location: '/confirmation',
                        },
                    };
                }
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
