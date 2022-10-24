import { axios } from "@/helpers/axios";

export function get(type, code) {
    return axios.get(
        `/locations/${encodeURI(type)}${code ? `/${encodeURI(code)}` : ""}`
    );
}
