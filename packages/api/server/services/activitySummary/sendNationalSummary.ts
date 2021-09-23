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
        .map(departementCode => departements[departementCode])
        .filter(departement => departement.new_shantytowns.length
            + departement.closed_shantytowns.length
            + departement.updated_shantytowns.length
            + departement.new_comments.length
            + departement.new_users.length > 0);

    if (summaries.length === 0) {
        // @todo: send a default email ?
        return Promise.resolve([]);
    }

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
            },
        }));
};