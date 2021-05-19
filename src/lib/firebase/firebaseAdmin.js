import * as admin from 'firebase-admin';
import 'firebase/firestore';
import 'firebase/auth';
import { config } from 'dotenv';
import path from 'path';
import { dev } from '$app/env';

// Load firebase admin environment variables
if (dev) {
    config({ path: path.resolve(process.cwd(), '.env.development.local') });
}

const appName = import.meta.env.VITE_APP_NAME;

/** @returns {admin.app.App} */
export function loadFirebaseAdmin() {
    // Load admin SDK programatically so it won't appear in client
    // const admin = await import('firebase-admin');

    /** @type {admin.app.App} */
    let app;
    try {
        app = admin.app(appName);
    } catch (error) {
        app = admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            databaseURL: "https://mustang-mug-default-rtdb.firebaseio.com"
        }, appName);
        // The admin SDK automatically applies emulators
        // So no need to call the initializeDev method
    }
    return app;
}

export default loadFirebaseAdmin();

export {
    admin
}
