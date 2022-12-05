import { axios } from "@/helpers/axios";

export function createNavigationLog(page) {
    return axios.post("/me/navigationLogs", { page, domain: "webapp" });
}

export function edit(data) {
    return axios.post("/me", data);
}
