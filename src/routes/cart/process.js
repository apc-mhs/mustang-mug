import getFirebase from '$lib/firebase';
import { getAuthorization } from '$lib/msb';
import { getCurrentPurchaseWindow } from '$lib/purchase';
import { CurrentPurchaseWindow } from '$lib/purchase/window';
import { getCart, removeDeletedItems, removeOutOfStockItems } from '$lib/cart';
import api from '$lib/msb/api';

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
            cartDocument.id,
            cartId
        );
    }

    const savedCartItems = cart.cartItems;
    await Promise.all([
        removeOutOfStockItems(cart),
        removeDeletedItems(cart),
    ]);
    
    if (savedCartItems.length !== cart.cartItems.length) {
        return await writeProcessingError(
            'Your order could not be processed because some items were marked as out of stock.',
            cartDocument.id,
            cartId
        );
    }

    const processResponse = await api.post(`/carts/${cartId}/process`);

    // Make sure every result code has a confirmation code. This is deemed "successful"
    // https://www.myschoolbucks.com/ver2/developer/msbpayapi
    // "How will I know if a payment is successful after it is processed?"
    if (!processResponse.resultCodes.every((code) => /confirmation code/.test(code))) {
        console.error(processResponse);
        return writeProcessingError(
            'MSB API Processing Request Failure. Try again later',
            cartDocument.id,
            cartId
        );
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

    const paymentResponse = await api.get(`/carts/${cartId}/payments`);
    if (!paymentResponse || paymentResponse.errors.length > 0) {
        // Don't pass a MSB cart id so as not to delete their cart
        return writeProcessingError(
            `MSB API Payment Fetch Failure. Please save the following information and contact store services:
            Cart ID: ${cartId}, Payment IDs: ${JSON.stringify(processResponse.paymentIds)}`,
            cartDocument.id
        );
    }

    await app
        .firestore()
        .collection('orders')
        .doc()
        .set({
            pickUpTime: firebase.firestore.Timestamp.fromDate(pickUpTime),
            userId: cartDocument.id,
            cartPayments: paymentResponse.cartPayments,
            cartId,
        });

    const formatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    await app
        .firestore()
        .collection('carts')
        .doc(cartDocument.id)
        .set({
            cartId: '',
            resultCodes: processResponse.resultCodes || [],
            resultStatus: 'Processed Successfully. Your order will be ready at ' + formatter.format(pickUpTime),
        });

    return {
        status: 302,
        headers: {
            Location: '/confirmation',
        },
    };
}

async function writeProcessingError(message, cartDocumentId, cartId) {
    if (cartDocumentId) {
        const { app } = await getFirebase();

        const cartData = {
            resultStatus: message,
            resultCodes: ['Error. Your cart had to be reset in response to this issue. You were not charged.'],
        };

        if (cartId) {
            cartData.cartId = '';

            await api.delete(`/carts/${cartId}`);
        }

        await app
            .firestore()
            .collection('carts')
            .doc(cartDocumentId)
            .set(cartData, {
                merge: true
            });
    }

    return {
        status: 302,
        headers: {
            Location: '/failure',
        },
    };
}
