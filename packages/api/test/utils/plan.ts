module.exports = {
    serialized(location, override = {}) {
        const { departement, region } = location;

        const plan = {
            type: 'plan',
            id: 1,
            departement,
            region,
            geo_location: {
                type: 'departement',
                region,
                departement,
                epci: null,
                city: null,
            },
        };

        return {
            ...plan,
            ...override,
        };
    },
};
