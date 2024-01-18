import { User } from '#root/types/resources/User.d';
import query from './_common/query';

export default async (): Promise<User[]> => query(
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
