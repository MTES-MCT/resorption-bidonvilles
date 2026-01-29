import { axios } from "@/helpers/axios";

export function get(type) {
    return axios.get(`/territory/${type}`);
}
