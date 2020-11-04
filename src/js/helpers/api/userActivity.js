import { getApi } from "#helpers/api/main";

/**
 * Lists all user activities
 *
 * @returns {Promise}
 */
export function list(filters = {}) {
    let query = "";
    if (Object.keys(filters).length > 0) {
        query = "filters=";
        query += Object.keys(filters)
            .map(key => `${key}:${encodeURIComponent(filters[key])}`)
            .join(",");
    }

    return getApi(`/user-activities?${query}`);
}

export default list;
