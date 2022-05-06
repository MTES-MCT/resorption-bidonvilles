import dateUtils from '#server/utils/date';
import config from '#server/config';

import mails from '#server/mails/mails';

import userModelFactory from '#server/models/userModel';

const { toString: dateToString } = dateUtils;
const { webappUrl } = config;
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
} = mails;
const { formatName } = userModelFactory();

export default {
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
