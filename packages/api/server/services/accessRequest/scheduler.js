const agenda = require('#server/loaders/agendaLoader')();

module.exports = {
    scheduleEvent: {
        async accessRequestIsPending(userId) {
            await Promise.all([
                // 3 days
                agenda.schedule('in 30 seconds', 'access_request_pending_1st', {
                    userId,
                }),

                // 10 days
                agenda.schedule('in 1 minute', 'access_request_pending_2nd', {
                    userId,
                }),
            ]);
        },

        async accessPending(accessId) {
            // 5 days
            await agenda.schedule('in 30 seconds', 'access_is_pending', {
                accessId,
            });
        },

        async accessExpired(accessId) {
            // 8 days
            await agenda.schedule('in 1 minute', 'access_is_expired', {
                accessId,
            });
        },

        async accessActivatedOnboarding(user) {
            // 7 days
            await agenda.schedule('in 30 seconds', 'demo_invitation', {
                user,
            });
            // 14 days
            await agenda.schedule('in 30 seconds', 'idealco_invitation', {
                user,
            });
            // 30 days
            await agenda.schedule('in 30 seconds', 'user_features', {
                user,
            });
            // 60 days
            await agenda.schedule('in 30 seconds', 'user_share', {
                user,
            });
            // 90 days
            await agenda.schedule('in 30 seconds', 'user_review', {
                user,
            });
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
                attrs: {
                    accessId,
                },
            });
        },

        async accessExpired(accessId) {
            await agenda.cancel({
                name: 'access_is_expired',
                attrs: {
                    accessId,
                },
            });
        },
    },
};
