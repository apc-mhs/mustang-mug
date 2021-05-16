import { browser } from '$app/env';
import app from '$lib/firebase/firebase';
import { authState } from 'rxfire/auth';
import { writable } from 'svelte/store';
import Cookies from 'js-cookie';


const currentUser = browser ? authState(app.auth()) : writable(undefined);
if (browser) {
    app.auth().onIdTokenChanged(async (user) => {
        Cookies.set('__session', user ? await user.getIdToken() : '', {
           sameSite: 'strict', secure: true, expires: 1, path: '/'
        });
    })
}

/** @returns {Promise<import('firebase/app').User | undefined>} */
async function signInAnonymously() {
    // Don't sign in on the server
    if (!browser) {
        return;
    }

    try {
        return await app.auth().signInAnonymously();
    } catch (error) {
        console.error(error);
    }
}

export {
    currentUser,
    signInAnonymously
}
