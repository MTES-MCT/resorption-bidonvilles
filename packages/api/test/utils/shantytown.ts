export default {
    serialized(location, override = {}) {
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
    },
};
