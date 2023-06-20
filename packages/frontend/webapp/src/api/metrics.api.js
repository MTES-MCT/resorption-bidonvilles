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

export function getDepartementMetricsEvolution(departementCode, from, to) {
    return new Promise((success) => {
        setTimeout(
            () =>
                success({
                    summary: {},
                    inhabitants: {
                        towns: {
                            figures: {
                                total: {
                                    value: 15,
                                    evolution: 0.3,
                                },
                                less_than_10: {
                                    value: 1,
                                    evolution: 0.123,
                                },
                                between_10_and_99: {
                                    value: 12,
                                    evolution: -0.12,
                                },
                                more_than_99: {
                                    value: 2,
                                    evolution: 0.51,
                                },
                            },
                            charts: {
                                labels: ["January", "February", "March"],
                                total: [40, 20, 12],
                                less_than_10: [35, 2, 150],
                                between_10_and_99: [123, 92, 96],
                                more_than_99: [312, 523, 356],
                            },
                        },
                        inhabitants: {
                            figures: {
                                total: {
                                    value: 1768,
                                    evolution: 0.03,
                                },
                                european: {
                                    value: 1256,
                                    evolution: 0.123,
                                },
                                foreign: {
                                    value: 512,
                                    evolution: -0.12,
                                },
                            },
                            charts: {
                                labels: ["January", "February", "March"],
                                total: [40, 20, 12],
                                european: [35, 2, 150],
                                foreign: [123, 92, 96],
                            },
                        },
                    },
                    livingConditions: {
                        water: {
                            figures: {
                                towns_total: {
                                    value: 15,
                                    evolution: 0.3,
                                },
                                inhabitants_total: {
                                    value: 123,
                                    evolution: -0.2,
                                },
                                access_to_water: {
                                    value: 12,
                                    evolution: 0,
                                },
                            },
                            charts: {
                                labels: ["January", "February", "March"],
                                inhabitants_total: [125, 115, 123],
                                access_to_water: [0, 10, 12],
                            },
                        },
                        electricity: {
                            figures: {
                                towns_total: {
                                    value: 15,
                                    evolution: 0.3,
                                },
                                inhabitants_total: {
                                    value: 123,
                                    evolution: -0.2,
                                },
                                access_to_electricity: {
                                    value: 13,
                                    evolution: 0,
                                },
                            },
                            charts: {
                                labels: ["January", "February", "March"],
                                inhabitants_total: [125, 115, 123],
                                access_to_electricity: [0, 10, 12],
                            },
                        },
                    },
                    justice: {
                        justice: {
                            figures: {
                                police: {
                                    value: 1768,
                                    evolution: 0.3,
                                },
                                complaints: {
                                    value: 1256,
                                    evolution: 0.123,
                                },
                                closed_towns: {
                                    value: 512,
                                    evolution: -0.12,
                                },
                            },
                            charts: {
                                labels: ["January", "February", "March"],
                                police: [40, 20, 12],
                                closed_towns: [35, 2, 150],
                            },
                        },
                    },
                }),
            2000
        );
    });

    // return axios.get(
    //     `/towns/metrics/departement/${encodeURI(
    //         departementCode
    //     )}/evolution?from=${encodeURIComponent(
    //         from.toISOString().slice(0, 10)
    //     )}&to=${encodeURIComponent(to.toISOString().slice(0, 10))}`
    // );
}
