import { getApi, patchApi } from "#src/js/api";

/**
 * Lists all categories
 *
 * @returns {Promise}
 */
export function categories() {
    return getApi("/organization-categories");
}

/**
 * Lists all types of a specific category
 *
 * @param {String} categoryUid
 *
 * @returns {Promise}
 */
export function types(categoryUid) {
    return getApi(`/organization-categories/${categoryUid}/organization-types`);
}

/**
 * Lists all organizations of a specific category
 *
 * @param {String} categoryUid
 * @param {String} [search]
 *
 * @returns {Promise}
 */
export function getByCategory(categoryUid, search = null) {
    return getApi(
        `/organization-categories/${categoryUid}/organizations${
            search !== null ? `?search=${search}` : ""
        }`
    );
}

/**
 * Lists all organizations of a specific type
 *
 * @param {Number} typeId
 *
 * @returns {Promise}
 */
export function getByType(typeId) {
    return getApi(`/organization-types/${typeId}/organizations`);
}

/**
 * Lists all users of a specific organization
 *
 * @param {Number} organizationId
 *
 * @returns {Promise}
 */
export function getMembers(organizationId) {
    return getApi(`/organizations/${organizationId}/users`);
}

/**
 * Lists all users of a specific organization
 *
 * @param {Number} organizationId
 *
 * @returns {Promise}
 */
export function getMembersOfCategory(
    categoryId,
    regionId,
    departementId,
    search = null
) {
    let query = [];
    if (departementId !== undefined) {
        query.push(`departementId=${encodeURIComponent(departementId)}`);
    } else if (regionId !== undefined) {
        query.push(`regionId=${encodeURIComponent(regionId)}`);
    }

    if (search !== null) {
        query.push(`q=${encodeURIComponent(search)}`);
    }

    return getApi(
        `/organization-categories/${categoryId}/users?${query.join("&")}`
    );
}

/**
 * PATCH /organizations/:id
 */
export async function updateBeingFunded(organizationId, data) {
    return patchApi(`/organizations/${organizationId}/being_funded`, data);
}
