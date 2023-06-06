import {
    UserActivity,
    ShantytownActivity,
    ShantytownCommentActivity,
    ActionCommentActivity,
    QuestionActivity,
    AnswerActivity,
} from '../resources/Activity';

export type ServiceActivity = UserActivity |
ShantytownActivity |
ShantytownCommentActivity |
ActionCommentActivity |
QuestionActivity |
AnswerActivity;
