import { axios } from "@/helpers/axios";

export function fetchList() {
    return axios.get("/towns");
}

export function setHeatwaveStatus(id, data) {
    return axios.put(`/towns/${encodeURI(id)}/heatwave`, data);
}
