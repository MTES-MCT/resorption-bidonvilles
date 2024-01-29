import { axios } from "@/helpers/axios";

export function check(token) {
    return axios.get(`/password-tokens/${encodeURI(token)}`);
}
