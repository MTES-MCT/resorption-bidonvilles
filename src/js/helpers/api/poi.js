import { getApi } from "#helpers/api/main";

/**
 * Fetches all pois  from the database
 *
 *
 * @returns {Promise}
 */
export function all() {
    return getApi(`/poi`);
}
