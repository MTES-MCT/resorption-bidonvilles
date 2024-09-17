import { axios } from "@/helpers/axios";

export function checkActualPassword(userId, password) {
    return axios.post(`/users/${userId}/checkPassword`, {
        password,
    });
}
