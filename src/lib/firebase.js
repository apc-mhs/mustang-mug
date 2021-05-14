import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { authState } from 'rxfire/auth';
import { dev } from '$app/env';


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

const app = firebase.initializeApp(firebaseConfig);

const firestore = app.firestore();
const auth = app.auth();

if (dev) {
    // I wonder if we can read these ports from the firebase.json somehow
    firestore.useEmulator('localhost', 8080);
    auth.useEmulator('http://localhost:9099');
}

const currentUser = authState(auth);

export async function signInAnon() {
    try {
        return await auth.signInAnonymously();
    } catch (error) {
        console.error(error);
    }
}

export {
    currentUser,
    firestore,
    auth
}

export default app;
