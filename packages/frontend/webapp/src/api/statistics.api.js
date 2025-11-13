import { axios } from "@/helpers/axios";
import dateToString from "@common/utils/dateToString";

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
            dateToString(from)
        )}&to=${encodeURIComponent(dateToString(to))}`,
        { responseType: "blob" }
    );
}
