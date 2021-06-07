const { toString: dateToString } = require('#server/utils/date');
const {
    sendAdminNewRequestNotification,
    sendAdminRequestPendingReminder1,
    sendAdminRequestPendingReminder2,
    sendAdminAccessActivated,
    sendAdminAccessExpired,
    sendUserAccessRequestConfirmation,
    sendUserAccessGranted,
    sendUserAccessDenied,
    sendUserAccessPending,
    sendUserAccessExpired,
    sendUserAccessActivatedWelcome,
} = require('#server/mails/mails');

module.exports = {
    toAdmin: {
        newRequestNotification(admins) {
            return Promise.all(
                admins.map(admin => sendAdminNewRequestNotification(admin)),
            );
        },

        firstRequestPendingNotification(admins) {
            return Promise.all(
                admins.map(admin => sendAdminRequestPendingReminder1(admin)),
            );
        },

        secondRequestPendingNotification(admins) {
            return Promise.all(
                admins.map(admin => sendAdminRequestPendingReminder2(admin)),
            );
        },

        accessExpired(admin, user, submitDate) {
            return sendAdminAccessExpired(admin, {
                variables: {
                    userName: `${user.first_name} ${user.last_name}`,
                    activationUrlSentDate: dateToString(submitDate),
                },
            });
        },

        accessActivated(admin, user) {
            return sendAdminAccessActivated(admin, {
                variables: { userName: `${user.first_name} ${user.last_name}` },
            });
        },
    },

    toUser: {
        newRequestConfirmation(user) {
            return sendUserAccessRequestConfirmation(user);
        },

        accessDenied(user, admin) {
            return sendUserAccessDenied(user, {
                variables: {
                    adminName: `${admin.first_name} ${admin.last_name}`,
                },
            });
        },

        accessGranted(user, admin, activationLink, expiracyDate) {
            return sendUserAccessGranted(user, {
                variables: {
                    adminName: `${admin.first_name} ${admin.last_name}`,
                    activationUrl: activationLink,
                    activationUrlExpDate: expiracyDate,
                },
            });
        },

        accessPending(user, admin, activationLink) {
            return sendUserAccessPending(user, {
                variables: {
                    activationUrl: activationLink,
                },
            });
        },

        accessExpired(user) {
            return sendUserAccessExpired(user);
        },
        accessActivated(user) {
            return sendUserAccessActivatedWelcome(user);
        },
    },
};
