const mailService = require('#server/services/mailService');

module.exports = {
    toAdmin: {
        newRequestNotification(admins, user) {
            return Promise.all(
                admins.map(admin => mailService.send(
                    'access_request/admin/new_request_notification',
                    admin,
                    user,
                    [user],
                    !mailService.PRESERVE_RECIPIENT,
                )),
            );
        },

        firstRequestPendingNotification(admins, user) {
            return Promise.all(
                admins.map(admin => mailService.send(
                    'access_request/admin/request_pending_reminder_1',
                    admin,
                    user,
                    [user],
                    !mailService.PRESERVE_RECIPIENT,
                )),
            );
        },

        secondRequestPendingNotification(admins, user) {
            return Promise.all(
                admins.map(admin => mailService.send(
                    'access_request/admin/request_pending_reminder_2',
                    admin,
                    user,
                    [user],
                    !mailService.PRESERVE_RECIPIENT,
                )),
            );
        },

        accessExpired(admin, user, submitDate) {
            return mailService.send(
                'access_request/admin/access_expired',
                admin,
                user,
                [user, submitDate],
                !mailService.PRESERVE_RECIPIENT,
            );
        },

        accessActivated(admin, user) {
            return mailService.send(
                'access_request/admin/access_activated',
                admin,
                user,
                [user],
                !mailService.PRESERVE_RECIPIENT,
            );
        },
    },

    toUser: {
        newRequestConfirmation(user) {
            return mailService.send(
                'access_request/user/access_request_confirmation',
                user,
                null,
                [user],
                mailService.PRESERVE_RECIPIENT,
            );
        },

        accessDenied(user, admin) {
            return mailService.send(
                'access_request/user/access_denied',
                user,
                admin,
                [user, admin],
                mailService.PRESERVE_RECIPIENT,
            );
        },

        accessGranted(user, admin, activationLink, expiracyDate) {
            return mailService.send(
                'access_request/user/access_granted',
                user,
                admin,
                [admin, activationLink, expiracyDate],
                mailService.PRESERVE_RECIPIENT,
            );
        },

        accessPending(user, admin, activationLink, expiracyDate) {
            return mailService.send(
                'access_request/user/access_pending',
                user,
                admin,
                [activationLink, expiracyDate],
                mailService.PRESERVE_RECIPIENT,
            );
        },

        accessExpired(user, admin, expiracyDate) {
            return mailService.send(
                'access_request/user/access_expired',
                user,
                admin,
                [expiracyDate],
                mailService.PRESERVE_RECIPIENT,
            );
        },
        accessActivated(user) {
            return mailService.send(
                'access_request/user/access_activated_welcome',
                user,
                null,
                [],
                mailService.PRESERVE_RECIPIENT,
            );
        },
    },
};
