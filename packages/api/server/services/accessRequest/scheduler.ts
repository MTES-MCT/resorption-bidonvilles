import agendaFactory from '#server/loaders/agendaLoader';

const agenda = agendaFactory();

export default {
    scheduleEvent: {
        async accessRequestIsPending(userId) {
            await Promise.all([
                agenda.schedule('in 3 days', 'access_request_pending_1st', {
                    userId,
                }),

                agenda.schedule('in 10 days', 'access_request_pending_2nd', {
                    userId,
                }),
            ]);
        },

        async accessPending(accessId) {
            await agenda.schedule('in 5 days', 'access_is_pending', {
                accessId,
            });
        },

        async accessAboutToExpire(accessId, oneDayBeforeExpirationDate, hoursBeforeExpirationDate) {
            await agenda.schedule(oneDayBeforeExpirationDate, 'access_is_about_to_expire', {
                accessId,
                hoursBeforeExpirationDate,
            });
        },

        async accessExpired(accessId) {
            await agenda.schedule('in 8 days', 'access_is_expired', {
                accessId,
            });
        },

        async accessActivatedOnboarding(user) {
            await agenda.schedule('in 7 days', 'demo_invitation', {
                user,
            });
            await agenda.schedule('in 14 days', 'entraide_invitation', {
                user,
            });
            await agenda.schedule('in 30 days', 'user_features', {
                user,
            });
            await agenda.schedule('in 60 days', 'user_share', {
                user,
            });
            // Désactivation temporaire liée au [#2060](https://trello.com/c/agkYaQcx/2086-le-sondage-post-3-mois-nexiste-plus)
            // await agenda.schedule('in 90 days', 'user_review', {
            //     user,
            // });
        },
    },

    cancelEvent: {
        async accessRequestIsPending(userId) {
            await Promise.all([
                agenda.cancel({
                    name: 'access_request_pending_1st',
                    attrs: {
                        userId,
                    },
                }),

                agenda.cancel({
                    name: 'access_request_pending_2nd',
                    attrs: {
                        userId,
                    },
                }),
            ]);
        },

        async accessPending(accessId) {
            await agenda.cancel({
                name: 'access_is_pending',
                'data.accessId': accessId,
            });
        },

        async accessExpired(accessId) {
            await agenda.cancel({
                name: 'access_is_expired',
                'data.accessId': accessId,
            });
        },

        async accessAboutToExpire(accessId) {
            await agenda.cancel({
                name: 'access_is_about_to_expire',
                'data.accessId': accessId,
            });
        },
    },
};
