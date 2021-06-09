const { toString: dateToString } = require('#server/utils/date');
const { frontUrl } = require('#server/config');

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
    formatName,
} = require('#server/mails/mails');

module.exports = {
    toAdmin: {
        newRequestNotification(admins, user) {
            return Promise.all(
                admins.map(admin => sendAdminNewRequestNotification(admin, { variables: { adminUrl: `${frontUrl}/nouvel-utilisateur/${user.id}` } })),
            );
        },

        firstRequestPendingNotification(admins, user) {
            return Promise.all(
                admins.map(admin => sendAdminRequestPendingReminder1(admin, { variables: { adminUrl: `${frontUrl}/nouvel-utilisateur/${user.id}` } })),
            );
        },

        secondRequestPendingNotification(admins, user) {
            return Promise.all(
                admins.map(admin => sendAdminRequestPendingReminder2(admin, { variables: { adminUrl: `${frontUrl}/nouvel-utilisateur/${user.id}` } })),
            );
        },

        accessExpired(admin, user, submitDate) {
            return sendAdminAccessExpired(admin, {
                variables: {
                    userName: formatName(user.first_name, user.last_name),
                    activationUrlSentDate: dateToString(submitDate),
                    adminUrl: `${frontUrl}/nouvel-utilisateur/${user.id}`,
                },
            });
        },

        accessActivated(admin, user) {
            return sendAdminAccessActivated(admin, {
                variables: { userName: formatName(user.first_name, user.last_name) },
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
                    adminName: formatName(admin.first_name, admin.last_name),
                },
                replyTo: admin,
            });
        },

        accessGranted(user, admin, activationLink, expiracyDate) {
            return sendUserAccessGranted(user, {
                variables: {
                    adminName: formatName(admin.first_name, admin.last_name),
                    activationUrl: activationLink,
                    activationUrlExpDate: dateToString(expiracyDate, true),
                },
            });
        },

        accessPending(user, admin, activationLink, expiracyDate) {
            return sendUserAccessPending(user, {
                variables: {
                    activationUrl: activationLink,
                    activationUrlExpDate: dateToString(expiracyDate, true),
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
