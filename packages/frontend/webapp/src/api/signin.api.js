import { axios } from "@/helpers/axios";

export function signin(email, password) {
    return axios.post("/signin", {
        email,
        password,
    });
}
