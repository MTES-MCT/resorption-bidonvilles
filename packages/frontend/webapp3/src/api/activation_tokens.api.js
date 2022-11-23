import { axios } from "@/helpers/axios";

export function check(token) {
    return axios.get(`/activation-tokens/${encodeURI(token)}/check`);
}
