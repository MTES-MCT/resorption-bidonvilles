import { axios } from "@/helpers/axios";

export function acceptCharter(
    charteVersion,
    charteAgreement,
    confidentialityAgreement
) {
    return axios.put(`/me/charte_engagement`, {
        version_de_charte: charteVersion,
        charte_agreement: charteAgreement,
        confidentiality_agreement: confidentialityAgreement,
    });
}

export function activate(userId, data) {
    return axios.post(`/users/${encodeURI(userId)}/activate`, data);
}

export function anonymizeUser(userId) {
    const anonymize = axios.post(`/users/anonymize`, { ids: [userId] });
    return anonymize;
}

export function create(user) {
    return axios.post("/users", user);
}

export function deactivateUser(
    userId,
    reason = null,
    anonymizationRequested = null
) {
    return axios.post(`/users/${encodeURI(userId)}/deactivate`, {
        reason,
        anonymizationRequested,
    });
}

export function denyAccess(userId) {
    return axios.post(`/users/${encodeURI(userId)}/deny-access`);
}

export function edit(userId, data) {
    return axios.patch(`/users/${encodeURI(userId)}`, data);
}

export function exportList() {
    return axios.get("/users/export/csv");
}

export function get(userId) {
    return axios.get(`/users/${encodeURI(userId)}`);
}

export function getLatestActivationLink(userId) {
    return axios.get(`/users/${encodeURI(userId)}/activation-links`);
}

export function list() {
    return axios.get("/users");
}

export function listWithPrivilege() {
    return axios.get("/users-with-privilege");
}

export function modifyOptions(userId, options) {
    return axios.put(`/users/${encodeURI(userId)}/options`, {
        options,
    });
}
export function newPassword(email) {
    return axios.post("/users/new-password-request", {
        email,
    });
}

export function reactivateUser(userId) {
    return axios.post(`/users/${encodeURI(userId)}/reactivate`);
}

export function refuseAccess(userId) {
    return axios.post(`/users/${encodeURI(userId)}/refuse-access`);
}

export function sendActivationLink(userId, data) {
    return axios.post(`/users/${encodeURI(userId)}/activation-links`, data);
}

export function setAdminComments(userId, comment) {
    return axios.put(`/users/${encodeURI(userId)}/admin-comments`, {
        comment,
    });
}

export function setExpertiseTopics(
    userId,
    expertiseTopics,
    interestTopics,
    comment
) {
    return axios.put(`/users/${encodeURI(userId)}/expertise-topics`, {
        expertise_topics: expertiseTopics,
        interest_topics: interestTopics,
        expertise_comment: comment,
    });
}

export function setInterventionAreas(userId, data) {
    return axios.put(`users/${encodeURI(userId)}/intervention-areas`, data);
}

export function setLocalAdmin(userId, admin = true) {
    return axios.put(`/users/${encodeURI(userId)}/role-admin`, { admin });
}

export function setPassword(userId, data) {
    return axios.put(`/users/${encodeURI(userId)}/password`, data);
}

export function setRoleRegular(userId, roleId) {
    return axios.put(`/users/${encodeURI(userId)}/role-regular`, {
        role_id: roleId,
    });
}
