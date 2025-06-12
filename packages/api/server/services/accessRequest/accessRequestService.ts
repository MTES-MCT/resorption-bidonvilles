import userModel from '#server/models/userModel/index';
import authUtils from '#server/utils/auth';
import getActiveAdminWhoGrantedAccess from '#server/utils/getActiveAdminWhoGrantedAccess';
import { User } from '#root/types/resources/User.d';
import sendEmail from './mailer';
import scheduler from './scheduler';

const { getAccountActivationLink } = authUtils;
const { scheduleEvent, cancelEvent } = scheduler;

function isAccessRequestPending(user) {
    return user.status === 'new' && user.user_accesses.length === 0;
}

function isAccessPending(user) {
    return user.status === 'new' && user.user_accesses.length > 0;
}

function isAccessExpired(user) {
    const now = new Date();
    return user.status === 'new' && user.user_accesses.length > 0 && user.user_accesses[0].expires_at < now;
}

export default {
    /**
     * Resets all scheduled events for a given user
     *
     * @param {User} user
     *
     * @returns {undefined}
     */
    async resetRequestsForUser(user) {
        await cancelEvent.accessRequestIsPending(user.id);

        if (user.user_accesses.length > 0) {
            await Promise.all([
                cancelEvent.accessPending(user.user_accesses[0].id),
                cancelEvent.accessExpired(user.user_accesses[0].id),
                cancelEvent.accessAboutToExpire(user.user_accesses[0].id),
            ]);
        }
    },

    /**
     * Handle new access request
     *
     * @param {User} user
     */
    async handleNewAccessRequest(user: User): Promise<void> {
        const admins = await userModel.getAdminsFor(user);

        // notify user and admin
        await Promise.all([
            sendEmail.toUser.newRequestConfirmation(user),
            sendEmail.toAdmin.newRequestNotification(admins, user),
        ]);

        // schedule events
        await scheduleEvent.accessRequestIsPending(user.id);
    },

    /**
     * Handle access request pending
     *
     * @param {Boolean} firstNotification Wether this is the first or the second pending notification
     * @param {Number}  userId
     */
    async handleAccessRequestPending(firstNotification: boolean, userId: number) {
        // fetch data
        const user = await userModel.findOne(userId, {
            extended: true,
        });
        if (user === null || !isAccessRequestPending(user)) {
            return;
        }

        const admins = await userModel.getAdminsFor(user);

        // notify admin
        if (firstNotification === true) {
            await sendEmail.toAdmin.firstRequestPendingNotification(admins, user);
        } else {
            await sendEmail.toAdmin.secondRequestPendingNotification(admins, user);
        }
    },

    /**
     * Handle access request denied
     *
     * @param {User} user
     * @param {User} admin
     */
    async handleAccessRequestDenied(user, admin) {
        // notify user
        await sendEmail.toUser.accessDenied(user, admin);

        // cancel scheduled events
        await cancelEvent.accessRequestIsPending(user.id);
    },

    /**
     * Handle access request approved
     *
     * @param {User} user
     * @param {UserAccess} userAccess
     */
    async handleAccessRequestApproved(user, userAccess) {
        // notify user
        await sendEmail.toUser.accessGranted(
            user,
            userAccess.sent_by,
            getAccountActivationLink(userAccess.id),
            new Date(userAccess.expires_at * 1000),
        );

        // schedule new events
        await Promise.all([
            cancelEvent.accessRequestIsPending(user.id),
            scheduleEvent.accessPending(userAccess.id),
            scheduleEvent.accessExpired(userAccess.id),
        ]);
    },

    /**
     * Handle access is pending
     *
     * @param {Number} accessId
     */
    async handleAccessPending(accessId: number) {
        const user = await userModel.findOneByAccessId(accessId);
        if (user === null || !isAccessPending(user)) {
            return;
        }

        await sendEmail.toUser.accessPending(
            user,
            getAccountActivationLink(user.user_accesses[0].id),
            new Date(user.user_accesses[0].expires_at * 1000),
            null,
        );
    },

    /**
     * Handle access is about to expire
     *
     * @param {Number} accessId
     */
    async handleAccessAboutToExpire(accessId: number, hoursBeforeExpirationDate) {
        const user = await userModel.findOneByAccessId(accessId);
        if (user === null || !isAccessPending(user)) {
            return;
        }

        await sendEmail.toUser.accessPending(
            user,
            getAccountActivationLink(user.user_accesses[0].id),
            new Date(user.user_accesses[0].expires_at * 1000),
            hoursBeforeExpirationDate,
        );
    },

    /**
     * Handle access expired
     *
     * @param {Number} accessId
     */
    async handleAccessExpired(accessId) {
        const user = await userModel.findOneByAccessId(accessId);
        if (user === null || !isAccessExpired(user)) {
            return;
        }

        const mailPromises = [];

        mailPromises.push(
            sendEmail.toUser.accessExpired(user),
        );

        const activeAdmin = await getActiveAdminWhoGrantedAccess(user);
        if (activeAdmin !== null) {
            mailPromises.push(
                sendEmail.toAdmin.accessExpired(
                    user.user_accesses[0].sent_by,
                    user,
                    new Date(user.user_accesses[0].created_at * 1000),
                ),
            );
        }
        await Promise.all(mailPromises);
    },

    /**
     * Handle access activation
     *
     * @param {User} user
     */
    async handleAccessActivated(user) {
        const mailPromises = [];
        mailPromises.push(
            sendEmail.toUser.accessActivated(user),
        );

        const activeAdmin = await getActiveAdminWhoGrantedAccess(user);
        if (activeAdmin !== null) {
            mailPromises.push(
                sendEmail.toAdmin.accessActivated(user.user_accesses[0].sent_by, user),
            );
        }
        mailPromises.push(
            scheduleEvent.accessActivatedOnboarding(user),
        );
        await Promise.all(mailPromises);

        // cancel scheduled events
        await Promise.all([
            cancelEvent.accessPending(user.user_accesses[0].id),
            cancelEvent.accessExpired(user.user_accesses[0].id),
            cancelEvent.accessAboutToExpire(user.user_accesses[0].id),
        ]);
    },
};
