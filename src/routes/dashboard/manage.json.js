import { dev } from '$app/env';
import { isAdmin } from '$lib/auth';
import getFirebase from '$lib/firebase';
import { deleteCollection } from '$lib/firebase/firestore';
import api from '$lib/msb/api';
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function del({ locals }) {
    const user = locals.user;

    if (!user || !(user.email || dev)) {
        return {
            status: 400,
            body: "Can't manipulate a cart before signing in",
        };
    }

    if (!isAdmin(user)) {
        return {
            status: 400,
            body: 'Insufficient permissions',
        }
    }

    const { carts } = await api.get('/carts');

    await Promise.all(
        carts.map((cart) => {
            return api.delete(`/carts/${cart.id}`);
        })
    );

    const { app } = await getFirebase();
    await deleteCollection(app.firestore(), 'carts', 200);

    return {
        status: 200,
        body: 'Success',
    };
}
