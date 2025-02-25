export type DepartementMetricsEvolution = {
    inhabitants: {
        towns: {
            figures: {
                total: {
                    value: number,
                    evolution: number,
                },
                less_than_10: {
                    value: number,
                    evolution: number,
                },
                between_10_and_99: {
                    value: number,
                    evolution: number,
                },
                more_than_99: {
                    value: number,
                    evolution: number,
                },
                minors_in_school: {
                    value: number,
                    evolution: number,
                },
            },
            charts: {
                labels: string[],
                total: number[],
                less_than_10: number[],
                between_10_and_99: number[],
                more_than_99: number[],
                minors_in_school: number[],
            },
        },
        inhabitants: {
            figures: {
                total: {
                    value: number,
                    evolution: number,
                },
                european: {
                    value: number,
                    evolution: number,
                },
                foreign: {
                    value: number,
                    evolution: number,
                },
            },
            charts: {
                labels: string[],
                total: number[],
                european: number[],
                foreign: number[],
            },
        },
    },
    livingConditions: {
        water: {
            figures: {
                towns_total: {
                    value: number,
                    evolution: number,
                },
                inhabitants_total: {
                    value: number,
                    evolution: number,
                },
                inhabitants_with_access_to_water: {
                    value: number,
                    evolution: number,
                },
                towns_with_access_to_water:
                {
                    value: number,
                    evolution: number,
                },
            },
            charts: {
                labels: string[],
                inhabitants_total: number[],
                inhabitants_with_access_to_water: number[],
                towns_total: number[],
                towns_with_access_to_water: number[],
            },
        },
        electricity: {
            figures: {
                towns_total: {
                    value: number,
                    evolution: number,
                },
                inhabitants_total: {
                    value: number,
                    evolution: number,
                },
                inhabitants_with_access_to_electricity: {
                    value: number,
                    evolution: number,
                },
                towns_with_access_to_electricity:{
                    value: number,
                    evolution: number,
                }
            },
            charts: {
                labels: string[],
                inhabitants_total: number[],
                inhabitants_with_access_to_electricity: number[],
                towns_total: number[],
                towns_with_access_to_electricity: number[],
            },
        },
        toilets: {
            figures: {
                towns_total: {
                    value: number,
                    evolution: number,
                },
                inhabitants_total: {
                    value: number,
                    evolution: number,
                },
                inhabitants_with_access_to_toilets: {
                    value: number,
                    evolution: number,
                },
                towns_with_access_to_toilets: {
                    value: number,
                    evolution: number,
                }
            },
            charts: {
                labels: string[],
                inhabitants_total: number[],
                inhabitants_with_access_to_toilets: number[],
                towns_total: number[],
                towns_with_access_to_toilets: number[],
            },
        },
        fire_prevention: {
            figures: {
                towns_total: {
                    value: number,
                    evolution: number,
                },
                inhabitants_total: {
                    value: number,
                    evolution: number,
                },
                inhabitants_with_access_to_fire_prevention: {
                    value: number,
                    evolution: number,
                },
                towns_with_access_to_fire_prevention: {
                    value: number,
                    evolution: number,
                }
            },
            charts: {
                labels: string[],
                inhabitants_total: number[],
                inhabitants_with_access_to_fire_prevention: number[],
                towns_total: number[],
                towns_with_access_to_fire_prevention: number[],
            },
        },
        trash_evacuation: {
            figures: {
                towns_total: {
                    value: number,
                    evolution: number,
                },
                inhabitants_total: {
                    value: number,
                    evolution: number,
                },
                inhabitants_with_access_to_trash_evacuation: {
                    value: number,
                    evolution: number,
                },
                towns_with_access_to_trash_evacuation: {
                    value: number,
                    evolution: number,
                }
            },
            charts: {
                labels: string[],
                inhabitants_total: number[],
                inhabitants_with_access_to_trash_evacuation: number[],
                towns_total: number[],
                towns_with_access_to_trash_evacuation: number[],
            },
        },
        pest_animals: {
            figures: {
                towns_total: {
                    value: number,
                    evolution: number,
                },
                inhabitants_total: {
                    value: number,
                    evolution: number,
                },
                inhabitants_with_absence_of_pest_animals: {
                    value: number,
                    evolution: number,
                },
                towns_with_absence_of_pest_animals: {
                    value: number,
                    evolution: number,
                }
            },
            charts: {
                labels: string[],
                inhabitants_total: number[],
                inhabitants_with_absence_of_pest_animals: number[],
                towns_total: number[],
                towns_with_absence_of_pest_animals: number[],
            },
        }
    },
    justice: {
        justice: {
            figures: {
                police: {
                    value: number,
                    evolution: number,
                },
                complaints: {
                    value: number,
                    evolution: number,
                },
            },
            charts: {
                labels: string[],
                police: number[],
                complaints: number[],
            },
        },
    },
};
