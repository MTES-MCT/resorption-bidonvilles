import config from '#server/config';
import { ActivityNationalSummary } from '#server/models/activityModel/types/ActivityNationalSummary';
import mailsUtils from '#server/mails/mails';
import moment from 'moment';
import PromisePool from '@supercharge/promise-pool';
import { QuestionSummary } from '#server/models/activityModel/types/QuestionNationalSummary';
import { User } from '#root/types/resources/User.d';

moment.locale('fr');

const { sendActivitySummary } = mailsUtils;
const { logInProd } = config;

export default async (argFrom: Date, argTo: Date, questionSummary: QuestionSummary[], summaries: ActivityNationalSummary, subscribers: Array<User>): Promise<any> => {
    const from = moment(argFrom);
    const to = moment(argTo);
    if (logInProd) {
        // eslint-disable-next-line no-console
        console.log("Activation de l'envoi du récap hebdo à", subscribers.length, 'abonnés');
    }

    return PromisePool
        .for(subscribers)
        .withConcurrency(10)
        .handleError(() => { }) // catch the error to avoid blocking other emails
        .process((subscriber) => {
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
            if (logInProd) {
                // eslint-disable-next-line no-console
                console.log('Envoi du récap hebdo à', subscriber.email, 'avec', subScribedsummaries.length, 'résumés');
            }
            return sendActivitySummary(subscriber, {
                variables: {
                    campaign: `${from.format('DD-MM-YYYY')}`,
                    from: from.format('DD'),
                    to: to.format('DD MMMM YYYY'),
                    questionSummary,
                    summaries: subScribedsummaries,
                    showDetails: true,
                },
            });
        });
};
