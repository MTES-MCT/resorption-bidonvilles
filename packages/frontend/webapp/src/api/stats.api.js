import { axios } from "@/helpers/axios";

export function get(departement) {
    return axios.get(`/stats/${departement ? encodeURI(departement) : ""}`);
}

export function getDashboard(locationType, locationCode) {
    const query = {};
    if (locationType) {
        query.locationType = locationType;
    }
    if (locationCode) {
        query.locationCode = locationCode;
    }

    const queryString = Object.keys(query)
        .map((name) => `${name}=${encodeURIComponent(query[name])}`)
        .join("&");
    return axios.get(`/stats/getStats?${queryString}`);
}
