import getFirebase from '$lib/firebase';
import { getDocuments, getDocumentsWhere } from '$lib/query';
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

async function updateCurrentPurchaseWindow(merge = false) {
    const { app, firebase } = await getFirebase();

    const purchaseWindows = await getDocuments('purchase_windows');
    for (let purchaseWindowRaw of purchaseWindows) {
        if (purchaseWindowRaw.id === 'current') continue;
        const purchaseWindow = PurchaseWindow.converter(firebase.firestore.Timestamp).fromFirestore({
            data: () => purchaseWindowRaw
        });

        if (purchaseWindow.current) {
            if (merge) {
                await app
                    .firestore()
                    .doc('purchase_windows/current')
                    .withConverter(PurchaseWindow.converter(firebase.firestore.Timestamp))
                    .set(purchaseWindow, {
                        merge: true
                    });
            } else {
                await app
                    .firestore()
                    .doc('purchase_windows/current')
                    .withConverter(CurrentPurchaseWindow.converter(firebase.firestore.Timestamp))
                    .set(purchaseWindow.toCurrent());
            }
            
            return purchaseWindow.toCurrent();
        }
    }

    await app
        .firestore()
        .doc('purchase_windows/current')
        .withConverter(CurrentPurchaseWindow.converter(firebase.firestore.Timestamp))
        .delete();

    return null;
}

export {
    getCurrentPurchaseWindow,
    updateCurrentPurchaseWindow
}
