import { ActivityNationalSummary } from "#server/models/activityModel/types/ActivityNationalSummary";
import { User } from '#server/models/userModel/types/User';
const { sendActivitySummary } = require('#server/mails/mails');
import * as moment from 'moment';
const PromisePool = require('@supercharge/promise-pool');
moment.locale('fr');

export default async (argFrom: Date, argTo: Date, summaries: ActivityNationalSummary, subscribers: Array<User>): Promise<Array<void>> => {
    const from = moment(argFrom);
    const to = moment(argTo);

    return PromisePool
        .for(subscribers)
        .withConcurrency(10)
        .handleError(() => { }) // catch the error to avoid blocking other emails
        .process((subscriber) => {
            const { location } = subscriber.organization;

            return sendActivitySummary(subscriber, {
                variables: {
                    campaign: `d${location.departement.code}-${from.format('DD-MM-YYYY')}`,
                    title: location.departement.name,
                    from: from.format('DD'),
                    to: to.format('DD MMMM YYYY'),
                    summaries: [
                        summaries[location.region.code][location.departement.code],
                    ],
                    showDetails: true,
                },
            });
        });
};