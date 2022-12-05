import { axios } from "@/helpers/axios";

export function autocomplete(search) {
    return axios.get(`/locations/search?q=${encodeURIComponent(search)}`);
}

export function get(type, code) {
    return axios.get(
        `/locations/${encodeURI(type)}${code ? `/${encodeURI(code)}` : ""}`
    );
}
