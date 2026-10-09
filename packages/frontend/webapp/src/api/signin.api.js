import { axios } from "@/helpers/axios";

export function signin(keycloakId) {
    return axios.post("/signin", {
        keycloakId,
    });
}
