import query from './_common/query';

export default async () => {
    const users = await query(
        [
            {
                fk_status: {
                    value: ['active'],
                },
            },
            {
                subscribed_to_summary: {
                    value: true,
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
