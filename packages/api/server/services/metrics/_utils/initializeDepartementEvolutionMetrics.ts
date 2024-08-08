import { DepartementMetricsEvolution } from '#root/types/resources/DepartementMetricsEvolution.d';

function zeros(length: number): number[] {
    return Array(length).fill(0);
}
export default (listOfDateLabels: string[]):DepartementMetricsEvolution => {
    const n = listOfDateLabels.length;
    return {
        inhabitants: {
            towns: {
                figures: {
                    european: {
                        value: 0,
                        evolution: 0,
                    },
                    foreign: {
                        value: 0,
                        evolution: 0,
                    },
                    total: {
                        value: 0,
                        evolution: 0,
                    },
                    less_than_10: {
                        value: 0,
                        evolution: 0,
                    },
                    between_10_and_99: {
                        value: 0,
                        evolution: 0,
                    },
                    more_than_99: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDateLabels,
                    european: zeros(n),
                    foreign: zeros(n),
                    total: zeros(n),
                    less_than_10: zeros(n),
                    between_10_and_99: zeros(n),
                    more_than_99: zeros(n),
                },
            },
            inhabitants: {
                figures: {
                    total: {
                        value: 0,
                        evolution: 0,
                    },
                    european: {
                        value: 0,
                        evolution: 0,
                    },
                    foreign: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDateLabels,
                    total: zeros(n),
                    european: zeros(n),
                    foreign: zeros(n),
                },
            },
        },
        livingConditions: {
            water: {
                figures: {
                    towns_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_with_access_to_water: {
                        value: 0,
                        evolution: 0,
                    },
                    towns_with_access_to_water: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDateLabels,
                    inhabitants_total: zeros(n),
                    inhabitants_with_access_to_water: zeros(n),
                    towns_total: zeros(n),
                    towns_with_access_to_water: zeros(n),
                },
            },
            electricity: {
                figures: {
                    towns_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_with_access_to_electricity: {
                        value: 0,
                        evolution: 0,
                    },
                    towns_with_access_to_electricity: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDateLabels,
                    inhabitants_total: zeros(n),
                    inhabitants_with_access_to_electricity: zeros(n),
                    towns_total: zeros(n),
                    towns_with_access_to_electricity: zeros(n),
                },
            },
            toilets: {
                figures: {
                    towns_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_with_access_to_toilets: {
                        value: 0,
                        evolution: 0,
                    },
                    towns_with_access_to_toilets: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDateLabels,
                    inhabitants_total: zeros(n),
                    inhabitants_with_access_to_toilets: zeros(n),
                    towns_total: zeros(n),
                    towns_with_access_to_toilets: zeros(n),
                },
            },
            fire_prevention: {
                figures: {
                    towns_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_with_access_to_fire_prevention: {
                        value: 0,
                        evolution: 0,
                    },
                    towns_with_access_to_fire_prevention: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDateLabels,
                    inhabitants_total: zeros(n),
                    inhabitants_with_access_to_fire_prevention: zeros(n),
                    towns_total: zeros(n),
                    towns_with_access_to_fire_prevention: zeros(n),
                },
            },
            trash_evacuation: {
                figures: {
                    towns_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_with_access_to_trash_evacuation: {
                        value: 0,
                        evolution: 0,
                    },
                    towns_with_access_to_trash_evacuation: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDateLabels,
                    inhabitants_total: zeros(n),
                    inhabitants_with_access_to_trash_evacuation: zeros(n),
                    towns_total: zeros(n),
                    towns_with_access_to_trash_evacuation: zeros(n),
                },
            },
            pest_animals: {
                figures: {
                    towns_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_total: {
                        value: 0,
                        evolution: 0,
                    },
                    inhabitants_with_absence_of_pest_animals: {
                        value: 0,
                        evolution: 0,
                    },
                    towns_with_absence_of_pest_animals: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDateLabels,
                    inhabitants_total: zeros(n),
                    inhabitants_with_absence_of_pest_animals: zeros(n),
                    towns_total: zeros(n),
                    towns_with_absence_of_pest_animals: zeros(n),
                },
            },
        },
        justice: {
            justice: {
                figures: {
                    police: {
                        value: 0,
                        evolution: 0,
                    },
                    complaints: {
                        value: 0,
                        evolution: 0,
                    },
                },
                charts: {
                    labels: listOfDateLabels,
                    police: zeros(n),
                    complaints: zeros(n),
                },
            },
        },
    };
};
