import { axios } from "@/helpers/axios";

export function get() {
    return axios.get("/me/access-tokens");
}
