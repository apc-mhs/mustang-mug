import { browser } from '$app/env';
import app, { firebase } from '$lib/firebase/firebase';
import { authState } from 'rxfire/auth';
import { writable } from 'svelte/store';
import Cookies from 'js-cookie';
import { goto } from '$app/navigation';

const acceptableEmails = [];
const currentUser = browser ? authState(app.auth()) : writable(undefined);
if (browser) {
    async function updateSessionCookie(user) {
        Cookies.set('__session', user ? await user.getIdToken() : '', {
            sameSite: 'strict', secure: true, expires: 1, path: '/'
        });
    }

    currentUser.subscribe((user) => {
        updateSessionCookie(user);
    });

    app.auth().onIdTokenChanged(async (user) => {
        updateSessionCookie(user);
    });
}

/** @returns {Promise<import('firebase/app').User | undefined>} */
async function signInAnonymously() {
    // Don't sign in on the server
    if (!browser) {
        return;
    }

    // If the current user is signed in with Google (dashboard only)
    if (app.auth().currentUser && app.auth().currentUser.email) app.auth().signOut();

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

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    await app.auth().signInWithRedirect(provider);
    const result = await app.auth().getRedirectResult();

    if (!acceptableEmails.includes(result.user.email) && !dev) {
        goto('/');
    }
}

export {
    currentUser,
    signInAnonymously,
    signInWithGoogle
}
