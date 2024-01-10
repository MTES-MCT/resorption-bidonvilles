export type Region = {
    code: string;
    name: string;
};

export type RegionWithCoordinates = Region & {
    latitude: number;
    longitude: number;
    chieftown: {
        latitude: number;
        longitude: number;
    }
};
