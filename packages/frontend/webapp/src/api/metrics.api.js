import { axios } from "@/helpers/axios";

export function getNationMetrics(from, to) {
    return axios.get(
        `/towns/metrics?from=${encodeURIComponent(
            from.toISOString().slice(0, 10)
        )}&to=${encodeURIComponent(to.toISOString().slice(0, 10))}`
    );
}

export function getDepartementMetrics() {
    return new Promise((r) => setTimeout(() => r({}), 500));
}
