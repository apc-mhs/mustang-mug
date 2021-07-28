import getFirebase from '$lib/firebase';
import { getDocuments, getDocumentsWhere } from '$lib/query';
import { CurrentPurchaseWindow, PurchaseWindow } from './window';
import { browser } from '$app/env';

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
            try {
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
            } catch (e) {
                // If on the browser it's probably a correctly placed insufficient permissions error
                if (!browser) {
                    console.error(e);
                }
            }
            
            return purchaseWindow.toCurrent();
        }
    }

    try {
        await app
            .firestore()
            .doc('purchase_windows/current')
            .withConverter(CurrentPurchaseWindow.converter(firebase.firestore.Timestamp))
            .delete();   
    } catch (e) {}

    return null;
}

export {
    getCurrentPurchaseWindow,
    updateCurrentPurchaseWindow
}
