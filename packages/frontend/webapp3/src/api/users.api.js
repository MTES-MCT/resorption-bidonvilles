import { axios } from "@/helpers/axios";

export function create(user) {
    return axios.post("/users", user);
}

export function deactivateUser(userId) {
    return axios.delete(`/users/${encodeURI(userId)}`);
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

export function newPassword(email) {
    return axios.post("/users/new-password", {
        email,
    });
}

export function sendActivationLink(userId, data) {
    return axios.post(`/users/${encodeURI(userId)}/sendActivationLink`, data);
}

export function checkActivationToken(token) {
    return axios.get(`/activation-tokens/${encodeURIComponent(token)}/check`);
}

export function activate(userId, data) {
    return axios.post(`/users/${userId}/activate`, data);
}

export function setAdminComments(userId, comment) {
    return axios.put(`/users/${encodeURI(userId)}/admin_comments`, {
        comment,
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
