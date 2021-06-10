import app from '$lib/firebase/firebase';
import { CurrentPurchaseWindow, PurchaseWindow } from './window';

async function getCurrentPurchaseWindow() {
    let currentPurchaseWindow = await app
        .firestore()
        .doc('purchase_windows/current')
        .withConverter(CurrentPurchaseWindow.converter)
        .get();

    if (!currentPurchaseWindow.exists || !currentPurchaseWindow.data().current) {
        currentPurchaseWindow = await updateCurrentPurchaseWindow();
    }

    return currentPurchaseWindow;
}

async function updateCurrentPurchaseWindow() {
    const purchaseWindows = await app
        .firestore()
        .collection('purchase_windows')
        .withConverter(PurchaseWindow.converter)
        .get();

    for (let purchaseWindow of purchaseWindows.docs.map((snapshot) => snapshot.data())) {
        if (purchaseWindow.current) {
            const current = purchaseWindow.toCurrent();
            await app
                .firestore()
                .doc('purchase_windows/current')
                .withConverter(CurrentPurchaseWindow.converter)
                .set(current);
            return current;
        }
    }

    return null;
}

export {
    getCurrentPurchaseWindow
}
