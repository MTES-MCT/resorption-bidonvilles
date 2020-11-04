import { getApi, postApi, deleteApi } from "#helpers/api/main";

/**
 * Fetches all towns from the database
 *
 * @param {Object.<string,string>} [filters]
 * @param {Array.<String>}         [order]
 *
 * @returns {Promise}
 */
export function all(filters = {}, order = []) {
    const queries = [];

    // filters
    Object.keys(filters).forEach(filterName => {
        queries.push(
            `${filterName}=${encodeURIComponent(filters[filterName])}`
        );
    });

    // order
    if (order.length > 0) {
        queries.push(
            `order=${order.map(s => encodeURIComponent(s)).join(",")}`
        );
    }

    return getApi(`/towns${queries.length > 0 ? `?${queries.join("&")}` : ""}`);
}

/**
 * Fetchs a specific town from the database
 *
 * @param {string} id
 *
 * @returns {Promise}
 */
export function get(id) {
    return getApi(`/towns/${id}`);
}

/**
 * Creates a new town
 *
 * @param {Town_Data} data
 *
 * @returns {Promise}
 */
export function add(data) {
    const formattedData = { ...data };

    if (data.address) {
        formattedData.coordinates = data.address.location.coordinates.join(",");
        formattedData.citycode = data.address.address.data.citycode;
        formattedData.address = data.address.address.label;
    }

    return postApi("/towns", formattedData);
}

/**
 * Updates a town
 *
 * @param {string}    id
 * @param {Town_Data} data
 *
 * @returns {Promise}
 */
export function edit(id, data) {
    return postApi(`/towns/${id}`, data);
}

/**
 * Closes a town
 *
 * @param {string}    id
 * @param {Town_Data} data
 *
 * @returns {Promise}
 */
export function close(id, data) {
    return postApi(`/towns/${id}/close`, data);
}

/**
 * Deletes a town
 *
 * @param {string} id
 *
 * @returns {Promise}
 */
export function destroy(id) {
    return deleteApi(`/towns/${id}`);
}

/**
 * Adds a comment to a town
 *
 * @param {string}                 id   Town id
 * @param {ShantytownComment_Data} data Comment data
 *
 * @returns {Promise}
 */
export function addComment(id, data) {
    return postApi(`/towns/${id}/comments`, data);
}

/**
 * Adds a covid comment to a town
 *
 * @param {string}                 id   Town id
 * @param {ShantytownCovidComment_Data} data Comment data
 *
 * @returns {Promise}
 */
export function addCovidComment(id, data) {
    return postApi(`/towns/${id}/covidComments`, data);
}

/**
 * Edits a comment from a town
 *
 * @param {string}                 townId    Town id
 * @param {number}                 commentId Comment id
 * @param {ShantytownComment_Data} data      Comment data
 *
 * @returns {Promise}
 */
export function editComment(townId, commentId, comment) {
    return postApi(`/towns/${townId}/comments/${commentId}`, comment);
}

/**
 * Delete a comment from a town
 *
 * @param {string} townId    Town id
 * @param {number} commentId Comment id
 * @param {String} message
 *
 * @returns {Promise}
 */
export function deleteComment(townId, commentId, message) {
    return deleteApi(`/towns/${townId}/comments/${commentId}`, { message });
}

/**
 * Gets all recent comments
 *
 * @returns {Promise}
 */
export function getRecentComments() {
    return getApi("/comments");
}

/**
 * @typedef {Object} Town_Data
 * @property {number} latitude,
 * @property {number} longitude,
 * @property {string} address,
 * @property {string} detailed_address,
 * @property {?Date} built_at,
 * @property {?number} population_total,
 * @property {?number} population_couples,
 * @property {?number} population_minors,
 * @property {Object} electricity_type,
 * @property {?boolean} access_to_water,
 * @property {?boolean} trash_evacuation,
 * @property {Array.<number>} social_origins,
 * @property {number} field_type,
 * @property {number} owner_type,
 */

/**
 * @typedef {Object} ShantytownComment_Data
 * @property {string} description
 */
