import { axios } from "@/helpers/axios";

export function getAll() {
    return axios.get("/comments");
}
