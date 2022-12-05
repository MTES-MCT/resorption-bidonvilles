import { axios } from "@/helpers/axios";

export function autocomplete(
    str,
    departementCode = null,
    onlyUsersAndOrganizations = false
) {
    return axios.get(
        `/organizations/search?query=${encodeURIComponent(
            str
        )}&departementCode=${encodeURIComponent(
            departementCode
        )}&onlyUsersAndOrganizations=${encodeURIComponent(
            onlyUsersAndOrganizations
        )}`
    );
}
