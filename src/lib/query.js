import getFirebase from "./firebase";

function getDocuments(collection) {
    return getDocumentsWhere(collection, (queryable) => queryable);
}

async function getDocumentsWhere(collection, queryOnQueryable) {
    const { app, firebase } = await getFirebase();

    if (!(await getLastModified(collection))) {
        setLastModified(collection, firebase.firestore.Timestamp.fromMillis(0));
    }

    const [modified, cached] = await Promise.all([
        queryOnQueryable(
            app
                .firestore()
                .collection(collection)
                .where('lastModified', '>', await getLastModified(collection))
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

async function getLastModified(collection) {
    const { firebase } = await getFirebase();

    return localStorage.getItem(collection)
        ? firebase.firestore.Timestamp.fromMillis(
              localStorage.getItem(collection)
          )
        : null;
}

export { getDocuments, getDocumentsWhere };
