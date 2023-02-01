import { axios } from "@/helpers/axios";

export function fetchAll(location) {
    return axios.get(`/permissionsToAccessJustice`, {
        params: location,
    });
}
