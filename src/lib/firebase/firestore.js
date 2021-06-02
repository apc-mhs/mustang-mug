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
        stock: true,
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
}
