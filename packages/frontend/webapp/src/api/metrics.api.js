export function getNationMetrics(from, to) {
    return new Promise((r) =>
        setTimeout(
            () =>
                r([
                    {
                        level: "nation",
                        uid: "france",
                        name: "France entière",
                        metrics: {
                            number_of_actors: { from: 48914, to: 50381 },
                            number_of_towns_with_water: { from: 430, to: 430 },
                            number_of_persons_with_water: {
                                from: 430,
                                to: 430,
                            },
                            number_of_towns_with_eu_only: {
                                from: 430,
                                to: 430,
                            },
                            number_of_persons: { from: 48914, to: 50381 },
                            number_of_towns: { from: 752, to: 775 },
                        },
                        children: [],
                    },
                    {
                        level: "nation",
                        uid: "metropole",
                        name: "Métropole",
                        metrics: {
                            number_of_actors: { from: 48914, to: 50381 },
                            number_of_towns_with_water: { from: 430, to: 430 },
                            number_of_persons_with_water: {
                                from: 430,
                                to: 430,
                            },
                            number_of_towns_with_eu_only: {
                                from: 430,
                                to: 430,
                            },
                            number_of_persons: { from: 48914, to: 50381 },
                            number_of_towns: { from: 752, to: 775 },
                        },
                        children: [
                            {
                                level: "region",
                                code: "32",
                                name: "Hauts-de-France",
                                metrics: {
                                    number_of_actors: {
                                        from: 48914,
                                        to: 50381,
                                    },
                                    number_of_towns_with_water: {
                                        from: 430,
                                        to: 430,
                                    },
                                    number_of_persons_with_water: {
                                        from: 430,
                                        to: 430,
                                    },
                                    number_of_towns_with_eu_only: {
                                        from: 430,
                                        to: 430,
                                    },
                                    number_of_persons: {
                                        from: 48914,
                                        to: 50381,
                                    },
                                    number_of_towns: { from: 752, to: 775 },
                                },
                                children: [
                                    {
                                        level: "departement",
                                        code: "91",
                                        name: "Essonne",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                    {
                                        level: "departement",
                                        code: "92",
                                        name: "Hauts-de-Seine",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                    {
                                        level: "departement",
                                        code: "75",
                                        name: "Paris",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                    {
                                        level: "departement",
                                        code: "77",
                                        name: "Seine-et-Marne",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                    {
                                        level: "departement",
                                        code: "93",
                                        name: "Seine-Saint-Denis",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                    {
                                        level: "departement",
                                        code: "94",
                                        name: "Val-de-Marne",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                ],
                            },
                            {
                                level: "region",
                                code: "11",
                                name: "Île-de-France",
                                metrics: {
                                    number_of_actors: {
                                        from: 48914,
                                        to: 50381,
                                    },
                                    number_of_towns_with_water: {
                                        from: 430,
                                        to: 430,
                                    },
                                    number_of_persons_with_water: {
                                        from: 430,
                                        to: 430,
                                    },
                                    number_of_towns_with_eu_only: {
                                        from: 430,
                                        to: 430,
                                    },
                                    number_of_persons: {
                                        from: 48914,
                                        to: 50381,
                                    },
                                    number_of_towns: { from: 752, to: 775 },
                                },
                                children: [
                                    {
                                        level: "departement",
                                        code: "91",
                                        name: "Essonne",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                    {
                                        level: "departement",
                                        code: "92",
                                        name: "Hauts-de-Seine",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                    {
                                        level: "departement",
                                        code: "75",
                                        name: "Paris",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                    {
                                        level: "departement",
                                        code: "77",
                                        name: "Seine-et-Marne",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                    {
                                        level: "departement",
                                        code: "93",
                                        name: "Seine-Saint-Denis",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                    {
                                        level: "departement",
                                        code: "94",
                                        name: "Val-de-Marne",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        level: "nation",
                        uid: "outremer",
                        name: "Outre-mer",
                        metrics: {
                            number_of_actors: { from: 48914, to: 50381 },
                            number_of_towns_with_water: { from: 430, to: 430 },
                            number_of_persons_with_water: {
                                from: 430,
                                to: 430,
                            },
                            number_of_towns_with_eu_only: {
                                from: 430,
                                to: 430,
                            },
                            number_of_persons: { from: 48914, to: 50381 },
                            number_of_towns: { from: 752, to: 775 },
                        },
                        children: [
                            {
                                level: "region",
                                code: "32",
                                name: "Hauts-de-France",
                                metrics: {
                                    number_of_actors: {
                                        from: 48914,
                                        to: 50381,
                                    },
                                    number_of_towns_with_water: {
                                        from: 430,
                                        to: 430,
                                    },
                                    number_of_persons_with_water: {
                                        from: 430,
                                        to: 430,
                                    },
                                    number_of_towns_with_eu_only: {
                                        from: 430,
                                        to: 430,
                                    },
                                    number_of_persons: {
                                        from: 48914,
                                        to: 50381,
                                    },
                                    number_of_towns: { from: 752, to: 775 },
                                },
                                children: [
                                    {
                                        level: "departement",
                                        code: "91",
                                        name: "Essonne",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                    {
                                        level: "departement",
                                        code: "92",
                                        name: "Hauts-de-Seine",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                    {
                                        level: "departement",
                                        code: "75",
                                        name: "Paris",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                    {
                                        level: "departement",
                                        code: "77",
                                        name: "Seine-et-Marne",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                    {
                                        level: "departement",
                                        code: "93",
                                        name: "Seine-Saint-Denis",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                    {
                                        level: "departement",
                                        code: "94",
                                        name: "Val-de-Marne",
                                        metrics: {
                                            number_of_actors: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons_with_water: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_towns_with_eu_only: {
                                                from: 430,
                                                to: 430,
                                            },
                                            number_of_persons: {
                                                from: 48914,
                                                to: 50381,
                                            },
                                            number_of_towns: {
                                                from: 752,
                                                to: 775,
                                            },
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ]),
            500
        )
    );
}
