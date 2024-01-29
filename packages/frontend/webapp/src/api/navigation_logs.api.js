import { axios } from "@/helpers/axios";

export function exportWebappSessions() {
    return axios.get("/navigation-logs/export/csv");
}
