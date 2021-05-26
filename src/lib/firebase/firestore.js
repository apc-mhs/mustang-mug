import firebase from 'firebase/app';
import 'firebase/firestore';

/** @param {import("firebase/app").default.firestore.Firestore} firestore */
export default function setupEmulatedFirestore(firestore) {
    firestore.collection('items').doc('mustang_brew').set({
       name: 'Mustang Brew',
       price: 2.75,
       image: 'coffee.jpg',
       stock: true,
       options: [
           firestore.doc('/options/milk')
       ],
       lastModified: firebase.firestore.Timestamp.fromDate(new Date())
    });

    firestore.collection('items').doc('free_item').set({
        name: 'This item is free',
        price: 0,
        image: 'coffee.jpg',
        stock: true,
        options: [],
        lastModified: firebase.firestore.Timestamp.fromDate(new Date())
    });

    firestore.collection('options').doc('milk').set({
        name: 'Milk',
        price: 0.5,
        stock: true,
        lastModified: firebase.firestore.Timestamp.fromDate(new Date())
    });
}
