import { LocationType } from '#server/models/geoModel/LocationType.d';
import { User } from '#root/types/resources/User.d';
import query from './_common/query';

export type SummarySubscribers = {
    [key in LocationType]: User[]
};

export default async (): Promise<SummarySubscribers> => {
    const users: User[] = await query(
        [
            {
                fk_status: {
                    value: ['active'],
                },
            },
            {
                zeroUnsubscriptions: {
                    query: 'email_unsubscriptions.unsubscriptions',
                    value: null,
                },
                notUnsubscribedToWeeklySummary: {
                    not: true,
                    value: 'weekly_summary',
                    anyOperator: '=',
                    query: 'email_unsubscriptions.unsubscriptions',
                },
            },
        ],
        {},
    );

    return users.reduce((acc, user) => {
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
    } as SummarySubscribers);
};
