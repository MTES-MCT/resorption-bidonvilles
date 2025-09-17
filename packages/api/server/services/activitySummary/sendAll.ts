import activityModel from '#server/models/activityModel';
import userModel from '#server/models/userModel';
import { QuestionSummary } from '#server/models/activityModel/types/QuestionNationalSummary';
import { ActivityNationalSummary } from '#server/models/activityModel/types/ActivityNationalSummary';
import { User } from '#root/types/resources/User.d';
import sendSummary from './sendSummary';

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
        Promise<User[]>,
    ] = [
        activityModel.getQuestions(monday, sunday),
        activityModel.get(monday, sunday),
        userModel.findDepartementSummarySubscribers(),
    ];
    const [questions, summary, subscribers] = await Promise.all(promises);

    // send the summaries
    await sendSummary(monday, sunday, questions, summary, subscribers);
};
