import { axios } from "@/helpers/axios";

export function acceptCharte(
    userId,
    charteVersion,
    charteAgreement,
    confidentialityAgreement
) {
    return axios.put(`/users/${encodeURI(userId)}/charte_engagement`, {
        version_de_charte: charteVersion,
        charte_agreement: charteAgreement,
        confidentiality_agreement: confidentialityAgreement,
    });
}

export function activate(userId, data) {
    return axios.post(`/users/${encodeURI(userId)}/activate`, data);
}

export function create(user) {
    return axios.post("/users", user);
}

export function deactivateUser(userId, reason = null) {
    return axios.delete(`/users/${encodeURI(userId)}`, { data: { reason } });
}

export function denyAccess(userId) {
    return axios.post(`/users/${encodeURI(userId)}/denyAccess`);
}

export function edit(userId, data) {
    return axios.put(`/users/${encodeURI(userId)}`, data);
}

export function exportList() {
    return axios.get("/users/export");
}

export function get(userId) {
    return axios.get(`/users/${encodeURI(userId)}`);
}

export function getLatestActivationLink(userId) {
    return axios.get(`/users/${encodeURI(userId)}/activationLink`);
}

export function list() {
    return axios.get("/users");
}

export function listWithPermissions() {
    return axios.get("/users-with-permissions");
}

export function modifyOptions(userId, options) {
    return axios.post(`/users/${encodeURI(userId)}/options`, {
        options,
    });
}
export function newPassword(email) {
    return axios.post("/users/new-password", {
        email,
    });
}

export function reactivateUser(userId) {
    return axios.post(`/users/${encodeURI(userId)}/reactivate`);
}

export function sendActivationLink(userId, data) {
    return axios.post(`/users/${encodeURI(userId)}/sendActivationLink`, data);
}

export function setAdminComments(userId, comment) {
    return axios.put(`/users/${encodeURI(userId)}/admin_comments`, {
        comment,
    });
}

export function setExpertiseTopics(userId, expertiseTopics, interestTopics) {
    return axios.put(`/users/${encodeURI(userId)}/expertise_topics`, {
        expertise_topics: expertiseTopics,
        interest_topics: interestTopics,
    });
}

export function setLocalAdmin(userId, admin = true) {
    return axios.post(`/users/${encodeURI(userId)}/local-admin`, { admin });
}

export function setPassword(userId, data) {
    return axios.post(`/users/${encodeURI(userId)}/newPassword`, data);
}

export function setRoleRegular(userId, roleId) {
    return axios.patch(`/users/${encodeURI(userId)}/role_regular`, {
        role_id: roleId,
    });
}
