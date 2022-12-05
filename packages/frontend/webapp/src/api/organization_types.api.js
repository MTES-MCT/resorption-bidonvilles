import { axios } from "@/helpers/axios";

export function getOrganizations(typeId) {
    return axios.get(`/organization-types/${encodeURI(typeId)}/organizations`);
}
