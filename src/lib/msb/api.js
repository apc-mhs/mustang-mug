import { getAuthorization, baseURL } from ".";

const defaultHeaders = {
    Accept: 'application/json',
    Authorization: getAuthorization(),
};

async function request(
    url,
    method,
    headers = defaultHeaders,
    data
) {
    const res = await fetch(`${baseURL}${url}`, {
        method: method,
        mode: method !== 'GET' ? 'cors' : undefined,
        headers: { ...defaultHeaders, ...headers },
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
    get: async (url) => {
        return await request(url, 'GET');
    },
    post: async (url, data, headers = defaultHeaders) => {
        return await request(
            url,
            'POST',
            {
                ...headers,
                'Content-Type': 'application/json',
            },
            JSON.stringify(data)
        );
    },
    put: async (url, data, headers = defaultHeaders) => {
        return await request(
            url,
            'PUT',
            {
                ...headers,
                'Content-Type': 'application/json',
            },
            JSON.stringify(data)
        );
    },
    delete: async (url) => {
        return await request(url, 'DELETE');
    },
};

export default api;
