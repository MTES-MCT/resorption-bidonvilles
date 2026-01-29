import { axios } from "@/helpers/axios";

export function list(filters = {}) {
    const params = {};

    if (filters.email) {
        params.email = filters.email;
    }

    if (filters.ipAddress) {
        params.ipAddress = filters.ipAddress;
    }

    if (filters.success !== undefined) {
        params.success = filters.success;
    }

    if (filters.dateFrom) {
        params.dateFrom = filters.dateFrom;
    }

    if (filters.dateTo) {
        params.dateTo = filters.dateTo;
    }

    return axios.get("/signin-logs", { params });
}
