import { ActivityNationalSummary } from '#server/models/activityModel/types/ActivityNationalSummary';
import { User } from '#server/models/userModel/types/User';
import mails from '#server/mails/mails';
import moment from 'moment';
import PromisePool from '@supercharge/promise-pool';

const { sendActivitySummary } = mails;

export default async (argFrom: Date, argTo: Date, argSummaries: ActivityNationalSummary, subscribers: Array<User>): Promise<any> => {
    const from = moment(argFrom);
    const to = moment(argTo);

    const departements = Object.values(argSummaries).reduce((acc, d) => ({
        ...acc,
        ...d,
    }), {});

    const summaries = Object.keys(departements)
        .sort()
        .map(departementCode => departements[departementCode]);

    return PromisePool
        .for(subscribers)
        .withConcurrency(10)
        .handleError(() => { }) // catch the error to avoid blocking other emails
        .process(subscriber => sendActivitySummary(subscriber, {
            variables: {
                campaign: `n-${from.format('DD-MM-YYYY')}`,
                from: from.format('DD'),
                to: to.format('DD MMMM YYYY'),
                summaries,
                showDetails: false,
            },
        }));
};
