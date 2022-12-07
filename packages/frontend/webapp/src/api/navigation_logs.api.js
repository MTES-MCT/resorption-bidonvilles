import { axios } from "@/helpers/axios";

export function exportMobileSessions() {
    return axios.get("/navigationLogs/mobile/export");
}

export function exportWebappSessions() {
    return axios.get("/navigationLogs/webapp/export");
}
