import { axios } from "@/helpers/axios";

export function createNavigationLog(page) {
    return axios.post("/navigation-logs", { page, domain: "webapp" });
}

export function edit(data) {
    return axios.patch("/me", data);
}
