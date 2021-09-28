import { ActivityNationalSummary } from "#server/models/activityModel/types/ActivityNationalSummary";
import { User } from '#server/models/userModel/types/User';
const { sendActivitySummary } = require('#server/mails/mails');
import * as moment from 'moment';
const PromisePool = require('@supercharge/promise-pool');

export default async (argFrom: Date, argTo: Date, argSummaries: ActivityNationalSummary, subscribers: Array<User>): Promise<Array<void>> => {
    const from = moment(argFrom);
    const to = moment(argTo);

    const departements = Object.values(argSummaries).reduce((acc, d) => {
        return {
            ...acc,
            ...d,
        };
    }, {});

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