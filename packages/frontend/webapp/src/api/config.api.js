import { axios } from "@/helpers/axios";

export function closeChangelog(version) {
    return axios.post("/changelog", { version });
}

export function get() {
    return axios.get("/config");
}
