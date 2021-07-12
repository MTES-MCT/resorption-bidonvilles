import { getApi } from "#helpers/api/main";

/**
 * Lists all user activities
 *
 * @returns {Promise}
 */
export function listRegular() {
    return getApi(`/activities`);
}

/**
 * Lists covid activities
 *
 * @returns {Promise}
 */
export function listCovid() {
    return getApi(`/activities/covid`);
}
