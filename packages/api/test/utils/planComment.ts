module.exports = {
    serialized(override = {}) {
        const defaultObj = {
            id: 1,
            description: 'Un commentaire',
            createdAt: (new Date(2020, 0, 1, 0, 0, 0)).getTime() / 1000,
            createdBy: {
                id: 2,
                first_name: 'Jean',
                last_name: 'Dupont',
                position: 'Mock',
                organization: 'DIHAL',
                organizationId: 2,
                role: 'direct_collaborator',
            },
            plan: 1,
        };

        return Object.assign(defaultObj, override);
    },
};
