import { ActivityNationalSummary } from "#server/models/activityModel/types/ActivityNationalSummary";
import { User } from '#server/models/userModel/types/User';
const { sendActivitySummary } = require('#server/mails/mails');
import * as moment from 'moment';
moment.locale('fr');

export default async (argFrom: Date, argTo: Date, summaries: ActivityNationalSummary, subscribers: Array<User>): Promise<Array<void>> => {
    const from = moment(argFrom);
    const to = moment(argTo);

    return Promise.all(
        subscribers.map((subscriber) => {
            const { location } = subscriber.organization;
            sendActivitySummary(subscriber, {
                variables: {
                    campaign: `d${location.departement.code}-${from.format('DD-MM-YYYY')}`,
                    title: location.departement.name,
                    from: from.format('DD'),
                    to: to.format('DD MMMM YYYY'),
                    summaries: [
                        summaries[location.region.code][location.departement.code],
                    ],
                },
            });
        }),
    );
};