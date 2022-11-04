import { axios } from "@/helpers/axios";

export function fetchList() {
    return axios.get("/towns");
}

export function exportList(
    location,
    closedTowns,
    options = [],
    date = new Date()
) {
    const query = {
        locationType: location.type,
        locationCode: location.code,
        closedTowns: closedTowns ? "1" : "0",
        date: date.getTime(),
    };
    if (options?.length > 0) {
        query.options = options.join(",");
    }

    const queryString = Object.keys(query)
        .map((key) => `${key}=${encodeURIComponent(query[key])}`)
        .join("&");
    return axios.get(`/towns/export?${queryString}`, { responseType: "blob" });
}

export function setHeatwaveStatus(id, status) {
    return axios.put(`/towns/${encodeURI(id)}/heatwave`, {
        heatwave_status: status,
    });
}
