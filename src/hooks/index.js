import getFirebase from '$lib/firebase';
import cookie from 'cookie';

export async function handle({ request, resolve }) {
    const { app } = await getFirebase();
    const cookies = cookie.parse(request.headers.cookie || '');
    let token;
    if (cookies.__session) {
        try {
            token = await app.auth().verifyIdToken(cookies.__session);
        } catch (error) {
            console.log(error);
        }
    }

    const user = token && (await app.auth().getUser(token.uid));
    request.locals.user = user;

    return resolve(request);
}
