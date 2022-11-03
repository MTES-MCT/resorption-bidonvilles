import { axios } from "@/helpers/axios";

export function fetchList() {
    return axios.get("/towns");
}

export function setHeatwaveStatus(id, status) {
    return axios.put(`/towns/${encodeURI(id)}/heatwave`, {
        heatwave_status: status,
    });
}
