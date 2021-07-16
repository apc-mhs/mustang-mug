import { getAuthorization, baseURL } from ".";

const defaultHeaders = {
    Accept: 'application/json',
};

async function request(
    url,
    method,
    headers = defaultHeaders,
    data
) {
    const res = await fetch(`${baseURL}${url}`, {
        method: method,
        headers: { ...defaultHeaders, ...headers, Authorization: getAuthorization(), },
        body: data,
    });
    if (!res.ok) {
        throw new Error(`Request for ${url} failed with error: ${res.statusText}`);h
    }
    
    let json;
    try {
        json = await res.json();
    } catch (e) {
        throw new Error(`JSON decoding failed for ${url} with body ${await res.text()}`);
    }

    return json;
}

const api = {
    request: async function(url, method, headers, data, ignoreExceptions = false) {
        return request(url, method, headers, data)
                .then((value) => value, (e) => ignoreExceptions || console.error(e), null);
    },
    get: async function(url, ignoreExceptions = false) {
        return await this.request(url, 'GET', undefined, undefined, ignoreExceptions);
    },
    post: async function(url, data, headers = defaultHeaders) {
        return await this.request(
            url,
            'POST',
            {
                ...headers,
                'Content-Type': 'application/json',
            },
            JSON.stringify(data)
        );
    },
    put: async function(url, data, headers = defaultHeaders) {
        return await this.request(
            url,
            'PUT',
            {
                ...headers,
                'Content-Type': 'application/json',
            },
            JSON.stringify(data)
        );
    },
    delete: async function(url) {
        return await this.request(url, 'DELETE');
    },
};

export default api;
