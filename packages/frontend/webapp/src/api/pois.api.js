import { axios } from "@/helpers/axios";

export function list() {
    return axios.get("/pois");
}
