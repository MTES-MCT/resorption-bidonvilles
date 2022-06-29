import { postApi } from "#src/js/api";

/**
 * Creates a high covid comment
 *
 * @returns {Promise}
 */
export function create(data) {
    return postApi("/high-covid-comments", data);
}

export default create;
