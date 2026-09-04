import { ActivityNationalSummary } from '#server/models/activityModel/types/ActivityNationalSummary';
import mailsUtils from '#server/mails/mails';
import moment from 'moment';
import sendMailsWithConcurrencyLimit from '#server/utils/sendMailsWithConcurrencyLimit';
import { User } from '#root/types/resources/User.d';

moment.locale('fr');

const { sendActivitySummary } = mailsUtils;

export default async function sendSummary(argFrom: Date, argTo: Date, summaries: ActivityNationalSummary, subscribers: Array<User>): Promise<any> {
    const from = moment(argFrom);
    const to = moment(argTo);

    return sendMailsWithConcurrencyLimit(
        subscribers,
        (subscriber) => {
            let subScribedsummaries = [];
            if (subscriber.intervention_areas.is_national) {
                subScribedsummaries = Object.values(summaries).reduce((acc, departements) => {
                    Object.keys(departements).sort((a, b) => a.localeCompare(b)).forEach((code) => {
                        acc.push(departements[code]);
                    });
                    return acc;
                }, []);
            } else {
                subscriber.intervention_areas.areas.forEach((area) => {
                    if (area.type === 'region') {
                        subScribedsummaries.push(...Object.values(summaries[area.region.code]));
                    } else if (area.departement !== null) {
                        subScribedsummaries.push(summaries[area.region.code][area.departement.code]);
                    }
                });
            }
            return sendActivitySummary(subscriber, {
                variables: {
                    campaign: `${from.format('DD-MM-YYYY')}`,
                    from: from.format('DD'),
                    to: to.format('DD MMMM YYYY'),
                    summaries: subScribedsummaries,
                    showDetails: true,
                },
            });
        },
        () => {}, // catch the error to avoid blocking other emails
    );
}
