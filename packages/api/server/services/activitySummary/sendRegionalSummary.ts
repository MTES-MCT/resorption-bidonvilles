import { ActivityNationalSummary } from '#server/models/activityModel/types/ActivityNationalSummary';
import mailsUtils from '#server/mails/mails';
import moment from 'moment';
import PromisePool from '@supercharge/promise-pool';
import { SerializedUser } from '#server/models/userModel/_common/types/SerializedUser.d';
import { QuestionNationalSummary } from '#server/models/activityModel/types/QuestionNationalSummary';

moment.locale('fr');

const { sendActivitySummary } = mailsUtils;

export default async (argFrom: Date, argTo: Date, questionSummary: QuestionNationalSummary, summaries: ActivityNationalSummary, subscribers: Array<SerializedUser>): Promise<any> => {
    const from = moment(argFrom);
    const to = moment(argTo);

    return PromisePool
        .for(subscribers)
        .withConcurrency(10)
        .handleError(() => { }) // catch the error to avoid blocking other emails
        .process((subscriber) => {
            const regionCode = subscriber.organization.location.region.code;
            const s = summaries[regionCode];

            return sendActivitySummary(subscriber, {
                variables: {
                    campaign: `r${regionCode}-${from.format('DD-MM-YYYY')}`,
                    title: subscriber.organization.location.region.name,
                    from: from.format('DD'),
                    to: to.format('DD MMMM YYYY'),
                    questionSummary,
                    summaries: Object.keys(s).sort().map(departementCode => s[departementCode]),
                    showDetails: true,
                },
            });
        });
};
