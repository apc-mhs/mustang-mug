/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function post({ body }) {
    console.log(body);
    // Check if cart has out of stock items and fail.
    const failure = true;

    if (failure) {
        return {
            status: 302,
            headers: {
                Location: '/failure'
            }
        };
    }

    return {
        status: 302,
        headers: {
            Location: '/confirmation'
        }
    }
}