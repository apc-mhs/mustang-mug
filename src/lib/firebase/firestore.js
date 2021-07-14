import { Time } from '$lib/purchase/time';
import {
    CurrentPurchaseWindow,
    PurchaseWindow,
} from '$lib/purchase/window';

/**
 * @param {import("firebase/app").default.firestore.Firestore} firestore
 * @param {typeof import("firebase/app").default.firestore.Timestamp} Timestamp
 */
async function setupEmulatedFirestore(firestore, Timestamp) {
    const timestamp = Timestamp.now();

    await firestore
        .collection('items')
        .doc('mustang_brew')
        .set({
            name: 'Mustang Brew',
            price: 2.75,
            image: 'coffee.jpg',
            stock: true,
            options: [firestore.doc('/options/milk')],
            lastModified: timestamp,
        });

    await firestore.collection('items').doc('free_item').set({
        name: 'This item is free',
        price: 0,
        image: 'coffee.jpg',
        stock: false,
        options: [],
        lastModified: timestamp,
    });

    // Uncomment to load a large number of items in firestore
    // for (let i = 0; i < 10; i++) {
    //    firestore.collection('items').doc('free_item' + i).set({
    //        name: 'This item is free',
    //         price: 0,
    //        image: 'coffee.jpg',
    //        stock: true,
    //          options: [],
    //       lastModified: timestamp
    //    });
    //  }

    await firestore.collection('options').doc('milk').set({
        name: 'Milk',
        price: 0.5,
        stock: true,
        lastModified: timestamp,
    });

    for (let i = 0; i < 7; i++) {
        await firestore
            .collection('purchase_windows')
            .withConverter(PurchaseWindow.converter(Timestamp))
            .doc()
            .set(new PurchaseWindow(i, new Time(8), new Time(9), 20));

        await firestore
            .collection('purchase_windows')
            .withConverter(PurchaseWindow.converter(Timestamp))
            .doc()
            .set(new PurchaseWindow(i, new Time(11), new Time(12), 20));

        await firestore
            .collection('purchase_windows')
            .withConverter(PurchaseWindow.converter(Timestamp))
            .doc()
            .set(new PurchaseWindow(i, new Time(14), new Time(15), 20));
    }

    const now = new Date();
    await firestore
        .collection('purchase_windows')
        .withConverter(CurrentPurchaseWindow.converter(Timestamp))
        .doc('current')
        .set(
            new CurrentPurchaseWindow(
                now.getDay(),
                new Time(now.getHours() - 1, 0, 0),
                new Time(now.getHours() + 3, 0, 0),
                20,
                0
            )
        );
}

// https://github.com/firebase/snippets-node/blob/e5f6214059bdbc63f94ba6600f7f84e96325548d/firestore/main/index.js#L889-L921
async function deleteCollection(db, collectionPath, batchSize) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}

export { setupEmulatedFirestore, deleteCollection };
