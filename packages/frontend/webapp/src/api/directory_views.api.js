import { axios } from "@/helpers/axios";

export function create(organizationId) {
    return axios.post("/directory-views", {
        organization: organizationId,
    });
}
