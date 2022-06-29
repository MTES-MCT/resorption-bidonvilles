import { postApi, putApi, getApi, deleteApi, patchApi } from "#src/js/api";

/**
 * Sends a login request for the given user
 *
 * Please note that in case of success, a JWT token is stored in the local storage,
 * which is the only way we have to detect wether the current user is logged in
 * or not.
 *
 * @param {string} email
 * @param {string} password
 *
 * @returns {Promise}
 */
export function login(email, password) {
    return postApi("/signin", { email, password });
}

/**
 * Renews the access token for a few more time
 *
 * @returns {Promise}
 */
export function refreshToken() {
    return getApi("/refreshToken");
}

/**
 * POST /users
 */
export function create(data) {
    return postApi("/users", data);
}

/**
 * Returns all available data about the current user
 *
 * @returns {Promise}
 */
export function me() {
    return getApi("/me");
}

/**
 * Updates data about the current user
 *
 * @param {User_Data} data
 * @param userId
 *
 * @returns {Promise}
 */
export function edit(data, userId) {
    if (userId) {
        return putApi(`/users/${userId}`, data);
    }

    return postApi("/me", data);
}

/**
 * GET /users
 */
export function list() {
    return getApi("/users");
}

/**
 * GET /users/export
 */
export function listExport() {
    return getApi("/users/export");
}

/**
 * GET /users/:id
 */
export function get(id) {
    return getApi(`/users/${id}`);
}

/**
 * POST /users/:id/sendActivationLink
 */
export function sendActivationLink(user, data) {
    return postApi(`/users/${user}/sendActivationLink`, data);
}

/**
 * POST /users/:id/denyAccess
 */
export function denyAccess(user) {
    return postApi(`/users/${user}/denyAccess`);
}

/**
 * GET /activation-tokens/:token/check
 */
export function checkActivationToken(token) {
    return getApi(`/activation-tokens/${encodeURIComponent(token)}/check`);
}

/**
 * GET /password-tokens/:token/check
 */
export function checkPasswordToken(token) {
    return getApi(`/password-tokens/${encodeURIComponent(token)}/check`);
}

/**
 * POST /users/:id/activate
 */
export function activate(userId, data) {
    return postApi(`/users/${userId}/activate`, data);
}

/**
 * POST /users/:id/newPassword
 */
export function setPassword(userId, data) {
    return postApi(`/users/${userId}/newPassword`, data);
}

/**
 * POST /users/:id/upgrade
 */
export function upgrade(userId, data) {
    return postApi(`/users/${userId}/upgrade`, data);
}

/**
 * DELETE /users/:id
 */
export function remove(userId) {
    return deleteApi(`/users/${userId}`);
}

/**
 * POST /users/:id/local-admin
 */
export function updateLocalAdmin(userId, admin = true) {
    return postApi(`/users/${userId}/local-admin`, { admin });
}

/**
 * PATCH /users/:id/role_regular
 */
export function setRoleRegular(userId, roleId) {
    return patchApi(`/users/${userId}/role_regular`, { role_id: roleId });
}

/**
 * POST /users/new-password
 */
export function requestNewPassword(email) {
    return postApi("/users/new-password", { email });
}

/**
 * GET /directory
 */
export function getDirectory() {
    return getApi("/directory");
}

/**
 * GET /organizations/search
 */
export function autocompleteOrganization(str) {
    return getApi(`/organizations/search?query=${encodeURIComponent(str)}`);
}

/**
 * PUT /users/:id/charte_engagement
 */
export function acceptCharte(
    userId,
    charteVersion,
    charteAgreement,
    confidentialityAgreement
) {
    return putApi(`/users/${userId}/charte_engagement`, {
        version_de_charte: charteVersion,
        charte_agreement: charteAgreement,
        confidentiality_agreement: confidentialityAgreement
    });
}

/**
 * POST /users/:id/comment
 */
export function setAdminComments(userId, comment) {
    return putApi(`/users/${userId}/admin_comments`, {
        comment
    });
}

/**
 * @typedef {Object} User_Data
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} [password]
 */
