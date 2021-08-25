module.exports = {
    serialized(override = {}) {
        const defaultObj = {
            id: 1,
            description: 'Un commentaire',
            createdAt: (new Date(2020, 0, 1, 0, 0, 0)).getTime() / 1000,
            private: false,
            createdBy: {
                id: 2,
                first_name: 'Jean',
                last_name: 'Dupont',
                position: 'Mock',
                organization: 'DIHAL',
                organization_id: 2,
            },
            shantytown: 1,
        };

        return Object.assign(defaultObj, override);
    },
};
