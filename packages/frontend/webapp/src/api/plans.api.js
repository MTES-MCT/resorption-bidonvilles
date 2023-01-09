import { axios } from "@/helpers/axios";

export function addComment(planId, comment) {
    return axios.post(`/plans/${encodeURI(planId)}/comments`, comment);
}

export function exportComments() {
    return axios.get("/plans/comments/export");
}

export function exportPlans() {
    return axios.get("/plans/export");
}

export function fetchList() {
    return axios.get("/plans");
}

export function fetchOne(planId) {
    return axios.get(`/plans/${encodeURI(planId)}`);
}

export function addState(planId, data) {
    return axios.post(`/plans/${planId}/states`, data);
}
