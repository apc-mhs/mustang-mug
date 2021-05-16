import { currentUser } from '$lib/auth';
import app from '$lib/firebase/firebaseAdmin';
import cookie from 'cookie';

export async function handle({ request, render }) {
    const cookies = cookie.parse(request.headers.cookie || '');
    let token;
    if (cookies.token) {
        try {
            token = await app.auth().verifyIdToken(cookies.token);
        } catch (error) { 
            console.log(error);
        }
    }
    
    const user = token && await app.auth().getUser(token.uid);
    currentUser.set(user);
    request.locals.user = user;

    return render(request);
}
