import { axios } from "@/helpers/axios";

export function list(queryString) {
    return axios.get(`/activities?${queryString}`);
}
