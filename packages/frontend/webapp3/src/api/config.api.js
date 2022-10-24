import { axios } from "@/helpers/axios";

export function get() {
    return axios.get("/config");
}

export function closeChangelog(version) {
    return axios.post("/changelog", { version });
}
