import { postApi } from "#helpers/api/main";

/**
 * Registers a new directory-view event
 *
 * @param {Number} organization Id of the viewed organization
 *
 * @returns {Promise}
 */
export function directoryViews(organization) {
    return postApi("/statistics/directory-views", {
        organization
    });
}

export default directoryViews;
