const query = require('./_common/query');

module.exports = async () => {
    const users = await query(
        [
            {
                fk_status: ['active'],
            },
            {
                subscription: {
                    value: 'weekly_summary',
                    operator: 'isAny',
                    query: 'email_subscriptions.subscriptions',
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
