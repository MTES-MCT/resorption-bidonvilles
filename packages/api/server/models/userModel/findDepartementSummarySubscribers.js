const query = require('./_common/query');

module.exports = async () => {
    const users = await query(
        [
            {
                fk_status: ['active'],
            },
            {
                zeroUnsubscriptions: {
                    query: 'email_unsubscriptions.unsubscriptions',
                    value: null,
                },
                notUnsubscribedToWeeklySummary: {
                    not: true,
                    value: 'weekly_summary',
                    operator: 'isAny',
                    query: 'email_unsubscriptions.unsubscriptions',
                },
            },
        ],
        {},
    );

    return users.reduce((argAcc, user) => {
        const acc = { ...argAcc };

        let locationType = user.organization.location.type;
        if (!acc[locationType]) {
            locationType = 'departement';
        }

        acc[locationType].push(user);
        return acc;
    }, {
        nation: [],
        region: [],
        departement: [],
    });
};
