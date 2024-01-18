import { axios } from "@/helpers/axios";

export function autocomplete(str) {
    return axios.get(`/associations/search?query=${encodeURIComponent(str)}`);
}
