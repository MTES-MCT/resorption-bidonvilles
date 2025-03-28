import { axios } from "@/helpers/axios";

export function getParcelOwners(parcelId, departementId) {
    return axios.get(`/majic`, {
        params: {
            parcelid: parcelId,
            departmentid: departementId,
        },
    });
}

export function getMajicYear(departementId) {
    return axios.get(`/majic-data-year`, {
        params: {
            departmentid: departementId,
        },
    });
}
