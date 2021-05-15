import { currentUser } from '$lib/auth';
import app from '$lib/firebase/firebaseAdmin';
import cookie from 'cookie';

export async function handle({ request, render }) {
    const cookies = cookie.parse(request.headers.cookie);
    let token;
    try {
        token = await app.auth().verifyIdToken(cookies.token);
    } catch (error) { 
        console.log(error);
    }
    currentUser.set(token ? await app.auth().getUser(token.uid) : undefined);

    return render(request);
}
