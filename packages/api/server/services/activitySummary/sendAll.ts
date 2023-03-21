import activityModel from '#server/models/activityModel';
import userModel from '#server/models/userModel';
import { SummarySubscribers } from '#server/models/userModel/findDepartementSummarySubscribers';
import { QuestionSummary } from '#server/models/activityModel/types/QuestionNationalSummary';
import { ActivityNationalSummary } from '#server/models/activityModel/types/ActivityNationalSummary';
import sendNationalSummary from './sendNationalSummary';
import sendRegionalSummary from './sendRegionalSummary';
import sendDepartementalSummary from './sendDepartementalSummary';


// @todo: créer une fonction qui permet de générer facilement from et to
export default async (day: number, month: number, year: number): Promise<void> => {
    // set date range
    const monday = new Date(year, month, day, 0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);

    // ensure the given date is actually a monday
    if (monday.getDay() !== 1) {
        throw new Error('Veuillez donner une date correspondant à un Lundi');
    }

    // ensure the given date is not part of current week, or future
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    if (today <= sunday) {
        throw new Error('La semaine pour laquelle le rapport d\'activité est à générer doit être passée');
    }

    // compute the activity summaries
    const promises: [
        Promise<QuestionSummary[]>,
        Promise<ActivityNationalSummary>,
        Promise<SummarySubscribers>,
    ] = [
        activityModel.getQuestions(monday, sunday),
        activityModel.get(monday, sunday),
        userModel.findDepartementSummarySubscribers(),
    ];
    const [questions, summary, subscribers] = await Promise.all(promises);
    const questionSummary = { questions, has_question_summary: questions.length > 0 };

    // send the summaries
    await Promise.all([
        sendNationalSummary(monday, sunday, questionSummary, summary, subscribers.nation),
        sendRegionalSummary(monday, sunday, questionSummary, summary, subscribers.region),
        sendDepartementalSummary(monday, sunday, questionSummary, summary, subscribers.departement),
    ]);
};
