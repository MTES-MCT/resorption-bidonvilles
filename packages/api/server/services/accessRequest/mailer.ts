const { toString: dateToString } = require('#server/utils/date');
const { webappUrl } = require('#server/config');

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

const { formatName } = require('#server/models/userModel');

module.exports = {
    toAdmin: {
        newRequestNotification(admins, user) {
            return Promise.all(
                admins.map(admin => sendAdminNewRequestNotification(admin, {
                    variables: {
                        adminUrl: `${webappUrl}/nouvel-utilisateur/${user.id}`,
                        userName: formatName(user),
                        orgName: user.organization.abbreviation || user.organization.name,
                    },
                })),
            );
        },

        firstRequestPendingNotification(admins, user) {
            return Promise.all(
                admins.map(admin => sendAdminRequestPendingReminder1(admin, {
                    variables: {
                        adminUrl: `${webappUrl}/nouvel-utilisateur/${user.id}`,
                        userName: formatName(user),
                        orgName: user.organization.abbreviation || user.organization.name,
                    },
                })),
            );
        },

        secondRequestPendingNotification(admins, user) {
            return Promise.all(
                admins.map(admin => sendAdminRequestPendingReminder2(admin, {
                    variables: {
                        adminUrl: `${webappUrl}/nouvel-utilisateur/${user.id}`,
                        userName: formatName(user),
                        orgName: user.organization.abbreviation || user.organization.name,
                    },
                })),
            );
        },

        accessExpired(admin, user, submitDate) {
            return sendAdminAccessExpired(admin, {
                variables: {
                    userName: formatName(user),
                    activationUrlSentDate: dateToString(submitDate),
                    adminUrl: `${webappUrl}/nouvel-utilisateur/${user.id}`,
                },
            });
        },

        accessActivated(admin, user) {
            return sendAdminAccessActivated(admin, {
                variables: { userName: formatName(user) },
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
                    adminName: formatName(admin),
                },
                replyTo: admin,
            });
        },

        accessGranted(user, admin, activationLink, expiracyDate) {
            return sendUserAccessGranted(user, {
                variables: {
                    adminName: formatName(admin),
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
