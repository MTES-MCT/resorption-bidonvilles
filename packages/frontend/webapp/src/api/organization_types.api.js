import { axios } from "@/helpers/axios";

export function getOrganizations(typeId) {
    return axios.get(`/organization-types/${encodeURI(typeId)}/organizations`);
}

export function getAllOrganizationTypes() {
    return axios.get("/organization-types");
}
