import * as admin from 'firebase-admin';
import 'firebase/firestore';
import 'firebase/auth';
import { config } from 'dotenv';
import path from 'path';
import { dev } from '$app/env';
import setupEmulatedFirestore from '$lib/firebase/firestore';

// Load firebase admin environment variables
if (dev) {
    config({ path: path.resolve(process.cwd(), '.env.development.local') });
}

const appName = import.meta.env.VITE_APP_NAME;

/** @returns {admin.app.App} */
export function loadFirebaseAdmin() {
    /** @type {admin.app.App} */
    let app;
    try {
        app = admin.app(appName);
    } catch (error) {
        app = admin.initializeApp(
            {
                credential: admin.credential.applicationDefault(),
                databaseURL: 'https://mustang-mug-default-rtdb.firebaseio.com',
            },
            appName
        );

        if (dev)
            setupEmulatedFirestore(
                app.firestore(),
                admin.firestore.Timestamp.now()
            );

        // The admin SDK automatically applies emulators
        // So no need to call the initializeDev method
    }
    return app;
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

export default loadFirebaseAdmin();

export { admin, deleteCollection };
