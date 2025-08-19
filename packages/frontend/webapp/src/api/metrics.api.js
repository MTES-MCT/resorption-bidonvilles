import { axios } from "@/helpers/axios";

// Helper pour convertir Date en YYYY-MM-DD sans problème de timezone
const toLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export function getNationMetrics(from, to) {
    return axios.get(
        `/metrics?from=${encodeURIComponent(
            toLocalDateString(from)
        )}&to=${encodeURIComponent(toLocalDateString(to))}`
    );
}

export function getNationMetricsEvolution(from, to) {
    return axios.get(
        `/metrics/national/evolution?from=${encodeURIComponent(
            toLocalDateString(from)
        )}&to=${encodeURIComponent(toLocalDateString(to))}`
    );
}

export function getDepartementMetrics(departementCode, from, to) {
    return axios.get(
        `/metrics/departement/${encodeURI(
            departementCode
        )}?from=${encodeURIComponent(
            toLocalDateString(from)
        )}&to=${encodeURIComponent(toLocalDateString(to))}`
    );
}

export function getDepartementMetricsEvolution(departementCode, from, to) {
    return axios.get(
        `/metrics/departement/${encodeURI(
            departementCode
        )}/evolution?from=${encodeURIComponent(
            toLocalDateString(from)
        )}&to=${encodeURIComponent(toLocalDateString(to))}`
    );
}
