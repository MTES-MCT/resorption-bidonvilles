import { axios } from "@/helpers/axios";

export function getNationMetrics(from, to) {
    return axios.get(
        `/towns/metrics?from=${encodeURIComponent(
            from.toISOString().slice(0, 10)
        )}&to=${encodeURIComponent(to.toISOString().slice(0, 10))}`
    );
}

export function getCityMetrics() {
    return new Promise((r) =>
        setTimeout(
            () =>
                r({
                    city: {
                        name: "Verneuil-sur-Seine",
                        code: "78642",
                        departement: {
                            name: "Yvelines",
                            code: "78",
                        },
                        region: {
                            name: "Île-de-France",
                            code: "11",
                        },
                    },
                    metrics: {},
                }),
            500
        )
    );
}
