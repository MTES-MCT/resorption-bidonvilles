import { axios } from "@/helpers/axios";

export function getOrganizations(categoryUid) {
    return axios.get(
        `/organization-categories/${encodeURI(categoryUid)}/organizations`
    );
}

export function getTypes(categoryUid) {
    return axios.get(
        `/organization-categories/${encodeURI(categoryUid)}/organization-types`
    );
}
