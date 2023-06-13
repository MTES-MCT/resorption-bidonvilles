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
                    departement: {
                        name: "Yvelines",
                        code: "78",
                        latitude: 48.8181,
                        longitude: 1.8828,
                        chieftown: {
                            latitude: 48.8025669671,
                            longitude: 2.11789297191,
                        },
                    },
                    region: {
                        name: "Île-de-France",
                        code: "11",
                        latitude: 48.7211,
                        longitude: 2.5708,
                        chieftown: {
                            latitude: 48.853,
                            longitude: 2.3499,
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
                                    number_of_households: 32,
                                    number_of_minors: null,
                                    access_to_water: true,
                                    access_to_electricity: true,
                                    trash_evacuation: true,
                                    fire_prevention: true,
                                    toilets: true,
                                    owner_complaint: true,
                                    justice_procedure: true,
                                    police: true,
                                    origins: ["fr"],
                                    latitude: 48.8963793,
                                    longitude: 2.1295524,
                                },
                                {
                                    id: 2,
                                    usename: "Adresse inconnue",
                                    field_type: "Type de terrain autre",
                                    number_of_persons: 24,
                                    number_of_households: 10,
                                    number_of_minors: 2,
                                    access_to_water: false,
                                    access_to_electricity: false,
                                    trash_evacuation: false,
                                    fire_prevention: false,
                                    toilets: false,
                                    owner_complaint: false,
                                    justice_procedure: false,
                                    police: false,
                                    origins: [],
                                    latitude: 48.8963793,
                                    longitude: 2.1295524,
                                },
                                {
                                    id: 3,
                                    usename: "Adresse inconnue",
                                    field_type: "Type de terrain autre",
                                    number_of_persons: 24,
                                    number_of_households: 10,
                                    number_of_minors: null,
                                    access_to_water: null,
                                    access_to_electricity: null,
                                    trash_evacuation: null,
                                    fire_prevention: null,
                                    toilets: null,
                                    owner_complaint: null,
                                    justice_procedure: null,
                                    police: null,
                                    origins: ["eu", "fr"],
                                    latitude: 48.8963793,
                                    longitude: 2.1295524,
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
                                    number_of_households: null,
                                    number_of_minors: null,
                                    access_to_water: true,
                                    access_to_electricity: true,
                                    trash_evacuation: true,
                                    fire_prevention: true,
                                    toilets: true,
                                    owner_complaint: true,
                                    justice_procedure: null,
                                    police: false,
                                    origins: ["foreign"],
                                    latitude: 48.9873963,
                                    longitude: 1.9452898,
                                },
                            ],
                        },
                    ],
                }),
            500
        )
    );
}
