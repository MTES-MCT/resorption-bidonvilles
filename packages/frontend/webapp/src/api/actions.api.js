import { axios } from "@/helpers/axios";

export function addComment(actionId, comment, attachments) {
    const formData = new FormData();
    formData.append("content", JSON.stringify(comment));

    if (attachments?.length) {
        for (let i = 0; i < attachments.length; i += 1) {
            formData.append("attachments", attachments[i]);
        }
    }

    return axios.post(`/actions/${encodeURI(actionId)}/comments`, formData, {
        headers: {
            "Content-Type": "multipart/form-data; charset=utf-8",
        },
    });
}

export function create(data) {
    return axios.post(`/actions`, data);
}

export function edit(id, data) {
    return axios.patch(`/actions/${encodeURI(id)}`, data);
}

export function exportActions() {
    return axios.get("/actions/export/excel", {
        responseType: "blob",
    });
}

export function exportComments() {
    return axios.get("/action-comments/export/csv");
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
