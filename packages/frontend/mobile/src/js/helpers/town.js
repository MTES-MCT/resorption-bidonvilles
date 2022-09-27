import { getApi } from "#src/js/api";

/**
 * GET /users/:id/towns
 */
export function findUserTowns(userId, type) {
    return getApi(`/users/${userId}/towns/?t=${encodeURIComponent(type)}`);
}

export function findTown(townId) {
    return getApi(`/towns/${townId}`);
}
