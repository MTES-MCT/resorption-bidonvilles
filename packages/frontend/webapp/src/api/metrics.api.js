import { axios } from "@/helpers/axios";

export function getNationMetrics(from, to) {
    return axios.get(
        `/towns/metrics?from=${encodeURIComponent(
            from.toISOString().slice(0, 10)
        )}&to=${encodeURIComponent(to.toISOString().slice(0, 10))}`
    );
}

export function getDepartementMetrics() {
    return new Promise((r) =>
        setTimeout(
            () =>
                r({
                    summary: {
                        number_of_towns: {
                            all: 3,
                            eu_only: 1,
                            unknown_population: 4,
                            out_of_date: 1,
                        },
                        number_of_persons: {
                            all: 77,
                            eu_only: 24,
                        },
                    },
                    cities: [
                        {
                            city: {
                                name: "Chatou",
                                code: "78400",
                                latitude: 48.8963793,
                                longitude: 2.1295524,
                            },
                            towns: [
                                {
                                    id: 1,
                                    usename: "209 boulevard Maxime Gorki",
                                    field_type: "Immeuble bâti",
                                    number_of_persons: 53,
                                    access_to_water: true,
                                    origins: "mixed",
                                },
                                {
                                    id: 2,
                                    usename: "Adresse inconnue",
                                    field_type: "Type de terrain autre",
                                    number_of_persons: 24,
                                    access_to_water: false,
                                    origins: "eu",
                                },
                                {
                                    id: 3,
                                    usename: "Adresse inconnue",
                                    field_type: "Type de terrain autre",
                                    number_of_persons: 24,
                                    access_to_water: false,
                                    origins: "eu",
                                },
                            ],
                        },
                        {
                            city: {
                                name: "Verneuil-sur-seine",
                                code: "78480",
                                latitude: 48.9873963,
                                longitude: 1.9452898,
                            },
                            towns: [
                                {
                                    id: 4,
                                    usename: "1 grande rue",
                                    field_type: "Terrain",
                                    number_of_persons: null,
                                    access_to_water: true,
                                    origins: null,
                                },
                            ],
                        },
                    ],
                }),
            500
        )
    );
}
