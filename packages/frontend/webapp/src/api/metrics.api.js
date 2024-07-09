import { axios } from "@/helpers/axios";

export function getNationMetrics(from, to) {
    return axios.get(
        `/metrics?from=${encodeURIComponent(
            from.toISOString().slice(0, 10)
        )}&to=${encodeURIComponent(to.toISOString().slice(0, 10))}`
    );
}

export function getNationMetricsEvolution(from, to) {
    return axios.get(
        `/metrics/national/evolution?from=${encodeURIComponent(
            from.toISOString().slice(0, 10)
        )}&to=${encodeURIComponent(to.toISOString().slice(0, 10))}`
    );
}

export function getDepartementMetrics(departementCode) {
    return axios.get(`/metrics/departement/${encodeURI(departementCode)}`);
}

export function getDepartementMetricsEvolution(departementCode, from, to) {
    return axios.get(
        `/metrics/departement/${encodeURI(
            departementCode
        )}/evolution?from=${encodeURIComponent(
            from.toISOString().slice(0, 10)
        )}&to=${encodeURIComponent(to.toISOString().slice(0, 10))}`
    );
}
