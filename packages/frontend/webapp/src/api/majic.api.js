import { axios } from "@/helpers/axios";

export function getParcelOwners(parcelId, departementId, siteId) {
    return axios.get(`/majic`, {
        params: {
            parcelid: parcelId,
            departmentid: departementId,
            shantytownId: siteId,
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
