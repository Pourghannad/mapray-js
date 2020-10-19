/**
 * @private
 */
class HTTP {

    static async get( url, query, option={} )
    {
        return await this.fetch( HTTP.METHOD.GET, url, query, null, option );
    }

    static async post( url, query, body, option={} )
    {
        return await this.fetch( HTTP.METHOD.POST, url, query, body, option );
    }

    static async patch( url, query, body, option={} )
    {
        return await this.fetch( HTTP.METHOD.PATCH, url, query, body, option );
    }

    static async put( url, query, body, option={} )
    {
        return await this.fetch( HTTP.METHOD.PUT, url, query, body, option );
    }

    static async delete( url, query, option={} )
    {
        return await this.fetch( HTTP.METHOD.DELETE, url, query, null, option );
    }

    /**
     * @summary call fetch
     *
     * <pre>
     * query = {
     *     key1: value1,
     *     key2: value2,
     * };
     * URL: url?key1=value1&key2=value2
     * </pre>
     * window.fetch();
     *
     * @private
     * @param {string} method
     * @param {string} url
     * @param {object} query
     * @param {object|string} body
     * @param {object} [option] second argument of window.fetch(url, [init]).
     */
    static async fetch( method, url, query, body, option={} )
    {
        const queryText = !query ? "" : "?" + Object.keys( query ).map( k => k + "=" + query[k] ).join("&");
        option.method = method;
        if (body) option.body = typeof(body) === "object" ? JSON.stringify(body) : body;

        let response;
        try {
            response = await fetch( url + queryText, option );
        }
        catch( error ) {
            throw new FetchError( "Failed to fetch", url, null, error );
        }
        if ( !response.ok ) {
            throw new FetchError( "Failed to fetch: " + response.statusText, url, response );
        }
        return response;
    }

    static isJson( mimeType ) {
        return (
            mimeType.startsWith( "application/json" ) ||
            mimeType === "model/gltf+json"
        );
    }
}

HTTP.METHOD = {
    GET: "GET",
    POST: "POST",
    PATCH: "PATCH",
    PUT: "PUT",
    DELETE: "DELETE",
};

HTTP.CONTENT_TYPE = "Content-Type";

HTTP.RESPONSE_STATUS = {
    NO_CONTENT: 204
};


/**
 * @private
 */
class FetchError extends Error {
    constructor( message, url, response, cause )
    {
        super( message + " " + url );
        if ( Error.captureStackTrace ) {
            Error.captureStackTrace( this, FetchError );
        }
        this.name = "FetchError";
        this.url = url;
        this.response = response;
        this.cause = cause;
        let is_aborted = false;
        if ( cause ) {
            is_aborted = cause.message === "The user aborted a request.";
            this.stack += "\nCaused-By: " + ( cause.stack || cause );
        }
        this.is_aborted = is_aborted;
    }
}

export { FetchError };
export default HTTP;
