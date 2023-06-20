import { axios } from "@/helpers/axios";

export function getNationMetrics(from, to) {
    return axios.get(
        `/towns/metrics/nation?from=${encodeURIComponent(
            from.toISOString().slice(0, 10)
        )}&to=${encodeURIComponent(to.toISOString().slice(0, 10))}`
    );
}

export function getDepartementMetrics(departementCode) {
    return axios.get(
        `/towns/metrics/departement?departement_code=${encodeURIComponent(
            departementCode
        )}`
    );
}
