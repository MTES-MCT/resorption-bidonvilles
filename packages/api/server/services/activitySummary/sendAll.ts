import config from '#server/config';
import activityModel from '#server/models/activityModel';
import userModel from '#server/models/userModel';
import { QuestionSummary } from '#server/models/activityModel/types/QuestionNationalSummary';
import { ActivityNationalSummary } from '#server/models/activityModel/types/ActivityNationalSummary';
import { User } from '#root/types/resources/User.d';
import sendSummary from './sendSummary';

const { logInProd } = config;

export default async (day: number, month: number, year: number): Promise<void> => {
    if (logInProd) {
        // eslint-disable-next-line no-console
        console.log("Appel au script d'envoie du récap hebdo:", day, month, year);
    }
    // set date range
    const monday = new Date(year, month, day, 0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);

    // ensure the given date is actually a monday
    if (monday.getDay() !== 1) {
        if (logInProd) {
            // eslint-disable-next-line no-console
            console.error("Le jour donné n'est pas un lundi:", monday);
        }

        throw new Error('Veuillez donner une date correspondant à un Lundi');
    }

    // ensure the given date is not part of current week, or future
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    if (today <= sunday) {
        if (logInProd) {
            // eslint-disable-next-line no-console
            console.error("La semaine donnée n'est pas encore passée:", monday, sunday, today);
        }

        throw new Error('La semaine pour laquelle le rapport d\'activité est à générer doit être passée');
    }

    // compute the activity summaries
    const promises: [
        Promise<QuestionSummary[]>,
        Promise<ActivityNationalSummary>,
        Promise<User[]>,
    ] = [
        activityModel.getQuestions(monday, sunday),
        activityModel.get(monday, sunday),
        userModel.findDepartementSummarySubscribers(),
    ];
    const [questions, summary, subscribers] = await Promise.all(promises);

    // send the summaries
    if (logInProd) {
        // eslint-disable-next-line no-console
        console.log("On prépare l'envoi:", 'monday:', monday, 'sunday:', sunday, 'questions:', questions.length, 'summaries:', Object.keys(summary).length, 'subscribers:', subscribers.length);
    }

    await sendSummary(monday, sunday, questions, summary, subscribers);
};
