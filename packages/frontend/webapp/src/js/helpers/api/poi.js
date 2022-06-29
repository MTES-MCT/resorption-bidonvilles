import { getApi } from "#src/js/api";

/**
 * Fetches all pois  from the database
 *
 *
 * @returns {Promise}
 */
export function all() {
    return getApi(`/pois`);
}
