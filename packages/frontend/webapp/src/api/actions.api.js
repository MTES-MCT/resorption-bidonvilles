import { axios } from "@/helpers/axios";

export function addComment(actionId, comment) {
    return axios.post(`/actions/${encodeURI(actionId)}/comments`, comment);
}

export function create(data) {
    return axios.post(`/actions`, data);
}

export function edit(id, data) {
    return axios.patch(`/actions/${encodeURI(id)}`, data);
}

export function exportActions() {
    return axios.get("/actions/export");
}

export function exportComments() {
    return axios.get("/actions/comments/export");
}

export function fetchList() {
    return axios.get("/actions");
}

export function fetchOne(actionId) {
    return axios.get(`/actions/${encodeURI(actionId)}`);
}

export function getActionFinancementsReadersByAction(actionId) {
    return axios.get(`/actions/${encodeURI(actionId)}/action-finances-readers`);
}
