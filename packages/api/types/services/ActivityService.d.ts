import {
    UserActivity,
    ShantytownActivity,
    ShantytownCommentActivity,
    ActionCommentActivity,
} from '../resources/Activity';

export type ServiceActivity = UserActivity |
ShantytownActivity |
ShantytownCommentActivity |
ActionCommentActivity;
