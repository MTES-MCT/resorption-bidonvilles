import locations from "./location";
const defaultLocation = locations.paris.city();

export function serialized(location = defaultLocation, override = {}) {
    const {
        city, epci, departement, region,
    } = location;

    const shantytown = {
        type: 'shantytown',
        id: 1,
        city,
        epci,
        departement,
        region,
    };

    return {
        ...shantytown,
        ...override,
    };
}