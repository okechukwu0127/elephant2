import AppConfig from './config/AppConfig';

const transformFormUrlEncoded = obj => {
    const str = [];
    for (let p in obj) {
        if (obj.hasOwnProperty(p)) {
            const k = p;
            const v = obj[p];
            if (typeof v === 'object') {
                str.push(
                    `${encodeURIComponent(k)}=${encodeURIComponent(
                        JSON.stringify(v),
                    )}`,
                );
            } else {
                str.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
            }
        }
    }
    return str.join('&');
};

const transformFormData = body => {
    let formDataBody = new FormData();
    Object.keys(body).forEach(key => {
        if (Array.isArray(body[key])) {
            body[key].map(el => el != null && formDataBody.append(key, el));
        } else {
            body[key] != null && formDataBody.append(key, body[key]);
        }
    });
    return formDataBody;
};

const prepareRequestHeaders = (contentType = 'application/json', token) => {
    const headers = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    headers.Accept = 'application/json';
    headers['Content-Type'] = contentType;
    return headers;
};

const prepareRequestBody = (body, contentType) => {
    if (contentType === 'application/x-www-form-urlencoded') {
        return transformFormUrlEncoded(body);
    } else if (contentType === 'multipart/form-data') {
        return transformFormData(body);
    } else {
        return JSON.stringify(body);
    }
};

/**
 * Creates a wrapper function around the HTML5 Fetch API that provides
 * default arguments to fetch(...) and is intended to reduce the amount
 * of boilerplate code in the application.
 * https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
 */
function createFetch(fetch) {
    return async (url, {token, contentType, ...options}) => {
        var apiUrl = AppConfig.apiUrl;
        const anotherDomainRequest = url.startsWith('http');
        options.body = prepareRequestBody(options.body, contentType);
        if (!anotherDomainRequest) {
            options.headers = prepareRequestHeaders(contentType, token);
        }
        try {
            let _url = anotherDomainRequest ? url : `${apiUrl}${url}`;

            const resp = await fetch(_url, {
                ...options,
                headers: {
                    ...options.headers,
                },
            });
            //console.log("***************respBinary",resp);
            const responseText = await resp.text();
            //console.log("***************response",responseText);
            if (responseText) {
                const responseBody = JSON.parse(responseText);
                return resp.ok
                    ? options.success(responseBody)
                    : options.failure({...responseBody, status: resp.status});
            } else {
                return resp.ok ? options.success({}) : options.failure({});
            }
        } catch (error) {
            return options.failure({error});
        }
    };
}

export default createFetch;
