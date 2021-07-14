import { browser } from "$app/env";
import getFirebase from "./firebase";

// One day in milliseconds for cache to clear
const maxAge = 1000 * 60 * 60 * 24;

function getDocuments(collection, converter) {
    return getDocumentsWhere(collection, (queryable) => queryable, converter);
}

async function getDocumentsWhere(collection, queryOnQueryable, converter = null) {
    const { app, firebase } = await getFirebase();
    let lastModified = await getLastModified(collection);
    if (!lastModified || Date.now() - lastModified.toDate() > maxAge) {
        lastModified = firebase.firestore.Timestamp.fromMillis(0);
    }

    const [modified, cached] = await Promise.all([
        queryOnQueryable(
            app
                .firestore()
                .collection(collection)
                .withConverter(converter)
                .where('lastModified', '>', lastModified)
        ).get({ source: 'server' }),
        queryOnQueryable(app.firestore().collection(collection)).withConverter(converter).get({
            source: 'cache',
        }),
    ]).then((snapshots) => {
        return snapshots.map((snapshot) => snapshot.docs);
    });

    // Cached documents that were not modified
    const shouldCache = cached.filter(
        (cachedDoc) =>
            !modified.some((modifiedDoc) => modifiedDoc.id === cachedDoc.id)
    );

    const data = [...shouldCache, ...modified].map((doc) => {
        if (converter === null) {
            // Add all document ids as properties to the documents
            return { id: doc.id, ...doc.data() };
        }
        return doc.data();
    });

    if (modified.length > 0) {
        const lastModifiedDocument = data.reduce((prevHighest, current) => {
            return prevHighest.lastModified.valueOf() >
                current.lastModified.valueOf()
                ? prevHighest
                : current;
        });
        setLastModified(collection, lastModifiedDocument.lastModified);
    }
    return data;
}

function setLastModified(collection, lastModified) {
    if (browser) {
        localStorage.setItem(
            collection,
            // If it's a firestore timestamp, use toMillis. If it's a date use getTime
            lastModified.toMillis ? lastModified.toMillis() : lastModified.getTime()
        );
    }
}

async function getLastModified(collection) {
    const { firebase } = await getFirebase();

    if (browser) {
        return localStorage.getItem(collection)
            ? firebase.firestore.Timestamp.fromMillis(
                localStorage.getItem(collection)
            )
            : null;
    }
    return null;
}

export { getDocuments, getDocumentsWhere };
