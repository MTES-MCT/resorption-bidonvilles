import { getApi } from "#helpers/api/main";

/**
 * Lists all statistics
 *
 * @returns {Promise}
 */
export function all() {
    return getApi("/stats");
}

export default all;
