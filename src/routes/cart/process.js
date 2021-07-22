import getFirebase from '$lib/firebase';
import { getAuthorization } from '$lib/msb';
import { getCurrentPurchaseWindow } from '$lib/purchase';
import { CurrentPurchaseWindow } from '$lib/purchase/window';
import { getCart } from './_cart';

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ query }) {
    const { app, firebase } = await getFirebase();

    const cartId = query.get('cartID');
    if (!cartId) {
        return await writeProcessingError('Cart Id was not present in query parameters');
    }

    const [cart, cartSnapshot] = await Promise.all([
        getCart(cartId),
        app.firestore()
            .collection('carts')
            .where('cartId', '==', cartId)
            .get()
    ]);
    if (cartSnapshot.empty) {
        return await writeProcessingError('Cart Id does not reference an existing cart');
    }

    const cartDocument = cartSnapshot.docs[0];

    const currentPurchaseWindow = await getCurrentPurchaseWindow();
    if (!currentPurchaseWindow || currentPurchaseWindow.exhausted) {
        return await writeProcessingError(
            'You can\'t checkout right now because too many orders have been placed. Check back later',
            cartDocument.id
        );
    }

    // TODO: Get cart items and make sure they are all in stock

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
    if (!res.resultCodes.every((code) => /confirmation code/.test(code))) {
        console.error(res);
        return writeProcessingError('MSB API Processing Request Failure. Try again later', cartDocument.id);
    }

    currentPurchaseWindow.orders++;
    currentPurchaseWindow.lastModified = new Date();
    await app
        .firestore()
        .collection('purchase_windows')
        .doc('current')
        .withConverter(CurrentPurchaseWindow.converter(firebase.firestore.Timestamp))
        .set(currentPurchaseWindow);

    // Currently the pick up time is simply the next multiple of 5 mins from NOW
    // unless the next multiple of 5 is within 2.5 mins, in which case its the one after
    // In the future this may be specified by the user
    const pickUpTime = new Date();
    pickUpTime.setSeconds(0, 0);
    pickUpTime.setMinutes((Math.round(pickUpTime.getMinutes() / 5) * 5) + 5);

    await app
        .firestore()
        .collection('orders')
        .doc(cartDocument.id)
        .set({
            pickUpTime: firebase.firestore.Timestamp.fromDate(pickUpTime),
            cartId
        });

    const formatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    await app
        .firestore()
        .collection('carts')
        .doc(cartDocument.id)
        .set({
            cartId: '',
            resultCodes: res.resultCodes || [],
            resultStatus: 'Processed Successfully. Your order will be ready at ' + formatter.format(pickUpTime),
        });

    return {
        status: 302,
        headers: {
            Location: '/confirmation',
        },
    };
}

async function writeProcessingError(message, cartDocumentId) {
    if (cartDocumentId) {
        const { app } = await getFirebase();

        await app
            .firestore()
            .collection('carts')
            .doc(cartDocumentId)
            .set({
                cartId: '',
                resultStatus: message,
            });
    }

    return {
        status: 302,
        headers: {
            Location: '/failure',
        },
    };
}
