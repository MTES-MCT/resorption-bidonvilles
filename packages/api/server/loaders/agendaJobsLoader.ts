import accessRequestService from '#server/services/accessRequest/accessRequestService';
import mailUtils from '#server/mails/mails';
import moment from 'moment';
import activitySummary from '#server/services/activitySummary';
import sendActionAlert from '#server/services/action/sendAlert';
import config from '#server/config';
import userService from '#server/services/user/index';
import cleanAttachmentArchives from '#server/services/attachment/cleanArchives';
import anonymizeUser from '#server/services/user/anonymizeUser';

const {
    sendUserDemoInvitation,
    sendUserEntraideInvitation,
    sendUserFeatures,
    sendUserShare,
    sendUserReview,
} = mailUtils;
const { sendActivitySummary, sendActionAlerts, checkInactiveUsers } = config;

export default (agenda) => {
    agenda.define(
        'send_action_alert_postshot',
        async () => {
            if (sendActionAlerts) {
                await sendActionAlert('postshot');
            }
        },
    );

    agenda.define(
        'send_action_alert_preshot',
        async () => {
            if (sendActionAlerts) {
                await sendActionAlert('preshot');
            }
        },
    );

    agenda.define(
        'send_activity_summary',
        async () => {
            if (sendActivitySummary) {
                const now = moment().utcOffset(2).subtract(7, 'days');
                await activitySummary.sendAll(now.date(), now.month(), now.year());
            }
        },
    );

    agenda.define(
        'inactive_users_check',
        async () => {
            if (checkInactiveUsers) {
                await userService.sendInactiveUserAlerts();
                await userService.deactivateInactiveUsers();
            }
        },
    );

    agenda.define(
        'access_request_pending_1st',
        (job) => {
            const { userId } = job.attrs.data;
            accessRequestService.handleAccessRequestPending(true, parseInt(userId, 10));
        },
    );

    agenda.define(
        'access_request_pending_2nd',
        (job) => {
            const { userId } = job.attrs.data;
            accessRequestService.handleAccessRequestPending(false, parseInt(userId, 10));
        },
    );

    agenda.define(
        'access_is_pending',
        (job) => {
            const { accessId } = job.attrs.data;
            accessRequestService.handleAccessPending(parseInt(accessId, 10));
        },
    );

    agenda.define(
        'access_is_expired',
        (job) => {
            const { accessId } = job.attrs.data;
            accessRequestService.handleAccessExpired(parseInt(accessId, 10));
        },
    );

    agenda.define(
        'demo_invitation',
        (job) => {
            const { user } = job.attrs.data;
            sendUserDemoInvitation(user);
        },
    );

    agenda.define(
        'entraide_invitation',
        (job) => {
            const { user } = job.attrs.data;
            sendUserEntraideInvitation(user);
        },
    );

    agenda.define(
        'user_features',
        (job) => {
            const { user } = job.attrs.data;
            sendUserFeatures(user);
        },
    );

    agenda.define(
        'user_share',
        (job) => {
            const { user } = job.attrs.data;
            sendUserShare(user);
        },
    );

    agenda.define(
        'user_review',
        (job) => {
            const { user } = job.attrs.data;
            sendUserReview(user);
        },
    );

    agenda.define(
        'clean_attachments_archives',
        async () => {
            await cleanAttachmentArchives();
        },
    );

    agenda.define(
        'anonymize_inactive_users',
        async () => {
            await anonymizeUser();
        },
    );
};
