import { getApi } from "#helpers/api/main";

/**
 * Lists all statistics
 *
 * @returns {Promise}
 */
export function all(departement) {
    return getApi(`/stats/${departement ? `${departement}` : ""}`);
}

export default all;
