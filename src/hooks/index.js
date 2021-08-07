import getFirebase from '$lib/firebase';
import cookie from 'cookie';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
    const { app } = await getFirebase();
    const cookies = cookie.parse(request.headers.cookie || '');
    let token;
    if (cookies.__session) {
        try {
            token = await app.auth().verifyIdToken(cookies.__session);
        } catch (error) {
            // All mutating requests should have a valid ID token
            if (request.method !== 'GET') {
                console.log(error, JSON.stringify(request));
            }
        }
    }

    const user = token && (await app.auth().getUser(token.uid));
    request.locals.user = user;

    return resolve(request);
}
