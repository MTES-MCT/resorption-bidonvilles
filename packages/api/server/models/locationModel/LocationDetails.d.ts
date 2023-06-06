export type LocationDetails = {
    code: string,
    name: string,
};

export type CityLocationDetails = LocationDetails & {
    main: string | null,
};
