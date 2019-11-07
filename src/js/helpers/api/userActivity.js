import { getApi } from '#helpers/api/main';

/**
 * Lists all user activities
 *
 * @returns {Promise}
 */
export function list() {
    return getApi('/user-activities');
}

export default list;
