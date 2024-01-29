import { axios } from "@/helpers/axios";

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
    return axios.get(`/statistics/dashboard?${queryString}`);
}

export function exportTownsReport(from, to) {
    return axios.get(
        `/statistics/town-report?from=${encodeURIComponent(
            from.toISOString().slice(0, 10)
        )}&to=${encodeURIComponent(to.toISOString().slice(0, 10))}`,
        { responseType: "blob" }
    );
}
