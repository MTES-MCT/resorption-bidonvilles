import { axios } from "@/helpers/axios";

export function getExport() {
    return axios.get("/statistics/export");
}

export function registerDirectoryView(organizationId) {
    return axios.post("/statistics/directory-views", {
        organization: organizationId,
    });
}
