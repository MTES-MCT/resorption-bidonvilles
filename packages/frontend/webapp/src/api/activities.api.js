import { axios } from "@/helpers/axios";

export function list(query) {
    const queryString = query
        .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
        .join("&");

    return axios.get(`/activities?${queryString}`);
}
