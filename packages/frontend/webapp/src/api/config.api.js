import { axios } from "@/helpers/axios";

export function closeChangelog(version) {
    return axios.put(`/me/last_changelog`, {
        version,
    });
}

export function get() {
    return axios.get("/config");
}
