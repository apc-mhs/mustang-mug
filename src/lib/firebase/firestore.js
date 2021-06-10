import { CurrentPurchaseWindow, PurchaseWindow, Time } from "$lib/purchase/window";

/** @param {import("firebase/app").default.firestore.Firestore} firestore */
export default function setupEmulatedFirestore(firestore, timestamp) {
    firestore
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

    firestore.collection('items').doc('free_item').set({
        name: 'This item is free',
        price: 0,
        image: 'coffee.jpg',
        stock: false,
        options: [],
        lastModified: timestamp,
    });

    // Uncomment to load a large number of items in firestore
    // for (let i = 0; i < 10; i++) {
    //     firestore.collection('items').doc('free_item' + i).set({
    //         name: 'This item is free',
    //         price: 0,
    //         image: 'coffee.jpg',
    //         stock: true,
    //         options: [],
    //         lastModified: timestamp
    //     });
    // }

    firestore.collection('options').doc('milk').set({
        name: 'Milk',
        price: 0.5,
        stock: true,
        lastModified: timestamp,
    });

    for (let i = 0; i < 7; i++) {
        firestore.collection('purchase_windows').doc().set(
            PurchaseWindow.converter.toFirestore(new PurchaseWindow(i, new Time(1, 8, 5), new Time(1, 9, 30), 20))
        );

        firestore.collection('purchase_windows').withConverter(PurchaseWindow.converter).doc().set(
            new PurchaseWindow(i, new Time(1, 11, 5), new Time(1, 12, 30), 20)
        );

        firestore.collection('purchase_windows').withConverter(PurchaseWindow.converter).doc().set(
            new PurchaseWindow(i, new Time(1, 1, 5), new Time(1, 2, 50), 20)
        );
    }

    const now = new Date();
    firestore.collection('purchase_windows').withConverter(CurrentPurchaseWindow.converter).doc('current').set(
        new CurrentPurchaseWindow(now.getDay(), new Time(now.getHours() - 1, 0, 0), new Time(now.getHours() + 3, 0, 0), 20, 0)
    );
}
