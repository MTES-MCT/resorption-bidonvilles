type MetricFigures = {
    number_of_towns_with_water: number,
    number_of_persons_with_water: number,
    number_of_persons: { from: number, to: number },
    number_of_towns: { from: number, to: number },
};

export type Metrics = {
    level: 'nation' | 'region' | 'departement',
    uid: string,
    name: string,
    metrics: MetricFigures,
    children?: Metrics[]
};
