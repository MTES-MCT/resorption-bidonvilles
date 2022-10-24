import { axios } from "@/helpers/axios";

export function autocomplete(search) {
    return axios.get(`/locations/search?q=${encodeURIComponent(search)}`);
}
