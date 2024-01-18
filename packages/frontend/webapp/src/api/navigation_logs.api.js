import { axios } from "@/helpers/axios";

export function exportWebappSessions() {
    return axios.get("/navigationLogs/webapp/export");
}
