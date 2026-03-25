import { axios } from "@/helpers/axios";

export function list(filters = {}) {
    return axios.get("/signin-logs", { params: filters });
}
