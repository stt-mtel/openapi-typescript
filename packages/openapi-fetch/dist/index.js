// settings & const
const DEFAULT_HEADERS = {
    "Content-Type": "application/json",
};
const TRAILING_SLASH_RE = /\/*$/;
/** serialize query params to string */
export function defaultQuerySerializer(q) {
    const search = new URLSearchParams();
    if (q && typeof q === "object") {
        for (const [k, v] of Object.entries(q)) {
            if (v === undefined || v === null)
                continue;
            search.set(k, v);
        }
    }
    return search.toString();
}
/** serialize body object to string */
export function defaultBodySerializer(body) {
    return JSON.stringify(body);
}
/** Construct URL string from baseUrl and handle path and query params */
export function createFinalURL(url, options) {
    let finalURL = `${options.baseUrl ? options.baseUrl.replace(TRAILING_SLASH_RE, "") : ""}${url}`;
    if (options.params.path) {
        for (const [k, v] of Object.entries(options.params.path))
            finalURL = finalURL.replace(`{${k}}`, encodeURIComponent(String(v)));
    }
    if (options.params.query) {
        const search = options.querySerializer(options.params.query);
        if (search)
            finalURL += `?${search}`;
    }
    return finalURL;
}
export default function createClient(clientOptions = {}) {
    const { fetch = globalThis.fetch, querySerializer: globalQuerySerializer, bodySerializer: globalBodySerializer, ...options } = clientOptions;
    const defaultHeaders = new Headers({
        ...DEFAULT_HEADERS,
        ...(options.headers ?? {}),
    });
    async function coreFetch(url, fetchOptions) {
        const { headers, body: requestBody, params = {}, parseAs = "json", querySerializer = globalQuerySerializer ?? defaultQuerySerializer, bodySerializer = globalBodySerializer ?? defaultBodySerializer, ...init } = fetchOptions || {};
        // URL
        const finalURL = createFinalURL(url, { baseUrl: options.baseUrl, params, querySerializer });
        // headers
        const baseHeaders = new Headers(defaultHeaders); // clone defaults (don’t overwrite!)
        const headerOverrides = new Headers(headers);
        for (const [k, v] of headerOverrides.entries()) {
            if (v === undefined || v === null)
                baseHeaders.delete(k); // allow `undefined` | `null` to erase value
            else
                baseHeaders.set(k, v);
        }
        // fetch!
        const requestInit = {
            redirect: "follow",
            ...options,
            ...init,
            headers: baseHeaders,
        };
        if (requestBody)
            requestInit.body = bodySerializer(requestBody);
        // remove `Content-Type` if serialized body is FormData; browser will correctly set Content-Type & boundary expression
        if (requestInit.body instanceof FormData)
            baseHeaders.delete("Content-Type");
        const response = await fetch(finalURL, requestInit);
        // handle empty content
        // note: we return `{}` because we want user truthy checks for `.data` or `.error` to succeed
        if (response.status === 204 || response.headers.get("Content-Length") === "0") {
            return response.ok ? { data: {}, response } : { error: {}, response };
        }
        // parse response (falling back to .text() when necessary)
        if (response.ok) {
            let data = response.body;
            if (parseAs !== "stream") {
                const cloned = response.clone();
                data = typeof cloned[parseAs] === "function" ? await cloned[parseAs]() : await cloned.text();
            }
            return { data, response };
        }
        // handle errors (always parse as .json() or .text())
        let error = {};
        try {
            error = await response.clone().json();
        }
        catch {
            error = await response.clone().text();
        }
        return { error, response };
    }
    return {
        /** Call a GET endpoint */
        async get(url, init) {
            return coreFetch(url, { ...init, method: "GET" });
        },
        /** Call a PUT endpoint */
        async put(url, init) {
            return coreFetch(url, { ...init, method: "PUT" });
        },
        /** Call a POST endpoint */
        async post(url, init) {
            return coreFetch(url, { ...init, method: "POST" });
        },
        /** Call a DELETE endpoint */
        async del(url, init) {
            return coreFetch(url, { ...init, method: "DELETE" });
        },
        /** Call a OPTIONS endpoint */
        async options(url, init) {
            return coreFetch(url, { ...init, method: "OPTIONS" });
        },
        /** Call a HEAD endpoint */
        async head(url, init) {
            return coreFetch(url, { ...init, method: "HEAD" });
        },
        /** Call a PATCH endpoint */
        async patch(url, init) {
            return coreFetch(url, { ...init, method: "PATCH" });
        },
        /** Call a TRACE endpoint */
        async trace(url, init) {
            return coreFetch(url, { ...init, method: "TRACE" });
        },
    };
}
