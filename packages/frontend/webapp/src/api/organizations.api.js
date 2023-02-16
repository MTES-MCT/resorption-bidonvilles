import { axios } from "@/helpers/axios";

export function autocomplete(str, departementCode = null, usersOnly = "0") {
    const queryObj = {
        query: str,
        departementCode,
        usersOnly,
    };

    const queryString = Object.keys(queryObj)
        .filter((key) => {
            return queryObj[key] !== null && queryObj[key] !== undefined;
        })
        .map((key) => `${key}=${encodeURIComponent(queryObj[key])}`)
        .join("&");

    return axios.get(`/organizations/search?${queryString}`);
}
