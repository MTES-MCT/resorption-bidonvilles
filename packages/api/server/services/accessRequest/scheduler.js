const agenda = require('#server/loaders/agendaLoader')();

module.exports = {
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

        async accessExpired(accessId) {
            await agenda.schedule('in 8 days', 'access_is_expired', {
                accessId,
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
