module.exports = {
    serialized(override = {}) {
        const defaultObj = {
            id: 1,
            description: 'Un commentaire',
            createdAt: (new Date(2020, 0, 1, 0, 0, 0)).getTime() / 1000,
            organization_target_name: [],
            user_target_name: [],
            createdBy: {
                id: 2,
                firstName: 'Jean',
                lastName: 'Dupont',
                position: 'Mock',
                organization: 'DIHAL',
                organizationId: 2,
            },
            shantytown: 1,
            tags: [
                { uid: 'livingConditions', label: 'Conditions de vie', type: 'ordinaire' },
                { uid: 'onSiteVisit', label: 'Passage sur Site', type: 'ordinaire' },
            ],
        };

        return Object.assign(defaultObj, override);
    },
};
