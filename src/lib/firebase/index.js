import { browser, dev } from '$app/env';
import { setupEmulatedFirestore } from '$lib/firebase/firestore';
import { config as loadConfig } from 'dotenv';
import path from 'path';

const appName = import.meta.env.VITE_APP_NAME;
const firebaseConfig = {
    apiKey: 'AIzaSyCV6ig53QY9iBGj8evOZ5ZpAwuWKoaN1-w',
    authDomain: 'mustang-mug.firebaseapp.com',
    databaseURL: 'https://mustang-mug-default-rtdb.firebaseio.com',
    projectId: 'mustang-mug',
    storageBucket: 'mustang-mug.appspot.com',
    messagingSenderId: '11873316849',
    appId: '1:11873316849:web:1ce59140f262d724cd5e50',
    measurementId: 'G-ZZP44VZMJH',
};

/** @returns {Promise<{app: import("firebase/app").default.app.App, firebase: import("firebase/app").default}>} */
async function getFirebase() {
    const firebase = browser ? (await import('firebase/app')).default : (await import('firebase-admin')).default;
    await import('firebase/firestore');
    await import('firebase/auth');

    /** @type {import("firebase/app").default.app.App} */
    let app;
    try {
        app = firebase.app(appName);
    } catch (error) {
        if (!browser && dev) {
            // Load firebase admin environment variables
            loadConfig({ path: path.resolve(process.cwd(), '.env.development.local') });
        }

        const config = browser ? firebaseConfig : {
            credential: firebase.credential.applicationDefault()
        };
        app = firebase.initializeApp(config, appName);

        if (browser) {
            if (dev) initializeDev(app);

            app.firestore()
                .enablePersistence()
                .catch((err) => {
                    console.error(
                        'Persistence failed to enable with error',
                        err
                    );
                });
        } else {
            if (dev) setupEmulatedFirestore(app.firestore(), firebase.firestore.Timestamp);
        }
    }

    return {
        app,
        firebase
    };
}

/** @param {import("firebase/app").default.app.App} app */
function initializeDev(app) {
    // I wonder if we can read these ports from the firebase.json somehow
    app.firestore().useEmulator('localhost', 8080);
    app.auth().useEmulator('http://localhost:9099');
}

export default getFirebase;