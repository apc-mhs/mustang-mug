import app, { firebase } from '$lib/firebase/firebase';

function getDocuments(collection) {
    return getDocumentsWhere(collection, (queryable) => queryable);
}

async function getDocumentsWhere(collection, queryOnQueryable) {
    if (!getLastModified(collection)) {
        setLastModified(collection, firebase.firestore.Timestamp.fromMillis(0));
    }

    const [modified, cached] = await Promise.all([
        queryOnQueryable(
            app
                .firestore()
                .collection(collection)
                .where('lastModified', '>', getLastModified(collection))
        ).get(),
        queryOnQueryable(app.firestore().collection(collection)).get({
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
        // Add all document ids as properties to the documents
        return { id: doc.id, ...doc.data() };
    });
    if (modified.length > 0 && data.length > 0) {
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
    localStorage.setItem(collection, lastModified.toMillis());
}

function getLastModified(collection) {
    return localStorage.getItem(collection)
        ? firebase.firestore.Timestamp.fromMillis(
              localStorage.getItem(collection)
          )
        : null;
}

export { getDocuments, getDocumentsWhere };
