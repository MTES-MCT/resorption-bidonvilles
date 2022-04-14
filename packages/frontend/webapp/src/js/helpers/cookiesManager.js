/**
 * Returns the cookie with the given name
 *
 * @param {string} cookieName The name of the cookie we're looking for
 *
 * @returns {string} The cookie with the given name
 */
export function get(cookieName) {
    let matches = document.cookie.match(
        new RegExp(
            "(?:^|; )" +
                cookieName.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") +
                "=([^;]*)"
        )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

/**
 * Sets the cookie’s name to the given value
 *
 * @param {string} cookieName The name of the cookie we're looking for
 * @param {string} value The Uniform Resource Identifier to encode
 * @param {Array} options The list of options used to initialize the cookie
 *
 * @returns {string} The cookie with the given name
 */
export function set(cookieName, value, options = {}) {
    options = {
        path: "/",
        // add other defaults here if necessary
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie =
        encodeURIComponent(cookieName) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}
