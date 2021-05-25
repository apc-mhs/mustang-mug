import { browser } from '$app/env';
import { getDocuments } from '$lib/query';

async function query() {
    // Only run the query on the browser to support caching
    return browser ? await getDocuments('items') : [];
}

export default query;
