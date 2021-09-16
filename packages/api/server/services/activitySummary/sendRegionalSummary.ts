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
            const regionCode = subscriber.organization.location.region.code;
            const s = summaries[regionCode];

            return sendActivitySummary(subscriber, {
                variables: {
                    campaign: `r${regionCode}-${from.format('DD-MM-YYYY')}`,
                    title: subscriber.organization.location.region.name,
                    from: from.format('DD'),
                    to: to.format('DD MMMM YYYY'),
                    summaries: Object.keys(s).sort().map(departementCode => s[departementCode]),
                },
            });
        }),
    );
};