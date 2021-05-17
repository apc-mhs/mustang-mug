import { browser } from '$app/env';
import app, { firebase } from '$lib/firebase/firebase';

async function query() {
    // Only run the query on the browser to support caching
    return browser ? await getDocuments('items') : [];
}

async function getDocuments(collection) {
    if (!getLastModified(collection)) {
        setLastModified(collection, firebase.firestore.Timestamp.fromMillis(0));
    }

    const [ modified, cached ] = await Promise.all([
        app.firestore().collection(collection).where('lastModified', '>', getLastModified(collection)).get(),
        app.firestore().collection(collection).get({ source: 'cache' })
    ]).then((snapshots) => {
        return snapshots.map((snapshot) => snapshot.docs);
    });

    console.log('Modified:', modified.map((doc) =>doc.id));

    // Cached documents that were not modified
    const shouldCache = cached.filter((cachedDoc) => !modified.some((modifiedDoc) => modifiedDoc.id === cachedDoc.id));
    console.log('Cache:', shouldCache.map((doc) => doc.id));
    const data = [...shouldCache, ...modified].map((doc) => doc.data());
    if (modified.length > 0 && data.length > 0) {
        const lastModifiedDocument = data.reduce((prevHighest, current) => {
            return prevHighest.lastModified.valueOf() > current.lastModified.valueOf() ? prevHighest : current;
        });
        setLastModified(
            collection, 
            lastModifiedDocument.lastModified
        );
    }
    return data;
}

function setLastModified(collection, lastModified) {
    localStorage.setItem(collection, lastModified.toMillis());
}

function getLastModified(collection) {
    return localStorage.getItem(collection) ? firebase.firestore.Timestamp.fromMillis(localStorage.getItem(collection)) : null;
}

export default query;
