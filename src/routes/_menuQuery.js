import { browser } from '$app/env';
import app, { firebase } from '$lib/firebase/firebase';

async function query() {
    // Only run the query on the browser to support caching
    return browser ? await getDocuments('items') : [];
}

async function getDocuments(collection) {
    let anyModified = true;
    if (getLastModified(collection)) {
        const snapshot = await app.firestore().collection(collection)
            .where('lastModified', '>', getLastModified(collection))
            .get();
        
        anyModified = snapshot.docs.length > 0;
    }

    let snapshot;
    if (!anyModified) {
        snapshot = await app.firestore().collection(collection).get({ source: 'cache' });
    }

    if (anyModified || snapshot.empty) {
        snapshot = await app.firestore().collection(collection).get();
    }

    const data = snapshot.docs.map((doc) => doc.data());
    if (!snapshot.metadata.fromCache && data.length > 0) {
        setLastModified(
            collection, 
            data.reduce((prevHighest, current) => {
                return prevHighest.lastModified > current.lastModified ? prevHighest : current, data[0]
            }).lastModified
        );
    }
    return data;
}

function setLastModified(collection, lastModified) {
    localStorage.setItem(collection, lastModified.toMillis());
}

function getLastModified(collection) {
    return firebase.firestore.Timestamp.fromMillis(localStorage.getItem(collection));
}

export default query;
