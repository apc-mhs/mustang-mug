import getFirebase from '$lib/firebase';
import { getDocuments } from '$lib/query';
import { CurrentPurchaseWindow, PurchaseWindow } from './window';

/** 
 * @returns {Promise<CurrentPurchaseWindow?>}
 */
async function getCurrentPurchaseWindow() {
    const { app, firebase } = await getFirebase();

    let currentPurchaseWindow = await app
        .firestore()
        .doc('purchase_windows/current')
        .withConverter(CurrentPurchaseWindow.converter(firebase.firestore.Timestamp))
        .get({ source: 'server' });

    if (!currentPurchaseWindow.exists || !currentPurchaseWindow.data().current) {
        currentPurchaseWindow = await updateCurrentPurchaseWindow();
    } else {
        currentPurchaseWindow = currentPurchaseWindow.data();
    }

    return currentPurchaseWindow;
}

async function updateCurrentPurchaseWindow() {
    const { app, firebase } = await getFirebase();

    const purchaseWindows = await getDocuments(
        'purchase_windows',
        PurchaseWindow.converter(firebase.firestore.Timestamp)
    );
    for (let purchaseWindow of purchaseWindows.map((doc) => doc.data())) {
        if (purchaseWindow.current) {
            await app
                .firestore()
                .doc('purchase_windows/current')
                .withConverter(CurrentPurchaseWindow.converter(firebase.firestore.Timestamp))
                .set(purchaseWindow.toCurrent());
            return purchaseWindow.toCurrent();
        }
    }

    return null;
}

export {
    getCurrentPurchaseWindow
}
