import { axios } from "@/helpers/axios";

export function listByRoles() {
    return axios.get("/permissions/roles");
}
