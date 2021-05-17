import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { browser, dev } from '$app/env';

const appName = import.meta.env.VITE_APP_NAME;

/** @returns {firebase.app.App} */
function loadFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyCV6ig53QY9iBGj8evOZ5ZpAwuWKoaN1-w",
        authDomain: "mustang-mug.firebaseapp.com",
        databaseURL: "https://mustang-mug-default-rtdb.firebaseio.com",
        projectId: "mustang-mug",
        storageBucket: "mustang-mug.appspot.com",
        messagingSenderId: "11873316849",
        appId: "1:11873316849:web:1ce59140f262d724cd5e50",
        measurementId: "G-ZZP44VZMJH"
    };

    /** @type {firebase.app.App} */
    let app;
    try {
        app = firebase.app(appName);
    } catch (error) {
        app = firebase.initializeApp(firebaseConfig, appName);
        if (dev) {
            initializeDev(app);
        }
        if (browser) {
            app.firestore().enablePersistence()
                .catch((err) => {
                    console.error('Persistence failed to enable with error', err);
                });
        }
    }
    return app;
}


/** @param {firebase.app.App} app */
function initializeDev(app) {
    // I wonder if we can read these ports from the firebase.json somehow
    app.firestore().useEmulator('localhost', 8080);
    app.auth().useEmulator('http://localhost:9099');
}

export default loadFirebase();

export {
    firebase
}
