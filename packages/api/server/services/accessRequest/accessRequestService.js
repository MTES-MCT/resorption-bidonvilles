const { sequelize } = require('#db/models/index');
const { user: userModel } = require('#server/models/index')(sequelize);
const { getAccountActivationLink } = require('#server/utils/auth');

const sendEmail = require('./mailer');
const { scheduleEvent, cancelEvent } = require('./scheduler');

function isAccessRequestPending(user) {
    return user.status === 'new' && user.user_access === null;
}

function isAccessPending(user) {
    return user.status === 'new' && user.user_access !== null;
}

function isAccessExpired(user) {
    const now = new Date();
    return user.status === 'new' && user.user_access !== null && user.user_access.expires_at < now;
}

module.exports = {
    /**
     * Resets all scheduled events for a given user
     *
     * @param {User} user
     *
     * @returns {undefined}
     */
    async resetRequestsForUser(user) {
        await cancelEvent.accessRequestIsPending(user.id);

        if (user.user_access !== null) {
            await Promise.all([
                cancelEvent.accessPending(user.user_access.id),
                cancelEvent.accessExpired(user.user_access.id),
            ]);
        }
    },

    /**
     * Handle new access request
     *
     * @param {User} user
     */
    async handleNewAccessRequest(user) {
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
    async handleAccessRequestPending(firstNotification, userId) {
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
     */
    async handleAccessRequestApproved(user) {
        // notify user
        await sendEmail.toUser.accessGranted(
            user,
            user.user_access.sent_by,
            getAccountActivationLink(user.user_access.id),
            new Date(user.user_access.expires_at * 1000),
        );

        // schedule new events
        await Promise.all([
            cancelEvent.accessRequestIsPending(user.id),
            scheduleEvent.accessPending(user.user_access.id),
            scheduleEvent.accessExpired(user.user_access.id),
        ]);
    },

    /**
     * Handle access is pending
     *
     * @param {Number} accessId
     */
    async handleAccessPending(accessId) {
        // fetch data
        const user = await userModel.findOneByAccessId(accessId);
        if (user === null || !isAccessPending(user)) {
            return;
        }

        // notify the user
        await sendEmail.toUser.accessPending(
            user,
            user.user_access.sent_by,
            getAccountActivationLink(user.user_access.id),
            new Date(user.user_access.expires_at * 1000),
        );
    },

    /**
     * Handle access expired
     *
     * @param {Number} accessId
     */
    async handleAccessExpired(accessId) {
        // fetch data
        const user = await userModel.findOneByAccessId(accessId);
        if (user === null || !isAccessExpired(user)) {
            return;
        }

        // notify the user and the admin
        await Promise.all([
            sendEmail.toUser.accessExpired(
                user,
                user.user_access.sent_by,
                new Date(user.user_access.expires_at * 1000),
            ),
            sendEmail.toAdmin.accessExpired(
                user.user_access.sent_by,
                user,
                new Date(user.user_access.created_at * 1000),
            ),
        ]);
    },

    /**
     * Handle access activation
     *
     * @param {User} user
     */
    async handleAccessActivated(user) {
        await Promise.all([
            sendEmail.toAdmin.accessActivated(user.user_access.sent_by, user),
            sendEmail.toUser.accessActivated(user),
        ]);

        await Promise.all([
            cancelEvent.accessPending(user.user_access.id),
            cancelEvent.accessExpired(user.user_access.id),
        ]);
    },
};
