import { axios } from "@/helpers/axios";

export function create(data) {
    return axios.post("/invitations", data);
}
