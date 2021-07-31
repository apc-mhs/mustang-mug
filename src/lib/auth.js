import { browser, dev } from '$app/env';
import Cookies from 'js-cookie';
import { goto } from '$app/navigation';
import getFirebase from './firebase';
import { readable } from 'svelte/store';

if (browser) {
    async function updateSessionCookie(user) {
        Cookies.set('__session', user ? await user.getIdToken() : '', {
            sameSite: 'strict',
            secure: true,
            expires: 1,
            path: '/',
        });
    }

    getFirebase().then(({ app }) => {
        app.auth().onIdTokenChanged(updateSessionCookie);
        app.auth().onAuthStateChanged(updateSessionCookie);
    });
}

const currentUser = readable(null, (set) => {
    let unsubscribe = () => {};
    if (browser) {
        getFirebase().then(({ app }) => {
            unsubscribe = app.auth().onAuthStateChanged(set);
        });
    }
    // Must use an arrow function to create a closure
    return () => unsubscribe();
});

function isAdmin(user) {
    return dev || user.customClaims['admin'];
}

/** @returns {Promise<import('firebase/app').User | undefined>} */
async function signInAnonymously() {
    // Don't sign in on the server
    if (!browser) {
        return;
    }

    const { app } = await getFirebase();

    // If the current user is signed in with Google (dashboard only)
    if (app.auth().currentUser && app.auth().currentUser.email)
        app.auth().signOut();

    try {
        return await app.auth().signInAnonymously();
    } catch (error) {
        console.error(error);
    }
}

async function signInWithGoogle() {
    // Don't sign in on the server
    if (!browser) {
        return;
    }

    const { app, firebase } = await getFirebase();
    
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    await app.auth().signInWithRedirect(provider);
    const result = await app.auth().getRedirectResult();

    if (!acceptableEmails.includes(result.user.email) && !dev) {
        goto('/');
    }
}

async function signOut() {
    const { app } = await getFirebase();
    await app.auth().signOut();
}

export { currentUser, isAdmin, signInAnonymously, signInWithGoogle, signOut };
