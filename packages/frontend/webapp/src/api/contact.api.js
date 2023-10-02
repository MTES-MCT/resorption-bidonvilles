import { axios } from "@/helpers/axios";

export function requestCreation(data) {
    return axios.post("/contact", data);
}
