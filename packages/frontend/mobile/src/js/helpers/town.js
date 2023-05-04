import { getApi, postApi } from "#src/js/api";

/**
 * GET /users/:id/towns
 */
export function findUserTowns(userId, type) {
    return getApi(`/users/${userId}/towns/?t=${encodeURIComponent(type)}`);
}

export function findTown(townId) {
    return getApi(`/towns/${townId}`);
}

export function searchTowns(search) {
    return getApi(`/towns?q=${encodeURIComponent(search)}`);
}

export function findNearby(latitude, longitude) {
    return getApi(
        `/towns/findNearby?latitude=${latitude}&longitude=${longitude}`
    );
}

export function editTown(id, data) {
    return postApi(`/towns/${encodeURI(id)}`, data);
}
