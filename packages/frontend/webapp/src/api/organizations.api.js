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

export function autocompleteAssociation(str) {
    return axios.get(
        `/organizations/associations/search?query=${encodeURIComponent(str)}`
    );
}

export function autocompleOrganization(str) {
    return axios.get(
        `/organizations/organizations/search?query=${encodeURIComponent(str)}`
    );
}

export function autocompletePrivateOrganization(str) {
    return axios.get(
        `/organizations/private-organizations/search?query=${encodeURIComponent(
            str
        )}`
    );
}

export function autocompleteTerritorialCollectivity(str) {
    return axios.get(
        `/organizations/territorial-collectivities/search?query=${encodeURIComponent(
            str
        )}`
    );
}

export function create(data) {
    return axios.post("/organizations", data);
}

export function get(id, activeOnly) {
    const query = activeOnly ? "?activeOnly=true" : "";
    return axios.get(`/organizations/${encodeURI(id)}${query}`);
}

export function list() {
    return axios.get("/organizations");
}
