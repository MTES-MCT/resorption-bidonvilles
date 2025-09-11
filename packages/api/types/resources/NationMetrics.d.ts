type NationMetricFigures = {
    number_of_towns_with_water: number,
    number_of_persons_with_water: number,
    number_of_persons: { from: number, to: number },
    number_of_persons_european_10_and_over: { from: number, to: number },
    number_of_towns: { from: number, to: number },
    number_of_towns_european_10_and_over: { from: number, to: number },
    number_of_towns_unknown_origin: { from: number, to: number },
    number_of_towns_out_of_date: { from: number, to: number },
};

export type NationMetrics = {
    level: 'nation' | 'region' | 'departement',
    uid: string,
    name: string,
    metrics: NationMetricFigures,
    children?: NationMetrics[]
};
